function viewDetail(productId) {
  localStorage.setItem("selectedProduct", productId);
  window.location.href = "detail.html";
}

const products = {
  shirt001: {
    name: "베이직 셔츠",
    price: "₩39,000",
    img: "/backend/clothes/shirt.png",
    fabric: "polySpan",
    measurements: { shoulder: 46, chest: 100, sleeve: 62, length: 70 }
  },
  jacket001: {
    name: "베이직 코트",
    price: "₩69,000",
    img: "/backend/clothes/cort1.png",
    fabric: "denim",
    measurements: { shoulder: 48, chest: 106, sleeve: 61, length: 68 }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const id = localStorage.getItem("selectedProduct");
  if (id && products[id]) {
    const p = products[id];
    document.getElementById("productDetail").innerHTML = `
      <h2>${p.name}</h2>
      <img src="${p.img}" alt="${p.name}" style="width:250px;border-radius:10px;"><br>
      <p>${p.price}</p>
      <p>소재: ${p.fabric}</p>
    `;
    localStorage.setItem("clothData", JSON.stringify(p));
  }
});

function goFeature(url) {
  window.location.href = url;
}

