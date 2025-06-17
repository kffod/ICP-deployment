import React from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

const Wallet = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="col-span-full lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">RepCoins Balance</h2>
                <Coins className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-4xl font-bold mb-4">1,234 RC</div>
              <div className="text-sm text-gray-400">≈ $123.40 USD</div>
              
              <div className="mt-6 space-y-4">
                <button className="w-full py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                  Send RepCoins
                </button>
                <button className="w-full py-3 border border-purple-600 rounded-lg hover:bg-purple-600/10 transition-colors">
                  Receive RepCoins
                </button>
              </div>
            </motion.div>
          </div>

          <div className="col-span-full lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
              <div className="space-y-4">
                <TransactionItem
                  type="received"
                  amount="100"
                  from="Workout Reward"
                  time="2 hours ago"
                />
                <TransactionItem
                  type="sent"
                  amount="50"
                  from="Premium Class"
                  time="1 day ago"
                />
                <TransactionItem
                  type="received"
                  amount="75"
                  from="Challenge Completion"
                  time="3 days ago"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionItem = ({ type, amount, from, time }) => {
  const isReceived = type === 'received';
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${isReceived ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {isReceived ? (
            <ArrowDownRight className="h-5 w-5 text-green-500" />
          ) : (
            <ArrowUpRight className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div>
          <div className="font-medium">{from}</div>
          <div className="text-sm text-gray-400 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {time}
          </div>
        </div>
      </div>
      <div className={`font-bold ${isReceived ? 'text-green-500' : 'text-red-500'}`}>
        {isReceived ? '+' : '-'}{amount} RC
      </div>
    </div>
  );
};

export default Wallet;