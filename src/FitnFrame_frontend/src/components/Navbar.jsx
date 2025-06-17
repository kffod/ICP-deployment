import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Wallet, UserCircle, LayoutDashboard, Menu, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectWallet } from "@nfid/identitykit/react";
import { useAuth } from '../StateManagement/useContext/useClient';
const ConnectBtn = ({ onClick }) => (

  <button
    onClick={onClick}
    className=" bg-white"
  >
    <div className=" w-full h-full  rounded-xl flex items-center justify-center  ">
      Connect Wallet
    </div>
  </button>
);
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, principal } = useAuth();
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/workouts", icon: Activity, label: "Workouts" },
    { to: "/ai-trainer", icon: Dumbbell, label: "AI Trainer" },
    { to: "/wallet", icon: Wallet, label: "RepCoins" },
  ];

  return (
    <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              FitnFrame
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-500/10 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            {/* <Link
              to="/auth"
              className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <UserCircle className="h-4 w-4" />
              <span>Sign In</span>
            </Link> */}
            {!isAuthenticated && (
              <div className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-purple-600 hover:bg-purple-700 transition-colors">
                <div className="wallet">
                  <ConnectWallet connectButtonComponent={ConnectBtn} />
                </div>
              </div>
            )}


          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-800/50 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-purple-500/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to="/auth"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-purple-600 hover:bg-purple-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserCircle className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;