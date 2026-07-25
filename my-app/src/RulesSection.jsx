import React, { useState, useRef } from 'react';
import './RulesSection.css';

const rulesData = [
  {
    id: 1,
    title: "Sudden Death",
    desc: "Lose and you're out immediately.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rule-svg cyan-glow-svg">
        <path d="M16 16l4 4"></path>
        <path d="M4 4l16 16"></path>
        <path d="M20 4l-4 4"></path>
        <path d="M4 20l4-4"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
    glowClass: 'cyan-glow'
  },
  {
    id: 2,
    title: "Classic XO",
    desc: "Pure strategy in a digital arena.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rule-svg magenta-glow-svg">
        <path d="M8 4v16"></path>
        <path d="M16 4v16"></path>
        <path d="M4 8h16"></path>
        <path d="M4 16h16"></path>
      </svg>
    ),
    glowClass: 'magenta-glow'
  },
  {
    id: 3,
    title: "Time Limit",
    desc: "Hesitate, run out of time, and forfeit.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rule-svg yellow-glow-svg">
        <circle cx="12" cy="13" r="8"></circle>
        <path d="M12 9v4l2 2"></path>
        <path d="M10 2h4"></path>
        <path d="M12 2v2"></path>
      </svg>
    ),
    glowClass: 'yellow-glow'
  }
];

export default function RulesSection() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);
  
  // Angle per item (360 / 3 = 120 degrees)
  const angle = 360 / rulesData.length;

  const handlePointerDown = (e) => {
    setIsDragging(true);
    startX.current = e.clientX || (e.touches && e.touches[0].clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = x - startX.current;
    
    // Sensitivity factor (lower means slower rotation)
    const rotationDelta = deltaX * 0.4; 
    setRotation(currentRotation.current + rotationDelta);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Snap to the nearest card
    const snappedRotation = Math.round(rotation / angle) * angle;
    setRotation(snappedRotation);
    currentRotation.current = snappedRotation;
  };

  const handleNext = () => {
    setRotation(prev => {
      const snapped = Math.round(prev / angle) * angle;
      const newRotation = snapped - angle;
      currentRotation.current = newRotation;
      return newRotation;
    });
  };

  const handlePrev = () => {
    setRotation(prev => {
      const snapped = Math.round(prev / angle) * angle;
      const newRotation = snapped + angle;
      currentRotation.current = newRotation;
      return newRotation;
    });
  };

  // Calculate which index is currently facing the front
  const normalizedRotation = Math.round(rotation / angle) * angle;
  let activeIndex = Math.round(normalizedRotation / angle) % rulesData.length;
  
  if (activeIndex > 0) {
    activeIndex = rulesData.length - activeIndex;
  } else if (activeIndex < 0) {
    activeIndex = Math.abs(activeIndex);
  } else {
    activeIndex = 0; // Handle -0 safely
  }

  return (
    <div className="rules-section-3d">
      <div className="rules-header">
        <h2 className="section-title">RULES OF THE BATTLE</h2>
      </div>
      
      <div className="carousel-wrapper">
        <button className="carousel-nav prev-btn" onClick={handlePrev}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div 
          className="carousel-container"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: 'none' }}
        >
          <div 
            className={`carousel-scene ${!isDragging ? 'snap-transition' : ''}`}
            style={{ transform: `translateZ(-350px) rotateY(${rotation}deg)` }}
          >
            {rulesData.map((rule, idx) => {
              const itemRotation = idx * angle;
              const isActive = idx === activeIndex;
              
              return (
                <div 
                  key={rule.id}
                  className={`carousel-card ${isActive ? 'active-card' : ''} ${rule.glowClass}`}
                  style={{ 
                    transform: `rotateY(${itemRotation}deg) translateZ(350px)` 
                  }}
                >
                  <div className="card-glass">
                    <div className="rule-icon-container">
                      {rule.icon}
                    </div>
                    <h3 className="rule-title-3d">{rule.title}</h3>
                    <p className="rule-desc-3d">{rule.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="carousel-nav next-btn" onClick={handleNext}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
