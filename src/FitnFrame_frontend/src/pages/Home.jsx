import React from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative">
      {/* Hero Video Section */}
      <div className="relative h-screen">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.4)' }}
        >
          <source
            src="https://player.vimeo.com/external/477743905.sd.mp4?s=4c6d085d7d3c8ea8d14abf4dfbc4cb6a2a08c1a7&profile_id=164&oauth2_token_id=57447761"
            type="video/mp4"
          />
        </video>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Transform Your Fitness Journey with AI
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300">
                Get personalized workouts and real-time form correction powered by artificial intelligence
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-8 py-4 bg-purple-600 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Training
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-8 py-4 border-2 border-white rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Learn More
                  <ChevronRight className="h-5 w-5 ml-2" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;