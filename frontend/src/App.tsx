import { Hero } from "./components/Hero";
import { PromoBanner } from "./components/PromoBanner";
import { Categories } from "./components/Categories";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { HowItWorks } from "./components/HowItWorks";
import { Benefits } from "./components/Benefits";
import { Testimonials } from "./components/Testimonials";
import { Footer } from "./components/Footer";
import { CartSheet } from "./components/CartSheet";
import { VirtualTryOnPage } from "./components/VirtualTryOnPage";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { ProductListPage } from "./components/ProductListPage";
import { ImageSearchModal } from "./components/ImageSearchModal";
import { CartProvider, useCart } from "./components/CartContext";
import { Search, ShoppingCart, User, Heart, Menu, Image } from "lucide-react";
import { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import VirtualTryOnResult from "./components/VirtualTryOnResult";
import BodyCompare from "./components/BodyCompare";
import BodyCompareResult from "./components/BodyCompare_Result";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

type Page =
  | "home"
  | "ai-fitting"
  | "virtual-tryon"
  | "product-detail"
  | "product-list";

function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [imageSearchOpen, setImageSearchOpen] = useState(false);

  const { cartCount } = useCart();

  const navigate = useNavigate();

  const handleProductClick = (product: any) => {
    navigate("/product-detail", { state: { product: product } });
  };

  const handleCategoryClick = (category: string) => {
    navigate("/products", { state: { category: category } });
  };

  const handleImageSearch = (imageFile: File) => {
    setImageSearchOpen(false);
    navigate("/products", { state: { category: "이미지 검색 결과" } });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs tracking-wide">
          <p>✨ 신규 회원 첫 구매 시 20% 할인</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-accent transition-colors">
              고객센터
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              주문조회
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              매장찾기
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 bg-white/98 backdrop-blur-lg z-50 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-accent to-primary rounded-xl shadow-sm"></div>
              <h1 className="text-2xl text-primary tracking-tight">Fitory</h1>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-xl">
              <div className="relative w-full flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="상품, 브랜드 검색..."
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:border-accent focus:bg-white transition-all text-sm"
                  />
                </div>
                <button
                  onClick={() => setImageSearchOpen(true)}
                  className="p-2.5 bg-gray-50 hover:bg-accent/10 rounded-full border border-gray-200 hover:border-accent transition-all group"
                  title="이미지로 검색"
                >
                  <Image className="w-5 h-5 text-gray-600 group-hover:text-accent transition-colors" />
                </button>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {/* 1. 신상품 */}
              <button
                onClick={() => handleCategoryClick("신상품")}
                className="text-sm text-gray-700 hover:text-primary transition-colors tracking-wide relative group"
              >
                신상품
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all"></span>
              </button>

              {/* 2. 여성 (중요: DB에 '여성 컬렉션'이라고 저장돼 있으면 이렇게 보내야 함) */}
              <button
                onClick={() => handleCategoryClick("여성 컬렉션")}
                className="text-sm text-gray-700 hover:text-primary transition-colors tracking-wide relative group"
              >
                여성
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all"></span>
                console.log("여성 컬렉션 클릭됨");
              </button>

              {/* 3. 남성 */}
              <button
                onClick={() => {
                  handleCategoryClick("남성 컬렉션");
                  console.log("남성 컬렉션 클릭됨");
                }}
                className="text-sm text-gray-700 hover:text-primary transition-colors tracking-wide relative group"
              >
                남성
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all"></span>
              </button>

              {/* 4. 세일 */}
              <button
                onClick={() => handleCategoryClick("세일")}
                className="text-sm text-red-500 hover:text-red-600 transition-colors tracking-wide relative group"
              >
                세일
                <span className="absolute -bottom-1 left-0 w-0.5 bg-red-500 group-hover:w-full transition-all"></span>
              </button>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <button className="relative p-2.5 hover:bg-gray-50 rounded-full transition-colors group">
                <Heart className="w-5 h-5 text-gray-700 group-hover:text-accent transition-colors" />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 hover:bg-gray-50 rounded-full transition-colors group"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-accent transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="p-2.5 hover:bg-gray-50 rounded-full transition-colors group">
                <User className="w-5 h-5 text-gray-700 group-hover:text-accent transition-colors" />
              </button>
              <button className="md:hidden p-2.5 hover:bg-gray-50 rounded-full transition-colors">
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Hero />
        <PromoBanner />
        <Categories onCategoryClick={handleCategoryClick} />
        <FeaturedProducts onProductClick={handleProductClick} />
        <HowItWorks />
        <Benefits />
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Sheet */}
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

      {/* Image Search Modal */}
      <ImageSearchModal
        isOpen={imageSearchOpen}
        onClose={() => setImageSearchOpen(false)}
        onSearch={handleImageSearch}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Toaster는 Routes 밖에 두면 모든 페이지에서 알림이 뜸 */}
        <Toaster />

        <Routes>
          {/* ⭐️ Route 1: 홈페이지 ('/') */}
          <Route path="/" element={<HomePage />} />
          {/* ⭐️ Route 2: 상품 목록 페이지 */}
          <Route path="/products" element={<ProductListPage />} />
          {/* ⭐️ Route 3: 상품 상세 페이지 */}
          <Route path="/product-detail" element={<ProductDetailPage />} />
          {/* ⭐️ Route 4: "우리가" 만든 AI 핏 비교 (폼) */}
          <Route path="/body-compare" element={<BodyCompare />} />
          {/* ⭐️ Route 5: "우리가" 만든 AI 핏 비교 (결과) */}
          <Route path="/body-compare/result" element={<BodyCompareResult />} />
          {/* ⭐️ Route 6: 가상 피팅 (나중에 추가) */}
          {<Route path="/virtual-tryon" element={<VirtualTryOnPage />} />}
          <Route path="/tryon/result" element={<VirtualTryOnResult />} /> // ⭐️
          결과 페이지 등록
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
