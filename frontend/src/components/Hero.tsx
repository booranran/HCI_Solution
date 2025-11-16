import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sparkles, ShoppingBag, Package } from 'lucide-react';

interface HeroProps {
  onStartAIFitting?: () => void;
}

export function Hero({ onStartAIFitting }: HeroProps) {
  const scrollToProducts = () => {
    const productsSection = document.querySelector('main');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-accent/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-primary tracking-wide">AI 기반 완벽한 핏</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl text-primary leading-tight tracking-tight">
                당신에게 딱 맞는<br />
                <span className="text-accent">완벽한 사이즈</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                더 이상 사이즈 고민하지 마세요.<br />
                AI가 내 체형을 분석해서 모든 브랜드의<br />
                최적 사이즈를 추천해드립니다.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={scrollToProducts}
                className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full transition-all hover:shadow-xl inline-flex items-center gap-2 group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>쇼핑 시작하기</span>
              </button>
              <button
                onClick={scrollToCategories}
                className="bg-white hover:bg-accent hover:text-white text-primary px-10 py-4 rounded-full transition-all border-2 border-gray-200 hover:border-accent inline-flex items-center gap-2 group"
              >
                <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>상품 둘러보기</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="space-y-1">
                <p className="text-2xl text-primary">무료 배송</p>
                <p className="text-xs text-gray-500 tracking-wide">5만원 이상</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl text-primary">30일 반품</p>
                <p className="text-xs text-gray-500 tracking-wide">무료 보장</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl text-primary">98%</p>
                <p className="text-xs text-gray-500 tracking-wide">만족도</p>
              </div>
            </div>
          </div>

          {/* Right Visual - Fashion Model */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5 rounded-3xl blur-3xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1615014326194-db421882a01e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBtb2RlbHxlbnwxfHx8fDE3NjMwNTM5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Fashion Model"
                className="w-full h-auto"
              />
              
              {/* AI Fit Badge */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-5 border border-white/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">AI 사이즈 매칭</p>
                    <p className="text-primary">추천 사이즈: <span className="text-accent">M</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-accent">98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}
