import { Upload, Brain, Eye } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "체형 데이터 입력",
      description:
        "간편한 인터페이스로 신체 치수를 입력하거나 측정해주세요",
    },
    {
      icon: Brain,
      title: "AI 분석",
      description:
        "입력하신 체형 데이터를 바탕으로 AI가 각 브랜드의 최적 사이즈를 예측합니다",
    },
    {
      icon: Eye,
      title: "핏 프리뷰",
      description:
        "구매 전 가상 피팅 프리뷰로 착용감을 미리 확인하세요",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl text-primary">이용 방법</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            세 가지 간단한 단계로 완벽한 핏을 찾아보세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-primary">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}