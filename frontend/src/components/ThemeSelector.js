import React, { useState } from 'react';

const ThemeSelector = ({ onThemeSelect, onSkip }) => {
  const [selectedTheme, setSelectedTheme] = useState('default');

  const themes = [
    {
      id: 'default',
      name: 'Ocean Blue',
      description: 'Calm and professional with blue gradients',
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      preview: {
        primary: 'bg-blue-500',
        secondary: 'bg-blue-100',
        accent: 'bg-blue-600'
      }
    },
    {
      id: 'emerald',
      name: 'Emerald Green',
      description: 'Fresh and vibrant with green tones',
      gradient: 'from-green-400 via-emerald-500 to-green-600',
      preview: {
        primary: 'bg-emerald-500',
        secondary: 'bg-emerald-100',
        accent: 'bg-emerald-600'
      }
    },
    {
      id: 'purple',
      name: 'Royal Purple',
      description: 'Elegant and modern with purple shades',
      gradient: 'from-purple-400 via-purple-500 to-purple-600',
      preview: {
        primary: 'bg-purple-500',
        secondary: 'bg-purple-100',
        accent: 'bg-purple-600'
      }
    },
    {
      id: 'orange',
      name: 'Sunset Orange',
      description: 'Warm and energetic with orange hues',
      gradient: 'from-orange-400 via-orange-500 to-red-500',
      preview: {
        primary: 'bg-orange-500',
        secondary: 'bg-orange-100',
        accent: 'bg-red-500'
      }
    },
    {
      id: 'teal',
      name: 'Teal Breeze',
      description: 'Modern and refreshing with teal colors',
      gradient: 'from-teal-400 via-cyan-500 to-teal-600',
      preview: {
        primary: 'bg-teal-500',
        secondary: 'bg-teal-100',
        accent: 'bg-cyan-500'
      }
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Sleek dark theme for night owls',
      gradient: 'from-gray-700 via-gray-800 to-gray-900',
      preview: {
        primary: 'bg-gray-800',
        secondary: 'bg-gray-700',
        accent: 'bg-gray-600'
      }
    }
  ];

  const handleContinue = () => {
    onThemeSelect(selectedTheme);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-4xl w-full p-8 border border-gray-200 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">�</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">CoinFlow</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Theme</h1>
          <p className="text-gray-600">
            Select a color scheme that matches your style. You can change this later in settings.
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-105 ${
                selectedTheme === theme.id
                  ? 'ring-4 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
            >
              {/* Theme Preview */}
              <div className={`h-32 bg-gradient-to-br ${theme.gradient} p-4 flex items-end`}>
                <div className="flex space-x-2">
                  <div className={`w-3 h-3 rounded-full ${theme.preview.primary}`}></div>
                  <div className={`w-3 h-3 rounded-full ${theme.preview.secondary}`}></div>
                  <div className={`w-3 h-3 rounded-full ${theme.preview.accent}`}></div>
                </div>
              </div>
              
              {/* Theme Info */}
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{theme.name}</h3>
                  {selectedTheme === theme.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Theme Preview */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Preview: {themes.find(t => t.id === selectedTheme)?.name}</h3>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r ${themes.find(t => t.id === selectedTheme)?.gradient}`}>
              Sample Button
            </div>
            <div className={`px-3 py-1 rounded text-sm ${themes.find(t => t.id === selectedTheme)?.preview.secondary} text-gray-700`}>
              Sample Tag
            </div>
            <div className={`w-8 h-8 rounded-full ${themes.find(t => t.id === selectedTheme)?.preview.primary}`}></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Skip for now
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={handleContinue}
              className={`px-8 py-3 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 bg-gradient-to-r ${themes.find(t => t.id === selectedTheme)?.gradient}`}
            >
              Continue with {themes.find(t => t.id === selectedTheme)?.name}
            </button>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;