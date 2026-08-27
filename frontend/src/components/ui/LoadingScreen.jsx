import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Loader2 } from 'lucide-react';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl glass">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full animate-[pulse-glow_2s_infinite]" />
          <div className="relative bg-indigo-500/20 p-4 rounded-full border border-indigo-500/30">
            <Cloud className="w-12 h-12 text-indigo-500 drop-shadow-md" />
          </div>
        </motion.div>
        
        <div className="flex flex-col items-center space-y-2">
          <motion.h2 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            VIT Cloud
          </motion.h2>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
