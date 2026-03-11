import Link from "next/link";
import { Cpu, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 glass mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors">
                The Assembly
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              A boutique PC hardware configurator for those who demand the absolute best.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Configurator", href: "/build" },
                { label: "Pre-Builts", href: "/prebuilts" },
                { label: "Support", href: "/support" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
            <div className="space-y-3">
              <a
                href="mailto:bhavadeepchouhan@gmail.com"
                className="flex items-center gap-3 text-sm text-muted hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-primary shrink-0" />
                bhavadeepchouhan@gmail.com
              </a>
              <a
                href="https://github.com/Bhavdeep-04"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 shrink-0" />
                github.com/Bhavdeep-04
              </a>
              <a
                href="https://linkedin.com/in/bhavdeep-chouhan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4 text-blue-400 shrink-0" />
                linkedin.com/in/bhavdeep-chouhan
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} The Assembly. Built by Bhavdeep Chouhan.
          </p>
          <p className="text-xs text-muted">
            All payments secured by{" "}
            <span className="text-primary font-medium">Razorpay</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
