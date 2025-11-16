import { useState, useRef } from 'react';
import { ArrowLeft, Upload, Camera, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface VirtualTryOnPageProps {
  product: any;
  onBack: () => void;
}

export function VirtualTryOnPage({ product, onBack }: VirtualTryOnPageProps) {
  const [step, setStep] = useState(1);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
        toast.success('사진이 업로드되었습니다');
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleTryOn = async () => {
    setProcessing(true);
    
    // TODO: Replace with actual Virtual Try-On API call
    // Example API integration structure:
    /*
    try {
      const formData = new FormData();
      if (fileInputRef.current?.files?.[0]) {
        formData.append('user_image', fileInputRef.current.files[0]);
      }
      formData.append('product_image', product.image);
      formData.append('product_id', product.id);

      const response = await fetch('YOUR_VIRTUAL_TRYON_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Virtual Try-On API failed');
      }

      const data = await response.json();
      setResultImage(data.result_image_url);
      setStep(3);
      toast.success('가상 피팅이 완료되었습니다!');
    } catch (error) {
      toast.error('가상 피팅 중 오류가 발생했습니다');
      setProcessing(false);
      return;
    }
    */

    // Simulate processing (remove this when implementing real API)
    setTimeout(() => {
      // For demo, use the user's image as result
      setResultImage(userImage);
      setProcessing(false);
      setStep(3);
      toast.success('가상 피팅이 완료되었습니다!');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <button
            onClick={onBack}
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
          <p className="text-gray-600">
            회원님의 사진에 상품을 입혀드립니다
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              step >= 1 ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'
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
              step >= 2 ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
              2
            </span>
            <span className="text-sm">AI 처리</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              step >= 3 ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
              3
            </span>
            <span className="text-sm">결과 확인</span>
          </div>
        </div>

        {/* Step 1: Upload Photo */}
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Product Preview */}
            <div className="mb-8 text-center">
              <p className="text-sm text-gray-600 mb-4">착용할 상품</p>
              <div className="inline-block">
                <div className="w-32 h-40 rounded-xl overflow-hidden border-2 border-gray-100">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-primary mt-2">{product.name}</p>
              </div>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl text-primary mb-4 text-center">
                회원님의 전신 사진을 업로드하세요
              </h2>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-300 hover:border-accent'
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
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

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
        )}

        {/* Step 2: Preview & Process */}
        {step === 2 && userImage && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl text-primary mb-6 text-center">
              가상 피팅 준비 완료
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* User Image */}
              <div>
                <p className="text-sm text-gray-600 mb-3 text-center">회원님의 사진</p>
                <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden">
                  <img
                    src={userImage}
                    alt="User"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => {
                      setUserImage(null);
                      setStep(1);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Product Image */}
              <div>
                <p className="text-sm text-gray-600 mb-3 text-center">착용할 상품</p>
                <div className="aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6 text-green-600 bg-green-50 py-3 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm">사진이 준비되었습니다</span>
            </div>

            <button
              onClick={handleTryOn}
              disabled={processing}
              className="w-full bg-primary hover:bg-accent text-white py-4 rounded-full transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>AI 처리 중... (30초 소요)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>가상 피팅 시작하기</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && resultImage && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-3xl p-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm mb-6">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-sm text-primary">AI 처리 완료</span>
              </div>
              <h2 className="text-3xl text-primary mb-2">가상 피팅 결과</h2>
              <p className="text-gray-600">AI가 상품을 착용시켰습니다</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Before */}
                <div>
                  <p className="text-sm text-gray-600 mb-3 text-center">원본</p>
                  <div className="aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden">
                    <img
                      src={userImage!}
                      alt="Before"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* After */}
                <div>
                  <p className="text-sm text-gray-600 mb-3 text-center">가상 피팅 결과</p>
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
                  💡 이 결과는 AI 기술을 통해 생성된 시뮬레이션입니다. 
                  실제 착용 모습과 다를 수 있습니다.
                </p>
              </div>
            </div>

            {/* API Integration Info */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="text-sm text-blue-900 mb-2">🔌 API 연동 준비 완료</h4>
              <p className="text-xs text-blue-700">
                이 페이지는 실제 Virtual Try-On API와 연동할 수 있도록 구조화되어 있습니다. 
                VirtualTryOnPage.tsx 파일의 handleTryOn 함수에서 주석 처리된 API 호출 코드를 확인하세요.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setStep(1);
                  setUserImage(null);
                  setResultImage(null);
                }}
                className="bg-white hover:bg-gray-100 text-primary py-4 rounded-full border-2 border-gray-200 transition-all text-center"
              >
                다시 시도하기
              </button>
              <button
                onClick={onBack}
                className="bg-primary hover:bg-accent text-white py-4 rounded-full transition-all hover:shadow-lg text-center"
              >
                상품 페이지로
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
