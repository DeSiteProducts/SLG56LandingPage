import { DeferredVideo } from "./DeferredVideo";

type WatchActionVideo = {
  thumbnailSrc: string;
  title: string;
  youtubeId: string;
};

type WatchActionVideosProps = {
  videos: WatchActionVideo[];
};

export function WatchActionVideos({ videos }: WatchActionVideosProps) {
  return (
    <div className="mt-9 grid gap-5 sm:mt-11 lg:grid-cols-2 lg:gap-6">
      {videos.map((video) => (
        <article
          key={video.youtubeId}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft"
        >
          <DeferredVideo
            provider="youtube"
            id={video.youtubeId}
            thumbnailSrc={video.thumbnailSrc}
            title={video.title}
          />
        </article>
      ))}
    </div>
  );
}
