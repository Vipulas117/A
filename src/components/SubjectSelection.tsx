import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, Microscope, BookOpen, Languages, Globe, Palette } from 'lucide-react';
import { Subject, ClassLevel } from '../types';
import { SUBJECTS } from '../utils/constants';

interface SubjectSelectionProps {
  selectedClass: ClassLevel;
  onSelectSubject: (subject: Subject) => void;
  onBack: () => void;
}

const iconMap = {
  Calculator,
  Microscope,
  BookOpen,
  Languages,
  Globe,
  Palette
};

export const SubjectSelection: React.FC<SubjectSelectionProps> = ({
  selectedClass,
  onSelectSubject,
  onBack
}) => {
  const classNumber = selectedClass.replace('class-', '');

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
            <span>Back to Classes</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {classNumber}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Subject
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select a subject for Class {classNumber} to create engaging, curriculum-aligned lessons.
            </p>
          </motion.div>
        </div>

        {/* Subject Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SUBJECTS.map((subject, index) => {
            const IconComponent = iconMap[subject.icon as keyof typeof iconMap];
            
            return (
              <motion.button
                key={subject.id}
                onClick={() => onSelectSubject(subject.id)}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 text-left"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Subject Icon and Color */}
                <div className={`w-16 h-16 ${subject.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Subject Info */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {subject.name}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {subject.description}
                </p>

                {/* Class Level Indicator */}
                <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium">
                  <span>Class {classNumber}</span>
                  <span>•</span>
                  <span>Ready to explore!</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Helper Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 max-w-3xl mx-auto">
            <h4 className="font-semibold text-orange-900 mb-2">
              🌟 Did You Know?
            </h4>
            <p className="text-orange-800">
              ASman can adapt any subject to different teaching styles from around the world. 
              After selecting your subject, you'll be able to choose from Chinese, Japanese, American, or European teaching methodologies!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};