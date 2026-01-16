'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, BookOpen } from 'lucide-react';
import StoryForm from '@/components/StoryForm';
import TodoList from '@/components/TodoList';
import { AnalysisResponse } from '@/types/ai';

import { useAuth } from '@/lib/auth-context';
import AuthModal from '@/components/AuthModal';

import { generatePDF } from '@/types/pdf-utils';

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleComplete = async (stories: { past: string; present: string; future: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stories),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze');
      }

      setAnalysis(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze stories. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else if (analysis) {
      generatePDF(analysis);
    }
  };

  return (
    <main className="min-h-screen relative">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Background elements */}
      <div className="fixed inset-0 bg-[#050505] z-[-2]" />
      <div className="fixed inset-0 opacity-40 mix-blend-screen pointer-events-none z-[-2]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px]" />
      </div>

      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setAnalysis(null)}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <Zap className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter">VisionPath AI</span>
        </div>
        <div className="flex gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/40 hidden md:block">{user.email}</span>
              <button
                onClick={() => signOut()}
                className="px-6 py-2 glass rounded-full text-sm font-semibold hover:bg-white/5 transition-all text-red-400 hover:text-red-300"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-8 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {!analysis ? (
          <div className="space-y-16">
            <header className="text-center space-y-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-none mb-4">
                  Turn Your Life Story Into a <span className="gradient-text">Masterpiece.</span>
                </h1>
                <p className="text-xl text-white/60">
                  Input your journey. Our AI analyzes your past and present to build a strategic To-Do list for your future.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-8 pt-4"
              >
                {[
                  { icon: <Zap size={18} />, label: "AI Analysis" },
                  { icon: <Target size={18} />, label: "Strategic Plans" },
                  { icon: <BookOpen size={18} />, label: "Full Life Guide" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/40 text-sm">
                    {item.icon} {item.label}
                  </div>
                ))}
              </motion.div>
            </header>

            <StoryForm onComplete={handleComplete} isLoading={isLoading} />
          </div>
        ) : (
          <TodoList
            items={analysis.todolist}
            guide={analysis.guide}
            onDownload={handleDownload}
            isAuthenticated={!!user}
          />
        )}
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-center text-white/20 text-sm">
        <p>© 2026 VisionPath AI. All rights reserved.</p>
      </footer>
    </main>
  );
}
