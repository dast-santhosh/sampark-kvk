import React, { useEffect, useState } from 'react';
import { ViewState, Student, Notice, Homework } from '../types';
import { MOCK_MARKS } from '../constants';
import { FileText, Download, Calendar, CheckCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AiAssistant from './AiAssistant';
import { getHomework, getNotices } from '../services/db';

interface Props {
  currentView: ViewState;
  student: Student;
}

const DashboardParent: React.FC<Props> = ({ currentView, student }) => {
  const COLORS = ['#3b82f6', '#e2e8f0'];
  const attendanceData = [
    { name: 'Present', value: student.attendance },
    { name: 'Absent', value: 100 - student.attendance },
  ];

  const [notices, setNotices] = useState<Notice[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const noticesData = await getNotices();
        setNotices(noticesData);
        
        const hwData = await getHomework(student.class);
        setHomework(hwData);
    };
    fetchData();
  }, [student]);

  if (currentView === ViewState.AI_ASSISTANT) {
    return <AiAssistant role="parent" />;
  }

  if (currentView === ViewState.ACADEMICS) {
      return (
          <div className="space-y-8">
               {/* Marks Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">Exam Results (Mid-Term)</h3>
                    <button className="flex items-center text-sm text-blue-600 font-medium hover:underline">
                        <Download className="w-4 h-4 mr-1"/> Download Report Card
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Subject</th>
                                <th className="px-6 py-3 font-medium text-center">Marks Obtained</th>
                                <th className="px-6 py-3 font-medium text-center">Total</th>
                                <th className="px-6 py-3 font-medium text-center">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_MARKS.map((m, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800">{m.subject}</td>
                                    <td className="px-6 py-4 text-center">{m.marks}</td>
                                    <td className="px-6 py-4 text-center text-slate-500">{m.total}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            (m.marks/m.total) >= 0.9 ? 'bg-green-100 text-green-700' : 
                                            (m.marks/m.total) >= 0.7 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {(m.marks/m.total) >= 0.9 ? 'A1' : (m.marks/m.total) >= 0.8 ? 'A2' : 'B1'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              </div>

              {/* Homework List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 text-lg mb-4">Pending Homework</h3>
                <div className="space-y-4">
                    {homework.length === 0 && <p className="text-sm text-slate-500">No pending homework.</p>}
                    {homework.map(hw => (
                        <div key={hw.id} className="border border-slate-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-slate-700">{hw.subject}</span>
                                <span className="text-xs text-red-500 flex items-center bg-red-50 px-2 py-1 rounded">
                                    <Clock className="w-3 h-3 mr-1"/> Due: {hw.dueDate}
                                </span>
                            </div>
                            <h4 className="text-sm font-medium text-slate-900">{hw.title}</h4>
                            <p className="text-sm text-slate-500 mt-1">{hw.description}</p>
                        </div>
                    ))}
                </div>
              </div>
          </div>
      )
  }

  // Communication View
  if (currentView === ViewState.COMMUNICATION) {
      return (
          <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Notices & Circulars</h2>
              <div className="grid gap-4">
                  {notices.map(notice => (
                      <div key={notice.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                          <div className="flex justify-between items-start mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                  notice.type === 'event' ? 'bg-purple-100 text-purple-700' :
                                  notice.type === 'holiday' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                  {notice.type}
                              </span>
                              <span className="text-sm text-slate-400">{notice.date}</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 mb-2">{notice.title}</h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{notice.content}</p>
                          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                             <span className="text-xs text-slate-500">Issued by: {notice.author}</span>
                             <button className="text-blue-600 text-sm font-medium hover:underline">Download Attachment</button>
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                {student.name.charAt(0)}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{student.name}</h2>
                <p className="text-slate-500">Class: {student.class} | Roll No: {student.rollNo}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Class Teacher</p>
            <p className="font-medium text-slate-800">Mrs. S. Verma</p>
            <button className="text-xs text-blue-600 hover:underline mt-1">Send Message</button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
            <h3 className="font-bold text-slate-800 mb-2 w-full text-left">Attendance Overview</h3>
            <div className="h-40 w-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {attendanceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-800">{student.attendance}%</span>
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Total working days: 120</p>
        </div>

        {/* Latest Activity */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Latest Updates</h3>
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-fit">
                        <FileText className="w-5 h-5"/>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800">New Homework Added: Mathematics</p>
                        <p className="text-xs text-slate-500">Today, 10:30 AM</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg h-fit">
                        <CheckCircle className="w-5 h-5"/>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800">Attendance Marked: Present</p>
                        <p className="text-xs text-slate-500">Today, 08:15 AM</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg h-fit">
                        <Calendar className="w-5 h-5"/>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800">Notice: Annual Sports Meet</p>
                        <p className="text-xs text-slate-500">Yesterday</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardParent;