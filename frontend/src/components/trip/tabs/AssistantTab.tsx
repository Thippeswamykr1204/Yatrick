'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Trip, ChatMessage } from '@/types/models';
import { tripsService } from '@/services/trips.service';
import { useToast } from '@/store/uiStore';
import { cn } from '@/lib/cn';

const QUICK_QUESTIONS = [
  'What food should I try?',
  'How do I get around?',
  'What should I avoid?',
  'Best time to visit attractions?',
  'Local customs to know?',
  'What to pack for the weather?',
];

interface AssistantTabProps {
  trip: Trip;
}

export function AssistantTab({ trip }: AssistantTabProps) {
  const toast = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await tripsService.chat(
        trip._id,
        text.trim(),
        history
      );

      const aiMsg: ChatMessage = {
        role: 'model',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((m) => [...m, aiMsg]);
    } catch {
      toast.error('AI assistant unavailable', 'Please try again');
      setMessages((m) => m.slice(0, -1));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col min-h-[600px] h-[70vh] max-h-[800px] bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-orange-50/80 to-white">
        <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
          <Bot className="w-5 h-5 text-orange-600" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Trip AI Assistant
          </h3>
          <p className="text-xs text-slate-500">
            Ask anything about your {trip.destination} trip
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Online
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/10">
              <Sparkles className="w-7 h-7 text-orange-500" />
            </div>

            <h4 className="font-semibold text-slate-900 mb-1">
              Ask me anything
            </h4>

            <p className="text-sm text-slate-500 mb-6 max-w-xs">
              I know your full itinerary and can answer questions about your
              trip to {trip.destination}.
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                  msg.role === 'user'
                    ? 'bg-orange-600'
                    : 'bg-slate-100 border border-slate-200'
                )}
              >
                {msg.role === 'user' ? (
                  <User className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              <div
                className={cn(
                  'max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-orange-600 text-white rounded-tr-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm'
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-slate-600" />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-slate-200 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder={`Ask about your ${trip.destination} trip…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 h-10 px-4 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:opacity-50 transition-all duration-150"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shrink-0 shadow-lg shadow-orange-500/25"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
