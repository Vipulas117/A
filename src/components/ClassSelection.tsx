import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, BookOpen } from 'lucide-react';
import { ClassLevel } from '../types';
import { CLASSES } from '../utils/constants';

interface ClassSelectionProps {
  onSelectClass: (classLevel: ClassLevel) => void;
  onBack: () => void;
}

export const ClassSelection: React.FC<ClassSelectionProps> = ({
  onSelectClass,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Select Your Class
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the class level to create age-appropriate lessons that engage and inspire your students.
            </p>
          </motion.div>
        </div>

        {/* Class Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CLASSES.map((classInfo, index) => (
            <motion.button
              key={classInfo.id}
              onClick={() => onSelectClass(classInfo.id)}
              className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                {/* Class Number */}
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform">
                  {classInfo.number}
                </div>
                
                {/* Class Info */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Class {classInfo.number}
                </h3>
                
                {/* Age Range */}
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-3">
                  <Users className="w-4 h-4" />
                  <span>{classInfo.ageRange}</span>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {classInfo.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Helper Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-blue-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <h4 className="font-semibold text-blue-900 mb-2">
              💡 Teaching Tip
            </h4>
            <p className="text-blue-800">
              ASman adapts lesson complexity automatically based on the class level you select. 
              Each class has been calibrated for Indian curriculum standards and age-appropriate learning.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};