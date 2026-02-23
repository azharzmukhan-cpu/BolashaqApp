"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, Target, FileText, History, 
  Star, Zap, ChevronRight, LogOut, LayoutGrid 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Импортируем твои компоненты (убедись, что пути верные)
import EssayPolisher from "../../components/EssayPolisher";
import AdmissionCalculator from "../../components/AdmissionCalculator";
import TestsCenter from "../../components/TestsCenter";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("strategy");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/");
      else setUser(session.user);
    });
  }, [router]);

  const menu = [
    { id: "strategy", label: "Стратегия", icon: <Target size={20}/> },
    { id: "tests", label: "Тестирование", icon: <Zap size={20}/> },
    { id: "writing", label: "AI Эссе", icon: <FileText size={20}/> },
    { id: "history", label: "История", icon: <History size={20}/> },
  ];

  return (
    <main className="min-h-screen bg-white flex text-[#1A1A1A] font-sans selection:bg-orange-100">
      
      {/* SIDEBAR — ГИГАНТСКИЙ И ДЕРЗКИЙ */}
      <aside className="w-[380px] border-r border-gray-50 flex flex-col p-12 sticky top-0 h-screen bg-white z-20">
        <div 
          onClick={() => router.push("/")} 
          className="flex items-center gap-3 font-black text-3xl tracking-[ -0.05em] text-orange-600 cursor-pointer mb-24"
        >
          <div className="bg-orange-600 text-white p-1.5 rounded-2xl shadow-xl shadow-orange-100">
            <GraduationCap size={32}/>
          </div>
          BOLASHAQ
        </div>

        <nav className="space-y-4 flex-1">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-5 px-10 py-7 rounded-[32px] transition-all font-black uppercase text-[11px] tracking-[0.25em] ${
                activeTab === item.id 
                ? "bg-black text-white shadow-[0_20px_40px_rgba(0,0,0,0.15)] scale-105" 
                : "text-gray-300 hover:text-black hover:bg-gray-50 hover:translate-x-2"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* PROFILE CARD IN SIDEBAR */}
        <div className="mt-auto pt-10 border-t border-gray-50">
          <div className="bg-gray-50 p-8 rounded-[35px] mb-8 flex items-center gap-4 border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-[20px] shadow-inner flex-shrink-0" />
            <div className="overflow-hidden">
              <div className="text-[12px] font-black uppercase truncate">{user?.user_metadata?.full_name?.split(' ')[0] || "АЖАР"}</div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Level 1 Student</div>
            </div>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
            className="flex items-center gap-3 px-8 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} /> Выйти из системы
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <section className="flex-1 overflow-y-auto px-24 py-20 bg-[#FAFAFA]">
        
        {/* HEADER SECTION */}
        <header className="mb-24">
          <motion.div
            key={activeTab + "header"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-6 bg-orange-50 w-fit px-4 py-1.5 rounded-full border border-orange-100">
              Dashboard / {activeTab}
            </div>
            <h1 className="text-[110px] font-black uppercase tracking-tighter leading-[0.75] text-gray-900">
              {activeTab === 'strategy' && <>Твоя <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-400 to-yellow-500 animate-gradient">Стратегия</span></>}
              {activeTab === 'tests' && <>Центр <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 animate-gradient">Тестов</span></>}
              {activeTab === 'writing' && <>AI <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 animate-gradient">Редактор</span></>}
              {activeTab === 'history' && <>Твой <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-400 animate-gradient">Архив</span></>}
            </h1>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* CONTENT SWITCHER */}
            {activeTab === "strategy" && (
              <div className="space-y-12">
                <AdmissionCalculator externalProfile={undefined} />
                <div className="bg-black text-white p-16 rounded-[60px] flex items-center justify-between shadow-3xl shadow-orange-900/10 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                      <LayoutGrid size={200} />
                   </div>
                   <div className="relative z-10">
                     <h3 className="text-4xl font-black uppercase italic mb-3">Готовность к подаче</h3>
                     <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] italic">На основе твоих тестов и GPA</p>
                   </div>
                   <div className="text-9xl font-black text-orange-500 relative z-10 animate-pulse">45%</div>
                </div>
              </div>
            )}

            {activeTab === "tests" && (
              <div className="space-y-12">
                <div className="bg-orange-600 p-14 rounded-[60px] text-white flex justify-between items-center relative overflow-hidden shadow-2xl shadow-orange-200">
                   <div className="relative z-10">
                     <h3 className="text-5xl font-black uppercase italic mb-4 tracking-tighter">База знаний</h3>
                     <p className="text-orange-200 text-[11px] font-black uppercase tracking-[0.25em] max-w-md">
                       Пройди все тесты, чтобы наш AI составил для тебя идеальный список университетов.
                     </p>
                   </div>
                   <Zap size={180} className="absolute -right-10 text-orange-500 opacity-40 rotate-12" />
                </div>
                <TestsCenter />
              </div>
            )}

            {activeTab === "writing" && (
              <div className="bg-white p-2 rounded-[70px] shadow-[0_40px_80px_rgba(0,0,0,0.04)] border border-gray-50">
                <EssayPolisher />
              </div>
            )}

            {activeTab === "history" && (
              <div className="grid gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-12 rounded-[50px] border border-gray-50 flex items-center justify-between group hover:border-orange-200 hover:shadow-xl hover:shadow-gray-100 transition-all duration-500 cursor-pointer">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500 text-gray-300 shadow-inner">
                        <Star size={32} />
                      </div>
                      <div>
                        <div className="text-2xl font-black uppercase tracking-tight mb-1 italic">Результаты теста #{i}</div>
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Пройдено: 12 февраля 2026 • Результат: 98%</div>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white transition-all duration-500">
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ГЛОБАЛЬНЫЕ СТИЛИ ДЛЯ ГРАДИЕНТА */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s linear infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #bbb;
        }
      `}</style>
    </main>
  );
}