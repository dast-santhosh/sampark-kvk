import React, { useState, useEffect } from 'react';
import { ViewState, Student, Homework, User } from '../types';
import { CLASS_OPTIONS } from '../constants';
import { Plus, Check, Clock, FileText, ChevronRight } from 'lucide-react';
import AiAssistant from './AiAssistant';
import { getStudentsByClass, getHomework } from '../services/db';

interface Props {
  currentView: ViewState;
  user: User;
}

const DashboardTeacher: React.FC<Props> = ({ currentView, user }) => {
  const [selectedClass, setSelectedClass] = useState(user.classAssigned || "X-A");
  const [students, setStudents] = useState<Student[]>([]);
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
        const studentData = await getStudentsByClass(selectedClass);
        setStudents(studentData);
        // Initialize attendance to true
        const initialAttendance = studentData.reduce((acc, s) => ({...acc, [s.id]: true}), {});
        setAttendanceState(initialAttendance);

        const hwData = await getHomework(selectedClass);
        setHomeworkList(hwData);
    };
    fetchData();
  }, [selectedClass]);

  const toggleAttendance = (id: string) => {
    setAttendanceState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (currentView === ViewState.AI_ASSISTANT) {
    return <AiAssistant role="teacher" />;
  }

  if (currentView === ViewState.ATTENDANCE) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Daily Attendance</h2>
            <p className="text-slate-500 text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
          >
            {CLASS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-12 gap-4 font-medium text-slate-500 text-sm">
            <div className="col-span-2">Roll No</div>
            <div className="col-span-6">Student Name</div>
            <div className="col-span-4 text-center">Status</div>
          </div>
          <div className="divide-y divide-slate-50">
            {students.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                    No students found in this class. (Have you seeded the DB?)
                </div>
            )}
            {students.map((student) => {
              const isPresent = attendanceState[student.id];
              return (
                <div key={student.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors">
                  <div className="col-span-2 text-slate-600 font-mono">{student.rollNo}</div>
                  <div className="col-span-6 font-medium text-slate-800">{student.name}</div>
                  <div className="col-span-4 flex justify-center">
                    <button
                      onClick={() => toggleAttendance(student.id)}
                      className={`relative inline-flex h-8 w-24 items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isPresent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <span className="text-xs font-bold uppercase">{isPresent ? 'Present' : 'Absent'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">
              Submit Attendance
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === ViewState.ACADEMICS) {
      return (
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-800">Homework & Assignments</h2>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <Plus className="w-4 h-4 mr-2"/>
                      Create New
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {homeworkList.length === 0 && <p className="text-slate-500">No homework assignments found.</p>}
                  {homeworkList.map(hw => (
                      <div key={hw.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-4">
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md uppercase">{hw.subject}</span>
                              <span className="text-xs text-slate-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1"/>
                                  Due: {hw.dueDate}
                              </span>
                          </div>
                          <h3 className="font-bold text-slate-800 mb-2">{hw.title}</h3>
                          <p className="text-slate-600 text-sm mb-4 flex-1">{hw.description}</p>
                          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                                <span className="text-slate-500">Class: <span className="font-medium text-slate-800">{hw.class}</span></span>
                                <button className="text-blue-600 font-medium hover:underline">View Submissions</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )
  }

  // Default Dashboard
  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Welcome, {user.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Class {selectedClass} Overview</h3>
                <div className="flex items-center gap-8 mt-4">
                    <div>
                        <p className="text-blue-200 text-sm">Total Strength</p>
                        <p className="text-3xl font-bold">{students.length}</p>
                    </div>
                    <div>
                        <p className="text-blue-200 text-sm">Present Today</p>
                        <p className="text-3xl font-bold">{students.length > 0 ? students.length - 2 : 0}</p>
                    </div>
                    <div>
                        <p className="text-blue-200 text-sm">Absentees</p>
                        <p className="text-3xl font-bold text-red-200">02</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Quick Links</h3>
                <ul className="space-y-3">
                    <li><button className="w-full text-left text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 p-2 rounded transition-colors flex items-center justify-between">Enter Marks <ChevronRight className="w-4 h-4"/></button></li>
                    <li><button className="w-full text-left text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 p-2 rounded transition-colors flex items-center justify-between">Upload Syllabus <ChevronRight className="w-4 h-4"/></button></li>
                    <li><button className="w-full text-left text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 p-2 rounded transition-colors flex items-center justify-between">Parent Messages <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">3</span></button></li>
                </ul>
            </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Recent Circulars</h3>
            <div className="space-y-4">
                {[1, 2].map(i => (
                    <div key={i} className="flex gap-4 items-start p-3 bg-slate-50 rounded-lg">
                        <div className="p-2 bg-white rounded shadow-sm">
                            <FileText className="w-5 h-5 text-blue-500"/>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-800">New Exam Guidelines</h4>
                            <p className="text-xs text-slate-500 mt-1">Uploaded by Admin on 24 Oct 2024</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default DashboardTeacher;