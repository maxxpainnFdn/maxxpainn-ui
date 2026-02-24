/* ─────────────────────────────────────────────────────────────
   ICON SIZE HELPER
   Wraps any Lucide icon with consistent sizing + stroke width.
   Usage: <LI Icon={Flame} size={18} color="#ff2d78" />
───────────────────────────────────────────────────────────── */

const Icon = ({
  icon: IconEl,
  size = 18,
  color = "currentColor",
  strokeWidth = 1.8,
  className = "",
  ...props
}) => (
  
  <IconEl
    { ...props }
    size={size}
    color={color}
    strokeWidth={strokeWidth}
    className={`flex-shrink-0 ${className}`}
  />
);

export default Icon;
