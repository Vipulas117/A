import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Languages, 
  Volume2, 
  VolumeX, 
  Globe,
  Settings,
  Clock,
  Users
} from 'lucide-react';
import { GlobalStyle } from '../types';

interface TeacherControlsProps {
  isPlaying: boolean;
  isHindi: boolean;
  isAudioEnabled: boolean;
  speechRate: number;
  globalStyle: GlobalStyle;
  onPlayPause: () => void;
  onLanguageToggle: () => void;
  onAudioToggle: () => void;
  onSpeedChange: (rate: number) => void;
  onStyleToggle: () => void;
  lessonData?: {
    lessonTitle: string;
    ageGroup: string;
    duration: string;
  };
}

export const TeacherControls: React.FC<TeacherControlsProps> = ({
  isPlaying,
  isHindi,
  isAudioEnabled,
  speechRate,
  globalStyle,
  onPlayPause,
  onLanguageToggle,
  onAudioToggle,
  onSpeedChange,
  onStyleToggle,
  lessonData
}) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      {/* Lesson Info Header */}
      {lessonData && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img 
              src="/Logo.jpg" 
              alt="ASman Learning Logo" 
              className="w-12 h-12 rounded-full object-cover shadow-md"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-900">{lessonData.lessonTitle}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{lessonData.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{lessonData.ageGroup}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h4 className="text-lg font-bold text-gray-900">Teacher Controls</h4>
          <div className="text-sm text-gray-600">Control your lesson presentation</div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Play/Pause */}
          <motion.button
            onClick={onPlayPause}
            className={`p-3 rounded-full ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isPlaying ? 'Pause Lesson' : 'Play Lesson'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </motion.button>

          {/* Audio Toggle */}
          <motion.button
            onClick={onAudioToggle}
            className={`p-3 rounded-full ${isAudioEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'} text-white transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isAudioEnabled ? 'Disable Audio' : 'Enable Audio'}
          >
            {isAudioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </motion.button>

          {/* Language Toggle */}
          <motion.button
            onClick={onLanguageToggle}
            className={`p-3 rounded-full ${isHindi ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isHindi ? 'Switch to English' : 'Switch to Hindi'}
          >
            <Languages className="w-6 h-6" />
          </motion.button>

          {/* Global Style Toggle */}
          <motion.button
            onClick={onStyleToggle}
            className="p-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Change Teaching Style"
          >
            <Globe className="w-6 h-6" />
          </motion.button>

          {/* Speed Control */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
            <Settings className="w-4 h-4 text-gray-600" />
            <select
              value={speechRate}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              title="Speech Speed"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.8}>0.8x</option>
              <option value={1.0}>1.0x</option>
              <option value={1.2}>1.2x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center space-x-6 mt-4 text-sm">
        <div className={`flex items-center space-x-2 ${isPlaying ? 'text-green-600' : 'text-gray-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span>{isPlaying ? 'Lesson Active' : 'Lesson Paused'}</span>
        </div>
        <div className={`flex items-center space-x-2 ${isAudioEnabled ? 'text-blue-600' : 'text-gray-500'}`}>
          {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{isAudioEnabled ? 'Audio Enabled' : 'Audio Disabled'}</span>
        </div>
        <div className="flex items-center space-x-2 text-orange-600">
          <Languages className="w-4 h-4" />
          <span>{isHindi ? 'Hindi Mode' : 'English Mode'}</span>
        </div>
        <div className="flex items-center space-x-2 text-purple-600">
          <Globe className="w-4 h-4" />
          <span>{globalStyle.charAt(0).toUpperCase() + globalStyle.slice(1)} Style</span>
        </div>
      </div>
    </motion.div>
  );
};