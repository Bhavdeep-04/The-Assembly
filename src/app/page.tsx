"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Minus } from "lucide-react";
import { Hero3D } from "@/components/Hero3D";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ──────────────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    no: "001",
    title: "Built for volume, not vision.",
    body: "Mass-market systems are engineered to a price point, not a standard. Corners are cut, thermals are compromised, and nothing is built to last.",
  },
  {
    no: "002",
    title: "RGB is a distraction.",
    body: "The industry sold a generation on spectacle. Flashing lights, busy shrouds, and logo saturation — none of it contributes to what actually matters: performance.",
  },
  {
    no: "003",
    title: "Generic aesthetics, zero provenance.",
    body: "Every workstation looks identical. Professionals deserve a machine that reflects their discipline — designed with the same rigour as the work it powers.",
  },
];

const PRINCIPLES = [
  { index: "I", label: "No Compromise", detail: "Every component earns its place. No filler, no redundancy." },
  { index: "II", label: "Silence as a Feature", detail: "Thermal engineering optimised for acoustics and thermals simultaneously." },
  { index: "III", label: "Materials That Age Well", detail: "Aluminium, oak, and treated steel. Not plastic panels and painted shrouds." },
  { index: "IV", label: "Provenance", detail: "Each build is numbered, documented, and traceable to the engineer who assembled it." },
];

const LINEUP = [
  {
    tier: "Origin",
    tagline: "The entry into serious computing.",
    base: "Ryzen 7 7800X3D · RX 7900 XTX",
    price: "₹2,80,000",
    specs: ["AMD Ryzen 7 7800X3D", "Sapphire RX 7900 XTX 24GB", "32GB DDR5-6000", "2TB PCIe 5.0 NVMe", "Fractal North — Oak/Steel"],
    cta: "/build",
  },
  {
    tier: "Atelier",
    tagline: "For professionals who cannot afford compromise.",
    base: "Ryzen 9 7950X3D · RTX 4080 Super",
    price: "₹5,40,000",
    specs: ["AMD Ryzen 9 7950X3D", "ASUS ROG RTX 4080 Super 16GB", "64GB DDR5-6000", "4TB PCIe 5.0 NVMe RAID", "Lian Li O11 Vision"],
    cta: "/build",
    featured: true,
  },
  {
    tier: "Maison",
    tagline: "The flagship. Unambiguously the best.",
    base: "i9-14900K · RTX 4090 FE",
    price: "₹8,20,000",
    specs: ["Intel Core i9-14900K", "NVIDIA RTX 4090 Founders Edition 24GB", "128GB DDR5-7200", "8TB NVMe RAID + Cold Storage", "Hyte Y70 Touch — Bespoke Finish"],
    cta: "/build",
  },
];

const ENGINEERING = [
  { stat: "< 28 dB", label: "Idle acoustic floor", note: "Quieter than a library reading room." },
  { stat: "< 38°C", label: "Idle CPU delta-T", note: "Measured at 22°C ambient." },
  { stat: "72 hrs", label: "Burn-in duration", note: "Prime95 + FurMark stress before shipment." },
  { stat: "3 yr", label: "Parts & labour warranty", note: "Covered by The Assembly directly, not the OEM." },
];

const CAPABILITIES = [
  { no: "—", area: "3D Rendering", detail: "Cinema-grade outputs. Blender Cycles, V-Ray, and Redshift at professional throughput." },
  { no: "—", area: "Video Production", detail: "Real-time 8K playback. DaVinci Resolve, After Effects, and Premiere Pro without proxy workflows." },
  { no: "—", area: "Machine Learning", detail: "CUDA-optimised configurations for model training, inference, and fine-tuning." },
  { no: "—", area: "Engineering & CAD", label: "SolidWorks, CATIA, and Fusion 360 at maximum simulation fidelity." },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Hero entrance
      gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } })
        .from(ruleRef.current, { scaleX: 0, transformOrigin: "left", duration: 0.7 })
        .from(headingRef.current, { y: 80, skewY: 2.5, opacity: 0 }, "-=0.4")
        .from(subRef.current, { y: 30, opacity: 0 }, "-=0.7")
        .from(ctaRef.current, { y: 20, opacity: 0 }, "-=0.6");

      // Generic scroll reveals
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.from(el, {
          y: 50, opacity: 0, skewY: 1,
          ease: "expo.out", duration: 1.1,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });

      // Stagger children
      gsap.utils.toArray<HTMLElement>(".stagger-parent").forEach((parent) => {
        gsap.from(parent.children, {
          y: 40, opacity: 0,
          ease: "expo.out", duration: 0.9,
          stagger: 0.1,
          scrollTrigger: { trigger: parent, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // Image parallax
      ["#vision-img", "#signature-img"].forEach((id, i) => {
        gsap.to(id, {
          yPercent: -10 - i * 2, ease: "none",
          scrollTrigger: {
            trigger: id.replace("-img", ""),
            start: "top bottom", end: "bottom top", scrub: 1,
          },
        });
      });

    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      {/* Fixed R3F canvas layer */}
      <Hero3D scrollContainerId="scroll-root" />

      <div id="scroll-root" className="relative" style={{ zIndex: 1 }}>

        {/* ══════════════════════════════════════════════
            01 · HERO
        ══════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24">
          {/* grain */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "256px" }} />

          <div ref={ruleRef} className="w-14 h-px bg-silver/40 mb-10 origin-left" />
          <p className="text-[9px] tracking-[0.35em] uppercase text-silver/40 mb-6">Bespoke Workstation Studio — Est. 2024</p>

          <h1 ref={headingRef} className="font-display font-light text-[clamp(4rem,9.5vw,9.5rem)] leading-[0.9] tracking-[-0.025em] text-white max-w-5xl">
            The<br />
            <span className="metallic-text italic">Assembly.</span>
          </h1>

          <p ref={subRef} className="mt-10 text-sm md:text-base text-white/35 max-w-sm leading-relaxed font-light">
            Bespoke workstations for professionals who demand the absolute best.
            Precision. Provenance. Permanence.
          </p>

          <div ref={ctaRef} className="mt-12 flex flex-wrap items-center gap-6">
            <Link href="/build" className="ghost-btn group">
              Explore Builds <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/prebuilts" className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-white/25 hover:text-white/60 transition-colors">
              View Pre-Configured <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="absolute bottom-10 left-6 md:left-16 flex items-center gap-3 text-[9px] tracking-widest uppercase text-white/15">
            <span className="w-8 h-px bg-white/20" /> Scroll
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            02 · PROBLEM
        ══════════════════════════════════════════════ */}
        <section id="scene-vision" className="relative min-h-screen flex items-center px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/[0.04]">
          <div className="absolute inset-0 overflow-hidden">
            <div id="vision-img" className="absolute inset-0 scale-110">
              <Image src="/vision-bg.png" alt="" fill className="object-cover opacity-[0.12]" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background" />
              <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
            </div>
          </div>

          <div className="relative z-10 w-full max-w-5xl ml-auto">
            <div className="mb-16">
              <p className="text-[9px] tracking-[0.35em] uppercase text-silver/35 mb-5">The Problem</p>
              <h2 className="reveal-up font-display font-light text-4xl md:text-6xl text-white leading-[1.05] tracking-tight">
                The industry stopped caring<br />
                <span className="metallic-text italic">about you.</span>
              </h2>
            </div>

            <div className="stagger-parent grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
              {PROBLEMS.map((p) => (
                <div key={p.no} className="bg-background p-8 md:p-10 border-t border-white/[0.04]">
                  <span className="text-[9px] tracking-[0.3em] text-silver/20 block mb-5">{p.no}</span>
                  <h3 className="text-base font-medium text-white/85 mb-3 tracking-tight">{p.title}</h3>
                  <p className="text-xs text-white/30 leading-relaxed font-light">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            03 · BRAND PHILOSOPHY
        ══════════════════════════════════════════════ */}
        <section className="relative px-6 md:px-16 lg:px-24 py-36 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
            <div>
              <p className="text-[9px] tracking-[0.35em] uppercase text-silver/35 mb-5">Our Philosophy</p>
              <h2 className="reveal-up font-display font-light text-4xl md:text-6xl text-white leading-[1.05] tracking-tight">
                Four principles.<br />
                <span className="metallic-text italic">No exceptions.</span>
              </h2>
              <p className="mt-8 text-sm text-white/30 leading-relaxed font-light max-w-sm">
                The Assembly was founded on the belief that a workstation should be an instrument —
                built with the same intentionality as a fine watch or a precision camera.
              </p>
            </div>

            <div className="stagger-parent space-y-0 divide-y divide-white/[0.06]">
              {PRINCIPLES.map((p) => (
                <div key={p.index} className="py-7 flex items-start gap-6 group">
                  <span className="text-[9px] tracking-widest text-silver/20 mt-1 w-6 shrink-0 font-mono">{p.index}</span>
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-1.5 tracking-tight group-hover:text-white transition-colors">{p.label}</p>
                    <p className="text-xs text-white/25 font-light leading-relaxed">{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            04 · PRODUCT LINEUP
        ══════════════════════════════════════════════ */}
        <section id="scene-signature" className="relative min-h-screen flex items-center px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/[0.04]">
          <div className="absolute inset-0 overflow-hidden">
            <div id="signature-img" className="absolute inset-0 scale-110">
              <Image src="/signature-bg.png" alt="" fill className="object-cover opacity-[0.15]" />
              <div className="absolute inset-0 bg-gradient-to-l from-background via-background/50 to-background" />
              <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
            </div>
          </div>

          <div className="relative z-10 w-full py-24">
            <div className="mb-16">
              <p className="text-[9px] tracking-[0.35em] uppercase text-silver/35 mb-5">The Lineup</p>
              <h2 className="reveal-up font-display font-light text-4xl md:text-6xl text-white tracking-tight">
                Three tiers.<br />
                <span className="metallic-text italic">One standard.</span>
              </h2>
            </div>

            <div className="stagger-parent grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
              {LINEUP.map((tier) => (
                <div
                  key={tier.tier}
                  className={`relative bg-background p-8 md:p-10 flex flex-col transition-colors duration-500 hover:bg-surface group ${tier.featured ? "ring-1 ring-inset ring-silver/15" : ""}`}
                >
                  {tier.featured && (
                    <span className="absolute top-0 left-10 -translate-y-1/2 text-[8px] tracking-[0.3em] uppercase bg-silver/10 border border-silver/20 text-silver/60 px-3 py-1">
                      Most Selected
                    </span>
                  )}
                  <div className="mb-8">
                    <p className="font-display text-2xl font-light text-white tracking-tight mb-2">{tier.tier}</p>
                    <p className="text-[10px] tracking-wide text-white/30 font-light">{tier.tagline}</p>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {tier.specs.map((s) => (
                      <li key={s} className="flex items-start gap-2.5 text-[11px] text-white/40 font-light">
                        <Minus className="w-3 h-3 text-silver/20 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-white/[0.06] pt-6 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] tracking-widest text-silver/30 uppercase mb-1">From</p>
                      <p className="font-display text-2xl text-white font-light tracking-tight">{tier.price}</p>
                    </div>
                    <Link href={tier.cta} className="flex items-center gap-1.5 text-[10px] tracking-[0.12em] uppercase text-silver/40 group-hover:text-silver transition-colors">
                      Configure <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            05 · CRAFTSMANSHIP
        ══════════════════════════════════════════════ */}
        <section className="px-6 md:px-16 lg:px-24 py-36 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto">
            <div className="mb-20">
              <p className="text-[9px] tracking-[0.35em] uppercase text-silver/35 mb-5">Engineering</p>
              <h2 className="reveal-up font-display font-light text-4xl md:text-6xl text-white tracking-tight">
                The numbers<br />
                <span className="metallic-text italic">that matter.</span>
              </h2>
            </div>

            <div className="stagger-parent grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04]">
              {ENGINEERING.map((e) => (
                <div key={e.stat} className="bg-background p-8 md:p-10">
                  <p className="font-display text-4xl md:text-5xl font-light text-white mb-2 tracking-tight">{e.stat}</p>
                  <p className="text-[10px] uppercase tracking-widest text-silver/40 font-medium mb-3">{e.label}</p>
                  <p className="text-[11px] text-white/20 font-light leading-relaxed">{e.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
              <div className="bg-background p-10 md:p-14">
                <p className="text-[9px] tracking-[0.35em] uppercase text-silver/30 mb-6">Process</p>
                <p className="font-display font-light text-2xl text-white/80 leading-snug mb-6">
                  "We don't build computers.<br />We engineer instruments."
                </p>
                <p className="text-xs text-white/25 max-w-sm leading-relaxed font-light">
                  Every system undergoes a 72-hour burn-in stress test under Prime95 and FurMark
                  simultaneously. Only after passing thermal and stability benchmarks does a unit
                  leave our workshop.
                </p>
              </div>
              <div className="bg-surface/50 p-10 md:p-14 flex flex-col justify-between">
                <p className="text-[9px] tracking-[0.35em] uppercase text-silver/30 mb-6">Materials</p>
                <div className="space-y-5 flex-1">
                  {["Aerospace-grade aluminium shrouds", "Solid oak side panels — heat-treated", "Vibration-damped PSU mounts", "Silicone-grommeted cable routing", "Anti-resonance chassis dampening"].map((m) => (
                    <div key={m} className="flex items-center gap-3 text-xs text-white/35 font-light">
                      <span className="w-1 h-1 rounded-full bg-silver/30 shrink-0" /> {m}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            06 · CAPABILITIES
        ══════════════════════════════════════════════ */}
        <section className="px-6 md:px-16 lg:px-24 py-36 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto">
            <div className="mb-20">
              <p className="text-[9px] tracking-[0.35em] uppercase text-silver/35 mb-5">Built For</p>
              <h2 className="reveal-up font-display font-light text-4xl md:text-6xl text-white tracking-tight">
                Work that demands<br />
                <span className="metallic-text italic">more.</span>
              </h2>
            </div>

            <div className="divide-y divide-white/[0.05]">
              {CAPABILITIES.map((c, i) => (
                <div key={c.area} className="flex items-start gap-8 py-8 group hover:bg-surface/30 px-4 -mx-4 transition-colors duration-300">
                  <span className="text-[9px] font-mono text-silver/15 w-6 mt-1 shrink-0">0{i + 1}</span>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
                    <p className="text-sm font-medium text-white/70 tracking-tight group-hover:text-white transition-colors">{c.area}</p>
                    <p className="text-xs text-white/25 leading-relaxed font-light">{c.detail || c.label}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-silver/10 group-hover:text-silver/40 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            07 · FINAL CTA
        ══════════════════════════════════════════════ */}
        <section className="px-6 md:px-16 lg:px-24 py-40 border-t border-white/[0.04] text-center">
          <p className="text-[9px] tracking-[0.4em] uppercase text-silver/30 mb-8">Your Build Awaits</p>
          <h2 className="reveal-up font-display font-light text-5xl md:text-8xl text-white mb-6 tracking-tight leading-[0.9]">
            Begin your<br />
            <span className="metallic-text italic">Assembly.</span>
          </h2>
          <p className="text-sm text-white/25 max-w-md mx-auto leading-relaxed font-light mb-14">
            Configure a bespoke workstation or explore our pre-validated signature builds.
            Every machine is assembled by hand, to order.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/build" className="ghost-btn group">
              Configure Your Build <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/prebuilts" className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-white/25 hover:text-white/60 transition-colors">
              Browse Signature Series <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
