import { useState, useRef } from 'react';
import { X, Upload, Camera, Search, Sparkles } from 'lucide-react';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (imageFile: File) => void;
}

export function ImageSearchModal({ isOpen, onClose, onSearch }: ImageSearchModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setCurrentFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset the input value to allow selecting the same file again
    if (e.target) {
      e.target.value = '';
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

  const handleSearch = async () => {
    if (selectedImage && currentFile) {
      setIsAnalyzing(true);
      
      // Simulate AI analysis (2-3 seconds)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setIsAnalyzing(false);
      onSearch?.(currentFile);
      
      // Reset state
      setSelectedImage(null);
      setCurrentFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl text-primary">이미지로 검색</h2>
            <p className="text-sm text-gray-600 mt-1">
              찾고 싶은 옷 사진을 업로드하세요
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {!selectedImage ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                isDragging
                  ? 'border-accent bg-accent/5'
                  : 'border-gray-300 hover:border-accent/50'
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-gray-50 rounded-full">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg text-gray-700 mb-2">
                    이미지를 드래그하거나 클릭하여 업로드
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG, WEBP 파일 지원 (최대 10MB)
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-8 py-3 bg-primary hover:bg-accent text-white rounded-full transition-all flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>파일 선택</span>
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
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative aspect-video bg-gray-50 rounded-2xl overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setCurrentFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Analyzing State */}
              {isAnalyzing ? (
                <div className="space-y-6 py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full animate-pulse"></div>
                      <Sparkles className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl text-primary mb-2">AI가 이미지를 분석중입니다</h3>
                      <p className="text-sm text-gray-600">비슷한 스타일의 상품을 찾고 있습니다...</p>
                    </div>
                  </div>
                  
                  {/* Loading bars */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>패턴 분석</span>
                        <span>100%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-accent to-primary w-full transition-all duration-1000"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>색상 매칭</span>
                        <span>85%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-accent to-primary w-[85%] transition-all duration-1000"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>스타일 검색</span>
                        <span>92%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-accent to-primary w-[92%] transition-all duration-1000"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 px-6 py-3 border-2 border-gray-200 hover:border-accent text-gray-700 hover:text-accent rounded-full transition-all flex items-center justify-center"
                    >
                      다른 이미지 선택
                    </button>
                    <button
                      onClick={handleSearch}
                      className="flex-1 px-6 py-3 bg-accent hover:bg-primary text-white rounded-full transition-all flex items-center justify-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      <span>검색하기</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">💡 검색 팁</p>
            <ul className="text-xs text-gray-500 space-y-1 ml-4">
              <li>• 옷이 명확하게 보이는 사진을 사용하세요</li>
              <li>• 배경이 단순한 사진일수록 정확도가 높아집니다</li>
              <li>• 여러 각도의 사진을 시도해보세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
