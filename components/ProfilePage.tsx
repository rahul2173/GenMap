
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FamilyMember, TreeMembership } from '../types';
import { getRelativeRelationship } from './kinship';

interface ProfilePageProps {
  members: FamilyMember[];
  setMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
  currentUserId: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ members, setMembers, currentUserId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const member = members.find(m => m.id === id);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!member) return <div className="p-20 text-center">Member not found</div>;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setMembers(prevMembers => 
          prevMembers.map(m => 
            m.id === member.id ? { ...m, avatar: base64String } : m
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwitchTree = (treeId: string) => {
    setSwitchingTo(treeId);
    setTimeout(() => {
      setSwitchingTo(null);
      navigate('/app');
    }, 1500);
  };

  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [connectionNote, setConnectionNote] = useState('');
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleSendRequest = () => {
    setIsSendingRequest(true);
    setTimeout(() => {
      setIsSendingRequest(false);
      setIsConnectionModalOpen(false);
      setRequestSent(true);
    }, 1500);
  };

  return (
    <div className="h-full bg-white/50 backdrop-blur-xl overflow-y-auto">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
      
      {/* Connection Request Modal */}
      {isConnectionModalOpen && (
        <div className="fixed inset-0 z-[200] bg-emerald-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Connect with {member.firstName}</h3>
            <p className="text-sm text-stone-500 mb-6">Send a request to view private memories and ancestral records.</p>
            
            <textarea 
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-4 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none h-32 mb-6 text-stone-800 dark:text-stone-200"
              placeholder="Add an optional personal note..."
              value={connectionNote}
              onChange={(e) => setConnectionNote(e.target.value)}
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsConnectionModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                disabled={isSendingRequest}
              >
                Cancel
              </button>
              <button 
                onClick={handleSendRequest}
                disabled={isSendingRequest}
                className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSendingRequest ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Sending...</>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="h-48 bg-emerald-600 relative">
        <button 
          onClick={() => navigate('/app')}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-all z-10"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/leaf.png')" }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative pb-20">
        {/* Loading Overlay for Tree Switching */}
        {switchingTo && (
          <div className="fixed inset-0 z-[200] bg-emerald-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold">Synchronizing Ancestry...</h2>
            <p className="text-emerald-100 opacity-60">Connecting to {member.trees?.find(t => t.id === switchingTo)?.name}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-end mb-10">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-40 h-40 rounded-3xl border-4 border-white bg-white shadow-2xl overflow-hidden relative">
              <img src={member.avatar} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <i className="fa-solid fa-camera text-2xl mb-1"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">Update Photo</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
              <i className="fa-solid fa-check"></i>
            </div>
          </div>

          <div className="flex-1 min-w-0 pb-2">
            <div className="flex flex-col items-start gap-2 mb-2">
              <h2 className="text-3xl font-bold text-[#e79ff5] break-words">{member.firstName} {member.lastName}</h2>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-full border border-amber-200 whitespace-nowrap shrink-0">{getRelativeRelationship(member.id, currentUserId, members)}</span>
            </div>
            <p className="text-stone-500 max-w-xl italic leading-relaxed break-words">"{member.bio || 'Preserving our history for the generations to come.'}"</p>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md">
              <i className="fa-solid fa-phone"></i> Voice Call
            </button>
            <button className="w-12 h-12 flex items-center justify-center bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 transition-all border border-stone-200">
              <i className="fa-solid fa-video"></i>
            </button>
            <button onClick={() => navigate('/messages')} className="w-12 h-12 flex items-center justify-center bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 transition-all border border-stone-200">
              <i className="fa-solid fa-message"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-amber-500"></i> Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Date of Birth</p>
                  <p className="text-stone-800 font-semibold">May 14, 1952</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Place of Birth</p>
                  <p className="text-stone-800 font-semibold">London, UK</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-stone-800 font-semibold">{member.email || 'alex@sterling.family'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Privacy Level</p>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <i className="fa-solid fa-lock text-[10px]"></i> High
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-heart text-rose-500"></i> Connections
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {member.connections.map(conn => {
                  const target = members.find(m => m.id === conn.toId);
                  if (!target) return null;
                  return (
                    <div key={conn.toId} onClick={() => navigate(`/profile/${target.id}`)} className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50 transition-all cursor-pointer">
                      <img src={target.avatar} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-bold text-stone-800">{target.firstName}</p>
                        <p className="text-[10px] uppercase font-semibold text-emerald-600 tracking-tighter">{getRelativeRelationship(conn.toId, currentUserId, members)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Tree Memberships Section (Moved below Connections) */}
            <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
              <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-network-wired text-emerald-600"></i> Ancestral Trees
              </h3>
              
              <div className="space-y-4">
                {member.trees && member.trees.length > 0 ? (
                  member.trees.map((tree) => (
                    <div 
                      key={tree.id} 
                      className={`group relative p-5 rounded-2xl border transition-all duration-300 ${
                        tree.isPrimary 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-stone-50 border-stone-100 hover:border-amber-200 hover:bg-amber-50/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-stone-800 group-hover:text-emerald-800 transition-colors">
                            {tree.name}
                            {tree.isPrimary && <span className="ml-2 text-[8px] bg-emerald-600 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Primary</span>}
                          </h4>
                          <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">{tree.code}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{getRelativeRelationship(member.id, currentUserId, members)}</p>
                          <p className="text-[10px] text-stone-400 font-semibold">{tree.memberCount} Members</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSwitchTree(tree.id)}
                          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                            tree.isPrimary 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                            : 'bg-white border border-stone-200 text-stone-600 hover:border-emerald-600 hover:text-emerald-600'
                          }`}
                        >
                          Access This Tree
                        </button>
                        {!tree.isPrimary && (
                          <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-stone-200 text-stone-600 rounded-xl hover:bg-amber-100 hover:border-amber-400 hover:text-amber-800 transition-all">
                            Set Primary
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-40 italic">
                    <p>No other tree memberships found.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 rounded-3xl text-white shadow-xl">
              <h3 className="text-lg font-bold mb-4">Request Data Access</h3>
              <p className="text-xs text-emerald-50 mb-6 leading-relaxed">
                Send a connection request to view private memories, full contact details, and ancestral records.
              </p>
              <button 
                onClick={() => !requestSent && setIsConnectionModalOpen(true)}
                disabled={requestSent}
                className={`w-full py-3 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                  requestSent 
                  ? 'bg-emerald-900/50 text-emerald-400 cursor-not-allowed' 
                  : 'bg-amber-400 text-emerald-950 hover:bg-amber-300'
                }`}
              >
                {requestSent ? (
                  <><i className="fa-solid fa-check"></i> Request Sent</>
                ) : (
                  'Send Connection Request'
                )}
              </button>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-sm font-bold text-stone-800 mb-4">Ancestry Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-400 font-semibold">Generations Linked</span>
                  <span className="text-emerald-700 font-black">4</span>
                </div>
                <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[60%]"></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-400 font-semibold">Verification Score</span>
                  <span className="text-emerald-700 font-black">98%</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
