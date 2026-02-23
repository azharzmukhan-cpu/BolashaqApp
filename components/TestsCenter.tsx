"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ArrowRight, Activity, Sparkles, Zap, Cpu, Waves, Bot } from "lucide-react";

// --- КОМПОНЕНТ УМНОГО AI-БОТА ---
const AIBuddy = ({ step, isAnalyzing, result, proProfile }: any) => {
  const [status, setStatus] = useState("idle"); 
  const [isVisible, setIsVisible] = useState(true);
  const [comment, setComment] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const phrases = [
    "Твои ответы формируют уникальный паттерн...",
    "Хмм, интересная комбинация навыков.",
    "Я уже вижу твой будущий кампус в тумане данных.",
    "Этот выбор говорит о сильном лидерском потенциале.",
    "Не спеши. Твое подсознание знает ответ.",
    `Твой DNA профиль: ${proProfile || "в процессе сборки"}`,
    "Анализирую нейронные связи...",
    "Этот университет точно оценит твою креативность.",
    "Ivy League ищет именно таких нестандартных личностей."
  ];

  // Реакция на прогресс теста
  useEffect(() => {
    if (step > 0 && step < 11 && !isAnalyzing) {
      if (step % 3 === 0) {
        const p = ["Глубоко. Продолжай в том же духе.", "Твой профиль становится четче.", "Вижу зачатки гениальности.", "Это был важный вопрос."];
        setComment(p[Math.floor(Math.random() * p.length)]);
        setStatus("thinking");
        setTimeout(() => setStatus("idle"), 3000);
      }
    }
  }, [step]);

  // Реакция на анализ
  useEffect(() => {
    if (isAnalyzing) {
      setComment("Провожу финальный аудит твоей личности...");
      setStatus("thinking");
    } else if (result) {
      setComment("Диагноз готов. Это твой путь к успеху.");
      setStatus("proud");
    }
  }, [isAnalyzing, result]);

  // Сон при бездействии
  useEffect(() => {
    const resetTimer = () => {
      if (status === "sleeping") setStatus("idle");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setStatus("sleeping");
        setComment("Я сканирую варианты твоего будущего во сне...");
      }, 40000); 
    };
    window.addEventListener("mousemove", resetTimer);
    return () => window.removeEventListener("mousemove", resetTimer);
  }, [status]);

  const handleClick = () => {
    setComment(phrases[Math.floor(Math.random() * phrases.length)]);
    setStatus("waving");
    setTimeout(() => { setStatus("idle"); setComment(""); }, 3500);
  };

  if (!isVisible) return (
    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsVisible(true)}
      className="fixed bottom-6 right-6 z-[120] bg-black text-white p-3 px-5 rounded-full shadow-2xl border-2 border-orange-500 text-[10px] font-black uppercase italic flex items-center gap-2 pointer-events-auto"
    >
      <Bot size={14} className="text-orange-500" /> Summon Assistant
    </motion.button>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[120]">
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
            <motion.div animate={{ backgroundColor: isAnalyzing ? "#f97316" : "#4ade80" }} className="absolute -top-1.5 -left-0.5 w-2 h-2 rounded-full shadow-[0_0_10px_orange]" />
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

// --- ГЛАВНЫЙ КОМПОНЕНТ ---
export default function TestsCenter() {
  const [activeTest, setActiveTest] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [proProfile, setProProfile] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const saved = localStorage.getItem("ashkomu_pro_dna");
    if (saved) setProProfile(saved);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const tests = [
    {
      id: "pro",
      title: "PROFORIENTATION",
      subtitle: "discover your top careers",
      icon: <Activity size={32} />,
      color: "from-zinc-900 via-black to-zinc-900",
      questions: [
        { q: "В какой среде ты чувствуешь максимальный драйв?", a: ["Лаборатория или операционная", "Суд или дебаты", "Стройка или ангар", "Студия дизайна", "Биржа или офис", "Код и данные"] },
        { q: "Какую проблему ты хочешь решить?", a: ["Старение", "Экология", "Киберпреступность", "Мировая бедность", "Несправедлосоть", "Смысл и эстетика"] },
        { q: "Твой идеальный инструмент?", a: ["Микроскоп", "Клавиатура", "Чертежи", "Харизма", "Планшет", "Графики"] },
        { q: "С чем работать часами?", a: ["Клетки", "Формулы", "Законы", "Визуал", "Механизмы", "Психология"] },
        { q: "Новость дня?", a: ["Генетика", "Кванты", "Крах рынков", "Архитектура", "Суд", "Кино"] },
        { q: "Принятие решений?", a: ["Цифры", "Интуиция", "Логика", "Опыт", "Советы", "Видение"] },
        { q: "Где твоя лекция?", a: ["Johns Hopkins", "MIT", "Yale", "Stanford", "RCA", "ETH Zurich"] },
        { q: "Твой результат?", a: ["Жизнь", "Система", "Правда", "Феномен", "Сделка", "Открытие"] },
        { q: "Суперсила?", a: ["Видеть ДНК", "Код", "Убеждение", "Рынки", "Будущее", "Ремонт"] },
        { q: "Конкуренция?", a: ["Драйв", "Вне её", "Ментор", "Я первый", "Союзы", "Игнор"] },
        { q: "Люди для тебя?", a: ["Ценность", "Одиночество", "Процессы", "Массы", "Консультация", "Техника"] },
        { q: "График?", a: ["24/7", "Порядок", "Свобода", "Цели", "Поездки", "Рост"] }
      ]
    },
    {
      id: "uni",
      title: "UNI MATCH",
      subtitle: proProfile ? `Адаптация под: ${proProfile}` : "Твой идеальный кампус",
      icon: <Sparkles size={32} />,
      color: "from-orange-600 via-orange-500 to-orange-700",
      questions: [
        { q: "Желаемый климат?", a: ["Солнце", "Европа", "Север", "Неважно"] },
        { q: "Локация мечты?", a: ["США / Канада", "Европа", "Азия", "Казахстан / СНГ", "ОАЭ"] },
        { q: "Среда?", a: ["Мегаполис", "Кампус", "Хаб", "История"] },
        { q: "Важность бренда?", a: ["ТОП-10", "Программа", "Нетворк", "Бюджет"] },
        { q: "Метод обучения?", a: ["Наука", "Кейсы", "Лабы", "Арт"] },
        { q: "Бюджет?", a: ["Грант", "Свои", "Европа", "Bolashaq"] },
        { q: "Жилье?", a: ["Общага", "Квартира", "Студия", "Семья"] },
        { q: "Лайфстайл?", a: ["Тусовки", "Тишина", "Спорт", "Баланс"] },
        { q: "Язык?", a: ["English", "English+", "Local", "Bilingual"] },
        { q: "Маст-хэв?", a: ["Лаборатория", "Инкубатор", "Библиотека", "Спорт"] },
        { q: "План после?", a: ["Работа там", "Вернуться в КЗ", "Стартап", "Наука"] },
        { q: "Атмосфера?", a: ["Конкуренция", "Семья", "Сам за себя", "Команда"] }
      ]
    }
  ];

  const handleAnswer = async (selectedOption: string) => {
    const newAnswers = [...answers, selectedOption];
    if (step < 11) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { 
                role: "system", 
                content: `Ты — экспертный аналитик приёмных комиссий Ivy League и QS World Rankings. ОТВЕТЬ СТРОГО В JSON: {"profile": "NAME", "verdict": "TEXT", "recs": ["Univ 1", "Univ 2", "Univ 3"]}` 
              },
              { 
                role: "user", 
                content: `Тип теста: ${activeTest.title}. Логи: ${activeTest.questions.map((q: any, i: number) => `${q.q}: ${newAnswers[i]}`).join(' | ')}` 
              }
            ]
          })
        });

        const data = await response.json();
        const rawText = data.text || data.choices?.[0]?.message?.content || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setResult(parsed);
          if (activeTest.id === "pro") {
            localStorage.setItem("ashkomu_pro_dna", parsed.profile);
            setProProfile(parsed.profile);
          }
        }
      } catch (e) {
        setResult({
          profile: "NEURAL LINK FAILURE",
          verdict: "Ошибка соединения.",
          recs: ["System Reboot Required"]
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const reset = () => { setActiveTest(null); setStep(0); setAnswers([]); setResult(null); };

  return (
    <div className="relative w-full min-h-[700px] overflow-hidden rounded-[60px] bg-[#FAFAFA]">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <motion.div 
          animate={{ x: mousePos.x - 400, y: mousePos.y - 400 }}
          transition={{ type: "spring", damping: 40, stiffness: 50 }}
          className="absolute w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 w-full p-6">
        {/* TOP STATUS BAR */}
        <div className="flex items-center justify-between mb-12 px-4">
          <AnimatePresence>
            {proProfile && !activeTest && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-black/5 px-6 py-3 rounded-2xl shadow-sm">
                <Cpu size={14} className="text-orange-600 animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  CURRENT DNA: <span className="text-black italic">{proProfile}</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!activeTest && (
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {tests.map((test) => (
              <motion.div
                key={test.id}
                whileHover={{ y: -12, scale: 1.02 }}
                onClick={() => setActiveTest(test)}
                className={`bg-gradient-to-br ${test.color} p-12 rounded-[60px] cursor-pointer group relative overflow-hidden h-[450px] flex flex-col justify-between shadow-2xl transition-all duration-500`}
              >
                 <div className="absolute -right-20 -top-20 opacity-10 group-hover:opacity-20 transition-opacity">
                    {test.id === 'pro' ? <Activity size={400} /> : <Waves size={400} />}
                 </div>
                 <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center mb-10 border border-white/20">
                      <span className="text-white">{test.icon}</span>
                    </div>
                    <h3 className="text-5xl font-black uppercase tracking-tighter italic leading-[0.85] text-white mb-6">
                      {test.title}
                    </h3>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">{test.subtitle}</p>
                 </div>
                 <div className="relative z-10 flex items-center gap-3 text-white/40 group-hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest italic">
                    Initiate Scan <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                 </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {activeTest && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[100] flex items-center justify-center overflow-hidden"
            >
               <div className="w-full max-w-5xl px-8 relative h-screen flex flex-col justify-center">
                  <button onClick={reset} className="absolute top-12 right-12 text-black/10 hover:text-black transition-all hover:rotate-90 duration-300"><X size={50}/></button>

                  {!loading && !result && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -30, scale: 1.05, filter: "blur(8px)" }}
                        transition={{ 
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          mass: 1
                        }}
                        className="space-y-16"
                      >
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                              <span className="text-xs font-black uppercase tracking-[0.6em] text-orange-600">Scan Phase {step + 1} / 12</span>
                              <span className="text-[10px] font-mono text-black/30">SYSTEM_BUSY_{Math.round(((step + 1) / 12) * 100)}%</span>
                            </div>
                            <div className="h-[3px] w-full bg-black/5 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.5)]"
                                animate={{ width: `${((step + 1) / 12) * 100}%` }}
                                transition={{ type: "spring", stiffness: 60, damping: 20 }}
                              />
                            </div>
                        </div>

                        <h2 className="text-[clamp(32px,5vw,72px)] font-black uppercase tracking-tighter leading-[0.85] text-black italic">
                          {activeTest.questions[step].q}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-5">
                          {activeTest.questions[step].a.map((option: string, i: number) => (
                            <motion.button 
                              key={i} 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.06, duration: 0.4 }}
                              whileHover={{ scale: 1.02, x: 10, backgroundColor: "#000", color: "#fff" }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAnswer(option)} 
                              className="p-8 bg-white border border-black/5 rounded-[35px] text-left text-[13px] font-black uppercase transition-all flex justify-between items-center group shadow-sm hover:shadow-2xl"
                            >
                               <span className="max-w-[85%] leading-tight tracking-tight">{option}</span>
                               <Zap size={18} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {loading && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      className="flex flex-col items-center gap-10"
                    >
                      <div className="relative">
                        <Loader2 className="animate-spin text-orange-600" size={100} strokeWidth={1} />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black animate-pulse" size={30} />
                      </div>
                      <div className="text-2xl font-black uppercase tracking-[0.8em] italic animate-pulse text-center">Analyzing Neural Data...</div>
                    </motion.div>
                  )}

                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 40 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ type: "spring", damping: 25 }}
                      className="max-w-4xl mx-auto w-full"
                    >
                      <span className="text-orange-600 font-black text-[10px] uppercase tracking-[0.8em] mb-4 block">Analysis Result</span>
                      <h2 className="text-[clamp(40px,7vw,90px)] font-black uppercase tracking-tighter leading-[0.8] mb-12 italic border-b-4 border-black pb-6">{result.profile}</h2>
                      
                      <div className="grid md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                           <p className="text-2xl font-bold italic text-black leading-[1.1]">{result.verdict}</p>
                           <div className="flex gap-2">
                             {[1,2,3].map(i => <div key={i} className="w-8 h-1 bg-orange-600" />)}
                           </div>
                        </div>
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Target Institutions:</p>
                          {result.recs.map((r: string, i: number) => (
                            <motion.div 
                              key={i} 
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 + (i * 0.1) }}
                              className="bg-black text-white p-7 rounded-[30px] flex justify-between items-center italic text-xs font-black uppercase tracking-widest group hover:bg-orange-600 transition-colors"
                            >
                              {r} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <button onClick={reset} className="w-full mt-20 py-8 bg-black text-white rounded-[40px] font-black uppercase tracking-[0.5em] text-[10px] hover:bg-orange-600 transition-all shadow-2xl">Return to Dashboard</button>
                    </motion.div>
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* РОБОТ ПОДКЛЮЧЕН СЮДА */}
      <AIBuddy 
        step={step} 
        isAnalyzing={loading} 
        result={result} 
        proProfile={proProfile} 
      />
    </div>
  );
}