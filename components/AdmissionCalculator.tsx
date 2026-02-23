"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, Trophy, Check, Loader2, Wand2, Bot, Star, Zap, 
  X, ChevronRight, BookOpen, Users, Layout, ShieldCheck, 
  Flame, Search, FileText, Globe, CheckCircle2, Clock, 
  ChevronLeft, MousePointer2
} from "lucide-react";

export default function AdmissionCalculator({ externalProfile = null }: { externalProfile?: any }) {
  const [loading, setLoading] = useState(true);
  const [showFullReport, setShowFullReport] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- ТОТАЛЬНАЯ ИИ-ЛОГИКА ---
  const aiAnalysis = useMemo(() => {
    if (!externalProfile) return null;

    const gpa = parseFloat(externalProfile.gpa || "0");
    const ielts = parseFloat(externalProfile.ielts || "0");
    const sat = parseInt(externalProfile.sat || "0");
    const acts = externalProfile.activities?.length || 0;
    const region = externalProfile.region;

    // БАЗА ДАННЫХ: 10 ВУЗОВ НА КАЖДЫЙ РЕГИОН
    const regionalData: Record<string, { name: string, difficulty: number }[]> = {
      "USA / Canada": [
        { name: "Harvard", difficulty: 98 }, { name: "Stanford", difficulty: 97 }, { name: "MIT", difficulty: 98 },
        { name: "UPenn", difficulty: 94 }, { name: "U of Toronto", difficulty: 75 }, { name: "UC Berkeley", difficulty: 88 },
        { name: "McGill", difficulty: 72 }, { name: "UCLA", difficulty: 85 }, { name: "NYU", difficulty: 78 }, { name: "Columbia", difficulty: 96 }
      ],
      "South Korea": [
        { name: "SNU", difficulty: 95 }, { name: "KAIST", difficulty: 92 }, { name: "Yonsei", difficulty: 88 },
        { name: "Korea Uni", difficulty: 87 }, { name: "POSTECH", difficulty: 90 }, { name: "Sungkyunkwan", difficulty: 82 },
        { name: "Hanyang", difficulty: 80 }, { name: "Kyung Hee", difficulty: 75 }, { name: "Ewha", difficulty: 72 }, { name: "UNIST", difficulty: 85 }
      ],
      "Europe": [
        { name: "ETH Zurich", difficulty: 94 }, { name: "U of Amsterdam", difficulty: 80 }, { name: "Sorbonne", difficulty: 85 },
        { name: "TU Delft", difficulty: 82 }, { name: "KU Leuven", difficulty: 78 }, { name: "Lund University", difficulty: 70 },
        { name: "Bocconi", difficulty: 88 }, { name: "Heidelberg", difficulty: 80 }, { name: "Polytechnique", difficulty: 92 }, { name: "Trinity College", difficulty: 75 }
      ],
      "Asia": [
        { name: "NUS", difficulty: 96 }, { name: "NTU", difficulty: 95 }, { name: "Tsinghua", difficulty: 97 },
        { name: "Peking Uni", difficulty: 97 }, { name: "U of Tokyo", difficulty: 93 }, { name: "HKU", difficulty: 90 },
        { name: "Kyoto Uni", difficulty: 88 }, { name: "CUHK", difficulty: 85 }, { name: "Fudan", difficulty: 84 }, { name: "NTU Taiwan", difficulty: 80 }
      ],
      "UAE (ОАЭ)": [
        { name: "NYU Abu Dhabi", difficulty: 96 }, { name: "Khalifa Uni", difficulty: 82 }, { name: "AUS Sharjah", difficulty: 70 },
        { name: "Zayed Uni", difficulty: 55 }, { name: "UAE University", difficulty: 65 }, { name: "U of Dubai", difficulty: 50 },
        { name: "Middlesex Dubai", difficulty: 45 }, { name: "Heriot-Watt", difficulty: 60 }, { name: "Birmingham Dubai", difficulty: 72 }, { name: "Rochester Tech", difficulty: 68 }
      ],
      "Turkey": [
        { name: "Koç University", difficulty: 85 }, { name: "Sabancı", difficulty: 82 }, { name: "METU", difficulty: 78 },
        { name: "Boğaziçi", difficulty: 80 }, { name: "Bilkent", difficulty: 76 }, { name: "Istanbul Tech", difficulty: 72 },
        { name: "Hacettepe", difficulty: 68 }, { name: "Ankara Uni", difficulty: 60 }, { name: "Galatasaray", difficulty: 74 }, { name: "Yeditepe", difficulty: 55 }
      ],
      "UK": [
        { name: "Oxford", difficulty: 98 }, { name: "Cambridge", difficulty: 98 }, { name: "LSE", difficulty: 95 },
        { name: "Imperial", difficulty: 94 }, { name: "UCL", difficulty: 88 }, { name: "King's College", difficulty: 82 },
        { name: "Edinburgh", difficulty: 80 }, { name: "Manchester", difficulty: 75 }, { name: "Warwick", difficulty: 84 }, { name: "Bristol", difficulty: 78 }
      ],
      "Germany": [
        { name: "TU Munich", difficulty: 82 }, { name: "LMU Munich", difficulty: 78 }, { name: "Heidelberg", difficulty: 80 },
        { name: "Humboldt", difficulty: 75 }, { name: "RWTH Aachen", difficulty: 74 }, { name: "KIT", difficulty: 76 },
        { name: "Free Uni Berlin", difficulty: 72 }, { name: "TU Berlin", difficulty: 70 }, { name: "Freiburg", difficulty: 68 }, { name: "Bonn", difficulty: 65 }
      ]
    };

    // РАСЧЕТ СКОРИНГА (0-100)
    let userScore = (gpa / 5.0) * 35;
    userScore += externalProfile.satOptional ? 12 : (sat / 1600) * 25;
    userScore += (ielts / 9.0) * 15;
    userScore += (acts / 12) * 25;

    const unis = (regionalData[region] || regionalData["USA / Canada"]).map(uni => {
      let rawChance = (userScore / uni.difficulty) * 100;
      // Реализм: Шанс в супер-топы не выше 18%
      if (uni.difficulty > 93) rawChance = Math.min(rawChance, 18); 
      else if (uni.difficulty > 80) rawChance = Math.min(rawChance, 42);
      else rawChance = Math.min(rawChance, 88);

      if (ielts < 6.5 && uni.difficulty > 75) rawChance *= 0.2;

      return {
        name: uni.name,
        chance: Math.round(rawChance),
        status: rawChance < 15 ? "High Reach" : rawChance < 40 ? "Reach" : rawChance < 70 ? "Target" : "Safety"
      };
    });

    return { totalScore: Math.round(Math.min(userScore * 1.2, 99)), unis, spikeType: acts > 8 ? "World-Class Leader" : acts > 4 ? "Versatile Student" : "Academic Focus" };
  }, [externalProfile]);

  useEffect(() => {
    if (externalProfile) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
    }
  }, [externalProfile]);

  if (loading) return (
    <div className="h-[600px] flex flex-col items-center justify-center bg-white rounded-[60px] border-2 border-zinc-100 text-zinc-900">
      <Loader2 className="animate-spin text-orange-600 mb-6" size={50} />
      <p className="font-black uppercase italic text-2xl animate-pulse">ИИ сканирует регион {externalProfile?.region}...</p>
    </div>
  );

  return (
    <div className="relative text-zinc-900">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-12 gap-10 py-5">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900 p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
            <h3 className="font-black uppercase italic text-[10px] text-zinc-400 mb-8">AI Power Score</h3>
            <div className="text-[120px] font-black italic leading-none mb-6 tracking-tighter text-orange-500">{aiAnalysis?.totalScore}%</div>
          </div>
          <div className="bg-white border-2 border-zinc-100 p-8 rounded-[40px] font-black italic">
            <span className="text-[10px] text-zinc-400 uppercase">Регион:</span>
            <div className="text-xl uppercase">{externalProfile.region}</div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white p-12 rounded-[60px] border-2 border-zinc-100 h-full flex flex-col justify-between">
            <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4 leading-none">Вердикт <br/>ИИ-Советника</h2>
            <div className="p-8 bg-zinc-50 rounded-[35px] border-2 border-zinc-100 font-bold italic text-zinc-800 leading-relaxed">
              Анализ по региону <span className="text-orange-600 font-black">{externalProfile.region}</span> завершен. 
              Твой профиль классифицирован как <span className="underline italic">"{aiAnalysis?.spikeType}"</span>.
            </div>
            <button onClick={() => setShowFullReport(true)} className="w-full mt-10 py-8 bg-orange-600 text-white hover:bg-zinc-900 transition-all rounded-[35px] font-black uppercase italic text-2xl shadow-xl">
              Сгенерировать полный отчет
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showFullReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-white overflow-y-auto px-6 py-20">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex justify-between items-center mb-16 border-b-4 border-zinc-900 pb-10">
                <h2 className="text-6xl font-black uppercase italic tracking-tighter">Probabilities: <span className="text-orange-600">{externalProfile.region}</span></h2>
                <button onClick={() => setShowFullReport(false)} className="bg-zinc-900 text-white p-6 rounded-full"><X size={32} /></button>
              </div>

              {/* ГОРИЗОНТАЛЬНЫЙ СПИСОК 10 ВУЗОВ */}
              <div className="relative group">
                <div className="flex items-center gap-3 mb-6">
                  <MousePointer2 size={16} className="text-orange-600 animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Прокрути вправо, чтобы увидеть все 10 вузов</span>
                </div>
                
                <div 
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x cursor-grab active:cursor-grabbing"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {aiAnalysis?.unis.map((uni, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -10 }}
                      className="min-w-[320px] p-10 rounded-[50px] bg-zinc-50 border-2 border-zinc-100 snap-center hover:border-orange-500 transition-all shadow-sm flex flex-col justify-between h-[380px]"
                    >
                      <div>
                        <span className="text-[11px] font-black uppercase text-zinc-400 block mb-4 tracking-tighter">#{i+1} RANK IN REGION</span>
                        <h4 className="text-3xl font-black uppercase italic leading-[0.9] text-zinc-900">{uni.name}</h4>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="text-7xl font-black italic text-orange-600 mb-2">{uni.chance}%</div>
                        <div className={`text-[10px] font-black uppercase px-6 py-2 rounded-full inline-block ${uni.status.includes('Reach') ? 'bg-red-100 text-red-600' : 'bg-zinc-900 text-white'}`}>
                          {uni.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ДОП СЕКЦИИ */}
              <div className="grid lg:grid-cols-2 gap-10 mt-10">
                <div className="bg-zinc-900 p-12 rounded-[60px] text-white flex flex-col justify-center">
                  <h3 className="text-3xl font-black uppercase italic mb-6 text-orange-500">Spike Evaluation</h3>
                  <p className="text-xl font-bold italic opacity-80 leading-relaxed italic">
                    Твой профиль {aiAnalysis?.spikeType} имеет вес {aiAnalysis?.totalScore} баллов. 
                    В регионе {externalProfile.region} это дает тебе преимущество над большинством международных кандидатов.
                  </p>
                </div>
                <div className="bg-orange-600 p-12 rounded-[60px] text-white">
                  <h3 className="text-3xl font-black uppercase italic mb-6">Financial Strategy</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between border-b border-white/20 pb-4"><span className="font-black uppercase italic">Need Aid Chance</span><span className="text-4xl font-black">95%</span></div>
                    <div className="flex justify-between border-b border-white/20 pb-4"><span className="font-black uppercase italic">Merit Scholarship</span><span className="text-4xl font-black">{Math.round(aiAnalysis!.totalScore * 0.8)}%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}