import React, { useState } from 'react';
import { generateContent } from '../services/geminiService';
import { Send, Sparkles, RefreshCw, Copy } from 'lucide-react';
import { Role } from '../types';

interface AiAssistantProps {
  role: Role;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ role }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');
    
    const result = await generateContent(input, role);
    setResponse(result);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-yellow-300" />
          <h2 className="text-2xl font-bold">Sampark AI Assistant</h2>
        </div>
        <p className="text-indigo-100 opacity-90 max-w-xl">
          Powered by Gemini 2.5. 
          {role === 'admin' && " Draft circulars, emails, or get summaries of school reports."}
          {role === 'teacher' && " Create lesson plans, quiz questions, or report card comments."}
          {role === 'parent' && " Ask for homework explanations or study tips for your child."}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          What can I help you with today?
        </label>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-slate-900 placeholder-slate-400"
            placeholder={
              role === 'teacher' 
                ? "E.g., Create a 5-question quiz on Photosynthesis for Class 7..." 
                : "E.g., Draft a notice for parents regarding the new winter uniform policy..."
            }
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className={`absolute bottom-3 right-3 px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
              loading || !input.trim()
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {response && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">AI Response</h3>
            <button 
              onClick={handleCopy}
              className="text-slate-500 hover:text-indigo-600 flex items-center text-xs"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </button>
          </div>
          <div className="p-6 prose prose-slate max-w-none text-slate-800 whitespace-pre-line">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
