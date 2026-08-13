import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  HeartPulse,
  ShieldCheck,
  House,
  Mail,
  Car,
  GraduationCap,
  Code2,
  CloudSun
} from "lucide-react";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";


const cards = [
  {
    to: "/heart-disease",
    title: "Heart Disease",
    description:
      "Submit clinical indicators and get a logistic-regression risk classification.",
    icon: HeartPulse,
  },
  {
    to: "/mental-health",
    title: "Mental Health",
    description:
      "Estimate a mental-health score from student lifestyle and social-media data.",
    icon: BrainCircuit,
  },
  {
    to: "/house-prediction",
    title: "House Price",
    description:
      "Predict a house price using property size, rooms, amenities, parking, and furnishing details.",
    icon: House,
  },
  {
    to: "/email-prediction",
    title: "Email spam",
    description: "Prediction whether the mail is spam or ham",
    icon: Mail
  },{
    to: "/car-prediction",
    title: "Car price",
    description: "Car price prediction portal",
    icon: Car
  },{
    to: "/student-prediction",
    title: "Student placement",
    description: "Student can be placed or not",
    icon: GraduationCap
  },{
    to: "/weather_prediction",
    title: "Predict weather",
    description: "Weather prediction",
    icon: CloudSun
  }
];

export default function Home() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const disclaimerRef = useRef(null);
  const orbRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Hero content
      tl.fromTo(
        heroRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Cards
      tl.fromTo(
        cardsRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.45"
      );

      // Disclaimer
      tl.fromTo(
        disclaimerRef.current,
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
        "-=0.35"
      );

      // Floating orb
      if (orbRef.current) {
        gsap.to(orbRef.current, {
          y: -14,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="mx-auto max-w-6xl px-5 pb-20 pt-16"
    >
      {/* Hero */}
      <section ref={heroRef}>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-400">
        Machine Learning + FastAPI + Vite
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Multiple ML models.
          <br />
          <span className="text-indigo-400">One prediction dashboard.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          A React frontend for your FastAPI machine-learning services, with
          animated interfaces, validation, loading states, and API error
          handling.
        </p>
      </section>

      {/* Model Cards */}
      <section className="mt-16 grid gap-5 md:grid-cols-2">
        {cards.map(({ to, title, description, icon: Icon }, index) => (
          <Link
            key={to}
            ref={(element) => {
              cardsRef.current[index] = element;
            }}
            to={to}
            className="glass group rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30"
          >
            <div className="mb-7 flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-400/15">
                <Icon />
              </span>

              <ArrowRight className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-indigo-300" />
            </div>

            <h2 className="text-xl font-bold text-white">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {description}
            </p>
          </Link>
        ))}
      </section>

      {/* Disclaimer */}
      <div
        ref={disclaimerRef}
        className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500"
      >
        <ShieldCheck size={15} className="text-emerald-400" />

        <span>
          Predictions are model outputs, not medical diagnoses.
        </span>
        <button
  className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
>
  <Code2 size={18} />
  Source code
</button>
      </div>
    </main>
  );
}