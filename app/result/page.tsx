"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useJobWeapon } from "@/context/JobWeaponContext";
import { VALUE_MAPPINGS, ROLE_MAPPINGS } from "@/constants/mappings";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RotateCcw, Award, CheckCircle2, AlertCircle, ImageDown, Loader2 } from "lucide-react";

export default function ResultPage() {
  const router = useRouter();
  const { state, resetForm } = useJobWeapon();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageDataUrls, setImageDataUrls] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    // 아무 데이터 없이(주소창 강제 진입) 결과 페이지 접근 방지
    if (!state.step3.naturalRoles.length || !state.step2.topValues.length || !state.step1.meaning) {
      router.replace("/");
    }
  }, [state, router]);

  if (!mounted || !state.step3.naturalRoles.length || !state.step1.meaning) return null;

  // 주요 키 데이터 도출 (가장 첫 번째 선택된 가치/역할을 메인으로 사용)
  const topValue1 = state.step2.topValues[0];
  const naturalRole1 = state.step3.naturalRoles[0];

  const personaPrefix = ROLE_MAPPINGS[naturalRole1]?.titlePrefix || "초월적인";
  // ex) "판을 뒤집는" + " 창조자" -> "판을 뒤집는 창조자"
  const personaTitle = `${personaPrefix} ${naturalRole1}`;

  const top3Values = state.step2.topValues.slice(0, 3);
  const bottom3Values = state.step2.bottomValues.slice(0, 3);
  const roleData = ROLE_MAPPINGS[naturalRole1];

  const meaningInsight = (() => {
    const m = state.step1.meaning;
    const r = state.step1.reason;
    const v = top3Values[0];
    const mLow = m.toLowerCase();
    const rLow = r.toLowerCase();
    const both = mLow + " " + rLow;

    // 의미(m) 독립 분류
    const mUncertain   = /글쎄|모르겠|잘 모|아직|막연|뭔지|애매|불분명|없다|없어/.test(mLow);
    const mForced      = /어쩔수없|해야|생계|먹고살|수단|억지|싫|그냥/.test(mLow);
    const mGrowth      = /성장|발전|배움|배우|실력|역량|공부|자기계발/.test(mLow);
    const mFulfillment = /보람|의미|가치|사명|소명|뜻/.test(mLow);
    const mSocial      = /사람|도움|기여|관계|사회|봉사/.test(mLow);
    const mAchievement = /성취|목표|성공|인정|증명/.test(mLow);
    const mFun         = /재미|즐거|행복|열정|좋아|설레/.test(mLow);
    const mFinancial   = /돈|월급|수입|급여|먹고살|생계/.test(mLow);

    // 이유(r) 독립 분류
    const rNoExp      = /해본 적|해본적|경험.*없|없어서|처음.*해보|아직.*없|못 해봐|못해봐|해보지/.test(rLow);
    const rFinancial  = /먹고살|생계|돈|월급|경제|생활비/.test(rLow);
    const rForced     = /어쩔수없|어쩔 수 없|해야만|억지|싫지만/.test(rLow);
    const rGrowth     = /성장|발전|배움|공부|실력|더 나은|학습/.test(rLow);
    const rSocial     = /도움|기여|봉사|사람|타인|사회/.test(rLow);
    const rPassion    = /재미|좋아서|설레|열정|즐거/.test(rLow);
    const rAchievement= /성취|목표|인정|성공|증명/.test(rLow);
    const rStability  = /안정|두려|불안|걱정|안전/.test(rLow);

    // ── 1순위: 의미(m)가 불분명한 경우 → 이유(r)에 따라 세분화 ──
    if (mUncertain) {
      if (rNoExp) {
        return `일이 무엇인지 아직 정의하지 못한 채, 경험 없이 첫 발을 내딛는 상황—이것이 오히려 가장 솔직하고 강력한 출발점입니다. 많은 지원자들이 근거 없는 확신으로 자소서를 채우는 반면, 당신은 자신의 위치를 있는 그대로 직시하고 있습니다. 이 솔직함을 기반으로 '${v}'처럼 자신에게 실제로 중요한 기준부터 세우는 것이, 방향 없이 지원하는 것보다 훨씬 강력한 전략이 됩니다.`;
      }
      if (rFinancial || rForced) {
        return `일의 의미가 아직 불분명한 채로 '${r}'이라는 현실적 이유로 취업에 나서는 것은, 많은 취준생의 진짜 내면과 닮아 있습니다. 의미를 억지로 만들어낼 필요는 없습니다. '${v}'처럼 자신이 실제로 중요하게 여기는 기준을 먼저 확립하면, 일의 의미는 그 경험 속에서 자연스럽게 형성되기 때문입니다.`;
      }
      if (rGrowth) {
        return `일의 의미는 아직 명확하지 않지만 '${r}'이라는 동기로 도전에 나선 것은, 결과보다 과정을 통해 자신을 발견하겠다는 성장형 태도를 드러냅니다. '${v}'을/를 최우선 가치로 선택한 것도 이 방향성과 맞닿아 있으며, 탐색하면서 전진하는 사람이 결국 자신만의 답을 찾게 됩니다.`;
      }
      if (rPassion) {
        return `일의 의미가 아직 불분명하더라도, '${r}'이라는 이유는 이미 강력한 내재적 동력이 있음을 보여줍니다. 이 에너지가 '${v}'을/를 중요하게 여기는 선택과 연결되어 있으며, 의미는 그 열정이 향하는 방향에서 저절로 구체화됩니다.`;
      }
      // 의미 불분명 + 기타 이유
      return `일의 의미가 아직 명확하지 않다는 솔직함, 그리고 '${r}'이라는 이유 사이에서 균형을 찾고 있다는 것은 자신에 대해 정직하게 마주하고 있다는 신호입니다. 이러한 탐색의 과정에서 '${v}'처럼 자신에게 실제로 중요한 가치를 먼저 확립해두면, 어떤 면접 질문에도 흔들리지 않는 축이 생깁니다.`;
    }

    // ── 2순위: 의미(m)가 명확한 경우 → m+r 조합 분석 ──

    // 강제/생존 동기
    if (mForced || rForced || rFinancial || /굶|먹고살|생계|어쩔수없|해야해|살아야|밥벌이|필요해서|어쩔 수 없|해야만|억지|싫지만|어쩔수없이/.test(both)) {
      return `일을 '${m}'(으)로 정의하며 '${r}'이라는 이유를 함께 안고 있는 것은, 일과의 관계를 현실적·실용적으로 보는 솔직한 시각입니다. 이처럼 실용적 관점일수록, '${v}'처럼 눈에 보이는 실질적 가치를 기준으로 직업을 고르는 것이 오히려 가장 일관된 전략이 됩니다.`;
    }

    // 성장 동기
    if (mGrowth || rGrowth || /성장|발전|배움|배우|더 나은|실력|역량|공부|학습|자기계발|성숙|진화/.test(both)) {
      return `일을 '${m}'(으)로 정의한 것과 '${r}'이라는 이유는, 일을 단순한 임무가 아닌 스스로를 확장해가는 과정으로 바라보고 있음을 드러냅니다. 이 성장 지향적 동기가 '${v}'을/를 최우선 가치로 선택하게 만든 내면의 동력과 정확히 같은 방향을 가리킵니다.`;
    }

    // 즐거움/열정 동기
    if (mFun || rPassion || /즐거|재미|행복|좋아서|설레|열정|신나|흥미|기쁨|좋으니/.test(both)) {
      return `일을 '${m}'(으)로 정의하며 '${r}'이라는 이유를 가진 것은, 외부 보상이 아닌 일 자체에서 에너지를 끌어내는 내재적 동기가 있음을 보여줍니다. 이 몰입의 원천이 바로 '${v}'을/를 가장 중요하게 여기는 선택과 같은 뿌리에서 나온 것입니다.`;
    }

    // 사회/이타 동기
    if (mSocial || rSocial || /도움|사회|기여|봉사|영향|타인|남을 위|세상|공익|이타|사람들/.test(both)) {
      return `일을 '${m}'(으)로 정의하며 '${r}'이라는 이유를 가진 것은, 일의 가치를 자신이 아닌 타인과의 관계 속에서 찾고 있음을 보여줍니다. 이 이타적 동기는 '${v}'을/를 핵심 기준으로 삼는 선택과 깊이 연결되어 있으며, 사람 중심의 환경에서 가장 강하게 발현됩니다.`;
    }

    // 성취/목표 동기
    if (mAchievement || rAchievement || /성취|목표|인정|성공|증명|이루고|결과|실적|해내|뚫고/.test(both)) {
      return `일을 '${m}'(으)로 정의하며 '${r}'이라는 이유를 가진 것은, 일을 통해 스스로를 증명하고자 하는 강한 성취 욕구를 담고 있습니다. 이 도전적 동력이 '${v}'을/를 최우선 가치로 선택하게 만든 배경이며, 명확한 성과 기준이 있는 환경에서 가장 폭발적으로 발현됩니다.`;
    }

    // 보람/의미 동기
    if (mFulfillment || /의미|보람|가치있|가치 있|뜻있|중요하|소명|사명/.test(both)) {
      return `일을 '${m}'(으)로 정의하며 '${r}'이라는 이유를 가진 것은, 결과물 너머의 의미와 보람을 일에서 찾는 사람임을 보여줍니다. 이 깊이 있는 동기 구조가 '${v}'을/를 중시하는 선택으로 자연스럽게 이어졌다고 볼 수 있습니다.`;
    }

    // 안정 동기
    if (rStability || /안정|두려|불안|걱정|무서|리스크|위험|조심|안전/.test(both)) {
      return `일을 '${m}'(으)로 정의하며 '${r}'이라는 이유를 가진 것은, 불확실성을 줄이고 싶은 심리적 동기를 내포하고 있습니다. 이 안정 지향적 성향이 '${v}'을/를 핵심 기준으로 삼게 한 배경이며, 예측 가능하고 안전한 환경에서 역량이 가장 안정적으로 발휘됩니다.`;
    }

    // 경험 없음이 이유인 경우 (의미는 명확, 이유만 "첫 도전")
    if (rNoExp) {
      return `일을 '${m}'(으)로 정의하면서도 아직 실제 경험이 없는 상태에서 도전하는 것은, 자신이 원하는 것을 명확히 알면서도 현실의 간극을 솔직하게 인정하는 태도입니다. 이 명확한 방향성과 솔직함의 조합이 '${v}'을/를 핵심 기준으로 삼게 했으며, 백지에서 시작하는 사람이 오히려 자신만의 강점을 더 선명하게 구축해 나갑니다.`;
    }

    // 최종 기본값 (m과 r 둘 다 활용해 맥락 반영)
    return `일을 '${m}'(으)로 정의하며 '${r}'이라는 이유를 함께 안고 있다는 것은, 자신의 일과의 관계를 솔직하게 직시하는 태도를 보여줍니다. 이 자기 인식의 명확함이 '${v}'처럼 스스로에게 실질적으로 의미 있는 가치를 의식적으로 선택하게 만들었으며, 이것이 면접과 자소서에서 가장 강력한 무기가 됩니다.`;
  })();

  const handleCopy = async () => {
    // 텍스트 조립
    const textToCopy = `[나만의 취업 무기 리포트]
페르소나: ${personaTitle}
    
나에게 일이란 "${state.step1.meaning}"입니다.
왜냐하면 "${state.step1.reason}" 때문입니다.

■ 내가 꼭 골라야 할 직무/기업 기준 (Must Have)
1. ${VALUE_MAPPINGS[top3Values[0]]?.mustHave || ""}
2. ${VALUE_MAPPINGS[top3Values[1]]?.mustHave || ""}
3. ${VALUE_MAPPINGS[top3Values[2]]?.mustHave || ""}

■ 내가 반드시 피해야 할 기업 기준 (Must Avoid)
1. ${VALUE_MAPPINGS[bottom3Values[0]]?.bottomAvoid || ""}
2. ${VALUE_MAPPINGS[bottom3Values[1]]?.bottomAvoid || ""}
3. ${VALUE_MAPPINGS[bottom3Values[2]]?.bottomAvoid || ""}

■ 나의 강점 키워드 (치트키)
${roleData?.keywords.join(" / ")}

■ 1분 자기소개 초안 (자소서 겸용)
"저의 강점은 [${roleData?.keywords.join(", ")}] 에 따른 역량입니다."
"저는 ${roleData?.templateText} ${roleData?.starExample1}
또한 팀적으로도 이러한 역량을 적극 발휘할 수 있습니다. ${roleData?.starExample2} ${roleData?.closingStatement}"

====================================
■ 심층 취업 무기 리포트

1. 가치관 분석: '${VALUE_MAPPINGS[top3Values[0]]?.analysisTitle}'
당신은 일을 '${state.step1.meaning}'(이)라고 정의했습니다. ${meaningInsight}
'${top3Values[0]}'과 '${top3Values[1]}'을 최상위 가치로 두는 것은 매우 확고한 방향성을 의미합니다.
- ${VALUE_MAPPINGS[top3Values[0]]?.analysisDesc}
- ${VALUE_MAPPINGS[top3Values[1]]?.analysisDesc}

2. 조직 내 역할 분석: '${roleData?.analysisTitle}'
당신이 가장 편안함을 느끼는 조직 내 역할은 ${state.step3.naturalRoles.join(', ')} 입니다.
- ${roleData?.analysisDesc}

3. 취업 전략 및 '치트키' 활용 조언
강점 3종 키워드(${roleData?.keywords.map(k => `#${k}`).join(", ")}) 활용 포인트:

[자기소개서 작성 팁: ${roleData?.resumeTipTitle}]
${roleData?.resumeTipDesc}

[면접 대응 전략: ${roleData?.interviewTipTitle}]
${roleData?.interviewTipDesc}

🚩 전문가의 한 줄 평
${roleData?.expertQuote}
`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      // 카카오톡 브라우저나 구형 브라우저 우회 (fallback)
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      // 화면 밖으로 밀어냄
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (ex) {
        alert("복사에 실패했습니다. 브라우저 설정을 확인해주세요.");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleSaveImage = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isInApp = /KAKAOTALK|NAVER|Instagram|FB_IAB|FBAN|FBAV/i.test(navigator.userAgent);

    setIsCapturing(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const cardIds = ["capture-card-1", "capture-card-2", "capture-card-3"];
      // 기기 픽셀비율 사용 (Retina/고해상도 화질) — 간소화 카드라 iOS 캔버스 한도 문제 없음
      const scale = isMobile ? Math.min(window.devicePixelRatio || 2, 3) : 2;
      const options = {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        foreignObjectRendering: false,
        imageTimeout: 0,
      };

      if (isMobile || isInApp) {
        // 모바일/인앱: 3장 순서대로 캡처 후 오버레이로 표시
        const dataUrls: string[] = [];
        for (const id of cardIds) {
          const el = document.getElementById(id);
          if (!el) continue;
          const canvas = await html2canvas(el, options);
          dataUrls.push(canvas.toDataURL("image/png"));
        }
        setImageDataUrls(dataUrls);
      } else {
        // 데스크탑: 3장 각각 파일로 다운로드
        const labels = ["1-기본", "2-템플릿", "3-심층리포트"];
        for (let i = 0; i < cardIds.length; i++) {
          const el = document.getElementById(cardIds[i]);
          if (!el) continue;
          const canvas = await html2canvas(el, options);
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/png")
          );
          if (!blob) continue;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `취업무기리포트_${labels[i]}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 10000);
        }
      }
    } catch {
      alert(
        isMobile || isInApp
          ? "이미지 생성에 실패했습니다.\n스크린샷 기능을 이용해 주세요.\n\n• iPhone: 전원 + 볼륨업\n• 갤럭시/안드로이드: 전원 + 볼륨다운"
          : "이미지 저장에 실패했습니다. 스크린샷을 이용해 주세요."
      );
    } finally {
      setIsCapturing(false);
    }
  };

  const handleReset = () => {
    if (confirm("모든 데이터를 초기화하고 처음으로 돌아가시겠습니까?")) {
      resetForm();
      router.replace("/");
    }
  };

  return (
    <>
    {/* ── 캡처 카드 1: 기본 정보 ── */}
    <div id="capture-card-1" style={{ position:"fixed", left:"-9999px", top:0, width:"360px", backgroundColor:"#ffffff", fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <div style={{ background:"#1e3a8a", color:"#ffffff", padding:"28px 20px", textAlign:"center" }}>
        <div style={{ fontSize:"10px", letterSpacing:"3px", marginBottom:"10px", opacity:0.7 }}>OFFICIAL CERTIFICATE · 1 / 3</div>
        <div style={{ fontSize:"24px", fontWeight:"900", lineHeight:"1.3", marginBottom:"8px" }}>{personaTitle}</div>
        <div style={{ fontSize:"13px", opacity:0.85 }}>나만의 취업 무기 통합 리포트</div>
      </div>
      <div style={{ padding:"18px 20px", borderBottom:"1px solid #e2e8f0", background:"#f8fafc" }}>
        <div style={{ fontSize:"10px", color:"#94a3b8", letterSpacing:"2px", marginBottom:"8px" }}>나의 직업관</div>
        <div style={{ fontSize:"15px", fontWeight:"700", color:"#1e293b", marginBottom:"6px" }}>나에게 일이란 &quot;{state.step1.meaning}&quot;이다.</div>
        <div style={{ fontSize:"13px", color:"#64748b" }}>왜냐하면 {state.step1.reason} 때문입니다.</div>
      </div>
      <div style={{ padding:"18px 20px", borderBottom:"1px solid #e2e8f0" }}>
        <div style={{ fontSize:"11px", fontWeight:"700", color:"#1e3a8a", marginBottom:"12px" }}>✓ 필수로 찾아야 할 공간</div>
        {top3Values.map((val, idx) => (
          <div key={idx} style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"11px", color:"#2563eb", fontWeight:"700", marginBottom:"2px" }}>Top {idx+1}. {val}</div>
            <div style={{ fontSize:"12px", color:"#334155", lineHeight:"1.5" }}>{VALUE_MAPPINGS[val]?.mustHave}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:"18px 20px", borderBottom:"1px solid #e2e8f0" }}>
        <div style={{ fontSize:"11px", fontWeight:"700", color:"#64748b", marginBottom:"12px" }}>! 가급적 피해야 할 공간</div>
        {bottom3Values.map((val, idx) => (
          <div key={idx} style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"700", marginBottom:"2px" }}>Bottom {idx+1}. {val}</div>
            <div style={{ fontSize:"12px", color:"#334155", lineHeight:"1.5" }}>{VALUE_MAPPINGS[val]?.bottomAvoid}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:"10px", background:"#f1f5f9", textAlign:"center", fontSize:"10px", color:"#94a3b8" }}>나만의 취업 무기 리포트</div>
    </div>

    {/* ── 캡처 카드 2: 실전 면접 & 자소서 템플릿 ── */}
    <div id="capture-card-2" style={{ position:"fixed", left:"-9999px", top:0, width:"360px", backgroundColor:"#0f172a", fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <div style={{ background:"#0f172a", color:"#ffffff", padding:"24px 20px", borderBottom:"1px solid #1e293b" }}>
        <div style={{ fontSize:"10px", color:"#94a3b8", letterSpacing:"2px", marginBottom:"6px" }}>CHEAT KEY · 2 / 3</div>
        <div style={{ fontSize:"18px", fontWeight:"900" }}>실전 면접 &amp; 자소서 템플릿</div>
      </div>
      <div style={{ padding:"18px 20px", borderBottom:"1px solid #1e293b" }}>
        <div style={{ fontSize:"10px", color:"#94a3b8", marginBottom:"10px" }}>나의 강점 키워드 3종</div>
        <div>
          {roleData?.keywords.map((kw, i) => (
            <span key={i} style={{ display:"inline-block", margin:"0 6px 6px 0", padding:"4px 12px", background:"#1e293b", border:"1px solid #334155", color:"#f97316", fontWeight:"700", borderRadius:"6px", fontSize:"13px" }}>#{kw}</span>
          ))}
        </div>
      </div>
      <div style={{ padding:"18px 20px", background:"#1e293b", color:"#cbd5e1" }}>
        <div style={{ fontSize:"10px", color:"#94a3b8", marginBottom:"12px" }}>1분 자기소개 / 자소서 템플릿</div>
        <div style={{ fontSize:"13px", lineHeight:"1.8", marginBottom:"10px", color:"#f1f5f9" }}>
          &quot;저의 강점은 <span style={{ color:"#ffffff", fontWeight:"700" }}>[{roleData?.keywords.join(", ")}]</span> 에 따른 역량입니다.&quot;
        </div>
        <div style={{ fontSize:"13px", lineHeight:"1.8", color:"#cbd5e1" }}>
          &quot;저는 <span style={{ color:"#f97316", fontWeight:"700" }}>{roleData?.templateText}</span>
        </div>
        <div style={{ fontSize:"13px", lineHeight:"1.8", marginTop:"6px", padding:"8px 12px", background:"#0f172a", borderRadius:"6px", color:"#94a3b8" }}>
          {roleData?.starExample1}
        </div>
        <div style={{ fontSize:"13px", lineHeight:"1.8", marginTop:"10px", color:"#cbd5e1" }}>
          또한 팀적으로도 이러한 역량을 적극 발휘할 수 있습니다.
        </div>
        <div style={{ fontSize:"13px", lineHeight:"1.8", marginTop:"6px", padding:"8px 12px", background:"#0f172a", borderRadius:"6px", color:"#94a3b8" }}>
          {roleData?.starExample2}
        </div>
        <div style={{ fontSize:"13px", lineHeight:"1.8", marginTop:"8px", color:"#f97316", fontWeight:"600" }}>
          {roleData?.closingStatement}&quot;
        </div>
      </div>
      <div style={{ padding:"10px", background:"#020617", textAlign:"center", fontSize:"10px", color:"#475569" }}>나만의 취업 무기 리포트</div>
    </div>

    {/* ── 캡처 카드 3: 심층 취업 무기 리포트 ── */}
    <div id="capture-card-3" style={{ position:"fixed", left:"-9999px", top:0, width:"360px", backgroundColor:"#ffffff", fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <div style={{ background:"#1e3a8a", color:"#ffffff", padding:"20px", textAlign:"center" }}>
        <div style={{ fontSize:"10px", letterSpacing:"2px", marginBottom:"6px", opacity:0.7 }}>DEEP REPORT · 3 / 3</div>
        <div style={{ fontSize:"16px", fontWeight:"900" }}>심층 취업 무기 리포트</div>
      </div>

      {/* 1. 가치관 분석 */}
      <div style={{ padding:"18px 20px", borderBottom:"1px solid #e2e8f0" }}>
        <div style={{ fontSize:"13px", fontWeight:"700", color:"#1e3a8a", marginBottom:"10px" }}>1. 가치관 분석: &apos;{VALUE_MAPPINGS[top3Values[0]]?.analysisTitle}&apos;</div>
        <div style={{ fontSize:"12px", color:"#334155", lineHeight:"1.7", marginBottom:"10px" }}>
          당신은 일을 <span style={{ color:"#f97316", fontWeight:"700" }}>&apos;{state.step1.meaning}&apos;</span>(이)라고 정의했습니다. {meaningInsight}
        </div>
        <div style={{ padding:"10px 12px", background:"#f8fafc", borderLeft:"3px solid #3b82f6", borderRadius:"4px" }}>
          <div style={{ fontSize:"12px", color:"#334155", lineHeight:"1.6", marginBottom:"6px" }}>- {VALUE_MAPPINGS[top3Values[0]]?.analysisDesc}</div>
          <div style={{ fontSize:"12px", color:"#334155", lineHeight:"1.6" }}>- {VALUE_MAPPINGS[top3Values[1]]?.analysisDesc}</div>
        </div>
      </div>

      {/* 2. 역할 분석 */}
      <div style={{ padding:"18px 20px", borderBottom:"1px solid #e2e8f0" }}>
        <div style={{ fontSize:"13px", fontWeight:"700", color:"#f97316", marginBottom:"10px" }}>2. 조직 내 역할 분석: &apos;{roleData?.analysisTitle}&apos;</div>
        <div style={{ fontSize:"12px", color:"#334155", lineHeight:"1.7", marginBottom:"8px" }}>
          가장 편안함을 느끼는 역할: <span style={{ fontWeight:"700" }}>{state.step3.naturalRoles.join(", ")}</span>
        </div>
        <div style={{ padding:"10px 12px", background:"#f8fafc", borderLeft:"3px solid #f97316", borderRadius:"4px", fontSize:"12px", color:"#334155", lineHeight:"1.6" }}>
          {roleData?.analysisDesc}
        </div>
      </div>

      {/* 3. 취업 전략 */}
      <div style={{ padding:"18px 20px", borderBottom:"1px solid #e2e8f0" }}>
        <div style={{ fontSize:"13px", fontWeight:"700", color:"#0d9488", marginBottom:"12px" }}>3. 취업 전략 &amp; 치트키 활용 조언</div>

        <div style={{ marginBottom:"14px" }}>
          <div style={{ fontSize:"11px", fontWeight:"700", color:"#1e3a8a", marginBottom:"6px" }}>자소서 작성 팁: {roleData?.resumeTipTitle}</div>
          <div style={{ fontSize:"12px", color:"#334155", lineHeight:"1.6" }}>{roleData?.resumeTipDesc}</div>
        </div>

        <div>
          <div style={{ fontSize:"11px", fontWeight:"700", color:"#f97316", marginBottom:"6px" }}>면접 대응 전략: {roleData?.interviewTipTitle}</div>
          <div style={{ fontSize:"12px", color:"#334155", lineHeight:"1.6" }}>{roleData?.interviewTipDesc}</div>
        </div>
      </div>

      {/* 전문가 한 줄 평 */}
      <div style={{ padding:"18px 20px", background:"#1e293b", color:"#ffffff" }}>
        <div style={{ fontSize:"10px", color:"#f97316", fontWeight:"700", marginBottom:"8px" }}>전문가 한 줄 평</div>
        <div style={{ fontSize:"13px", lineHeight:"1.6", color:"#e2e8f0" }}>{roleData?.expertQuote}</div>
      </div>
      <div style={{ padding:"10px", background:"#f1f5f9", textAlign:"center", fontSize:"10px", color:"#94a3b8" }}>나만의 취업 무기 리포트</div>
    </div>

    {/* ── 이미지 저장 오버레이 ── */}
    {imageDataUrls.length > 0 && (
      <div className="fixed inset-0 bg-black/90 z-50 flex flex-col" onClick={() => setImageDataUrls([])}>
        <div className="flex-shrink-0 pt-5 pb-3 px-4 text-center">
          <p className="text-white font-bold text-base leading-relaxed">
            📸 이미지를 <strong className="text-yellow-300">길게 눌러</strong> 사진 앱에 저장하세요
          </p>
          <p className="text-white/60 text-xs mt-1">총 {imageDataUrls.length}장 · 각각 저장해주세요</p>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
          {imageDataUrls.map((url, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-white/50 text-xs">{i + 1} / {imageDataUrls.length}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`취업무기리포트 ${i+1}`} className="w-full rounded-xl shadow-2xl" />
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 pb-6 flex justify-center">
          <button
            onClick={() => setImageDataUrls([])}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    )}
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto pb-12 pt-4 px-4"
    >
      {/* 
        [인증서 / 무기 카탈로그 레이아웃] 
        금속 느낌의 테두리와 깊은 그림자, 고급스러운 텍스처를 살립니다. 
      */}
      <div id="result-card" className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10 relative">
        
        {/* 상단 띠, 헤더 */}
        <div className="bg-gradient-to-r from-brand-blue to-indigo-800 text-white p-10 md:p-14 text-center relative overflow-hidden">
          {/* 장식용 빛줄기 효과 */}
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_5s_infinite]"></div>
          
          <Award className="w-16 h-16 mx-auto mb-6 text-brand-orange drop-shadow-md" />
          <h1 className="text-xl md:text-2xl font-medium text-white/80 tracking-widest mb-2 uppercase">Official Certificate</h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black drop-shadow-lg tracking-tight my-4">
            {personaTitle}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mt-4 font-light">나만의 취업 무기 통합 리포트</p>
        </div>

        <div className="px-4 py-8 md:p-14 bg-slate-50/50 dark:bg-slate-900/50 space-y-12">
          
          {/* Section 1: 일의 의미 인용구 */}
          <section className="text-center px-4 md:px-12">
            <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">나의 직업관</h3>
            <div className="relative">
              <span className="text-5xl md:text-7xl text-slate-200 dark:text-slate-800 absolute -top-6 -left-6 md:-left-12 -z-10 font-serif">"</span>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-snug mb-4">
                나에게 일이란 <span className="text-brand-orange underline decoration-4 underline-offset-4">{state.step1.meaning}</span>이다.
              </p>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium">
                왜냐하면 {state.step1.reason} 때문입니다.
              </p>
              <span className="text-5xl md:text-7xl text-slate-200 dark:text-slate-800 absolute -bottom-8 -right-6 md:-right-12 -z-10 font-serif">"</span>
            </div>
          </section>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Section 2: 직무/기업 선택 기준 */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center justify-center gap-2">
              <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
              최적의 환경 선택 기준
              <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl shadow-sm border-t-4 border-t-brand-blue ring-1 ring-slate-100 dark:ring-slate-700">
                <h4 className="text-lg font-bold text-brand-blue mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> 필수로 찾아야 할 공간
                </h4>
                <ul className="space-y-4">
                  {top3Values.map((val, idx) => (
                    <li key={idx} className="flex flex-col">
                      <span className="text-sm text-blue-600 font-bold mb-1">Top {idx+1}. {val}</span>
                      <span className="text-slate-700 dark:text-slate-300">{VALUE_MAPPINGS[val]?.mustHave}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl shadow-sm border-t-4 border-t-slate-500 ring-1 ring-slate-100 dark:ring-slate-700">
                <h4 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> 가급적 피해야 할 공간
                </h4>
                <ul className="space-y-4">
                  {bottom3Values.map((val, idx) => (
                    <li key={idx} className="flex flex-col">
                      <span className="text-sm text-slate-500 font-bold mb-1">Bottom {idx+1}. {val}</span>
                      <span className="text-slate-700 dark:text-slate-300">{VALUE_MAPPINGS[val]?.bottomAvoid}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Section 3: 무기 템플릿 (자소서, 1분 자기소개) */}
          <section className="bg-slate-900 text-white rounded-3xl px-4 py-6 md:p-10 relative overflow-hidden shadow-xl">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-orange/20 blur-3xl rounded-full"></div>
            
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
              <span className="bg-brand-orange text-white text-xs px-2 py-1 rounded">CHEAT KEY</span>
              실전 면접 & 자소서 템플릿
            </h3>

            <div className="mb-8 relative z-10">
              <h4 className="text-slate-400 text-sm mb-3">나의 강점 키워드 3종</h4>
              <div className="flex flex-wrap gap-3">
                {roleData?.keywords.map((kw, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 text-brand-orange font-bold rounded-lg tracking-wide">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 md:p-6 rounded-2xl border border-slate-700 font-medium leading-relaxed text-slate-300 relative z-10">
              <p>
                "저의 강점은 <strong className="text-white">[{roleData?.keywords.join(", ")}]</strong> 에 따른 역량입니다."
              </p>
              <p className="mt-4 break-keep">
                "저는 <strong className="text-brand-orange">{roleData?.templateText}</strong> <span className="text-white bg-slate-700/30 px-1 rounded">{roleData?.starExample1}</span>
                <br /><br />
                또한 팀적으로도 이러한 역량을 적극 발휘할 수 있습니다. <span className="text-white bg-slate-700/30 px-1 rounded">{roleData?.starExample2}</span> <span className="text-brand-orange">{roleData?.closingStatement}</span>"
              </p>
            </div>
          </section>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Section 4: 전문가 심층 분석 리포트 */}
          <section className="bg-white dark:bg-slate-800/80 rounded-3xl px-4 py-6 md:p-10 shadow-xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-brand-blue/10 blur-3xl rounded-full pointer-events-none"></div>
            
            <h3 className="text-2xl md:text-3xl font-black mb-10 text-center text-slate-800 dark:text-slate-100 flex items-center justify-center gap-3">
              <span className="w-12 h-1.5 bg-brand-blue rounded-full"></span>
              심층 취업 무기 리포트
              <span className="w-12 h-1.5 bg-brand-blue rounded-full"></span>
            </h3>

            {/* 1. 가치관 분석 */}
            <div className="mb-10 relative z-10">
              <h4 className="text-xl md:text-2xl font-bold border-b-2 border-slate-100 dark:border-slate-700 pb-3 text-brand-blue mb-5">
                1. 가치관 분석: <span className="text-slate-800 dark:text-slate-100">'{VALUE_MAPPINGS[top3Values[0]]?.analysisTitle}'</span>
              </h4>
              <div className="text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed text-lg">
                <p>당신은 일을 <strong className="text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-md">'{state.step1.meaning}'</strong>(이)라고 정의했습니다. {meaningInsight}</p>
                <div className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-5 rounded-xl">
                  <strong className="block text-slate-900 dark:text-white mb-2">성향 결합의 시너지:</strong>
                  <span className="text-brand-orange font-bold">'{top3Values[0]}'</span>과 <span className="text-brand-orange font-bold">'{top3Values[1]}'</span>을 최상위 가치로 두는 배합은 극대화된 직무 몰입을 창출합니다.<br/>
                  <span className="block mt-2 pl-4 border-l-2 border-slate-300 dark:border-slate-600">- {VALUE_MAPPINGS[top3Values[0]]?.analysisDesc}</span>
                  <span className="block mt-2 pl-4 border-l-2 border-slate-300 dark:border-slate-600">- 또한 {VALUE_MAPPINGS[top3Values[1]]?.analysisDesc}</span>
                </div>
              </div>
            </div>

            {/* 2. 벨빈 역할 분석 */}
            <div className="mb-10 relative z-10">
              <h4 className="text-xl md:text-2xl font-bold border-b-2 border-slate-100 dark:border-slate-700 pb-3 text-brand-orange mb-5">
                2. 조직 내 역할 분석: <span className="text-slate-800 dark:text-slate-100">'{roleData?.analysisTitle}'</span>
              </h4>
              <div className="text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed text-lg">
                <p>선택하신 데이터에서 가장 눈에 띄는 점은 조직 내에서 <strong>{state.step3.naturalRoles.join(', ')}</strong> 포지션을 가장 편안한 상태(자연 역할)로 인식한다는 것입니다.</p>
                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl text-slate-700 dark:text-slate-300">
                  <strong className="block text-slate-900 dark:text-white mb-2">핵심 무기 발현:</strong>
                  {roleData?.analysisDesc}
                </div>
                {state.step3.unpreferredRoles.length > 0 && (
                  <p className="px-2">
                    <strong className="text-slate-900 dark:text-white">성향적 틈새(비선호):</strong> {state.step3.unpreferredRoles.join(', ')} 역할을 굳이 선호하지 않는다는 사실은 약점이 아니라 본인의 작업 스타일이 매우 확고함을 뜻합니다. 다른 이의 포지션을 탐내지 않고 본연의 강점에 100% 집중하는 것이 합격률을 높입니다.
                  </p>
                )}
              </div>
            </div>

            {/* 3. 취업 전략 및 치트키 조언 */}
            <div className="relative z-10">
              <h4 className="text-xl md:text-2xl font-bold border-b-2 border-slate-100 dark:border-slate-700 pb-3 text-teal-600 dark:text-teal-400 mb-5">
                3. 취업 전략 및 '치트키' 활용 조언
              </h4>
              <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg">
                앞선 강점 3종 키워드(<strong className="text-brand-blue">{roleData?.keywords.map(k => `#${k}`).join(", ")}</strong>)를 자소서와 면접에 녹여낼 때 다음 포인트를 반드시 기억하세요.
              </p>

              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900/80 p-4 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm leading-relaxed">
                  <h5 className="font-bold text-lg md:text-xl mb-3 flex items-start gap-2 text-slate-800 dark:text-slate-100">
                    <CheckCircle2 className="text-brand-blue w-6 h-6 flex-shrink-0 mt-0.5" /> 
                    <span>자소서 작성 팁 : <span className="text-brand-blue">{roleData?.resumeTipTitle}</span></span>
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 ml-0 md:ml-8 mt-2 md:mt-0 text-base md:text-lg font-medium">
                    {roleData?.resumeTipDesc}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/80 p-4 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm leading-relaxed">
                  <h5 className="font-bold text-lg md:text-xl mb-3 flex items-start gap-2 text-slate-800 dark:text-slate-100">
                    <AlertCircle className="text-brand-orange w-6 h-6 flex-shrink-0 mt-0.5" />
                    <span>면접 대응 전략 : <span className="text-brand-orange">{roleData?.interviewTipTitle}</span></span>
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 ml-0 md:ml-8 mt-2 md:mt-0 text-base md:text-lg font-medium">
                    {roleData?.interviewTipDesc}
                  </p>
                </div>
                
                <div className="mt-10 bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 md:p-10 pl-10 md:pl-14 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-brand-orange"></div>
                  <div className="absolute -top-4 right-4 text-8xl opacity-10 font-serif">"</div>
                  <h5 className="font-black text-brand-orange mb-4 tracking-wider text-sm md:text-base">🚩 전문가 정밀 한 줄 평</h5>
                  <p className="text-xl md:text-2xl font-bold tracking-wide leading-snug">
                    {roleData?.expertQuote}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Warning Banner */}
        <div className="bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-200 p-4 text-center text-sm font-semibold flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          이 결과는 브라우저를 닫으면 사라집니다! 하단의 버튼을 눌러 꼭 텍스트를 복사해두세요.
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          처음부터 다시하기
        </button>

        <button
          onClick={handleSaveImage}
          disabled={isCapturing}
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isCapturing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              이미지 생성 중...
            </>
          ) : (
            <>
              <ImageDown className="w-6 h-6" />
              이미지로 저장
            </>
          )}
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-brand-blue text-white font-bold text-lg hover:bg-blue-800 hover:scale-105 transition-all shadow-lg relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="checked"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6" />
                복사 완료! (붙여넣기 하세요)
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-6 h-6" />
                리포트 전체 복사하기
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

    </motion.div>
    </>
  );
}
