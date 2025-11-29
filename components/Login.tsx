import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Role } from '../types';
import { User as UserIcon, Shield, GraduationCap, Lock, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Role>('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Create Authentication User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create Firestore Profile
        // Note: In a real app, Admins usually create accounts for others to control roles.
        // This is a self-signup for demo convenience.
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          name: email.split('@')[0], // Default name from email
          email: email,
          role: activeTab,
          ...(activeTab === 'teacher' ? { classAssigned: 'X-A' } : {}),
          ...(activeTab === 'parent' ? { studentId: 'S101' } : {}),
        });
      } else {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        // App.tsx listener will handle redirection
      }
    } catch (err: any) {
      console.error(err);
      let msg = "Authentication failed.";
      if (err.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already registered.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">SAMPARK KVK</h1>
        <p className="text-blue-200">Unified Digital Platform for KV Karaikudi</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Role Tabs */}
        <div className="flex border-b border-slate-100">
          {(['admin', 'teacher', 'parent'] as Role[]).map((role) => (
            <button
              key={role}
              onClick={() => setActiveTab(role)}
              className={`flex-1 py-4 text-sm font-medium transition-all ${
                activeTab === role
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col items-center gap-1 capitalize">
                {role === 'admin' && <Shield className="w-5 h-5" />}
                {role === 'teacher' && <UserIcon className="w-5 h-5" />}
                {role === 'parent' && <GraduationCap className="w-5 h-5" />}
                {role}
              </div>
            </button>
          ))}
        </div>

        <div className="p-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-slate-800 capitalize">
              {isSignUp ? `Create ${activeTab} Account` : `${activeTab} Login`}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isSignUp ? 'Fill in details to register' : 'Please enter your credentials'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 mt-2 flex justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </button>
          </form>
          
          <div className="mt-4 text-center">
             <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-blue-600 hover:underline"
             >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
             </button>
          </div>

          <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <p className="text-xs text-yellow-800 text-center">
              <strong>Note:</strong> Connect to Firebase in Vercel settings for this to work.
            </p>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-xs">
        &copy; 2024 Kendriya Vidyalaya Karaikudi. All rights reserved.
      </p>
    </div>
  );
};

export default Login;