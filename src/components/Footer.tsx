import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.05] mt-auto">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="block mb-5 w-fit">
              <span className="font-display text-xl font-light tracking-[0.15em] uppercase metallic-text">
                ASMBLY
              </span>
            </Link>
            <p className="text-xs text-white/30 leading-relaxed max-w-xs font-light">
              A boutique PC hardware configurator for those who demand the absolute best.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] mb-5">Explore</h3>
            <ul className="space-y-3">
              {[
                { label: "Configurator", href: "/build" },
                { label: "Pre-Builts", href: "/prebuilts" },
                { label: "Support", href: "/support" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/30 hover:text-white/70 tracking-wider transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] mb-5">Contact</h3>
            <div className="space-y-3">
              {[
                { href: "mailto:bhavadeepchouhan@gmail.com", icon: Mail, label: "bhavadeepchouhan@gmail.com" },
                { href: "https://github.com/Bhavdeep-04", icon: Github, label: "github.com/Bhavdeep-04" },
                { href: "https://linkedin.com/in/bhavdeep-chouhan", icon: Linkedin, label: "linkedin.com/in/bhavdeep-chouhan" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs text-white/30 hover:text-white/60 transition-colors duration-300"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[10px] text-white/20 tracking-widest uppercase">
            © {new Date().getFullYear()} ASMBLY — Bhavdeep Chouhan
          </p>
          <p className="text-[10px] text-white/20 tracking-widest uppercase">
            Payments by Razorpay
          </p>
        </div>
      </div>
    </footer>
  );
}
