// frontend/script/feature3.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. 👕 localStorage에서 현재 상품 정보를 가져온다 (detail.html이 저장함)
  const clothData = JSON.parse(localStorage.getItem("clothData"));
  const productId = clothData ? clothData.id : null;

  if (!productId) {
    // 상품 ID가 없으면 에러
    document.getElementById("loadingMessage").innerHTML = 
      '<p style="color: red;">제품 ID를 찾을 수 없습니다. (상품 상세 페이지에서 다시 시도하세요)</p>';
    return; // 중단
  }

  // 2. 📞 *그 상품 ID*로 API를 호출한다
  fetchReviews(productId);
});

// 👈 [수정] productId를 인자로 받도록 변경
async function fetchReviews(productId) {
  const loadingMsg = document.getElementById("loadingMessage");
  const summaryBox = document.getElementById("reviewSummary");
  const reviewTable = document.getElementById("reviewTable");

  try {
    // 👈 [수정] API 주소가 /reviews/{productId} 형태로 바뀜
    const response = await fetch(`http://127.0.0.1:8000/reviews/${productId}`);
    
    if (!response.ok) {
      throw new Error("서버에서 리뷰 데이터를 가져오는 데 실패했습니다.");
    }

    const data = await response.json();
    console.log(`✅ (${productId}) 리뷰 데이터:`, data);

    loadingMsg.style.display = "none";
    
    // (추가) 만약 리뷰가 0개면?
    if (data.summary.total === 0) {
      document.getElementById("reviewSummary").innerHTML = 
        `<h3>📊 ${productId} 리뷰</h3><p>아직 분석된 리뷰가 없습니다.</p>`;
      summaryBox.style.display = "block";
      reviewTable.style.display = "none";
      return;
    }

    // 1. 요약 리포트 표시 (이하 로직 동일)
    displaySummary(data.summary);
    summaryBox.style.display = "block";
    
    // 2. 전체 리뷰 테이블 표시 (이하 로직 동일)
    displayReviewTable(data.reviews);
    reviewTable.style.display = "block";

  } catch (error) {
    console.error("❌ 리뷰 데이터 로드 실패:", error);
    loadingMsg.innerHTML = `<p style="color: red;">${error.message}</p>`;
  }
}

// 1. 요약 리포트(인사이트 포함)를 HTML에 채우는 함수
function displaySummary(summary) {
  // 백분율로 변환하는 헬퍼 함수
  const toPercent = (val) => (val * 100).toFixed(1) + "%";

  document.getElementById("summaryTotal").innerText = `👕 총 리뷰 수: ${summary.total}건`;
  document.getElementById("summarySize").innerText = `📏 정사이즈 비율: ${toPercent(summary.size_rate)}`;
  document.getElementById("summaryFit").innerText = `😊 긍정 리뷰 비율: ${toPercent(summary.pos_rate)}`;
  document.getElementById("summaryMaterial").innerText = `🧶 재질 언급 비율: ${toPercent(summary.mat_rate)}`;

  // 👇👇👇 여기가 "어제 짠 코드"의 핵심임! 👇👇👇
  // 'insights' 변수를 여기서 선언!
  const insights = [];
  
  if (summary.size_rate < 0.5) {
    insights.push('<p class="insight bad">• 👖 사이즈 불만이 많은 제품이에요. 상세 사이즈 안내가 필요합니다.</p>');
  } else {
    insights.push('<p class="insight good">• ✨ 대부분 사용자들이 정사이즈라고 평가했어요.</p>');
  }

  if (summary.mat_rate > 0.7) {
    insights.push('<p class="insight">• 🌿 재질 관련 언급이 많아요. 품질이나 촉감에 대한 리뷰 강조가 좋아요.</p>');
  }
  if (summary.pos_rate < 0.4) {
    insights.push('<p class="insight bad">• 😕 전반적인 만족도가 낮아요. 문제 포인트를 파악해보세요.</p>');
  } else if (summary.pos_rate > 0.7) {
    insights.push('<p class="insight good">• 💖 사용자들의 만족도가 높아요. 대표 후기 노출에 활용하세요!</p>');
  }
  document.getElementById("summaryInsights").innerHTML = insights.join("");
}


// 2. 전체 리뷰 목록을 테이블에 채우는 함수
function displayReviewTable(reviews) {
  const tableBody = document.getElementById("reviewTableBody");
  tableBody.innerHTML = ""; // 기존 내용 비우기

  if (reviews.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">분석된 리뷰 데이터가 없습니다.</td></tr>';
    return;
  }

  reviews.forEach(review => {
    // None (null) 값을 '-'로 예쁘게 표시
    const safe = (val) => val === null ? '-' : val;

    const row = `
      <tr>
        <td>${safe(review.id)}</td>
        <td>${"⭐".repeat(review.stars)}</td>
        <td>${safe(review.size_match)}</td>
        <td>${safe(review.fit_sentiment)}</td>
        <td>${review.material_mention ? 'O' : 'X'}</td>
        <td>${safe(review.text).substring(0, 30)}...</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}