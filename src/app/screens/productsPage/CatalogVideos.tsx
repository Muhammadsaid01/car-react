import { useEffect, useRef } from "react";

// Preserve the original files and order; existing posters remain playback fallbacks.
export const catalogVideos = [
  { title: "BMW", source: "/video/BMW.mp4", poster: "/assets/luxavto/catalog-posters/bmw.jpg" },
  { title: "Avtomobil taqdimoti", source: "/video/Bugatti.mp4", poster: "/assets/luxavto/catalog-posters/bugatti.jpg" },
  { title: "Lamborghini", source: "/video/Lamborghini.mp4", poster: "/assets/luxavto/catalog-posters/lamborghini.jpg" },
  { title: "Mercedes-Benz", source: "/video/Benz.mp4", poster: "/assets/luxavto/catalog-posters/benz.jpg" },
];

function BrandVideo({ video }: { video: typeof catalogVideos[number] }) {
  const player = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = player.current;
    if (!element) return;
    element.defaultMuted = true;
    element.muted = true;
    try {
      const playback = element.play();
      playback?.catch(() => {
        // Browser/OS policy may block autoplay. Retain the poster or decoded frame.
      });
    } catch {
      // Keep the same stable fallback if playback cannot be attempted.
    }
  }, [video.source]);

  return <div className="lux-catalog-video-card">
    <video ref={player} src={video.source} poster={video.poster} autoPlay muted loop playsInline controls={false} preload="auto" aria-label={`${video.title} videosi`} />
  </div>;
}

export default function CatalogVideos() {
  return <section className="lux-catalog-brands" aria-labelledby="catalog-brands-title"><div className="lux-container">
    <div className="lux-catalog-section-title"><h2 id="catalog-brands-title">Brendlar harakatda</h2></div>
    <div className="lux-catalog-video-grid" role="region" aria-label="Brend videolari" tabIndex={0}>{catalogVideos.map(video => <BrandVideo key={video.source} video={video} />)}</div>
  </div></section>;
}
