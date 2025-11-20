import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MobileContainer from './components/layout/MobileContainer';
import BottomNav from './components/layout/BottomNav';

import Home from './pages/Home';
import Earn from './pages/Earn';
import Game from './pages/Game';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import PageTransition from './components/layout/PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/earn" element={<PageTransition><Earn /></PageTransition>} />
        <Route path="/game" element={<PageTransition><Game /></PageTransition>} />
        <Route path="/rewards" element={<PageTransition><Rewards /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <MobileContainer>
        <div className="pb-20 min-h-screen">
          <AnimatedRoutes />
        </div>
        <BottomNav />
      </MobileContainer>
    </Router>
  );
}

export default App;
