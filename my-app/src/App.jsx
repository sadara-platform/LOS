import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TournamentLandingPage from './TournamentLandingPage';
import BrandActivationPage from './BrandActivationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TournamentLandingPage />} />
        <Route path="/brand/:brandId" element={<BrandActivationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
