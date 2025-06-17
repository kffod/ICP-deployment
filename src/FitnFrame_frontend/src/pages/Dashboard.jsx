import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Activity, Flame, Trophy, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Workout Duration',
        data: [30, 45, 60, 45, 75, 60, 90],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };

  const stats = [
    { icon: Activity, label: 'Workouts', value: '12', unit: 'this week' },
    { icon: Flame, label: 'Calories', value: '3,500', unit: 'burned' },
    { icon: Trophy, label: 'Achievements', value: '8', unit: 'unlocked' },
    { icon: TrendingUp, label: 'Progress', value: '85%', unit: 'completed' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alex!</h1>
          <p className="text-gray-400">Track your fitness journey and achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-6 w-6 text-purple-500" />
                <span className="text-sm text-gray-400">{stat.unit}</span>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
            <Line data={chartData} options={chartOptions} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
            <div className="space-y-4">
              {[
                { title: 'Workout Streak', desc: '7 days in a row', date: 'Today' },
                { title: 'Perfect Form', desc: '10 perfect squats', date: 'Yesterday' },
                { title: 'New PR', desc: 'Bench Press 180lbs', date: '2 days ago' },
              ].map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-gray-400">{achievement.desc}</div>
                  </div>
                  <div className="text-sm text-gray-400">{achievement.date}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;