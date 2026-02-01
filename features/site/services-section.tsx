"use client";

import {
  Users,
  CreditCard,
  ShieldCheck,
  LayoutDashboard,
  FileCheck,
  BarChart3,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    icon: Users,
    title: "Student Management",
    description:
      "Complete CRUD operations for student records. Add, edit, view and manage all student information in one place.",
    color: "from-primary to-primary/70",
  },
  {
    icon: CreditCard,
    title: "Payment Tracking",
    description:
      "Track student payments, upload receipts, and maintain complete payment history with UTR verification.",
    color: "from-primary to-primary/70",
  },
  {
    icon: ShieldCheck,
    title: "Admin Verification",
    description:
      "Secure admin approval system ensures only verified payments grant panel access.",
    color: "from-primary to-primary/70",
  },
  {
    icon: LayoutDashboard,
    title: "Intuitive Dashboard",
    description:
      "Clean, modern dashboard with real-time insights into student enrollment and payment status.",
    color: "from-primary to-primary/70",
  },
  {
    icon: FileCheck,
    title: "Document Upload",
    description:
      "Easy screenshot and document upload for payment verification and record keeping.",
    color: "from-primary to-primary/70",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Detailed analytics on enrollments, payments, and student progress at your fingertips.",
    color: "from-primary to-primary/70",
  },
];

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Everything You Need to
            <span className="text-gradient block">Manage Students</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A complete suite of tools designed specifically for educators and
            coaching centers.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />

              {/* Icon */}
              <div className="relative mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:shadow-glow group-hover:scale-110 transition-all duration-300`}
                >
                  <service.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                {/* Decorative Ring */}
                <div className="absolute -inset-2 rounded-2xl border border-primary/0 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300" />
              </div>

              {/* Content */}
              <h3 className="relative font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="relative text-muted-foreground leading-relaxed">
                {service.description}
              </p>

              {/* Arrow indicator on hover */}
              <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-primary/0 group-hover:bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div
          className={`mt-16 flex flex-wrap justify-center gap-8 lg:gap-16 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {[
            { value: "99.9%", label: "Uptime" },
            { value: "24/7", label: "Support" },
            { value: "100%", label: "Secure" },
            { value: "Free", label: "Setup" },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="font-display text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
