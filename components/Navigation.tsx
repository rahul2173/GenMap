
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  // Mocking notification count for demonstration
  const [unreadCount] = useState(2);

  const navItems = [
    { path: '/', icon: 'fa-sitemap', label: 'Tree' },
    { path: '/social', icon: 'fa-earth-americas', label: 'Feed' },
    { path: '/messages', icon: 'fa-comments', label: 'Chat' },
    { path: '/profile/1', icon: 'fa-user-circle', label: 'Profile' },
    { path: '/settings', icon: 'fa-cog', label: 'Settings' }
  ];

  return (
    <nav id="main-navigation" className="fixed left-0 top-16 bottom-0 w-16 bg-emerald-700 border-r border-emerald-600 z-50 flex flex-col items-center py-6 gap-8 shadow-2xl">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
              isActive ? 'bg-amber-400 text-emerald-900' : 'text-emerald-50 hover:bg-emerald-600'
            }`
          }
        >
          <i className={`fa-solid ${item.icon} text-lg`}></i>
          <span className="absolute left-16 bg-emerald-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[60]">
            {item.label}
          </span>
        </NavLink>
      ))}
      <div className="mt-auto">
        <NavLink 
          to="/notifications"
          className={({ isActive }) => 
            `relative w-10 h-10 flex items-center justify-center transition-colors rounded-xl ${
              isActive ? 'bg-amber-400 text-emerald-900' : 'text-emerald-50 hover:bg-emerald-600'
            }`
          }
        >
          <i className="fa-solid fa-bell text-xl"></i>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white border-2 border-emerald-700 shadow-sm animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
