"use client";

import Image from "next/image";
import { useState } from "react";

type DeferredVideoProps = {
  id: string;
  provider: "vimeo" | "youtube";
  priority?: boolean;
  thumbnailSrc: string;
  title: string;
};

function getVideoSource(provider: DeferredVideoProps["provider"], id: string) {
  if (provider === "vimeo") {
    return `https://player.vimeo.com/video/${id}?autoplay=1&badge=0&dnt=1&autopause=0&player_id=0`;
  }

  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
}

export function DeferredVideo({
  id,
  priority = false,
  provider,
  thumbnailSrc,
  title,
}: DeferredVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-[inherit] bg-slate-950">
      {isLoaded ? (
        <iframe
          src={getVideoSource(provider, id)}
          title={title}
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          aria-label={`Play ${title}`}
          onClick={() => setIsLoaded(true)}
          className="group absolute inset-0 grid place-items-center overflow-hidden bg-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Image
            src={thumbnailSrc}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1280px) 1080px, (min-width: 768px) 88vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/12 to-white/5" />
          <span className="relative grid size-14 place-items-center rounded-full border border-white/40 bg-white/22 shadow-soft backdrop-blur transition duration-200 group-hover:scale-105 group-hover:bg-white/30 sm:size-16">
            <span
              aria-hidden="true"
              className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white sm:border-y-[12px] sm:border-l-[19px]"
            />
          </span>
        </button>
      )}
    </div>
  );
}
