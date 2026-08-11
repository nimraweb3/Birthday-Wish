export default function BirthdayBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img
        src="/friend.png"
        alt=""
        className="w-full h-full object-cover object-bottom scale-105"
      />

      {/* Base dark overlay for overall readability */}
      <div className="absolute inset-0 bg-charcoal-950/70" />

      {/* Stronger gradient at top for navbar contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 via-charcoal-950/40 to-charcoal-950/80" />

      {/* Subtle radial warmth in the center */}
      <div className="absolute inset-0 bg-gradient-radial-glow" />

      {/* Soft vignette on edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(10, 8, 8, 0.6) 100%)",
        }}
      />

      {/* Very subtle blur layer for depth */}
      <div className="absolute inset-0 backdrop-blur-[1px]" />
    </div>
  );
}