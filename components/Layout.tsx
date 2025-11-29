import React, { useState } from 'react';
import { User, ViewState } from '../types';
import { NAV_ITEMS, APP_NAME } from '../constants';
import { Menu, X, LogOut, Bell, Search, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  user: User;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, currentView, onNavigate, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navItems = NAV_ITEMS[user.role];

  const handleNavClick = (view: string) => {
    onNavigate(view as ViewState);
    setIsSidebarOpen(false); // Close mobile sidebar on click
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider">{APP_NAME}</h1>
        </div>

        {/* User Info Brief */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-red-900/30 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 lg:px-8">
          <button
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 flex justify-between items-center ml-4 lg:ml-0">
            <div className="relative max-w-md w-full hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-400" />
              </span>
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full py-2 pl-10 pr-4 text-sm text-slate-900 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 lg:hidden">
                <UserIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
