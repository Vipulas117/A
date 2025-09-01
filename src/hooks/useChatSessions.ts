import { useState, useEffect } from 'react';
import { ChatSession } from '../types';
import { DEMO_LESSONS } from '../utils/constants';

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    // Initialize with demo lessons
    const demoSessions: ChatSession[] = DEMO_LESSONS.map(lesson => ({
      ...lesson,
      lessonContent: undefined // Will be loaded when accessed
    }));
    setSessions(demoSessions);
  }, []);

  const createNewSession = (): ChatSession => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Lesson',
      timestamp: new Date()
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    setIsHistoryOpen(false);
    
    return newSession;
  };

  const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, ...updates }
          : session
      )
    );
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const selectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      setIsHistoryOpen(false);
    }
  };

  const generateSessionTitle = (classLevel?: string, subject?: string, topic?: string): string => {
    if (!classLevel || !subject || !topic) return 'New Lesson';
    
    const className = classLevel.replace('class-', 'Class ');
    const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);
    return `${topic} - ${className} ${subjectName}`;
  };

  const toggleHistory = () => {
    setIsHistoryOpen(prev => !prev);
  };

  return {
    sessions,
    currentSession,
    isHistoryOpen,
    createNewSession,
    updateSession,
    selectSession,
    generateSessionTitle,
    toggleHistory
  };
};