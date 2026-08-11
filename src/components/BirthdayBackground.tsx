export default function BirthdayBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img
        src="/friend.jpeg"
        alt=""
        className="w-full h-full object-cover object-center scale-105"
      />
      <div className="absolute inset-0 bg-charcoal-950/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 via-charcoal-950/40 to-charcoal-950/80" />
      <div className="absolute inset-0 bg-gradient-radial-glow" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(10, 8, 8, 0.6) 100%)",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[1px]" />
    </div>
  );
}