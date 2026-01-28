"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, GraduationCap, Gamepad2, Sparkles, BrainCircuit } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Привет! Я твой ИИ-наставник. Готов покорять университеты мира? 🚀' }
  ]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30">
      {/* Живой фон (градиентные пятна) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between p-6 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <GraduationCap size={28} />
          </div>
          <span>Edu<span className="text-blue-500">AI</span></span>
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium">
            <Gamepad2 size={18} /> Игры
          </button>
          <button className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 font-semibold">
            Регистрация
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto pt-20 px-6 h-[calc(100vh-100px)] flex flex-col">
        {/* Чат-зона */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-hide">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'ai' ? 'bg-blue-600 shadow-md shadow-blue-500/40' : 'bg-slate-700'
                  }`}>
                    {msg.role === 'ai' ? <BrainCircuit size={16} /> : <User size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl leading-relaxed text-sm shadow-sm ${
                    msg.role === 'ai' 
                    ? 'bg-white/5 border border-white/10 backdrop-blur-sm' 
                    : 'bg-blue-600 text-white'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Поле ввода */}
        <div className="pb-10 pt-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500" />
            <div className="relative flex items-center bg-[#1e293b] rounded-2xl border border-white/10 p-2">
              <input 
                type="text" 
                placeholder="Спроси меня о поступлении или карьере..."
                className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder:text-slate-500"
              />
              <button className="bg-blue-600 p-3 rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-blue-600/20">
                <Send size={20} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-500 mt-3 uppercase tracking-widest font-bold">
            Powered by Gemini AI • Night Sprint Version
          </p>
        </div>
      </main>
    </div>
  );
}