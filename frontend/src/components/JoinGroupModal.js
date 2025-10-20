import React, { useState, useEffect } from 'react';

const JoinGroupModal = ({ onClose, onJoin }) => {
  const [joinKey, setJoinKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e) => {
    // Convert to uppercase and limit to 6 characters
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setJoinKey(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (joinKey.length !== 6) {
      alert('Please enter a valid 6-character join key');
      return;
    }

    setIsSubmitting(true);

    try {
      await onJoin(joinKey);
    } catch (error) {
      console.error('Error joining group:', error);
      alert(error.message || 'Failed to join group. Please check the join key and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6 w-[90%] sm:w-full max-w-xs md:max-w-md relative overflow-hidden animate-scaleIn max-h-[90vh] overflow-y-auto m-auto">
        {/* Background decorations */}
        <div className="absolute -top-8 -right-8 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 rounded-full blur-lg"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 md:top-4 right-3 md:right-4 z-50 w-8 md:w-10 h-8 md:h-10 bg-white hover:bg-red-50 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-red-300"
          type="button"
        >
          <svg className="w-4 md:w-5 h-4 md:h-5 text-gray-700 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-4 md:mb-6">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <span className="text-white text-lg md:text-xl">🔗</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-1">
              Join Group
            </h3>
            <p className="text-gray-600 text-xs md:text-sm">
              Enter the 6-character key
            </p>
          </div>

          {/* Join Key Input Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-blue-200/50 mb-3 md:mb-4">
            <div className="text-center">
              <h4 className="text-xs md:text-sm font-bold text-blue-800 mb-2 md:mb-3 flex items-center justify-center">
                <span className="w-4 md:w-5 h-4 md:h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center mr-2 text-white text-xs">🔑</span>
                Group Join Key
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 md:p-3 mb-2 md:mb-3">
                  <input
                    type="text"
                    id="joinKey"
                    value={joinKey}
                    onChange={handleChange}
                    placeholder="ABC123"
                    className="w-full text-center text-xl md:text-2xl font-bold font-mono tracking-widest text-blue-800 bg-transparent border-none focus:outline-none"
                    required
                    maxLength={6}
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    {joinKey.length}/6 characters
                  </p>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || joinKey.length !== 6}
                  className={`w-full group relative px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 overflow-hidden text-xs md:text-sm ${
                    isSubmitting || joinKey.length !== 6
                      ? 'bg-gray-400/80 cursor-not-allowed text-white' 
                      : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 0 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">Joining...</span>
                      </>
                    ) : (
                      <>
                        <span className="mr-1 md:mr-2">🚀</span>
                        <span className="hidden sm:inline">Join Group</span>
                        <span className="sm:hidden">Join</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>

          {/* How to Join Instructions */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-orange-200/50 mb-3 md:mb-4">
            <h4 className="text-xs md:text-sm font-bold text-orange-800 mb-2 flex items-center">
              <span className="w-4 h-4 bg-gradient-to-br from-orange-500 to-yellow-600 rounded flex items-center justify-center mr-2 text-white text-xs">💡</span>
              How to Join
            </h4>
            <div className="space-y-1 text-xs text-orange-700">
              <div className="flex items-start">
                <span className="font-bold mr-1">•</span>
                <span>Ask creator for join key</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold mr-1">•</span>
                <span>Enter 6-character code</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold mr-1">•</span>
                <span>Start splitting!</span>
              </div>
            </div>
          </div>

          {/* Example Key */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200/50">
            <div className="text-center">
              <h4 className="text-xs md:text-sm font-bold text-gray-800 mb-2 flex items-center justify-center">
                <span className="w-4 h-4 bg-gradient-to-br from-gray-500 to-gray-600 rounded flex items-center justify-center mr-2 text-white text-xs">📝</span>
                Example Format
              </h4>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 md:p-3">
                <span className="font-mono font-bold text-base md:text-lg text-gray-800 tracking-widest">
                  XY7K9M
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Letters & numbers only
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupModal;