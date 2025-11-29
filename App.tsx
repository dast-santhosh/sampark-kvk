import React, { useState, useEffect } from 'react';
import { User, ViewState } from './types';
import { auth, isFirebaseConfigured } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getUserProfile } from './services/db';
import Login from './components/Login';
import Layout from './components/Layout';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardTeacher from './components/DashboardTeacher';
import DashboardParent from './components/DashboardParent';
import { MOCK_STUDENTS } from './constants';
import { AlertTriangle, Settings, ExternalLink } from 'lucide-react';

const SetupScreen = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-6 text-white flex items-center gap-4">
        <div className="p-3 bg-red-500 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Setup Required</h1>
          <p className="text-slate-400">SAMPARK KVK is missing Firebase Configuration</p>
        </div>
      </div>
      <div className="p-8 space-y-6">
        <p className="text-slate-600 text-lg">
          To run this application, you need to connect it to a Firebase project.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Vercel Deployment Instructions
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-slate-700 mt-4">
            <li>Go to your Firebase Console and create a new project.</li>
            <li>Register a Web App and copy the config values.</li>
            <li>In your Vercel Project Settings, go to <strong>Environment Variables</strong>.</li>
            <li>Add the following keys with your Firebase values:</li>
          </ol>
          <div className="bg-slate-800 text-slate-300 p-4 rounded-lg mt-4 font-mono text-xs overflow-x-auto">
            REACT_APP_FIREBASE_API_KEY=...<br/>
            REACT_APP_FIREBASE_AUTH_DOMAIN=...<br/>
            REACT_APP_FIREBASE_PROJECT_ID=...<br/>
            REACT_APP_FIREBASE_STORAGE_BUCKET=...<br/>
            REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...<br/>
            REACT_APP_FIREBASE_APP_ID=...
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
           <span className="text-xs text-slate-500">
             If you are running locally, create a <code className="bg-slate-100 px-1 py-0.5 rounded">.env</code> file.
           </span>
           <a 
             href="https://console.firebase.google.com" 
             target="_blank" 
             rel="noreferrer"
             className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
           >
             Open Firebase Console <ExternalLink className="w-4 h-4" />
           </a>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  useEffect(() => {
    // Safety check: If not configured, don't try to use auth
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch extended profile from Firestore
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser(profile);
        } else {
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: 'teacher', // Safe default for new users
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      if (isFirebaseConfigured) {
        await signOut(auth);
      }
      setUser(null);
      setCurrentView(ViewState.DASHBOARD);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // 1. Show Setup Screen if Config Missing
  if (!isFirebaseConfigured) {
    return <SetupScreen />;
  }

  // 2. Show Loader while Auth initializes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 3. Show Login if Not Authenticated
  if (!user) {
    return <Login />;
  }

  // 4. Show Main App
  return (
    <Layout 
      user={user} 
      currentView={currentView} 
      onNavigate={setCurrentView}
      onLogout={handleLogout}
    >
      <div className="animate-fade-in">
        {user.role === 'admin' && <DashboardAdmin currentView={currentView} />}
        {user.role === 'teacher' && <DashboardTeacher currentView={currentView} user={user} />}
        {user.role === 'parent' && <DashboardParent currentView={currentView} student={MOCK_STUDENTS[0]} />}
      </div>
    </Layout>
  );
};

export default App;