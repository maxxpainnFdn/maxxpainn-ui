/* ─────────────────────────────────────────────────────────────
   STORY DETAIL PANEL
───────────────────────────────────────────────────────────── */

const IndexStoryDetail = ({ ev }) => (
  <div className="maxx-card relative overflow-hidden flex flex-col p-6 min-h-[290px]">
    {/* Top accent line */}
    <div
      className="absolute top-0 left-0 right-0 h-0.5"
      style={{ background: `linear-gradient(90deg, ${ev.color}, transparent)` }}
    />
    {/* Background glow */}
    <div
      className="absolute -top-10 -right-10 w-40 h-40 pointer-events-none"
      style={{ background: `radial-gradient(circle, ${ev.color}1e 0%, transparent 70%)` }}
    />

    <div className="relative z-[1] flex-1">
      <div className="flex items-start gap-3.5 mb-3.5">
        <span className="text-[2rem] leading-none flex-shrink-0">{ev.emoji}</span>
        <div>
          <div
            className="font-mono text-[0.7rem] tracking-[0.1em] uppercase mb-[3px]"
            style={{ color: ev.color }}
          >
            {ev.code} · {ev.year}
          </div>
          <h3
            className="font-sans font-extrabold uppercase tracking-[0.01em] text-maxx-white leading-[1.1]"
            style={{ fontSize: "clamp(1.05rem, 2.5vw, 1.45rem)" }}
          >
            {ev.name}
          </h3>
        </div>
      </div>

      <p
        className="font-sans font-semibold italic leading-[1.55] text-maxx-white pl-3.5 mb-3"
        style={{
          fontSize: "clamp(0.9rem, 2vw, 1.02rem)",
          borderLeft: `2px solid ${ev.color}`,
        }}
      >
        "{ev.tagline}"
      </p>

      <p
        className="text-maxx-bright leading-[1.8]"
        style={{ fontSize: "clamp(0.86rem, 1.5vw, 0.94rem)" }}
      >
        {ev.detail}
      </p>
    </div>

    <div className="relative z-[1] mt-5 pt-3.5 border-t border-maxx-border flex justify-between items-end flex-wrap gap-2">
      <div>
        <div
          className="font-sans font-black leading-none"
          style={{ fontSize: "clamp(1.6rem, 5vw, 2.6rem)", color: ev.color }}
        >
          {ev.loss}
        </div>
        <div className="font-mono text-[0.68rem] text-maxx-sub tracking-[0.1em] uppercase mt-[3px]">
          Lost Forever
        </div>
      </div>
      <span
        className="font-mono text-[0.68rem] tracking-[0.06em] opacity-70"
        style={{ color: ev.color }}
      >
        {ev.code}
      </span>
    </div>
  </div>
);

export default IndexStoryDetail;
