
import React from 'react';
import { FamilyMember } from '../types';

interface DeleteConfirmationModalProps {
  member: FamilyMember;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ member, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-emerald-950/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-stone-50 w-full max-w-sm rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200">
        <div className="bg-rose-600 px-6 py-8 flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full border-4 border-white/30 shadow-xl overflow-hidden">
            <img src={member.avatar} className="w-full h-full object-cover" alt={member.firstName} />
          </div>
          <div>
            <h3 className="text-white font-bold text-xl">Remove from Legacy?</h3>
            <p className="text-rose-100 text-xs mt-1 font-medium px-4">
              Are you sure you want to remove <span className="font-black text-white">{member.firstName} {member.lastName}</span> from the Sterling Family Tree?
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
            <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5"></i>
            <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
              This will remove all direct relationship branches connected to this member. You can undo this action within 5 seconds.
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
          <button 
            onClick={onConfirm}
            className="w-full py-3.5 bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-700 transition-all shadow-lg active:scale-[0.98]"
          >
            Confirm Deletion
          </button>
          <button 
            onClick={onCancel}
            className="w-full py-3.5 bg-stone-100 text-stone-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-stone-200 transition-all active:scale-[0.98]"
          >
            Cancel & Keep
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
