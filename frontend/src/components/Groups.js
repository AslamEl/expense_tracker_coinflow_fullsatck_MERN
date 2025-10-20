import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import CreateGroupModal from './CreateGroupModal';
import { Icons } from '../utils/svgIcons';
import JoinGroupModal from './JoinGroupModal';
import GroupCard from './GroupCard';
import GroupDetails from './GroupDetailsNew';
import GroupCreatedModal from './GroupCreatedModal';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showGroupCreatedModal, setShowGroupCreatedModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [createdGroup, setCreatedGroup] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchGroups();
  }, [refreshKey]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/groups');
      // Handle both old format (array) and new format ({ success, data: array })
      const groupsData = Array.isArray(response.data)
        ? response.data
        : (response.data?.data || []);
      setGroups(groupsData);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups. Please try again.');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      const response = await axios.post('/api/groups', groupData);
      // Handle both old format (object) and new format ({ success, data: object })
      const createdGroupData = response.data?.data || response.data;
      setCreatedGroup(createdGroupData);
      setShowCreateModal(false);
      setShowGroupCreatedModal(true);
      setRefreshKey(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error creating group:', error);
      throw new Error(error.response?.data?.message || 'Failed to create group');
    }
  };

  const handleJoinGroup = async (joinKey) => {
    try {
      await axios.post('/api/groups/join', { joinKey });
      setShowJoinModal(false);
      setRefreshKey(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error joining group:', error);
      throw new Error(error.response?.data?.message || 'Failed to join group');
    }
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
    setRefreshKey(prev => prev + 1); // Refresh groups list
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`/api/groups/${groupId}`);
      setGroups(prevGroups => prevGroups.filter(g => g._id !== groupId));
    } catch (error) {
      console.error('Error deleting group:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete group');
    }
  };

  // Show group details if selected
  if (selectedGroup) {
    return (
      <GroupDetails
        group={selectedGroup}
        onBack={handleBackToGroups}
      />
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
      {/* Glassmorphism background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-6 -right-6 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-lg"></div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-3 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
              <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-pink-900 bg-clip-text text-transparent">
                Groups
              </h2>
              <p className="text-xs md:text-base text-gray-600 font-medium">Shared expenses</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={() => setShowJoinModal(true)}
              className="group relative px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg md:rounded-2xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden whitespace-nowrap"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center">
                <svg className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="hidden sm:inline">Join</span>
              </div>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="group relative px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg md:rounded-2xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden whitespace-nowrap"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center">
                <svg className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                <span className="hidden sm:inline">Create</span>
              </div>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6 flex items-center justify-between text-sm md:text-base">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-5 h-5 text-red-400">
                {Icons.warning}
              </div>
              <p className="ml-2 md:ml-3 text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 w-5 h-5 flex items-center justify-center"
            >
              {Icons.close}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12 md:py-16">
            <div className="w-12 md:w-16 h-12 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
            <p className="text-sm md:text-base text-gray-600 font-medium">Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 md:py-16">
            <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-white">
              <div className="w-8 md:w-12 h-8 md:h-12">{Icons.members}</div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">No Groups</h3>
            <p className="text-xs md:text-base text-gray-600 mb-6 md:mb-8 max-w-md mx-auto px-2 md:px-0">
              Create or join a group to start splitting expenses.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 md:px-8 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg md:rounded-2xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Create Group
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-4 md:px-8 py-2 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg md:rounded-2xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Join Group
              </button>
            </div>
          </div>
        ) : (
          /* Groups Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {groups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                onSelect={() => handleSelectGroup(group)}
                onDelete={handleDeleteGroup}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && createPortal(
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateGroup}
        />,
        document.body
      )}

      {showJoinModal && createPortal(
        <JoinGroupModal
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinGroup}
        />,
        document.body
      )}

      {showGroupCreatedModal && createdGroup && createPortal(
        <GroupCreatedModal
          group={createdGroup}
          onClose={() => {
            setShowGroupCreatedModal(false);
            setCreatedGroup(null);
          }}
        />,
        document.body
      )}
    </div>
  );
};

export default Groups;