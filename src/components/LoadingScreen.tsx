import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { ASmanCharacter } from './ASmanCharacter';

interface LoadingScreenProps {
  message?: string;
  isGlobalVersion?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "ASman is creating your lesson...",
  isGlobalVersion = false
}) => {
  const loadingSteps = isGlobalVersion ? [
    { icon: BookOpen, text: "Researching global teaching methods" },
    { icon: Lightbulb, text: "Gathering international perspectives" },
    { icon: Sparkles, text: "Creating comprehensive 800-word lesson pack" }
  ] : [
    { icon: BookOpen, text: "Analyzing Indian curriculum standards" },
    { icon: Lightbulb, text: "Creating professional 500-word lesson" },
    { icon: Sparkles, text: "Adding audio-friendly formatting" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* ASman Character */}
        <motion.div
          className="mb-8"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ASmanCharacter size="large" />
        </motion.div>

        {/* Main Message */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          {isGlobalVersion ? "🌍 Creating Global Version..." : message}
        </motion.h2>

        {/* Loading Steps */}
        <div className="space-y-4 mb-8">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex items-center space-x-3 text-gray-600"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              >
                <step.icon className="w-5 h-5 text-blue-600" />
              </motion.div>
              <span>{step.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-sky-600 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Encouragement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-gray-500"
        >
          Creating an amazing learning experience for your students...
        </motion.p>
      </div>
    </div>
  );
};