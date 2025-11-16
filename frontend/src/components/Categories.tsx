import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';

interface CategoriesProps {
  onCategoryClick?: (category: string) => void;
}

export function Categories({ onCategoryClick }: CategoriesProps) {
  const categories = [
    {
      name: '여성 컬렉션',
      description: '우아한 여성 패션',
      image: 'https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3BoaXN0aWNhdGVkJTIwd29tYW4lMjBmYXNoaW9ufGVufDF8fHx8MTc2MzExMDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      tag: 'NEW',
    },
    {
      name: '남성 컬렉션',
      description: '세련된 남성 스타일',
      image: 'https://images.unsplash.com/photo-1635205383450-e0fee6fe73c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbWVucyUyMGZhc2hpb24lMjBzdWl0fGVufDF8fHx8MTc2MzExMDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      tag: 'SALE',
    },
    {
      name: '액세서리',
      description: '품격있는 액세서리',
      image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYzMDIzODc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      tag: 'HOT',
    },
  ];

  return (
    <section id="categories" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-accent uppercase tracking-wider mb-2">발견하기</p>
            <h2 className="text-4xl text-primary mb-2">컬렉션 둘러보기</h2>
            <p className="text-gray-600">당신만을 위한 완벽한 스타일을 찾아보세요</p>
          </div>
          <button
            onClick={() => onCategoryClick?.('전체')}
            className="text-primary hover:text-accent transition-colors flex items-center gap-2 group"
          >
            <span className="border-b border-transparent group-hover:border-accent transition-all">전체 보기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => onCategoryClick?.(category.name)}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Elegant Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity"></div>

              {/* Tag */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full text-sm tracking-wide">
                {category.tag}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl mb-2 tracking-tight">{category.name}</h3>
                <p className="text-sm text-white/90 mb-6 tracking-wide">{category.description}</p>
                <div className="bg-white/95 backdrop-blur-sm text-primary px-8 py-2.5 rounded-full hover:bg-accent hover:text-white transition-all inline-flex items-center gap-2 group/btn">
                  <span>둘러보기</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
