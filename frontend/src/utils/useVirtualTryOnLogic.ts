import { useState, useRef } from "react";
// ... (ArrowLeft, Upload, Camera, X, Sparkles, CheckCircle2) ...
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

export const useVirtualTryOnLogic = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const product = location.state?.product;

  const handleBack = () => {
    navigate(-1);
  };

  if (!product) {
    console.log("No product found in location.state");
  }

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUserImage(dataUrl);
        toast.success("사진이 업로드되었습니다");
        handleTryOn(dataUrl); // ⭐️ handleTryOn은 여기서 호출만 함
      };
      reader.readAsDataURL(file);
    }
  };

  // ... (handleFileChange, handleDragOver, handleDrop 함수들은 그대로 유지) ...
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleTryOn = async (imageData?: string) => {
    const finalUserImage = imageData || userImage;

    // 1. 필수 데이터 확인
    if (!product || !finalUserImage) {
      toast.error("상품 또는 사진 정보가 누락되었습니다.");
      return;
    }

    // 2. base64 문자열을 실제 File 객체로 변환 (fetch를 위해)
    const res = await fetch(finalUserImage);
    const blob = await res.blob();
    const file = new File([blob], "user_image.png", { type: blob.type });

    // 3. FormData 생성 (백엔드 /generate 엔드포인트에 맞춰서)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cloth_id", product.id.toString());

    setProcessing(true); // 로딩 시작

    try {
      // 4. Vertex AI VTO API 호출 (백엔드)
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/generate`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("AI 가상 피팅 서버에서 오류 발생");
      }

      const data = await response.json();
      console.log("🔥 백엔드 응답 데이터:", data);
      console.log("🚀 결과 이미지 URL:", data.result_image);

      // 5. 결과 확인 및 페이지 이동
      const resultImageUrl = data.result_image;

      if (!resultImageUrl) {
        throw new Error("AI가 결과 이미지를 반환하지 않았습니다.");
      }

      console.log("📦 결과 페이지로 보낼 택배 확인:", {
        product: product,
        userImage: finalUserImage, // (여기가 null인지 확인!)
        resultImage: resultImageUrl,
      });

      setProcessing(false); // 로딩 종료

      // 6. 결과 페이지로 이동
      navigate("/tryon/result", {
        state: {
          product: product,
          userImage: finalUserImage,
          resultImage: resultImageUrl,
        },
      });

      toast.success("가상 피팅이 완료되었습니다!");
    } catch (error) {
      setProcessing(false);
      console.error("VTO API Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류 발생";
      toast.error(`가상 피팅 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }; // <--- handleTryOn 함수는 여기서 종료

  // ⭐️⭐️ 최종 반환은 여기서 딱 한 번! ⭐️⭐️
  return {
    product,
    userImage,
    resultImage,
    processing,
    isDragging,
    fileInputRef,
    handleBack,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTryOn, // ⭐️ 함수 자체를 반환
  };
}; // <--- 훅이 여기서 종료
