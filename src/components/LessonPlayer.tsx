import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  Languages, 
  Lightbulb, 
  CheckCircle,
  Circle,
  RefreshCw,
  Globe,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Settings
} from 'lucide-react';
import { LessonContent, GlobalStyle, ClassLevel, Subject } from '../types';
import { GlobalStyleSelector } from './GlobalStyleSelector';
import { TeacherControls } from './TeacherControls';

interface LessonPlayerProps {
  lessonContent: LessonContent;
  classLevel: ClassLevel;
  subject: Subject;
  topic: string;
  globalStyle: GlobalStyle;
  onBack: () => void;
  onStyleChange: (style: GlobalStyle) => void;
  onRequestGlobalVersion?: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lessonContent,
  classLevel,
  subject,
  topic,
  globalStyle,
  onBack,
  onStyleChange,
  onRequestGlobalVersion
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHindi, setIsHindi] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(0.8);
  const [currentSection, setCurrentSection] = useState<'intro' | 'content' | 'questions' | 'activity'>('intro');

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const classNumber = classLevel.replace('class-', '');
  const currentQuestion = lessonContent.questions[currentQuestionIndex];

  // Text-to-Speech functionality
  const speakText = (text: string, language: 'en-IN' | 'hi-IN' = 'en-IN') => {
    if (!isAudioEnabled || !('speechSynthesis' in window)) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      const textToSpeak = getTranslatedText(lessonContent.explanation);
      speakText(textToSpeak, isHindi ? 'hi-IN' : 'en-IN');
    }
  };

  const speakSection = (sectionText: string) => {
    const textToSpeak = getTranslatedText(sectionText);
    speakText(textToSpeak, isHindi ? 'hi-IN' : 'en-IN');
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < lessonContent.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getTranslatedText = (text: string): string => {
    if (!isHindi) return text;
    
    // Simple translation logic using the hindiTranslation map
    let translatedText = text;
    Object.entries(lessonContent.hindiTranslation).forEach(([english, hindi]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedText = translatedText.replace(regex, hindi);
    });
    return translatedText;
  };

  const formatLessonContent = (content: string) => {
    // Split content into sections for better readability
    const sections = content.split('###').filter(section => section.trim());
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      const title = lines[0]?.replace(/^#+\s*/, '').trim();
      const body = lines.slice(1).join('\n').trim();
      
      if (!title) return null;

      return (
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-blue-500 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <button
                  onClick={() => speakSection(section)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Read</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="prose prose-lg max-w-none">
                {body.split('\n').map((line, lineIndex) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <h4 key={lineIndex} className="font-bold text-gray-900 mt-4 mb-2">
                        {line.replace(/\*\*/g, '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('•') || line.match(/^\d+\./)) {
                    return (
                      <p key={lineIndex} className="text-gray-700 ml-4 mb-2">
                        {getTranslatedText(line)}
                      </p>
                    );
                  }
                  if (line.trim()) {
                    return (
                      <p key={lineIndex} className="text-gray-700 mb-3 leading-relaxed">
                        {getTranslatedText(line)}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-md">
              <span className="text-sm text-gray-600">
                {lessonContent.lessonData?.lessonTitle || `Class ${classNumber} • ${subject} • ${topic}`}
              </span>
            </div>
          </div>
        </div>

        {/* Professional Teacher Controls */}
        <TeacherControls
          isPlaying={isPlaying}
          isHindi={isHindi}
          isAudioEnabled={isAudioEnabled}
          speechRate={speechRate}
          globalStyle={globalStyle}
          onPlayPause={togglePlayPause}
          onLanguageToggle={() => setIsHindi(!isHindi)}
          onAudioToggle={() => setIsAudioEnabled(!isAudioEnabled)}
          onSpeedChange={setSpeechRate}
          onStyleToggle={() => setShowStyleSelector(!showStyleSelector)}
          lessonData={lessonContent.lessonData}
        />

        {/* Global Style Selector */}
        <AnimatePresence>
          {showStyleSelector && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <GlobalStyleSelector
                selectedStyle={globalStyle}
                onSelectStyle={(style) => {
                  onStyleChange(style);
                  setShowStyleSelector(false);
                }}
                showTitle={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Lesson Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lesson Content - Takes 2 columns */}
          <div className="lg:col-span-2">
            {formatLessonContent(lessonContent.explanation)}
          </div>

          {/* Interactive Questions - Takes 1 column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Interactive Questions
                </h3>
                <div className="text-sm text-gray-500">
                  {currentQuestionIndex + 1} of {lessonContent.questions.length}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Question */}
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-blue-900">
                        Question {currentQuestionIndex + 1}
                      </h4>
                      <button
                        onClick={() => speakSection(currentQuestion.question)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-blue-800">
                      {getTranslatedText(currentQuestion.question)}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === index;
                      const isCorrect = index === currentQuestion.correct;
                      const showResult = selectedAnswers[currentQuestionIndex] !== undefined;

                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showResult}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            showResult
                              ? isCorrect
                                ? 'border-green-500 bg-green-50'
                                : isSelected
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 bg-gray-50'
                              : isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          whileHover={!showResult ? { scale: 1.02 } : {}}
                          whileTap={!showResult ? { scale: 0.98 } : {}}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {showResult ? (
                                isCorrect ? (
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : isSelected ? (
                                  <Circle className="w-6 h-6 text-red-600" />
                                ) : (
                                  <Circle className="w-6 h-6 text-gray-400" />
                                )
                              ) : (
                                <Circle className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                              )}
                            </div>
                            <span className={`${
                              showResult && isCorrect
                                ? 'text-green-900 font-medium'
                                : showResult && isSelected
                                ? 'text-red-900'
                                : 'text-gray-900'
                            }`}>
                              {getTranslatedText(option)}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Answer Explanation */}
                  {selectedAnswers[currentQuestionIndex] !== undefined && currentQuestion.explanation && (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
                    >
                      <h5 className="font-semibold text-yellow-900 mb-2">💡 Explanation</h5>
                      <p className="text-yellow-800 text-sm">
                        {getTranslatedText(currentQuestion.explanation)}
                      </p>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6">
                    <button
                      onClick={prevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
                    >
                      <SkipBack className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    
                    <div className="flex space-x-2">
                      {lessonContent.questions.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentQuestionIndex
                              ? 'bg-blue-600'
                              : selectedAnswers[index] !== undefined
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextQuestion}
                      disabled={currentQuestionIndex === lessonContent.questions.length - 1}
                      className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
                    >
                      <span>Next</span>
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Global Version Option */}
        {!lessonContent.isGlobalVersion && onRequestGlobalVersion && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">🌍 Want More Global Perspectives?</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Unlock enhanced content with international examples, cross-cultural insights, 
              and global best practices from around the world!
            </p>
            <motion.button
              onClick={onRequestGlobalVersion}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate Global Version
            </motion.button>
          </motion.div>
        )}

        {/* Global Version Indicator */}
        {lessonContent.isGlobalVersion && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center"
          >
            <div className="flex items-center justify-center space-x-2">
              <Globe className="w-6 h-6" />
              <span className="text-lg font-semibold">Enhanced Global Version Active</span>
            </div>
            <p className="text-green-100 mt-2">
              This lesson includes international perspectives and global best practices!
            </p>
          </motion.div>
        )}

        {/* Hindi Translations Panel */}
        {Object.keys(lessonContent.hindiTranslation).length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Languages className="w-6 h-6 text-orange-500 mr-2" />
                Key Terms Translation
              </h3>
              <button
                onClick={() => {
                  const termsText = Object.entries(lessonContent.hindiTranslation)
                    .map(([english, hindi]) => `${english} means ${hindi}`)
                    .join('. ');
                  speakSection(termsText);
                }}
                className="flex items-center space-x-2 bg-orange-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-700 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Read Terms</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(lessonContent.hindiTranslation).map(([english, hindi]) => (
                <div key={english} className="p-3 bg-orange-50 rounded-lg text-center border border-orange-200">
                  <div className="font-medium text-gray-900 mb-1">{english}</div>
                  <div className="text-orange-600 font-medium text-lg">{hindi}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};