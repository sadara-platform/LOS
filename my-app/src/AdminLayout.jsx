import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

// Simple SVGs for the Sidebar
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const BrandIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);
const ControlIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Reusable NavLink styling function
  const navLinkStyle = ({ isActive }) => 
    `flex items-center gap-3 px-6 py-4 transition-all duration-300 border-l-2 ${
      isActive 
        ? 'bg-white/10 text-white border-cyan-400 shadow-[inset_4px_0_20px_rgba(34,211,238,0.1)]' 
        : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'
    }`;

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { to: "/admin/add-brand", icon: <BrandIcon />, label: "Add Brand" },
    { to: "/admin/tournament-control", icon: <ControlIcon />, label: "Mission Control" },
    { to: "/admin/analytics", icon: <ChartIcon />, label: "Analytics" },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden">
      
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#111] border-b border-white/10 flex items-center justify-between px-4 z-50">
        <div className="font-black tracking-widest text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          LOS ADMIN
        </div>
        <button onClick={toggleMenu} className="text-gray-400 hover:text-white">
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* SIDEBAR (Desktop Fixed, Mobile Overlay) */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#111] border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 mt-16 md:mt-0">
          <div className="font-black tracking-widest text-2xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            LOS ADMIN
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              onClick={closeMenu}
              className={navLinkStyle}
            >
              <div className="opacity-80">{item.icon}</div>
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(139,92,246,0.5)]">
              AM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Ameer</span>
              <span className="text-xs text-gray-500 font-mono">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY BACKGROUND */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={closeMenu}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pt-16 md:pt-0 relative">
        <Outlet />
      </div>

    </div>
  );
}
