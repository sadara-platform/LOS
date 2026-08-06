import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const TournamentLandingPage = lazy(() => import('./TournamentLandingPage'));
const BrandActivationPage = lazy(() => import('./BrandActivationPage'));
const AddBrandPage = lazy(() => import('./AddBrandPage'));
const TournamentController = lazy(() => import('./TournamentController'));
const AdminLayout = lazy(() => import('./AdminLayout'));
const BrandList = lazy(() => import('./BrandList'));
const BrandDashboard = lazy(() => import('./BrandDashboard'));
const XoArena = lazy(() => import('./XoArena'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white space-y-4">
    <div className="w-12 h-12 border-4 border-white/10 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="text-sm tracking-widest text-gray-500 uppercase animate-pulse">Loading Platform...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<TournamentLandingPage />} />
          <Route path="/:brandId" element={<BrandActivationPage />} />
          <Route path="/arena" element={<XoArena />} />
          
          {/* Admin Routes with Persistent Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="tournament-control" replace />} />
            <Route path="brands" element={<BrandList />} />
            <Route path="brands/:id" element={<BrandDashboard />} />
            <Route path="add-brand" element={<AddBrandPage />} />
            <Route path="tournament-control" element={<TournamentController />} />
            <Route path="analytics" element={
              <div className="p-8 text-center text-gray-500">
                <h2 className="text-2xl font-bold mb-2">Analytics Module</h2>
                <p>Coming Soon...</p>
              </div>
            } />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
