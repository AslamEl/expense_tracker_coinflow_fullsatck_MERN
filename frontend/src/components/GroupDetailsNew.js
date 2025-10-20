import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Icons } from '../utils/svgIcons';
import AddGroupExpenseModal from './AddGroupExpenseModal';
import LoadingSpinner from './LoadingSpinner';
import { generateGroupPDF } from '../utils/generateGroupPDF';

const GroupDetails = ({ group: initialGroup, onBack }) => {
  const { user: currentUser } = useAuth();
  const [group, setGroup] = useState(initialGroup);
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Fetch data when component mounts and when group._id changes
  useEffect(() => {
    if (group._id) {
      fetchGroupData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group._id]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch full group details with settlement data
      const [groupRes, balancesRes, settlementsRes] = await Promise.all([
        axios.get(`/api/groups/${group._id}`),
        axios.get(`/api/groups/${group._id}/balances`),
        axios.get(`/api/groups/${group._id}/settlement`)
      ]);

      setGroup(groupRes.data.data);
      setBalances(balancesRes.data.data.balances || []);
      setSettlements(settlementsRes.data.data.settlements || []);
    } catch (err) {
      console.error('Error fetching group data:', err);
      setError(err.response?.data?.message || 'Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  const isCurrentUserAdmin = () => {
    if (!currentUser || !group.members) return false;
    const member = group.members.find(m => 
      m.user._id === currentUser._id || m.user === currentUser._id
    );
    return member?.role === 'admin';
  };

  const handleCopyJoinKey = () => {
    navigator.clipboard.writeText(group.joinKey);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleConfirmPaymentReceived = async (debtorUserId) => {
    if (!window.confirm('Confirm that you have received this payment?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/api/groups/${group._id}/mark-settlement`, {
        debtorUserId,
        creditorUserId: currentUser._id
      });

      // Update ALL state with the new data from the server
      setGroup(response.data.data.group);
      setBalances(response.data.data.balances || []);
      setSettlements(response.data.data.settlementPlan || []);
      setError(null);
      alert('Payment confirmed! Settlement completed.');
    } catch (err) {
      console.error('Error confirming payment:', err);
      setError(err.response?.data?.message || 'Failed to confirm payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDisputePayment = async (debtorUserId) => {
    if (!window.confirm('Are you sure you want to dispute this payment? This will reset it to unpaid status.')) {
      return;
    }

    try {
      setLoading(true);
      // Reset the payment status back to unpaid
      const response = await axios.post(`/api/groups/${group._id}/dispute-payment`, {
        debtorUserId,
        creditorUserId: currentUser._id
      });

      // Update ALL state with the new data from the server
      setGroup(response.data.data.group);
      setBalances(response.data.data.balances || []);
      setSettlements(response.data.data.settlementPlan || []);
      setError(null);
      alert('Payment disputed and reset to unpaid status. The debtor can submit payment again.');
    } catch (err) {
      console.error('Error disputing payment:', err);
      setError(err.response?.data?.message || 'Failed to dispute payment');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const response = await axios.post(`/api/groups/${group._id}/expenses`, {
        ...expenseData,
        paidBy: expenseData.paidBy,
        splitAmong: expenseData.splitAmong
      });

      setGroup(response.data.data.group);
      setBalances(response.data.data.balances || []);
      setShowAddExpenseModal(false);
      
      // Refresh settlement data
      const settlementsRes = await axios.get(`/api/groups/${group._id}/settlement`);
      setSettlements(settlementsRes.data.data.settlements || []);
    } catch (err) {
      console.error('Error adding expense:', err);
      throw new Error(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/groups/${group._id}/expenses/${expenseId}`);
      setGroup(response.data.data);

      // Refresh balances and settlements
      await fetchGroupData();
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/groups/${group._id}/members/${memberId}`);
      setGroup(response.data.data);
      await fetchGroupData();
    } catch (err) {
      console.error('Error removing member:', err);
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleMarkSettlementReceived = async (balance) => {
    if (balance.netBalance >= 0) {
      setError('You can only mark payments as paid when you owe money');
      return;
    }

    if (!currentUser) {
      setError('User not authenticated');
      return;
    }

    if (balance.userId !== currentUser._id) {
      setError('You can only mark payment for yourself');
      return;
    }
    
    // Find all creditors (people this user owes to) from settlements
    const creditors = settlements
      .filter(s => s.from.userId === currentUser._id)
      .map(s => s.to);

    if (creditors.length === 0) {
      setError('No outstanding settlements found');
      return;
    }

    // Get list of creditor names for confirmation
    const creditorNames = creditors
      .map(c => typeof c.user === 'object' ? `${c.user.firstName} ${c.user.lastName}` : 'Unknown')
      .join(', ');

    if (!window.confirm(
      `Mark ${group.currency} ${Math.abs(balance.netBalance).toFixed(2)} as paid? This will notify ${creditorNames} to confirm.`
    )) {
      return;
    }

    try {
      setLoading(true);
      
      // STEP 1: Mark as payment sent for each creditor
      for (const creditor of creditors) {
        const response = await axios.post(`/api/groups/${group._id}/mark-payment-sent`, {
          debtorUserId: currentUser._id,
          creditorUserId: creditor.userId
        });

        // Update ALL state with the new data from the server
        setGroup(response.data.data.group);
        setBalances(response.data.data.balances || []);
        setSettlements(response.data.data.settlementPlan || []);
      }
      
      setError(null);
      // Show success message
      alert('Payment marked as sent! Waiting for creditor confirmation.');
    } catch (err) {
      console.error('Error marking payment as sent:', err);
      setError(err.response?.data?.message || 'Failed to mark payment as sent');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/groups/${group._id}`);
      
      // Close confirmation modal first
      setShowDeleteConfirm(false);
      
      // Show success message and navigate back
      window.showGroups();
    } catch (err) {
      console.error('Error deleting group:', err);
      setError(err.response?.data?.message || 'Failed to delete group');
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      // Try backend PDF generation first (recommended for better formatting)
      const response = await axios.get(`/api/groups/${group._id}/pdf`, {
        responseType: 'blob'
      });

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${group.name}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF from backend, trying client-side:', err);
      // Fallback to client-side generation
      try {
        generateGroupPDF(group, balances, settlements, group.currency);
      } catch (clientErr) {
        console.error('Error generating PDF:', clientErr);
        setError('Failed to generate PDF');
      }
    }
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBalanceEmoji = (balance) => {
    if (balance > 0) return Icons.money;
    if (balance < 0) return Icons.creditCard;
    return Icons.checkmark;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-6 -right-6 w-16 md:w-32 h-16 md:h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>

      <div className="relative z-10">
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="flex items-start gap-3 md:gap-4">
            <button
              onClick={onBack}
              className="mt-1 w-8 md:w-10 h-8 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 text-sm md:text-base"
            >
              ←
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {group.name}
              </h1>
              <p className="text-gray-600 text-xs md:text-sm">
                {group.members?.length || 0} members • {group.expenses?.length || 0} expenses
              </p>
              {/* Admin Join Key Display */}
              {isCurrentUserAdmin() && group.joinKey && (
                <div className="mt-2 md:mt-3 p-2 md:p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200/50 inline-flex items-center gap-2 md:gap-3">
                  <span className="text-xs text-indigo-600 font-semibold hidden sm:inline">Share Key:</span>
                  <span className="font-mono font-bold text-indigo-700 text-xs md:text-sm tracking-widest">
                    {group.joinKey}
                  </span>
                  <button
                    onClick={handleCopyJoinKey}
                    className={`px-2 md:px-3 py-1 rounded text-xs font-bold transition-all duration-200 ${
                      copiedToClipboard
                        ? 'bg-green-500 text-white'
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    {copiedToClipboard ? '✓' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 md:gap-2">
            <button
              onClick={fetchGroupData}
              disabled={loading}
              className="flex items-center justify-center gap-1 px-2 md:px-3 py-1 md:py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg md:rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh data from database"
            >
              <svg className="w-4 md:w-5 h-4 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline text-xs">Refresh</span>
            </button>
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="flex items-center justify-center gap-1 px-2 md:px-3 py-1 md:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg md:rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105"
              title="Add new expense"
            >
              <svg className="w-4 md:w-5 h-4 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <span className="hidden sm:inline text-xs">Add Expense</span>
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={loading}
              className="flex items-center justify-center gap-1 px-2 md:px-3 py-1 md:py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg md:rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download group report as PDF"
            >
              <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline text-xs">PDF</span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-1 px-2 md:px-3 py-1 md:py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg md:rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105"
              title="Delete this group"
            >
              <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline text-xs">Delete</span>
            </button>
          </div>
        </div>

        {/* Member Avatars */}
        {group.members && group.members.length > 0 && (
          <div className="mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <div className="flex gap-1 md:gap-2">
              {group.members.slice(0, 4).map((member) => (
                <div
                  key={member.user._id}
                  className="w-10 md:w-12 h-10 md:h-12 rounded-full flex items-center justify-center border-2 border-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 text-white text-xs md:text-sm font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${['#6366f1', '#d946ef', '#22c55e', '#f43f5e'][group.members.indexOf(member) % 4]}, ${['#4f46e5', '#c026d3', '#16a34a', '#e11d48'][group.members.indexOf(member) % 4]})`
                  }}
                  title={`${member.user.firstName} ${member.user.lastName}`}
                >
                  {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                </div>
              ))}
              {group.members.length > 4 && (
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xs md:text-sm font-bold">
                  +{group.members.length - 4}
                </div>
              )}
            </div>
            <span className="text-xs md:text-sm text-gray-600 font-medium">
              {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6 flex items-center justify-between text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              <p className="text-red-700">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400">✕</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto">
          {['expenses', 'balances', 'settlement', 'members'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 md:pb-4 px-3 md:px-6 font-bold text-xs md:text-base transition-colors capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Sections */}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div>
            {group.expenses && group.expenses.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {[...group.expenses].reverse().map((expense) => {
                  const paidByUser = expense.paidBy;
                  const paidByName = typeof paidByUser === 'object'
                    ? `${paidByUser.firstName} ${paidByUser.lastName}`
                    : 'Unknown';

                  return (
                    <div
                      key={expense._id}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg md:rounded-2xl p-3 md:p-6 border border-gray-200 hover:border-purple-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 md:gap-3 mb-3 md:mb-3">
                        <div>
                          <h3 className="font-bold text-sm md:text-base text-gray-800">{expense.description}</h3>
                          <p className="text-xs md:text-sm text-gray-600">
                            Paid by <span className="font-semibold">{paidByName}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg md:text-2xl font-black text-purple-600">
                            {group.currency} {expense.amount.toFixed(2)}
                          </p>
                          <span className="inline-block px-2 md:px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                            {expense.splitMethod}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                        <p className="text-xs text-gray-600 mb-2 md:mb-3 font-semibold">Split among:</p>
                        <div className="space-y-1 md:space-y-2">
                          {expense.splitAmong.map((split, idx) => {
                            const userName = typeof split.user === 'object'
                              ? `${split.user.firstName} ${split.user.lastName}`
                              : 'Unknown';
                            return (
                              <div key={idx} className="flex justify-between items-center text-xs md:text-sm">
                                <span className="text-gray-700">{userName}</span>
                                <span className="font-semibold text-gray-900">
                                  {group.currency} {split.amount.toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => handleDeleteExpense(expense._id)}
                          className="text-red-500 hover:text-red-700 text-xs md:text-sm font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-600 text-sm md:text-base">No expenses yet. Add one to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Balances Tab */}
        {activeTab === 'balances' && (
          <div className="space-y-3 md:space-y-4">
            {balances.length > 0 ? (
              balances.map((balance) => {
                const userName = typeof balance.user === 'object'
                  ? `${balance.user.firstName} ${balance.user.lastName}`
                  : 'Unknown';

                return (
                  <div
                    key={balance.userId}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg md:rounded-2xl p-3 md:p-6 border border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 md:gap-4 mb-3 md:mb-4">
                      <div className="flex items-start gap-2 md:gap-4">
                        <div className="w-6 md:w-8 h-6 md:h-8 flex-shrink-0 text-gray-700">{getBalanceEmoji(balance.netBalance)}</div>
                        <div>
                          <h3 className="font-bold text-sm md:text-base text-gray-800">{userName}</h3>
                          <p className="text-xs md:text-sm text-gray-600">
                            {balance.netBalance > 0
                              ? `is owed ${group.currency} ${Math.abs(balance.netBalance).toFixed(2)}`
                              : balance.netBalance < 0
                              ? `owes ${group.currency} ${Math.abs(balance.netBalance).toFixed(2)}`
                              : 'is settled'}
                          </p>
                        </div>
                      </div>
                      <p className={`text-xl md:text-3xl font-black ${getBalanceColor(balance.netBalance)} text-right sm:text-left`}>
                        {balance.netBalance > 0 ? '+' : ''}{balance.netBalance.toFixed(2)}
                      </p>
                    </div>

                    {/* Show "I Paid" button only if CURRENT USER owes money AND hasn't already marked as pending */}
                    {(() => {
                      const userIdMatch = String(balance.userId) === String(currentUser._id);
                      const owesMoneyCheck = balance.netBalance < 0;
                      
                      // Check if user has any pending or paid payments as debtor
                      const hasPendingPayment = group.expenses?.some(expense => 
                        expense.splitAmong.some(split => 
                          split.user._id === currentUser._id && 
                          (split.paymentStatus === 'pending_confirmation' || split.paymentStatus === 'paid')
                        )
                      );
                      
                      console.log(`Balance for ${balance.user?.firstName}: userId=${balance.userId}, currentUserId=${currentUser._id}, match=${userIdMatch}, owesMoneyCheck=${owesMoneyCheck}, hasPending=${hasPendingPayment}`);
                      return userIdMatch && owesMoneyCheck && !hasPendingPayment;
                    })() && (
                      <button
                        onClick={() => handleMarkSettlementReceived(balance)}
                        disabled={loading}
                        className="w-full px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg md:rounded-xl font-bold text-xs md:text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Click here if you paid {group.currency} {Math.abs(balance.netBalance).toFixed(2)}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No balance data available</p>
              </div>
            )}
          </div>
        )}

        {/* Settlement Plan Tab */}
        {activeTab === 'settlement' && (
          <div className="space-y-4">
            {/* Find pending payments - splits with paymentStatus === 'pending_confirmation' */}
            {group.expenses && group.expenses.some(exp => 
              exp.splitAmong.some(split => split.paymentStatus === 'pending_confirmation')
            ) && (
              <div>
                <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-2 text-sm">⏳</span>
                  Pending Payment Confirmations
                </h3>
                <div className="space-y-3">
                  {group.expenses.map((expense) => {
                    const pendingSplits = expense.splitAmong.filter(
                      split => split.paymentStatus === 'pending_confirmation'
                    );
                    
                    if (pendingSplits.length === 0) return null;
                    
                    return pendingSplits.map((split, idx) => {
                      const debtorName = typeof split.user === 'object'
                        ? `${split.user.firstName} ${split.user.lastName}`
                        : 'Unknown';
                      const creditorName = typeof expense.paidBy === 'object'
                        ? `${expense.paidBy.firstName} ${expense.paidBy.lastName}`
                        : 'Unknown';
                      const isCurrentUserCreditor = String(expense.paidBy._id) === String(currentUser._id);

                      return (
                        <div
                          key={`${expense._id}-${idx}`}
                          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg md:rounded-2xl p-3 md:p-4 border-2 border-orange-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 mb-3">
                            <div className="flex-1">
                              <p className="font-bold text-sm md:text-base text-gray-800">{debtorName}</p>
                              <p className="text-xs md:text-sm text-gray-600">claims they paid</p>
                            </div>
                            <div className="text-center sm:text-center">
                              <p className="text-lg md:text-2xl font-black text-orange-600">
                                {group.currency} {split.amount.toFixed(2)}
                              </p>
                              <p className="text-xs text-orange-500 font-semibold mt-0.5 md:mt-1">AWAITING CONFIRMATION</p>
                            </div>
                            <div className="flex-1 text-right sm:text-right">
                              <p className="font-bold text-sm md:text-base text-gray-800">{creditorName}</p>
                              <p className="text-xs md:text-sm text-gray-600">to receive</p>
                            </div>
                          </div>
                          
                          {/* Confirmation button - only show to creditor */}
                          {isCurrentUserCreditor && (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => handleConfirmPaymentReceived(split.user._id)}
                                disabled={loading}
                                className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold text-xs md:text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Confirm Received
                              </button>
                              <button
                                onClick={() => handleDisputePayment(split.user._id)}
                                disabled={loading}
                                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs md:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Dispute
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
            )}

            {/* Regular settlements */}
            {settlements.length > 0 && (
              <div>
                {group.expenses && group.expenses.some(exp => 
                  exp.splitAmong.some(split => split.paymentStatus === 'pending_confirmation')
                ) && (
                  <h3 className="text-base md:text-lg font-bold text-indigo-800 mb-3 md:mb-4 mt-6 flex items-center">
                    <div className="w-6 md:w-8 h-6 md:h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-2 text-xs md:text-sm">{Icons.money}</div>
                    Settlement Plan
                  </h3>
                )}
                <div className="space-y-2 md:space-y-3">
                  {settlements.map((settlement, idx) => {
                    const fromName = typeof settlement.from.user === 'object'
                      ? `${settlement.from.user.firstName} ${settlement.from.user.lastName}`
                      : 'Unknown';
                    const toName = typeof settlement.to.user === 'object'
                      ? `${settlement.to.user.firstName} ${settlement.to.user.lastName}`
                      : 'Unknown';

                    return (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg md:rounded-2xl p-3 md:p-4 border border-blue-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-sm md:text-base text-gray-800">{fromName}</p>
                            <p className="text-xs md:text-sm text-gray-600">pays</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg md:text-2xl font-black text-indigo-600">
                              {group.currency} {settlement.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 md:mt-1">→</p>
                          </div>
                          <div className="flex-1 text-right sm:text-right">
                            <p className="font-bold text-sm md:text-base text-gray-800">{toName}</p>
                            <p className="text-xs md:text-sm text-gray-600">receives</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {settlements.length === 0 && !group.expenses?.some(exp => 
              exp.splitAmong.some(split => split.paymentStatus === 'pending_confirmation')
            ) && (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-600 mb-2 text-sm md:text-base flex items-center justify-center"><div className="w-5 h-5 mr-2">{Icons.checkmark}</div>All balances are settled!</p>
                <p className="text-xs md:text-sm text-gray-500">No transactions needed</p>
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-2 md:space-y-4">
            {group.members && group.members.length > 0 ? (
              group.members.map((member) => {
                const userName = typeof member.user === 'object'
                  ? `${member.user.firstName} ${member.user.lastName}`
                  : 'Unknown';

                return (
                  <div
                    key={member.user._id || member.user}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg md:rounded-2xl p-3 md:p-6 border border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4">
                      <div>
                        <h3 className="font-bold text-sm md:text-base text-gray-800">{userName}</h3>
                        <p className="text-xs md:text-sm text-gray-600 capitalize">
                          {member.role} • Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {member.role !== 'admin' && (
                        <button
                          onClick={() => handleRemoveMember(member.user._id || member.user)}
                          className="text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 text-red-500 hover:text-red-700 font-bold transition-colors hover:bg-red-50 rounded-lg md:rounded-lg"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-600 text-sm md:text-base">No members</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && createPortal(
        <AddGroupExpenseModal
          group={group}
          onClose={() => setShowAddExpenseModal(false)}
          onSubmit={handleAddExpense}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-md w-full p-4 md:p-8 animate-in zoom-in duration-300">
            <div className="text-center mb-4 md:mb-6">
              <div className="w-14 md:w-16 h-14 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl">⚠️</span>
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">Delete Group?</h2>
              <p className="text-xs md:text-sm text-gray-600">
                This action cannot be undone. All expenses, balances, and group data will be permanently deleted.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6">
              <p className="text-xs md:text-sm text-red-700 font-semibold">
                {group.expenses?.length || 0} expenses will be deleted
              </p>
              <p className="text-xs md:text-sm text-red-700 font-semibold mt-2">
                {group.members?.length || 0} members will be removed
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-gray-200 text-gray-800 rounded-lg md:rounded-xl font-bold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                disabled={loading}
                className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg md:rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin inline -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 0 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Group'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default GroupDetails;
