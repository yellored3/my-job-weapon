"use client";

import { useRouter } from "next/navigation";
import { useJobWeapon } from "@/context/JobWeaponContext";
import { BELBIN_ROLES } from "@/constants/data";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BucketType = "natural" | "potential" | "unpreferred";

export default function Step3Page() {
  const router = useRouter();
  const { state, setStep3 } = useJobWeapon();

  const [natural, setNatural] = useState<string[]>([]);
  const [potential, setPotential] = useState<string[]>([]);
  const [unpreferred, setUnpreferred] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setNatural(state.step3.naturalRoles);
    setPotential(state.step3.potentialRoles);
    setUnpreferred(state.step3.unpreferredRoles);
    setMounted(true);
  }, [state.step3]);

  const pool = BELBIN_ROLES.filter(
    (r) => !natural.includes(r.name) && !potential.includes(r.name) && !unpreferred.includes(r.name)
  );

  const isValid = natural.length === 3 && potential.length === 3 && unpreferred.length === 3;

  const handleNext = () => {
    if (!isValid) return;
    setStep3({ naturalRoles: natural, potentialRoles: potential, unpreferredRoles: unpreferred });
    router.push("/result");
  };

  const handlePrev = () => {
    setStep3({ naturalRoles: natural, potentialRoles: potential, unpreferredRoles: unpreferred });
    router.push("/step2");
  };

  const moveTo = (name: string, bucket: BucketType) => {
    if (bucket === "natural" && natural.length < 3) setNatural([...natural, name]);
    if (bucket === "potential" && potential.length < 3) setPotential([...potential, name]);
    if (bucket === "unpreferred" && unpreferred.length < 3) setUnpreferred([...unpreferred, name]);
  };

  const returnToPool = (name: string, bucket: BucketType) => {
    if (bucket === "natural") setNatural(natural.filter((n) => n !== name));
    if (bucket === "potential") setPotential(potential.filter((n) => n !== name));
    if (bucket === "unpreferred") setUnpreferred(unpreferred.filter((n) => n !== name));
  };

  if (!mounted) return null;

  const getRoleDesc = (name: string) => BELBIN_ROLES.find((r) => r.name === name)?.desc;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-brand-blue dark:text-blue-400">
            3단계: 역할 그룹 분류 (벨빈 9유형)
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            조직에서 나의 성향을 가장 잘 나타내는 세 그룹(자연/잠재/비선호 역할)에 딱 3개씩 배치해주세요.
          </p>
        </div>
        
        <div className="flex gap-4 shrink-0">
          <button 
            onClick={handlePrev} 
            className="px-6 py-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 font-bold shadow-sm transition-colors"
          >
            이전
          </button>
          <button 
            onClick={handleNext} 
            disabled={!isValid}
            className={`px-8 py-3 rounded-full font-bold transition-all shadow-md duration-300 ${
              isValid ? "bg-brand-blue text-white hover:bg-blue-800 hover:scale-105" : "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500"
            }`}
          >
            분석결과 보기
          </button>
        </div>
      </div>

      {/* Main Board */}
      <div className="flex flex-col xl:flex-row gap-6 h-auto xl:h-[65vh]">
        
        {/* Pool Column */}
        <div className="w-full xl:w-1/4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col">
          <h3 className="font-bold text-slate-600 dark:text-slate-300 mb-4 text-center">대기열 ( {pool.length} 개 )</h3>
          <div className="flex-grow overflow-y-auto pr-2 space-y-3">
            <AnimatePresence>
              {pool.map((role) => (
                <motion.div
                  layoutId={`role-${role.name}`}
                  key={role.name}
                  className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600 shadow-sm flex flex-col gap-3"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-100">{role.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{role.desc}</div>
                  <div className="flex gap-1 mt-1 justify-center">
                    <button onClick={() => moveTo(role.name, "natural")} disabled={natural.length >= 3} className="flex-1 text-[10px] font-bold py-1.5 rounded bg-blue-100 text-brand-blue hover:bg-blue-200 disabled:opacity-30">자연</button>
                    <button onClick={() => moveTo(role.name, "potential")} disabled={potential.length >= 3} className="flex-1 text-[10px] font-bold py-1.5 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-30">잠재</button>
                    <button onClick={() => moveTo(role.name, "unpreferred")} disabled={unpreferred.length >= 3} className="flex-1 text-[10px] font-bold py-1.5 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-30">비선호</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {pool.length === 0 && <div className="text-center text-slate-400 py-10 text-sm font-medium">모두 분류되었습니다! 🎉</div>}
          </div>
        </div>

        {/* 3 Buckets */}
        <div className="w-full xl:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Natural Bucket */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex flex-col ring-1 ring-inset ring-blue-500/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-brand-blue text-lg">💫 자연 역할</h3>
                <p className="text-xs text-blue-600/70 mt-1">내가 가장 편하고 자연스럽게 역량을 발휘하는 역할</p>
              </div>
              <span className="font-mono font-bold text-brand-blue">{natural.length} / 3</span>
            </div>
            <div className="flex-grow space-y-3">
              <AnimatePresence>
                {natural.map(name => (
                  <motion.div layoutId={`role-${name}`} key={name} onClick={() => returnToPool(name, "natural")} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-l-brand-blue cursor-pointer group hover:bg-blue-50 dark:hover:bg-slate-700 transition">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{name}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-slate-400 text-xs mt-1">× 취소</span>
                    </div>
                    <p className="text-xs text-slate-500">{getRoleDesc(name)}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Potential Bucket */}
          <div className="bg-indigo-50 dark:bg-indigo-950/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 flex flex-col ring-1 ring-inset ring-indigo-500/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-indigo-700 text-lg">🌱 잠재 역할</h3>
                <p className="text-xs text-indigo-600/70 mt-1">상황에 따라 발휘할 수 있거나 학습으로 커버되는 역할</p>
              </div>
              <span className="font-mono font-bold text-indigo-700">{potential.length} / 3</span>
            </div>
            <div className="flex-grow space-y-3">
              <AnimatePresence>
                {potential.map(name => (
                  <motion.div layoutId={`role-${name}`} key={name} onClick={() => returnToPool(name, "potential")} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-l-indigo-500 cursor-pointer group hover:bg-indigo-50 dark:hover:bg-slate-700 transition">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{name}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-slate-400 text-xs mt-1">× 취소</span>
                    </div>
                    <p className="text-xs text-slate-500">{getRoleDesc(name)}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Unpreferred Bucket */}
          <div className="bg-slate-100 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/50 flex flex-col">
             <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-600 dark:text-slate-300 text-lg">⚠️ 비선호 역할</h3>
                <p className="text-xs text-slate-500/80 dark:text-slate-400/80 mt-1">내가 가장 피하고 싶거나 능률이 떨어지는 역할</p>
              </div>
              <span className="font-mono font-bold text-slate-500">{unpreferred.length} / 3</span>
            </div>
            <div className="flex-grow space-y-3">
              <AnimatePresence>
                {unpreferred.map(name => (
                  <motion.div layoutId={`role-${name}`} key={name} onClick={() => returnToPool(name, "unpreferred")} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-l-slate-400 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{name}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-slate-400 text-xs mt-1">× 취소</span>
                    </div>
                    <p className="text-xs text-slate-500">{getRoleDesc(name)}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
