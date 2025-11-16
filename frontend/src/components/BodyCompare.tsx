import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
//import "./BodyCompare.css"; // (이 CSS 파일은 있어야 함)

const BodyCompare = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 상품 페이지에서 "tops" 또는 "bottoms" 값 받아오기
  const category = location.state?.category || "tops"; // (테스트용 기본값 'tops')

  // 2. '우리'가 만든 'form' state (measurements 아님!)
  // 상의/하의 모든 필드 정의
  const [form, setForm] = useState({
    height: "",
    weight: "",
    shoulder: "",
    chest: "",
    sleeve: "",
    topLength: "",
    waist: "",
    hip: "",
    thigh: "",
    bottomLength: "",
  });

  // 3. '우리'가 만든 'handleChange' (handleInputChange 아님!)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ⭐️ [e.target.name] 이게 핵심.
    // 'name' 속성을 보고 알아서 'form' 객체의 키를 찾아감
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 4. '우리'가 만든 'handleNext' (handleAnalyze 아님!)
  const handleNext = () => {
    // (TODO) 여기서 폼 필수값 검증 (e.g. form.height === "")
    
    // (TODO) 이전 페이지에서 productSizes, fabric 정보도 받아서
    // 같이 넘겨줘야 BodyCompare_Result가 제대로 작동함!
    navigate("/body-compare/result", {
      state: {
        formData: form,     // 폼 데이터
        category: category, // 상의/하의 구분
        productSizes: location.state.productSizes, // (필요)
        fabric: location.state.fabric,           // (필요)
      },
    });
  };

  // 5. JSX UI를 로직에 맞게 수정해서 사용
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl text-primary mb-6 text-center">체형 정보 입력</h2>
      
      {/* ⭐️  상의/하의 구분 로직 적용 ⭐️ */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* --- 1. 공통 입력 (필수) --- */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">키 (cm) *</label>
          <input
            type="number"
            name="height" // ⭐️ 'name' 속성이 'form'의 키와 일치해야 함
            value={form.height} // ⭐️ measurements.height -> form.height
            onChange={handleChange} // ⭐️ handleInputChange -> handleChange
            placeholder="170"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">몸무게 (kg) *</label>
          <input
            type="number"
            name="weight" // ⭐️ name="weight"
            value={form.weight} // ⭐️ form.weight
            onChange={handleChange} // ⭐️ handleChange
            placeholder="65"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        
        {/* --- 2. 상의 전용 입력 --- */}
        {category === "tops" && (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-2">어깨너비 (cm) *</label>
              <input
                type="number"
                name="shoulder" // ⭐️ name="shoulder"
                value={form.shoulder} // ⭐️ form.shoulder
                onChange={handleChange}
                placeholder="48"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">가슴둘레 (cm) *</label>
              <input
                type="number"
                name="chest" // ⭐️ name="chest"
                value={form.chest} // ⭐️ form.chest
                onChange={handleChange}
                placeholder="95"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">팔 길이 (cm) (선택)</label>
              <input
                type="number"
                name="sleeve"
                value={form.sleeve}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">원하는 총장 (cm) (선택)</label>
              <input
                type="number"
                name="topLength"
                value={form.topLength}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </>
        )}

        {/* --- 3. 하의 전용 입력 --- */}
        {category === "bottoms" && (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-2">허리둘레 (cm) *</label>
              <input
                type="number"
                name="waist" // ⭐️ name="waist"
                value={form.waist} // ⭐️ form.waist
                onChange={handleChange}
                placeholder="80"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">엉덩이둘레 (cm) *</label>
              <input
                type="number"
                name="hip"
                value={form.hip}
                onChange={handleChange}
                placeholder="98"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            {/* ... (허벅지, 하의 총장도 똑같이 추가하면 됨) ... */}
          </>
        )}
      </div>

      {/* --- (이하 팀원 UI 재활용) --- */}
      <p className="text-sm text-gray-500 mt-4 text-center">
        * 표시는 필수 입력 항목입니다
      </p>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800 mb-2">💡 측정 팁</p>
        <ul className="text-xs text-blue-600 space-y-1 ml-4">
          <li>• {category === 'tops' ? '가슴둘레: 겨드랑이 바로 아래 가장 두꺼운 부분' : '허리둘레: 배꼽 위치에서 측정'}</li>
          <li>• {category === 'tops' ? '어깨너비: 양쪽 어깨 끝점 사이의 직선 거리' : '엉덩이둘레: 가장 두꺼운 부분'}</li>
        </ul>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleNext} // ⭐️ handleAnalyze -> handleNext
          // disabled={analyzing} (일단 이 로직은 뺌, 필요하면 [loading, setLoading] state 추가)
          className="w-full max-w-md mt-8 bg-primary hover:bg-accent text-white py-4 rounded-full transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-center"
        >
          {/* (loading state가 없으므로 Analyzing 부분은 일단 제거) */}
          <span className="text-center">AI 사이즈 분석하기</span>
        </button>
      </div>
    </div>
  );
};

export default BodyCompare;