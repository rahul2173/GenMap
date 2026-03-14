
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FamilyMember, RelationType, GenderType } from '../types';
import { getRelativeRelationship } from './kinship';
import FamilyNode from './FamilyNode';
import RelationshipLines from './RelationshipLines';
import VerificationModal from './VerificationModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { INITIAL_MEMBERS } from '../data';

interface TreeViewProps {
  members: FamilyMember[];
  setMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
  currentUserId: string;
}

interface DragConnection {
  fromId: string;
  type: RelationType;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

const TreeView: React.FC<TreeViewProps> = ({ members, setMembers, currentUserId }) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [nodeDragOffset, setNodeDragOffset] = useState({ x: 0, y: 0 });
  const [dragPairIds, setDragPairIds] = useState<string[]>([]);

  const [showVerification, setShowVerification] = useState<{ parentId?: string, type?: RelationType, x: number, y: number } | null>(null);
  const [dragConnection, setDragConnection] = useState<DragConnection | null>(null);
  const [placementPreview, setPlacementPreview] = useState<{ x: number, y: number } | null>(null);
  const [memberPendingDelete, setMemberPendingDelete] = useState<FamilyMember | null>(null);
  
  const [undoSnapshot, setUndoSnapshot] = useState<FamilyMember[] | null>(null);
  const [undoActionType, setUndoActionType] = useState<'add' | 'delete' | 'move' | 'disconnect' | 'reset' | null>(null);
  const undoTimeoutRef = useRef<number | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !dragConnection && !placementPreview && !draggingNodeId) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (draggingNodeId) {
      const mouseX = (e.clientX - rect.left - offset.x) / scale;
      const mouseY = (e.clientY - rect.top - offset.y) / scale;
      
      const dx = mouseX - nodeDragOffset.x;
      const dy = mouseY - nodeDragOffset.y;

      setMembers(prev => {
        const mainNode = prev.find(m => m.id === draggingNodeId);
        if (!mainNode) return prev;
        
        const deltaX = dx - mainNode.x;
        const deltaY = dy - mainNode.y;

        return prev.map(m => {
          if (m.id === draggingNodeId || dragPairIds.includes(m.id)) {
            return { ...m, x: m.x + deltaX, y: m.y + deltaY };
          }
          return m;
        });
      });
    } else if (isPanning) {
      setOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    } else if (dragConnection) {
      const mouseX = (e.clientX - rect.left - offset.x) / scale;
      const mouseY = (e.clientY - rect.top - offset.y) / scale;
      setDragConnection({ ...dragConnection, currentX: mouseX, currentY: mouseY });
    } else if (placementPreview) {
      const mouseX = (e.clientX - rect.left - offset.x) / scale;
      const mouseY = (e.clientY - rect.top - offset.y) / scale;
      setPlacementPreview({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsPanning(false);
    
    if (dragConnection) {
      const targetNode = findNodeAtPosition(e.clientX, e.clientY);
      
      if (targetNode && targetNode.id !== dragConnection.fromId) {
        completeConnection(dragConnection.fromId, targetNode.id, dragConnection.type);
      } else if (!targetNode) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const mouseX = (e.clientX - rect.left - offset.x) / scale;
          const mouseY = (e.clientY - rect.top - offset.y) / scale;
          setShowVerification({ 
            parentId: dragConnection.fromId, 
            type: dragConnection.type, 
            x: mouseX, 
            y: mouseY 
          });
        }
      }
      setDragConnection(null);
    }

    if (placementPreview) {
      setShowVerification({ x: placementPreview.x, y: placementPreview.y });
      setPlacementPreview(null);
    }

    setDraggingNodeId(null);
    setDragPairIds([]);
  };

  const handleNodeGrabStart = (memberId: string, clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const mouseX = (clientX - rect.left - offset.x) / scale;
    const mouseY = (clientY - rect.top - offset.y) / scale;

    const spouseConn = member.connections.find(c => c.type === 'spouse');
    const spouseId = spouseConn?.toId;
    const isFlexible = spouseConn?.flexible === true;

    setDraggingNodeId(memberId);
    setDragPairIds(spouseId && !isFlexible ? [spouseId] : []);
    
    setNodeDragOffset({
      x: mouseX - member.x,
      y: mouseY - member.y
    });
  };

  const toggleSpouseBond = (id1: string, id2: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id1) {
        return {
          ...m,
          connections: m.connections.map(c => 
            c.toId === id2 && c.type === 'spouse' 
              ? { ...c, flexible: !c.flexible } 
              : c
          )
        };
      }
      if (m.id === id2) {
        return {
          ...m,
          connections: m.connections.map(c => 
            c.toId === id1 && c.type === 'spouse' 
              ? { ...c, flexible: !c.flexible } 
              : c
          )
        };
      }
      return m;
    }));
  };

  const handleDeleteConnection = (id1: string, id2: string, type: RelationType) => {
    setUndoSnapshot(members);
    setUndoActionType('disconnect');
    
    setMembers(prev => prev.map(m => {
      if (m.id === id1) {
        return { ...m, connections: m.connections.filter(c => !(c.toId === id2 && c.type === type)) };
      }
      if (m.id === id2) {
        const reverseType = reverseRelation(type);
        return { ...m, connections: m.connections.filter(c => !(c.toId === id1 && c.type === reverseType)) };
      }
      return m;
    }));

    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = window.setTimeout(() => {
      setUndoSnapshot(null);
      setUndoActionType(null);
    }, 5000);
  };

  const findNodeAtPosition = (clientX: number, clientY: number) => {
    const elements = document.elementsFromPoint(clientX, clientY);
    for (const el of elements) {
      const nodeId = el.getAttribute('data-node-id');
      if (nodeId) {
        return members.find(m => m.id === nodeId);
      }
    }
    return null;
  };

  const startDraggingConnection = (fromId: string, type: RelationType, startX: number, startY: number) => {
    setIsPanning(false);
    setDragConnection({
      fromId,
      type,
      startX,
      startY,
      currentX: startX,
      currentY: startY
    });
  };

  const completeConnection = (fromId: string, toId: string, type: RelationType) => {
    setMembers(prev => prev.map(m => {
      if (m.id === fromId) {
        if (m.connections.some(c => c.toId === toId && c.type === type)) return m;
        return { ...m, connections: [...m.connections, { toId, type }] };
      }
      if (m.id === toId) {
        const revType = reverseRelation(type);
        if (m.connections.some(c => c.toId === fromId && c.type === revType)) return m;
        return { ...m, connections: [...m.connections, { toId: fromId, type: revType }] };
      }
      return m;
    }));
  };

  const initiateDeleteMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) setMemberPendingDelete(member);
  };

  const handleFinalDelete = () => {
    if (!memberPendingDelete) return;
    const memberId = memberPendingDelete.id;

    setUndoSnapshot(members);
    setUndoActionType('delete');
    setMembers(prev => prev
      .filter(m => m.id !== memberId)
      .map(m => ({
        ...m,
        connections: m.connections.filter(c => c.toId !== memberId)
      }))
    );
    
    setMemberPendingDelete(null);

    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = window.setTimeout(() => {
      setUndoSnapshot(null);
      setUndoActionType(null);
    }, 5000);
  };

  const reverseRelation = (type: RelationType): RelationType => {
    if (type === 'parent') return 'child';
    if (type === 'child') return 'parent';
    return type;
  };

  const handleStartPlacement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = (e.clientX - rect.left - offset.x) / scale;
      const mouseY = (e.clientY - rect.top - offset.y) / scale;
      setPlacementPreview({ x: mouseX, y: mouseY });
    }
  };

  const handleResetArrangement = () => {
    setUndoSnapshot(members);
    setUndoActionType('reset');
    
    setMembers(prev => prev.map(m => {
      const original = INITIAL_MEMBERS.find(im => im.id === m.id);
      if (original) {
        return { ...m, x: original.x, y: original.y };
      }
      return m;
    }));

    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = window.setTimeout(() => {
      setUndoSnapshot(null);
      setUndoActionType(null);
    }, 5000);
  };

  const handleCenterOnUser = () => {
    const currentUser = members.find(m => m.id === currentUserId);
    if (!currentUser || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setScale(1);
    setOffset({
      x: centerX - currentUser.x,
      y: centerY - currentUser.y
    });
  };

  const finalizeAddMember = (data: { firstName: string, lastName: string, gender: GenderType, channel: string }) => {
    if (!showVerification) return;

    const newId = Math.random().toString(36).substr(2, 9);
    const newMember: FamilyMember = {
      id: newId,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      role: showVerification.type?.toUpperCase() || 'MEMBER',
      avatar: `https://picsum.photos/seed/${data.firstName + newId}/200/200`,
      isVerified: false,
      connections: [],
      posts: [],
      x: showVerification.x,
      y: showVerification.y
    };

    if (showVerification.parentId && showVerification.type) {
      const parentId = showVerification.parentId;
      const type = showVerification.type;
      
      setMembers(prev => {
        const updated = prev.map(m => {
          if (m.id === parentId) {
            return { ...m, connections: [...m.connections, { toId: newId, type }] };
          }
          return m;
        });
        newMember.connections = [{ toId: parentId, type: reverseRelation(type) }];
        return [...updated, newMember];
      });
    } else {
      setMembers(prev => [...prev, newMember]);
    }

    setUndoSnapshot(members);
    setUndoActionType('add');
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = window.setTimeout(() => {
      setUndoSnapshot(null);
      setUndoActionType(null);
    }, 5000);
    
    setShowVerification(null);
  };

  const handleUndo = () => {
    if (undoSnapshot) {
      setMembers(undoSnapshot);
      setUndoSnapshot(null);
      setUndoActionType(null);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    }
  };

  const getDragLineColor = (type?: RelationType) => {
    switch (type) {
      case 'parent': return '#3b82f6';
      case 'child': return '#10b981';
      case 'sibling': return '#f59e0b';
      case 'spouse': return '#f43f5e';
      default: return '#cbd5e1';
    }
  };

  const getRelativeRelationshipWrapper = (targetId: string): string => {
    return getRelativeRelationship(targetId, currentUserId, members);
  };

  const legendItems = [
    { label: 'Parent', color: '#3b82f6', style: 'solid' },
    { label: 'Child', color: '#10b981', style: 'solid' },
    { label: 'Sibling', color: '#f59e0b', style: 'dashed' },
    { label: 'Spouse', color: '#f43f5e', style: 'solid' },
  ];

  return (
    <div 
      id="tree-canvas"
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden select-none ${draggingNodeId ? 'cursor-grabbing' : isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Legend Section */}
      <div className="absolute top-6 right-6 z-50 flex flex-col items-end gap-2">
        <button 
          id="tree-legend"
          onClick={() => setShowLegend(!showLegend)}
          className={`bg-white/80 dark:bg-stone-800/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 transition-all hover:scale-105 active:scale-95 flex items-center gap-2`}
        >
          <i className="fa-solid fa-layer-group text-sm text-amber-500"></i>
          <span className="text-[10px] font-black uppercase tracking-widest">Map Legend</span>
          <i className={`fa-solid fa-chevron-${showLegend ? 'up' : 'down'} text-[8px] opacity-40`}></i>
        </button>

        {showLegend && (
          <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-700 w-48 animate-in slide-in-from-top-4 duration-300">
            <h4 className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4">Relationship Guide</h4>
            <div className="space-y-3">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="relative w-8 h-1 shrink-0">
                    <div 
                      className="absolute inset-0 rounded-full" 
                      style={{ 
                        backgroundColor: item.color,
                        borderStyle: item.style === 'dashed' ? 'dashed' : 'solid',
                        borderWidth: item.style === 'dashed' ? '0 0 2px 0' : '0',
                        backgroundImage: item.style === 'dashed' ? `linear-gradient(to right, ${item.color} 50%, transparent 50%)` : 'none',
                        backgroundSize: item.style === 'dashed' ? '8px 100%' : 'auto',
                        height: item.style === 'dashed' ? '2px' : '3px'
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 dark:text-stone-200">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-mouse-pointer text-[8px] text-stone-400"></i>
                <span className="text-[8px] text-stone-400 font-medium">Click lines to edit bonds</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div 
        className="absolute transition-transform duration-75 will-change-transform"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
      >
        <RelationshipLines 
          members={members} 
          onToggleSpouseBond={toggleSpouseBond} 
          onDeleteConnection={handleDeleteConnection}
        />
        
        {placementPreview && (
          <div 
            className="absolute pointer-events-none opacity-50 z-[100]"
            style={{ left: placementPreview.x, top: placementPreview.y, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-28 h-28 rounded-full border-4 border-dashed border-amber-400 bg-amber-500/10 flex items-center justify-center">
              <i className="fa-solid fa-user-plus text-amber-500 text-3xl"></i>
            </div>
            <p className="text-center text-[10px] font-bold text-amber-600 mt-2 uppercase tracking-widest">Release to Place</p>
          </div>
        )}

        {dragConnection && (
          <svg className="absolute inset-0 pointer-events-none w-[10000px] h-[10000px] overflow-visible" style={{ zIndex: 100 }}>
             <path
                d={`M ${dragConnection.startX} ${dragConnection.startY} L ${dragConnection.currentX} ${dragConnection.currentY}`}
                stroke={getDragLineColor(dragConnection.type)}
                strokeWidth="4"
                strokeDasharray="8,4"
                fill="none"
                className="animate-pulse"
                strokeLinecap="round"
              />
              <g transform={`translate(${dragConnection.currentX}, ${dragConnection.currentY})`}>
                <circle r="12" fill={getDragLineColor(dragConnection.type)} className="animate-ping opacity-20" />
                <circle r="6" fill={getDragLineColor(dragConnection.type)} className="shadow-xl" />
              </g>
          </svg>
        )}

        {members.map(member => (
          <FamilyNode 
            key={member.id} 
            member={member} 
            isDragging={draggingNodeId === member.id || dragPairIds.includes(member.id)}
            isCurrentUser={member.id === currentUserId}
            relativeRelation={getRelativeRelationshipWrapper(member.id)}
            onNodeGrabStart={handleNodeGrabStart}
            onAdd={(parentId, type) => {
              const parent = members.find(m => m.id === parentId);
              if (parent) {
                let nx = parent.x;
                let ny = parent.y;
                switch(type) {
                  case 'parent': ny -= 200; break;
                  case 'child': ny += 200; break;
                  case 'sibling': nx += 250; break;
                  case 'spouse': nx += 140; break;
                }
                setShowVerification({ parentId, type, x: nx, y: ny });
              }
            }}
            onDelete={initiateDeleteMember}
            onDragStart={startDraggingConnection}
          />
        ))}
      </div>

      <div id="tree-controls" className="absolute bottom-10 right-10 flex flex-col gap-2 z-50">
        <button 
          id="reset-controls"
          onClick={handleResetArrangement}
          className="w-12 h-12 bg-emerald-600 shadow-xl rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-all hover:scale-110 active:scale-95 group relative"
          title="Reset Arrangement"
        >
          <i className="fa-solid fa-arrows-rotate text-lg"></i>
          <span className="absolute right-14 bg-stone-800 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">Reset Arrangement</span>
        </button>

        <button 
          onMouseDown={handleStartPlacement}
          className="w-12 h-12 bg-amber-500 shadow-xl rounded-full flex items-center justify-center text-white hover:bg-amber-600 transition-all hover:scale-110 active:scale-95 group relative"
          title="Drag to Place New Member"
        >
          <i className="fa-solid fa-user-plus text-lg"></i>
          <span className="absolute right-14 bg-stone-800 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">Drag to Place</span>
        </button>

        <button 
          id="center-controls"
          onClick={handleCenterOnUser}
          className="w-12 h-12 bg-blue-500 shadow-xl rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-all hover:scale-110 active:scale-95 group relative"
          title="Center on Me"
        >
          <i className="fa-solid fa-crosshairs text-lg"></i>
          <span className="absolute right-14 bg-stone-800 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">Center on Me</span>
        </button>

        <div className="flex flex-col gap-2 mt-4 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-stone-200">
           <button 
             onClick={() => setScale(s => Math.min(s + 0.1, 2))}
             className="w-8 h-8 rounded-xl bg-white text-stone-600 hover:bg-stone-50 hover:text-emerald-600 transition-colors flex items-center justify-center shadow-sm"
           >
             <i className="fa-solid fa-plus text-xs"></i>
           </button>
           <button 
             onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
             className="w-8 h-8 rounded-xl bg-white text-stone-600 hover:bg-stone-50 hover:text-emerald-600 transition-colors flex items-center justify-center shadow-sm"
           >
             <i className="fa-solid fa-minus text-xs"></i>
           </button>
        </div>
      </div>

      {showVerification && (
        <VerificationModal 
          relationType={showVerification.type || 'member'} 
          onClose={() => setShowVerification(null)} 
          onSubmit={finalizeAddMember} 
        />
      )}

      {memberPendingDelete && (
        <DeleteConfirmationModal 
          member={memberPendingDelete} 
          onConfirm={handleFinalDelete} 
          onCancel={() => setMemberPendingDelete(null)} 
        />
      )}

      {undoSnapshot && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-[100] animate-in slide-in-from-bottom-4">
           <span className="text-xs font-bold">Action Performed: {undoActionType}</span>
           <button onClick={handleUndo} className="text-amber-400 font-black text-xs hover:underline uppercase tracking-widest">Undo</button>
        </div>
      )}
    </div>
  );
};

export default TreeView;
