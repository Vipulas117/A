import { useState } from 'react';
import { geminiService } from '../utils/gemini';
import { LessonContent, GlobalStyle, ClassLevel, Subject } from '../types';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLesson = async (
    classLevel: ClassLevel,
    subject: Subject,
    topic: string,
    globalStyle: GlobalStyle,
    isGlobalVersion: boolean = false
  ): Promise<LessonContent | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const lesson = await geminiService.generateLesson(classLevel, subject, topic, globalStyle, isGlobalVersion);
      return lesson;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate lesson';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeUpload = async (
    file: File,
    classLevel: ClassLevel,
    subject: Subject
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const analysis = await geminiService.analyzeUpload(file, classLevel, subject);
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze file';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    generateLesson,
    analyzeUpload,
    isLoading,
    error,
    clearError
  };
};