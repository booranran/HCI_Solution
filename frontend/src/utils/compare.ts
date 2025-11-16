// src/utils/fitCalculator.ts

// --- 1. 기본 데이터 ---

export const fabricFactors: Record<string, number> = {
  cotton: 0.95,
  polyester: 1.0,
  polySpan: 1.05,
  rayon: 1.08,
  linen: 0.9,
  denim: 0.85,
};

// 핏별 목표 여유율 (%) (가슴 기준)
export const FIT_TARGET_EASE = {
  slim: 5,
  regular: 10,
  semiOver: 15,
  over: 20,
};
export type FitType = "slim" | "regular" | "semiOver" | "over";

// ⭐️ 1. '핏별' / '부위별' 이상적인 여유율(%) 사전
// (이 숫자들은 네가 '기획'에 맞게 조절해야 해)
const IDEAL_EASE_BY_FIT: Record<FitType, Record<string, number>> = {
  slim: {
    shoulder: 2, // 슬림핏 어깨는 +2%
    chest: 5, // 슬림핏 가슴은 +5%
    sleeve: 3,
    topLength: 0, // 기장은 딱 맞는 걸 '이상'으로
  },
  regular: {
    shoulder: 4,
    chest: 10, // 레귤러핏 가슴은 +10%
    sleeve: 5,
    topLength: 0,
  },
  semiOver: {
    shoulder: 8,
    chest: 15, // 세미오버 가슴은 +15%
    sleeve: 7,
    topLength: 2,
  },
  over: {
    shoulder: 12,
    chest: 20, // 오버핏 가슴은 +20%
    sleeve: 10,
    topLength: 4,
  },
  // (TODO: 'bottoms' 하의용 이상치도 추가해야 함)
  // bottoms: { waist: 3, hip: 5, thigh: 10, ... }
};

// --- 2. 헬퍼(Helper) 함수 (우리가 수정한 새 계산식) ---

/**
 * [HELPER] 신체와 '하나의' 옷의 핏 상세를 계산
 * (이게 네 옛날 calcEase, easeToCm을 합치고 수정한 버전)
 */
export function calculateFitDetails(
  body: Record<string, any>, // (string으로 넘어올 수 있으니 any)
  cloth: Record<string, number>,
  fabric: string,
  category: "tops" | "bottoms"
) {
  const factor = fabricFactors[fabric] || 1.0;

  const diffCm: Record<string, number | null> = {};
  const easePercent: Record<string, number | null> = {};

  // 비교할 부위 목록 (상의/하의 공통으로 우선 다 때려 넣기 - 어차피 없으면 스킵됨)
  const partsToCompare =
    category === "tops"
      ? ["shoulder", "chest", "sleeve", "length"] // '엔진'이 쓸 '표준' 키
      : ["waist", "hip", "thigh", "length"]; // (하의도 '기장'은 'length'로 통일)

  for (const key of partsToCompare) {
    let bodyKey = key; // (shoulder, chest, waist, hip, thigh는 폼이랑 이름이 같음)
    let clothKey = key; // (cloth도 대부분 이름이 같음)

    if (key === "length") {
      // '기장'일 때가 문제
      if (category === "tops") {
        bodyKey = "topLength"; // '몸' 데이터는 'topLength' 키에서 가져와
        clothKey = "length"; // '옷' 데이터는 'length' 키에서 가져와
      } else {
        // 'bottoms'
        bodyKey = "bottomLength"; // '몸' 데이터는 'bottomLength' 키에서 가져와
        clothKey = "length"; // (하의 '옷' 데이터도 'length'라고 '가정')
      }
    }

    const bodyValue = Number(body[key]);
    const clothValue = Number(cloth[key]);

    if (key === "length") {
      console.log(`[기장] bodyValue: ${bodyValue}`);
    }

    // body[key]에 값이 없거나 (0, "", null, undefined), cloth에 값이 없으면 계산 스킵
    if (
      bodyValue === 0 ||
      !isFinite(bodyValue) ||
      clothValue === null ||
      clothValue === undefined
    ) {
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

/**
 * [MAIN] 모든 핏(슬림, 레귤러..)에 대한 추천 사이즈를 '전부' 계산해서 반환
 */
export function calculateAllFitRecommendations(
  userBody: Record<string, any>,
  productSizes: Record<string, Record<string, number>>,
  fabric: string,
  category: "tops" | "bottoms" = "tops"
) {
  const allFitRecommendations: Record<string, any> = {};

  // 핏을 결정하는 기준 부위 (상의는 가슴, 하의는 엉덩이)
  const fitReferencePart = category === "tops" ? "chest" : "hip";

  // ⭐️ '새' 사전(Dictionary)을 사용함
  const idealTargets = IDEAL_EASE_BY_FIT;

  for (const [sizeName, clothSize] of Object.entries(productSizes)) {
    // 1. '이 옷'(S, M, L...)의 '실제' 여유율(%) 계산
    const { diffCm, easePercent: actualEase } = calculateFitDetails(
      userBody,
      clothSize,
      fabric,
      category
    );

    // 2. 기준 부위(가슴/엉덩이) 값이 없으면 이 사이즈는 비교 불가
    const referenceEase = actualEase[fitReferencePart];
    if (referenceEase === null) continue;

    // 3. '이 옷'이 4개 핏 중에 어디에 '가장' 가까운지 찾기
    let closestFit: FitType = "slim";
    let smallestDiff = Infinity; // '기준 부위'(가슴)의 오차

    for (const fitKey of Object.keys(idealTargets) as FitType[]) {
      // (e.g., | 13%(실제) - 15%(목표) | = 2% )
      // ⭐️ '새' 사전에서 '기준 부위'(chest)의 목표치를 가져옴
      const diff = Math.abs(
        referenceEase - idealTargets[fitKey][fitReferencePart]
      );
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestFit = fitKey;
      }
    }

    // ⭐️ 4. '그럴싸한 정확도' 계산 (제일 중요!)
    let totalPenalty = 0; // 총 오차 점수
    let partsConsidered = 0; // 계산에 포함된 부위 수

    // '가장 가까운 핏'의 '이상적 목표치' (e.g., 'semiOver'의 4개 부위)
    const idealFitTargets = idealTargets[closestFit];

    for (const [part, idealValue] of Object.entries(idealFitTargets)) {
      const actualValue = actualEase[part];

      if (actualValue !== null && actualValue !== undefined) {
        // '실제' 여유율과 '이상적' 여유율의 '차이(오차)'
        const error = Math.abs(actualValue - idealValue);

        // '가슴/엉덩이'는 가중치 2배. '어깨'는 1.5배 (중요하니까)
        if (part === "chest" || part === "hip") {
          totalPenalty += error * 2;
        } else if (part === "shoulder") {
          totalPenalty += error * 1.5;
        } else {
          totalPenalty += error;
        }
        partsConsidered++;
      }
    }

    // '평균 오차' 계산 (e.g., 2.5%)
    const averagePenalty =
      partsConsidered > 0 ? totalPenalty / partsConsidered : 0;

    // '평균 오차'를 '정확도'로 변환 (e.g., 100 - (2.5 * 5) = 87.5%)
    const accuracy = Math.max(0, 100 - averagePenalty * 2.5);

    // 5. 이 핏에 '더 잘 맞는' 사이즈가 아직 없으면 '저장'
    if (
      !allFitRecommendations[closestFit] ||
      allFitRecommendations[closestFit].smallestDiff > smallestDiff
    ) {
      allFitRecommendations[closestFit] = {
        sizeName: sizeName,
        diffCm: diffCm, // ⭐️ '헬퍼' 함수가 계산한 'cm 차이'
        easePercent: actualEase, // ⭐️ '헬퍼' 함수가 계산한 '% 차이'
        accuracy: accuracy.toFixed(0), // ⭐️ '여기서' 계산한 '새' 정확도
        smallestDiff: smallestDiff,
      };
    }
  }

  return allFitRecommendations;
}
