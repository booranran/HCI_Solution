import { useState } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import svgPaths from '../imports/svg-0s5keehpt3';

interface AIFittingPageProps {
  onBack: () => void;
}

export function AIFittingPage({ onBack }: AIFittingPageProps) {
  const [step, setStep] = useState(1);
  const [measurements, setMeasurements] = useState({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    shoulder: '',
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFit, setSelectedFit] = useState<'슬림핏' | '레귤러핏' | '세미오버핏' | '오버핏'>('세미오버핏');

  const handleInputChange = (field: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  // 각 핏 타입별 결과를 계산하는 함수
  const calculateFitResult = (fitType: '슬림핏' | '레귤러핏' | '세미오버핏' | '오버핏', baseSize: string) => {
    const fitResults: Record<string, any> = {
      '슬림핏': {
        recommendedSize: baseSize === 'L' ? 'M' : baseSize === 'M' ? 'S' : 'XS',
        measurements: {
          shoulder: { diff: -0.5, status: 'perfect' },
          chest: { diff: -1.2, status: 'perfect' },
          sleeve: { diff: -0.8, status: 'perfect' },
          length: { diff: -1.0, status: 'perfect' },
        },
        fitAnalysis: '슬림핏 기준, 모든 부위가 적정 범위에 있으며 몸에 밀착된 핏을 제공합니다.',
      },
      '레귤러핏': {
        recommendedSize: baseSize,
        measurements: {
          shoulder: { diff: 0.8, status: 'perfect' },
          chest: { diff: 0.3, status: 'perfect' },
          sleeve: { diff: -0.5, status: 'perfect' },
          length: { diff: -0.8, status: 'perfect' },
        },
        fitAnalysis: '레귤러핏 기준, 모든 부위가 표준 범위 내에 있어 편안한 착용감을 제공합니다.',
      },
      '세미오버핏': {
        recommendedSize: baseSize === 'S' ? 'M' : baseSize === 'M' ? 'L' : 'XL',
        measurements: {
          shoulder: { diff: 3.2, status: 'large' },
          chest: { diff: -0.8, status: 'perfect' },
          sleeve: { diff: -1.9, status: 'perfect' },
          length: { diff: -1.9, status: 'perfect' },
        },
        fitAnalysis: '세미오버핏 기준, 어깨는 조금 크지만, 가슴, 소매, 기장이 모두 적정 범위입니다.',
      },
      '오버핏': {
        recommendedSize: baseSize === 'S' ? 'L' : baseSize === 'M' ? 'XL' : 'XXL',
        measurements: {
          shoulder: { diff: 5.5, status: 'large' },
          chest: { diff: 2.8, status: 'good' },
          sleeve: { diff: 1.2, status: 'good' },
          length: { diff: 0.5, status: 'perfect' },
        },
        fitAnalysis: '오버핏 기준, 전체적으로 여유 있는 실루엣을 제공하며 트렌디한 룩을 연출할 수 있습니다.',
      },
    };
    
    return fitResults[fitType];
  };

  const handleFitChange = (fitType: '슬림핏' | '레귤러핏' | '세미오버핏' | '오버핏') => {
    setSelectedFit(fitType);
    if (result) {
      const baseSize = result.baseSize || 'M';
      const newFitResult = calculateFitResult(fitType, baseSize);
      setResult({
        ...result,
        ...newFitResult,
        recommendedFit: fitType,
      });
    }
  };

  const handleAnalyze = async () => {
    if (!measurements.height || !measurements.weight) {
      toast.error('키와 몸무게는 필수 입력 항목입니다');
      return;
    }

    setAnalyzing(true);
    
    // TODO: Replace with actual API call
    // Example API integration structure:
    /*
    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          height: measurements.height,
          weight: measurements.weight,
          chest: measurements.chest,
          waist: measurements.waist,
          shoulder: measurements.shoulder,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      toast.error('분석 중 오류가 발생했습니다');
      setAnalyzing(false);
      return;
    }
    */
    
    // Simulate AI analysis (remove this when implementing real API)
    setTimeout(() => {
      const height = parseInt(measurements.height);
      const weight = parseInt(measurements.weight);
      
      // Simple size recommendation logic for base size
      let baseSize = 'M';
      if (height < 165 && weight < 60) {
        baseSize = 'S';
      } else if (height > 180 && weight > 75) {
        baseSize = 'L';
      }
      
      const fitResult = calculateFitResult(selectedFit, baseSize);
      
      setResult({
        ...fitResult,
        baseSize,
        recommendedFit: selectedFit,
        confidence: 95,
      });
      setAnalyzing(false);
      setStep(2);
      toast.success('AI 분석이 완료되었습니다!');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-accent/5">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>메인으로 돌아가기</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-primary tracking-wide">AI 사이즈 추천</span>
          </div>
          <h1 className="text-4xl text-primary mb-4">완벽한 사이즈 찾기</h1>
          <p className="text-gray-600">간단한 정보 입력으로 내게 맞는 사이즈를 찾아보세요</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center">
            {[1, 2].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step >= num
                      ? 'bg-accent text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step > num ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{num}</span>
                  )}
                </div>
                {num < 2 && (
                  <div
                    className={`w-20 h-1 mx-4 transition-colors ${
                      step > num ? 'bg-accent' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Measurements Input */}
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl text-primary mb-6 text-center">체형 정보 입력</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">키 (cm) *</label>
                <input
                  type="number"
                  value={measurements.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="170"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">몸무게 (kg) *</label>
                <input
                  type="number"
                  value={measurements.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="65"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">가슴둘레 (cm)</label>
                <input
                  type="number"
                  value={measurements.chest}
                  onChange={(e) => handleInputChange('chest', e.target.value)}
                  placeholder="95"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">허리둘레 (cm)</label>
                <input
                  type="number"
                  value={measurements.waist}
                  onChange={(e) => handleInputChange('waist', e.target.value)}
                  placeholder="80"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">어깨너비 (cm)</label>
                <input
                  type="number"
                  value={measurements.shoulder}
                  onChange={(e) => handleInputChange('shoulder', e.target.value)}
                  placeholder="42"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">* 표시는 필수 입력 항목입니다</p>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800 mb-2">💡 측정 팁</p>
              <ul className="text-xs text-blue-600 space-y-1 ml-4">
                <li>• 가슴둘레: 겨드랑이 바로 아래 가장 두꺼운 부분</li>
                <li>• 허리둘레: 배꼽 위치에서 측정</li>
                <li>• 어깨너비: 양쪽 어깨 끝점 사이의 직선 거리</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full max-w-md mt-8 bg-primary hover:bg-accent text-white py-4 rounded-full transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-center"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-center">AI 분석 중...</span>
                  </>
                ) : (
                  <span className="text-center">AI 사이즈 분석하기</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Results with Fit Comparison */}
        {step === 2 && result && (
          <div className="space-y-6">
            {/* Fit Type Selection */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="bg-accent rounded-[18px] p-1 flex justify-stretch gap-1 mb-8 max-w-4xl mx-auto">
                {(['슬림핏', '레귤러핏', '세미오버핏', '오버핏'] as const).map((fit) => (
                  <button
                    key={fit}
                    onClick={() => handleFitChange(fit)}
                    className={`flex-1 py-6 rounded-[15px] transition-all text-center font-bold text-2xl ${
                      fit === selectedFit
                        ? 'bg-white text-accent shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]'
                        : 'bg-transparent text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="block text-center">{fit}</span>
                  </button>
                ))}
              </div>

              {/* Shirt Visualization - T-Shirt with Measurement Circles */}
              <div className="relative max-w-md mx-auto mb-8">
                <svg viewBox="0 0 448 523" className="w-full h-auto">
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="511.788" id="filter0_d_tshirt" width="558.066" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="3.7" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.399395 0 0 0 0 0.399395 0 0 0 0 0.399395 0 0 0 0.25 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_tshirt" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow_tshirt" mode="normal" result="shape" />
                    </filter>
                  </defs>
                  
                  {/* Background layer: Body/Person silhouette (gray) */}
                  <g filter="url(#filter0_d_tshirt)" opacity="0.5" transform="translate(-35, 40) scale(0.9)">
                    <path 
                      d={svgPaths.p12b9ea80}
                      fill="#EFF0F3"
                    />
                    <path 
                      d={svgPaths.p30ed2a00}
                      stroke="#BEBEBE" 
                      strokeWidth="3"
                      fill="none"
                    />
                  </g>
                  
                  {/* Foreground layer: T-shirt outline */}
                  <g transform="translate(23, 90) scale(0.95)" opacity="0.7">
                    <path 
                      d={svgPaths.p1e735c00}
                      fill="#DEE3E3"
                      stroke="#717171"
                      strokeWidth="4"
                      strokeMiterlimit="10"
                    />
                  </g>
                  
                  {/* Measurement highlight circles */}
                  {/* Shoulder - Green circle */}
                  <circle cx="104" cy="149" r="52" fill="#D1FAE5" opacity="0.8" />
                  
                  {/* Chest - Yellow circle */}
                  <circle cx="224" cy="239" r="52" fill="#FEF3C7" opacity="0.8" />
                  
                  {/* Sleeve - Red/Pink circle */}
                  <circle cx="343" cy="209" r="52" fill="#FECACA" opacity="0.8" />
                  
                  {/* Length - Red/Pink circle */}
                  <circle cx="298" cy="388" r="52" fill="#FECACA" opacity="0.8" />
                </svg>

                {/* Measurement Labels */}
                <div className="absolute top-[18%] left-[-5%] bg-green-100 text-green-700 px-3 py-2 rounded-full shadow-md text-sm">
                  어깨 {result.measurements.shoulder.diff > 0 ? '+' : ''}{result.measurements.shoulder.diff}cm
                </div>
                
                <div className="absolute top-[42%] left-[35%] bg-yellow-100 text-yellow-700 px-3 py-2 rounded-full shadow-md text-sm">
                  가슴 {result.measurements.chest.diff > 0 ? '+' : ''}{result.measurements.chest.diff}cm
                </div>
                
                <div className="absolute top-[35%] right-[-8%] bg-red-100 text-red-700 px-3 py-2 rounded-full shadow-md text-sm">
                  소매 {result.measurements.sleeve.diff > 0 ? '+' : ''}{result.measurements.sleeve.diff}cm
                </div>
                
                <div className="absolute bottom-[20%] right-[-5%] bg-red-100 text-red-700 px-3 py-2 rounded-full shadow-md text-sm">
                  기장 {result.measurements.length.diff > 0 ? '+' : ''}{result.measurements.length.diff}cm
                </div>
              </div>

              {/* Main Result */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/20 to-primary/20 px-6 py-3 rounded-full mb-4">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-primary">
                    <span className="text-2xl">{result.recommendedSize}사이즈</span>가 {result.recommendedFit}에 가장 가깝습니다.
                  </span>
                </div>
                
                <p className="text-gray-600 max-w-xl mx-auto">
                  {result.fitAnalysis}
                </p>
              </div>

              {/* Confidence */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-full">
                  <span className="text-sm text-gray-600">AI 정확도</span>
                  <span className="text-xl text-accent">{result.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Detailed Measurements */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl text-primary mb-6">상세 측정 비교</h3>
              <div className="space-y-4">
                {Object.entries(result.measurements).map(([key, data]: [string, any]) => {
                  const labels: { [key: string]: string } = {
                    shoulder: '어깨',
                    chest: '가슴',
                    sleeve: '소매',
                    length: '기장',
                  };
                  
                  return (
                    <div key={key} className="flex items-center gap-4">
                      <div className="w-20 text-sm text-gray-600">{labels[key]}</div>
                      <div className="flex-1">
                        <div className="h-8 bg-gray-100 rounded-full overflow-hidden relative">
                          <div
                            className={`h-full flex items-center justify-center transition-all ${
                              data.status === 'perfect'
                                ? 'bg-gradient-to-r from-green-400 to-green-500'
                                : data.status === 'good'
                                ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                                : 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                            }`}
                            style={{ width: '85%' }}
                          >
                            <span className="text-xs text-white">
                              {data.diff > 0 ? '+' : ''}{data.diff}cm
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            data.status === 'perfect'
                              ? 'bg-green-100 text-green-700'
                              : data.status === 'good'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {data.status === 'perfect' ? '최적' : data.status === 'good' ? '양호' : '여유'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl text-primary mb-4">스타일링 팁</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    {result.recommendedFit}은 편안한 착용감과 트렌디한 실루엣을 동시에 제공합니다
                  </p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    여유로운 핏을 원하시면 한 치수 올리는 것을 추천드립니다
                  </p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    브랜드마다 사이즈 기준이 다를 수 있으니 상품 상세페이지의 실측 정보를 확인하세요
                  </p>
                </div>
              </div>
            </div>

            {/* API Integration Info */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="text-sm text-blue-900 mb-2">🔌 API 연동 준비 완료</h4>
              <p className="text-xs text-blue-700">
                이 페이지는 실제 AI 피팅 API와 연동할 수 있도록 구조화되어 있습니다. 
                AIFittingPage.tsx 파일의 handleAnalyze 함수에서 주석 처리된 API 호출 코드를 확인하세요.
              </p>
            </div>

            <button
              onClick={onBack}
              className="w-full bg-primary hover:bg-accent text-white py-4 rounded-full transition-all hover:shadow-lg text-center"
            >
              <span className="block text-center">쇼핑 시작하기</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
