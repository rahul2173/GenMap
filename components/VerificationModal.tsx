
import React, { useState } from 'react';
import { RelationType, GenderType } from '../types';

interface VerificationModalProps {
  onClose: () => void;
  onSubmit: (data: { firstName: string, lastName: string, gender: GenderType, channel: string }) => void;
  relationType: RelationType;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ onClose, onSubmit, relationType }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<GenderType>('other');
  const [channel, setChannel] = useState('email');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/30 backdrop-blur-sm p-4">
      <div className="bg-stone-50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center shadow-inner">
          <h3 className="text-white font-bold text-lg capitalize">Add New {relationType}</h3>
          <button onClick={onClose} className="text-emerald-100 hover:text-white transition-colors"><i className="fa-solid fa-xmark"></i></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase">First Name</label>
              <input 
                type="text" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full bg-stone-100 border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400 focus:bg-white transition-all"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase">Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full bg-stone-100 border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400 focus:bg-white transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1 uppercase">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'other'] as GenderType[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${gender === g ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2 uppercase">Send Verification Via</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setChannel('email')}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${channel === 'email' ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'}`}
              >
                <i className="fa-solid fa-envelope mb-1"></i>
                <span className="text-[10px] font-bold">Email</span>
              </button>
              <button 
                onClick={() => setChannel('whatsapp')}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${channel === 'whatsapp' ? 'bg-green-100 border-green-400 text-green-800' : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'}`}
              >
                <i className="fa-brands fa-whatsapp mb-1"></i>
                <span className="text-[10px] font-bold">WhatsApp</span>
              </button>
              <button 
                onClick={() => setChannel('sms')}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${channel === 'sms' ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'}`}
              >
                <i className="fa-solid fa-message mb-1"></i>
                <span className="text-[10px] font-bold">SMS</span>
              </button>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <p className="text-[10px] text-amber-800 italic">
              Verification helps maintain tree integrity. Once the member accepts, they will be able to manage their own branch and interact with the family.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-stone-100 border-t border-stone-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-stone-600 font-bold hover:text-stone-800 transition-colors">Cancel</button>
          <button 
            onClick={() => onSubmit({ firstName, lastName, gender, channel })}
            disabled={!firstName || !lastName}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add & Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
