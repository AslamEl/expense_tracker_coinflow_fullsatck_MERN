import React, { useState, useEffect } from 'react';

const GroupCreatedModal = ({ group, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="modal-overlay bg-black/50 backdrop-blur-sm">
      <div className="modal-content bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 w-[95%] md:w-full max-w-lg relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -top-8 -right-8 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-lg"></div>

        <div className="relative z-10">
          {/* Success Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 animate-bounce">
              <span className="text-white text-2xl md:text-3xl">🎉</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Group Created Successfully!
            </h3>
            <p className="text-xs md:text-lg text-gray-600">
              Your group "<span className="font-bold text-gray-800">{group.name}</span>" is ready
            </p>
          </div>

          {/* Join Key Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-200/50 mb-4 md:mb-6">
            <div className="text-center">
              <h4 className="text-sm md:text-lg font-bold text-blue-800 mb-2 md:mb-3 flex items-center justify-center">
                <span className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 text-white text-xs">🔑</span>
                Share this Join Key
              </h4>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                <div className="text-2xl md:text-4xl font-bold font-mono text-blue-800 tracking-widest mb-2">
                  {group.joinKey}
                </div>
                <p className="text-xs md:text-sm text-blue-600">
                  Others can use this code to join your group
                </p>
              </div>
              
              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(group.joinKey)}
                className={`group relative px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-base transition-all duration-300 transform hover:scale-105 overflow-hidden w-full ${
                  copied 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center">
                  {copied ? (
                    <>
                      <svg className="w-4 md:w-5 h-4 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 md:w-5 h-4 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a1 1 0 011 1v3M9 7h4" />
                      </svg>
                      Copy Join Key
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Group Info */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-200/50 mb-4 md:mb-6">
            <h4 className="text-sm md:text-lg font-bold text-purple-800 mb-2 md:mb-3 flex items-center">
              <span className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-2 text-white text-xs">👥</span>
              Group Details
            </h4>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex flex-col md:flex-row md:justify-between gap-1">
                <span className="text-gray-600">Name:</span>
                <span className="font-semibold text-gray-800 break-words">{group.name}</span>
              </div>
              {group.description && (
                <div className="flex flex-col md:flex-row md:justify-between gap-1">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-semibold text-gray-800 text-right max-w-48 truncate">{group.description}</span>
                </div>
              )}
              <div className="flex flex-col md:flex-row md:justify-between gap-1">
                <span className="text-gray-600">Currency:</span>
                <span className="font-semibold text-gray-800">{group.currency}</span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between gap-1">
                <span className="text-gray-600">Created:</span>
                <span className="font-semibold text-gray-800">{new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-orange-200/50 mb-4 md:mb-6">
            <h4 className="text-sm md:text-lg font-bold text-orange-800 mb-2 md:mb-3 flex items-center">
              <span className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center mr-2 text-white text-xs">💡</span>
              How to Invite Members
            </h4>
            <div className="space-y-2 text-xs md:text-sm text-orange-700">
              <div className="flex items-start">
                <span className="font-bold mr-2 flex-shrink-0">1.</span>
                <span>Share the join key <strong>{group.joinKey}</strong> with friends</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold mr-2 flex-shrink-0">2.</span>
                <span>They can use the "Join Group" button to enter the code</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold mr-2 flex-shrink-0">3.</span>
                <span>Start adding and splitting expenses together!</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg md:rounded-2xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden w-full md:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-center">
                <span className="mr-2">👍</span>
                Got it, Thanks!
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCreatedModal;