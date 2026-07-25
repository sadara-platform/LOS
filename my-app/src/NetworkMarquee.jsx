import React, { useRef, useEffect } from 'react';
import './NetworkMarquee.css';

const partnersData = [
  {
    title: "Apex Gear",
    subtitle: "Apparel",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80",
    borderColor: "#00f3ff",
    gradient: "linear-gradient(135deg, rgba(0,243,255,0.2), rgba(0,0,0,0.8))"
  },
  {
    title: "Neon Pixels",
    subtitle: "Creative Agency",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=300&q=80",
    borderColor: "#ff00ff",
    gradient: "linear-gradient(135deg, rgba(255,0,255,0.2), rgba(0,0,0,0.8))"
  },
  {
    title: "Cyber Core",
    subtitle: "Hardware",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80",
    borderColor: "#ffd700",
    gradient: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(0,0,0,0.8))"
  },
  {
    title: "Global Net",
    subtitle: "Internet Provider",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
    borderColor: "#6a0dad",
    gradient: "linear-gradient(135deg, rgba(106,13,173,0.2), rgba(0,0,0,0.8))"
  },
  {
    title: "Volt Energy",
    subtitle: "Energy Drink",
    image: "https://images.unsplash.com/photo-1512418490979-9ce98fdb45e1?auto=format&fit=crop&w=300&q=80",
    borderColor: "#00f3ff",
    gradient: "linear-gradient(135deg, rgba(0,243,255,0.2), rgba(0,0,0,0.8))"
  },
  {
    title: "Sonar Tech",
    subtitle: "Audio Equipments",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
    borderColor: "#ff00ff",
    gradient: "linear-gradient(135deg, rgba(255,0,255,0.2), rgba(0,0,0,0.8))"
  }
];

// Stagger the items for the bottom row so they aren't vertically identical to the top row
const topRowData = [...partnersData];
const bottomRowData = [...partnersData].reverse();

export default function NetworkMarquee() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetX = -1000;
    let targetY = -1000;
    let currX = -1000;
    let currY = -1000;
    let animationFrameId;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (currX === -1000) {
        currX = targetX;
        currY = targetY;
      }
    };

    const handleMouseLeave = () => {
      targetX = -1000;
      targetY = -1000;
    };

    const animate = () => {
      currX += (targetX - currX) * 0.15; // Damping for smooth spotlight
      currY += (targetY - currY) * 0.15;

      const cards = Array.from(container.querySelectorAll('.chroma-card'));
      
      // Phase 1: Read layout data for ALL cards across BOTH rows. 
      // Executing map() before forEach() prevents performance-killing layout thrashing.
      const rects = cards.map(card => card.getBoundingClientRect());
      
      // Phase 2: Write specific local CSS Variables to each individual card based on its exact position
      cards.forEach((card, i) => {
        const localX = currX - rects[i].left;
        const localY = currY - rects[i].top;
        card.style.setProperty("--x", `${localX}px`);
        card.style.setProperty("--y", `${localY}px`);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    animate();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="network-marquee-wrapper" ref={containerRef}>
      <div className="network-header" style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingBottom: '3rem' }}>
        <h2 className="section-title">THE LOS NETWORK</h2>
        <p className="section-subtitle">Discover our exclusive partners. Get your codes today.</p>
      </div>
      
      <div className="marquee-tracks-container">
        
        {/* Top Row: Animates Right to Left */}
        <div className="chroma-grid track-top">
          {[...topRowData, ...topRowData].map((partner, idx) => (
            <div key={`top-${idx}`} className="chroma-card" style={{ '--border-color': partner.borderColor, '--card-gradient': partner.gradient }}>
              <div className="chroma-fade">
                <img src={partner.image} alt={partner.title} className="chroma-image" />
                <div className="chroma-info">
                  <h4>{partner.title}</h4>
                  <p>{partner.subtitle}</p>
                </div>
              </div>
              <div className="chroma-overlay">
                <img src={partner.image} alt={partner.title} className="chroma-image-color" />
                <div className="chroma-info-color">
                  <h4>{partner.title}</h4>
                  <p>{partner.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row: Animates Left to Right */}
        <div className="chroma-grid track-bottom">
          {[...bottomRowData, ...bottomRowData].map((partner, idx) => (
            <div key={`bottom-${idx}`} className="chroma-card" style={{ '--border-color': partner.borderColor, '--card-gradient': partner.gradient }}>
              <div className="chroma-fade">
                <img src={partner.image} alt={partner.title} className="chroma-image" />
                <div className="chroma-info">
                  <h4>{partner.title}</h4>
                  <p>{partner.subtitle}</p>
                </div>
              </div>
              <div className="chroma-overlay">
                <img src={partner.image} alt={partner.title} className="chroma-image-color" />
                <div className="chroma-info-color">
                  <h4>{partner.title}</h4>
                  <p>{partner.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
