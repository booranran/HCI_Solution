// frontend/script/feature1.js

// ==========================================================
// 1. 페이지 로드 시, localStorage에서 옷 정보 꺼내서 폼 채우기
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const clothData = JSON.parse(localStorage.getItem("clothData"));

  if (clothData) {
    // <span> 태그에 옷 이름 채우기
    document.getElementById("clothName").innerText = clothData.name;
    
    // <input type="hidden"> 태그에 옷 ID 채우기
    document.getElementById("clothIdInput").value = clothData.id;
  } else {
    // 혹시 clothData가 없으면
    document.getElementById("clothName").innerText = 
      "오류: 상품을 선택하고 와주세요.";
    document.getElementById("submitBtn").disabled = true; // 버튼 비활성화
  }
});


// ==========================================================
// 2. "AI 합성" 버튼 클릭 시, 폼을 백엔드로 제출하기
// (이건 네가 index.html에서 썼던 handleSubmit 함수랑 100% 동일한 코드임)
// ==========================================================
async function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById("uploadForm");
  const btn = document.getElementById("submitBtn");
  const spinner = document.getElementById("spinner");
  const resultContainer = document.getElementById("resultContainer");
  const resultImage = document.getElementById("resultImage");

  btn.disabled = true;
  spinner.style.display = "block";
  resultContainer.style.display = "none";

  try {
    // [중요!] 이 주소가 맞는지 확인!
    const res = await fetch("http://127.0.0.1:8000/generate", {
      method: "POST",
      body: new FormData(form),
    });

    const data = await res.json();
    console.log("✅ AI 응답:", data);

    if (data.result_image) {
      resultImage.src = data.result_image;
      resultContainer.style.display = "block";
    } else {
      alert("⚠️ AI 응답에서 이미지 데이터를 찾을 수 없습니다.");
      console.log(data);
    }
  } catch (err) {
    console.error("❌ 요청 실패:", err);
    alert("서버 요청 중 오류가 발생했습니다.");
  } finally {
    btn.disabled = false;
    spinner.style.display = "none";
  }
}