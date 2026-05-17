"use client";

import { useRouter } from "next/navigation";
import { useJobWeapon } from "@/context/JobWeaponContext";
import { JOB_VALUES } from "@/constants/data";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Step2Page() {
  const router = useRouter();
  const { state, setStep2 } = useJobWeapon();

  const [top5, setTop5] = useState<string[]>([]);
  const [bottom5, setBottom5] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTop5(state.step2.topValues);
    setBottom5(state.step2.bottomValues);
    setMounted(true);
  }, [state.step2]);

  const pool = JOB_VALUES.filter((v) => !top5.includes(v) && !bottom5.includes(v));

  const handleNext = () => {
    if (!isValid) return;
    setStep2({ topValues: top5, bottomValues: bottom5 });
    router.push("/step3");
  };

  const handlePrev = () => {
    setStep2({ topValues: top5, bottomValues: bottom5 });
    router.push("/step1");
  };

  const isValid = top5.length === 5 && bottom5.length === 5;

  const moveToTop = (val: string) => {
    if (top5.length < 5) setTop5([...top5, val]);
  };
  const moveToBottom = (val: string) => {
    if (bottom5.length < 5) setBottom5([...bottom5, val]);
  };
  const returnToPool = (val: string, from: "top" | "bottom") => {
    if (from === "top") setTop5(top5.filter((x) => x !== val));
    if (from === "bottom") setBottom5(bottom5.filter((x) => x !== val));
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Pool Area */}
      <div className="w-full md:w-1/2 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-2 text-brand-blue dark:text-blue-400">
          2단계: 직업 가치관
        </h2>
        <p className="mb-6 text-slate-500 dark:text-slate-400 text-sm">
          아래 리스트에서 나에게 가장 중요한(TOP 5) 것과 덜 중요한(BOTTOM 5) 것을 5개씩 선택하세요.
        </p>
        
        <div className="flex-grow overflow-y-auto max-h-[50vh] md:max-h-full pr-2 space-y-3">
          <AnimatePresence>
            {pool.map((val) => (
              <motion.div
                layoutId={`card-${val}`}
                key={val}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 shadow-sm"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-200">{val}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveToTop(val)}
                    disabled={top5.length >= 5}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-orange-100 text-brand-orange hover:bg-orange-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    TOP 5
                  </button>
                  <button
                    onClick={() => moveToBottom(val)}
                    disabled={bottom5.length >= 5}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    BTM 5
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-8">
          <button 
            onClick={handlePrev} 
            className="px-6 py-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 transition-colors font-bold shadow-sm"
          >
            이전
          </button>
          <button 
            onClick={handleNext} 
            disabled={!isValid}
            className={`px-8 py-3 rounded-full font-bold transition-all shadow-md duration-300 ${
              isValid ? "bg-brand-orange text-white hover:bg-orange-600 hover:scale-105" : "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500"
            }`}
          >
            다음 
          </button>
        </div>
      </div>

      {/* Target Area */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        
        {/* Top 5 Box */}
        <div className="flex-1 bg-orange-50 dark:bg-orange-950/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-brand-orange">TOP 5 (가장 중요)</h3>
            <span className="text-sm font-semibold text-orange-400">{top5.length} / 5</span>
          </div>
          <div className="flex-grow space-y-3 min-h-[200px]">
            <AnimatePresence>
              {top5.map((val) => (
                <motion.div
                  layoutId={`card-${val}`}
                  key={val}
                  onClick={() => returnToPool(val, "top")}
                  className="p-4 bg-white dark:bg-slate-800 rounded-xl border-l-4 border-l-brand-orange shadow-sm cursor-pointer hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors group flex justify-between items-center"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{val}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-slate-400">× 캔슬</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {top5.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                항목을 추가해주세요.
              </div>
            )}
          </div>
        </div>

        {/* Bottom 5 Box */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">BOTTOM 5 (덜 중요)</h3>
            <span className="text-sm font-semibold text-slate-400">{bottom5.length} / 5</span>
          </div>
          <div className="flex-grow space-y-3 min-h-[200px]">
            <AnimatePresence>
              {bottom5.map((val) => (
                <motion.div
                  layoutId={`card-${val}`}
                  key={val}
                  onClick={() => returnToPool(val, "bottom")}
                  className="p-4 bg-white dark:bg-slate-800 rounded-xl border-l-4 border-l-slate-400 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group flex justify-between items-center"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{val}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-slate-400">× 캔슬</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {bottom5.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                항목을 추가해주세요.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
