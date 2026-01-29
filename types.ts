
export enum Subject {
  Mathematics = 'Mathematics',
  Science = 'Science',
  History = 'History',
  Coding = 'Coding',
  Languages = 'Languages',
  Philosophy = 'Philosophy'
}

export enum Difficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'image' | 'audio';
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
}

export interface UserProfile {
  name: string;
  points: number;
  completedLessons: number;
  currentSubject: Subject;
  difficulty: Difficulty;
}

export interface TutorConfig {
  voiceEnabled: boolean;
  visualAids: boolean;
}
