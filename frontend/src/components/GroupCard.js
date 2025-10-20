import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icons } from '../utils/svgIcons';

const GroupCard = ({ group, onSelect, onDelete }) => {
  const { user } = useAuth();
  const [copiedToClipboard, setCopiedToClipboard] = React.useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: group.currency || 'USD'
    }).format(amount);
  };

  const getCurrentUserRole = () => {
    if (!user || !group.members) return 'member';
    const member = group.members.find(m => m.user._id === user._id);
    return member?.role || 'member';
  };

  const isAdmin = getCurrentUserRole() === 'admin';
  const memberCount = group.members?.length || 0;
  const recentExpenses = group.expenses?.length || 0;

  const handleCopyJoinKey = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(group.joinKey);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (window.confirm(`Are you sure you want to delete "${group.name}"? This cannot be undone.`)) {
      try {
        await onDelete(group._id);
      } catch (error) {
        alert(error.message || 'Failed to delete group');
      }
    }
  };

  return (
    <div
      onClick={onSelect}
      className="group bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/30 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>

      <div className="relative z-10">
        {/* Group name and admin badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mr-3 group-hover:scale-110 transition-transform duration-300">
              <div className="w-6 h-6 text-white">
                {Icons.members}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-800 transition-colors duration-300">
                {group.name}
              </h3>
              {isAdmin && (
                <span className="inline-block px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded mt-1">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Admin Join Key Display */}
        {isAdmin && group.joinKey && (
          <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50">
            <p className="text-xs text-indigo-600 font-semibold mb-2">Share Join Key</p>
            <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-indigo-100">
              <span className="font-mono font-bold text-indigo-700 text-sm tracking-widest">
                {group.joinKey}
              </span>
              <button
                onClick={handleCopyJoinKey}
                className={`ml-2 px-3 py-1 rounded text-xs font-bold transition-all duration-200 ${
                  copiedToClipboard
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                {copiedToClipboard ? (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied
                  </div>
                ) : (
                  'Copy'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Description */}
        {group.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {group.description}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200/50">
            <p className="text-xs text-blue-600 font-semibold">Total Spent</p>
            <p className="text-lg font-black text-blue-800">
              {formatCurrency(group.totalExpenses || 0)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200/50">
            <p className="text-xs text-green-600 font-semibold">Members</p>
            <p className="text-lg font-black text-green-800">{memberCount}</p>
          </div>
        </div>

        {/* Recent expenses count */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 border border-gray-200/50">
          <p className="text-xs text-gray-600 font-semibold">Transactions</p>
          <p className="text-sm font-bold text-gray-800">{recentExpenses} total</p>
        </div>

        {/* Members Preview */}
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {group.members?.slice(0, 3).map((member) => (
                <div
                  key={member.user._id}
                  className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                  title={`${member.user.firstName} ${member.user.lastName}`}
                >
                  <span className="text-white text-xs font-bold">
                    {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                  </span>
                </div>
              ))}
              {memberCount > 3 && (
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-white text-xs font-bold">+{memberCount - 3}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">View details →</div>
          </div>
        </div>
      </div>

      {/* Delete button */}
      {isAdmin && onDelete && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button
            onClick={handleDelete}
            className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
            title="Delete Group"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupCard;