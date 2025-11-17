import { useState, useEffect } from 'react'; // ⭐️ useEffect 추가
import { ArrowLeft, SlidersHorizontal, Star, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLocation, useNavigate } from "react-router-dom";

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
}

export function ProductListPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. 카테고리 (문자열)
  const category = location.state?.category || '전체';

  // 2. 상품 데이터 (배열)
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ⭐️ 3. [여기가 문제였음] 정렬 & 필터 상태는 무조건 '문자열'이어야 함!
  const [sortBy, setSortBy] = useState<string>('ai-match'); // ⭐️ <string> 명시
  const [priceRange, setPriceRange] = useState<string>('all'); // ⭐️ <string> 명시

  // 4. 백엔드 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/clothes');
        const data = await response.json();
        
        const formattedProducts = data.items.map((item: any) => ({
          ...item,
          image: `http://localhost:8000/static/${item.image_path}`,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("상품 목록 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 5. allProducts 연결
  const allProducts = products;

  // 6. 카테고리 필터링
  const filteredProducts = category === '전체'
    ? allProducts
    : category === '이미지 검색 결과'
    ? allProducts.slice(0, 8)
    : allProducts.filter(p => p.category === category);

  // 7. 정렬 로직 (이제 sortBy가 string이라서 에러 안 남!)
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

  // 8. 가격 필터 로직 (priceRange도 string이라 에러 안 남!)
  if (priceRange !== 'all') {
    if (priceRange === 'under-100') {
      sortedProducts = sortedProducts.filter(p => p.price < 100000);
    } else if (priceRange === '100-200') {
      sortedProducts = sortedProducts.filter(p => p.price >= 100000 && p.price < 200000);
    } else if (priceRange === 'over-200') {
      sortedProducts = sortedProducts.filter(p => p.price >= 200000);
    }
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleProductClick = (product: Product) => {
    navigate('/product-detail', { state: { product } });
  };

  

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>홈으로</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
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

        <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-accent/30 transition-all duration-500 hover:shadow-xl cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
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
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs text-primary">{product.aiMatch}%</span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  {product.brand}
                </p>
                <h3 className="text-gray-900 mb-3 group-hover:text-accent transition-colors line-clamp-2">
                  {product.name}
                </h3>
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
        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">해당 조건에 맞는 상품이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}