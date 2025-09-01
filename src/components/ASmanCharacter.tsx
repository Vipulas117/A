import React from 'react';
import { motion } from 'framer-motion';

interface ASmanCharacterProps {
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
  className?: string;
}

export const ASmanCharacter: React.FC<ASmanCharacterProps> = ({ 
  size = 'medium', 
  animate = true,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16', 
    large: 'w-24 h-24'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} relative`}
      initial={animate ? { scale: 0.8, opacity: 0 } : {}}
      animate={animate ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* ASman character - representing the child reaching for knowledge */}
      <motion.div
        className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
        whileHover={animate ? { scale: 1.05 } : {}}
        whileTap={animate ? { scale: 0.95 } : {}}
      >
        <motion.div
          className="text-white font-bold text-lg"
          initial={animate ? { y: 2 } : {}}
          animate={animate ? { y: [2, -2, 2] } : {}}
          transition={animate ? { repeat: Infinity, duration: 2 } : {}}
        >
          A
        </motion.div>
      </motion.div>
      
      {/* Knowledge spark above */}
      {animate && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.div>
  );
};