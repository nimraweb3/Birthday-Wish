import {
  useCallback,
  useEffect,
  useRef,
} from "react";

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  gravity: number;
  friction: number;
  radius: number;
  hue: number;
}

interface FireworkRocket {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  trail: Array<{
    x: number;
    y: number;
  }>;
  hue: number;
}

interface FireworksProps {
  active: boolean;
}

const MAX_PARTICLES = 850;
const MAX_ROCKETS = 7;

const Fireworks = ({
  active,
}: FireworksProps) => {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const rocketsRef =
    useRef<FireworkRocket[]>([]);

  const particlesRef =
    useRef<FireworkParticle[]>([]);

  const lastLaunchRef =
    useRef(0);

  /*
   * =====================================
   * CREATE ROCKET
   * =====================================
   */

  const createRocket = useCallback(() => {
    if (
      rocketsRef.current.length >=
      MAX_ROCKETS
    ) {
      return;
    }

    const width =
      window.innerWidth;

    const height =
      window.innerHeight;

    const x =
      width *
      (0.12 + Math.random() * 0.76);

    const targetY =
      height *
      (0.10 + Math.random() * 0.35);

    rocketsRef.current.push({
      x,

      y:
        height + 20,

      targetY,

      speed:
        7 + Math.random() * 3,

      trail: [],

      hue:
        320 +
        Math.random() * 55,
    });
  }, []);

  /*
   * =====================================
   * CREATE EXPLOSION
   * =====================================
   */

  const createExplosion = useCallback(
    (
      x: number,
      y: number,
      hue: number
    ) => {
      const particles =
        particlesRef.current;

      /*
       * Keep a hard particle limit.
       */

      const available =
        MAX_PARTICLES -
        particles.length;

      if (available <= 0) {
        return;
      }

      const count = Math.min(
        60 +
          Math.floor(
            Math.random() * 20
          ),
        available
      );

      /*
       * Main explosion
       */

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const angle =
          (Math.PI * 2 * i) /
            count +
          (Math.random() - 0.5) *
            0.15;

        const speed =
          2 +
          Math.random() * 4.5;

        particles.push({
          x,
          y,

          vx:
            Math.cos(angle) *
            speed,

          vy:
            Math.sin(angle) *
            speed,

          alpha: 1,

          decay:
            0.012 +
            Math.random() * 0.01,

          gravity:
            0.025 +
            Math.random() * 0.02,

          friction: 0.985,

          radius:
            1 +
            Math.random() * 1.4,

          hue:
            hue +
            (Math.random() - 0.5) *
              30,
        });
      }

      /*
       * Small bright inner sparks.
       */

      const innerCount =
        Math.min(
          12,
          MAX_PARTICLES -
            particles.length
        );

      for (
        let i = 0;
        i < innerCount;
        i++
      ) {
        const angle =
          Math.random() *
          Math.PI *
          2;

        const speed =
          0.7 +
          Math.random() * 2;

        particles.push({
          x,
          y,

          vx:
            Math.cos(angle) *
            speed,

          vy:
            Math.sin(angle) *
            speed,

          alpha: 1,

          decay: 0.025,

          gravity: 0.015,

          friction: 0.98,

          radius: 1.8,

          hue: hue + 10,
        });
      }
    },
    []
  );

  /*
   * =====================================
   * RESIZE
   * =====================================
   */

  const resizeCanvas = useCallback(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    /*
     * Don't render at an unnecessarily
     * huge resolution on high-DPI screens.
     */

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      1.5
    );

    canvas.width =
      window.innerWidth * dpr;

    canvas.height =
      window.innerHeight * dpr;

    canvas.style.width =
      `${window.innerWidth}px`;

    canvas.style.height =
      `${window.innerHeight}px`;

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );
  }, []);

  /*
   * =====================================
   * ANIMATION
   * =====================================
   */

  const animate = useCallback(
    (timestamp: number) => {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        return;
      }

      const ctx =
        canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      const width =
        window.innerWidth;

      const height =
        window.innerHeight;

      /*
       * Instead of completely clearing
       * the canvas, use a very light fade.
       * This gives us trails.
       */

      ctx.fillStyle =
        "rgba(12, 7, 8, 0.20)";

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /*
       * =================================
       * LAUNCH ROCKETS
       * =================================
       */

      if (
        timestamp -
          lastLaunchRef.current >
        320
      ) {
        createRocket();

        /*
         * Sometimes create a pair.
         */

        if (
          Math.random() > 0.58
        ) {
          createRocket();
        }

        lastLaunchRef.current =
          timestamp;
      }

      /*
       * =================================
       * ROCKETS
       * =================================
       */

      const rockets =
        rocketsRef.current;

      for (
        let i = rockets.length - 1;
        i >= 0;
        i--
      ) {
        const rocket =
          rockets[i];

        rocket.trail.push({
          x: rocket.x,
          y: rocket.y,
        });

        /*
         * Short trail.
         */

        if (
          rocket.trail.length >
          8
        ) {
          rocket.trail.shift();
        }

        rocket.y -=
          rocket.speed;

        /*
         * Rocket trail
         */

        if (
          rocket.trail.length > 1
        ) {
          ctx.beginPath();

          rocket.trail.forEach(
            (point, index) => {
              if (index === 0) {
                ctx.moveTo(
                  point.x,
                  point.y
                );
              } else {
                ctx.lineTo(
                  point.x,
                  point.y
                );
              }
            }
          );

          ctx.strokeStyle =
            `hsla(
              ${rocket.hue},
              90%,
              75%,
              0.65
            )`;

          ctx.lineWidth = 1.4;

          ctx.stroke();
        }

        /*
         * Rocket head.
         *
         * Only rockets get shadowBlur,
         * not every particle.
         */

        ctx.beginPath();

        ctx.arc(
          rocket.x,
          rocket.y,
          2,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `hsl(
            ${rocket.hue},
            100%,
            88%
          )`;

        ctx.shadowBlur = 10;

        ctx.shadowColor =
          `hsl(
            ${rocket.hue},
            100%,
            70%
          )`;

        ctx.fill();

        ctx.shadowBlur = 0;

        /*
         * Explosion
         */

        if (
          rocket.y <=
          rocket.targetY
        ) {
          createExplosion(
            rocket.x,
            rocket.y,
            rocket.hue
          );

          rockets.splice(i, 1);
        }
      }

      /*
       * =================================
       * PARTICLES
       * =================================
       */

      const particles =
        particlesRef.current;

      for (
        let i = particles.length - 1;
        i >= 0;
        i--
      ) {
        const particle =
          particles[i];

        /*
         * Physics
         */

        particle.vx *=
          particle.friction;

        particle.vy *=
          particle.friction;

        particle.vy +=
          particle.gravity;

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;

        particle.alpha -=
          particle.decay;

        /*
         * Draw particle.
         *
         * No shadowBlur here.
         * This is the big performance win.
         */

        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `hsla(
            ${particle.hue},
            90%,
            78%,
            ${Math.max(
              particle.alpha,
              0
            )}
          )`;

        ctx.fill();

        /*
         * Remove dead particles.
         */

        if (
          particle.alpha <= 0 ||
          particle.y >
            height + 60
        ) {
          particles.splice(i, 1);
        }
      }

      animationRef.current =
        requestAnimationFrame(
          animate
        );
    },
    [
      createExplosion,
      createRocket,
    ]
  );

  /*
   * =====================================
   * CANVAS SETUP
   * =====================================
   */

  useEffect(() => {
    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };
  }, [resizeCanvas]);

  /*
   * =====================================
   * START / STOP
   * =====================================
   */

  useEffect(() => {
    if (!active) {
      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current
        );

        animationRef.current =
          null;
      }

      rocketsRef.current = [];
      particlesRef.current = [];

      const canvas =
        canvasRef.current;

      const ctx =
        canvas?.getContext("2d");

      if (canvas && ctx) {
        ctx.clearRect(
          0,
          0,
          window.innerWidth,
          window.innerHeight
        );
      }

      return;
    }

    /*
     * Opening volley.
     */

    createRocket();
    createRocket();

    lastLaunchRef.current =
      performance.now();

    animationRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current
        );

        animationRef.current =
          null;
      }
    };
  }, [
    active,
    animate,
    createRocket,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="
        pointer-events-none

        fixed
        inset-0

        z-0

        h-full
        w-full

        opacity-95
      "
    />
  );
};

export default Fireworks;