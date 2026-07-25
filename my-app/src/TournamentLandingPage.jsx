import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NetworkMarquee from './NetworkMarquee';
import RulesSection from './RulesSection';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

function TournamentLandingPage() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [frameCount, setFrameCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/frame_data.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.frameCount) {
          setFrameCount(data.frameCount);
        }
      })
      .catch(err => {
        console.error("Could not load frame data, maybe frames aren't extracted yet?", err);
      });
  }, []);

  useEffect(() => {
    if (frameCount === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const images = [];
    const scrollObj = {
      frame: 0
    };

    const currentFrame = index => (
      `/frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`
    );

    let loadedImages = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedImages++;
        // We consider it somewhat loaded when a chunk is ready, or wait for all
        if (loadedImages === Math.min(frameCount, 10)) {
          setLoading(false);
          render(); // render first frame asap
        }
      }
      images.push(img);
    }

    function render() {
      const frameIndex = Math.round(scrollObj.frame);
      if (images[frameIndex] && images[frameIndex].complete) {
        const img = images[frameIndex];
        // Calculate the scale to cover the screen
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    window.addEventListener('resize', resize);

    gsap.to(scrollObj, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5
      },
      onUpdate: render 
    });

    return () => {
      window.removeEventListener('resize', resize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [frameCount]);

  useEffect(() => {
    // Set target date to 7 days from now
    const targetDate = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const elDays = document.getElementById('days');
      const elHours = document.getElementById('hours');
      const elMinutes = document.getElementById('minutes');
      const elSeconds = document.getElementById('seconds');

      if (elDays) elDays.innerText = days.toString().padStart(2, '0');
      if (elHours) elHours.innerText = hours.toString().padStart(2, '0');
      if (elMinutes) elMinutes.innerText = minutes.toString().padStart(2, '0');
      if (elSeconds) elSeconds.innerText = seconds.toString().padStart(2, '0');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app" ref={containerRef}>
      {loading && <div className="loader">Loading high-resolution frames...</div>}
      
      <div className="video-container">
        <canvas ref={canvasRef} className="background-canvas"></canvas>
      </div>

      <div className="hero-section">
        <div className="hero-content">
          <h1 className="tournament-title">LOS XO TOURNAMENT #1</h1>
          
          <div className="grand-prize-badge">
            <span>GRAND PRIZE:</span> <span className="prize-amount">500,000 IQD</span>
          </div>
          
          <div className="countdown-container">
            <div className="countdown-box">
              <span className="countdown-value" id="days">00</span>
              <span className="countdown-label">Days</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-value" id="hours">00</span>
              <span className="countdown-label">Hours</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-value" id="minutes">00</span>
              <span className="countdown-label">Minutes</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-value" id="seconds">00</span>
              <span className="countdown-label">Seconds</span>
            </div>
          </div>

          <div className="cta-container">
            <button className="btn btn-primary">Login / My Account</button>
            <button className="btn btn-secondary">How to Join?</button>
          </div>
        </div>
      </div>



      <RulesSection />

      <NetworkMarquee />

      <div className="hall-of-fame-section">
        <div className="hof-content">
          <h2 className="section-title gold-title">HALL OF FAME</h2>
          
          <div className="hof-card">
            {/* 
              FUTURE CHAMPION DATA 
              <div className="champion-data">
                <img src="/avatar-placeholder.jpg" className="champ-avatar" alt="Champion" />
                <h3 className="champ-name">Username</h3>
                <p className="champ-prize">Won: 500,000 IQD</p>
              </div>
            */}
            
            <div className="hof-icon-container">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="trophy-icon">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
            
            <h3 className="hof-subtitle">WHO WILL BE THE FIRST CHAMPION?</h3>
            <p className="hof-desc">The throne is empty. Activate your code and claim the 500,000 IQD grand prize.</p>
          </div>
        </div>
      </div>

      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>LOS</h3>
            <p>Last One Standing</p>
          </div>
          
          <div className="footer-links">
            <a href="#">How to Play</a>
            <a href="#">Rules</a>
            <a href="#">Dispute / Support</a>
          </div>
          
          <div className="footer-socials">
            <a href="#" className="social-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            <a href="#" className="social-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="social-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7"></path></svg>
            </a>
          </div>
        </div>
        
        <div className="footer-copyright">
          <p>&copy; 2026 LOS Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default TournamentLandingPage;
