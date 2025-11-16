import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
  ];

  const footerLinks = [
    {
      title: '제품',
      links: ['주요 기능', '이용 방법', '가격 안내', 'API'],
    },
    {
      title: '회사',
      links: ['회사 소개', '채용', '보도자료', '파트너'],
    },
    {
      title: '고객지원',
      links: ['자주 묻는 질문', '문의하기', '고객센터', '개인정보처리방침'],
    },
  ];

  return (
    <footer className="bg-primary text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <h3 className="text-2xl text-accent mb-4">Fitory</h3>
            <p className="text-gray-300 mb-6">
              AI 기반 맞춤형 패션 핏 추천으로 언제나 완벽한 사이즈를 찾아드립니다.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-accent transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="max-w-md">
            <h4 className="text-lg mb-3">최신 소식 받기</h4>
            <p className="text-gray-300 mb-4">
              새로운 기능과 독점 할인 정보를 가장 먼저 받아보세요.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-accent"
              />
              <button className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full transition-colors flex items-center gap-2">
                <Mail className="w-5 h-5" />
                구독하기
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-300">
            © 2025 Fitory. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-300 hover:text-accent transition-colors">
              이용약관
            </a>
            <a href="#" className="text-gray-300 hover:text-accent transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="text-gray-300 hover:text-accent transition-colors">
              쿠키 정책
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
