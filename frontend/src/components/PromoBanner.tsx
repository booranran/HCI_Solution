import { Sparkles, Tag, Truck } from 'lucide-react';

export function PromoBanner() {
  const promos = [
    {
      icon: Tag,
      title: '신규 회원 할인',
      description: '첫 구매 시 20% 할인',
      color: 'from-accent/20 to-accent/5',
    },
    {
      icon: Truck,
      title: '무료 배송',
      description: '5만원 이상 구매 시',
      color: 'from-primary/20 to-primary/5',
    },
    {
      icon: Sparkles,
      title: 'AI 피팅 무료',
      description: '완벽한 사이즈 추천',
      color: 'from-accent/20 to-accent/5',
    },
  ];

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {promos.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${promo.color} rounded-2xl p-6 border border-gray-100`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg text-primary mb-1">{promo.title}</h3>
                    <p className="text-sm text-gray-600">{promo.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
