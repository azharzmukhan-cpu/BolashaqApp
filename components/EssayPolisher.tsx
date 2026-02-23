"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PenTool, Zap, Cpu, ChevronRight, Lock, Flame, Quote, Maximize2, Minimize2, Loader2, Sparkles, Bot, X, Check
} from "lucide-react";

// --- КОМПОНЕНТ УМНОГО AI-БОТА ---
const AIBuddy = ({ essayLength, isAnalyzing, score, isDeepActive, isRewriting }: any) => {
  const [status, setStatus] = useState("idle"); 
  const [isVisible, setIsVisible] = useState(true);
  const [comment, setComment] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Фразы при клике
  const clickPhrases = [
    "Сильный opening. Ivy любит такие.", "Добавь конкретику. Где цифры?", "Это звучит как CV. Где ты?",
    "Хмм… покажи внутренний конфликт.", "Less summary. More story.", "Admissions officer зевает… разбудим его?",
    "Вот тут ты почти гений.", "Слишком безопасно. Рискуй.", "Это может стать viral-эссе.",
    "Не пиши идеально. Пиши честно.", "Где твоя уязвимость?", "Добавь сцену. Я хочу видеть это.",
    "Ты сейчас на 8.3. Можем сделать 9.4.", "Это уже пахнет offer-ом.", "Офицер поставил плюсик.",
    "Где turning point?", "Это звучит взрослее, чем 17 лет. Хорошо."
  ];

  // Реакция на процесс написания
  useEffect(() => {
    if (essayLength > 10 && !isAnalyzing) {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        const p = ["Ты переписываешь этот абзац 5 минут… он важный?", "Интересно… ты сомневаешься?", "Не редактируй душу.", "Ты сейчас перфекционист.", "Удалять страшнее, чем писать."];
        setComment(p[Math.floor(Math.random() * p.length)]);
        setStatus("thinking");
      }, 20000); 
    }
    return () => { if (typingTimerRef.current) clearTimeout(typingTimerRef.current); };
  }, [essayLength, isAnalyzing]);

  // Реакции на экшены
  useEffect(() => {
    if (isAnalyzing) {
      const p = ["Запускаю Ivy-сканирование...", "Проверяю лидерство...", "Ищу клише...", "Оценка искренности...", "IQ 160 активирован."];
      setComment(p[Math.floor(Math.random() * p.length)]);
      setStatus("thinking");
    } else if (isRewriting) {
      const p = ["Я усиливаю твой голос.", "Это уже Ivy-level.", "Вот это — power move.", "Теперь звучит как ты, но лучше.", "Вот так читают победителей."];
      setComment(p[Math.floor(Math.random() * p.length)]);
      setStatus("proud");
    } else if (isDeepActive) {
      setComment("Теперь будет больно. Но честно. Admissions-режим: BRUTAL.");
      setStatus("thinking");
    } else if (score > 0) {
      if (score >= 8.5) {
        setComment("Это не просто эссе. Это позиция. Такое обсуждают на комитете.");
        setStatus("proud");
      } else if (score < 6) {
        setComment("Это draft. Не финал. Ты можешь глубже.");
        setStatus("dramatic");
      }
    }
  }, [isAnalyzing, isDeepActive, isRewriting, score]);

  // Сон
  useEffect(() => {
    const resetTimer = () => {
      if (status === "sleeping") setStatus("idle");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setStatus("sleeping");
        const p = ["Я слежу за метафорами во сне...", "Не удаляй лучший абзац случайно...", "Я вижу твой потенциал...", "Draft v17… легендарно."];
        setComment(p[Math.floor(Math.random() * p.length)]);
      }, 40000); 
    };
    window.addEventListener("mousemove", resetTimer);
    return () => window.removeEventListener("mousemove", resetTimer);
  }, [status]);

  const handleClick = () => {
    if (Math.random() < 0.07) {
      setComment("Offer loading… 78%");
    } else {
      setComment(clickPhrases[Math.floor(Math.random() * clickPhrases.length)]);
    }
    setStatus("waving");
    setTimeout(() => { setStatus("idle"); setComment(""); }, 3500);
  };

  if (!isVisible) return (
    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsVisible(true)}
      className="fixed bottom-6 right-6 z-[100] bg-black text-white p-3 px-5 rounded-full shadow-2xl border-2 border-orange-500 text-[10px] font-black uppercase italic flex items-center gap-2 pointer-events-auto"
    >
      <Bot size={14} className="text-orange-500" /> Summon Assistant
    </motion.button>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <motion.div drag dragMomentum={false} onDragStart={() => setStatus("dragging")} onDragEnd={() => setStatus("idle")}
        className="pointer-events-auto cursor-grab active:cursor-grabbing absolute bottom-10 right-10 flex flex-col items-center"
      >
        <AnimatePresence>
          {comment && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -20, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white border-2 border-zinc-900 p-4 rounded-2xl shadow-2xl absolute -top-24 w-48 text-center"
            >
              <p className="text-[11px] font-black italic leading-tight text-zinc-800 uppercase tracking-tighter">{comment}</p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-zinc-900 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={status === "sleeping" ? { y: [0, 3, 0] } : status === "thinking" ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : { y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={handleClick} className="relative group flex flex-col items-center"
        >
          <div className="w-1 h-3 bg-zinc-800 rounded-full relative">
            <motion.div animate={{ backgroundColor: status === "dramatic" ? "#ef4444" : "#f97316" }} className="absolute -top-1.5 -left-0.5 w-2 h-2 rounded-full shadow-[0_0_10px_orange]" />
          </div>

          <div className={`w-16 h-14 rounded-[22px] border-b-4 border-zinc-950 flex flex-col items-center justify-center relative shadow-2xl border-2 transition-all duration-500 
            ${status === "proud" ? "bg-orange-600 border-orange-400" : "bg-zinc-900 border-zinc-800"}`}>
             <div className="flex gap-2.5">
                <motion.div 
                  animate={status === "sleeping" ? { height: 2 } : status === "thinking" ? { height: [5, 2, 5] } : { height: 5 }} 
                  className={`w-2.5 rounded-full ${status === "proud" ? "bg-white" : "bg-orange-400"}`} 
                />
                <motion.div 
                  animate={status === "sleeping" ? { height: 2 } : status === "thinking" ? { height: [5, 2, 5] } : { height: 5 }} 
                  className={`w-2.5 rounded-full ${status === "proud" ? "bg-white" : "bg-orange-400"}`} 
                />
             </div>
          </div>

          <motion.div animate={status === "waving" ? { rotate: [0, 140, 20, 140, 0] } : { rotate: 0 }} className="absolute -right-3 top-8 w-5 h-2.5 bg-zinc-800 rounded-full origin-left" />
          <motion.div animate={status === "proud" ? { y: [-2, -5, -2] } : {}} className="absolute -left-3 top-8 w-5 h-2.5 bg-zinc-800 rounded-full origin-right" />

          <button onClick={(e) => { e.stopPropagation(); setIsVisible(false); }} className="absolute -top-2 -right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-full shadow-md text-zinc-400 hover:text-red-500 pointer-events-auto">
            <X size={10} strokeWidth={3} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- ГЛАВНАЯ СТРАНИЦА ESSAY POLISHER ---
export default function EssayPolisher() {
  const [essay, setEssay] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [deepAnalysis, setDeepAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [deepLoading, setDeepLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis");
  const [isDeepUnlocked, setIsDeepUnlocked] = useState(false);
  const [isRedRewriteLoading, setIsRedRewriteLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const analyzeEssay = async () => {
    if (!essay.trim() || essay.length < 100) return;
    setLoading(true);
    setAnalysis(null);
    setIsDeepUnlocked(false);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [
            { 
              role: "system", 
              content: `You are a Senior Admissions Officer at an Ivy League University (IQ 160). Current Date: Feb 23, 2026.
              STRICT JSON FORMAT: 
              { 
                "tone": "expert verdict in Russian", 
                "leadership": "leadership potential analysis in Russian", 
                "score": 8.5, 
                "metaphors": "metaphor depth analysis in Russian",
                "vocabulary_upgrades": ["weak_word -> elite_academic_alternative"], 
                "prediction": "Reach/Target/Safety" 
              }. 
              RULES: No stars (*).` 
            }, 
            { role: "user", content: `Audit this essay: ${essay}` }
          ] 
        }),
      });
      const data = await res.json();
      const rawContent = data.text || data.choices?.[0]?.message?.content || "";
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) setAnalysis(JSON.parse(jsonMatch[0]));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const unlockDeepAnalysis = async () => {
    if (deepAnalysis && isDeepUnlocked) return;
    setIsDeepUnlocked(true);
    if (deepAnalysis) return;
    setDeepLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [
            { role: "system", content: `Linguistic Genius (IQ 160). Deep audit in Russian. Use headers. No stars (*).` }, 
            { role: "user", content: `Linguistic deep dive: ${essay}` }
          ] 
        }),
      });
      const data = await res.json();
      setDeepAnalysis(data.text || data.choices?.[0]?.message?.content || "");
    } catch (e) { setDeepAnalysis("ERROR"); } finally { setDeepLoading(false); }
  };

  const redRewrite = async () => {
    if (!essay.trim()) return;
    setIsRedRewriteLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [
            { role: "system", content: `Elite Ivy Editor. Detect language and rewrite only in that language. No stars (*).` }, 
            { role: "user", content: `Elite rewrite of weakest section: ${essay}` }
          ] 
        }),
      });
      const data = await res.json();
      const result = data.text || data.choices?.[0]?.message?.content || "";
      if (result) {
        setDeepAnalysis(prev => `🔥 ELITE UPGRADE:\n\n${result}\n\n------------------\n\n${prev}`);
      }
    } catch (e) { console.error(e); } finally { setIsRedRewriteLoading(false); }
  };

  return (
    <div className={`transition-all duration-500 ${isFullScreen ? "fixed inset-0 z-[100] bg-white p-4 md:p-10" : "relative p-4 lg:p-12"}`}>
      <div className={`mx-auto h-full group relative bg-white border border-gray-200 shadow-2xl overflow-hidden font-sans ${isFullScreen ? "rounded-3xl" : "rounded-[60px]"}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-gray-50 bg-white/90 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="bg-black text-white p-3 rounded-2xl"><Sparkles size={20} /></div>
            <div className="flex flex-col">
              <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">Polisher <span className="text-orange-600">IVY_X</span></h3>
              <span className="text-[9px] font-black text-zinc-400 tracking-[0.3em] uppercase mt-1">v2.6 Intelligence</span>
            </div>
          </div>
          <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-3 hover:bg-zinc-100 rounded-full transition-all">
            {isFullScreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
          </button>
        </div>

        <div className="grid lg:grid-cols-[4.5fr_5.5fr] h-[calc(100%-100px)]">
          {/* Editor */}
          <div className="p-8 lg:p-12 border-r border-gray-100 flex flex-col gap-6 bg-zinc-50/10">
            <textarea value={essay} onChange={(e) => setEssay(e.target.value)} placeholder="Вставь свое эссе. Мы проверим его на соответствие стандартам Лиги Плюща..." className="flex-1 w-full bg-transparent text-[17px] font-medium leading-[1.8] outline-none resize-none" />
            <motion.button whileHover={{ scale: 1.02 }} onClick={analyzeEssay} disabled={loading || essay.length < 100} className="w-full h-20 bg-black text-white rounded-[25px] font-black uppercase text-[11px] tracking-[0.5em] flex items-center justify-center gap-3 hover:bg-orange-600 transition-all disabled:opacity-20">
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Analyze Essay"}
            </motion.button>
          </div>

          {/* Analysis View */}
          <div className="p-8 lg:p-14 bg-[#0A0A0A] text-white flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
                  <div className="flex justify-between items-start mb-12">
                     <div>
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-3 block italic">Ivy Score</span>
                        <div className="text-[120px] font-black italic tracking-tighter leading-none">{analysis.score}</div>
                     </div>
                     <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-right backdrop-blur-md">
                        <span className="text-[9px] font-black text-zinc-500 uppercase block mb-1">Chance</span>
                        <span className="text-orange-500 font-black italic text-xl uppercase">{analysis.prediction}</span>
                     </div>
                  </div>

                  <div className="flex gap-10 mb-8 border-b border-white/5">
                     <button onClick={() => setActiveTab("analysis")} className={`pb-5 text-[11px] font-black uppercase tracking-[0.4em] ${activeTab === "analysis" ? "text-orange-500 border-b-2 border-orange-500" : "text-zinc-600"}`}>Verdict</button>
                     <button onClick={() => setActiveTab("upgrades")} className={`pb-5 text-[11px] font-black uppercase tracking-[0.4em] ${activeTab === "upgrades" ? "text-orange-500 border-b-2 border-orange-500" : "text-zinc-600"}`}>Upgrades</button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-hide">
                      {activeTab === "analysis" ? (
                        <div className="grid gap-6">
                           <div className="p-7 bg-white/5 rounded-[35px] border border-white/10"><p className="text-[14px] font-bold text-zinc-300 italic">{analysis.tone}</p></div>
                           <div className="p-7 bg-white/5 rounded-[35px] border border-white/10"><p className="text-[14px] font-bold text-zinc-300 italic">{analysis.leadership}</p></div>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                           {analysis.vocabulary_upgrades?.map((v: string, i: number) => (
                             <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-orange-600 transition-all">
                                <span className="text-[14px] font-bold text-zinc-400 group-hover:text-white">{v}</span>
                                <ChevronRight size={16} />
                             </div>
                          ))}
                        </div>
                      )}
                  </div>

                  <button onClick={unlockDeepAnalysis} className="mt-8 py-6 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center gap-4 hover:bg-orange-600 transition-all shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] flex items-center gap-3">
                      {deepLoading ? <Loader2 className="animate-spin" size={16}/> : <Lock size={16}/>} Unlock Deep Dive
                    </span>
                  </button>

                  <AnimatePresence>
                    {isDeepUnlocked && (
                      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="absolute inset-0 bg-[#0A0A0A] z-50 p-10 lg:p-14 flex flex-col border-l border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-12">
                           <h4 className="text-orange-500 font-black uppercase tracking-[0.6em] text-[11px] italic tracking-widest">Deep Audit</h4>
                           <button onClick={() => setIsDeepUnlocked(false)} className="text-zinc-600 hover:text-white text-[10px] font-black uppercase">Close</button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-8 text-[15px] font-bold italic text-zinc-200 leading-[1.8] whitespace-pre-wrap">{deepLoading ? <Loader2 className="animate-spin mx-auto mt-20" /> : deepAnalysis}</div>
                        <div className="mt-10">
                           <button onClick={() => redRewrite()} disabled={isRedRewriteLoading} className="w-full py-6 bg-orange-600 text-white rounded-2xl flex items-center justify-center gap-4 font-black uppercase text-[11px] tracking-[0.5em] hover:bg-white hover:text-orange-600 transition-all">
                              {isRedRewriteLoading ? <Loader2 className="animate-spin" /> : <><Flame size={20}/> Red Rewrite</>}
                           </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                   <Cpu size={100} className="mb-6 animate-pulse" />
                   <p className="text-[11px] font-black uppercase tracking-[1em]">Engine Idle</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AIBuddy 
        essayLength={essay.length}
        isAnalyzing={loading}
        score={analysis?.score || 0}
        isDeepActive={isDeepUnlocked}
        isRewriting={isRedRewriteLoading}
      />
    </div>
  );
}