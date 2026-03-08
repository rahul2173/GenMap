
import React, { useState, useEffect, useRef } from 'react';

export interface TutorialStep {
  targetId?: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TutorialGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS: TutorialStep[] = [
  {
    title: "Welcome to GenMap",
    content: "Experience your family history like never before. This interactive ancestry waterfall allows you to explore, edit, and discover your lineage in real-time.",
    position: 'center'
  },
  {
    targetId: 'header-search',
    title: "Smart Search & AI",
    content: "Quickly find relatives by name or use the camera icon to scan old photos. Our AI will match faces to members in your tree automatically.",
    position: 'bottom'
  },
  {
    targetId: 'main-navigation',
    title: "Navigation Hub",
    content: "Switch between the Tree View, your Social Feed, Messages, and Profile settings using the sidebar.",
    position: 'right'
  },
  {
    targetId: 'tree-canvas',
    title: "Interactive Canvas",
    content: "This is your living tree. Click and drag on the background to pan. Hover over any member to reveal relationship tools (+ buttons) to add parents, spouses, or children.",
    position: 'center'
  },
  {
    targetId: 'tree-legend',
    title: "Relationship Guide",
    content: "Confused by the lines? Open the legend to understand the color-coded connections between family members.",
    position: 'bottom'
  },
  {
    targetId: 'tree-controls',
    title: "View Controls",
    content: "Zoom in to see details or zoom out for the big picture. Use the 'Drag to Place' button to manually position new floating members.",
    position: 'left'
  },
  {
    title: "You're All Set!",
    content: "You are ready to build your legacy. Remember, you can revisit this guide anytime in the Settings menu.",
    position: 'center'
  }
];

const TutorialGuide: React.FC<TutorialGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const step = STEPS[currentStep];
      if (step.targetId) {
        const element = document.getElementById(step.targetId);
        if (element) {
          setRect(element.getBoundingClientRect());
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // Fallback if element not found
          setRect(null);
        }
      } else {
        setRect(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
      setCurrentStep(0);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    onClose();
    setCurrentStep(0);
  };

  // Calculate tooltip position
  const getTooltipStyle = () => {
    if (!rect || step.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const
      };
    }

    const gap = 20;
    let top = 0;
    let left = 0;
    let transform = '';

    switch (step.position) {
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2;
        transform = 'translateX(-50%)';
        break;
      case 'top':
        top = rect.top - gap;
        left = rect.left + rect.width / 2;
        transform = 'translate(-50%, -100%)';
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + gap;
        transform = 'translateY(-50%)';
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - gap;
        transform = 'translate(-100%, -50%)';
        break;
    }

    return { top, left, transform, position: 'fixed' as const };
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Dimmed Background */}
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-all duration-500">
        {/* Cutout Effect using composite layers or simple absolute positioning */}
        {rect && (
          <div 
            className="absolute bg-transparent shadow-[0_0_0_9999px_rgba(28,25,23,0.7)] rounded-xl transition-all duration-500 border-2 border-amber-400"
            style={{
              top: rect.top - 5,
              left: rect.left - 5,
              width: rect.width + 10,
              height: rect.height + 10,
            }}
          />
        )}
      </div>

      {/* Tooltip Card */}
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl p-8 max-w-sm shadow-2xl border border-stone-200 dark:border-stone-700 animate-in fade-in zoom-in-95 duration-300 relative"
        style={getTooltipStyle()}
      >
        <div className="absolute -top-3 left-8 px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
          Step {currentStep + 1}/{STEPS.length}
        </div>
        
        <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-500 mb-3 font-serif">
          {step.title}
        </h3>
        <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-8">
          {step.content}
        </p>

        <div className="flex items-center justify-between">
          <button 
            onClick={handleSkip}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button 
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            )}
            <button 
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
            >
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <i className="fa-solid fa-arrow-right"></i>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialGuide;
