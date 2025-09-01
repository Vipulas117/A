import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { ASmanCharacter } from './ASmanCharacter';

interface ErrorScreenProps {
  error: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  error,
  onRetry,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* ASman Character - sad state */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <ASmanCharacter size="large" animate={false} />
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertCircle className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
          <p className="text-gray-600">
            Don't worry! ASman is here to help. You can try again or go back to the previous step.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {onRetry && (
            <motion.button
              onClick={onRetry}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </motion.button>
          )}

          {onBack && (
            <motion.button
              onClick={onBack}
              className="w-full flex items-center justify-center space-x-3 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </motion.button>
          )}
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <div className="bg-blue-100 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              💡 Need Help?
            </h4>
            <p className="text-blue-800 text-sm">
              If this error persists, try refreshing the page or check your internet connection. 
              ASman works best with a stable connection to provide the most accurate lessons.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};