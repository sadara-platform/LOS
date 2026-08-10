import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Application Error</h1>
          <p className="text-gray-400 mb-8 max-w-lg">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl text-sm font-mono text-left max-w-2xl overflow-auto text-red-400">
            Ensure all Environment Variables (like VITE_SUPABASE_URL) are set in your hosting provider (Netlify).
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const TournamentLandingPage = lazy(() => import('./TournamentLandingPage'));
const BrandActivationPage = lazy(() => import('./BrandActivationPage'));
const AddBrandPage = lazy(() => import('./AddBrandPage'));
const BrandOwnerDashboard = lazy(() => import('./features/brand-owner/BrandOwnerDashboard'));
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
      <GlobalErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
          <Route path="/" element={<TournamentLandingPage />} />
          <Route path="/:brandId" element={<BrandActivationPage />} />
          <Route path="/arena" element={<XoArena />} />
          <Route path="/brand-dashboard" element={<BrandOwnerDashboard />} />
          
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
      </GlobalErrorBoundary>
    </Router>
  );
}

export default App;
