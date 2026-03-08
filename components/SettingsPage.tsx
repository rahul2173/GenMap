
import React, { useState, useEffect } from 'react';

interface SettingsPageProps {
  onRestartTutorial?: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onRestartTutorial }) => {
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy' | 'appearance'>('account');
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark-mode'));

  const toggleTheme = (dark: boolean) => {
    setIsDarkMode(dark);
    if (dark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <div className="h-full bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-xl overflow-y-auto p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-500 mb-2">Settings</h1>
            <p className="text-stone-500 dark:text-stone-400">Manage your family tree preferences and account security.</p>
          </div>
          <div className="text-right opacity-30 select-none">
            <span className="text-[10px] font-black tracking-[0.3em] text-emerald-900 dark:text-emerald-100 uppercase">Powered by GenMap</span>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 space-y-2">
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'account' ? 'bg-emerald-600 text-white shadow-lg' : 'text-stone-500 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800 hover:text-emerald-700'}`}
            >
              <i className="fa-solid fa-user-gear"></i> Account Details
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'appearance' ? 'bg-emerald-600 text-white shadow-lg' : 'text-stone-500 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800 hover:text-emerald-700'}`}
            >
              <i className="fa-solid fa-palette"></i> Appearance
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'notifications' ? 'bg-emerald-600 text-white shadow-lg' : 'text-stone-500 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800 hover:text-emerald-700'}`}
            >
              <i className="fa-solid fa-bell"></i> Notifications
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'privacy' ? 'bg-emerald-600 text-white shadow-lg' : 'text-stone-500 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800 hover:text-emerald-700'}`}
            >
              <i className="fa-solid fa-shield-halved"></i> Privacy & Security
            </button>
          </aside>

          {/* Settings Content */}
          <main className="flex-1 space-y-8 pb-20">
            {activeTab === 'account' && (
              <section className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center"><i className="fa-solid fa-id-card text-xs"></i></span>
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Display Name</label>
                    <input type="text" defaultValue="Alexander Sterling" className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-amber-400 focus:bg-white dark:focus:bg-stone-800 transition-all text-stone-800 dark:text-stone-200 font-semibold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Email Address</label>
                    <input type="email" defaultValue="alex@sterling.family" className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-amber-400 focus:bg-white dark:focus:bg-stone-800 transition-all text-stone-800 dark:text-stone-200 font-semibold" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Bio / Ancestral Note</label>
                    <textarea defaultValue="The founding member of the Sterling legacy." className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-amber-400 focus:bg-white dark:focus:bg-stone-800 transition-all text-stone-800 dark:text-stone-200 font-semibold h-24 resize-none" />
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-stone-100 dark:border-stone-700 flex justify-end">
                  <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md">
                    Save Changes
                  </button>
                </div>
              </section>
            )}

            {activeTab === 'appearance' && (
              <section className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><i className="fa-solid fa-wand-magic-sparkles text-xs"></i></span>
                  Visual Experience
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => toggleTheme(false)}
                    className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all ${!isDarkMode ? 'border-amber-400 bg-amber-50 dark:bg-stone-900 shadow-lg scale-105' : 'border-stone-100 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'}`}
                  >
                    <div className="w-full h-24 bg-stone-100 dark:bg-stone-950 rounded-lg mb-4 flex gap-2 p-2 overflow-hidden border border-stone-200 dark:border-stone-800">
                      <div className="w-4 h-full bg-emerald-700 rounded-sm"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-2 bg-stone-300 dark:bg-stone-800 rounded"></div>
                        <div className="w-1/2 h-2 bg-stone-200 dark:bg-stone-700 rounded"></div>
                      </div>
                    </div>
                    <span className="font-bold text-stone-800 dark:text-stone-100">Ancestry Classic</span>
                    <span className="text-xs text-stone-500 italic">Green, Beige & Gold</span>
                  </button>

                  <button 
                    onClick={() => toggleTheme(true)}
                    className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all ${isDarkMode ? 'border-amber-400 bg-stone-900 shadow-lg scale-105' : 'border-stone-100 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'}`}
                  >
                    <div className="w-full h-24 bg-stone-950 rounded-lg mb-4 flex gap-2 p-2 overflow-hidden border border-stone-800">
                      <div className="w-4 h-full bg-emerald-900 rounded-sm"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-2 bg-stone-800 rounded"></div>
                        <div className="w-1/2 h-2 bg-stone-700 rounded"></div>
                      </div>
                    </div>
                    <span className="font-bold text-stone-800 dark:text-stone-100">Midnight Ancestry</span>
                    <span className="text-xs text-stone-500 italic">Dark Mode Experience</span>
                  </button>
                </div>

                <div className="mt-8 p-6 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
                   <div className="flex items-center justify-between mb-4">
                     <div>
                       <p className="font-bold text-stone-800 dark:text-stone-100">Automatic Sync</p>
                       <p className="text-xs text-stone-500">Sync theme with your system preferences.</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                   </div>
                   
                   {onRestartTutorial && (
                     <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-700">
                       <div>
                         <p className="font-bold text-stone-800 dark:text-stone-100">Onboarding Tour</p>
                         <p className="text-xs text-stone-500">Replay the introductory guide for the application.</p>
                       </div>
                       <button 
                        onClick={onRestartTutorial}
                        className="px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg text-stone-600 dark:text-stone-300 text-xs font-bold uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all"
                       >
                         Restart Tour
                       </button>
                     </div>
                   )}
                </div>
              </section>
            )}

            {activeTab === 'notifications' && (
              <section className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center"><i className="fa-solid fa-bullhorn text-xs"></i></span>
                  Alert Preferences
                </h2>
                
                <div className="space-y-6">
                  {[
                    { label: 'Tree Updates', desc: 'Notify me when someone is added to my tree.', icon: 'fa-network-wired' },
                    { label: 'Event Reminders', desc: 'Alert me 24 hours before family reunions or birthdays.', icon: 'fa-calendar-check' },
                    { label: 'Direct Messages', desc: 'Get notified of new family chats.', icon: 'fa-comments' },
                    { label: 'WhatsApp Sync', desc: 'Receive urgent verification requests via WhatsApp.', icon: 'fa-brands fa-whatsapp', color: 'text-green-500' }
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center ${pref.color || 'text-stone-400 dark:text-stone-500'}`}>
                          <i className={`fa-solid ${pref.icon}`}></i>
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 dark:text-stone-100">{pref.label}</p>
                          <p className="text-xs text-stone-500 dark:text-stone-500">{pref.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={i !== 3} className="sr-only peer" />
                        <div className="w-11 h-6 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'privacy' && (
              <section className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center"><i className="fa-solid fa-lock text-xs"></i></span>
                  Privacy Controls
                </h2>

                <div className="space-y-8">
                  <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-500 mb-2 uppercase tracking-widest">Global Tree Visibility</p>
                    <p className="text-sm text-amber-700/80 dark:text-amber-600 mb-4">When your tree is set to 'Public', it can be discovered by potential relatives outside your verified circle.</p>
                    <button className="px-6 py-2 bg-amber-500 text-white rounded-lg font-bold text-xs hover:bg-amber-600 shadow-sm transition-all">
                      Manage Visibility
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Access Permissions</p>
                    <div className="flex items-center justify-between py-2 border-b border-stone-50 dark:border-stone-700">
                      <div>
                        <p className="text-sm font-bold text-stone-800 dark:text-stone-200">Verified Relatives Only</p>
                        <p className="text-xs text-stone-400">Only members who passed verification can see sensitive dates.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-emerald-600 w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-stone-50 dark:border-stone-700">
                      <div>
                        <p className="text-sm font-bold text-stone-800 dark:text-stone-200">Profile Indexing</p>
                        <p className="text-xs text-stone-400">Allow my profile to appear in global family searches.</p>
                      </div>
                      <input type="checkbox" className="accent-emerald-600 w-5 h-5" />
                    </div>
                  </div>

                  <div className="pt-8 space-y-4">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Danger Zone</p>
                    <button className="w-full py-4 border-2 border-rose-100 dark:border-rose-900/30 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 transition-all">
                      Archive Primary Family Tree
                    </button>
                    <button className="w-full py-4 text-stone-400 font-bold text-xs hover:text-rose-600 transition-colors">
                      Delete Account Permanently
                    </button>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
