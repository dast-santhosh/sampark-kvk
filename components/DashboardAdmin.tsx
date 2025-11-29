import React, { useEffect, useState } from 'react';
import { ViewState, Student } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, AlertTriangle, Calendar, FileText, CheckCircle, Database } from 'lucide-react';
import AiAssistant from './AiAssistant';
import { getAllStudents, seedDatabase } from '../services/db';

interface Props {
  currentView: ViewState;
}

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color} text-white`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const DashboardAdmin: React.FC<Props> = ({ currentView }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        const data = await getAllStudents();
        setStudents(data);
    };
    fetchData();
  }, []);

  const handleSeed = async () => {
      if(confirm("This will add mock data to your Firebase Firestore. Continue?")) {
        setLoading(true);
        await seedDatabase();
        setLoading(false);
        alert("Database seeded successfully! Refresh to see data.");
        window.location.reload();
      }
  };

  const attendanceData = [
    { name: 'VI', attendance: 95 },
    { name: 'VII', attendance: 88 },
    { name: 'VIII', attendance: 92 },
    { name: 'IX', attendance: 85 },
    { name: 'X', attendance: 96 },
    { name: 'XI', attendance: 82 },
    { name: 'XII', attendance: 90 },
  ];

  if (currentView === ViewState.AI_ASSISTANT) {
    return <AiAssistant role="admin" />;
  }

  if (currentView === ViewState.ADMIN_USERS) {
      return (
          <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm font-medium">Teachers</button>
                        <button className="px-4 py-2 bg-white text-slate-500 hover:bg-slate-50 rounded-md text-sm font-medium">Students</button>
                        <button className="px-4 py-2 bg-white text-slate-500 hover:bg-slate-50 rounded-md text-sm font-medium">Parents</button>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                          + Add New User
                      </button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500">
                          <tr>
                              <th className="px-6 py-3 font-medium">ID</th>
                              <th className="px-6 py-3 font-medium">Name</th>
                              <th className="px-6 py-3 font-medium">Role / Class</th>
                              <th className="px-6 py-3 font-medium">Status</th>
                              <th className="px-6 py-3 font-medium text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {/* Fallback mock for UI demo if empty, or map real users if we had an API for it */}
                          {[1,2,3,4].map((i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                  <td className="px-6 py-3 font-mono text-slate-500">TCH-{100+i}</td>
                                  <td className="px-6 py-3 font-medium text-slate-800">Teacher Name {i}</td>
                                  <td className="px-6 py-3 text-slate-600">Class Teacher (X-A)</td>
                                  <td className="px-6 py-3 text-green-600"><span className="px-2 py-1 bg-green-50 rounded-full text-xs font-semibold">Active</span></td>
                                  <td className="px-6 py-3 text-right text-blue-600 hover:underline cursor-pointer">Edit</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )
  }

  // Default Dashboard View
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length || "Loading..."} icon={Users} color="bg-blue-500" />
        <StatCard title="Teachers" value="45" icon={FileText} color="bg-purple-500" />
        <StatCard title="Today's Attendance" value="92%" icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Upcoming Events" value="3" icon={Calendar} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Class-wise Attendance Today</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={handleSeed}
                disabled={loading}
                className="w-full flex items-center justify-between p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100 transition-colors"
              >
                <span>{loading ? "Seeding..." : "Seed Database (Mock Data)"}</span>
                <Database className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors">
                <span>Post New Circular</span>
                <span className="text-blue-600 font-bold">+</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors">
                <span>View Absent Teachers</span>
                <span className="text-red-500 font-bold">2</span>
              </button>
            </div>
          </div>
          
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="text-amber-600 w-5 h-5"/>
                <h3 className="font-bold text-amber-800">Pending Actions</h3>
            </div>
            <p className="text-sm text-amber-700">Exam schedules for Class X need approval before EOD.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;