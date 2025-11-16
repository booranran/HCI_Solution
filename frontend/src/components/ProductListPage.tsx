import { useState } from 'react';
import { ArrowLeft, SlidersHorizontal, Star, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import suitImage from '../assets/blazer/blazer1.jpg';
import coatImage from '../assets/coat/coat1.jpg';
import jacketImage from '../assets/jakcet/jacket1.jpg';
import shirtImage from '../assets/shirts/shirts1.jpg';
import dressImage from '../assets/dress/dress1.jpg';
import sweaterImage from '../assets/sweater/sweater1.jpg';
import trenchImage from '../assets/trench/trench1.jpg';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  aiMatch: number;
  badge: string;
  category: string;
  reviewsList?: any[];
  aiReviewSummary?: any;
}

interface ProductListPageProps {
  category: string;
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

export function ProductListPage({ category, onBack, onProductClick }: ProductListPageProps) {
  const [sortBy, setSortBy] = useState('ai-match');
  const [priceRange, setPriceRange] = useState('all');

  const allProducts: Product[] = [
    // 여성 컬렉션
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
      category: '여성 컬렉션',
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
      id: 5,
      name: '실크 블라우스',
      brand: 'Atelier Luxe',
      price: 89000,
      originalPrice: 119000,
      image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGJsb3VzZSUyMGZhc2hpb258ZW58MXx8fHwxNzYzMTEwNzM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviews: 92,
      aiMatch: 94,
      badge: 'SALE',
      category: '여성 컬렉션',
    },
    {
      id: 6,
      name: '케이프 코트',
      brand: 'Parisian Chic',
      price: 249000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNvYXQlMjBmYXNoaW9ufGVufDF8fHx8MTc2MzExMDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      reviews: 67,
      aiMatch: 97,
      badge: 'AI Pick',
      category: '여성 컬렉션',
    },
    {
      id: 7,
      name: '니트 가디건',
      brand: 'Cozy Studio',
      price: 79000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNhcmRpZ2FufGVufDF8fHx8MTc2MzExMDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      reviews: 143,
      aiMatch: 89,
      badge: 'NEW',
      category: '여성 컬렉션',
    },
    {
      id: 8,
      name: '플리츠 스커트',
      brand: 'Feminine Touch',
      price: 69000,
      originalPrice: 89000,
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjMxMTA3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      reviews: 198,
      aiMatch: 91,
      badge: 'SALE',
      category: '여성 컬렉션',
    },
    {
      id: 9,
      name: '울 트렌치 코트',
      brand: 'Classic Lane',
      price: 199000,
      originalPrice: null,
      image: trenchImage,
      rating: 4.9,
      reviews: 87,
      aiMatch: 96,
      badge: 'NEW',
      category: '여성 컬렉션',
    },

    // 남성 컬렉션
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
      category: '남성 컬렉션',
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
      category: '남성 컬렉션',
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
    {
      id: 10,
      name: '옥스포드 셔츠',
      brand: 'Gentleman Style',
      price: 49000,
      originalPrice: null,
      image: shirtImage,
      rating: 4.7,
      reviews: 176,
      aiMatch: 90,
      badge: 'NEW',
      category: '남성 컬렉션',
    },
    {
      id: 11,
      name: '데님 재킷',
      brand: 'Urban Denim',
      price: 129000,
      originalPrice: 169000,
      image: jacketImage,
      rating: 4.8,
      reviews: 134,
      aiMatch: 93,
      badge: 'SALE',
      category: '남성 컬렉션',
    },
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
      category: '남성 컬렉션',
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
      id: 12,
      name: '치노 팬츠',
      brand: 'Classic Fit',
      price: 69000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBwYW50cyUyMGZhc2hpb258ZW58MXx8fHwxNzYzMTEwNzM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      reviews: 211,
      aiMatch: 87,
      badge: 'NEW',
      category: '남성 컬렉션',
    },

    // 액세서리
    {
      id: 13,
      name: '가죽 벨트',
      brand: 'Artisan Leather',
      price: 59000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1624222247344-70e5dc0c7ae0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmVsdHxlbnwxfHx8fDE3NjMxMTA3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviews: 156,
      aiMatch: 92,
      badge: 'NEW',
      category: '액세서리',
    },
    {
      id: 14,
      name: '실크 스카프',
      brand: 'Silk Avenue',
      price: 79000,
      originalPrice: 99000,
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2NhcmZ8ZW58MXx8fHwxNzYzMTEwNzM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      reviews: 98,
      aiMatch: 89,
      badge: 'SALE',
      category: '액세서리',
    },
    {
      id: 15,
      name: '디자이너 핸드백',
      brand: 'Luxe Collection',
      price: 289000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDF8fHx8MTc2MzExMDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      reviews: 76,
      aiMatch: 96,
      badge: 'AI Pick',
      category: '액세서리',
    },
    {
      id: 16,
      name: '스마트워치 밴드',
      brand: 'Tech Style',
      price: 39000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1523395243481-163f8f6155ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMGJhbmR8ZW58MXx8fHwxNzYzMTEwNzM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      reviews: 187,
      aiMatch: 88,
      badge: 'HOT',
      category: '액세서리',
    },
    {
      id: 17,
      name: '선글라스',
      brand: 'Ray Vision',
      price: 149000,
      originalPrice: 199000,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjMxMTA3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviews: 143,
      aiMatch: 94,
      badge: 'SALE',
      category: '액세서리',
    },
    {
      id: 18,
      name: '가죽 지갑',
      brand: 'Wallet Master',
      price: 89000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwd2FsbGV0fGVufDF8fHx8MTc2MzExMDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      reviews: 164,
      aiMatch: 91,
      badge: 'NEW',
      category: '액세서리',
    },
  ];

  // Filter products by category
  const filteredProducts = category === '전체'
    ? allProducts
    : category === '이미지 검색 결과'
    ? allProducts.slice(0, 8) // Show a subset of products as "search results"
    : allProducts.filter(p => p.category === category);

  // Sort products
  let sortedProducts = [...filteredProducts];
  if (sortBy === 'ai-match') {
    sortedProducts.sort((a, b) => b.aiMatch - a.aiMatch);
  } else if (sortBy === 'price-low') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  // Filter by price range
  if (priceRange !== 'all') {
    if (priceRange === 'under-100') {
      sortedProducts = sortedProducts.filter(p => p.price < 100000);
    } else if (priceRange === '100-200') {
      sortedProducts = sortedProducts.filter(p => p.price >= 100000 && p.price < 200000);
    } else if (priceRange === 'over-200') {
      sortedProducts = sortedProducts.filter(p => p.price >= 200000);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>홈으로</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl text-primary mb-4">{category}</h1>
          <p className="text-gray-600">
            {category === '이미지 검색 결과' 
              ? `업로드하신 이미지와 비슷한 ${sortedProducts.length}개의 상품을 찾았습니다`
              : `AI가 분석한 ${sortedProducts.length}개의 상품을 만나보세요`
            }
          </p>
          {category === '이미지 검색 결과' && (
            <div className="mt-4 p-4 bg-accent/10 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-primary mb-1">이미지 분석 완료</p>
                <p className="text-xs text-gray-600">
                  패턴, 색상, 스타일을 분석하여 가장 유사한 상품들을 찾았습니다
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white focus:outline-none focus:border-accent transition-colors"
            >
              <option value="ai-match">AI 매칭순</option>
              <option value="rating">평점순</option>
              <option value="price-low">낮은 가격순</option>
              <option value="price-high">높은 가격순</option>
            </select>
          </div>

          {/* Price Range */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">전체 가격</option>
            <option value="under-100">10만원 이하</option>
            <option value="100-200">10만원 - 20만원</option>
            <option value="over-200">20만원 이상</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
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
                <div
                  className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs tracking-wider ${
                    product.badge === 'AI Pick'
                      ? 'bg-accent text-white'
                      : product.badge === 'SALE'
                      ? 'bg-red-500 text-white'
                      : product.badge === 'HOT'
                      ? 'bg-orange-500 text-white'
                      : 'bg-primary text-white'
                  }`}
                >
                  {product.badge}
                </div>

                {/* AI Match Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs text-primary">{product.aiMatch}%</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  {product.brand}
                </p>
                <h3 className="text-gray-900 mb-3 group-hover:text-accent transition-colors line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-accent text-accent'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg text-gray-900">{product.price.toLocaleString()}원</span>
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
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">해당 조건에 맞는 상품이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}
