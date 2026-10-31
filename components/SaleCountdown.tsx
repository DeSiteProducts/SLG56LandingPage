"use client";

import { useEffect, useState } from "react";

const units = ["Days", "Hours", "Minutes", "Seconds"] as const;

function getTimeRemaining() {
  // Numeric date arguments use the visitor's local timezone, including DST.
  // December 1 at midnight is the end of November 30.
  const deadline = new Date(2026, 11, 1).getTime();
  const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

  return [
    Math.floor(seconds / 86400),
    Math.floor((seconds % 86400) / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ];
}

export function SaleCountdown() {
  const [remaining, setRemaining] = useState<number[] | null>(null);

  useEffect(() => {
    const update = () => setRemaining(getTimeRemaining());
    update();
    const interval = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <section aria-label="Early Black Friday Sale countdown" className="bg-black px-3 py-5 text-white sm:py-6">
      <div className="mx-auto flex w-fit items-start gap-2 sm:gap-4" role="timer" aria-live="off" aria-label="Time remaining until the end of November 30, 2026, in your local timezone">
        <span aria-hidden="true" className="sale-countdown-dot mt-5 size-3 shrink-0 rounded-full bg-white sm:mt-6 sm:size-4" />
        {units.map((unit, index) => (
          <div key={unit} className="flex w-14 flex-col items-center gap-2 sm:w-20">
            <span className="flex h-14 w-full items-center justify-center rounded-md border-2 border-white bg-red-600 text-3xl font-bold tabular-nums sm:h-16 sm:text-4xl">
              {remaining ? String(remaining[index]).padStart(2, "0") : "--"}
            </span>
            <span className="text-xs font-medium text-white sm:text-sm">{unit}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-lg font-bold text-white sm:text-xl">Early Black Friday Sale</p>
    </section>
  );
}
