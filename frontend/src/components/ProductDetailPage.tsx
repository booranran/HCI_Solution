import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Star,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Ruler,
  Shirt,
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
  Image,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { ImageSearchModal } from "../components/ImageSearchModal";
import { CartSheet } from "../components/CartSheet";
import { set } from "react-hook-form";

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  size: string;
  height: number;
  weight: number;
  comment: string;
  helpful: number;
}

interface AiSummary {
  overall: string;
  pros: string[];
  cons: string[];
  sizeAccuracy: number;
}

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
  reviewsList?: Review[];
  aiReviewSummary?: AiSummary;
  category: string;
  fit_type: string;
}

export function ProductDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showAISummary, setShowAISummary] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const { addToCart, cartItems } = useCart();
  const [imageSearchOpen, setImageSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const product = location.state?.product;

  const handleBack = () => {
    navigate(-1); // "그냥 뒤로 한 칸 가기"
  };

  const handleBackToList = () => {
    // ⭐️ 1. 주소는 '/products'
    // ⭐️ 2. 'category'라는 이름표에 'product.category' 값을 담아서 보냄
    navigate('/products', { 
      state: { category: product.category } 
    });
  };
  
  /** ⭐️ 'AI 사이즈 추천' 버튼을 눌렀을 때 실행할 함수 */
  const handleStartAIFitting = () => {
    // 1. 사이즈 정보 (유지)
    if (!product.measurements) {
      toast.error("사이즈 정보가 없습니다.");
      return;
    }
    const productSizes = product.measurements;

    // ⭐️ 2. 카테고리 (추측 로직 삭제 -> fit_type 사용)
    // JSON에 fit_type이 있으면 그걸 쓰고, 없으면 기본값 'tops'
    const fitType = product.fit_type === "bottoms" ? "bottoms" : "tops";

    // 3. 원단 (유지)
    const fabric = product.fabric || "cotton";

    // 4. 이동 (유지)
    navigate("/body-compare", {
      state: {
        productSizes: productSizes,
        category: fitType, // 'tops' or 'bottoms'가 정확하게 들어감
        fabric: fabric,
      },
    });
  };

  const handleOpenImageSearch = () => {
    setImageSearchOpen(true);
  };

  const handleImageSearch = (imageFile: File) => {
    setImageSearchOpen(false); // 모달 닫고
    navigate("/products", { state: { category: "이미지 검색 결과" } }); // 이동
  };

  const handleOpenCart = () => {
    setCartOpen(true);
  };

  // ... (handleBack, handleStartAIFitting 함수) ...

  /** ⭐️ '가상 피팅 체험' 버튼을 눌렀을 때 실행할 함수 */
  const handleStartVirtualTryOn = () => {
    // '/virtual-tryon' 페이지로 '이동'하면서 'product' 데이터를 싣기
    navigate("/virtual-tryon", {
      state: {
        product: product, // ⭐️ 가상 피팅 페이지에 이 상품 정보를 넘겨줌
      },
    });
  };

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  const sizes = ["XS", "S", "M", "L", "XL"];

  // ✅ [추가] 백엔드 데이터(JSON)를 사용해서 이미지 목록 만들기
  // (만약 JSON에 detail_images가 없으면, 그냥 메인 이미지를 1개 보여주는 '안전 장치' 포함)
  const productImages =
    product.detail_images && product.detail_images.length > 0
      ? product.detail_images.map((img: any) => ({
          url: `http://localhost:8000/static/${img.path}`, // ⭐️ 백엔드 주소 조립
          type: img.type,
          alt: img.alt,
        }))
      : [
          // 데이터가 없을 때 보여줄 기본값 (메인 이미지)
          {
            url:
              product.image || "http://localhost:8000/static/placeholder.jpg",
            type: "product",
            alt: "상품 이미지",
          },
        ];

  // Size specifications table
  const sizeSpecs = {
    XS: { chest: 86, shoulder: 38, length: 64, sleeve: 58 },
    S: { chest: 92, shoulder: 40, length: 66, sleeve: 60 },
    M: { chest: 98, shoulder: 42, length: 68, sleeve: 62 },
    L: { chest: 104, shoulder: 44, length: 70, sleeve: 64 },
    XL: { chest: 110, shoulder: 46, length: 72, sleeve: 66 },
  };

  // Use product-specific reviews if available, otherwise use default
  const reviews: Review[] = product.reviewsList || [];
  const aiSummary: AiSummary = product.aiReviewSummary || {
    overall:
      '전체 리뷰의 95%가 긍정적이며, 특히 "사이즈 정확도"와 "품질"에 대한 만족도가 높습니다.',
    pros: [
      "정확한 사이즈 매칭",
      "우수한 원단 품질",
      "세련된 디자인",
      "빠른 배송",
    ],
    cons: ["일부 배송 지연 발생"],
    sizeAccuracy: 98,
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("사이즈를 선택해주세요");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
      });
    }

    toast.success(`${product.name}이(가) 장바구니에 담겼습니다`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("사이즈를 선택해주세요");
      return;
    }

    handleAddToCart();
    toast.success("주문이 완료되었습니다!");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button */}
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">상품 목록으로</span>
            </button>

            {/* Right Side: Search & Cart */}
            <div className="flex items-center gap-2">
              {searchExpanded ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="상품, 브랜드 검색..."
                      className="w-64 pl-11 pr-4 py-2.5 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:border-accent focus:bg-white transition-all text-sm"
                      autoFocus
                      onBlur={() => {
                        // Delay to allow button clicks to register
                        setTimeout(() => setSearchExpanded(false), 200);
                      }}
                    />
                  </div>
                  <button
                    onMouseDown={(e: React.MouseEvent) => {
                      e.preventDefault(); // (이건 좋은 코드니까 냅두자)

                      // ⭐️ 1. '유령' 대신 '진짜' state 변경 함수 호출
                      setImageSearchOpen(true);

                      // ⭐️ 2. (setSearchExpanded는 아마 없으니 일단 주석 처리)
                      // setSearchExpanded(false);
                    }}
                    className="p-2.5 bg-gray-50 hover:bg-accent/10 rounded-full border border-gray-200 hover:border-accent transition-all group"
                    title="이미지로 검색"
                  >
                    <Image className="w-5 h-5 text-gray-600 group-hover:text-accent transition-colors" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchExpanded(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="검색"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
              )}

              {/* Cart Button */}

              <button
                onClick={handleOpenCart}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="장바구니"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Product Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-50 aspect-[3/4] group">
              <ImageWithFallback
                src={productImages[selectedImage].url}
                alt={productImages[selectedImage].alt}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full text-sm tracking-wide">
                  {product.badge}
                </div>
              )}
              {/* Image type indicator */}
              <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs">
                {productImages[selectedImage].alt}
              </div>

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? productImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="이전 이미지"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === productImages.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="다음 이미지"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs">
                    {selectedImage + 1} / {productImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {productImages?.map((img:any, index:any) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-xl overflow-hidden aspect-[3/4] bg-gray-50 transition-all ${
                    selectedImage === index
                      ? "ring-2 ring-accent"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <ImageWithFallback
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info & Order Panel */}
          <div className="space-y-8">
            {/* Product Info */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm text-primary">
                  AI 매칭도 {product.aiMatch}%
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                <h1 className="text-3xl text-primary mb-4">{product.name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-accent text-accent"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} 리뷰)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <span className="text-3xl text-primary">
                  {product.price.toLocaleString()}원
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {product.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full">
                      {Math.round(
                        (1 - product.price / product.originalPrice) * 100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Order Panel */}
            <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
              {/* AI Fitting Buttons */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm text-primary">AI 피팅 서비스</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleStartAIFitting}
                    className="bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white py-3 px-4 rounded-xl transition-all flex flex-col items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Ruler className="w-5 h-5" />
                    <span className="text-xs">AI 사이즈 추천</span>
                  </button>
                  <button
                    onClick={handleStartVirtualTryOn}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white py-3 px-4 rounded-xl transition-all flex flex-col items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Shirt className="w-5 h-5" />
                    <span className="text-xs">가상 피팅 체험</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  AI로 내 체형에 맞는 사이즈를 추천받거나 직접 착용해보세요
                </p>
              </div>

              {/* Size Selection */}
              <div className="pt-4 border-t">
                <label className="block text-sm text-gray-600 mb-3">
                  사이즈 선택
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-xl border-2 transition-all flex items-center justify-center ${
                        selectedSize === size
                          ? "border-accent bg-accent text-white"
                          : "border-gray-200 bg-white hover:border-accent"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <div className="mt-3 p-3 bg-accent/10 rounded-xl flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-primary">
                      AI 추천 사이즈입니다. 98%의 고객이 만족했어요!
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm text-gray-600 mb-3">수량</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 hover:border-accent transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 hover:border-accent transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-primary hover:bg-accent text-white py-4 rounded-full transition-all hover:shadow-lg text-center"
                >
                  바로 구매
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="bg-white hover:bg-gray-100 text-primary py-4 rounded-full border-2 border-gray-200 transition-all text-center"
                  >
                    장바구니
                  </button>
                  <button className="bg-white hover:bg-gray-100 text-primary py-4 rounded-full border-2 border-gray-200 transition-all flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span>찜하기</span>
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="text-gray-600">총 상품 금액</span>
                <span className="text-2xl text-primary">
                  {(product.price * quantity).toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">배송비</span>
                <span className="text-accent">무료</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">배송 기간</span>
                <span className="text-primary">1-2일 (영업일 기준)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 border-t pt-12">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-4 px-6 transition-all relative ${
                activeTab === "description"
                  ? "text-accent"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>상품 설명</span>
              {activeTab === "description" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("size")}
              className={`pb-4 px-6 transition-all relative ${
                activeTab === "size"
                  ? "text-accent"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>사이즈 정보</span>
              {activeTab === "size" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`pb-4 px-6 transition-all relative ${
                activeTab === "delivery"
                  ? "text-accent"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>배송/반품</span>
              {activeTab === "delivery" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-2xl text-primary mb-4">제품 상세</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {product.name}은(는) 최고급 원단과 정교한 봉제 기술로
                    제작되었습니다. 일상 속에서도 편안함과 스타일을 동시에
                    추구하는 현대인을 위한 디자인으로, 어떤 상황에서도 당신의
                    개성을 돋보이게 합니다.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>
                        프리미엄 소재를 사용하여 부드러운 착용감과 내구성을
                        보장합니다
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>
                        세련된 실루엣으로 다양한 스타일링이 가능합니다
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>정밀한 패턴 설계로 완벽한 핏을 제공합니다</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>모든 계절에 활용 가능한 실용적인 아이템입니다</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mt-8">
                  <h4 className="text-primary mb-4">소재 및 관리</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <p className="text-gray-500 mb-1">소재</p>
                      <p>면 80%, 폴리에스터 20%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">세탁 방법</p>
                      <p>찬물 손세탁 권장, 드라이클리닝 가능</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">원산지</p>
                      <p>대한민국</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">제조사</p>
                      <p>{product.brand}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Size Tab */}
            {activeTab === "size" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl text-primary mb-4">사이즈 가이드</h3>
                  <p className="text-gray-600 mb-6">
                    모든 치수는 cm 단위이며, 제품에 따라 ±1~2cm의 오차가 있을 수
                    있습니다.
                  </p>
                </div>

                {/* Size Chart */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-4 text-left text-primary border-b-2 border-gray-200">
                          사이즈
                        </th>
                        <th className="px-6 py-4 text-center text-primary border-b-2 border-gray-200">
                          가슴둘레
                        </th>
                        <th className="px-6 py-4 text-center text-primary border-b-2 border-gray-200">
                          어깨너비
                        </th>
                        <th className="px-6 py-4 text-center text-primary border-b-2 border-gray-200">
                          총장
                        </th>
                        <th className="px-6 py-4 text-center text-primary border-b-2 border-gray-200">
                          소매길이
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(sizeSpecs).map(([size, specs]) => (
                        <tr
                          key={size}
                          className={`hover:bg-gray-50 transition-colors ${
                            selectedSize === size ? "bg-accent/10" : ""
                          }`}
                        >
                          <td className="px-6 py-4 border-b border-gray-200">
                            <span
                              className={`${
                                selectedSize === size
                                  ? "text-accent"
                                  : "text-primary"
                              }`}
                            >
                              {size}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-gray-700 border-b border-gray-200">
                            {specs.chest}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-700 border-b border-gray-200">
                            {specs.shoulder}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-700 border-b border-gray-200">
                            {specs.length}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-700 border-b border-gray-200">
                            {specs.sleeve}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Measurement Guide */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h4 className="text-primary mb-4">측정 방법</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 text-xs">
                        1
                      </div>
                      <div>
                        <p className="text-primary mb-1">가슴둘레</p>
                        <p className="text-gray-600">
                          겨드랑이 아래 가장 넓은 부분
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 text-xs">
                        2
                      </div>
                      <div>
                        <p className="text-primary mb-1">어깨너비</p>
                        <p className="text-gray-600">
                          양쪽 어깨 끝점 사이의 거리
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 text-xs">
                        3
                      </div>
                      <div>
                        <p className="text-primary mb-1">총장</p>
                        <p className="text-gray-600">
                          뒷목 중심부터 밑단까지의 길이
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 text-xs">
                        4
                      </div>
                      <div>
                        <p className="text-primary mb-1">소매길이</p>
                        <p className="text-gray-600">
                          어깨 끝에서 소매 끝까지의 길이
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Size Recommendation CTA */}
                <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-6 text-center">
                  <Sparkles className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h4 className="text-primary mb-2">사이즈가 고민되시나요?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    AI가 회원님의 체형을 분석하여 최적의 사이즈를 추천해드립니다
                  </p>
                  <button
                    onClick={handleStartAIFitting}
                    className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-full transition-all inline-flex items-center gap-2"
                  >
                    <Ruler className="w-5 h-5" />
                    <span>AI 사이즈 추천받기</span>
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Tab */}
            {activeTab === "delivery" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl text-primary mb-6">배송 정보</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-accent">🚚</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-primary mb-1">배송비</h4>
                        <p className="text-sm text-gray-600">
                          5만원 이상 구매 시 무료배송 (5만원 미만 시 3,000원)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-accent">⏱️</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-primary mb-1">배송 기간</h4>
                        <p className="text-sm text-gray-600">
                          주문 후 평균 2-3일 소요 (영업일 기준)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-accent">📦</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-primary mb-1">배송 방법</h4>
                        <p className="text-sm text-gray-600">
                          CJ대한통운, 로젠택배 등 (배송사 선택 불가)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-8">
                  <h3 className="text-2xl text-primary mb-6">반품/교환 정보</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                      <h4 className="text-primary mb-3 flex items-center gap-2">
                        <span>✓</span>
                        <span>무료 반품/교환</span>
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• 상품 수령 후 30일 이내 무료 반품/교환 가능</li>
                        <li>• 제품 하자나 오배송의 경우 왕복 배송비 무료</li>
                        <li>• 단순 변심의 경우에도 첫 반품은 무료</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-primary mb-3">반품/교환 불가 사항</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• 상품 택이 제거되었거나 상품이 훼손된 경우</li>
                        <li>• 착용 또는 세탁한 흔적이 있는 경우</li>
                        <li>• 고객 부주의로 인한 오염이나 파손이 있는 경우</li>
                        <li>• 반품 가능 기간(30일)이 경과한 경우</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                      <h4 className="text-primary mb-3">반품 절차</h4>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex-1 text-center">
                          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                            1
                          </div>
                          <p className="text-gray-700">
                            마이페이지에서
                            <br />
                            반품 신청
                          </p>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div className="flex-1 text-center">
                          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                            2
                          </div>
                          <p className="text-gray-700">
                            택배사에
                            <br />
                            상품 인계
                          </p>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div className="flex-1 text-center">
                          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                            3
                          </div>
                          <p className="text-gray-700">
                            검수 후<br />
                            환불 진행
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 border-t pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl text-primary">고객 리뷰</h2>
            <button
              onClick={() => setShowAISummary(!showAISummary)}
              className="inline-flex items-center gap-2 bg-accent/10 hover:bg-accent/20 text-primary px-6 py-3 rounded-full transition-all"
            >
              <Sparkles className="w-5 h-5 text-accent" />
              <span>AI 리뷰 요약 {showAISummary ? "닫기" : "보기"}</span>
            </button>
          </div>

          {/* AI Summary */}
          {showAISummary && (
            <div className="mb-8 bg-gradient-to-br from-accent/10 to-primary/5 rounded-3xl p-8 space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl text-primary mb-2 flex items-center gap-2">
                    AI 리뷰 분석
                    <span className="text-sm text-accent bg-white px-3 py-1 rounded-full">
                      {reviews.length}개 리뷰 분석
                    </span>
                  </h3>
                  <p className="text-gray-700">{aiSummary.overall}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Pros */}
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <h4 className="text-primary">주요 장점</h4>
                  </div>
                  <ul className="space-y-2">
                    {aiSummary.pros.map((pro, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-orange-500" />
                    <h4 className="text-primary">개선 필요</h4>
                  </div>
                  <ul className="space-y-2">
                    {aiSummary.cons.map((con, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Size Accuracy */}
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-primary">사이즈 정확도</span>
                  <span className="text-2xl text-accent">
                    {aiSummary.sizeAccuracy}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-accent to-primary h-full rounded-full transition-all duration-1000"
                    style={{ width: `${aiSummary.sizeAccuracy}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-primary">{review.author}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-accent text-accent"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{review.date}</span>
                      <span>•</span>
                      <span>사이즈: {review.size}</span>
                      <span>•</span>
                      <span>
                        {review.height}cm, {review.weight}kg
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                <button className="text-sm text-gray-500 hover:text-accent transition-colors">
                  도움이 돼요 ({review.helpful})
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
