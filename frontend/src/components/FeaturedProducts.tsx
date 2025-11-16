import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, ShoppingCart, Sparkles, Star } from 'lucide-react';
import { useCart } from './CartContext';
import { toast } from 'sonner';
import suitImage from '../assets/blazer/blazer1.jpg';
import coatImage from '../assets/coat/coat1.jpg';
import dressImage from '../assets/dress/dress1.jpg';
import sweaterImage from '../assets/sweater/sweater1.jpg';

interface FeaturedProductsProps {
  onProductClick?: (product: any) => void;
}

export function FeaturedProducts({ onProductClick }: FeaturedProductsProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name}이(가) 장바구니에 담겼습니다`);
  };
  const products = [
    {
      id: 1,
      name: '프리미엄 울 코트',
      brand: 'Elegant Wear',
      price: 189000,
      originalPrice: 249000,
      image: coatImage,
      rating: 4.8,
      reviews: 124,
      aiMatch: 95,
      badge: 'SALE',
      reviewsList: [
        { id: 1, author: '김**', rating: 5, date: '2024.11.10', size: 'M', height: 170, weight: 65, comment: '겨울에 딱 맞는 코트예요! 따뜻하면서도 무겁지 않고 실루엣이 정말 예쁩니다. AI 추천 사이즈로 주문했는데 완벽해요.', helpful: 56 },
        { id: 2, author: '이**', rating: 5, date: '2024.11.08', size: 'L', height: 178, weight: 75, comment: '프리미엄이라는 이름값을 합니다. 원단도 고급스럽고 디테일이 살아있어요. 가격 대비 너무 만족스러워요!', helpful: 48 },
        { id: 3, author: '박**', rating: 4, date: '2024.11.05', size: 'M', height: 168, weight: 62, comment: '전체적으로 만족합니다. 다만 소매가 살짝 긴 편이에요. 그래도 품질이 좋아서 계속 입고 있어요.', helpful: 32 },
        { id: 4, author: '최**', rating: 5, date: '2024.11.02', size: 'S', height: 162, weight: 52, comment: '세일 기간에 구매했는데 대박이에요! 이 가격에 이런 품질은 찾기 힘들 것 같아요. 강력 추천합니다.', helpful: 41 },
      ],
      aiReviewSummary: {
        overall: '전체 리뷰의 97%가 긍정적이며, 특히 "보온성"과 "실루엣"에 대한 만족도가 높습니다.',
        pros: ['뛰어난 보온성', '우아한 실루엣', '고급스러운 원단', '가성비 우수'],
        cons: ['소매 길이가 긴 편'],
        sizeAccuracy: 96,
      },
    },
    {
      id: 2,
      name: '프리미엄 테일러드 수트',
      brand: 'Maison Elite',
      price: 389000,
      originalPrice: null,
      image: suitImage,
      rating: 4.9,
      reviews: 89,
      aiMatch: 98,
      badge: 'AI Pick',
      reviewsList: [
        { id: 1, author: '정**', rating: 5, date: '2024.11.12', size: 'M', height: 175, weight: 70, comment: '비즈니스 미팅에 입고 갔는데 칭찬 엄청 받았어요. 핏이 정말 완벽합니다. AI 피팅 추천이 신기할 정도로 정확해요!', helpful: 72 },
        { id: 2, author: '한**', rating: 5, date: '2024.11.09', size: 'L', height: 180, weight: 78, comment: '맞춤 수트인가 싶을 정도로 몸에 딱 맞아요. 테일러링이 정말 훌륭합니다. 투자할 가치 충분해요.', helpful: 65 },
        { id: 3, author: '안**', rating: 5, date: '2024.11.06', size: 'M', height: 172, weight: 68, comment: '처음 AI 피팅 써봤는데 대박입니다. 사이즈 걱정 없이 온라인으로 수트 살 수 있다니! 품질도 최고예요.', helpful: 58 },
        { id: 4, author: '송**', rating: 4, date: '2024.11.03', size: 'S', height: 168, weight: 60, comment: '전반적으로 만족하지만 가격이 조금 부담스러워요. 하지만 품질을 생각하면 합리적인 가격인 것 같아요.', helpful: 43 },
      ],
      aiReviewSummary: {
        overall: '전체 리뷰의 98%가 긍정적이며, 특히 "완벽한 핏"과 "테일러링 품질"에 대한 찬사가 많습니다.',
        pros: ['완벽한 맞춤 핏', '뛰어난 테일러링', '비즈니스에 적합', '높은 AI 매칭 정확도'],
        cons: ['다소 높은 가격대'],
        sizeAccuracy: 99,
      },
    },
    {
      id: 3,
      name: '엘레강스 드레스',
      brand: 'Chic Collection',
      price: 129000,
      originalPrice: null,
      image: dressImage,
      rating: 4.7,
      reviews: 156,
      aiMatch: 92,
      badge: 'NEW',
      reviewsList: [
        { id: 1, author: '윤**', rating: 5, date: '2024.11.11', size: 'M', height: 165, weight: 55, comment: '결혼식 하객 룩으로 구매했어요. 디자인이 우아하면서도 과하지 않아서 완벽했습니다. 사이즈도 딱이에요!', helpful: 68 },
        { id: 2, author: '장**', rating: 4, date: '2024.11.09', size: 'S', height: 160, weight: 50, comment: '예쁜데 생각보다 길이가 좀 길어요. 그래도 원단이 고급스럽고 착용감이 좋아요. 다음에 또 구매할 의향 있어요.', helpful: 52 },
        { id: 3, author: '서**', rating: 5, date: '2024.11.07', size: 'L', height: 170, weight: 62, comment: '데이트 룩으로 최고예요! 남자친구가 너무 예쁘다고 칭찬 많이 했어요. AI 추천 받고 샀는데 신세계네요.', helpful: 61 },
        { id: 4, author: '임**', rating: 5, date: '2024.11.04', size: 'M', height: 167, weight: 58, comment: '직장에서도 입을 수 있을 만큼 단정하면서도 여성스러워요. 이 가격대에 이런 퀄리티면 정말 좋은 거 같아요.', helpful: 45 },
      ],
      aiReviewSummary: {
        overall: '전체 리뷰의 94%가 긍정적이며, 특히 "우아한 디자인"과 "다양한 활용도"가 높은 평가를 받습니다.',
        pros: ['우아한 디자인', '다양한 활용 가능', '고급스러운 원단', '합리적인 가격'],
        cons: ['일부 길이가 긴 편'],
        sizeAccuracy: 93,
      },
    },
    {
      id: 4,
      name: '캐주얼 스웨터',
      brand: 'Comfort Zone',
      price: 59000,
      originalPrice: 79000,
      image: sweaterImage,
      rating: 4.6,
      reviews: 203,
      aiMatch: 88,
      badge: 'SALE',
      reviewsList: [
        { id: 1, author: '강**', rating: 5, date: '2024.11.13', size: 'L', height: 178, weight: 72, comment: '편하면서도 스타일리시해요. 데일리로 자주 입고 있어요. 세탁도 잘 되고 관리가 편해서 좋아요!', helpful: 89 },
        { id: 2, author: '조**', rating: 4, date: '2024.11.10', size: 'M', height: 170, weight: 65, comment: '가격 대비 만족스러워요. 다만 색상이 사진보다 살짝 연한 느낌이에요. 그래도 따뜻하고 편해서 만족합니다.', helpful: 74 },
        { id: 3, author: '배**', rating: 5, date: '2024.11.08', size: 'XL', height: 182, weight: 85, comment: '빅사이즈도 핏이 좋아요! AI 추천 믿고 샀는데 역시 정확하네요. 편안한 착용감 최고입니다.', helpful: 67 },
        { id: 4, author: '유**', rating: 4, date: '2024.11.05', size: 'S', height: 165, weight: 58, comment: '편하고 활동하기 좋아요. 주말에 가볍게 입기 딱 좋습니다. 세일가로 구매해서 더 만족스러워요!', helpful: 55 },
      ],
      aiReviewSummary: {
        overall: '전체 리뷰의 92%가 긍정적이며, 특히 "편안한 착용감"과 "활용도"에 대한 만족도가 높습니다.',
        pros: ['편안한 착용감', '데일리 활용도 높음', '관리가 쉬움', '뛰어난 가성비'],
        cons: ['사진과 색상 차이', '빠른 품절'],
        sizeAccuracy: 91,
      },
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent uppercase tracking-wider mb-2">신상품</p>
          <h2 className="text-4xl text-primary mb-3">엄선된 컬렉션</h2>
          <p className="text-gray-600">AI가 당신의 체형에 완벽하게 맞는 스타일을 제안합니다</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductClick?.(product)}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-accent/30 transition-all duration-500 hover:shadow-xl cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs tracking-wider ${
                  product.badge === 'AI Pick' ? 'bg-accent text-white' :
                  product.badge === 'SALE' ? 'bg-red-500 text-white' :
                  'bg-primary text-white'
                }`}>
                  {product.badge}
                </div>

                {/* AI Match Score */}
                {product.aiMatch >= 90 && (
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span className="text-primary tracking-wide">{product.aiMatch}%</span>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-accent hover:text-white transition-all transform hover:scale-110">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.brand}</p>
                <h3 className="text-base text-primary mb-3 line-clamp-1">{product.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    <span className="text-sm text-primary">{product.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xl text-primary">{product.price.toLocaleString()}원</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                      <span className="text-xs text-red-500 ml-auto">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full bg-primary hover:bg-accent text-white py-3 rounded-full transition-all hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                >
                  <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  <span>장바구니 담기</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-16">
          <button className="bg-white border-2 border-primary hover:bg-primary hover:text-white text-primary px-12 py-4 rounded-full transition-all hover:shadow-lg">
            전체 컬렉션 보기
          </button>
        </div>
      </div>
    </section>
  );
}
