"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, Send, Loader2, Star, Target, Clock, LogOut, X, Sparkles, 
  CheckCircle2, Zap, User, Settings, Save, Menu, FileText, LayoutDashboard, 
  Activity, Globe, Camera, ArrowRight, Heart, Bot, Lock
} from "lucide-react";
import { supabase } from "@/lib/supabase";

import AdmissionCalculator from "@/components/AdmissionCalculator";
import EssayPolisher from "@/components/EssayPolisher";
import MainStrategy from "@/components/MainStrategy";
import TestsCenter from "@/components/TestsCenter";

type Message = { role: "user" | "assistant"; text: string };

// --- КОМПОНЕНТ УМНОГО AI-БОТА ---
const AIBuddy = ({ activeTab, isTyping }: { activeTab: string, isTyping: boolean }) => {
  const [status, setStatus] = useState("idle"); 
  const [isVisible, setIsVisible] = useState(true);
  const [comment, setComment] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getContextPhrase = () => {
    switch(activeTab) {
      case 'tests': return "Анализирую твой профессиональный код...";
      case 'strategy': return "Строим маршрут в Лигу Плюща?";
      case 'calc': return "Считаю вероятность твоего успеха...";
      case 'essay': return "Сделаем твое эссе незабываемым.";
      default: return "Я здесь, чтобы помочь тебе поступить.";
    }
  };

  useEffect(() => {
    setComment(getContextPhrase());
    setStatus("waving");
    setTimeout(() => setStatus("idle"), 2000);
  }, [activeTab]);

  useEffect(() => {
    if (isTyping) {
      setStatus("thinking");
      setComment("Хмм, дай подумать...");
    } else {
      setStatus("idle");
    }
  }, [isTyping]);

  useEffect(() => {
    const resetTimer = () => {
      if (status === "sleeping") setStatus("idle");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setStatus("sleeping");
        setComment("Zzz... Система в режиме ожидания.");
      }, 60000); 
    };
    window.addEventListener("mousemove", resetTimer);
    return () => window.removeEventListener("mousemove", resetTimer);
  }, [status]);

  if (!isVisible) return (
    <motion.button 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      onClick={() => setIsVisible(true)}
      className="fixed bottom-6 right-6 z-[120] bg-black text-white p-3 px-5 rounded-full shadow-2xl border-2 border-orange-500 text-[10px] font-black uppercase italic flex items-center gap-2 pointer-events-auto"
    >
      <Bot size={14} className="text-orange-500" /> Wake AI
    </motion.button>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[120]">
      <motion.div 
        drag dragMomentum={false} 
        onDragStart={() => setStatus("dragging")} 
        onDragEnd={() => setStatus("idle")}
        className="pointer-events-auto cursor-grab active:cursor-grabbing absolute bottom-10 right-10 flex flex-col items-center"
      >
        <AnimatePresence>
          {comment && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.8 }} 
              animate={{ opacity: 1, y: -20, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-zinc-900 border-2 border-orange-500/30 p-4 rounded-2xl shadow-2xl absolute -top-24 w-48 text-center"
            >
              <p className="text-[11px] font-black italic leading-tight text-white uppercase tracking-tighter">{comment}</p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-900 border-r-2 border-b-2 border-orange-500/30 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={status === "sleeping" ? { y: [0, 3, 0] } : status === "thinking" ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : { y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative group flex flex-col items-center"
        >
          <div className="w-1 h-3 bg-zinc-800 rounded-full relative">
            <motion.div animate={{ backgroundColor: isTyping ? "#f97316" : "#4ade80" }} className="absolute -top-1.5 -left-0.5 w-2 h-2 rounded-full shadow-[0_0_10px_orange]" />
          </div>
          <div className="w-16 h-14 rounded-[22px] bg-zinc-900 border-2 border-zinc-800 border-b-4 border-b-black flex flex-col items-center justify-center relative shadow-2xl transition-all duration-500">
             <div className="flex gap-2.5">
                <motion.div animate={status === "sleeping" ? { height: 2 } : status === "thinking" ? { height: [5, 2, 5] } : { height: 5 }} className="w-2.5 rounded-full bg-orange-400" />
                <motion.div animate={status === "sleeping" ? { height: 2 } : status === "thinking" ? { height: [5, 2, 5] } : { height: 5 }} className="w-2.5 rounded-full bg-orange-400" />
             </div>
          </div>
          <motion.div animate={status === "waving" ? { rotate: [0, 140, 20, 140, 0] } : { rotate: 0 }} className="absolute -right-3 top-8 w-5 h-2.5 bg-zinc-800 rounded-full origin-left" />
          <motion.div animate={status === "dragging" ? { rotate: 45 } : {}} className="absolute -left-3 top-8 w-5 h-2.5 bg-zinc-800 rounded-full origin-right" />
          <button onClick={(e) => { e.stopPropagation(); setIsVisible(false); }} className="absolute -top-2 -right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-full shadow-md text-zinc-400 hover:text-red-500 pointer-events-auto">
            <X size={10} strokeWidth={3} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"main" | "tests" | "calc" | "essay" | "strategy">("main");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- ДАННЫЕ ПРОФИЛЯ ---
  const [stats, setStats] = useState({
    gpa: "4.8", 
    ielts: "7.5", 
    sat: "1450", 
    satOptional: false, 
    region: "USA / Canada"
  });

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  });

  const [userContext, setUserContext] = useState({
    profile: "Студент",
    region: "Kazakhstan",
  });

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Привет! Я твой персональный AI-архитектор. Готов проанализировать твои шансы и составить стратегию поступления. С чего начнем?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        const fullName = session.user.user_metadata?.full_name || "";
        setUserInfo({
          firstName: fullName.split(' ')[0] || "",
          lastName: fullName.split(' ')[1] || "",
          avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
        });
      }
      setIsLoading(false);
    });
    const savedProfile = localStorage.getItem("ashkomu_pro_dna") || "Студент";
    const savedRegion = localStorage.getItem("ashkomu_selected_region") || "Kazakhstan";
    setUserContext({ profile: savedProfile, region: savedRegion });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // --- УМНАЯ ПРОВЕРКА ПЕРЕД ДЕЙСТВИЕМ ---
  const protectedAction = (action: () => void) => {
    if (!session) {
      setActiveModal("AuthNeeded");
    } else {
      action();
    }
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue.trim();
    if (!textToSend || isTyping) return;

    // Чат можно оставить открытым для всех, или тоже защитить:
    if (!session) {
        setActiveModal("AuthNeeded");
        return;
    }
    
    setMessages(prev => [...prev, { role: "user", text: textToSend }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.text })).concat({ role: "user", content: textToSend })
        })
      });
      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: "assistant", text: data.text }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", text: "Связь временно потеряна. Попробуй еще раз." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getSmartDeadline = () => {
    const today = new Date("2026-02-23");
    let deadlineDate: Date;
    let label: string;
    let actionPrompt: string;

    if (userContext.profile === "Студент") {
      deadlineDate = new Date("2026-03-01");
      label = "Summer School Apps";
      actionPrompt = "AI, составь список лучших летних школ для моего профиля";
    } else if (userContext.region === "USA") {
      deadlineDate = new Date("2026-03-15");
      label = "Regular Decision";
      actionPrompt = "AI, проверь готовность моих документов для вузов США";
    } else {
      deadlineDate = new Date("2026-04-01");
      label = "Final Submission";
      actionPrompt = "AI, какие дедлайны остались на апрель?";
    }

    const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isUrgent = diffDays <= 7;
    const formattedDate = deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

    return { label, formattedDate, isUrgent, diffDays, actionPrompt };
  };

  const deadline = getSmartDeadline();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-orange-600" size={48} /></div>;

  // УДАЛЕНО УСЛОВИЕ !session -> ТЕПЕРЬ САЙТ ОТКРЫТ ВСЕГДА

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex overflow-x-hidden font-sans selection:bg-orange-500 selection:text-white">
      
      {/* SIDEBAR */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 280 : 90 }}
        className="fixed left-0 top-0 h-full bg-[#0A0A0A] text-white z-50 flex flex-col border-r border-white/5 shadow-2xl transition-all"
      >
        <div className="p-7 flex items-center">
          <motion.div whileHover={{ rotate: 15 }} className="text-orange-500 min-w-[36px]">
            <GraduationCap size={36} strokeWidth={2} />
          </motion.div>
          {isSidebarOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-black italic tracking-tighter text-2xl ml-4">
              BOLASHAQ
            </motion.span>
          )}
        </div>

        <nav className="mt-12 flex-1 px-4 space-y-3">
          {[
            { id: 'main', icon: <LayoutDashboard size={22}/>, label: 'Dashboard' },
            { id: 'tests', icon: <Activity size={22}/>, label: 'DNA Scanner' },
            { id: 'strategy', icon: <Target size={22}/>, label: 'Strategy' },
            { id: 'calc', icon: <Zap size={22}/>, label: 'Admissions' },
            { id: 'essay', icon: <FileText size={22}/>, label: 'Essay AI' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                if (item.id === 'main') setActiveTab('main');
                else protectedAction(() => setActiveTab(item.id as any));
              }} 
              className={`w-full flex items-center gap-5 p-4 rounded-[22px] transition-all group ${activeTab === item.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-900/20' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}
            >
              <div className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{item.icon}</div>
              {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>}
              {!session && item.id !== 'main' && isSidebarOpen && <Lock size={12} className="ml-auto opacity-30" />}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 pt-8">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors mb-4">
            <Menu size={20} />
          </button>
          {session ? (
            <button onClick={handleSignOut} className="w-full flex items-center gap-5 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all mb-4">
                <LogOut size={22}/>
                {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>}
            </button>
          ) : (
            <button onClick={() => setActiveModal("AuthNeeded")} className="w-full flex items-center gap-5 p-4 text-orange-500 hover:bg-orange-500/10 rounded-2xl transition-all mb-4">
                <User size={22}/>
                {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">Login</span>}
            </button>
          )}
        </div>
      </motion.aside>

      <main className={`flex-1 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'ml-[280px]' : 'ml-[90px]'}`}>
        
        <header className="h-24 flex items-center px-12 sticky top-0 bg-[#F6F6F6]/90 backdrop-blur-xl z-40 border-b border-gray-100">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">System Online // {activeTab}</span>
            </div>
            
            <motion.button 
              whileHover={{ y: -3 }}
              onClick={() => protectedAction(() => setActiveModal("Profile"))} 
              className="flex items-center gap-4 bg-white border border-gray-200 p-2 pr-6 rounded-[22px] hover:shadow-xl transition-all"
            >
              <div className="w-10 h-10 rounded-[16px] overflow-hidden bg-gray-100 flex items-center justify-center">
                {session ? <img src={userInfo.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={20} className="text-gray-400" />}
              </div>
              <span className="text-xs font-black uppercase italic tracking-tighter">
                {session ? userInfo.firstName : "Guest User"}
              </span>
            </motion.button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-12 py-12 pb-24">
          <AnimatePresence mode="wait">
            
            {activeTab === "main" && (
              <motion.div key="main" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <header className="mb-20">
                  <h1 className="text-[11vw] font-black mb-4 tracking-[-0.06em] uppercase leading-[0.8] italic text-[#0A0A0A]">
                    Твой <br />
                    <span className="bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-[length:200%_auto] animate-gradient text-transparent bg-clip-text">
                      Масштаб.
                    </span>
                  </h1>
                </header>

                <div className="grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-8 space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <motion.button 
                        whileHover={{ y: -8 }}
                        onClick={() => protectedAction(() => setActiveTab("strategy"))} 
                        className="group bg-white p-12 rounded-[55px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:border-orange-500/30 transition-all text-left relative overflow-hidden"
                      >
                        <Target className="text-orange-600 mb-8 group-hover:rotate-12 transition-transform" size={48} strokeWidth={1.5} />
                        <h3 className="text-3xl font-black uppercase italic leading-none">Roadmap</h3>
                        <p className="text-[11px] font-bold uppercase text-gray-400 mt-4 tracking-widest">Персональный план</p>
                      </motion.button>

                      <motion.button 
                        whileHover={{ y: -8 }}
                        onClick={() => protectedAction(() => setActiveTab("tests"))} 
                        className="group bg-[#0A0A0A] p-12 rounded-[55px] shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:bg-orange-600 transition-all text-left relative overflow-hidden"
                      >
                        <Activity className="text-orange-500 mb-8 group-hover:scale-110 transition-transform" size={48} strokeWidth={1.5} />
                        <h3 className="text-3xl font-black uppercase italic text-white leading-none">DNA Scan</h3>
                        <p className="text-[11px] font-bold uppercase text-orange-200/60 mt-4 tracking-widest">Проф-ориентация</p>
                      </motion.button>
                    </div>

                    <div id="ai-chat-section" className="bg-white border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.04)] rounded-[60px] h-[650px] flex flex-col overflow-hidden">
                      <div className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide">
                        {messages.map((m, i) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} 
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`p-8 rounded-[35px] text-[15px] leading-relaxed shadow-sm max-w-[85%] ${
                              m.role === 'user' 
                                ? 'bg-black text-white rounded-tr-none font-bold italic uppercase tracking-tight' 
                                : 'bg-gray-50 text-gray-800 rounded-tl-none font-medium'
                            }`}>
                              {m.text}
                            </div>
                          </motion.div>
                        ))}
                        {isTyping && (
                          <div className="flex items-center gap-3 px-4">
                            <span className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce" />
                              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </span>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      <div className="p-8 flex gap-4 bg-white/50 backdrop-blur-md border-t border-gray-50">
                        <input 
                          value={inputValue} 
                          onChange={(e) => setInputValue(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                          className="flex-1 bg-gray-100 px-10 py-6 rounded-[30px] outline-none text-[13px] font-bold uppercase italic border-2 border-transparent focus:border-orange-500/20 transition-all placeholder:text-gray-300" 
                          placeholder="Спроси что угодно о поступлении..." 
                        />
                        <motion.button 
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleSendMessage()} 
                          className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-orange-200 transition-all hover:bg-black"
                        >
                          <Send size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      onClick={() => {
                        const chatSection = document.getElementById('ai-chat-section');
                        chatSection?.scrollIntoView({ behavior: 'smooth' });
                        handleSendMessage(deadline.actionPrompt);
                      }}
                      className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-sm text-center relative overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute top-4 right-6 flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${deadline.isUrgent ? 'bg-red-50 animate-ping' : 'bg-green-50'}`} />
                          <span className="text-[8px] font-black uppercase text-gray-400">AI Priority: 2026</span>
                        </div>
                        <div className={`w-28 h-28 ${deadline.isUrgent ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'} rounded-[40px] flex items-center justify-center mx-auto mb-8 group-hover:rotate-[360deg] transition-all duration-700`}>
                          <Clock size={48} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">{deadline.label}</h4>
                        <p className={`text-4xl font-black italic tracking-tighter leading-none mb-4 transition-colors duration-300 ${deadline.isUrgent ? 'text-red-600' : 'text-black'}`}>
                          {deadline.formattedDate}
                        </p>
                        <div className="bg-zinc-50 rounded-3xl p-6 mt-4 border border-zinc-100 group-hover:border-orange-500 group-hover:bg-orange-50/50 transition-all duration-300">
                           <p className="text-[10px] font-black uppercase italic text-zinc-400 mb-2 flex items-center justify-center gap-2">
                              <Sparkles size={12} className="text-orange-500" /> AI Recommendation
                           </p>
                           <p className="text-xs font-bold leading-tight text-zinc-800">
                              {deadline.isUrgent ? `Срочно! Осталось ${deadline.diffDays}д.` : `Идеальное время для подачи.`}
                           </p>
                        </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "tests" && <motion.div key="tests" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><TestsCenter /></motion.div>}
            {activeTab === "strategy" && (
              <motion.div key="strategy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MainStrategy stats={stats} setStats={setStats} onBuild={() => setActiveTab("calc")} />
              </motion.div>
            )}
            {activeTab === "calc" && (
              <motion.div key="calc" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AdmissionCalculator externalProfile={stats} />
              </motion.div>
            )}
            {activeTab === "essay" && <motion.div key="essay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><EssayPolisher /></motion.div>}

          </AnimatePresence>
        </div>
      </main>

      {/* МОДАЛКА ВХОДА (НОВАЯ) */}
      <AnimatePresence>
        {activeModal === "AuthNeeded" && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-[50px] p-12 text-center relative shadow-2xl">
              <button onClick={() => setActiveModal(null)} className="absolute top-8 right-8 text-gray-300 hover:text-black"><X size={24}/></button>
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Lock size={40} />
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Initialize Session</h2>
              <p className="text-gray-500 font-medium mb-10 leading-relaxed">Чтобы сохранить твои результаты и активировать ИИ-аналитику, нужно войти в систему.</p>
              <button 
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} 
                className="w-full py-6 bg-black text-white rounded-3xl font-black uppercase italic flex items-center justify-center gap-4 hover:bg-orange-600 transition-all"
              >
                Sign in with Google <ArrowRight size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* МОДАЛКА ПРОФИЛЯ */}
      <AnimatePresence>
        {activeModal === "Profile" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[60px] p-16 relative shadow-[0_50px_100px_rgba(0,0,0,0.2)]">
              <button onClick={() => setActiveModal(null)} className="absolute top-12 right-12 text-gray-300 hover:text-black transition-colors"><X size={40} strokeWidth={1}/></button>
              <div className="flex items-center gap-10 mb-16">
                <div className="w-32 h-32 rounded-[45px] overflow-hidden border-4 border-orange-500 p-1 bg-white shadow-2xl">
                    <img src={userInfo.avatar} alt="Avatar" className="w-full h-full object-cover rounded-[38px]" />
                </div>
                <div>
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Settings</h2>
                </div>
              </div>
              <button 
                onClick={async () => {
                  await supabase.auth.updateUser({ data: { full_name: `${userInfo.firstName} ${userInfo.lastName}` } });
                  localStorage.setItem("ashkomu_selected_region", userContext.region);
                  localStorage.setItem("ashkomu_pro_dna", userContext.profile);
                  setActiveModal(null);
                }} 
                className="w-full py-8 bg-orange-600 text-white rounded-[35px] font-black uppercase italic tracking-widest flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl shadow-orange-200"
              >
                <Save size={24}/> Sync Changes
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AIBuddy activeTab={activeTab} isTyping={isTyping} />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F6F6F6; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient { animation: gradient 6s ease infinite; }
      `}</style>
    </div>
  ); 
}