
import React, { useState } from 'react';
import { FamilyMember } from '../types';

interface MessagingProps {
  members: FamilyMember[];
}

const Messaging: React.FC<MessagingProps> = ({ members }) => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(members[1]);
  const [messageText, setMessageText] = useState('');

  const mockMessages = [
    { id: 1, sender: 'them', text: "Hey! Did you see the new branch Julian added?", time: "10:30 AM" },
    { id: 2, sender: 'me', text: "I did! It's growing so fast. Glad we started this tree.", time: "10:32 AM" },
    { id: 3, sender: 'them', text: "Absolutely. I'll scan those old baptism records tonight.", time: "10:35 AM" }
  ];

  return (
    <div className="h-full flex bg-white/40 backdrop-blur-md">
      {/* Sidebar */}
      <div className="w-80 border-r border-stone-200 flex flex-col h-full bg-white/60">
        <div className="p-6 border-b border-stone-200">
          <h2 className="text-xl font-bold text-emerald-800">Family Chats</h2>
          <div className="mt-4 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Search family..." 
              className="w-full bg-stone-100 border border-stone-200 rounded-lg pl-9 py-2 text-xs outline-none focus:border-amber-400 focus:bg-white transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {members.map(member => (
            <div 
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className={`flex items-center gap-3 p-4 border-b border-stone-50 cursor-pointer transition-all ${selectedMember?.id === member.id ? 'bg-amber-50 border-r-4 border-r-amber-400 shadow-sm' : 'hover:bg-stone-50'}`}
            >
              <div className="relative">
                <img src={member.avatar} className="w-12 h-12 rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-0.5">
                  <p className="text-sm font-bold text-stone-800">{member.firstName}</p>
                  <span className="text-[10px] text-stone-400 font-semibold">10:35 AM</span>
                </div>
                <p className="text-xs text-stone-500 truncate">Scanned those records tonight...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedMember ? (
          <>
            <div className="p-4 border-b border-stone-200 bg-white/60 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={selectedMember.avatar} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-stone-800">{selectedMember.firstName} {selectedMember.lastName}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Active Now</p>
                </div>
              </div>
              <div className="flex gap-4 text-stone-400">
                <button className="hover:text-emerald-600 transition-colors"><i className="fa-solid fa-phone"></i></button>
                <button className="hover:text-emerald-600 transition-colors"><i className="fa-solid fa-video"></i></button>
                <button className="hover:text-emerald-600 transition-colors"><i className="fa-solid fa-circle-info"></i></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {mockMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-2' : ''}`}>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.sender === 'me' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                    <p className={`text-[10px] text-stone-400 mt-1 font-bold ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                      {msg.time} {msg.sender === 'me' && '• Delivered'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white/60 border-t border-stone-200">
              <div className="flex items-center gap-4 bg-stone-100 rounded-2xl p-2 border border-stone-200">
                <button className="w-10 h-10 text-stone-400 hover:text-amber-500 transition-colors"><i className="fa-solid fa-plus-circle"></i></button>
                <input 
                  type="text" 
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-sm outline-none px-2"
                />
                <button className="w-10 h-10 text-stone-400 hover:text-amber-500 transition-colors"><i className="fa-solid fa-face-smile"></i></button>
                <button className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 shadow-md">
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
            <i className="fa-solid fa-comments text-6xl text-emerald-600 mb-4"></i>
            <p className="text-lg font-bold">Select a family member to chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
