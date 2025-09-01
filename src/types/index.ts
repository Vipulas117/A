export interface LessonContent {
  explanation: string;
  questions: Array<{
    question: string;
    options: string[];
    correct: number;
    explanation?: string;
  }>;
  activity: string;
  globalMethod: string;
  hindiTranslation: Record<string, string>;
  isGlobalVersion?: boolean;
  lessonData?: {
    lessonTitle: string;
    ageGroup: string;
    duration: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  classLevel?: string;
  subject?: string;
  topic?: string;
  lessonContent?: LessonContent;
  globalStyle?: GlobalStyle;
  hasGlobalVersion?: boolean;
  uploadedContent?: Array<{
    name: string;
    type: string;
    analysis?: string;
  }>;
}

export type GlobalStyle = 'chinese' | 'japanese' | 'american' | 'european';
export type ClassLevel = 'class-1' | 'class-2' | 'class-3' | 'class-4' | 'class-5' | 'class-6' | 'class-7' | 'class-8' | 'class-9' | 'class-10';
export type Subject = 'mathematics' | 'science' | 'english' | 'hindi' | 'social-studies' | 'art';

export interface TeachingStyle {
  id: GlobalStyle;
  name: string;
  flag: string;
  description: string;
  approach: string;
}

export interface ClassInfo {
  id: ClassLevel;
  number: number;
  ageRange: string;
  description: string;
}

export interface SubjectInfo {
  id: Subject;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  preview?: string;
}