import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function PageHeader({
  eyebrow,
  title,
  description,
}) {
  const containerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        eyebrowRef.current,
        {
          y: 15,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        }
      )
        .fromTo(
          titleRef.current,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .fromTo(
          descriptionRef.current,
          {
            y: 15,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="mb-8">
      <p
        ref={eyebrowRef}
        className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-400"
      >
        {eyebrow}
      </p>

      <h1
        ref={titleRef}
        className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
      >
        {title}
      </h1>

      <p
        ref={descriptionRef}
        className="mt-3 max-w-2xl text-sm leading-6 text-slate-400"
      >
        {description}
      </p>
    </section>
  );
}