'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Download, FileText, Lock } from 'lucide-react';
import { TodoItem } from '@/types/ai';

interface TodoListProps {
    items: TodoItem[];
    guide: string;
    onDownload: () => void;
    isAuthenticated: boolean;
}

export default function TodoList({ items = [], guide, onDownload, isAuthenticated }: TodoListProps) {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-12 pb-20">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold gradient-text">Your Personalized Action Plan</h2>
                <p className="text-white/60 max-w-2xl mx-auto">Based on your past and present, here is your path to the future.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Todo Items */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <CheckCircle2 className="text-primary" /> Action Items
                    </h3>
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass p-4 rounded-2xl flex gap-4 items-start group hover:border-primary/30 transition-all"
                            >
                                <Circle className="mt-1 text-white/20 group-hover:text-primary transition-colors" size={18} />
                                <div>
                                    <h4 className="font-medium">{item.task}</h4>
                                    <p className="text-sm text-white/50">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Philosophy / Guide Section */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <FileText className="text-secondary" /> Strategic Guide
                    </h3>
                    <div className="glass p-6 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FileText size={80} />
                        </div>
                        <div className={`prose prose-invert max-w-none ${!isAuthenticated ? 'blur-sm select-none' : ''}`}>
                            <p className="text-white/80 leading-relaxed whitespace-pre-line">
                                {guide}
                            </p>
                        </div>

                        {!isAuthenticated && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-sm transition-all rounded-3xl">
                                <Lock className="mb-4 text-primary" size={32} />
                                <h4 className="text-lg font-bold mb-2">Unlock Full Analysis</h4>
                                <p className="text-sm text-white/60 text-center mb-6">Sign in to read your full guide and download your action plan.</p>
                                <button
                                    onClick={onDownload}
                                    className="px-6 py-2 bg-primary hover:bg-primary/80 rounded-full text-sm font-semibold transition-all"
                                >
                                    Sign In to View
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Download Section */}
            <div className="flex flex-col items-center gap-4 pt-8">
                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 px-10 py-4 bg-white text-black hover:bg-white/90 rounded-full font-bold transition-all shadow-xl hover:scale-105 active:scale-95"
                >
                    <Download size={20} />
                    Download PDF Guide & List
                </button>
                {!isAuthenticated && (
                    <p className="text-xs text-white/40 flex items-center gap-1">
                        <Lock size={12} /> Requires account sign in
                    </p>
                )}
            </div>
        </div>
    );
}
