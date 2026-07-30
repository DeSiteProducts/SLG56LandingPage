"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";

type CustomerTestimonial = {
  name: string;
  quote: string;
};

type TestimonialsSliderProps = {
  testimonials: CustomerTestimonial[];
};

export function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonials[activeIndex];

  if (!activeTestimonial) {
    return null;
  }

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowLeft") {
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      showNext();
    }
  }

  return (
    <section
      aria-label="Customer testimonial slider"
      className="mx-auto mt-9 max-w-4xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400 sm:mt-11"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <article className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 text-center shadow-soft sm:p-8 lg:p-10">
        <div
          className="flex items-center justify-center gap-1 text-lg text-amber-400 sm:text-xl"
          aria-label="Five star review"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} aria-hidden="true">
              &#9733;
            </span>
          ))}
        </div>

        <blockquote aria-live="polite" className="mx-auto mt-5 max-w-3xl">
          <p className="break-words text-lg font-semibold leading-7 text-ink min-[390px]:text-xl sm:text-2xl sm:leading-9">
            &ldquo;{activeTestimonial.quote}&rdquo;
          </p>
        </blockquote>

        <div className="mt-5 sm:mt-6">
          <p className="break-words text-sm font-bold leading-6 text-ink min-[390px]:text-base">
            {activeTestimonial.name}
          </p>
        </div>
      </article>

      <div className="mt-5 flex items-center justify-center gap-2 sm:mt-6 sm:gap-4">
        <button
          type="button"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-base font-semibold text-brand-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:size-11"
          aria-label="Previous testimonial"
          onClick={showPrevious}
        >
          <span aria-hidden="true">&larr;</span>
        </button>

        <div
          className="flex min-w-0 items-center justify-center gap-1 min-[390px]:gap-1.5 sm:gap-2"
          aria-label={`Testimonial ${activeIndex + 1} of ${testimonials.length}`}
        >
          {testimonials.map((testimonial, index) => (
            <span
              key={testimonial.name}
              aria-hidden="true"
              className={`h-2 rounded-full transition ${
                activeIndex === index ? "w-5 bg-brand-600 min-[390px]:w-6 sm:w-8" : "w-1.5 bg-slate-300 sm:w-2"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:size-11"
          aria-label="Next testimonial"
          onClick={showNext}
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </section>
  );
}
