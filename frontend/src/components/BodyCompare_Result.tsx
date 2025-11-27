import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle2 } from "lucide-react";
import svgPaths from "../imports/svg-0s5keehpt3";

// ⭐️ 1. 방금 만든 파일에서 '메인 함수'를 import!
import { calculateAllFitRecommendations, FitType } from "../utils/compare.ts";

const FIT_TABS: { key: FitType; label: string }[] = [
  { key: "slim", label: "슬림핏" },
  { key: "regular", label: "레귤러핏" },
  { key: "semiOver", label: "세미오버핏" },
  { key: "over", label: "오버핏" },
];

const FIT_ANALYSIS_TEXTS: Record<FitType, string> = {
  slim: "슬림핏 기준, 모든 부위가 적정 범위에 있으며 몸에 밀착된 핏을 제공합니다.",
  regular:
    "레귤러핏 기준, 모든 부위가 표준 범위 내에 있어 편안한 착용감을 제공합니다.",
  semiOver:
    "세미오버핏 기준, 어깨는 조금 크지만, 가슴, 소매, 기장이 모두 적정 범위입니다.",
  over: "오버핏 기준, 전체적으로 여유 있는 실루엣을 제공하며 트렌디한 룩을 연출할 수 있습니다.",
};

export default function BodyCompare_Result() {
  const navigate = useNavigate();
  const location = useLocation();

  // 💡 이전 페이지(BodyCompare.tsx)에서 넘어온 데이터
  // (formData, category, productSizes, fabric가 다 넘어와야 함!)
  const {
    formData: userBody, // { height: "175", ... }
    productSizes, // { S: {...}, M: {...} }
    fabric, // "cotton"
    category, // "tops"
  } = location.state;

  // '현재 선택된 핏'을 관리하는 State (이건 .tsx에 있어야 함)
  const [selectedFit, setSelectedFit] = useState<FitType>("semiOver");

  const handleFitChange = (fit: FitType) => {
    setSelectedFit(fit); // 이 함수는 그냥 state를 바꾸는 게 전부임
  };

  // ⭐️ 2. useMemo가 '엄청' 간단해짐
  const recommendations = useMemo(() => {
    // 데이터가 하나라도 없으면 계산 중지
    if (!userBody || !productSizes || !fabric || !category) {
      return {};
    }

    // ⭐️ 그냥 함수 호출 1줄로 끝!
    return calculateAllFitRecommendations(
      userBody,
      productSizes,
      fabric,
      category
    );
  }, [userBody, productSizes, fabric, category]); // 의존성 배열에 다 넣어줌

  // ⭐️ 3. 나머지는 아까 코드랑 '완전히' 동일
  const handleGoShopping = () => {
    // ⭐️ 메인 페이지('/')로 '이동'시킨다
    navigate("/");
  };

  const currentResult = recommendations[selectedFit];


  if (productSizes && (productSizes.free || productSizes.FREE)) {
    // (대소문자 방어: free 또는 FREE)
    const spec = productSizes.free || productSizes.FREE; 

    // ⭐️ 치수 이름을 한글로 보여줄 '사전' (필요한 거 다 넣어둠)
    const labels: Record<string, string> = {
      shoulder: "어깨",
      chest: "가슴",
      sleeve: "소매",
      length: "총장",
      waist: "허리",
      hip: "엉덩이",
      thigh: "허벅지",
      circumference: "둘레",
      height: "높이",
      width: "너비"
      // (여기에 없는 키가 들어오면 그냥 영어 키 그대로 보여줌)
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
          
          {/* 1. 헤더 */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
              <span className="text-3xl">📏</span> {/* 모자 아이콘 대신 '자' 아이콘으로 변경 */}
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              ONE SIZE (FREE)
            </h2>
            <p className="text-gray-600">
              이 상품은 단일 사이즈입니다.<br />
              아래 실측 정보를 확인해주세요.
            </p>
          </div>

          {/* 2. 실측 정보 카드 (동적 렌더링) */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <h3 className="text-lg font-bold text-primary mb-4">상세 치수</h3>
            <div className="space-y-3">
              
              {/* ⭐️⭐️ 여기서 spec 안에 있는 모든 키를 자동으로 뿌려줌 ⭐️⭐️ */}
              {Object.entries(spec).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                  <span className="text-gray-600 capitalize">
                    {labels[key] || key} {/* 한글 이름이 있으면 쓰고, 없으면 영어 그대로 */}
                  </span>
                  <span className="font-bold text-primary">
                    {String(value)} cm
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* 3. 돌아가기 버튼 */}
          <button
            onClick={() => navigate("/")}
            className="w-full bg-primary hover:bg-accent text-white py-4 rounded-full transition-all font-medium shadow-lg"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    );
  }

  if (!currentResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* 1. 아이콘 & 제목 */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤔</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              계산 결과 없음
            </h2>
            <p className="text-gray-600 leading-relaxed">
              <span className="font-bold text-accent">
                {FIT_TABS.find((t) => t.key === selectedFit)?.label}
              </span>
              에 맞는 사이즈를 찾지 못했습니다.
              <br />
              아래에서 다른 핏을 선택해보세요.
            </p>
          </div>

          {/* 2. 핏 선택 탭 (메인 화면과 똑같은 디자인 적용) */}
          <div className="bg-accent rounded-[18px] p-1 flex justify-stretch gap-1 mb-8">
            {FIT_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleFitChange(tab.key)}
                className={`flex-1 py-4 rounded-[15px] transition-all text-center font-bold text-lg ${
                  tab.key === selectedFit
                    ? "bg-white text-accent shadow-sm"
                    : "bg-transparent text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 3. 돌아가기 버튼 */}
          <button
            onClick={handleGoShopping}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-full transition-all font-medium"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm mb-4">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-primary tracking-wide">
            AI 사이즈 추천
          </span>
        </div>
        <h1 className="text-4xl text-primary mb-4">완벽한 사이즈 찾기</h1>
        <p className="text-gray-600">
          간단한 정보 입력으로 내게 맞는 사이즈를 찾아보세요
        </p>
      </div>

      {/* Fit Selector */}
      <div className="bg-white rounded-3xl shadow-xl p-8 overflow-visible">
        <div className="bg-accent rounded-[18px] p-1 flex justify-stretch gap-1 mb-8 max-w-4xl mx-auto">
          {/* ⭐️ 2. '한글 배열' 대신 'FIT_TABS' 배열을 map으로 돌림 */}
          {FIT_TABS.map((tab) => (
            <button
              key={tab.key} // ⭐️ key는 영어 ('slim', 'regular'...)
              onClick={() => handleFitChange(tab.key)} // ⭐️ 함수에는 영어 key를 전달
              className={`flex-1 py-6 rounded-[15px] transition-all text-center font-bold text-2xl ${
                // ⭐️ 비교도 영어(tab.key) vs 영어(selectedFit)
                tab.key === selectedFit
                  ? "bg-white text-accent shadow-[...]" // (className 복잡하니까 생략)
                  : "bg-transparent text-white hover:bg-white/10"
              }`}
            >
              <span className="block text-center">
                {tab.label} {/* ⭐️ 눈에 보이는 건 한글 라벨 */}
                {/* (보너스) 탭에 추천 사이즈 이름도 같이 표시 */}
                {recommendations[tab.key]?.sizeName && (
                  <span className="block text-sm font-normal">
                    {recommendations[tab.key]?.sizeName}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Shirt Visualization - T-Shirt with Measurement Circles */}
        <div className="relative max-w-md mx-auto mb-8">
          <svg viewBox="0 0 448 523" className="w-full h-auto">
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="511.788"
                id="filter0_d_tshirt"
                width="558.066"
                x="0"
                y="0"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="3.7" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.399395 0 0 0 0 0.399395 0 0 0 0 0.399395 0 0 0 0.25 0"
                />
                <feBlend
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="effect1_dropShadow_tshirt"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect1_dropShadow_tshirt"
                  mode="normal"
                  result="shape"
                />
              </filter>
            </defs>

            {/* Background layer: Body/Person silhouette (gray) */}
            <g
              filter="url(#filter0_d_tshirt)"
              opacity="0.5"
              transform="translate(-35, 40) scale(0.9)"
            >
              <path d={svgPaths.p12b9ea80} fill="#EFF0F3" />
              <path
                d={svgPaths.p30ed2a00}
                stroke="#BEBEBE"
                strokeWidth="3"
                fill="none"
              />
            </g>

            {/* Foreground layer: T-shirt outline */}
            <g transform="translate(23, 90) scale(0.95)" opacity="0.7">
              <path
                d={svgPaths.p1e735c00}
                fill="#DEE3E3"
                stroke="#717171"
                strokeWidth="4"
                strokeMiterlimit="10"
              />
            </g>

            {/* Measurement highlight circles */}
            {/* Shoulder - Green circle */}
            <circle cx="104" cy="149" r="52" fill="#D1FAE5" opacity="0.8" />

            {/* Chest - Yellow circle */}
            <circle cx="224" cy="239" r="52" fill="#FEF3C7" opacity="0.8" />

            {/* Sleeve - Red/Pink circle */}
            <circle cx="343" cy="209" r="52" fill="#FECACA" opacity="0.8" />

            {/* Length - Red/Pink circle */}
            <circle cx="298" cy="388" r="52" fill="#FECACA" opacity="0.8" />
          </svg>

          {/* 3. ✅ 말풍선(div)이 '우리' 데이터(diffCm)를 부르도록 수정 */}
          {/* (currentResult.measurements.shoulder.diff -> currentResult.diffCm.shoulder) */}

          {currentResult.diffCm.shoulder !== null && (
            <div className="absolute top-[18%] left-[-5%] bg-green-100 text-green-700 px-3 py-2 rounded-full shadow-md text-sm">
              어깨 {currentResult.diffCm.shoulder > 0 ? "+" : ""}
              {currentResult.diffCm.shoulder}cm
            </div>
          )}

          {currentResult.diffCm.chest !== null && (
            <div className="absolute top-[42%] left-[35%] bg-yellow-100 text-yellow-700 px-3 py-2 rounded-full shadow-md text-sm">
              가슴 {currentResult.diffCm.chest > 0 ? "+" : ""}
              {currentResult.diffCm.chest}cm
            </div>
          )}

          {currentResult.diffCm.sleeve !== null && (
            <div className="absolute top-[35%] right-[-8%] bg-red-100 text-red-700 px-3 py-2 rounded-full shadow-md text-sm">
              소매 {currentResult.diffCm.sleeve > 0 ? "+" : ""}
              {currentResult.diffCm.sleeve}cm
            </div>
          )}

          {currentResult.diffCm.length !== null && (
            <div className="absolute bottom-[20%] right-[-5%] bg-red-100 text-red-700 px-3 py-2 rounded-full shadow-md text-sm">
              기장 {currentResult.diffCm.length > 0 ? "+" : ""}
              {currentResult.diffCm.length}cm
            </div>
          )}
        </div>

        {/* Main Result */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/20 to-primary/20 px-6 py-3 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-primary">
              <span className="text-2xl">{currentResult.sizeName}사이즈</span>{" "}
              <span className="ml-1">가 </span>
              <span className="ml-1">
                {FIT_TABS.find((t) => t.key === selectedFit)?.label}에 가장
                가깝습니다.
              </span>
            </span>
          </div>

          <p className="text-gray-600 max-w-xl mx-auto">
            {FIT_ANALYSIS_TEXTS[selectedFit]}{" "}
          </p>
        </div>

        {/* Confidence */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-full">
            <span className="text-sm text-gray-600">AI 정확도</span>
            <span className="text-xl text-accent">
              {currentResult.accuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Measurements */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-xl text-primary mb-6">상세 측정 비교</h3>
        <div className="space-y-4">
          {/* (상의/하의 구분에 따라 '표시할 라벨'이 달라져야 함) */}

          {(() => {
            // ⭐️ 2. 표시할 부위 '라벨' 정의
            const labels: Record<string, string> =
              category === "tops"
                ? {
                    shoulder: "어깨",
                    chest: "가슴",
                    sleeve: "소매",
                    length: "기장",
                  }
                : {
                    waist: "허리",
                    hip: "엉덩이",
                    thigh: "허벅지",
                    bottomLength: "총장",
                  };

            // ⭐️ 3. '라벨'을 기준으로 루프
            return Object.entries(labels).map(([key, label]) => {
              // ⭐️ 4. '우리' `currentResult`에서 '진짜' 데이터 꺼내기
              const cmDiff = currentResult.diffCm[key];
              const ease = currentResult.easePercent[key];

              // ⭐️ 5. '입력 안 한 값'은 '표시 안 함' (e.g., '소매' 선택 입력 안 함)
              if (cmDiff === null || ease === null) {
                return null; // 이 부위는 '스킵'
              }

              // ⭐️ 6. '여유율(%)'에 따라 '상태' / '색깔' / '너비' '실시간' 계산
              let status: "perfect" | "good" | "large" | "small";
              let badgeText: string;
              let colorClass: string;

              if (ease < 0) {
                status = "small";
                badgeText = "작음";
                colorClass = "bg-gradient-to-r from-green-400 to-blue-500";
              } else if (ease < 10) {
                // -5% ~ +10%
                status = "perfect";
                badgeText = "최적";
                colorClass = "bg-gradient-to-r from-green-400 to-green-500";
              } else if (ease < 20) {
                // +10% ~ +20%
                status = "good";
                badgeText = "양호";
                colorClass = "bg-gradient-to-r from-green-400 to-blue-500";
              } else {
                // +20% 이상
                status = "large";
                badgeText = "여유";
                colorClass = "bg-gradient-to-r from-green-400 to-blue-500";
              }

              const widthMap = {
                perfect: 90,
                good: 70,
                small: 40,
                large: 40,
              };

              const barWidthPercent = widthMap[status];

              // ⭐️ 8. '팀원' UI에 '진짜' 데이터 꽂아넣기
              return (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-600">{label}</div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-100 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full flex items-center justify-center transition-all ${colorClass}`}
                        style={{ width: `${barWidthPercent}%` }} // ⭐️ '진짜' 너비
                      >
                        <span className="text-xs text-white">
                          {cmDiff > 0 ? "+" : ""}
                          {cmDiff}cm
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        status === "perfect"
                          ? "bg-green-100 text-green-700"
                          : status === "good"
                          ? "bg-blue-100 text-blue-700"
                          : status === "large"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {badgeText}
                    </span>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
      {/* Tips */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-xl text-primary mb-4">스타일링 팁</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              {FIT_TABS.find((t) => t.key === selectedFit)?.label}은 편안한
              착용감과 트렌디한 실루엣을 동시에 제공합니다
            </p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              여유로운 핏을 원하시면 한 치수 올리는 것을 추천드립니다
            </p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              브랜드마다 사이즈 기준이 다를 수 있으니 상품 상세페이지의 실측
              정보를 확인하세요
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleGoShopping}
        className="w-full bg-primary hover:bg-accent text-white py-4 rounded-full transition-all hover:shadow-lg text-center"
      >
        <span className="block text-center">쇼핑 시작하기</span>
      </button>
    </div>
  );
}
