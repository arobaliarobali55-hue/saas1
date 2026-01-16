'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface StoryFormProps {
    onComplete: (data: { past: string; present: string; future: string }) => void;
    isLoading: boolean;
}

type StepField = 'past' | 'present' | 'future';

export default function StoryForm({ onComplete, isLoading }: StoryFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        past: '',
        present: '',
        future: '',
    });

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 3) {
            onComplete(formData);
        } else {
            nextStep();
        }
    };

    const steps: { id: number; title: string; description: string; field: StepField; placeholder: string }[] = [
        {
            id: 1,
            title: "Your Past Story",
            description: "Briefly tell us what has shaped you until now.",
            field: "past",
            placeholder: "e.g., I studied computer science and worked in sales for 3 years...",
        },
        {
            id: 2,
            title: "The Present",
            description: "What are you doing now? Where are you standing?",
            field: "present",
            placeholder: "e.g., Currently, I am learning AI and trying to build my own project...",
        },
        {
            id: 3,
            title: "Future Plans",
            description: "What do you want to achieve next? What's the dream?",
            field: "future",
            placeholder: "e.g., I want to launch an AI startup that helps people manage time...",
        },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto glass p-8 rounded-3xl relative overflow-hidden">
            <div className="hero-glow" />

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-primary uppercase tracking-widest">Step {step} of 3</span>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-1 w-8 rounded-full transition-all duration-300 ${i <= step ? 'bg-primary' : 'bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>
                <h2 className="text-3xl font-bold mb-2">{steps[step - 1].title}</h2>
                <p className="text-white/60">{steps[step - 1].description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <textarea
                            required
                            value={formData[steps[step - 1].field]}
                            onChange={(e) => setFormData({ ...formData, [steps[step - 1].field]: e.target.value })}
                            className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg resize-none"
                            placeholder={steps[step - 1].placeholder}
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-between items-center pt-4">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={step === 1 || isLoading}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${step === 1 ? 'opacity-0 cursor-default' : 'hover:bg-white/5'
                            }`}
                    >
                        <ChevronLeft size={20} /> Back
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/80 text-white rounded-full font-semibold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Analyzing...
                            </div>
                        ) : step === 3 ? (
                            <div className="flex items-center gap-2">
                                Generate My Plan <Sparkles size={20} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                Continue <ChevronRight size={20} />
                            </div>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
