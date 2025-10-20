import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/30 w-[95%] md:w-full max-w-xs md:max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Modal Header */}
        <div className="flex items-center justify-center relative p-4 md:p-6 border-b border-white/20">
          <h2 className="text-lg md:text-2xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 md:right-6 w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 md:w-5 h-4 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;