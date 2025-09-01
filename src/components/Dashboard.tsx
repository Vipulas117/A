import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Upload, Lightbulb, MessageSquarePlus, Menu } from 'lucide-react';
import { ASmanCharacter } from './ASmanCharacter';

interface DashboardProps {
  onNewChat: () => void;
  onSelectClassSubject: () => void;
  onUploadContent: () => void;
  onGlobalInspiration: () => void;
  onToggleHistory: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNewChat,
  onSelectClassSubject,
  onUploadContent,
  onGlobalInspiration,
  onToggleHistory
}) => {
  const actionCards = [
    {
      title: 'Select Class & Subject',
      description: 'Choose your class and subject to create targeted lessons',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      onClick: onSelectClassSubject
    },
    {
      title: 'Upload Content',
      description: 'Upload images, documents, or voice notes for comprehensive AI analysis and lesson creation',
      icon: Upload,
      color: 'from-green-500 to-green-600',
      onClick: onUploadContent
    },
    {
      title: 'Global Inspiration',
      description: 'Explore teaching methods from around the world',
      icon: Lightbulb,
      color: 'from-purple-500 to-purple-600',
      onClick: onGlobalInspiration
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onToggleHistory}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <img 
                src="/Logo.jpg" 
                alt="ASman Learning Logo" 
                className="w-12 h-12 rounded-full object-cover shadow-md"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                  ASman Learning
                </h1>
                <p className="text-sm text-gray-600">AI Teaching Assistant for Indian Classrooms</p>
              </div>
            </div>

            {/* New Chat Button */}
            <motion.button
              onClick={onNewChat}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-sky-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquarePlus className="w-5 h-5" />
              <span>New Chat</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="/Logo.jpg" 
              alt="ASman Learning Logo" 
              className="w-24 h-24 rounded-full object-cover shadow-lg mx-auto mb-6"
            />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to ASman Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your AI-powered teaching assistant designed specifically for Indian classrooms. 
              Create engaging lessons, analyze content, and inspire students with global teaching methods.
            </p>
          </motion.div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {actionCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={card.onClick}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className={`h-32 bg-gradient-to-br ${card.color} relative`}>
                  <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-300" />
                  <div className="absolute bottom-4 left-6">
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10</div>
              <div className="text-gray-600">Class Levels</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">6</div>
              <div className="text-gray-600">Core Subjects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
              <div className="text-gray-600">Teaching Styles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
              <div className="text-gray-600">Lesson Possibilities</div>
            </div>
          </div>
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Click "New Chat" to begin creating your first AI-powered lesson, or explore our action cards above to discover all the amazing features ASman has to offer.
            </p>
            <motion.button
              onClick={onNewChat}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your First Lesson
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};