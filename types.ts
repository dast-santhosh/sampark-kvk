export type Role = 'admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  // Role specific fields
  classAssigned?: string; // For teachers
  studentId?: string; // For parents
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  attendance: number; // Percentage
  parentsName: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
  type: 'academic' | 'event' | 'holiday';
  author: string;
}

export interface Homework {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  class: string;
  assignedBy: string;
}

export interface ExamMark {
  subject: string;
  marks: number;
  total: number;
  examType: 'Mid-Term' | 'Final' | 'Unit Test';
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ATTENDANCE = 'ATTENDANCE',
  ACADEMICS = 'ACADEMICS', // Homework, Marks
  COMMUNICATION = 'COMMUNICATION', // Notices, Messages
  SCHEDULE = 'SCHEDULE', // Timetable
  ADMIN_USERS = 'ADMIN_USERS',
  AI_ASSISTANT = 'AI_ASSISTANT', // Gemini Feature
}
