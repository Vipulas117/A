import { TeachingStyle, ClassInfo, SubjectInfo } from '../types';

export const TEACHING_STYLES: TeachingStyle[] = [
  {
    id: 'chinese',
    name: 'Chinese Style',
    flag: '🇨🇳',
    description: 'Drills & Practice',
    approach: 'Repetitive practice and mastery through structured drills'
  },
  {
    id: 'japanese',
    name: 'Japanese Style', 
    flag: '🇯🇵',
    description: 'Discipline & Structure',
    approach: 'Step-by-step progression with disciplined methodology'
  },
  {
    id: 'american',
    name: 'American Style',
    flag: '🇺🇸', 
    description: 'Curiosity-driven Learning',
    approach: 'Question-based exploration and discovery learning'
  },
  {
    id: 'european',
    name: 'European Style',
    flag: '🇪🇺',
    description: 'Creativity & Exploration',
    approach: 'Creative expression and collaborative activities'
  }
];

export const CLASSES: ClassInfo[] = [
  { id: 'class-1', number: 1, ageRange: '6-7 years', description: 'Foundation learning with play' },
  { id: 'class-2', number: 2, ageRange: '7-8 years', description: 'Basic concepts and skills' },
  { id: 'class-3', number: 3, ageRange: '8-9 years', description: 'Building core knowledge' },
  { id: 'class-4', number: 4, ageRange: '9-10 years', description: 'Developing understanding' },
  { id: 'class-5', number: 5, ageRange: '10-11 years', description: 'Expanding horizons' },
  { id: 'class-6', number: 6, ageRange: '11-12 years', description: 'Middle school foundation' },
  { id: 'class-7', number: 7, ageRange: '12-13 years', description: 'Advanced concepts' },
  { id: 'class-8', number: 8, ageRange: '13-14 years', description: 'Critical thinking' },
  { id: 'class-9', number: 9, ageRange: '14-15 years', description: 'Board exam preparation' },
  { id: 'class-10', number: 10, ageRange: '15-16 years', description: 'Comprehensive mastery' }
];

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'Calculator',
    color: 'bg-blue-500',
    description: 'Numbers, patterns, and problem-solving'
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'Microscope',
    color: 'bg-green-500',
    description: 'Experiments, nature, and discovery'
  },
  {
    id: 'english',
    name: 'English',
    icon: 'BookOpen',
    color: 'bg-purple-500',
    description: 'Reading, writing, and communication'
  },
  {
    id: 'hindi',
    name: 'Hindi',
    icon: 'Languages',
    color: 'bg-orange-500',
    description: 'भाषा, साहित्य और संस्कृति'
  },
  {
    id: 'social-studies',
    name: 'Social Studies',
    icon: 'Globe',
    color: 'bg-red-500',
    description: 'History, geography, and civics'
  },
  {
    id: 'art',
    name: 'Art',
    icon: 'Palette',
    color: 'bg-pink-500',
    description: 'Creativity, colors, and expression'
  }
];

export const DEMO_LESSONS = [
  {
    id: 'demo-1',
    title: 'Addition with Fun - Class 2 Math',
    classLevel: 'class-2',
    subject: 'mathematics',
    topic: 'Addition',
    globalStyle: 'chinese' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 'demo-2', 
    title: 'How Plants Grow - Class 5 Science',
    classLevel: 'class-5',
    subject: 'science',
    topic: 'Plant Growth',
    globalStyle: 'european' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: 'demo-3',
    title: 'Animal Sounds - Class 3 English', 
    classLevel: 'class-3',
    subject: 'english',
    topic: 'Animals',
    globalStyle: 'american' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
];