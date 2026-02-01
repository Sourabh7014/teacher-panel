"use client";

import { GraduationCap, Heart, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import NextImage from "next/image";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-background py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.02)_49%,rgba(255,255,255,0.02)_51%,transparent_52%)] bg-[size:20px_20px]" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-18 h-18 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <NextImage
                  src="/logo-icon.png"
                  alt="Aerophantom Logo"
                  width={300}
                  height={300}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <span className="font-display font-bold text-2xl">
                © 2024 Aerophantom. Made with
              </span>
            </Link>
            <p className="text-background/70 max-w-md text-lg leading-relaxed mb-6">
              Complete student management solution for modern educators. Manage
              students, track payments, and grow your coaching business.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {["facebook", "twitter", "instagram", "linkedin"].map(
                (social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-background/10 hover:bg-primary hover:scale-110 flex items-center justify-center transition-all duration-300"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 rounded-full bg-background/50" />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-background">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { href: "#services", label: "Services" },
                { href: "#how-it-works", label: "How It Works" },
                { href: "#about", label: "About Us" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-background">
              Account
            </h4>
            <ul className="space-y-4">
              {[
                { href: "/login", label: "Login" },
                { href: "/signup", label: "Sign Up" },
                { href: "/panel", label: "Dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm flex items-center gap-1">
            Aerophantom
            <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />
            in India
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-background/60 hover:text-primary text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-background/60 hover:text-primary text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-xl gradient-primary text-primary-foreground shadow-lg hover:shadow-glow flex items-center justify-center transition-all duration-300 z-50 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;
