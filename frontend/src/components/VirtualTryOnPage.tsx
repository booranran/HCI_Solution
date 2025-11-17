import { useState, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  Camera,
  X,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useVirtualTryOnLogic } from "../utils/useVirtualTryOnLogic"; // ⭐️ 훅 import

export function VirtualTryOnPage() {
  const {
    product,
    userImage,
    processing,
    isDragging,
    fileInputRef,
    handleBack,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useVirtualTryOnLogic();

  // VirtualTryOnPage.tsx

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로가기</span>
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
          <h1 className="text-4xl text-primary mb-4">가상으로 착용해보세요</h1>
          <p className="text-gray-600">회원님의 사진에 상품을 입혀드립니다</p>
        </div>

        {/* Progress Steps (2단계로 단순화) */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              !processing ? "bg-accent text-white" : "bg-gray-100 text-gray-400" // ⭐️ 처리 중이 아니면 1단계 활성
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
              1
            </span>
            <span className="text-sm">사진 업로드</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              processing ? "bg-accent text-white" : "bg-gray-100 text-gray-400" // ⭐️ 처리 중이면 2단계 활성
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
              2
            </span>
            <span className="text-sm">AI 처리 완료</span>
          </div>
        </div>

        {/* Main Content Area (Upload/Processing Logic) */}
        {/* 이 div는 더 이상 step으로 조건부 렌더링되지 않음 */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Product Preview (유지) */}
          <div className="mb-8 text-center">
            <p className="text-sm text-gray-600 mb-4">착용할 상품</p>
            <div className="inline-block">
              <div className="w-32 h-40 rounded-xl overflow-hidden border-2 border-gray-100">
                {/* ⭐️ Hook에서 가져온 product 사용 */}
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-primary mt-2">{product.name}</p>
            </div>
          </div>

          {processing ? (
            // ⭐️ Processing/Loading UI (처리 중일 때)
            <div className="flex flex-col items-center justify-center p-12 h-96 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-xl text-primary mb-2">AI 처리 중...</h2>
              <p className="text-gray-600">
                잠시만 기다려주세요 (약 30초 소요)
              </p>
            </div>
          ) : (
            // ⭐️ Upload UI (처리 중이 아닐 때)
            <div className="border-t pt-8">
              <h2 className="text-xl text-primary mb-4 text-center">
                회원님의 전신 사진을 업로드하세요
              </h2>
              <div
                onDragOver={handleDragOver} // ⭐️ Hook 함수 사용
                onDragLeave={handleDragLeave} // ⭐️ Hook 함수 사용
                onDrop={handleDrop} // ⭐️ Hook 함수 사용
                onClick={() => fileInputRef.current?.click()} // ⭐️ Hook Ref 사용
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  isDragging // ⭐️ Hook State 사용
                    ? "border-accent bg-accent/5"
                    : "border-gray-300 hover:border-accent"
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-6 bg-gray-50 rounded-full">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">사진을 업로드하세요</p>
                    <p className="text-sm text-gray-400">또는 드래그 앤 드롭</p>
                  </div>
                  <button className="mt-2 px-8 py-3 bg-primary hover:bg-accent text-white rounded-full transition-all">
                    파일 선택
                  </button>
                </div>
                <input
                  ref={fileInputRef} // ⭐️ Hook Ref 사용
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange} // ⭐️ Hook 함수 사용
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Guide Tip (유지) */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800 mb-2">📸 사진 촬영 가이드</p>
            <ul className="text-xs text-blue-600 space-y-1 ml-4">
              <li>• 밝은 조명에서 전신이 나오도록 촬영하세요</li>
              <li>• 단색 배경에서 촬영하면 더 정확합니다</li>
              <li>• 정면을 바라보고 팔을 자연스럽게 내려주세요</li>
              <li>• 몸에 밀착된 옷을 입고 촬영하면 더 자연스럽습니다</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
