import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ChatSidebar } from './components/ChatSidebar';
import { ClassSelection } from './components/ClassSelection';
import { SubjectSelection } from './components/SubjectSelection';
import { TopicInput } from './components/TopicInput';
import { GlobalStyleSelector } from './components/GlobalStyleSelector';
import { UploadArea } from './components/UploadArea';
import { LessonPlayer } from './components/LessonPlayer';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorScreen } from './components/ErrorScreen';
import { useChatSessions } from './hooks/useChatSessions';
import { useGemini } from './hooks/useGemini';
import { ClassLevel, Subject, GlobalStyle, LessonContent } from './types';

type AppStep = 
  | 'dashboard'
  | 'class-selection'
  | 'subject-selection'
  | 'topic-input'
  | 'style-selection'
  | 'upload'
  | 'lesson-player'
  | 'loading'
  | 'error';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('dashboard');
  const [selectedClass, setSelectedClass] = useState<ClassLevel | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<GlobalStyle>('american');
  const [currentLesson, setCurrentLesson] = useState<LessonContent | null>(null);

  const {
    sessions,
    currentSession,
    isHistoryOpen,
    createNewSession,
    updateSession,
    selectSession,
    generateSessionTitle,
    toggleHistory
  } = useChatSessions();

  const { generateLesson, isLoading, error, clearError } = useGemini();

  // Navigation handlers
  const handleNewChat = () => {
    createNewSession();
    setCurrentStep('class-selection');
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedTopic('');
    setCurrentLesson(null);
    clearError();
  };

  const handleSelectClass = (classLevel: ClassLevel) => {
    setSelectedClass(classLevel);
    setCurrentStep('subject-selection');
    
    if (currentSession) {
      updateSession(currentSession.id, { classLevel });
    }
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentStep('topic-input');
    
    if (currentSession) {
      updateSession(currentSession.id, { subject });
    }
  };

  const handleSubmitTopic = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentStep('style-selection');
    
    if (currentSession) {
      const title = generateSessionTitle(selectedClass || undefined, selectedSubject, topic);
      updateSession(currentSession.id, { 
        topic,
        title
      });
    }
  };

  const handleStyleSelection = async (style: GlobalStyle) => {
    setSelectedStyle(style);
    
    if (selectedClass && selectedSubject && selectedTopic) {
      setCurrentStep('loading');
      
      try {
        const lesson = await generateLesson(selectedClass, selectedSubject, selectedTopic, style);
        
        if (lesson) {
          setCurrentLesson(lesson);
          setCurrentStep('lesson-player');
          
          if (currentSession) {
            updateSession(currentSession.id, {
              lessonContent: lesson,
              globalStyle: style
            });
          }
        } else {
          setCurrentStep('error');
        }
      } catch (err) {
        setCurrentStep('error');
      }
    }
  };

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      selectSession(sessionId);
      
      if (session.lessonContent) {
        setSelectedClass(session.classLevel as ClassLevel);
        setSelectedSubject(session.subject as Subject);
        setSelectedTopic(session.topic || '');
        setSelectedStyle(session.globalStyle || 'american');
        setCurrentLesson(session.lessonContent);
        setCurrentStep('lesson-player');
      } else {
        setCurrentStep('dashboard');
      }
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'class-selection':
        setCurrentStep('dashboard');
        break;
      case 'subject-selection':
        setCurrentStep('class-selection');
        break;
      case 'topic-input':
        setCurrentStep('subject-selection');
        break;
      case 'style-selection':
        setCurrentStep('topic-input');
        break;
      case 'lesson-player':
        setCurrentStep('dashboard');
        break;
      case 'upload':
        setCurrentStep('dashboard');
        break;
      case 'error':
        setCurrentStep('dashboard');
        break;
      default:
        setCurrentStep('dashboard');
    }
  };

  const handleRetry = () => {
    if (selectedClass && selectedSubject && selectedTopic) {
      handleStyleSelection(selectedStyle);
    } else {
      setCurrentStep('dashboard');
    }
  };

  const handleStyleChange = async (newStyle: GlobalStyle) => {
    if (selectedClass && selectedSubject && selectedTopic) {
      setSelectedStyle(newStyle);
      setCurrentStep('loading');
      
      try {
        const lesson = await generateLesson(selectedClass, selectedSubject, selectedTopic, newStyle, currentLesson?.isGlobalVersion);
        
        if (lesson) {
          setCurrentLesson(lesson);
          setCurrentStep('lesson-player');
          
          if (currentSession) {
            updateSession(currentSession.id, {
              lessonContent: lesson,
              globalStyle: newStyle
            });
          }
        }
      } catch (err) {
        setCurrentStep('error');
      }
    }
  };

  const handleRequestGlobalVersion = async () => {
    if (selectedClass && selectedSubject && selectedTopic) {
      setCurrentStep('loading');
      
      try {
        const globalLesson = await generateLesson(selectedClass, selectedSubject, selectedTopic, selectedStyle, true);
        
        if (globalLesson) {
          const enhancedLesson = { ...globalLesson, isGlobalVersion: true };
          setCurrentLesson(enhancedLesson);
          setCurrentStep('lesson-player');
          
          if (currentSession) {
            updateSession(currentSession.id, {
              lessonContent: enhancedLesson,
              hasGlobalVersion: true
            });
          }
        } else {
          setCurrentStep('error');
        }
      } catch (err) {
        setCurrentStep('error');
      }
    }
  };

  const handleUploadAnalyze = (files: any[]) => {
    // Show detailed analysis results
    const analysisCount = files.filter(f => f.analysis).length;
    if (analysisCount > 0) {
      alert(`🎉 ASman has successfully analyzed ${analysisCount} file(s)!\n\nThe AI found excellent educational content that can be used to create engaging lessons for your students. You can now use these insights to develop targeted activities and assessments.`);
    } else {
      alert(`📁 Files uploaded successfully!\n\nASman has processed ${files.length} file(s). You can now create lessons incorporating this content.`);
    }
    
    // Store analysis results in session if needed
    if (currentSession && analysisCount > 0) {
      updateSession(currentSession.id, {
        uploadedContent: files.map(f => ({
          name: f.name,
          type: f.type,
          analysis: f.analysis
        }))
      });
    }
    
    setCurrentStep('dashboard');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={isHistoryOpen}
        sessions={sessions}
        currentSessionId={currentSession?.id}
        onToggle={toggleHistory}
        onSelectSession={handleSelectSession}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {currentStep === 'dashboard' && (
            <Dashboard
              onNewChat={handleNewChat}
              onSelectClassSubject={() => setCurrentStep('class-selection')}
              onUploadContent={() => setCurrentStep('upload')}
              onGlobalInspiration={() => alert('Global Inspiration coming soon!')}
              onToggleHistory={toggleHistory}
            />
          )}

          {currentStep === 'class-selection' && (
            <ClassSelection
              onSelectClass={handleSelectClass}
              onBack={handleBack}
            />
          )}

          {currentStep === 'subject-selection' && selectedClass && (
            <SubjectSelection
              selectedClass={selectedClass}
              onSelectSubject={handleSelectSubject}
              onBack={handleBack}
            />
          )}

          {currentStep === 'topic-input' && selectedClass && selectedSubject && (
            <TopicInput
              selectedClass={selectedClass}
              selectedSubject={selectedSubject}
              onSubmitTopic={handleSubmitTopic}
              onBack={handleBack}
            />
          )}

          {currentStep === 'style-selection' && (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                  <button
                    onClick={handleBack}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                </div>
                
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Choose Teaching Style
                  </h2>
                  <p className="text-xl text-gray-600">
                    Select a global teaching methodology to shape your lesson approach.
                  </p>
                </div>
                
                <GlobalStyleSelector
                  selectedStyle={selectedStyle}
                  onSelectStyle={handleStyleSelection}
                />
              </div>
            </div>
          )}

          {currentStep === 'upload' && (
            <UploadArea
              onBack={handleBack}
              onAnalyze={handleUploadAnalyze}
              selectedClass={selectedClass}
              selectedSubject={selectedSubject}
            />
          )}

          {currentStep === 'loading' && (
            <LoadingScreen 
              isGlobalVersion={currentLesson?.isGlobalVersion}
            />
          )}

          {currentStep === 'error' && (
            <ErrorScreen
              error={error || 'An unexpected error occurred'}
              onRetry={handleRetry}
              onBack={handleBack}
            />
          )}

          {currentStep === 'lesson-player' && currentLesson && selectedClass && selectedSubject && selectedTopic && (
            <LessonPlayer
              lessonContent={currentLesson}
              classLevel={selectedClass}
              subject={selectedSubject}
              topic={selectedTopic}
              globalStyle={selectedStyle}
              onBack={handleBack}
              onStyleChange={handleStyleChange}
              onRequestGlobalVersion={handleRequestGlobalVersion}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;