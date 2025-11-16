import svgPaths from "./svg-xi34w2j5pw";

function Icon() {
  return (
    <div className="absolute left-[21px] size-[16px] top-[13px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_15_6755)" id="Icon">
          <path d={svgPaths.p1d19c880} id="Vector" stroke="var(--stroke-0, #C9A17C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #C9A17C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.6667 2.66667H12" id="Vector_3" stroke="var(--stroke-0, #C9A17C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p22966600} id="Vector_4" stroke="var(--stroke-0, #C9A17C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_15_6755">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[20px] left-[45px] top-[11px] w-[81.641px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[41.5px] text-[#2c2c2c] text-[14px] text-center text-nowrap top-[-1px] tracking-[0.35px] translate-x-[-50%] whitespace-pre">AI 사이즈 추천</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-white h-[42px] left-[350.17px] rounded-[3.35544e+07px] top-0 w-[147.641px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[3.35544e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Icon />
      <Text />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute h-[40px] left-0 top-[58px] w-[848px]" data-name="Heading 1">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[40px] left-[424.84px] text-[#2c2c2c] text-[36px] text-center text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">완벽한 사이즈 찾기</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[24px] left-0 top-[114px] w-[848px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[424.63px] text-[#4a5565] text-[16px] text-center text-nowrap top-[-2px] translate-x-[-50%] whitespace-pre">간단한 정보 입력으로 내게 맞는 사이즈를 찾아보세요</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[138px] left-[24px] top-[48px] w-[848px]" data-name="Container">
      <Container />
      <Heading />
      <Paragraph />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-white h-[819px] left-[25px] rounded-[24px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] top-[231px] w-[848px]" data-name="Container">
      <div className="absolute bg-[#c9a17c] h-[86px] left-[25px] rounded-[18px] top-[28px] w-[795px]" />
      <div className="absolute flex flex-col font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold h-[41px] justify-center leading-[0] left-[126px] text-[36px] text-center text-white top-[70.5px] translate-x-[-50%] translate-y-[-50%] w-[202px]">
        <p className="leading-[24px]">슬림핏</p>
      </div>
      <div className="absolute flex flex-col font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold h-[41px] justify-center leading-[0] left-[326px] text-[36px] text-center text-white top-[70.5px] translate-x-[-50%] translate-y-[-50%] w-[202px]">
        <p className="leading-[24px]">레귤러핏</p>
      </div>
      <div className="absolute flex flex-col font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold h-[41px] justify-center leading-[0] left-[526px] text-[36px] text-center text-white top-[70.5px] translate-x-[-50%] translate-y-[-50%] w-[202px]">
        <p className="leading-[24px]">세미오버핏</p>
      </div>
      <div className="absolute bg-white h-[78px] left-[646px] rounded-[15px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] top-[32px] w-[170px]" />
      <div className="absolute flex flex-col font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold h-[41px] justify-center leading-[0] left-[726px] text-[#c9a17c] text-[36px] text-center top-[70.5px] translate-x-[-50%] translate-y-[-50%] w-[202px]">
        <p className="leading-[24px]">오버핏</p>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="h-[1086px] relative shrink-0 w-full" data-name="Main Content">
      <Container1 />
      <Container2 />
    </div>
  );
}

function AiFittingPage() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[1151px] items-start left-0 pb-0 pt-[65px] px-[316px] top-0 w-[1528px]" data-name="AIFittingPage">
      <MainContent />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p33f6b680} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15.8333 10H4.16667" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-2px] whitespace-pre">메인으로 돌아가기</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Button">
      <Icon1 />
      <Text1 />
    </div>
  );
}

function AiFittingPage1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.95)] box-border content-stretch flex flex-col h-[65px] items-start left-0 pb-px pl-[148px] pr-[1218.38px] pt-[20px] top-0 w-[1528px]" data-name="AIFittingPage">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(229,231,235,0.5)] border-solid inset-0 pointer-events-none" />
      <Button />
    </div>
  );
}

export default function Ai() {
  return (
    <div className="bg-white relative size-full" data-name="AI 사이즈 추천2">
      <AiFittingPage />
      <AiFittingPage1 />
    </div>
  );
}