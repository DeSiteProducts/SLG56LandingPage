"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { DeferredVideo } from "./DeferredVideo";

type FeatureVideo = {
  description: string;
  thumbnailSrc: string;
  title: string;
  vimeoId: string;
};

type FeatureVideoSliderProps = {
  videos: FeatureVideo[];
};

export function FeatureVideoSlider({ videos }: FeatureVideoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = videos[activeIndex];

  if (!activeVideo) {
    return null;
  }

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? videos.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current === videos.length - 1 ? 0 : current + 1));
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
      aria-label="Feature video slider"
      className="mx-auto mt-9 max-w-5xl rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300 sm:mt-11"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-soft">
        <DeferredVideo
          key={activeVideo.vimeoId}
          provider="vimeo"
          id={activeVideo.vimeoId}
          thumbnailSrc={activeVideo.thumbnailSrc}
          title={activeVideo.title}
        />
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6 sm:gap-4">
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-base font-semibold text-brand-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:size-11"
          aria-label="Previous video"
          onClick={showPrevious}
        >
          <span aria-hidden="true">&larr;</span>
        </button>

        <div className="flex items-center justify-center gap-1" aria-label="Choose feature video">
          {videos.map((video, index) => (
            <button
              key={video.vimeoId}
              type="button"
              className="grid min-h-8 min-w-8 place-items-center rounded-full transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              aria-label={`Show video ${index + 1}: ${video.title}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            >
              <span
                aria-hidden="true"
                className={`h-2 rounded-full transition ${
                  activeIndex === index ? "w-8 bg-brand-600" : "w-2 bg-slate-300"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full bg-brand-600 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:size-11"
          aria-label="Next video"
          onClick={showNext}
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </section>
  );
}
