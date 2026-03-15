"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Cpu, Zap, Activity, MonitorPlay, Minus } from "lucide-react";
import { Hero3D } from "@/components/Hero3D";
import { HangingBulb } from "@/components/HangingBulb";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CAPABILITIES = [
  { icon: <MonitorPlay className="w-5 h-5 mb-4" style={{ color: "rgba(200,184,154,0.7)" }} />, area: "High-Fidelity Gaming", detail: "Uncompromised framerates at 4K. Path-tracing and ultra settings handled with thermal headroom to spare." },
  { icon: <Activity className="w-5 h-5 mb-4" style={{ color: "rgba(200,184,154,0.7)" }} />, area: "3D Rendering",      detail: "Cinema-grade outputs. Blender Cycles, V-Ray, and Redshift at professional throughput without thermal throttling." },
  { icon: <Zap className="w-5 h-5 mb-4" style={{ color: "rgba(200,184,154,0.7)" }} />, area: "Video Production",  detail: "Real-time 8K playback. DaVinci Resolve and Premiere Pro without generating proxy media." },
  { icon: <Cpu className="w-5 h-5 mb-4" style={{ color: "rgba(200,184,154,0.7)" }} />, area: "Machine Learning",  detail: "CUDA-optimised architectures for local LLM inference, model training, and fine-tuning at scale." },
];

const LINEUP = [
  { tier: "Origin",  tagline: "The entry into serious computing.",            price: "₹2,80,000", image: "/pc_origin_1773575797883.png", specs: ["AMD Ryzen 7 7800X3D", "RX 7900 XTX 24GB", "32GB DDR5", "2TB NVMe"],            cta: "/build" },
  { tier: "Atelier", tagline: "For professionals who cannot afford compromise.", price: "₹5,40,000", image: "/pc_atelier_1773575816810.png", specs: ["AMD Ryzen 9 7950X3D", "RTX 4080 Super 16GB", "64GB DDR5", "4TB NVMe RAID"], cta: "/build", featured: true },
  { tier: "Maison",  tagline: "The flagship. Unambiguously the best.",       price: "₹8,20,000", image: "/pc_maison_1773575836810.png", specs: ["Intel Core i9-14900K", "RTX 4090 FE 24GB", "128GB DDR5", "8TB NVMe RAID"], cta: "/build" },
];

const ENGINEERING = [
  { stat: "< 28 dB", label: "Idle acoustic floor",   note: "Quieter than a library reading room." },
  { stat: "< 38°C",  label: "Idle CPU delta-T",       note: "Measured at 22°C ambient." },
  { stat: "72 hrs",  label: "Burn-in stress period",  note: "Prime95 + FurMark before each shipment." },
  { stat: "3 yr",    label: "Parts & labour warranty", note: "Covered by ASMBLY directly." },
];

// ─── LAYOUT TOKENS ────────────────────────────────────────────────────────────
const C  = "max-w-[1600px] mx-auto w-full px-6 md:px-16 lg:px-24";
const SlideSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <section className={`w-full min-h-screen flex flex-col justify-center relative py-24 ${className}`}>
    {children}
  </section>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const h1Ref   = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef  = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Hero Entrance
      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });
      if (ruleRef.current) tl.from(ruleRef.current, { scaleX: 0, transformOrigin: "left", duration: 0.7 });
      if (h1Ref.current) tl.from(h1Ref.current,   { y: 60, skewY: 2, opacity: 0 }, "-=0.3");
      if (bodyRef.current) tl.from(bodyRef.current, { y: 24, opacity: 0 }, "-=0.65");
      if (ctaRef.current) tl.from(ctaRef.current,  { y: 18, opacity: 0 }, "-=0.55");

      // 2. Vertical Scroll Reveal Animations
      const sections = gsap.utils.toArray<HTMLElement>(".slide-section");
      
      sections.slice(1).forEach((sec) => {
        const content = sec.querySelector(".distortion-target");
        if (content) {
          gsap.fromTo(content, 
            { y: 60, opacity: 0, filter: "blur(8px)" },
            { 
              y: 0, opacity: 1, filter: "blur(0px)",
              ease: "power3.out", duration: 1.2,
              scrollTrigger: {
                trigger: sec,
                start: "top 75%", // Trigger when section top crosses 75% down the viewport
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }); 

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#0A0908] min-h-screen text-white flex flex-col">
      {/* Global Overlays */}
      <div className="grain-overlay fixed inset-0 z-0" aria-hidden="true" />
      <div className="fixed inset-0 pointer-events-none z-10"><HangingBulb /></div>

      <main className="flex flex-col w-full relative z-20 overflow-hidden">
        {/* ════ SECTION 1: HERO ════ */}
        <SlideSection className="slide-section relative">
          <div className="canvas-backlight" />
          <Hero3D />
          <div className={`${C} relative z-20 pointer-events-none`}>
            <div className="w-full md:w-5/12 pointer-events-auto">
              <div ref={ruleRef} className="w-14 h-px mb-[32px] origin-left" style={{ background: "rgba(200,184,154,0.3)" }} />
              <span className="label block mb-[16px]" style={{ color: "rgba(200,184,154,0.4)" }}>
                Bespoke Workstation Studio — Est. 2024
              </span>
              <h1 ref={h1Ref} className="h1 mb-[32px]" style={{ color: "var(--color-foreground)" }}>
                <span className="metallic-text italic">ASMBLY.</span>
              </h1>
              <p ref={bodyRef} className="body-lg mb-[32px]" style={{ color: "rgba(200,184,154,0.4)" }}>
                Bespoke workstations for professionals who demand the absolute best.
                Precision. Provenance. Permanence.
              </p>
              <div ref={ctaRef} className="flex flex-wrap items-center gap-[16px]">
                <Link href="/build" className="ghost-btn group">
                  Explore Builds <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </SlideSection>

        {/* ════ SECTION 2: CAPABILITIES ════ */}
        <SlideSection className="slide-section relative border-l champagne-border">
          <div className={`${C} distortion-target`}>
            <div className="mb-[64px]">
              <span className="label block mb-[16px]" style={{ color: "rgba(200,184,154,0.35)" }}>Capabilities</span>
              <h2 className="h2 max-w-2xl" style={{ color: "var(--color-foreground)" }}>
                Work that demands <span className="metallic-text italic">more.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[32px] gap-y-[48px] max-w-4xl">
              {CAPABILITIES.map((cap, i) => (
                <div key={i} className="flex flex-col">
                  {cap.icon}
                  <h3 className="h3 mb-[12px]" style={{ color: "var(--color-foreground)" }}>{cap.area}</h3>
                  <p className="body-base" style={{ color: "rgba(200,184,154,0.45)" }}>{cap.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </SlideSection>

        {/* ════ SECTION 3: LINEUP ════ */}
        <SlideSection className="slide-section relative border-l champagne-border object-cover">
          <div className={`${C} w-full h-full py-[120px] flex flex-col justify-center distortion-target`}>
            <div className="mb-[64px]">
              <span className="label block mb-[16px]" style={{ color: "rgba(200,184,154,0.35)" }}>The Lineup</span>
              <h2 className="h2" style={{ color: "var(--color-foreground)" }}>
                Three tiers.<br />
                <span className="metallic-text italic">One standard.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
              {LINEUP.map((tier, idx) => (
                <div key={idx} className="warm-glass p-[32px] flex flex-col rounded-sm ring-1 ring-[#c8b89a]/20 group hover:ring-[#c8b89a]/50 transition-all duration-500">
                   <div className="w-full h-[240px] relative mb-[32px] overflow-hidden rounded-sm bg-[#0A0908]">
                      {tier.image && (
                        <Image 
                           src={tier.image} 
                           alt={tier.tier} 
                           fill 
                           className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[0.2] contrast-125"
                        />
                      )}
                      <div className="absolute inset-0 border border-[#c8b89a]/10 pointer-events-none" />
                   </div>
                  <div className="flex items-end justify-between mb-[16px]">
                    <h3 className="text-3xl font-display font-semibold" style={{ color: "var(--color-foreground)" }}>{tier.tier}</h3>
                    <span className="label" style={{ color: "rgba(200,184,154,0.8)" }}>{tier.price}</span>
                  </div>
                  <p className="body-base mb-[32px] min-h-[48px]" style={{ color: "rgba(200,184,154,0.4)" }}>{tier.tagline}</p>
                  
                  <div className="flex-1 mb-[40px]">
                    <ul className="space-y-[12px]">
                      {tier.specs.map((spec, i) => (
                        <li key={i} className="flex items-start gap-[12px]">
                          <Minus className="w-3 h-3 mt-[6px] shrink-0" style={{ color: "rgba(200,184,154,0.3)" }} />
                          <span className="body-base text-[15px]" style={{ color: "rgba(200,184,154,0.6)" }}>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link href={tier.cta} className={`w-full py-[16px] text-center uppercase tracking-widest text-xs font-semibold transition-all duration-300 ${tier.featured ? "bg-[#c8b89a] text-[#0A0908] hover:bg-white" : "bg-transparent border border-[#c8b89a]/30 text-[#c8b89a] hover:bg-[#c8b89a]/10"}`}>
                    Configure {tier.tier}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </SlideSection>

        {/* ════ SECTION 4: ENGINEERING ════ */}
        <SlideSection className="slide-section relative border-l champagne-border">
          <div className={`${C} distortion-target`}>
            <div className="mb-[80px]">
              <span className="label block mb-[16px]" style={{ color: "rgba(200,184,154,0.35)" }}>Engineering</span>
              <h2 className="h2" style={{ color: "var(--color-foreground)" }}>
                The numbers<br />
                <span className="metallic-text italic">that matter.</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-[48px] gap-x-[24px]">
              {ENGINEERING.map((item, i) => (
                <div key={i} className="flex flex-col border-l border-[#c8b89a]/20 pl-[24px]">
                  <span className="text-[3.5rem] md:text-[5rem] font-display font-light leading-none mb-[16px] tracking-tight" style={{ color: "var(--color-foreground)" }}>
                    {item.stat}
                  </span>
                  <span className="body-base font-semibold mb-[4px]" style={{ color: "rgba(200,184,154,0.9)" }}>{item.label}</span>
                  <span className="label" style={{ color: "rgba(200,184,154,0.4)" }}>{item.note}</span>
                </div>
              ))}
            </div>
          </div>
        </SlideSection>

        {/* ════ SECTION 5: BUILD YOUR OWN ════ */}
        <SlideSection className="slide-section relative border-t champagne-border mt-32 mb-32 flex flex-row items-center border-t border-[#c8b89a]/10">
          <div className={`${C} flex flex-col md:flex-row items-center justify-between z-20 w-full h-full pt-16`}>
            
            <div className="w-full md:w-5/12 distortion-target">
              <span className="label block mb-[16px]" style={{ color: "rgba(200,184,154,0.35)" }}>The Configurator</span>
              <h2 className="h1 mb-[32px]" style={{ color: "var(--color-foreground)" }}>
                Build your <span className="metallic-text italic">own.</span>
              </h2>
              <p className="body-lg mb-[48px]" style={{ color: "rgba(200,184,154,0.4)" }}>
                Prefer to select your own components? Enter the Configurator to build a bespoke system tailored exactly to your workflow.
              </p>
              <Link href="/build" className="ghost-btn group inline-flex">
                Enter Configurator <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="w-full md:w-6/12 h-[60vh] relative distortion-target opacity-80 hover:opacity-100 transition-opacity duration-700 mt-12 md:mt-0">
               <Image 
                 src="/pc_disassembled_1773575855274.png"
                 alt="Disassembled PC Components"
                 fill
                 className="object-contain"
               />
            </div>
          </div>
        </SlideSection>

      </main>
    </div>
  );
}
