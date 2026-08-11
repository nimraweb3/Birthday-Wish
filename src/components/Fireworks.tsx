import { useEffect, useRef } from "react";

interface FireworksProps {
  active: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trail: { x: number; y: number }[];
  exploded: boolean;
}

interface Burst {
  sparks: Spark[];
}

const COLORS = [
  "251, 113, 133",
  "244, 63, 94",
  "255, 255, 255",
  "254, 205, 211",
  "225, 29, 72",
  "251, 191, 36",
];

function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createBurst(x: number, y: number, color: string, big: boolean): Burst {
  const sparkCount = big ? 70 + Math.floor(Math.random() * 40) : 45 + Math.floor(Math.random() * 25);
  const sparks: Spark[] = [];

  for (let i = 0; i < sparkCount; i++) {
    const angle = (Math.PI * 2 * i) / sparkCount + Math.random() * 0.25;
    const speed = (big ? 2.5 : 1.8) + Math.random() * (big ? 4.5 : 3.2);
    const maxLife = 55 + Math.random() * 35;
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: maxLife,
      maxLife,
      color,
      size: 1.5 + Math.random() * 2.2,
    });
  }

  return { sparks };
}

function createRocket(width: number, height: number, startX?: number): Rocket {
  const x = startX !== undefined ? startX : width * (0.1 + Math.random() * 0.8);
  const targetY = height * (0.15 + Math.random() * 0.35);
  return {
    x,
    y: height + 10,
    targetY,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -(7 + Math.random() * 3),
    color: randomColor(),
    trail: [],
    exploded: false,
  };
}

export default function Fireworks({ active }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstsRef = useRef<Burst[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const animationRef = useRef<number>(0);
  const lastLaunchRef = useRef<number>(0);
  const activeRef = useRef<boolean>(active);
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      sizeRef.current = { width, height };
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function explodeRocket(rocket: Rocket, big: boolean) {
      burstsRef.current.push(createBurst(rocket.x, rocket.y, rocket.color, big));
      if (burstsRef.current.length > 8) {
        burstsRef.current.shift();
      }
    }

    function handlePointer(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const rocket = createRocket(width, height, x);
      rocket.targetY = (e.clientY - rect.top);
      rocketsRef.current.push(rocket);
    }
    window.addEventListener("pointerdown", handlePointer);

    function tick(timestamp: number) {
      ctx!.clearRect(0, 0, width, height);

      if (activeRef.current) {
        if (timestamp - lastLaunchRef.current > 550 + Math.random() * 450) {
          rocketsRef.current.push(createRocket(width, height));
          lastLaunchRef.current = timestamp;
        }
      }

      rocketsRef.current = rocketsRef.current.filter((rocket) => {
        if (rocket.exploded) return false;

        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.vy += 0.05;

        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 10) rocket.trail.shift();

        rocket.trail.forEach((point, idx) => {
          const alpha = (idx / rocket.trail.length) * 0.5;
          ctx!.beginPath();
          ctx!.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${rocket.color}, ${alpha})`;
          ctx!.fill();
        });

        ctx!.beginPath();
        ctx!.arc(rocket.x, rocket.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${rocket.color}, 0.9)`;
        ctx!.shadowBlur = 6;
        ctx!.shadowColor = `rgba(${rocket.color}, 0.7)`;
        ctx!.fill();
        ctx!.shadowBlur = 0;

        if (rocket.vy >= -1 || rocket.y <= rocket.targetY) {
          rocket.exploded = true;
          explodeRocket(rocket, Math.random() > 0.6);
          return false;
        }

        return true;
      });

      burstsRef.current = burstsRef.current.filter((burst) => {
        burst.sparks.forEach((s) => {
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.028;
          s.vx *= 0.985;
          s.life -= 1;

          if (s.life <= 0) return;

          const alpha = Math.max(s.life / s.maxLife, 0);
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${s.color}, ${alpha})`;
          ctx!.shadowBlur = 8;
          ctx!.shadowColor = `rgba(${s.color}, ${alpha * 0.6})`;
          ctx!.fill();
        });

        burst.sparks = burst.sparks.filter((s) => s.life > 0);
        return burst.sparks.length > 0;
      });

      ctx!.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(tick);
    }

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handlePointer);
      cancelAnimationFrame(animationRef.current);
      burstsRef.current = [];
      rocketsRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ touchAction: "none" }}
      aria-hidden="true"
    />
  );
}