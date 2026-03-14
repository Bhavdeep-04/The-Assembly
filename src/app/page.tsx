"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Hero3D } from "@/components/Hero3D";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    index: "01",
    title: "Premium Selection",
    body: "Curated components from the world's elite manufacturers — each part hand-validated for peak performance.",
  },
  {
    index: "02",
    title: "Guaranteed Compatibility",
    body: "Our logic engine cross-references every part combination in real time so your build is always flawless.",
  },
  {
    index: "03",
    title: "Instant Checkout",
    body: "Review your bespoke configuration and complete your order in seconds through our secure payment flow.",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance — stagger from below with skew
      const headerTl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });
      headerTl
        .from(ruleRef.current, { scaleX: 0, transformOrigin: "left", duration: 0.8, ease: "power3.out" })
        .from(headingRef.current, { y: 60, skewY: 2, opacity: 0 }, "-=0.4")
        .from(subRef.current, { y: 30, opacity: 0 }, "-=0.7")
        .from(ctaRef.current, { y: 20, opacity: 0 }, "-=0.6");

      // Feature cards scroll reveal
      gsap.utils.toArray<HTMLDivElement>(".feature-card").forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          skewY: 1,
          ease: "expo.out",
          duration: 1.0,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          delay: i * 0.08,
        });
      });

      // Section heading reveals
      gsap.utils.toArray<HTMLElement>(".reveal-heading").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          skewY: 1.5,
          ease: "expo.out",
          duration: 1.0,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef as any}>
      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-56px)] flex flex-col justify-center overflow-hidden px-6 md:px-16 lg:px-24">
        {/* Subtle noise/grain overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "256px" }} />

        {/* Thin platinum horizontal rule */}
        <div ref={ruleRef} className="w-16 h-px bg-silver/40 mb-10 origin-left" />

        {/* Eyebrow */}
        <p className="text-[10px] tracking-[0.3em] uppercase text-silver/50 mb-6 font-medium">
          Bespoke PC Configuration Studio
        </p>

        {/* Main heading — cinematic */}
        <h1
          ref={headingRef}
          className="font-display font-light text-[clamp(3.5rem,9vw,9rem)] leading-[0.92] tracking-[-0.02em] text-white max-w-4xl"
        >
          Forge Your <br />
          <span className="metallic-text italic">Ultimate&nbsp;Machine</span>
        </h1>

        <p
          ref={subRef}
          className="mt-10 text-base md:text-lg text-white/40 max-w-lg leading-relaxed font-light"
        >
          The Assembly is a boutique hardware configurator. Select premium parts,
          ensure compatibility, and build a masterpiece tailored precisely to your vision.
        </p>

        {/* CTA row */}
        <div ref={ctaRef} className="mt-12 flex flex-wrap items-center gap-6">
          <Link href="/build" className="ghost-btn group">
            Begin Configuration
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/prebuilts"
            className="flex items-center gap-2 text-xs tracking-[0.12em] uppercase text-white/30 hover:text-white/70 transition-colors"
          >
            View Pre-Builts
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-6 md:left-16 flex items-center gap-3 text-[10px] tracking-widest uppercase text-white/20">
          <span className="w-8 h-px bg-white/20" />
          Scroll to explore
        </div>
      </section>

      {/* ─── 3D SECTION ──────────────────────────────────────── */}
      <Hero3D />

      {/* ─── FEATURES ────────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 py-32 border-t border-white/[0.05]">
        <div className="mb-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-silver/40 mb-4">Why The Assembly</p>
          <h2 className="reveal-heading font-display font-light text-4xl md:text-6xl text-white/90 tracking-tight">
            Precision, <span className="metallic-text italic">by design.</span>
          </h2>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05]">
          {FEATURES.map((f) => (
            <div
              key={f.index}
              className="feature-card group bg-background p-10 hover:bg-surface transition-colors duration-500"
            >
              <span className="text-[10px] tracking-[0.25em] uppercase text-silver/30 mb-6 block">— {f.index}</span>
              <h3 className="text-lg font-medium text-white/90 mb-4 tracking-tight">{f.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed font-light">{f.body}</p>
              <ArrowUpRight className="w-4 h-4 text-silver/20 mt-8 group-hover:text-silver/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* ─── BOTTOM CTA ──────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 py-32 border-t border-white/[0.05] text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase text-silver/40 mb-6">Ready to build?</p>
        <h2 className="reveal-heading font-display font-light text-4xl md:text-7xl text-white mb-12 tracking-tight">
          Your dream rig,<br />
          <span className="metallic-text italic">assembled.</span>
        </h2>
        <Link href="/build" className="ghost-btn group mx-auto">
          Start Building
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
