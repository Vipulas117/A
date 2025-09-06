import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import ClassSelection from './components/ClassSelection';
import SubjectSelection from './components/SubjectSelection';
import TopicInput from './components/TopicInput';
import GlobalStyleSelector from './components/GlobalStyleSelector';
import UploadArea from './components/UploadArea';
import LessonPlayer from './components/LessonPlayer';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import { ChatSidebar } from './components/ChatSidebar';
import CurriculumAlignmentDashboard from './components/CurriculumAlignmentDashboard';
import { useChatSessions } from './hooks/useChatSessions';
import { useGemini } from './hooks/useGemini';

function App() {
  const {
    sessions,
    currentSession,
    createSession,
    selectSession,
    updateSession
  } = useChatSessions();

  const {
    generateLesson,
    analyzeContent,
    isLoading,
    error,
    clearError
  } = useGemini();

  const [currentStep, setCurrentStep] = React.useState<string>('dashboard');
  const [selectedClass, setSelectedClass] = React.useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = React.useState<string>('');
  const [topic, setTopic] = React.useState<string>('');
  const [globalStyle, setGlobalStyle] = React.useState<string>('');
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [lesson, setLesson] = React.useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleStartNewLesson = () => {
    const sessionId = createSession();
    setCurrentStep('class-selection');
    setSelectedClass(null);
    setSelectedSubject('');
    setTopic('');
    setGlobalStyle('');
    setUploadedFiles([]);
    setLesson(null);
    clearError();
  };

  const handleClassSelect = (classNumber: number) => {
    setSelectedClass(classNumber);
    setCurrentStep('subject-selection');
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentStep('topic-input');
  };

  const handleTopicSubmit = (topicText: string) => {
    setTopic(topicText);
    setCurrentStep('global-style-selection');
  };

  const handleStyleSelect = (style: string) => {
    setGlobalStyle(style);
    setCurrentStep('upload-area');
  };

  const handleFilesUpload = (files: File[]) => {
    setUploadedFiles(files);
    handleGenerateLesson();
  };

  const handleSkipUpload = () => {
    setUploadedFiles([]);
    handleGenerateLesson();
  };

  const handleGenerateLesson = async () => {
    if (!selectedClass || !selectedSubject || !topic) return;

    setCurrentStep('loading');

    try {
      let lessonData;
      
      if (uploadedFiles.length > 0) {
        lessonData = await analyzeContent(
          uploadedFiles[0],
          selectedClass,
          selectedSubject,
          topic,
          globalStyle
        );
      } else {
        lessonData = await generateLesson(
          selectedClass,
          selectedSubject,
          topic,
          globalStyle
        );
      }

      setLesson(lessonData);
      
      if (currentSession) {
        updateSession(currentSession.id, {
          class: selectedClass,
          subject: selectedSubject,
          topic,
          globalStyle,
          lesson: lessonData,
          files: uploadedFiles.map(f => f.name)
        });
      }
      
      setCurrentStep('lesson-player');
    } catch (err) {
      setCurrentStep('error');
    }
  };

  const handleRetry = () => {
    clearError();
    setCurrentStep('dashboard');
  };

  const handleBackToDashboard = () => {
    setCurrentStep('dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'dashboard':
        return (
          <Dashboard 
            onStartNewLesson={handleStartNewLesson}
            onOpenSidebar={() => setSidebarOpen(true)}
            sessions={sessions}
          />
        );
      case 'class-selection':
        return <ClassSelection onClassSelect={handleClassSelect} />;
      case 'subject-selection':
        return (
          <SubjectSelection 
            onSubjectSelect={handleSubjectSelect}
            selectedClass={selectedClass!}
          />
        );
      case 'topic-input':
        return (
          <TopicInput 
            onTopicSubmit={handleTopicSubmit}
            selectedClass={selectedClass!}
            selectedSubject={selectedSubject}
          />
        );
      case 'global-style-selection':
        return (
          <GlobalStyleSelector 
            onStyleSelect={handleStyleSelect}
            selectedClass={selectedClass!}
            selectedSubject={selectedSubject}
            topic={topic}
          />
        );
      case 'upload-area':
        return (
          <UploadArea 
            onFilesUpload={handleFilesUpload}
            onSkip={handleSkipUpload}
            selectedClass={selectedClass!}
            selectedSubject={selectedSubject}
            topic={topic}
            globalStyle={globalStyle}
          />
        );
      case 'loading':
        return <LoadingScreen />;
      case 'lesson-player':
        return (
          <LessonPlayer 
            lesson={lesson}
            onBackToDashboard={handleBackToDashboard}
            selectedClass={selectedClass!}
            selectedSubject={selectedSubject}
            topic={topic}
          />
        );
      case 'error':
        return <ErrorScreen onRetry={handleRetry} error={error} />;
      default:
        return (
          <Dashboard 
            onStartNewLesson={handleStartNewLesson}
            onOpenSidebar={() => setSidebarOpen(true)}
            sessions={sessions}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Router>
        <div className="flex h-screen">
          <ChatSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            sessions={sessions}
            currentSession={currentSession}
            onSelectSession={selectSession}
            onNewSession={handleStartNewLesson}
          />
          
          <main role="main" className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;