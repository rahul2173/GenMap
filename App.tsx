
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import TreeView from './components/TreeView';
import ProfilePage from './components/ProfilePage';
import Navigation from './components/Navigation';
import SocialFeed from './components/SocialFeed';
import Messaging from './components/Messaging';
import SettingsPage from './components/SettingsPage';
import NotificationsPage from './components/NotificationsPage';
import TutorialGuide from './components/TutorialGuide';
import { FamilyMember, TreeMembership } from './types';
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_MEMBERS } from './data';

const VisualSearchModal = ({ members, onClose }: { members: FamilyMember[], onClose: () => void }) => {
  const [mode, setMode] = useState<'selection' | 'camera' | 'upload'>('selection');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('Scanning Image');
  const [matchResult, setMatchResult] = useState<FamilyMember | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const processImage = async (base64Data: string) => {
    setIsProcessing(true);
    setProcessingStage('Scanning Image');
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setProcessingStage('Analyzing Facial Features');
      await new Promise(r => setTimeout(r, 800));
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const memberDescriptions = members.map(m => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
        role: m.role
      }));

      const responsePromise = ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { mimeType: 'image/jpeg', data: base64Data.split(',')[1] } },
              { text: `Analyze the face in this image and match it with one of the family members from this list. If there is a high-confidence match, return only their ID. If no match is found, return "none". \n\nMembers: ${JSON.stringify(memberDescriptions)}` }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchId: { type: Type.STRING, description: "The ID of the matched member or 'none'" }
            },
            required: ["matchId"]
          }
        }
      });

      const response = await responsePromise;
      setProcessingStage('Matching with Database');
      await new Promise(r => setTimeout(r, 1000));

      const result = JSON.parse(response.text);
      if (result.matchId && result.matchId !== 'none') {
        const matched = members.find(m => m.id === result.matchId);
        setMatchResult(matched || null);
      } else {
        setError("We couldn't find a confident match in your family tree.");
      }
    } catch (err) {
      console.error(err);
      setError("AI Analysis failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        stopCamera();
        processImage(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackAction = () => {
    if (isProcessing) return;
    if (mode === 'selection' && !matchResult && !error) {
      onClose();
    } else {
      stopCamera();
      setMode('selection');
      setMatchResult(null);
      setError(null);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-900/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 relative">
        <div className="absolute top-6 left-6 z-50 flex items-center gap-2">
          {!isProcessing && (
            <button 
              onClick={handleBackAction}
              className="px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-all flex items-center gap-2 shadow-sm font-bold text-xs"
              title={mode === 'selection' ? 'Close Modal' : 'Back to Menu'}
            >
              <i className={`fa-solid ${mode === 'selection' && !matchResult && !error ? 'fa-xmark' : 'fa-arrow-left'}`}></i>
              <span>{mode === 'selection' && !matchResult && !error ? 'Close' : 'Back'}</span>
            </button>
          )}
        </div>

        {!isProcessing && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-all z-50 flex items-center justify-center"
            title="Close Search"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}

        <div className="p-8">
          <header className="mb-8 text-center pt-8">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-4 shadow-inner">
              <i className="fa-solid fa-camera-retro text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Visual Identity Scan</h2>
            <p className="text-stone-500 text-sm mt-1">Match family faces using AI neural recognition.</p>
          </header>

          <div className="min-h-[300px] flex flex-col items-center justify-center">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-48 h-48 rounded-full border-4 border-emerald-100 dark:border-emerald-900 flex items-center justify-center overflow-hidden bg-stone-50 dark:bg-stone-800">
                  <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                  <div className="w-full h-1 bg-emerald-500 absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                  <i className="fa-solid fa-face-viewfinder text-5xl text-emerald-500"></i>
                </div>
                <div className="text-center h-12">
                  <p key={processingStage} className="font-bold text-emerald-600 uppercase tracking-widest text-xs animate-in slide-in-from-bottom-2 duration-300">
                    {processingStage}
                  </p>
                  <p className="text-stone-400 text-[10px] mt-1 italic">Consulting the Sterling Family Archives...</p>
                </div>
              </div>
            ) : matchResult ? (
              <div className="w-full animate-in zoom-in-95 duration-300">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-6 rounded-3xl text-center">
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <img src={matchResult.avatar} className="w-full h-full rounded-full object-cover border-4 border-white dark:border-stone-800 shadow-xl" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-emerald-950 border-4 border-emerald-50 dark:border-emerald-900">
                      <i className="fa-solid fa-check-double text-xs"></i>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">Match Found!</h3>
                  <p className="text-emerald-600 font-black uppercase tracking-tighter text-xs mt-1">{matchResult.firstName} {matchResult.lastName}</p>
                  <p className="text-stone-500 text-xs mt-2 px-6">{matchResult.bio || 'A verified member of your lineage.'}</p>
                  
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => { navigate(`/profile/${matchResult.id}`); onClose(); }}
                      className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 shadow-lg transition-all"
                    >
                      View Full Profile
                    </button>
                    <button 
                      onClick={handleBackAction}
                      className="px-6 py-3 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                    >
                      Scan Again
                    </button>
                  </div>
                </div>
              </div>
            ) : mode === 'selection' ? (
              <div className="w-full flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-stone-100 dark:border-stone-800 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-video text-emerald-600"></i>
                    </div>
                    <span className="font-bold text-stone-700 dark:text-stone-300">Live Face Scan</span>
                  </button>
                  <label className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-stone-100 dark:border-stone-800 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all group cursor-pointer shadow-sm hover:shadow-md">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-file-arrow-up text-amber-600"></i>
                    </div>
                    <span className="font-bold text-stone-700 dark:text-stone-300">Upload Photo</span>
                  </label>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={onClose}
                    className="w-full py-4 bg-stone-100 dark:bg-stone-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 hover:text-stone-800 dark:hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    Cancel & Return to Tree
                  </button>
                  <p className="text-center text-[8px] text-stone-400 uppercase tracking-widest font-bold">Select an input method to begin scanning</p>
                </div>
              </div>
            ) : mode === 'camera' ? (
              <div className="w-full flex flex-col items-center gap-6">
                <div className="relative w-full aspect-square max-w-xs rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-stone-200 dark:border-stone-800">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale" />
                  <div className="absolute inset-0 border-2 border-white/20 pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-amber-400/50 rounded-[3rem] pointer-events-none flex items-center justify-center">
                    <div className="w-full h-full border border-amber-400 animate-pulse rounded-[3rem]"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={captureFrame}
                    className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center text-emerald-950 shadow-xl hover:scale-105 active:scale-90 transition-all"
                    title="Capture"
                  >
                    <i className="fa-solid fa-camera text-2xl"></i>
                  </button>
                  <button 
                    onClick={() => { stopCamera(); startCamera(); }}
                    className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center text-stone-500 shadow-xl"
                    title="Restart Camera"
                  >
                    <i className="fa-solid fa-rotate-left text-xl"></i>
                  </button>
                </div>
                <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest">Position face in the frame</p>
              </div>
            ) : null}

            {error && (
              <div className="mt-8 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 animate-in shake duration-500">
                <i className="fa-solid fa-circle-exclamation text-lg"></i>
                <div className="flex-1">
                  <p className="text-xs font-bold leading-tight">{error}</p>
                  <button onClick={handleBackAction} className="text-[10px] underline uppercase font-black tracking-widest mt-1 hover:text-rose-800">Return to Menu</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-stone-50 dark:bg-stone-950 px-8 py-4 flex justify-between items-center opacity-40">
           <span className="text-[8px] font-black uppercase tracking-[0.2em]">Neural Match V4.0</span>
           <span className="text-[8px] font-black uppercase tracking-[0.2em]">{members.length} Entities Indexed</span>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

const HeaderSearch = ({ members }: { members: FamilyMember[] }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredMembers = query.trim() === '' 
    ? [] 
    : members.filter(m => 
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id="header-search" className="relative flex-1 max-w-md mx-8 flex items-center gap-3" ref={searchRef}>
      <div className="relative flex-1 group">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors"></i>
        <input
          type="text"
          placeholder="Find a family member..."
          className="w-full bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl pl-12 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all backdrop-blur-sm dark:text-stone-200"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      <button 
        onClick={() => setIsVisualSearchOpen(true)}
        className="w-11 h-11 bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl flex items-center justify-center text-stone-400 hover:text-amber-500 hover:border-amber-400 transition-all backdrop-blur-sm group relative"
      >
        <i className="fa-solid fa-camera-retro text-lg"></i>
        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[110] -translate-y-2 group-hover:translate-y-0">
          <div className="w-2 h-2 bg-stone-900 rotate-45 mx-auto -mb-1 shadow-xl"></div>
          <div className="bg-stone-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">Face Search</div>
        </div>
      </button>

      {isOpen && filteredMembers.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 max-h-80 overflow-y-auto">
            {filteredMembers.map(member => (
              <button
                key={member.id}
                onClick={() => {
                  navigate(`/profile/${member.id}`);
                  setQuery('');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl transition-colors text-left group"
              >
                <img src={member.avatar} className="w-10 h-10 rounded-full object-cover border border-stone-100 dark:border-stone-800" />
                <div>
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-200 group-hover:text-emerald-600 transition-colors">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-[10px] uppercase font-semibold text-stone-400 tracking-tighter">
                    {member.role}
                  </p>
                </div>
                <i className="fa-solid fa-chevron-right ml-auto text-[10px] text-stone-300 group-hover:text-amber-500 transition-colors"></i>
              </button>
            ))}
          </div>
        </div>
      )}

      {isVisualSearchOpen && (
        <VisualSearchModal members={members} onClose={() => setIsVisualSearchOpen(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [currentUser] = useState<FamilyMember>(INITIAL_MEMBERS[0]);
  const [isTreePrivate, setIsTreePrivate] = useState(true);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenGenMapTutorial');
    if (!hasSeenTutorial) {
      setIsTutorialOpen(true);
    }
  }, []);

  const handleCloseTutorial = () => {
    setIsTutorialOpen(false);
    localStorage.setItem('hasSeenGenMapTutorial', 'true');
  };

  const handleRestartTutorial = () => {
    setIsTutorialOpen(true);
  };

  return (
    <HashRouter>
      <div className="flex flex-col h-screen w-screen overflow-hidden waterfall-bg transition-colors duration-300">
        <TutorialGuide isOpen={isTutorialOpen} onClose={handleCloseTutorial} />
        
        <header id="app-header" className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/40 dark:bg-stone-950/40 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-[0.2em] text-emerald-600 dark:text-emerald-400">GENMAP</span>
                <div className="w-px h-3 bg-stone-300 dark:bg-stone-700"></div>
                <Link to="/" className="text-xl font-bold text-emerald-700 dark:text-emerald-500 flex items-center gap-2">
                  <i className="fa-solid fa-tree text-amber-500"></i>
                  Sterling Family Legacy
                </Link>
              </div>
              <span className="text-[9px] text-stone-500 uppercase tracking-widest font-semibold ml-[72px]">Code: STRL-9921-X</span>
            </div>
          </div>

          <HeaderSearch members={members} />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{isTreePrivate ? 'Private' : 'Public'}</span>
              <button 
                onClick={() => setIsTreePrivate(!isTreePrivate)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isTreePrivate ? 'bg-stone-300 dark:bg-stone-700' : 'bg-emerald-500'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${!isTreePrivate ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{currentUser.firstName} {currentUser.lastName}</p>
                <p className="text-xs text-stone-500">Account Owner</p>
              </div>
              <img src={currentUser.avatar} className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover" />
            </div>
          </div>
        </header>

        <Navigation />

        <main className="flex-1 relative overflow-hidden ml-16 mt-16 h-full">
          <Routes>
            <Route path="/" element={<TreeView members={members} setMembers={setMembers} currentUserId={currentUser.id} />} />
            <Route path="/profile/:id" element={<ProfilePage members={members} setMembers={setMembers} />} />
            <Route path="/social" element={<SocialFeed members={members} />} />
            <Route path="/messages" element={<Messaging members={members} />} />
            <Route path="/notifications" element={<NotificationsPage members={members} />} />
            <Route path="/settings" element={<SettingsPage onRestartTutorial={handleRestartTutorial} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
