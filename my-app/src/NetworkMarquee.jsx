import React, { useRef, useEffect, useState } from 'react';
import { supabase } from './SupabaseClient';
import './NetworkMarquee.css';

export default function NetworkMarquee() {
  const containerRef = useRef(null);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('name, logo_url, primary_color')
        .limit(10);
      
      if (error) {
        console.error('Error fetching brands:', error);
      } else if (data) {
        const formattedBrands = data.map(brand => {
          const color = brand.primary_color || '#7C3AED';
          let r = 124, g = 58, b = 237;
          if (color.startsWith('#') && color.length === 7) {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);
          }
          return {
            title: brand.name || 'Contractor',
            subtitle: 'Contractor',
            image: brand.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80',
            borderColor: color,
            gradient: `linear-gradient(135deg, rgba(${r},${g},${b},0.2), rgba(0,0,0,0.8))`
          };
        });
        setBrands(formattedBrands);
      }
    };
    fetchBrands();
  }, []);

  const topRowData = [...brands];
  const bottomRowData = [...brands].reverse();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || brands.length === 0) return;

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
  }, [brands]);

  // Don't render empty tracks if data is still loading
  if (brands.length === 0) return null;

  return (
    <div className="network-marquee-wrapper" ref={containerRef}>
      <div className="network-header" style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingBottom: '3rem' }}>
        <h2 className="section-title">شبكة LOS</h2>
        <p className="section-subtitle">اكتشف شركاءنا الحصريين. احصل على أكوادك اليوم.</p>
      </div>
      
      <div className="marquee-tracks-container">
        
        {/* Top Row: Animates Right to Left */}
        <div className="chroma-grid track-top">
          {[...topRowData, ...topRowData, ...topRowData].map((partner, idx) => (
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
          {[...bottomRowData, ...bottomRowData, ...bottomRowData].map((partner, idx) => (
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
