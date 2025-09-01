import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Sparkles, ArrowRight } from 'lucide-react';
import { Subject, ClassLevel } from '../types';
import { SUBJECTS } from '../utils/constants';

interface TopicInputProps {
  selectedClass: ClassLevel;
  selectedSubject: Subject;
  onSubmitTopic: (topic: string) => void;
  onBack: () => void;
}

export const TopicInput: React.FC<TopicInputProps> = ({
  selectedClass,
  selectedSubject,
  onSubmitTopic,
  onBack
}) => {
  const [topic, setTopic] = useState('');
  const [suggestions] = useState(() => {
    // Generate subject-specific suggestions
    const suggestionMap: Record<Subject, string[]> = {
      mathematics: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Geometry', 'Shapes', 'Numbers'],
      science: ['Plants', 'Animals', 'Weather', 'Solar System', 'Human Body', 'Water Cycle', 'Magnetism', 'Light'],
      english: ['Alphabets', 'Phonics', 'Reading', 'Grammar', 'Stories', 'Poems', 'Vocabulary', 'Writing'],
      hindi: ['वर्णमाला', 'व्याकरण', 'कहानी', 'कविता', 'शब्द', 'वाक्य', 'लेखन', 'पठन'],
      'social-studies': ['Family', 'Community', 'India', 'Geography', 'History', 'Culture', 'Government', 'Environment'],
      art: ['Drawing', 'Painting', 'Colors', 'Crafts', 'Dance', 'Music', 'Theatre', 'Creativity']
    };
    return suggestionMap[selectedSubject] || [];
  });

  const subjectInfo = SUBJECTS.find(s => s.id === selectedSubject);
  const classNumber = selectedClass.replace('class-', '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmitTopic(topic.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Subjects</span>
          </button>
        </div>

        {/* Selected Context */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2">
              <span className="text-blue-800 font-medium">Class {classNumber}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className={`flex items-center space-x-2 ${subjectInfo?.color} rounded-full px-4 py-2`}>
              <span className="text-white font-medium">{subjectInfo?.name}</span>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Topic Would You Like to Teach?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter a specific topic or choose from our suggestions to create the perfect lesson for your students.
          </p>
        </motion.div>

        {/* Topic Input Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-lg font-medium text-gray-900 mb-3">
                Topic Name
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={`e.g., ${suggestions[0] || 'Enter topic name'}`}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={!topic.trim()}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white py-4 rounded-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              whileHover={{ scale: topic.trim() ? 1.02 : 1 }}
              whileTap={{ scale: topic.trim() ? 0.98 : 1 }}
            >
              <Sparkles className="w-6 h-6" />
              <span>Create Lesson with ASman</span>
            </motion.button>
          </form>
        </motion.div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
              Popular Topics for {subjectInfo?.name}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-3 text-left bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all text-gray-700 hover:text-blue-700"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};