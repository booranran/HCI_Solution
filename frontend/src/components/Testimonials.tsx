import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "김민지",
      role: "패션 블로거",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      quote:
        "Fitory는 제 온라인 쇼핑 경험을 완전히 바꿔놓았어요. 더 이상 사이즈를 추측하거나 반품 걱정을 할 필요가 없어요. AI 추천이 정말 정확해요!",
      rating: 5,
    },
    {
      name: "박준호",
      role: "직장인",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      quote:
        "쇼핑을 싫어하는 저에게 Fitory는 정말 구세주예요. 사이즈를 비교하는 데 시간을 낭비하지 않고도 매번 완벽한 핏을 찾을 수 있어요.",
      rating: 5,
    },
    {
      name: "이서연",
      role: "온라인 쇼퍼",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      quote:
        "가상 피팅 미리보기가 정말 놀라워요! 구매하기 전에 옷이 어떻게 보일지 미리 확인할 수 있어요. 이 기술이야말로 패션의 미래예요.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl text-primary">
            고객 후기
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            완벽한 핏을 찾은 수천 명의 만족한 고객들과 함께하세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-white rounded-2xl px-8 py-6 shadow-md">
            <div>
              <p className="text-2xl text-primary mb-1">
                4.9/5
              </p>
              <p className="text-sm text-gray-500">
                평균 평점
              </p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div>
              <p className="text-2xl text-primary mb-1">12K+</p>
              <p className="text-sm text-gray-500">리뷰</p>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div>
              <p className="text-2xl text-primary mb-1">98%</p>
              <p className="text-sm text-gray-500">
                만족도
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}