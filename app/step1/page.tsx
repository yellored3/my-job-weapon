"use client";

import { useRouter } from "next/navigation";
import { useJobWeapon } from "@/context/JobWeaponContext";
import { useState, useEffect } from "react";

export default function Step1Page() {
  const router = useRouter();
  const { state, setStep1 } = useJobWeapon();

  // state.step1 에 이미 값이 있다면 불러옵니다.
  const [meaning, setMeaning] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    setMeaning(state.step1.meaning);
    setReason(state.step1.reason);
  }, [state.step1]);

  const isValid = meaning.trim().length > 0 && reason.trim().length > 0;

  const handleNext = () => {
    if (!isValid) return;
    setStep1({ meaning, reason });
    router.push("/step2");
  };

  const handlePrev = () => {
    setStep1({ meaning, reason }); // 뒤로갈때도 자동저장
    router.push("/");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl xl:rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 w-full">
        <h2 className="text-3xl font-bold mb-4 text-brand-blue dark:text-blue-400 drop-shadow-sm">
          1단계: 일의 의미
        </h2>
        <p className="mb-12 text-slate-600 dark:text-slate-300 text-lg">
          다음 문장의 빈칸을 채워 나에게 일이란 어떤 의미인지 정의해보세요.
        </p>

        <div className="space-y-12">
          <div className="relative">
            <input
              type="text"
              id="meaning"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              className="peer w-full border-b-2 border-slate-300 dark:border-slate-600 bg-transparent py-2 pt-4 text-2xl text-slate-900 dark:text-slate-100 placeholder-transparent focus:border-brand-orange focus:outline-none transition-colors"
              placeholder=" "
              autoComplete="off"
            />
            <label
              htmlFor="meaning"
              className="absolute left-0 top-0 text-slate-400 dark:text-slate-500 text-base transition-all -translate-y-3 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-xl peer-focus:-translate-y-3 peer-focus:text-base peer-focus:text-brand-orange font-medium"
            >
              나에게 일이란 [...] 이다.
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="peer w-full border-b-2 border-slate-300 dark:border-slate-600 bg-transparent py-2 pt-4 text-2xl text-slate-900 dark:text-slate-100 placeholder-transparent focus:border-brand-orange focus:outline-none transition-colors"
              placeholder=" "
              autoComplete="off"
            />
            <label
              htmlFor="reason"
              className="absolute left-0 top-0 text-slate-400 dark:text-slate-500 text-base transition-all -translate-y-3 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-xl peer-focus:-translate-y-3 peer-focus:text-base peer-focus:text-brand-orange font-medium"
            >
              왜냐하면 [...] 때문이다.
            </label>
          </div>
        </div>
        
        <div className="flex justify-between mt-16">
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
              isValid ? "bg-brand-orange text-white hover:bg-orange-600 hover:scale-[1.02]" : "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500"
            }`}
          >
            다음 단계로
          </button>
        </div>
      </div>
    </div>
  );
}
