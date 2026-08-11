export default function BirthdayBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img
        src="/friend.jpeg"
        alt=""
        className="w-full h-full object-cover object-center scale-105"
      />
      <div className="absolute inset-0 bg-charcoal-950/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/25 via-charcoal-950/35 to-charcoal-950/75" />
      <div className="absolute inset-0 bg-gradient-radial-glow" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-rose-500/8 to-transparent" />
      <div
        className="absolute inset-0 subtle-sheen"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(255, 182, 193, 0.08), transparent 28%), radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.06), transparent 24%)",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[1px]" />
    </div>
  );
}