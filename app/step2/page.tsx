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
  const [clickedState, setClickedState] = useState<{ val: string; type: "top" | "bottom" } | null>(null);

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

  const handleMoveToTop = (val: string) => {
    if (top5.length >= 5 || clickedState) return;
    setClickedState({ val, type: "top" });
    setTimeout(() => {
      moveToTop(val);
      setClickedState(null);
    }, 200);
  };

  const handleMoveToBottom = (val: string) => {
    if (bottom5.length >= 5 || clickedState) return;
    setClickedState({ val, type: "bottom" });
    setTimeout(() => {
      moveToBottom(val);
      setClickedState(null);
    }, 200);
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
        <p className="mb-4 text-slate-500 dark:text-slate-400 text-sm">
          아래 리스트에서 나에게 가장 중요한(TOP 5) 것과 덜 중요한(BOTTOM 5) 것을 5개씩 선택하세요.
        </p>
        
        {/* Pool Area - Scrollable Box */}
        <div className="relative flex-grow">
          <div className="overflow-y-auto max-h-[380px] md:max-h-[460px] p-3.5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3 custom-scrollbar pr-2">
            <AnimatePresence>
              {pool.map((val) => (
                <motion.div
                  layoutId={`card-${val}`}
                  key={val}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100/80 dark:border-slate-700/60 shadow-sm hover:shadow transition-all duration-200"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-200 pr-3 min-w-0 flex-1">{val}</span>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleMoveToTop(val)}
                      disabled={top5.length >= 5 || clickedState !== null}
                      className={`px-2.5 py-2 text-xs font-bold rounded-xl border transition-all duration-150 flex items-center justify-center gap-1 whitespace-nowrap w-16 disabled:opacity-30 disabled:cursor-not-allowed ${
                        clickedState?.val === val && clickedState?.type === "top"
                          ? "bg-brand-orange text-white border-brand-orange shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] scale-95"
                          : "bg-orange-50/80 text-brand-orange border-orange-200/80 shadow-[0_2px_4px_rgba(249,115,22,0.06)] hover:bg-orange-100/70 active:bg-brand-orange active:text-white"
                      }`}
                    >
                      <span className="text-[10px] font-bold">＋</span>
                      <span>TOP 5</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleMoveToBottom(val)}
                      disabled={bottom5.length >= 5 || clickedState !== null}
                      className={`px-2.5 py-2 text-xs font-bold rounded-xl border transition-all duration-150 flex items-center justify-center gap-1 whitespace-nowrap w-16 disabled:opacity-30 disabled:cursor-not-allowed ${
                        clickedState?.val === val && clickedState?.type === "bottom"
                          ? "bg-slate-600 text-white border-slate-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] scale-95"
                          : "bg-slate-100/80 text-slate-600 border-slate-200/80 shadow-[0_2px_4px_rgba(15,23,42,0.05)] hover:bg-slate-200/70 active:bg-slate-600 active:text-white"
                      }`}
                    >
                      <span className="text-[10px] font-bold">＋</span>
                      <span>BTM 5</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {pool.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
                <span className="text-2xl mb-2">✨</span>
                모든 가치관을 분류했습니다!
              </div>
            )}
          </div>
          {/* 스크롤 하단 그라데이션 안내 레이어 */}
          {pool.length > 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 dark:from-slate-900/30 to-transparent pointer-events-none rounded-b-2xl" />
          )}
        </div>

        {/* 스크롤 가이드 마이크로 캡션 */}
        {pool.length > 3 && (
          <div className="text-center mt-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 animate-pulse">
              <span>↕️</span> 아래로 스크롤하여 더 많은 가치관을 확인하세요
            </span>
          </div>
        )}

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
