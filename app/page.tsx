import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full max-w-4xl p-6 md:p-12 mx-auto flex flex-col items-center justify-center text-center">
      <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 w-full">
        <h1 className="text-3xl md:text-5xl font-bold text-brand-blue dark:text-blue-400 mb-6 drop-shadow-sm">
          나만의 취업 무기 제작소
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-10 text-base md:text-xl leading-relaxed max-w-2xl mx-auto">
          나의 <strong className="text-brand-orange">&apos;직업 가치관&apos;</strong>, 
          <strong className="text-brand-orange"> &apos;일의 의미&apos;</strong>, 
          <strong className="text-brand-orange"> &apos;조직 내 역할(벨빈 9유형)&apos;</strong>을 
          조합하여 직무 및 기업 선택 기준과 실전용 자소서·면접 템플릿을 완성해보세요.
        </p>
        
        <Link 
          href="/step1"
          className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white transition-transform transform hover:scale-105 active:scale-95 bg-brand-orange rounded-full hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 shadow-lg w-full md:w-auto"
        >
          무기 제작 시작하기
        </Link>
      </div>
    </div>
  );
}
