// src/utils/fitCalculator.ts

// --- 1. 기본 데이터 ---

export const fabricFactors: Record<string, number> = {
  cotton: 0.95, polyester: 1.0, polySpan: 1.05,
  rayon: 1.08, linen: 0.9, denim: 0.85,
};

// 핏별 목표 여유율 (%) (가슴 기준)
export const FIT_TARGET_EASE = {
  slim: 5,
  regular: 10,
  semiOver: 15,
  over: 20,
};
export type FitType = "slim" | "regular" | "semiOver" | "over";


// --- 2. 헬퍼(Helper) 함수 (우리가 수정한 새 계산식) ---

/**
 * [HELPER] 신체와 '하나의' 옷의 핏 상세를 계산
 * (이게 네 옛날 calcEase, easeToCm을 합치고 수정한 버전)
 */
export function calculateFitDetails(
  body: Record<string, any>, // (string으로 넘어올 수 있으니 any)
  cloth: Record<string, number>,
  fabric: string
) {
  const factor = fabricFactors[fabric] || 1.0;

  const diffCm: Record<string, number | null> = {};
  const easePercent: Record<string, number | null> = {};

  // 비교할 부위 목록 (상의/하의 공통으로 우선 다 때려 넣기 - 어차피 없으면 스킵됨)
  const partsToCompare = [
    "shoulder", "chest", "sleeve", "topLength", // 상의
    "waist", "hip", "thigh", "bottomLength"    // 하의
  ];

  for (const key of partsToCompare) {
    const bodyValue = Number(body[key]);
    const clothValue = Number(cloth[key]);

    // body[key]에 값이 없거나 (0, "", null, undefined), cloth에 값이 없으면 계산 스킵
    if (!bodyValue || !clothValue) {
      diffCm[key] = null;
      easePercent[key] = null;
      continue;
    }
    
    const effectiveClothSize = clothValue * factor;
    const cmDiff = effectiveClothSize - bodyValue;
    const percent = (cmDiff / bodyValue) * 100;

    diffCm[key] = Number(cmDiff.toFixed(1));
    easePercent[key] = Number(percent.toFixed(2));
  }
  return { diffCm, easePercent };
}


// --- 3. 메인(Main) 함수 (제일 중요!) ---

/**
 * [MAIN] 모든 핏(슬림, 레귤러..)에 대한 추천 사이즈를 '전부' 계산해서 반환
 * @param userBody 사용자 신체 폼 데이터
 * @param productSizes 상품의 모든 사이즈 정보 { S: {...}, M: {...} }
 * @param fabric 원단
 * @param category 'tops' or 'bottoms'
 * @returns 핏별 추천 결과 객체 { slim: { sizeName: 'S', ... }, regular: { ... } }
 */
export function calculateAllFitRecommendations(
  userBody: Record<string, any>,
  productSizes: Record<string, Record<string, number>>,
  fabric: string,
  category: "tops" | "bottoms" = "tops" // 기본값 'tops'
) {
  const allFitRecommendations: Record<string, any> = {};

  // 핏을 결정하는 기준 부위 (상의는 가슴, 하의는 엉덩이)
  const fitReferencePart = category === "tops" ? "chest" : "hip";

  for (const [sizeName, clothSize] of Object.entries(productSizes)) {
    
    const { diffCm, easePercent } = calculateFitDetails(userBody, clothSize, fabric);

    // 기준 부위의 여유율 (e.g. 가슴 여유율)
    const referenceEase = easePercent[fitReferencePart];
    
    // 기준 부위(가슴/엉덩이) 값이 없으면 이 사이즈는 비교 불가
    if (referenceEase === null) continue;

    // 이 사이즈가 어떤 핏에 가장 가까운지 판단
    let closestFit: FitType = "slim";
    let smallestDiff = Infinity;

    for (const [fit, targetEase] of Object.entries(FIT_TARGET_EASE)) {
      const diff = Math.abs(referenceEase - targetEase);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestFit = fit as FitType;
      }
    }

    // 이 핏에 '더 잘 맞는' 사이즈가 아직 없거나, 지금 사이즈가 '더' 잘 맞으면 덮어쓰기
    if (!allFitRecommendations[closestFit] || allFitRecommendations[closestFit].smallestDiff > smallestDiff) {
      allFitRecommendations[closestFit] = {
        sizeName: sizeName,
        diffCm: diffCm,
        easePercent: easePercent,
        accuracy: Math.max(0, (100 - (smallestDiff * 5))).toFixed(0), // 정확도
        smallestDiff: smallestDiff,
      };
    }
  }

  return allFitRecommendations;
}