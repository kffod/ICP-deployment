import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import AITrainer from './pages/AITrainer';
import Wallet from './pages/Wallet';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/ai-trainer" element={<AITrainer />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;