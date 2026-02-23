"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Sparkles, Bot, GraduationCap, Send, 
  Globe, X, Flame, ArrowRight, CheckCircle2, Circle, Star
} from "lucide-react";

// Принимаем пропсы из родительского page.tsx
export default function MainStrategy({ stats, setStats, onBuild }: any) {
  const [chatMessages, setChatMessages] = useState([{ role: "assistant", text: "Привет! Заполни досье справа, отметь свои достижения в таблице внизу, и я построю стратегию на 2026 год." }]);
  const [input, setInput] = useState("");

  // Список 12 активностей для 2026 года
  const activitiesList = [
    { id: "research", label: "Научное исследование", icon: "🔬" },
    { id: "startup", label: "Свой стартап / Бизнес", icon: "🚀" },
    { id: "olympiad", label: "Олимпиады (Мжд/Респ)", icon: "🏆" },
    { id: "volunteering", label: "Волонтерство", icon: "🤝" },
    { id: "internship", label: "Стажировка", icon: "💼" },
    { id: "leadership", label: "Президент / Лидер", icon: "👑" },
    { id: "sport", label: "Спорт (Сборная/КМС)", icon: "⚽" },
    { id: "arts", label: "Творчество (Music/Art)", icon: "🎨" },
    { id: "coding", label: "IT Проекты / Apps", icon: "💻" },
    { id: "debate", label: "Дебаты / Модель ООН", icon: "🗣️" },
    { id: "social", label: "Социальный проект", icon: "🌍" },
    { id: "charity", label: "Благотворительность", icon: "💎" },
  ];

  const handleChat = () => {
    if (!input.trim()) return;
    setChatMessages(p => [...p, { role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setChatMessages(p => [...p, { role: "assistant", text: `Для региона ${stats.region} с такими показателями у тебя отличный потенциал! Особенно если прокачаешь Spike.` }]);
    }, 600);
  };

  const handleBuild = () => {
    if (onBuild) onBuild();
  };

  const toggleActivity = (id: string) => {
    const current = stats.activities || [];
    const newActivities = current.includes(id)
      ? current.filter((a: string) => a !== id)
      : [...current, id];
    
    setStats({ ...stats, activities: newActivities });
  };

  const regionOptions = ["USA / Canada", "Europe", "Asia", "UAE (ОАЭ)", "UK", "South Korea", "Turkey", "Germany"];

  return (
    <section className="max-w-[1500px] mx-auto p-6 min-h-screen bg-[#FDFDFD]">
      <header className="mb-12 flex justify-between items-end border-b-2 border-zinc-100 pb-8">
        <div>
          <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-[0.8] mb-2 text-zinc-900">
            Mission <span className="text-orange-600">Control</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 flex items-center gap-2">
            <Globe size={12}/> Global Admission Systems // 2026
          </p>
        </div>
        
        <button 
          onClick={handleBuild}
          className="bg-zinc-900 text-white px-10 py-5 rounded-[22px] font-black uppercase text-xs hover:bg-orange-600 transition-all flex items-center gap-4 shadow-xl active:scale-95"
        >
          Build Strategy <ArrowRight size={18} className="text-orange-400"/>
        </button>
      </header>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="grid lg:grid-cols-12 gap-10">
        {/* LEFT: AI CHAT & ACTIVITIES */}
        <div className="lg:col-span-8 space-y-10">
          {/* ЧАТ */}
          <div className="bg-white border-2 border-zinc-100 rounded-[50px] h-[450px] flex flex-col shadow-sm overflow-hidden border-b-8 border-b-zinc-900">
            <div className="p-8 border-b border-zinc-50 bg-zinc-50/50 flex justify-between items-center">
              <div className="flex items-center gap-4 text-zinc-900">
                 <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-orange-500"><Flame size={20}/></div>
                 <span className="font-black italic uppercase text-sm">Strategic Mentor v2</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-hide">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-6 rounded-[30px] font-bold text-sm ${m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-zinc-100 text-zinc-800'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-white flex gap-3">
              <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==='Enter' && handleChat()} placeholder="Спроси совета..." className="flex-1 bg-zinc-50 p-6 rounded-3xl outline-none font-bold italic border-2 border-transparent focus:border-zinc-100 text-zinc-900" />
            </div>
          </div>

          {/* МИНИ ТАБЛИЦА АКТИВНОСТЕЙ */}
          <div className="bg-white border-2 border-zinc-100 p-10 rounded-[50px] shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <Star className="text-orange-500" fill="currentColor" size={20} />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">Внеклассные достижения (Extracurriculars)</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {activitiesList.map((act) => {
                const isSelected = stats.activities?.includes(act.id);
                return (
                  <motion.div
                    key={act.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleActivity(act.id)}
                    className={`cursor-pointer p-5 rounded-[25px] border-2 flex items-center gap-3 transition-all ${
                      isSelected 
                        ? "bg-zinc-900 border-zinc-900 text-white shadow-lg" 
                        : "bg-white border-zinc-100 text-zinc-500 hover:border-orange-500"
                    }`}
                  >
                    <span className="text-lg">{act.icon}</span>
                    <span className="font-black uppercase italic text-[9px] tracking-tight flex-1">
                      {act.label}
                    </span>
                    {isSelected && <CheckCircle2 size={16} className="text-orange-500" />}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: DOSSIER */}
        <aside className="lg:col-span-4">
          <div className="bg-white border-2 border-zinc-900 p-10 rounded-[50px] shadow-2xl sticky top-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-8 flex items-center gap-2">
              <GraduationCap size={16}/> Profile Metrics
            </h4>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Target Region</label>
                <select value={stats.region} onChange={(e)=>setStats({...stats, region: e.target.value})} className="w-full mt-2 p-5 bg-zinc-50 border-2 border-zinc-100 rounded-3xl font-black appearance-none cursor-pointer text-zinc-900">
                  {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-zinc-400 ml-2 text-zinc-900">GPA</label>
                  <input type="number" step="0.1" value={stats.gpa} onChange={(e)=>setStats({...stats, gpa: e.target.value})} className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-3xl font-black text-zinc-900" placeholder="GPA" />
                </div>
                <div className="space-y-2 text-zinc-900">
                  <label className="text-[8px] font-black uppercase text-zinc-400 ml-2">IELTS</label>
                  <input type="number" step="0.5" value={stats.ielts} onChange={(e)=>setStats({...stats, ielts: e.target.value})} className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-3xl font-black text-zinc-900" placeholder="IELTS" />
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-[10px] font-black uppercase text-zinc-400 italic">SAT: {stats.sat}</span>
                   <button onClick={()=>setStats({...stats, satOptional: !stats.satOptional})} className={`w-10 h-5 rounded-full relative transition-colors ${stats.satOptional ? 'bg-orange-500' : 'bg-zinc-200'}`}>
                     <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${stats.satOptional ? 'left-5' : 'left-0.5'}`} />
                   </button>
                </div>
                {!stats.satOptional && (
                  <input type="range" min="1000" max="1600" step="10" value={stats.sat} onChange={(e)=>setStats({...stats, sat: e.target.value})} className="w-full accent-orange-600" />
                )}
              </div>

              <button onClick={handleBuild} className="w-full bg-orange-600 text-white p-6 rounded-3xl font-black uppercase italic flex items-center justify-center gap-4 hover:bg-zinc-900 transition-all group shadow-xl shadow-orange-100">
                Build Strategy <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </aside>
      </motion.div>
    </section>
  );
}