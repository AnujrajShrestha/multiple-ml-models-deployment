import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedBackground() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".bg-orbit-1", {
        rotation: 360,
        duration: 34,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(".bg-orbit-2", {
        rotation: -360,
        duration: 45,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(".bg-node", {
        opacity: 0.25,
        scale: 1.25,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.35,
        ease: "sine.inOut",
      },root);

      gsap.to(".bg-scan", {
        y: "100vh",
        duration: 8,
        repeat: -1,
        ease: "none",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-80"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="gridLine" x1="0" x2="1">
            <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset=".5" stopColor="#6366f1" stopOpacity=".22" />
            <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="glow">
            <stop offset="0" stopColor="#6366f1" stopOpacity=".20" />
            <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="1250" cy="220" r="300" fill="url(#glow)" />
        <circle cx="260" cy="790" r="360" fill="url(#glow)" />

        <g className="bg-orbit-1" fill="none" stroke="url(#gridLine)" strokeWidth="1">
          <ellipse cx="800" cy="500" rx="670" ry="270" />
          <ellipse cx="800" cy="500" rx="510" ry="205" />
          <ellipse cx="800" cy="500" rx="350" ry="140" />
        </g>

        <g className="bg-orbit-2" fill="none" stroke="url(#gridLine)" strokeWidth="1">
          <ellipse cx="800" cy="500" rx="560" ry="220" transform="rotate(60 800 500)" />
          <ellipse cx="800" cy="500" rx="410" ry="160" transform="rotate(60 800 500)" />
        </g>

        <g stroke="#64748b" strokeOpacity=".08">
          {Array.from({ length: 17 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="1000" />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 100} x2="1600" y2={i * 100} />
          ))}
        </g>

        <g fill="#818cf8">
          <circle className="bg-node" cx="180" cy="180" r="4" />
          <circle className="bg-node" cx="440" cy="720" r="3" />
          <circle className="bg-node" cx="1080" cy="170" r="4" />
          <circle className="bg-node" cx="1380" cy="700" r="3" />
          <circle className="bg-node" cx="1200" cy="850" r="4" />
          <circle className="bg-node" cx="740" cy="310" r="3" />
        </g>
      </svg>

      <div className="bg-scan absolute -top-24 left-0 h-24 w-full bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />
      <div className="absolute inset-0 bg-[#050816]/55" />
    </div>
  );
}
