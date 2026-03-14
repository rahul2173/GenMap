import React from 'react';

interface PermissionModalProps {
  onClose: () => void;
  onGrant: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ onClose, onGrant }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-stone-900 p-8 rounded-[2rem] shadow-2xl w-full max-w-sm border border-stone-200 dark:border-stone-800 text-center">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
          <i className="fa-solid fa-microphone-lines text-2xl"></i>
        </div>
        <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-4 tracking-tighter">Enable Access</h2>
        <p className="text-stone-600 dark:text-stone-400 mb-8 text-sm">
          To fully experience GenMap, please allow access to your camera and microphone for face scanning and voice interaction.
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onGrant}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-700 transition-all shadow-lg"
          >
            Allow Access
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 text-stone-500 font-bold uppercase tracking-widest text-xs hover:text-stone-800 dark:hover:text-stone-200 transition-all"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
