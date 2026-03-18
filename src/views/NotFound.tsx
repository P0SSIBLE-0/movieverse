'use client';

import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/16/solid';
import { useEffect } from 'react';
import { useNavigate } from '@/lib/react-router-dom';
const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Page Not Found | Movieverse';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-zinc-800 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-zinc-900/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-zinc-900/10 rounded-full filter blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="text-6xl font-bold text-zinc-100 mb-2 animate-pulse">
            404
          </div>
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-brand-primary/30"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <HomeIcon className="w-5 h-5" />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
