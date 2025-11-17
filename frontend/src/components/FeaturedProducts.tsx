import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, ShoppingCart, Sparkles, Star } from 'lucide-react';
import { useCart } from './CartContext';
import { toast } from 'sonner';

interface FeaturedProductsProps {
  onProductClick?: (product: any) => void;
}

export function FeaturedProducts({ onProductClick }: FeaturedProductsProps) {
  const { addToCart } = useCart();

  // ⭐️ 1. 데이터를 담을 State 만들기 (하드코딩 삭제)
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ⭐️ 2. 백엔드에서 데이터 가져오기 (Fetch)
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/clothes');
        const data = await response.json();
        
        // ⭐️ 중요: 이미지 경로 수정 + 4개만 자르기 (Featured니까)
        const formattedProducts = data.items
          .slice(0, 4) // 상위 4개만 보여줌
          .map((item: any) => ({
            ...item,
            // 백엔드 이미지 경로를 URL로 변환
            image: `http://localhost:8000/static/${item.image_path}`,
          }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("추천 상품 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

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

  if (loading) return <div className="py-20 text-center">로딩 중...</div>;

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
                {/* (백엔드 JSON에 aiMatch가 있다면 보여줌) */}
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
                  <span className="text-xl text-primary">{Number(product.price).toLocaleString()}원</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        {Number(product.originalPrice).toLocaleString()}원
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