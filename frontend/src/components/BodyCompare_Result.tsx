import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import './index.css';
import { Sparkles, CheckCircle2 } from "lucide-react";

// ⭐️ 1. 방금 만든 파일에서 '메인 함수'를 import!
import { calculateAllFitRecommendations, FitType } from "../utils/compare.ts";

// (SVG나 CSS import는 그대로...)
import TorsoSvg from "../components/torso.svg";
import TshirtSvg from "../components/t_shirt.svg";

const FIT_TABS: { key: FitType; label: string }[] = [
  { key: "slim", label: "슬림핏" },
  { key: "regular", label: "레귤러핏" },
  { key: "semiOver", label: "세미오버핏" },
  { key: "over", label: "오버핏" },
];

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

  const currentResult = recommendations[selectedFit];
  if (!currentResult) {
    return (
      <div className="result-container">
        <h2>계산 결과 없음</h2>
        <p>
          '{selectedFit}'에 맞는 사이즈를 찾지 못했습니다. 다른 핏을
          선택해보세요.
        </p>
        {/* 탭 버튼은 여전히 보여줘서 다른 핏을 누를 수 있게 함 */}
        <div className="fit-selector">
          <button onClick={() => handleFitChange("slim")}>슬림핏</button>
          <button onClick={() => handleFitChange("regular")}>레귤러핏</button>
          <button onClick={() => handleFitChange("semiOver")}>
            세미오버핏
          </button>
          <button onClick={() => handleFitChange("over")}>오버핏</button>
        </div>
      </div>
    );
  }

  const handleGoShopping = () => {
    // ⭐️ 메인 페이지('/')로 '이동'시킨다
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-xl p-8">
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
        {/* ⭐️ 네가 준 그 'div' 블록 전체를 이걸로 바꿔치기 ⭐️ */}
        <div className="relative max-w-md mx-auto mb-8">
          {/* 1. 싹 다 지움: <svg> ... </svg> (svgPaths 쓰던 거) */}

          {/* 2. ✅ 이걸로 바꿈: 우리가 원래 쓰려던 <img> 태그 (깔끔) */}
          {/* (파일 맨 위에 import TorsoSvg ... / import TshirtSvg ... 꼭 있어야 함!) */}
          <img src={TorsoSvg} className="torso" alt="신체 실루엣" />
          <img src={TshirtSvg} className="tshirt" alt="추천 티셔츠" />

          {/* 3. ✅ 말풍선(div)이 '우리' 데이터(diffCm)를 부르도록 수정 */}
          {/* (currentResult.measurements.shoulder.diff -> currentResult.diffCm.shoulder) */}

          {/* 4. ✅ (보너스) 'null' 체크 추가: 사용자가 값 입력 안 했으면 말풍선 안 뜸 */}

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

        {/* Confidence */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-full">
            <span className="text-sm text-gray-600">AI 정확도</span>
            <span className="text-xl text-accent">
              {currentResult.confidence}%
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Measurements */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-xl text-primary mb-6">상세 측정 비교</h3>
        <div className="space-y-4">
          {currentResult.measurements &&
            Object.entries(currentResult.measurements).map(
              ([key, data]: [string, any]) => {
                const labels: { [key: string]: string } = {
                  shoulder: "어깨",
                  chest: "가슴",
                  sleeve: "소매",
                  length: "기장",
                };

                return (
                  <div key={key} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-gray-600">
                      {labels[key]}
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-100 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full flex items-center justify-center transition-all ${
                            data.status === "perfect"
                              ? "bg-gradient-to-r from-green-400 to-green-500"
                              : data.status === "good"
                              ? "bg-gradient-to-r from-blue-400 to-blue-500"
                              : "bg-gradient-to-r from-yellow-400 to-yellow-500"
                          }`}
                          style={{ width: "85%" }}
                        >
                          <span className="text-xs text-white">
                            {data.diff > 0 ? "+" : ""}
                            {data.diff}cm
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          data.status === "perfect"
                            ? "bg-green-100 text-green-700"
                            : data.status === "good"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {data.status === "perfect"
                          ? "최적"
                          : data.status === "good"
                          ? "양호"
                          : "여유"}
                      </span>
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-xl text-primary mb-4">스타일링 팁</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              {currentResult.recommendedFit}은 편안한 착용감과 트렌디한 실루엣을
              동시에 제공합니다
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

      {/* API Integration Info */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <h4 className="text-sm text-blue-900 mb-2">🔌 API 연동 준비 완료</h4>
        <p className="text-xs text-blue-700">
          이 페이지는 실제 AI 피팅 API와 연동할 수 있도록 구조화되어 있습니다.
          AIFittingPage.tsx 파일의 handleAnalyze 함수에서 주석 처리된 API 호출
          코드를 확인하세요.
        </p>
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
