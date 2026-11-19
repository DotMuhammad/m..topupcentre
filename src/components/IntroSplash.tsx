import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface IntroSplashProps {
  onComplete: () => void;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
  glow: string;
}

const BRAND_TITLE = 'MUHAMMAD';
const BRAND_SUBTITLE = 'TOPUP CENTRE';
const BRAND_TAGLINE = 'YOUR TRUSTED GAMING TOP-UP DESTINATION';

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const completedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const [phaseReady, setPhaseReady] = useState(false);

  const finishIntro = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  // Auto-advance after the 3.85s cinematic sequence (or 1.1s if reduced motion is enabled)
  useEffect(() => {
    setPhaseReady(true);
    const totalDurationMs = prefersReducedMotion ? 1100 : 3850;
    const timer = window.setTimeout(finishIntro, totalDurationMs);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finishIntro();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  // High-FPS GPU canvas particle & floating spark emitter
  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const palette = [
      { color: 'rgba(168, 85, 247, 0.95)', glow: 'rgba(168, 85, 247, 0.55)' }, // Neon Purple
      { color: 'rgba(56, 189, 248, 0.95)', glow: 'rgba(56, 189, 248, 0.55)' }, // Electric Blue
      { color: 'rgba(251, 191, 36, 0.92)', glow: 'rgba(251, 191, 36, 0.5)' }, // Subtle Gold
    ];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const particleCount = width < 640 ? 34 : 56;
    const particles: SparkParticle[] = Array.from({ length: particleCount }, (_, idx) => {
      const swatch = palette[idx % palette.length];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.36,
        vy: -(0.28 + Math.random() * 0.72),
        radius: 0.9 + Math.random() * 1.9,
        alpha: 0.15 + Math.random() * 0.7,
        alphaSpeed: 0.004 + Math.random() * 0.01,
        color: swatch.color,
        glow: swatch.glow,
      };
    });

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaSpeed;

        if (p.alpha >= 0.9 || p.alpha <= 0.12) {
          p.alphaSpeed *= -1;
        }

        if (p.y < -12) {
          p.y = height + 12;
          p.x = Math.random() * width;
        }
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;

        ctx.save();
        ctx.globalAlpha = Math.max(0.08, Math.min(0.92, p.alpha));
        ctx.shadowBlur = p.radius * 7;
        ctx.shadowColor = p.glow;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    animationFrameId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReducedMotion]);

  const subtitleChars = BRAND_SUBTITLE.split('');

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Muhammad Topup Centre Opening Animation"
      initial={{ opacity: 1 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0, transition: { duration: 0.3 } }
          : {
              opacity: 0,
              scale: 1.035,
              filter: 'blur(8px)',
              transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
            }
      }
      className="fixed inset-0 z-[100] h-[100dvh] w-full overflow-hidden bg-[#030307] text-white flex flex-col items-center justify-center px-4 select-none"
    >
      {/* Pure Dark Radial Atmosphere & Volumetric Energy Glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Core Purple / Electric Blue Aura */}
        <div
          className="animate-intro-ray absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[760px] aspect-square rounded-full blur-[95px]"
          style={{
            background:
              'radial-gradient(circle at 42% 45%, rgba(168, 85, 247, 0.24) 0%, rgba(56, 189, 248, 0.16) 38%, rgba(251, 191, 36, 0.06) 62%, transparent 74%)',
          }}
        />

        {/* Subtle Cinematic Diagonal Light Rays */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: prefersReducedMotion ? 0.22 : 0.45 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
          style={{
            background:
              'conic-gradient(from 215deg at 50% 44%, transparent 0deg, rgba(168, 85, 247, 0.08) 18deg, transparent 42deg, rgba(56, 189, 248, 0.08) 68deg, transparent 96deg, rgba(251, 191, 36, 0.05) 142deg, transparent 175deg)',
          }}
        />

        {/* Subtle Architectural Grid Vignette */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.09) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(circle at center, black 10%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 72%)',
          }}
        />
      </div>

      {/* Floating Glowing Particles & Sparks */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full"
      />

      {/* Central Brand Stage */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl w-full">
        {/* Emblem + Circular Glowing Energy Ring */}
        <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 mb-7 sm:mb-9">
          {/* Outer Rotating Electric-Blue & Neon-Purple Energy Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <svg
              viewBox="0 0 180 180"
              className="w-full h-full overflow-visible animate-intro-orbit-cw"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="introRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="50%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
                <filter id="introRingGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle
                cx="90"
                cy="90"
                r="82"
                fill="none"
                stroke="rgba(148, 163, 184, 0.14)"
                strokeWidth="1"
              />
              <motion.circle
                cx="90"
                cy="90"
                r="82"
                fill="none"
                stroke="url(#introRingGrad)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="190 95 75 155"
                filter="url(#introRingGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.05, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </motion.div>

          {/* Inner Counter-Rotating Precision Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.85, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-3.5 sm:inset-4"
          >
            <svg
              viewBox="0 0 150 150"
              className="w-full h-full animate-intro-orbit-ccw"
              aria-hidden="true"
            >
              <circle
                cx="75"
                cy="75"
                r="68"
                fill="none"
                stroke="rgba(56, 189, 248, 0.35)"
                strokeWidth="1"
                strokeDasharray="18 14 4 14"
              />
            </svg>
          </motion.div>

          {/* Glassmorphic Center Medallion + Zoom-In Brand Crest */}
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.58, filter: 'blur(12px)' }
            }
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.35),inset_0_0_24px_rgba(56,189,248,0.16)] flex items-center justify-center"
          >
            <svg
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
              className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_16px_rgba(56,189,248,0.65)]"
            >
              <defs>
                <linearGradient id="crestOuter" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="52%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
                <linearGradient id="crestInner" x1="20" y1="10" x2="44" y2="54" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <path
                d="M32 5L55 24.5L32 59L9 24.5L32 5Z"
                fill="rgba(168, 85, 247, 0.16)"
                stroke="url(#crestOuter)"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M32 5L43 24.5L32 59L21 24.5L32 5Z"
                fill="rgba(251, 191, 36, 0.14)"
                stroke="url(#crestInner)"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M9 24.5H55"
                stroke="rgba(224, 242, 254, 0.55)"
                strokeWidth="1.3"
              />
              <path
                d="M21 24.5L32 14.5L43 24.5L32 37L21 24.5Z"
                fill="rgba(56, 189, 248, 0.25)"
              />
            </svg>
          </motion.div>
        </div>

        {/* Brand Lockup Wrapper with Specular Light Sweep */}
        <div className="relative overflow-hidden px-3 py-1.5 rounded-lg">
          {/* Cinematic Light Sweep Across Brand Name */}
          {!prefersReducedMotion && phaseReady && (
            <motion.div
              aria-hidden="true"
              initial={{ x: '-140%', opacity: 0 }}
              animate={{ x: '240%', opacity: [0, 0.9, 0.9, 0] }}
              transition={{
                duration: 0.95,
                delay: 2.05,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-22deg] bg-gradient-to-r from-transparent via-white/35 to-transparent blur-[2px] z-20"
            />
          )}

          {/* Primary Wordmark: "MUHAMMAD" */}
          <motion.h1
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 18, scale: 0.94, filter: 'blur(10px)', letterSpacing: '0.28em' }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              letterSpacing: '0.16em',
            }}
            transition={{ duration: 0.72, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold text-[clamp(1.85rem,7.8vw,4.35rem)] leading-none bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent drop-shadow-[0_6px_26px_rgba(168,85,247,0.35)]"
          >
            {BRAND_TITLE}
          </motion.h1>

          {/* Secondary Wordmark: "TOPUP CENTRE" (Letter-by-Letter Staggered Reveal) */}
          <div
            aria-label={BRAND_SUBTITLE}
            className="mt-2.5 sm:mt-3 flex items-center justify-center flex-wrap font-display font-bold text-[clamp(0.95rem,3.6vw,1.7rem)] tracking-[0.22em] sm:tracking-[0.34em]"
          >
            {subtitleChars.map((char, idx) => (
              <motion.span
                key={`${char}-${idx}`}
                aria-hidden="true"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10, filter: 'blur(5px)' }
                }
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.34,
                  delay: prefersReducedMotion ? 0 : 1.32 + idx * 0.055,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block whitespace-pre bg-gradient-to-r from-sky-300 via-purple-300 to-amber-300 bg-clip-text text-transparent"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Hairline Glassmorphic Accent Rule */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.65, delay: prefersReducedMotion ? 0 : 2.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 mb-4 h-px w-48 sm:w-72 origin-center bg-gradient-to-r from-transparent via-purple-400/70 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.55)]"
        />

        {/* Tagline: "YOUR TRUSTED GAMING TOP-UP DESTINATION" */}
        <motion.p
          initial={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 10, filter: 'blur(4px)' }
          }
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: prefersReducedMotion ? 0 : 2.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(0.66rem,2.4vw,0.88rem)] font-medium tracking-[0.14em] sm:tracking-[0.26em] text-slate-200/95 max-w-[92vw] leading-relaxed"
          style={{
            textShadow: '0 0 18px rgba(56, 189, 248, 0.48), 0 0 32px rgba(168, 85, 247, 0.32)',
          }}
        >
          {BRAND_TAGLINE}
        </motion.p>
      </div>

      {/* Unobtrusive Glassmorphic Skip Button (44px+ touch target) */}
      <motion.button
        type="button"
        onClick={finishIntro}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-20 min-h-[44px] px-4 py-2 rounded-lg border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-md text-xs font-medium text-slate-200 inline-flex items-center gap-1.5 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <span>Skip Intro</span>
        <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
      </motion.button>
    </motion.div>
  );
};
