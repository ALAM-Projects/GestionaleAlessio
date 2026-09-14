"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavLinkItem = {
  label: string;
  targetId: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type DashboardLayoutProps = {
  children: ReactNode;
  linkText: string;
  link: string;
  navLinks?: NavLinkItem[];
};

const DashboardLayout = ({
  children,
  linkText,
  link,
  navLinks,
}: DashboardLayoutProps) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (!navLinks || navLinks.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 130;
      let currentSection = "";

      for (const linkItem of navLinks) {
        const el = document.getElementById(linkItem.targetId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentSection = linkItem.targetId;
          }
        }
      }
      if (currentSection) {
        setActiveSection(currentSection);
      } else if (navLinks[0]) {
        setActiveSection(navLinks[0].targetId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
      setActiveSection(targetId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#262523]">
      {/* STICKY TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#262523]/85 backdrop-blur-xl border-b border-stone-800/80 px-4 sm:px-8 lg:px-10 py-3.5 transition-all">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* BACK BUTTON */}
          <Link
            href={link}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-600 text-neutral-200 hover:text-white text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:shadow group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-neutral-400 group-hover:text-white" />
            <span>{linkText}</span>
          </Link>

          {/* NAV LINKS TO CARDS */}
          {navLinks && navLinks.length > 0 && (
            <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-0.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.targetId;
                return (
                  <a
                    key={item.targetId}
                    href={`#${item.targetId}`}
                    onClick={(e) => handleScrollTo(e, item.targetId)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer",
                      isActive
                        ? "bg-neutral-800 text-white border border-neutral-650 shadow-sm"
                        : "bg-neutral-900/70 hover:bg-neutral-800/80 text-neutral-300 hover:text-white border border-neutral-800/80 hover:border-neutral-700",
                    )}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5 transition-colors",
                          isActive ? "text-blue-400" : "text-neutral-400",
                        )}
                      />
                    )}
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-4 sm:px-8 lg:px-10 pb-12 flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
