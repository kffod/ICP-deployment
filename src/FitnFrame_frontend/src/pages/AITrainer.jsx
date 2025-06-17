import React, { useState } from "react";
import { Camera, RefreshCw, Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import PoseTrackerMain from "../components/PoseTracker"; // Import PoseTracker component

const AITrainer = () => {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [repCount, setRepCount] = useState(0);

  const toggleTracking = () => setIsTracking((prev) => !prev);

  const resetSession = () => {
    setRepCount(0);
    setIsTracking(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Personal Trainer</h1>
          <p className="text-gray-400">Get real-time form feedback and exercise tracking</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden">
              {isWebcamEnabled ? (
                <div className="relative">
                  <PoseTrackerMain setRepCount={setRepCount} isTracking={isTracking} /> {/* Embed PoseTracker */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                    <button onClick={toggleTracking} className={`p-4 rounded-full ${isTracking ? "bg-red-500" : "bg-purple-600"} hover:bg-opacity-90 transition-colors`}>
                      {isTracking ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                    <button onClick={resetSession} className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                      <RotateCcw className="h-6 w-6" />
                    </button>
                  </div>
                  <button onClick={() => setIsWebcamEnabled(false)} className="absolute top-4 right-4 p-2 bg-gray-900/50 backdrop-blur-sm rounded-full hover:bg-gray-700">
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-700 rounded-lg">
                  <Camera className="h-12 w-12 text-gray-400 mb-4" />
                  <button onClick={() => setIsWebcamEnabled(true)} className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                    Enable Camera
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6">Exercise Analysis</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Rep Counter</h3>
                  <div className="text-5xl font-bold text-center py-4">{repCount}</div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Real-time Feedback</h3>
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-300">
                      {isTracking ? "Tracking your movement... Keep up the good form!" : "Start tracking to receive real-time feedback"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-medium mb-4">Exercise History</h3>
              <div className="space-y-2">
                {[{ name: "Squats", reps: 15 }, { name: "Push-ups", reps: 20 }, { name: "Lunges", reps: 12 }].map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <div className="font-medium">{exercise.name}</div>
                      <div className="text-sm text-gray-400">{exercise.reps} reps</div>
                    </div>
                    <div className="text-purple-400">✓</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AITrainer;
