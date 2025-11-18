import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
// 💡 ImageWithFallback 컴포넌트의 경로를 확인하고 import하세요.
// import { ImageWithFallback } from './figma/ImageWithFallback';

// Note: Product 타입은 실제 파일에서 import해야 함
// interface Product { ... }

export default function VirtualTryOnResult() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. VirtualTryOnPage에서 넘겨준 데이터를 location.state에서 받음
  const product = location.state?.product;
  const userImage = location.state?.userImage;
  const resultImage = location.state?.resultImage;

  // 2. 액션 핸들러 정의
  const handleBackToProduct = () => {
    // 상품 상세 페이지로 돌아감
    navigate(-1);
  };

  const handleBackToChooseProduct = () => {
    navigate("/product-detail", {
      state: { product: product }, // ⭐️ 상세 페이지가 렌더링될 때 필요한 '상품 정보'를 다시 넘겨줘야 해
    });
  };

  const handleRetry = () => {
    navigate("/virtual-tryon", {
      state: {
        product: product,
        // ⭐️ 원본 이미지도 넘겨서, 로딩 후 혹시라도 null이 되는 것을 방지
        userImage: userImage,
      },
    });
  };
  // 데이터 누락 시 예외 처리
  if (!product || !userImage || !resultImage) {
    return (
      <div className="min-h-screen bg-white p-12 text-center">
        <h2 className="text-xl text-red-600 mb-4">
          가상 피팅 결과를 불러올 수 없습니다.
        </h2>
        <p className="text-gray-600 mb-6">
          다시 시도하거나 상품 페이지로 돌아가세요.
        </p>
        <button
          onClick={handleBackToProduct}
          className="text-blue-600 hover:underline"
        >
          상품 페이지로 돌아가기
        </button>
      </div>
    );
  }

  // 3. 렌더링
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <button
            onClick={handleBackToProduct}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>상품 페이지로</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-5 py-2.5 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm text-accent">AI 가상 피팅</span>
          </div>
          <h1 className="text-4xl text-primary mb-4">가상 피팅 결과</h1>
          <p className="text-gray-600">
            {product.name} 상품의 착용 결과를 확인하세요
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Before */}
              <div>
                <p className="text-sm text-gray-600 mb-3 text-center">원본</p>
                <div className="aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden">
                  <img
                    src={userImage}
                    alt="Before"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* After */}
              <div>
                <p className="text-sm text-gray-600 mb-3 text-center">
                  가상 피팅 결과
                </p>
                <div className="aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border-2 border-accent">
                  <img
                    src={resultImage}
                    alt="After"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-accent/10 rounded-xl text-center">
              <p className="text-sm text-primary">
                💡 이 결과는 AI 기술을 통해 생성된 시뮬레이션입니다. 실제 착용
                모습과 다를 수 있습니다.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleRetry}
              className="bg-white hover:bg-gray-100 text-primary py-4 rounded-full border-2 border-gray-200 transition-all text-center"
            >
              다시 시도하기
            </button>
            <button
              onClick={handleBackToChooseProduct}
              className="bg-primary hover:bg-accent text-white py-4 rounded-full transition-all hover:shadow-lg text-center"
            >
              상품 페이지로
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
