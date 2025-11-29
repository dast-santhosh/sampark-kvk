import { User, Student, Notice, Homework, ExamMark } from './types';
import { BookOpen, Calendar, CheckSquare, GraduationCap, LayoutDashboard, MessageSquare, Users, Sparkles } from 'lucide-react';

export const APP_NAME = "SAMPARK KVK";

// Navigation Items Configuration
export const NAV_ITEMS = {
  admin: [
    { id: 'DASHBOARD', label: 'Overview', icon: LayoutDashboard },
    { id: 'ADMIN_USERS', label: 'Manage Users', icon: Users },
    { id: 'COMMUNICATION', label: 'Notices & Circulars', icon: MessageSquare },
    { id: 'SCHEDULE', label: 'Timetable & Events', icon: Calendar },
    { id: 'AI_ASSISTANT', label: 'AI Admin Helper', icon: Sparkles },
  ],
  teacher: [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ATTENDANCE', label: 'Attendance', icon: CheckSquare },
    { id: 'ACADEMICS', label: 'Homework & Marks', icon: BookOpen },
    { id: 'COMMUNICATION', label: 'Announcements', icon: MessageSquare },
    { id: 'AI_ASSISTANT', label: 'Lesson Planner', icon: Sparkles },
  ],
  parent: [
    { id: 'DASHBOARD', label: 'My Ward', icon: GraduationCap },
    { id: 'ACADEMICS', label: 'Homework & Results', icon: BookOpen },
    { id: 'SCHEDULE', label: 'Timetable', icon: Calendar },
    { id: 'COMMUNICATION', label: 'Notices', icon: MessageSquare },
    { id: 'AI_ASSISTANT', label: 'Study Helper', icon: Sparkles },
  ]
};

// MOCK DATA

export const MOCK_STUDENTS: Student[] = [
  { id: 'S101', name: "Aarav Patel", rollNo: "12", class: "X-A", attendance: 92, parentsName: "Suresh Patel" },
  { id: 'S102', name: "Diya Sharma", rollNo: "13", class: "X-A", attendance: 96, parentsName: "Rohit Sharma" },
  { id: 'S103', name: "Ishaan Gupta", rollNo: "14", class: "X-A", attendance: 85, parentsName: "Anjali Gupta" },
  { id: 'S104', name: "Meera Reddy", rollNo: "05", class: "VI-B", attendance: 98, parentsName: "Vikram Reddy" },
];

export const MOCK_NOTICES: Notice[] = [
  { id: 'N1', title: "Annual Sports Meet 2024", date: "2024-10-25", content: "The Annual Sports Meet will be held on Nov 5th. Students must register by Friday.", type: "event", author: "Principal" },
  { id: 'N2', title: "Diwali Holidays", date: "2024-10-20", content: "School will remain closed from Oct 30 to Nov 3 for Diwali celebrations.", type: "holiday", author: "Admin" },
  { id: 'N3', title: "Unit Test II Syllabus", date: "2024-10-15", content: "Syllabus for upcoming unit tests has been uploaded to the academic section.", type: "academic", author: "Exam Cell" },
];

export const MOCK_HOMEWORK: Homework[] = [
  { id: 'H1', subject: "Mathematics", title: "Quadratic Equations", description: "Solve Exercise 4.2 questions 1-10.", dueDate: "2024-10-28", class: "X-A", assignedBy: "Mrs. Verma" },
  { id: 'H2', subject: "Science", title: "Light Reflection", description: "Draw ray diagrams for concave mirrors.", dueDate: "2024-10-29", class: "X-A", assignedBy: "Mr. Rao" },
  { id: 'H3', subject: "English", title: "Poem Comprehension", description: "Read 'The Road Not Taken' and answer back exercises.", dueDate: "2024-10-27", class: "VI-B", assignedBy: "Ms. Kaur" },
];

export const MOCK_MARKS: ExamMark[] = [
  { subject: "Mathematics", marks: 78, total: 80, examType: "Mid-Term" },
  { subject: "Science", marks: 72, total: 80, examType: "Mid-Term" },
  { subject: "Social Studies", marks: 75, total: 80, examType: "Mid-Term" },
  { subject: "English", marks: 68, total: 80, examType: "Mid-Term" },
  { subject: "Hindi", marks: 70, total: 80, examType: "Mid-Term" },
];

export const CLASS_OPTIONS = ["VI-A", "VI-B", "VII-A", "VII-B", "VIII-A", "X-A", "X-B", "XII-Sci"];
