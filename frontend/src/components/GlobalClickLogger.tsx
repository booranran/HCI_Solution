// src/components/GlobalClickLogger.tsx

import React, { useEffect } from 'react';

export default function GlobalClickLogger() {
  
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('ko-KR', { hour12: false }); // 24시간 형식
      
      // ⭐️ 클릭 로그 출력
      console.log(`[CLICK DEBUG] [${timeString}]`, e.target); 
            console.log("Class:", (e.target as HTMLElement).className);

    };

    // Document 전체에 'click' 리스너 설치
    document.addEventListener('click', handleGlobalClick);

    // ⭐️ 클린업 함수: 컴포넌트가 사라질 때 리스너를 제거 (필수!)
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []); 

  // UI를 렌더링할 필요가 없으므로 null을 반환 (혹은 빈 Fragment <></>)
  return null; 
}