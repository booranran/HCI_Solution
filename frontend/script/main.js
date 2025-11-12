// 제품 데이터 전역 변수
let products = {};

// ===============================
// index.html에서 실행: 상품 클릭 → 상세 페이지 이동
// ===============================
function viewDetail(productId) {
  localStorage.setItem("selectedProduct", productId);
  window.location.href = "detail.html";
}

// ===============================
// detail.html에서 실행: 선택된 상품 정보 표시
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  const id = localStorage.getItem("selectedProduct");
  if (!id) return;

  // ✅ JSON 파일에서 데이터 불러오기
  const res = await fetch("/backend/clothes.json");
  const data = await res.json();

  // 배열 형태니까 찾기
  const product = data.find((p) => p.id === id);
  if (!product) return;

  // 화면 표시
  const container = document.getElementById("productDetail");
  if (container) {
    container.innerHTML = `
      <h2>${product.name}</h2>
      <img src="/backend/${product.image_path}" alt="${product.name}" style="width:250px;border-radius:10px;"><br>
      
      <p><b>가격:</b> ${product.price}</p>
      <p><b>소재:</b> ${product.fabric}</p>
      <p><b>핏:</b> ${product.fit}</p>
      <p><b>색상:</b> ${product.color}</p>

      <h3>실측 (cm)</h3>
      <ul style="text-align: left; display: inline-block; list-style: none; padding-left: 0;">
        <li><b>어깨:</b> ${product.measurements.shoulder}</li>
        <li><b>가슴:</b> ${product.measurements.chest}</li>
        <li><b>소매:</b> ${product.measurements.sleeve}</li>
        <li><b>총장:</b> ${product.measurements.length}</li>
      </ul>
    `;
  }

  // 다음 페이지용으로 저장
  localStorage.setItem("clothData", JSON.stringify(product));
});

// ===============================
// 솔루션 페이지 이동
// ===============================
function goFeature(url) {
  window.location.href = url;
}
