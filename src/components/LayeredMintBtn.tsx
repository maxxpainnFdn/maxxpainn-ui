const LayeredMintBtn = ({ className = "" }) => (
  <a href="#" className={`relative inline-flex items-center no-underline flex-shrink-0 ${className}`}>
    <span
      className="absolute -inset-0.5 border border-maxx-violet/75 rounded-[2px] pointer-events-none"
      style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)" }}
    />
    <span
      className="inline-flex items-center gap-1.5 bg-maxx-pink px-[22px] py-[9px] font-sans font-bold text-[0.82rem] tracking-[0.06em] uppercase text-white"
      style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)" }}
    >
      MINT FREE
    </span>
  </a>
);

export default LayeredMintBtn;
