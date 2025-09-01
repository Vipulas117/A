import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Clock, BookOpen } from 'lucide-react';
import { ChatSession } from '../types';
import { ASmanCharacter } from './ASmanCharacter';

interface ChatSidebarProps {
  isOpen: boolean;
  sessions: ChatSession[];
  currentSessionId?: string;
  onToggle: () => void;
  onSelectSession: (sessionId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  sessions,
  currentSessionId,
  onToggle,
  onSelectSession
}) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 w-80 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src="/Logo.jpg" 
              alt="ASman Learning Logo" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">Chat History</h3>
              <p className="text-sm text-gray-500">{sessions.length} conversations</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No chat history yet</p>
              <p className="text-sm">Start a new lesson to begin!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <motion.button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-md ${
                  currentSessionId === session.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-600 mt-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {session.title}
                    </h4>
                    {session.classLevel && session.subject && (
                      <p className="text-sm text-gray-500 truncate">
                        {session.classLevel.replace('class-', 'Class ')} • {session.subject}
                      </p>
                    )}
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(session.timestamp)}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-center">
            <img 
              src="/Logo.jpg" 
              alt="ASman Learning Logo" 
              className="w-8 h-8 rounded-full object-cover mx-auto mb-2"
            />
            <p className="text-xs text-gray-500">
              ASman Learning v1.0
              <br />
              Made for Indian Teachers
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};