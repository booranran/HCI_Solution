const fabricFactors = {
  cotton: 0.95,
  polyester: 1.0,
  polySpan: 1.05,
  rayon: 1.08,
  linen: 0.9,
  denim: 0.85
};

function calcEase(bodyData, clothData, fabricType) {
  const factor = fabricFactors[fabricType] || 1.0;
  const results = {};
  for (const key in bodyData) {
    const ease = ((clothData[key] - bodyData[key]) / bodyData[key]) * 100 * factor;
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
  // 사용자 입력 가져오기
  const user = {
    shoulder: parseFloat(document.getElementById("userShoulder").value),
    chest: parseFloat(document.getElementById("userChest").value),
    sleeve: parseFloat(document.getElementById("userSleeve").value),
    length: parseFloat(document.getElementById("userLength").value)
  };

  const cloth = {
    shoulder: parseFloat(document.getElementById("clothShoulder").value),
    chest: parseFloat(document.getElementById("clothChest").value),
    sleeve: parseFloat(document.getElementById("clothSleeve").value),
    length: parseFloat(document.getElementById("clothLength").value)
  };

  const fabric = document.getElementById("fabric").value;
  const eases = calcEase(user, cloth, fabric);

  const table = document.getElementById("fitTable");
  table.innerHTML = "";

  for (const part in eases) {
    const ease = eases[part];
    const fit = fitCategory(ease);
    const color =
      fit === "작음" ? "red" :
      fit === "슬림핏" ? "orange" :
      fit === "정핏" ? "green" : "blue";
    table.innerHTML += `
      <tr>
        <td>${part}</td>
        <td>${ease}%</td>
        <td style="color:${color}">${fit}</td>
      </tr>`;
  }
}

