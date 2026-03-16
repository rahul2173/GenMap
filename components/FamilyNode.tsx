
import React, { useState, useRef, useEffect } from 'react';
import { FamilyMember, RelationType } from '../types';
import { useNavigate } from 'react-router-dom';

interface FamilyNodeProps {
  member: FamilyMember;
  isDragging?: boolean;
  isCurrentUser?: boolean;
  relativeRelation?: string;
  onNodeGrabStart: (memberId: string, clientX: number, clientY: number) => void;
  onAdd: (id: string, type: RelationType) => void;
  onDelete?: (id: string) => void;
  onDragStart?: (fromId: string, type: RelationType, startX: number, startY: number) => void;
}

const FamilyNode: React.FC<FamilyNodeProps> = ({ member, isDragging, isCurrentUser, relativeRelation, onNodeGrabStart, onAdd, onDelete, onDragStart }) => {
  const navigate = useNavigate();
  const [isRippleActive, setIsRippleActive] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const rippleTimeoutRef = useRef<number | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${member.id}`);
  };

  const handleNodeMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    onNodeGrabStart(member.id, e.clientX, e.clientY);
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTools(!showTools);

    if (rippleTimeoutRef.current) {
      window.clearTimeout(rippleTimeoutRef.current);
    }
    
    setIsRippleActive(false);
    
    requestAnimationFrame(() => {
      setIsRippleActive(true);
      rippleTimeoutRef.current = window.setTimeout(() => {
        setIsRippleActive(false);
      }, 600);
    });
  };

  const handleDeleteTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(member.id);
    }
  };

  const handleRelationButtonMouseDown = (e: React.MouseEvent, type: RelationType) => {
    e.stopPropagation();
    if (onDragStart && e.button === 0) {
      onDragStart(member.id, type, member.x, member.y);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
        setShowTools(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonBaseClass = "w-9 h-9 rounded-full text-white flex items-center justify-center shadow-xl transition-all duration-300 pointer-events-auto active:scale-90 hover-pulse cursor-crosshair";
  const getButtonScale = (isVisible: boolean) => isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0";

  return (
    <div 
      ref={nodeRef}
      className={`absolute transition-transform duration-75 ${isDragging ? 'z-[200]' : 'z-10'}`}
      style={{ left: member.x, top: member.y, transform: `translate(-50%, -50%) ${isDragging ? 'scale(1.1)' : 'scale(1)'}` }}
      data-node-id={member.id}
    >
      {/* Node Body */}
      <div 
        onMouseDown={handleNodeMouseDown}
        onClick={handleNodeClick}
        data-node-id={member.id}
        className={`relative w-28 h-28 p-1 rounded-full transition-all duration-300 border-2 ${
          isCurrentUser 
            ? 'border-amber-400 bg-amber-50/20 shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
            : showTools ? 'border-amber-400 bg-white' : 'border-stone-200 bg-white'
        } ${isDragging ? 'cursor-grabbing border-amber-500 shadow-2xl' : 'cursor-grab'} ${isRippleActive ? 'ripple-effect' : ''} shadow-xl`}
      >
        <img 
          src={member.avatar} 
          className={`w-full h-full rounded-full object-cover transition-all duration-500 pointer-events-none ${showTools || isDragging || isCurrentUser ? 'grayscale-0' : 'grayscale'}`}
          alt={member.firstName}
        />
        
        {member.isVerified && (
          <div className="absolute top-0 right-0 w-7 h-7 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-md z-20">
            <i className="fa-solid fa-check text-[10px] text-white"></i>
          </div>
        )}

        {isCurrentUser && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 rounded-full border border-white shadow-md z-30 gold-shimmer">
            <span className="text-[9px] font-black text-emerald-950 tracking-widest uppercase">You</span>
          </div>
        )}
      </div>

      {/* Relation Labels */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center w-max pointer-events-none">
        <p className={`font-bold text-stone-800 text-sm transition-colors ${showTools ? 'text-emerald-700' : isCurrentUser ? 'text-amber-600' : ''}`}>
          {isCurrentUser ? 'You' : `${member.firstName} ${member.lastName}`}
        </p>
        <p className="text-[10px] uppercase font-black text-emerald-500 tracking-tighter drop-shadow-sm">
          {isCurrentUser ? 'Legacy Holder' : relativeRelation}
        </p>
      </div>

      {/* Interaction Buttons */}
      {!isDragging && (
        <>
          <div className="absolute -top-3 -left-3 pointer-events-none z-30">
            <button 
              onClick={handleDeleteTrigger}
              className={`w-9 h-9 rounded-full text-white flex items-center justify-center shadow-xl transition-all duration-300 pointer-events-auto active:scale-90 bg-rose-600 hover:bg-rose-700 ${getButtonScale(showTools)}`}
              title="Remove Member from Tree"
            >
              <i className="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>

          <div className="absolute -bottom-3 -left-3 pointer-events-none z-30">
            <button 
              onClick={handleProfileClick}
              className={`w-9 h-9 rounded-full text-white flex items-center justify-center shadow-xl transition-all duration-300 pointer-events-auto active:scale-90 bg-amber-500 ${getButtonScale(showTools)}`}
              title="View Profile"
            >
              <i className="fa-solid fa-user text-xs"></i>
            </button>
          </div>

          {/* Connection Points */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-20">
            <button 
              onMouseDown={(e) => handleRelationButtonMouseDown(e, 'parent')}
              onClick={(e) => { e.stopPropagation(); onAdd(member.id, 'parent'); }}
              className={`${buttonBaseClass} bg-blue-500 ${getButtonScale(showTools)}`}
            >
              <i className="fa-solid fa-plus text-xs"></i>
            </button>
          </div>

          <div className="absolute top-1/2 -left-10 -translate-y-1/2 pointer-events-none z-20">
            <button 
              onMouseDown={(e) => handleRelationButtonMouseDown(e, 'sibling')}
              onClick={(e) => { e.stopPropagation(); onAdd(member.id, 'sibling'); }}
              className={`${buttonBaseClass} bg-amber-500 ${getButtonScale(showTools)}`}
            >
              <i className="fa-solid fa-plus text-xs"></i>
            </button>
          </div>

          <div className="absolute top-1/2 -right-10 -translate-y-1/2 pointer-events-none z-20">
            <button 
              onMouseDown={(e) => handleRelationButtonMouseDown(e, 'spouse')}
              onClick={(e) => { e.stopPropagation(); onAdd(member.id, 'spouse'); }}
              className={`${buttonBaseClass} bg-rose-500 ${getButtonScale(showTools)}`}
            >
              <i className="fa-solid fa-plus text-xs"></i>
            </button>
          </div>

          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-20">
            <button 
              onMouseDown={(e) => handleRelationButtonMouseDown(e, 'child')}
              onClick={(e) => { e.stopPropagation(); onAdd(member.id, 'child'); }}
              className={`${buttonBaseClass} bg-emerald-500 ${getButtonScale(showTools)}`}
            >
              <i className="fa-solid fa-plus text-xs"></i>
            </button>
          </div>

          <div className="absolute -bottom-3 -right-3 pointer-events-none z-30">
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/messages'); }}
              className={`w-9 h-9 rounded-full text-white flex items-center justify-center shadow-xl transition-all duration-300 pointer-events-auto active:scale-90 bg-emerald-700 ${getButtonScale(showTools)}`}
            >
              <i className="fa-solid fa-comment-dots text-xs"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FamilyNode;
