
import React, { useState } from 'react';
import { FamilyMember, RelationType } from '../types';

interface RelationshipLinesProps {
  members: FamilyMember[];
  onToggleSpouseBond?: (id1: string, id2: string) => void;
  onDeleteConnection?: (id1: string, id2: string, type: RelationType) => void;
}

const RelationshipLines: React.FC<RelationshipLinesProps> = ({ members, onToggleSpouseBond, onDeleteConnection }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const getLineColor = (type: RelationType) => {
    switch (type) {
      case 'parent': return '#3b82f6'; // Blue
      case 'child': return '#10b981';  // Emerald 500
      case 'sibling': return '#f59e0b'; // Amber
      case 'spouse': return '#f43f5e';  // Rose
      default: return '#cbd5e1';
    }
  };

  const renderLines = () => {
    const lines: React.ReactNode[] = [];
    const processed = new Set<string>();

    members.forEach(member => {
      member.connections.forEach(conn => {
        const target = members.find(m => m.id === conn.toId);
        if (target) {
          const lineId = [member.id, target.id].sort().join('-');
          if (!processed.has(lineId)) {
            processed.add(lineId);
            
            let d = "";
            let midX = 0;
            let midY = 0;
            
            // Routing Logic
            if (conn.type === 'spouse') {
              const arcHeight = 35;
              midX = (member.x + target.x) / 2;
              midY = member.y - arcHeight;
              d = `M ${member.x} ${member.y} Q ${midX} ${midY}, ${target.x} ${target.y}`;
            } else if (conn.type === 'sibling') {
              const arcHeight = 50;
              midX = (member.x + target.x) / 2;
              midY = member.y + arcHeight;
              d = `M ${member.x} ${member.y} Q ${midX} ${midY}, ${target.x} ${target.y}`;
            } else {
              const offset = (parseInt(member.id, 36) % 20) - 10;
              const controlY = (member.y + target.y) / 2;
              midX = (member.x + target.x) / 2 + offset;
              midY = controlY;
              d = `M ${member.x} ${member.y} 
                   C ${member.x + offset} ${controlY}, 
                     ${target.x + offset} ${controlY}, 
                     ${target.x} ${target.y}`;
            }

            const isFlexible = conn.type === 'spouse' && conn.flexible === true;
            const isMenuOpen = activeMenu === lineId;

            lines.push(
              <g key={lineId} className="group/line">
                {/* 1. Hit Area: Invisible thick path for easier interaction */}
                <path
                  d={d}
                  stroke="transparent"
                  strokeWidth="30"
                  fill="none"
                  className="cursor-pointer pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(isMenuOpen ? null : lineId);
                  }}
                />

                {/* 2. Glow/Shadow Backdrop */}
                <path
                  d={d}
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  className="opacity-20 blur-[3px]"
                />

                {/* 3. Main Visual Path */}
                <path
                  d={d}
                  stroke={getLineColor(conn.type)}
                  strokeWidth={conn.type === 'spouse' ? "5" : "3"}
                  strokeDasharray={ (conn.type === 'sibling' || isFlexible) ? '12 6' : '0'}
                  fill="none"
                  className={`transition-all duration-500 ${isMenuOpen ? 'opacity-100 stroke-[7px]' : 'opacity-40 group-hover/line:opacity-100'}`}
                  style={{ filter: 'url(#shadow)' }}
                  strokeLinecap="round"
                />

                {/* 4. Action Menu */}
                <g transform={`translate(${midX}, ${midY})`}>
                  {/* Default hover indicator (for non-spouse lines) */}
                  {conn.type !== 'spouse' && !isMenuOpen && (
                    <g className="opacity-0 group-hover/line:opacity-100 transition-opacity">
                      <circle r="12" fill="white" className="shadow-lg" stroke={getLineColor(conn.type)} strokeWidth="1.5" />
                      <foreignObject x="-6" y="-6" width="12" height="12">
                        <div className="flex items-center justify-center w-full h-full text-stone-400">
                          <i className="fa-solid fa-link text-[8px]"></i>
                        </div>
                      </foreignObject>
                    </g>
                  )}

                  {/* Status Indicator for Spouse */}
                  {conn.type === 'spouse' && !isMenuOpen && (
                    <g className="opacity-0 group-hover/line:opacity-100 transition-opacity scale-100">
                      <circle r="18" fill="white" className="shadow-2xl" stroke={getLineColor('spouse')} strokeWidth="2" />
                      <foreignObject x="-10" y="-10" width="20" height="20">
                        <div className="flex items-center justify-center w-full h-full text-rose-500 text-xs">
                          <i className={`fa-solid ${isFlexible ? 'fa-unlock' : 'fa-lock'}`}></i>
                        </div>
                      </foreignObject>
                    </g>
                  )}

                  {/* Open Menu Content */}
                  {isMenuOpen && (
                    <foreignObject x="-80" y="-60" width="160" height="120" className="pointer-events-auto">
                      <div className="flex flex-col items-center gap-1.5 animate-in zoom-in-90 duration-300">
                        <div className="bg-white dark:bg-stone-900 p-2 rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.4)] border border-stone-200 dark:border-stone-700 flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between px-1 mb-1">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-stone-400">{conn.type} Bond</p>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConnection?.(member.id, target.id, conn.type);
                                setActiveMenu(null);
                              }}
                              className="text-stone-400 hover:text-rose-600 transition-colors"
                              title="Delete Relationship"
                            >
                              <i className="fa-solid fa-trash-can text-[10px]"></i>
                            </button>
                          </div>
                          
                          {conn.type === 'spouse' ? (
                            <div className="flex gap-1">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isFlexible) onToggleSpouseBond?.(member.id, target.id);
                                  setActiveMenu(null);
                                }}
                                className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${!isFlexible ? 'bg-rose-500 text-white shadow-lg' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                              >
                                <i className="fa-solid fa-lock text-xs mb-1"></i>
                                <span className="text-[7px] font-bold uppercase tracking-tight">Bounded</span>
                              </button>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isFlexible) onToggleSpouseBond?.(member.id, target.id);
                                  setActiveMenu(null);
                                }}
                                className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${isFlexible ? 'bg-rose-600 text-white shadow-lg' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                              >
                                <i className="fa-solid fa-unlock text-xs mb-1"></i>
                                <span className="text-[7px] font-bold uppercase tracking-tight">Freed</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <div className="px-2 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-center">
                                <p className="text-[9px] font-bold text-stone-600 dark:text-stone-300">Active Connection</p>
                                <p className="text-[8px] text-stone-400">Click the trash to remove</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="w-3 h-3 bg-white dark:bg-stone-900 border-b border-r border-stone-200 dark:border-stone-700 rotate-45 -mt-3 shadow-sm"></div>
                      </div>
                    </foreignObject>
                  )}
                </g>
              </g>
            );
          }
        }
      });
    });

    return lines;
  };

  return (
    <svg 
      className="absolute inset-0 pointer-events-none w-[10000px] h-[10000px] overflow-visible"
      style={{ zIndex: activeMenu ? 300 : 5 }}
      onClick={() => setActiveMenu(null)}
    >
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {renderLines()}
    </svg>
  );
};

export default RelationshipLines;
