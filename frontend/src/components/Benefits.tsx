import { X, Clock, RotateCcw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Benefits() {
  const problems = [
    {
      icon: X,
      title: '사이즈 혼란',
      before: '브랜드마다 다른 사이즈 표로 고민',
      after: '정확한 사이즈 추천',
    },
    {
      icon: Clock,
      title: '시간 낭비',
      before: '몇 시간씩 리서치하고 비교',
      after: 'AI가 즉시 분석',
    },
    {
      icon: RotateCcw,
      title: '잦은 반품',
      before: '잘못된 사이즈로 여러 번 반품',
      after: '첫 구매부터 딱 맞는 사이즈',
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl text-primary">왜 Fitory인가요?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            온라인 패션 쇼핑의 가장 큰 고민을 해결합니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Problems Solved */}
          <div className="space-y-6">
            {problems.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-primary mb-3">{problem.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <X className="w-4 h-4 text-red-500" />
                          </div>
                          <p className="text-sm text-gray-500 line-through">{problem.before}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-sm text-primary">{problem.after}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Infographic */}
          <div className="relative">
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-3xl p-8">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1539278383962-a7774385fa02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2hvcHBpbmclMjBvbmxpbmV8ZW58MXx8fHwxNzYzMDM0NDE5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Fashion shopping experience"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Stats Overlay */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                  <p className="text-3xl text-accent mb-1">75%</p>
                  <p className="text-sm text-gray-600">Fewer Returns</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                  <p className="text-3xl text-primary mb-1">10x</p>
                  <p className="text-sm text-gray-600">Faster Shopping</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
