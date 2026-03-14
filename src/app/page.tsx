"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Minus } from "lucide-react";
import { Hero3D } from "@/components/Hero3D";
import { Processor3D } from "@/components/Processor3D";
import { HangingBulb } from "@/components/HangingBulb";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ─────────────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    no: "001",
    title: "Built for volume, not vision.",
    body: "Mass-market systems are engineered to a price point, not a standard. Corners are cut, thermals are compromised, and nothing is built to last.",
  },
  {
    no: "002",
    title: "RGB is a distraction.",
    body: "The industry sold a generation on spectacle. Flashing lights and logo saturation contribute nothing to what actually matters: performance.",
  },
  {
    no: "003",
    title: "Generic aesthetics, zero provenance.",
    body: "Every workstation looks identical. Professionals deserve a machine that reflects their discipline — designed with the same rigour as the work it powers.",
  },
];

const PRINCIPLES = [
  { index: "I",   label: "No Compromise",          detail: "Every component earns its place. No filler, no redundancy." },
  { index: "II",  label: "Silence as a Feature",   detail: "Thermal engineering optimised for acoustics and thermals simultaneously." },
  { index: "III", label: "Materials That Age Well", detail: "Aluminium, oak, and treated steel. Not plastic panels and painted shrouds." },
  { index: "IV",  label: "Provenance",              detail: "Each build is numbered, documented, and traceable to the engineer who assembled it." },
];

const LINEUP = [
  {
    tier: "Origin",
    tagline: "The entry into serious computing.",
    price: "₹2,80,000",
    specs: ["AMD Ryzen 7 7800X3D", "Sapphire RX 7900 XTX 24GB", "32GB DDR5-6000", "2TB PCIe 5.0 NVMe", "Fractal North — Oak/Steel"],
    cta: "/build",
  },
  {
    tier: "Atelier",
    tagline: "For professionals who cannot afford compromise.",
    price: "₹5,40,000",
    specs: ["AMD Ryzen 9 7950X3D", "ASUS ROG RTX 4080 Super 16GB", "64GB DDR5-6000", "4TB PCIe 5.0 NVMe RAID", "Lian Li O11 Vision"],
    cta: "/build",
    featured: true,
  },
  {
    tier: "Maison",
    tagline: "The flagship. Unambiguously the best.",
    price: "₹8,20,000",
    specs: ["Intel Core i9-14900K", "NVIDIA RTX 4090 Founders Edition 24GB", "128GB DDR5-7200", "8TB NVMe RAID + Cold Storage", "Hyte Y70 Touch — Bespoke Finish"],
    cta: "/build",
  },
];

const ENGINEERING = [
  { stat: "< 28 dB",  label: "Idle acoustic floor",     note: "Quieter than a library reading room." },
  { stat: "< 38°C",   label: "Idle CPU delta-T",         note: "Measured at 22°C ambient." },
  { stat: "72 hrs",   label: "Burn-in stress period",    note: "Prime95 + FurMark before each shipment." },
  { stat: "3 yr",     label: "Parts & labour warranty",  note: "Covered by ASMBLY directly." },
];

const CAPABILITIES = [
  { area: "3D Rendering",      detail: "Cinema-grade outputs. Blender Cycles, V-Ray, and Redshift at professional throughput." },
  { area: "Video Production",  detail: "Real-time 8K playback. DaVinci Resolve and Premiere Pro without proxy workflows." },
  { area: "Machine Learning",  detail: "CUDA-optimised for model training, inference, and fine-tuning at scale." },
  { area: "Engineering & CAD", detail: "SolidWorks, CATIA, and Fusion 360 at maximum simulation fidelity." },
];

// ─── LAYOUT TOKENS ────────────────────────────────────────────────────────────
const C  = "max-w-[1600px] mx-auto w-full px-6 md:px-16 lg:px-24";
const PY = "py-[80px] md:py-[128px]";
const HR = "border-t border-white/[0.05]";

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const pageRef  = useRef<HTMLDivElement>(null);
  const h1Ref    = useRef<HTMLHeadingElement>(null);
  const bodyRef  = useRef<HTMLParagraphElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);
  const ruleRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero entrance ──
      gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } })
        .from(ruleRef.current,  { scaleX: 0, transformOrigin: "left", duration: 0.7 })
        .from(h1Ref.current,    { y: 70, skewY: 2, opacity: 0 }, "-=0.4")
        .from(bodyRef.current,  { y: 28, opacity: 0 }, "-=0.7")
        .from(ctaRef.current,   { y: 20, opacity: 0 }, "-=0.6");

      // ── Scroll reveals ──
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.from(el, {
          y: 48, opacity: 0, skewY: 0.8,
          ease: "expo.out", duration: 1.1,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });

      // ── Stagger children ──
      gsap.utils.toArray<HTMLElement>(".stagger-parent").forEach((parent) => {
        gsap.from(parent.children, {
          y: 32, opacity: 0,
          ease: "expo.out", duration: 0.9, stagger: 0.08,
          scrollTrigger: { trigger: parent, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // ── AMBIENT GLOW from 3D lightbulb — scroll-driven ──
      const ambientGlow = document.getElementById("ambient-glow");
      const bulbCssGlow = document.getElementById("bulb-css-glow");
      if (ambientGlow) {
        gsap.fromTo(ambientGlow,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: "#scene-problem", start: "top bottom", end: "bottom 40%", scrub: 1.5 },
          }
        );
      }
      if (bulbCssGlow) {
        gsap.fromTo(bulbCssGlow,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: "#scene-problem", start: "top 80%", end: "bottom 40%", scrub: 1.5 },
          }
        );
      }

      // ── ZOOM / SCALE TRANSITIONS on scroll ──
      // Section zoom-in: sections scale from 0.92 to 1 as they enter viewport
      gsap.utils.toArray<HTMLElement>(".zoom-section").forEach((section) => {
        gsap.fromTo(section, {
          scale: 0.92,
          opacity: 0.6,
        }, {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "top 30%",
            scrub: 1,
          },
        });
      });

      // ── Horizontal line-draw on scroll ──
      gsap.utils.toArray<HTMLElement>(".line-draw").forEach((line) => {
        gsap.fromTo(line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: line, start: "top 90%", end: "top 60%", scrub: 1 },
          }
        );
      });

      // ── Counter animations for engineering stats ──
      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
        gsap.from(el, {
          textContent: 0,
          duration: 1.5,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });

    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="relative z-10">

      {/* ═══════════════════════════════
          3D HANGING LIGHTBULB — fixed, right side
      ═══════════════════════════════ */}
      <HangingBulb />

      {/* Ambient glow overlay — warm light cast by the bulb onto the page */}
      <div
        id="ambient-glow"
        className="fixed top-0 right-0 w-[50vw] h-[60vh] pointer-events-none z-30 opacity-0 hidden lg:block"
        style={{
          background: "radial-gradient(ellipse at 85% 15%, rgba(255,232,192,0.04) 0%, rgba(255,232,192,0.01) 40%, transparent 70%)",
        }}
      />

      {/* ══════════════════════════════════════════════
          01 · HERO
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden xl:overflow-visible">
        {/* Grain texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "256px" }} />

        {/* 3D Model */}
        <Hero3D />

        <div className={`${C} relative z-20 pointer-events-none`}>
          <div className="w-full md:w-6/12 lg:w-5/12 pointer-events-auto">
            <div ref={ruleRef} className="w-14 h-px bg-silver/35 mb-[32px] origin-left" />
            <span className="label text-silver/35 block mb-[16px]">Bespoke Workstation Studio — Est. 2024</span>

            <h1 ref={h1Ref} className="h1 text-white mb-[32px]">
              <span className="metallic-text italic">ASMBLY.</span>
            </h1>

            <p ref={bodyRef} className="body-lg text-white/35 mb-[32px]">
              Bespoke workstations for professionals who demand the absolute best.
              Precision. Provenance. Permanence.
            </p>

            <div ref={ctaRef} className="flex flex-wrap items-center gap-[16px]">
              <Link href="/build" className="ghost-btn group">
                Explore Builds <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/prebuilts" className="label text-white/25 hover:text-white/60 transition-colors flex items-center gap-[8px]">
                View Pre-Configured <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="px-6 md:px-16 lg:px-24 absolute bottom-[40px] pointer-events-none">
          <div className="flex items-center gap-[12px] label text-white/15">
            <span className="w-8 h-px bg-white/20" /> Scroll
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          02 · PROBLEM  — zoom-section for scale entrance
      ══════════════════════════════════════════════ */}
      <section id="scene-problem" className={`relative ${HR} overflow-hidden bg-background zoom-section`}>
        {/* Ryzen Processor Model */}
        <Processor3D />

        <div className={`${C} ${PY} relative z-20 pointer-events-none`}>
          <div className="w-full md:w-6/12 lg:w-5/12 mb-[64px] pointer-events-auto">
            <div className="line-draw w-16 h-px bg-silver/20 mb-[24px] origin-left" />
            <span className="label text-silver/35 block mb-[16px]">The Problem</span>
            <h2 className="h2 text-white reveal-up">
              The industry stopped caring<br />
              <span className="metallic-text italic">about you.</span>
            </h2>
          </div>

          {/* 3-column problem grid */}
          <div className="stagger-parent grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-white/[0.04] p-px pointer-events-auto">
            {PROBLEMS.map((p) => (
              <div key={p.no} className="bg-background p-[32px] md:p-[40px]">
                <span className="label text-silver/20 block mb-[16px]">{p.no}</span>
                <h3 className="h3 text-white/80 mb-[12px]">{p.title}</h3>
                <p className="body-sm text-white/30">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          03 · PHILOSOPHY — zoom-section
      ══════════════════════════════════════════════ */}
      <section className={`${HR} bg-background relative z-10 zoom-section`}>
        <div className={`${C} ${PY}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[32px] md:gap-[64px] items-start">

            <div className="md:col-span-5">
              <div className="line-draw w-16 h-px bg-silver/20 mb-[24px] origin-left" />
              <span className="label text-silver/35 block mb-[16px]">Our Philosophy</span>
              <h2 className="h2 text-white reveal-up mb-[32px]">
                Four principles.<br />
                <span className="metallic-text italic">No exceptions.</span>
              </h2>
              <p className="body-lg text-white/30">
                ASMBLY was founded on the belief that a workstation should be an instrument —
                built with the same intentionality as a fine watch or a precision camera.
              </p>
            </div>

            <div className="md:col-span-7 stagger-parent divide-y divide-white/[0.06]">
              {PRINCIPLES.map((p) => (
                <div key={p.index} className="py-[24px] grid grid-cols-[32px_1fr] gap-[16px] group">
                  <span className="label text-silver/20 mt-[2px] font-mono">{p.index}</span>
                  <div>
                    <p className="h3 text-white/80 mb-[6px] group-hover:text-white transition-colors duration-300">{p.label}</p>
                    <p className="body-sm text-white/25">{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          04 · PRODUCT LINEUP — zoom-section
      ══════════════════════════════════════════════ */}
      <section id="scene-lineup" className={`relative ${HR} overflow-hidden bg-background zoom-section`}>
        <div className={`${C} ${PY} relative z-10`}>
          <div className="w-full md:w-8/12 mb-[64px]">
            <div className="line-draw w-16 h-px bg-silver/20 mb-[24px] origin-left" />
            <span className="label text-silver/35 block mb-[16px]">The Lineup</span>
            <h2 className="h2 text-white reveal-up">
              Three tiers.<br />
              <span className="metallic-text italic">One standard.</span>
            </h2>
          </div>

          <div className="stagger-parent grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-white/[0.04] p-px">
            {LINEUP.map((tier) => (
              <div
                key={tier.tier}
                className={`relative bg-background flex flex-col transition-colors duration-500 hover:bg-surface group ${tier.featured ? "ring-1 ring-inset ring-silver/15" : ""}`}
              >
                {tier.featured && (
                  <span className="absolute top-0 left-[32px] -translate-y-1/2 label bg-surface border border-silver/20 text-silver/50 px-3 py-[6px]">
                    Most Selected
                  </span>
                )}

                <div className="p-[32px] md:p-[40px] flex flex-col flex-1">
                  <div className="mb-[32px]">
                    <p className="font-display font-light text-2xl text-white tracking-tight mb-[8px]">{tier.tier}</p>
                    <p className="body-sm text-white/30">{tier.tagline}</p>
                  </div>

                  <ul className="space-y-[10px] mb-[32px] flex-1">
                    {tier.specs.map((s) => (
                      <li key={s} className="flex items-start gap-[10px] body-sm text-white/35">
                        <Minus className="w-3 h-3 text-silver/20 mt-[3px] shrink-0" />{s}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-white/[0.06] pt-[24px] flex items-end justify-between">
                    <div>
                      <span className="label text-silver/25 block mb-[4px]">From</span>
                      <p className="font-display text-2xl text-white font-light tracking-tight">{tier.price}</p>
                    </div>
                    <Link href={tier.cta} className="label text-silver/35 group-hover:text-silver flex items-center gap-[8px] transition-colors">
                      Configure <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          05 · ENGINEERING — zoom-section
      ══════════════════════════════════════════════ */}
      <section className={`${HR} bg-background zoom-section`}>
        <div className={`${C} ${PY}`}>

          <div className="w-full md:w-8/12 mb-[64px]">
            <div className="line-draw w-16 h-px bg-silver/20 mb-[24px] origin-left" />
            <span className="label text-silver/35 block mb-[16px]">Engineering</span>
            <h2 className="h2 text-white reveal-up">
              The numbers<br />
              <span className="metallic-text italic">that matter.</span>
            </h2>
          </div>

          <div className="stagger-parent grid grid-cols-2 md:grid-cols-4 gap-[2px] bg-white/[0.04] p-px mb-[2px]">
            {ENGINEERING.map((e) => (
              <div key={e.stat} className="bg-background p-[32px] md:p-[40px]">
                <p className="font-display font-light text-4xl md:text-5xl text-white mb-[8px] tracking-tight">{e.stat}</p>
                <p className="label text-silver/35 mb-[8px]">{e.label}</p>
                <p className="body-sm text-white/25">{e.note}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-[2px] bg-white/[0.04] p-px">
            <div className="md:col-span-6 bg-background p-[40px] md:p-[64px]">
              <span className="label text-silver/25 block mb-[32px]">Process</span>
              <blockquote className="font-display font-light text-2xl text-white/80 leading-snug mb-[24px]">
                "We don't build computers.<br />We engineer instruments."
              </blockquote>
              <p className="body-sm text-white/25">
                Every system undergoes a 72-hour burn-in under Prime95 and FurMark simultaneously.
                Only after passing our thermal and stability benchmarks does a unit leave our workshop.
              </p>
            </div>
            <div className="md:col-span-6 bg-surface/40 p-[40px] md:p-[64px]">
              <span className="label text-silver/25 block mb-[32px]">Materials</span>
              <ul className="space-y-[16px]">
                {[
                  "Aerospace-grade aluminium shrouds",
                  "Solid oak side panels — heat-treated",
                  "Vibration-damped PSU mounts",
                  "Silicone-grommeted cable routing",
                  "Anti-resonance chassis dampening",
                ].map((m) => (
                  <li key={m} className="flex items-center gap-[12px] body-sm text-white/30">
                    <span className="w-1 h-1 rounded-full bg-silver/25 shrink-0" />{m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          06 · CAPABILITIES — zoom-section
      ══════════════════════════════════════════════ */}
      <section className={`${HR} bg-background zoom-section`}>
        <div className={`${C} ${PY}`}>

          <div className="w-full md:w-8/12 mb-[64px]">
            <div className="line-draw w-16 h-px bg-silver/20 mb-[24px] origin-left" />
            <span className="label text-silver/35 block mb-[16px]">Built For</span>
            <h2 className="h2 text-white reveal-up">
              Work that demands<br />
              <span className="metallic-text italic">more.</span>
            </h2>
          </div>

          <div className="divide-y divide-white/[0.05]">
            {CAPABILITIES.map((c, i) => (
              <div key={c.area} className="grid grid-cols-12 gap-[32px] items-start py-[32px] group hover:bg-surface/20 px-[16px] -mx-[16px] transition-colors duration-300 rounded-sm">
                <span className="col-span-1 label text-silver/15 font-mono pt-[2px]">0{i + 1}</span>
                <p className="col-span-3 h3 text-white/65 group-hover:text-white/90 transition-colors duration-300">{c.area}</p>
                <p className="col-span-8 body-sm text-white/25 pt-[2px]">{c.detail}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          07 · FINAL CTA
      ══════════════════════════════════════════════ */}
      <section className={`${HR} bg-background`}>
        <div className={`${C} ${PY} text-center`}>
          <span className="label text-silver/25 block mb-[32px]">Your Build Awaits</span>
          <h2 className="h1 text-white mb-[24px] reveal-up">
            Begin your<br />
            <span className="metallic-text italic">ASMBLY.</span>
          </h2>
          <p className="body-lg text-white/25 mx-auto mb-[48px]">
            Configure a bespoke workstation or explore our pre-validated signature builds.
            Every machine is assembled by hand, to order.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-[16px]">
            <Link href="/build" className="ghost-btn group">
              Configure Your Build <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/prebuilts" className="label text-white/25 hover:text-white/60 flex items-center gap-[8px] transition-colors">
              Browse Signature Series <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
