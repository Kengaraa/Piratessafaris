import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Film, X, ArrowRight } from "lucide-react";

const allPhotos = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  base: `/gallery-${i + 1}`,
  label: `Image ${i + 1}`,
}));

const videoReels = [
  { id: 1, file: "/video-1.mp4", title: "Safari & Trail Edit 1" },
  { id: 2, file: "/video-2.mp4", title: "Safari & Trail Edit 2" },
  { id: 3, file: "/video-3.mp4", title: "Safari & Trail Edit 3" },
  { id: 4, file: "/video-4.mp4", title: "Safari & Trail Edit 4" },
  { id: 5, file: "/video-5.mp4", title: "Safari & Trail Edit 5" },
  { id: 6, file: "/video-6.mp4", title: "Safari & Trail Edit 6" },
];

function PhotoSlot({ photo, onSelect }) {
  const [extIndex, setExtIndex] = useState(0);
  const exts = [".jpeg", ".jpg", ".png"];
  const isMissing = extIndex >= exts.length;
  const currentSrc = !isMissing ? `${photo.base}${exts[extIndex]}` : null;

  return (
    <button
      type="button"
      onClick={() =>
        !isMissing && onSelect({ src: currentSrc, label: photo.label })
      }
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900/5 text-left ring-1 ring-ink-900/10 focus:outline-none focus:ring-2 focus:ring-brass-500"
    >
      {!isMissing ? (
        <img
          src={currentSrc}
          alt={photo.label}
          loading="lazy"
          onError={() => setExtIndex((prev) => prev + 1)}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
          <Camera className="h-7 w-7 text-brass-500" />
          <p className="mt-2 font-semibold text-ink-900">{photo.label}</p>
          <p className="mt-0.5 text-xs text-ink-900/50">
            public{photo.base}.jpeg
          </p>
        </div>
      )}
    </button>
  );
}

function VideoSlot({ reel }) {
  const [missing, setMissing] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl bg-ink-900 text-white shadow-sm ring-1 ring-ink-900/10">
      {!missing ? (
        <div className="relative aspect-[9/16] w-full bg-black">
          <video
            src={reel.file}
            controls
            playsInline
            preload="metadata"
            onError={() => setMissing(true)}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[9/16] w-full flex-col items-center justify-center bg-ink-900/95 p-6 text-center">
          <Film className="h-8 w-8 text-brass-400" />
          <p className="mt-3 font-semibold text-white">{reel.title}</p>
          <p className="mt-1 text-xs text-white/60">
            Drop file at public{reel.file}
          </p>
        </div>
      )}
      <div className="border-t border-white/10 px-4 py-3">
        <p className="text-sm font-semibold text-white">{reel.title}</p>
        <p className="text-xs text-white/60">
          Piratessafaris • Pirates of the Savanna
        </p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="py-16">
      <div className="container-x">
        {/* PHOTO GALLERY HEADER */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brass-600">
            Captured Moments
          </p>
          <h1 className="mt-2 text-4xl font-bold text-ink-900">
            Adventure Gallery
          </h1>
          <p className="mt-3 text-base text-ink-900/70">
            From Oloolua Nature Trail & Thiba Falls to the Maasai Mara and Diani
            coast—explore real snapshots from the road with Piratessafaris.
          </p>
        </div>

        {/* 20-PHOTO GRID */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {allPhotos.map((photo) => (
            <PhotoSlot key={photo.id} photo={photo} onSelect={setSelected} />
          ))}
        </div>

        {/* VIDEO EDITS & ADVENTURE REELS SECTION (3x2 GRID) */}
        <section id="videos" className="mt-20 border-t border-ink-900/10 pt-16">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brass-600">
              <Film className="h-4 w-4" /> Motion & Highlights
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink-900">
              Video Edits & Adventure Reels
            </h2>
            <p className="mt-2 text-base text-ink-900/70">
              Experience the energy of the trail, waterfalls, and game drives in
              motion.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videoReels.map((reel) => (
              <VideoSlot key={reel.id} reel={reel} />
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded-3xl bg-ink-900 p-8 text-white sm:flex-row">
          <div>
            <h2 className="text-2xl font-bold">
              Ready to make your own safari memories?
            </h2>
            <p className="mt-1 text-sm text-white/75">
              Tell us your dream destination and let Piratessafaris handle the
              rest.
            </p>
          </div>
          <Link to="/book" className="btn btn-primary shrink-0">
            Plan Your Trip <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Close image"
            className="absolute right-5 top-5 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={selected.src}
            alt={selected.label}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
