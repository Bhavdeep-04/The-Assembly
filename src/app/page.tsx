"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Hero3D } from "@/components/Hero3D";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── HERO ENTRANCE ──────────────────────────────────────
      gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } })
        .from(ruleRef.current, { scaleX: 0, transformOrigin: "left", duration: 0.8, ease: "power3.out" })
        .from(headingRef.current, { y: 70, skewY: 2.5, opacity: 0 }, "-=0.4")
        .from(subRef.current, { y: 30, opacity: 0, duration: 1.0 }, "-=0.7")
        .from(ctaRef.current, { y: 20, opacity: 0, duration: 1.0 }, "-=0.6");

      // ── SECTION HEADING REVEALS ──────────────────────────
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.from(el, {
          y: 50, opacity: 0, skewY: 1.5,
          ease: "expo.out", duration: 1.1,
          scrollTrigger: {
            trigger: el, start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      // ── FEATURE CARDS ────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".feature-card").forEach((card, i) => {
        gsap.from(card, {
          y: 40, opacity: 0,
          ease: "expo.out", duration: 1.0,
          delay: i * 0.07,
          scrollTrigger: {
            trigger: card, start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      // ── VISION IMAGE PARALLAX ─────────────────────────────
      gsap.to("#vision-img", {
        yPercent: -12, ease: "none",
        scrollTrigger: {
          trigger: "#scene-vision",
          start: "top bottom", end: "bottom top",
          scrub: 1,
        },
      });

      // ── SIGNATURE IMAGE PARALLAX ──────────────────────────
      gsap.to("#signature-img", {
        yPercent: -10, ease: "none",
        scrollTrigger: {
          trigger: "#scene-signature",
          start: "top bottom", end: "bottom top",
          scrub: 1,
        },
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>

      {/* ── FIXED 3D CANVAS — always behind ─────────────────── */}
      <Hero3D scrollContainerId="scroll-root" />

      {/* ── SCROLL ROOT — all content floats above canvas ────── */}
      <div id="scroll-root" className="relative" style={{ zIndex: 1 }}>

        {/* ══ SCENE 1 · HERO ════════════════════════════════════ */}
        <section
          id="scene-hero"
          className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24"
        >
          {/* grain */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "256px" }} />

          {/* Thin rule */}
          <div ref={ruleRef} className="w-16 h-px bg-silver/40 mb-10 origin-left" />

          {/* Eyebrow */}
          <p className="text-[10px] tracking-[0.3em] uppercase text-silver/50 mb-6 font-medium">
            Bespoke PC Configuration Studio
          </p>

          {/* Hero heading */}
          <h1
            ref={headingRef}
            className="font-display font-light text-[clamp(3.5rem,9vw,9rem)] leading-[0.92] tracking-[-0.02em] text-white max-w-4xl"
          >
            The<br />
            <span className="metallic-text italic">Assembly.</span>
          </h1>

          <p ref={subRef} className="mt-10 text-base md:text-lg text-white/40 max-w-md leading-relaxed font-light">
            A boutique hardware configurator for those who demand the absolute best.
            Precision, performance, provenance.
          </p>

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

          <div className="absolute bottom-10 left-6 md:left-16 flex items-center gap-3 text-[10px] tracking-widest uppercase text-white/20">
            <span className="w-8 h-px bg-white/20" />
            Scroll to explore
          </div>
        </section>

        {/* ══ SCENE 2 · THE VISION ══════════════════════════════ */}
        <section
          id="scene-vision"
          className="relative min-h-screen flex items-center px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/[0.04]"
        >
          {/* Background image */}
          <div className="absolute inset-0 overflow-hidden">
            <div id="vision-img" className="absolute inset-0 scale-110">
              <Image
                src="/vision-bg.png"
                alt="Motherboard macro"
                fill
                className="object-cover opacity-20"
                priority={false}
              />
              {/* Platinum border vignette */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
            </div>
          </div>

          {/* Content — right-aligned to leave room for 3D model on left */}
          <div className="relative z-10 ml-auto max-w-xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-silver/40 mb-6">The Vision</p>
            <h2 className="reveal-up font-display font-light text-4xl md:text-6xl text-white leading-[1.05] tracking-tight mb-8">
              Quiet luxury,<br />
              <span className="metallic-text italic">engineered.</span>
            </h2>
            <p className="reveal-up text-sm text-white/40 leading-relaxed font-light max-w-md">
              Every component is selected for its contribution to something greater — a machine
              that performs without compromise and endures without apology. No RGB. No noise.
              Only precision.
            </p>
            <div className="reveal-up mt-10 w-12 h-px bg-silver/30" />
            <p className="reveal-up mt-4 text-[10px] tracking-[0.25em] uppercase text-silver/30">
              Crafted for those who know the difference
            </p>
          </div>
        </section>

        {/* ══ SCENE 3 · SIGNATURE SERIES ══════════════════════════ */}
        <section
          id="scene-signature"
          className="relative min-h-screen flex items-center px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/[0.04]"
        >
          {/* Background image */}
          <div className="absolute inset-0 overflow-hidden">
            <div id="signature-img" className="absolute inset-0 scale-110">
              <Image
                src="/signature-bg.png"
                alt="Desert sand PC workspace"
                fill
                className="object-cover opacity-25"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-background" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
            </div>
          </div>

          {/* Content — left-aligned, model now on right side */}
          <div className="relative z-10 max-w-xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-silver/40 mb-6">The Signature Series</p>
            <h2 className="reveal-up font-display font-light text-4xl md:text-6xl text-white leading-[1.05] tracking-tight mb-8">
              Desert Sand,<br />
              <span className="metallic-text italic">bespoke.</span>
            </h2>
            <p className="reveal-up text-sm text-white/40 leading-relaxed font-light max-w-md">
              Our debut Signature Series marries the warmth of natural oak with matte
              aluminium in charcoal. Silence-optimised. Hand-assembled. Limited to twelve
              units per quarter.
            </p>

            <div className="reveal-up mt-10 flex gap-4">
              <Link href="/build" className="ghost-btn group">
                Configure Yours
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ FEATURES GRID ══════════════════════════════════════ */}
        <section className="px-6 md:px-16 lg:px-24 py-32 border-t border-white/[0.05]">
          <div className="mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-silver/40 mb-4">Why The Assembly</p>
            <h2 className="reveal-up font-display font-light text-4xl md:text-6xl text-white/90 tracking-tight">
              Precision, <span className="metallic-text italic">by design.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05]">
            {[
              { index: "01", title: "Premium Selection", body: "Curated components from the world's elite manufacturers — each part hand-validated for peak performance." },
              { index: "02", title: "Guaranteed Compatibility", body: "Our logic engine cross-references every part combination in real time so your build is always flawless." },
              { index: "03", title: "Instant Checkout", body: "Review your bespoke configuration and complete your order in seconds through our secure payment flow." },
            ].map((f) => (
              <div key={f.index} className="feature-card group bg-background p-10 hover:bg-surface transition-colors duration-500">
                <span className="text-[10px] tracking-[0.25em] uppercase text-silver/30 mb-6 block">— {f.index}</span>
                <h3 className="text-lg font-medium text-white/90 mb-4 tracking-tight">{f.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed font-light">{f.body}</p>
                <ArrowUpRight className="w-4 h-4 text-silver/20 mt-8 group-hover:text-silver/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>
            ))}
          </div>
        </section>

        {/* ══ BOTTOM CTA ═════════════════════════════════════════ */}
        <section className="px-6 md:px-16 lg:px-24 py-32 border-t border-white/[0.05] text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-silver/40 mb-6">Ready to build?</p>
          <h2 className="reveal-up font-display font-light text-4xl md:text-7xl text-white mb-12 tracking-tight">
            Your dream rig,<br />
            <span className="metallic-text italic">assembled.</span>
          </h2>
          <Link href="/build" className="ghost-btn group inline-flex">
            Start Building
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </div>
    </div>
  );
}
