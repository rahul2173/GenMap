import React from 'react';
import { Link } from 'react-router-dom';

const HeroPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center waterfall-bg p-6">
      <div className="max-w-2xl text-center bg-white/60 dark:bg-stone-900/60 backdrop-blur-md p-12 rounded-[3rem] border border-white shadow-2xl">
        <div className="relative inline-block mb-6">
          <img 
            src="/logo.png" 
            alt="GenMap Logo" 
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 h-20 w-auto" 
            referrerPolicy="no-referrer"
          />
          <h1 className="text-7xl text-emerald-600 tracking-tighter times-new-roman">
            GenMap
          </h1>
        </div>
        <p className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-2">
          Connect with your <span className="text-emerald-600">Family Legacy</span>
        </p>
        <p className="text-lg text-stone-600 dark:text-stone-400 mb-12">
          Build, explore, and preserve your family tree for generations to come.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/signup" 
            className="px-10 py-4 bg-emerald-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/20"
          >
            Get Started
          </Link>
          <Link 
            to="/app" 
            className="px-10 py-4 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-full font-black uppercase tracking-widest text-sm hover:bg-stone-300 dark:hover:bg-stone-700 transition-all"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;
