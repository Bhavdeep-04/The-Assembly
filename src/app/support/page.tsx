"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MessageCircle, Clock, Wrench } from "lucide-react";

const faqs = [
  {
    q: "How long does delivery take after a successful order?",
    a: "Orders are typically assembled and dispatched within 5–7 business days. You'll receive a tracking link via email once your build ships.",
  },
  {
    q: "Can I mix components from different brands?",
    a: "Absolutely. Our configurator allows you to pick any combination. We recommend double-checking socket and form-factor compatibility before checkout.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We use Razorpay which supports UPI, credit/debit cards, net banking, and popular wallets.",
  },
  {
    q: "Do you offer a warranty on assembled systems?",
    a: "Yes — all assembled systems come with a 1-year on-site warranty. Individual components carry their manufacturer warranty.",
  },
];

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border-primary/20">
          <Wrench className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium tracking-wide uppercase text-white/80">We're here to help</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Support Center</h1>
        <p className="text-muted text-lg">Have a question or facing an issue? Reach out and we'll sort it out.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 border border-white/5 hover:border-primary/20 transition-colors"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Bhavdeep Chouhan</h2>
          <p className="text-muted text-sm mb-8">Founder & Lead Engineer — The Assembly</p>

          <div className="space-y-5">
            <a
              href="mailto:bhavadeepchouhan@gmail.com"
              className="flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Email</p>
                <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">bhavadeepchouhan@gmail.com</p>
              </div>
            </a>

            <a
              href="https://github.com/Bhavdeep-04"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 group-hover:bg-white/10 transition-colors">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">GitHub</p>
                <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">github.com/Bhavdeep-04</p>
              </div>
            </a>

            <a
              href="https://linkedin.com/in/bhavdeep-chouhan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">LinkedIn</p>
                <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">linkedin.com/in/bhavdeep-chouhan</p>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Response Time Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div className="glass rounded-2xl p-6 border border-white/5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Response Time</h3>
              <p className="text-sm text-muted">We aim to respond to all emails within <span className="text-white font-medium">24 hours</span> on business days.</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">For Order Issues</h3>
              <p className="text-sm text-muted">Include your <span className="text-white font-medium">Razorpay Payment ID</span> in your message so we can look up your order instantly.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="glass rounded-xl p-6 border border-white/5 hover:border-primary/20 transition-colors"
            >
              <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
