"use client";

import { useEffect, useState } from "react";
import { navigation } from "@/lib/site-data";
import { ButtonLink } from "./ButtonLink";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/92 backdrop-blur">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-brand-700 focus:shadow-soft"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <a href="#" className="text-base font-bold text-ink sm:text-lg" aria-label="DeSite Products home">
          DeSite Products
        </a>

        <nav
          className="hidden items-center gap-4 lg:flex xl:gap-7"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-slate-600 transition hover:text-brand-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="#purchase-form" variant="ghost">
            Request Pricing
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-800 transition hover:bg-slate-50 lg:hidden"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="relative block h-5 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 top-1 block h-0.5 w-5 bg-current transition ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2.5 block h-0.5 w-5 bg-current transition ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-4 block h-0.5 w-5 bg-current transition ${
                isOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 shadow-soft transition sm:max-h-[calc(100svh-5rem)] sm:px-5 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 py-4" aria-label="Mobile menu">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-3 text-base font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <ButtonLink
            href="#purchase-form"
            className="mt-3 w-full"
            onClick={() => setIsOpen(false)}
          >
            Request Pricing
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
