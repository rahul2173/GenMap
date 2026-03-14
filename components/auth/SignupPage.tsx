import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup with:', email, password);
    navigate('/app', { state: { isNewUser: true } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center waterfall-bg p-6">
      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-black text-stone-900 dark:text-stone-100 mb-8 text-center tracking-tighter">Create Account</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit" 
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-700 transition-all shadow-lg mt-4"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-8 text-center text-stone-600 dark:text-stone-400 text-sm">
          Already have an account? <Link to="/app" className="text-emerald-600 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
