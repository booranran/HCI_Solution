const fabricFactors = {
  cotton: 0.95,
  polyester: 1.0,
  polySpan: 1.05,
  rayon: 1.08,
  linen: 0.9,
  denim: 0.85,
};

function calcEase(bodyData, clothData, fabricType) {
  const factor = fabricFactors[fabricType] || 1.0;
  const results = {};
  for (const key in bodyData) {
    const ease =
      ((clothData[key] - bodyData[key]) / bodyData[key]) * 100 * factor;
    results[key] = ease.toFixed(2);
  }
  return results;
}

function fitCategory(ease) {
  const val = parseFloat(ease);
  if (val < 0) return "작음";
  if (val < 5) return "슬림핏";
  if (val < 10) return "정핏";
  return "루즈핏";
}

function showResult() {
  const user = {
    shoulder: parseFloat(document.getElementById("userShoulder").value),
    chest: parseFloat(document.getElementById("userChest").value),
    sleeve: parseFloat(document.getElementById("userSleeve").value),
    length: parseFloat(document.getElementById("userLength").value),
  };

  // 옷 데이터는 자동 로드됨
  const cloth = {
    shoulder: parseFloat(document.getElementById("clothShoulder").value),
    chest: parseFloat(document.getElementById("clothChest").value),
    sleeve: parseFloat(document.getElementById("clothSleeve").value),
    length: parseFloat(document.getElementById("clothLength").value),
  };

  const clothData = JSON.parse(localStorage.getItem("clothData"));
  const fabric = clothData.fabric; // localStorage의 값 사용

  const eases = calcEase(user, cloth, fabric);

  const table = document.getElementById("fitTable");
  table.innerHTML = "";

  for (const part in eases) {
    const ease = eases[part];
    const fit = fitCategory(ease);
    const color =
      fit === "작음"
        ? "red"
        : fit === "슬림핏"
        ? "orange"
        : fit === "정핏"
        ? "green"
        : "blue";
    table.innerHTML += `
      <tr>
        <td>${part}</td>
        <td>${ease}%</td>
        <td style="color:${color}">${fit}</td>
      </tr>`;
  }
}

// ============================
// 페이지 로드 시 옷 데이터 자동 세팅
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const clothData = JSON.parse(localStorage.getItem("clothData"));
  if (clothData) {
    const { measurements, fabric } = clothData;

    document.getElementById("clothShoulder").value = measurements.shoulder;
    document.getElementById("clothChest").value = measurements.chest;
    document.getElementById("clothSleeve").value = measurements.sleeve;
    document.getElementById("clothLength").value = measurements.length;

    document.getElementById("clothInfo").innerHTML = `
      <strong>${clothData.name}</strong> (${clothData.price})
      <br>소재: ${clothData.fabric}
      <br><img src="/backend/${clothData.image_path}" style="width:180px;border-radius:8px;margin-top:5px;">
    `;
  }
});
