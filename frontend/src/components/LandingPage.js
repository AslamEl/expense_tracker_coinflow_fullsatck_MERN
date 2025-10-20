import React, { useState } from 'react';

const LandingPage = ({ onGetStarted }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      content: "Spendwise has completely transformed how I manage my finances. The AI insights help me make smarter spending decisions every day.",
      avatar: "👩‍💼"
    },
    {
      name: "Mike Chen",
      role: "Software Engineer", 
      content: "The analytics dashboard is amazing! I can finally see where my money goes and set realistic budgets that actually work.",
      avatar: "👨‍💻"
    },
    {
      name: "Emily Rodriguez",
      role: "Student",
      content: "As a student on a tight budget, Spendwise helps me track every penny. The daily tracking feature keeps me accountable.",
      avatar: "👩‍🎓"
    }
  ];

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms analyze your spending patterns and provide personalized financial recommendations.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: "⚡",
      title: "Real-time Analytics", 
      description: "Live dashboard with interactive charts, spending trends, and predictive insights to optimize your financial decisions.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: "🎯",
      title: "Smart Goal Tracking",
      description: "Set intelligent financial goals with milestone tracking, progress visualization, and achievement rewards.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "🔐",
      title: "Bank-Level Security",
      description: "Enterprise-grade encryption, biometric authentication, and secure cloud infrastructure protect your data.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: "📱",
      title: "Cross-Platform Sync",
      description: "Seamless synchronization across all devices with offline capability and automatic backup.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: "✨",
      title: "Premium Experience",
      description: "Beautiful, intuitive interface with customizable themes, dark mode, and accessibility features.",
      gradient: "from-violet-500 to-purple-500"
    }
  ];

  const faqs = [
    {
      question: "Is Spendwise free to use?",
      answer: "Yes! Spendwise offers a comprehensive free plan that includes expense tracking, basic analytics, and budget management. Premium features are available for advanced users."
    },
    {
      question: "How secure is my financial data?",
      answer: "We use bank-level encryption and security measures to protect your data. We never store your bank credentials, and all data is encrypted both in transit and at rest."
    },
    {
      question: "Can I connect my bank accounts?",
      answer: "Currently, Spendwise focuses on manual expense entry to give you full control over your data. We're working on secure bank integration for future releases."
    },
    {
      question: "Does Spendwise work on mobile devices?",
      answer: "Absolutely! Spendwise is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile phones."
    },
    {
      question: "What makes the AI insights special?",
      answer: "Our AI analyzes your spending patterns to provide personalized recommendations, predict future expenses, and help you identify opportunities to save money."
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative">
      {/* Advanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div className="w-7 md:w-8 h-7 md:h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-lg">💎</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-800">CoinFlow</span>
          </div>
          
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <a href="#features" className="text-xs md:text-base text-gray-600 hover:text-gray-800 transition-colors">Features</a>
            <a href="#testimonials" className="text-xs md:text-base text-gray-600 hover:text-gray-800 transition-colors">Testimonials</a>
            <a href="#faq" className="text-xs md:text-base text-gray-600 hover:text-gray-800 transition-colors">FAQ</a>
            <a href="#developer" className="text-xs md:text-base text-gray-600 hover:text-gray-800 transition-colors">Developer</a>
          </nav>

          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-xs md:text-base"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-3 md:px-4 py-8 md:py-16 text-center relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 mb-6 md:mb-8">
          <div className="mb-4 md:mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
              <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full mr-1.5 md:mr-2 animate-pulse"></span>
              Smart Financial Management
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-3 md:mb-6 leading-tight">
            Master Your{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              CoinFlow
            </span>
          </h1>
          
          <p className="text-base md:text-2xl text-gray-600 mb-4 md:mb-6 max-w-3xl mx-auto font-light">
            Transform your financial habits with AI-powered insights
          </p>
          <p className="text-sm md:text-xl text-gray-500 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
            CoinFlow empowers you to make smarter financial decisions through intelligent expense tracking, 
            personalized budgeting, and predictive analytics that help you achieve your financial goals faster.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6 mb-8 md:mb-12">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-flex items-center justify-center space-x-2 group"
            >
              <span>Start Your Journey</span>
              <span className="group-hover:translate-x-1 transition-transform hidden sm:inline">→</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm md:text-base">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-white shadow-lg rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span className="hidden sm:inline">Watch Demo</span>
              <span className="sm:hidden">Demo</span>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-8 text-xs md:text-sm text-gray-500 flex-wrap">
            <div className="flex items-center space-x-1 md:space-x-2">
              <svg className="w-4 md:w-5 h-4 md:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Free Forever</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <svg className="w-4 md:w-5 h-4 md:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <svg className="w-4 md:w-5 h-4 md:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Setup in 2 Minutes</span>
            </div>
          </div>
        </div>
        
        {/* Hero Dashboard Mockup */}
        <div className="mt-8 md:mt-16 relative">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 max-w-5xl mx-auto border border-gray-100">
            {/* Dashboard Header Mockup */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-white gap-3 md:gap-0">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-base md:text-xl flex-shrink-0">
                    <span>💎</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg">CoinFlow Dashboard</h3>
                    <p className="text-indigo-200 text-xs md:text-sm">Welcome back, User!</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm text-indigo-200">Total Balance</p>
                  <p className="text-xl md:text-2xl font-bold">$3,247.89</p>
                </div>
              </div>
            </div>
            
            {/* Dashboard Content Mockup */}
            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
              {/* Charts Section */}
              <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg md:rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h4 className="font-semibold text-xs md:text-base text-gray-800">Spending Analytics</h4>
                  <div className="flex space-x-1 md:space-x-2">
                    <div className="w-2 md:w-3 h-2 md:h-3 bg-indigo-500 rounded-full"></div>
                    <div className="w-2 md:w-3 h-2 md:h-3 bg-purple-500 rounded-full"></div>
                    <div className="w-2 md:w-3 h-2 md:h-3 bg-pink-500 rounded-full"></div>
                  </div>
                </div>
                <div className="h-24 md:h-32 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl mb-1 md:mb-2">📊</div>
                    <p className="text-gray-500 text-xs md:text-sm">AI-Powered Analytics</p>
                  </div>
                </div>
              </div>
              
              {/* Stats Section */}
              <div className="space-y-2 md:space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-green-100">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-7 md:w-8 h-7 md:h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs md:text-sm flex-shrink-0">💰</div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm text-gray-600 truncate">This Month</p>
                      <p className="font-bold text-green-700 text-sm md:text-base">$1,234.56</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-100">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-7 md:w-8 h-7 md:h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs md:text-sm flex-shrink-0">🎯</div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm text-gray-600 truncate">Budget Left</p>
                      <p className="font-bold text-blue-700 text-sm md:text-base">$765.44</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-purple-100">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-7 md:w-8 h-7 md:h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xs md:text-sm flex-shrink-0">⚡</div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm text-gray-600 truncate">AI Insights</p>
                      <p className="font-bold text-purple-700 text-sm md:text-base">5 New Tips</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why CoinFlow Section */}
      <section id="features" className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
              <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-indigo-500 rounded-full mr-1.5 md:mr-2"></span>
              Why Choose CoinFlow?
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6">
              Financial Intelligence
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Reimagined</span>
            </h2>
            <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience next-generation expense management with AI-powered insights, 
              seamless automation, and beautiful design that makes budgeting enjoyable.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative bg-white p-4 md:p-8 rounded-lg md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-lg md:rounded-2xl transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-14 md:w-16 h-14 md:h-16 bg-gradient-to-br ${feature.gradient} rounded-lg md:rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-4 group-hover:text-gray-800 transition-colors text-center">
                    {feature.title}
                  </h3>
                  
                  <p className="text-xs md:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors text-center">
                    {feature.description}
                  </p>
                  
                  {/* Learn more arrow */}
                  <div className="mt-3 md:mt-4 flex items-center justify-center text-transparent group-hover:text-indigo-600 transition-colors duration-300">
                    <span className="text-xs md:text-sm font-medium mr-2">Learn more</span>
                    <svg className="w-3 md:w-4 h-3 md:h-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-3 md:px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">What Our Users Say</h2>
          <p className="text-base md:text-xl text-gray-600 mb-8 md:mb-16">
            Join thousands of satisfied users who've transformed their financial habits with Spendwise.
          </p>
          
          <div className="relative bg-white rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center justify-center mb-4 md:mb-6">
              <span className="text-3xl md:text-4xl">{testimonials[currentTestimonial].avatar}</span>
            </div>
            
            <blockquote className="text-sm md:text-lg text-gray-700 mb-4 md:mb-6 italic">
              "{testimonials[currentTestimonial].content}"
            </blockquote>
            
            <div className="text-center">
              <div className="font-semibold text-xs md:text-base text-gray-800">{testimonials[currentTestimonial].name}</div>
              <div className="text-xs md:text-sm text-gray-500">{testimonials[currentTestimonial].role}</div>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-center items-center space-x-4 mt-6 md:mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-xs md:text-base"
              >
                ←
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-xs md:text-base"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-24 md:w-32 h-24 md:h-32 bg-white rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 md:w-40 h-32 md:h-40 bg-white rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 md:w-60 h-40 md:h-60 bg-white rounded-full blur-2xl"></div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-3 md:px-4 text-center text-white relative z-10">
          <div className="mb-6 md:mb-8">
            <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
              <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full mr-1.5 md:mr-2 animate-pulse"></span>
              Start Your Financial Journey Today
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight">
            Ready to Master
            <br />Your CoinFlow?
          </h2>
          
          <p className="text-base md:text-2xl mb-8 md:mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join the financial revolution. Take control of your money with AI-powered insights 
            and transform your spending habits forever.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6 mb-8 md:mb-12">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-white text-indigo-600 px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center space-x-2 md:space-x-3 group"
            >
              <span>Start Free Today</span>
              <span className="group-hover:translate-x-1 transition-transform">🚀</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 md:space-x-3 text-white font-medium bg-white bg-opacity-10 backdrop-blur-sm px-6 md:px-8 py-3 md:py-5 rounded-xl md:rounded-2xl hover:bg-opacity-20 transition-all duration-300 w-full sm:w-auto">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span className="hidden sm:inline text-sm md:text-base">Watch Demo Video</span>
              <span className="sm:hidden text-sm">Demo</span>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-8 text-white text-opacity-80 text-xs md:text-base">
            <div className="flex items-center space-x-1 md:space-x-2">
              <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Free Forever Plan</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Setup in 2 Minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-3 md:px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">Frequently Asked Questions</h2>
            <p className="text-sm md:text-xl text-gray-600">
              Got questions? We've got answers to help you get started.
            </p>
          </div>
          
          <div className="space-y-2 md:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 md:p-6 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <span className="font-semibold text-xs md:text-base text-gray-800">{faq.question}</span>
                  <span className={`transform transition-transform text-xs md:text-base ${openFaq === index ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </button>
                
                {openFaq === index && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <p className="text-xs md:text-base text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section id="developer" className="py-12 md:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-3 md:px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
              <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-indigo-500 rounded-full mr-1.5 md:mr-2"></span>
              Meet the Developer
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6">
              Built with
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Passion</span>
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-12 max-w-4xl mx-auto border border-gray-100">
            <div className="flex flex-col lg:flex-row items-center space-y-6 md:space-y-8 lg:space-y-0 lg:space-x-8 md:space-x-12">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <div className="w-32 md:w-40 h-32 md:h-40 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl md:rounded-3xl flex items-center justify-center text-5xl md:text-6xl text-white mx-auto shadow-2xl">
                  👨‍💻
                </div>
                <div className="absolute -bottom-3 md:-bottom-4 -right-3 md:-right-4 w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 md:w-8 h-6 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Aslam</h3>
                <p className="text-base md:text-xl text-indigo-600 font-semibold mb-3 md:mb-4">Electrical & Information Engineering Student</p>
                <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">
                  Undergraduate at University of Ruhuna, passionate about DevOps and Cloud technologies. 
                  I build full-stack applications using modern web technologies and deploy them with 
                  DevSecOps practices to ensure security and scalability. My goal is to create 
                  innovative solutions that make a real impact.
                </p>
                
                {/* Skills & Technologies */}
                <div className="mb-6 md:mb-8">
                  <h4 className="text-sm md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Tech Stack & Expertise</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                    <div className="flex items-center justify-center space-x-1 md:space-x-2 bg-gradient-to-r from-blue-50 to-blue-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                      <span className="text-lg md:text-2xl">⚛️</span>
                      <span className="text-xs md:text-sm font-medium text-blue-700">React</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1 md:space-x-2 bg-gradient-to-r from-green-50 to-green-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                      <span className="text-lg md:text-2xl">🟢</span>
                      <span className="text-xs md:text-sm font-medium text-green-700">Node.js</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1 md:space-x-2 bg-gradient-to-r from-purple-50 to-purple-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                      <span className="text-lg md:text-2xl">☁️</span>
                      <span className="text-xs md:text-sm font-medium text-purple-700">DevOps</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1 md:space-x-2 bg-gradient-to-r from-orange-50 to-orange-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                      <span className="text-lg md:text-2xl">🔒</span>
                      <span className="text-xs md:text-sm font-medium text-orange-700">Security</span>
                    </div>
                  </div>
                </div>
                
                {/* Social Links */}
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-2 md:gap-4">
                  <a 
                    href="https://github.com/AslamEl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium text-xs md:text-base hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </a>
                  
                  <a 
                    href="https://www.linkedin.com/in/iamaslam/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium text-xs md:text-base hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4 md:mb-6">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-base md:text-xl">💎</span>
                </div>
                <span className="text-xl md:text-2xl font-black">CoinFlow</span>
              </div>
              <p className="text-gray-400 mb-4 md:mb-6 max-w-md leading-relaxed text-xs md:text-base">
                Revolutionizing personal finance with AI-powered insights and beautiful design. 
                Take control of your financial future with CoinFlow's intelligent expense management.
              </p>
              
              <div className="flex space-x-3 md:space-x-4">
                <a 
                  href="https://github.com/AslamEl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 md:w-10 h-9 md:h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/in/iamaslam/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 md:w-10 h-9 md:h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <svg className="w-4 md:w-5 h-4 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6">Features</h4>
              <ul className="space-y-2 md:space-y-3 text-gray-400 text-xs md:text-base">
                <li className="hover:text-white transition-colors cursor-pointer">AI-Powered Analytics</li>
                <li className="hover:text-white transition-colors cursor-pointer">Smart Budget Management</li>
                <li className="hover:text-white transition-colors cursor-pointer">Real-time Insights</li>
                <li className="hover:text-white transition-colors cursor-pointer">Goal Tracking</li>
                <li className="hover:text-white transition-colors cursor-pointer">Security & Privacy</li>
              </ul>
            </div>
            
            {/* Support & Resources */}
            <div>
              <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6">Support</h4>
              <ul className="space-y-2 md:space-y-3 text-gray-400 text-xs md:text-base">
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors cursor-pointer">Documentation</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact Support</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-xs md:text-base text-center md:text-left">
                <p>&copy; 2025 CoinFlow. Built with ❤️ by Aslam for better financial management.</p>
              </div>
              
              <div className="flex items-center justify-center space-x-3 md:space-x-6 text-xs md:text-sm text-gray-400">
                <span className="flex items-center space-x-1 md:space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>System Online</span>
                </span>
                <span className="hidden sm:inline">🔒 Bank-Level Security</span>
                <span className="hidden sm:inline">⚡ Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
