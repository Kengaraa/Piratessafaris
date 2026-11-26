import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Binoculars,
  Waves,
  Plane,
  ShieldCheck,
  Headset,
  Wallet,
  BadgeCheck,
  Camera,
  Compass,
  ArrowRight,
  Phone,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { PackageCard, Spinner } from "../components/UI";

const cats = [
  ["safari", "Safaris", "Maasai Mara, Amboseli, Samburu, Tsavo", Binoculars],
  ["beach", "Beach holidays", "Diani, Watamu, Malindi", Waves],
  [
    "international",
    "International",
    "Dubai, Zanzibar, Mauritius and more",
    Plane,
  ],
];

const why = [
  [
    ShieldCheck,
    "Secure booking",
    "Your details and trip records are protected.",
  ],
  [
    Wallet,
    "Transparent pricing",
    "Prices are calculated up front with no hidden fees.",
  ],
  [
    Headset,
    "Real advisors",
    "Talk to a travel expert before and during your trip.",
  ],
  [
    BadgeCheck,
    "Vetted partners",
    "We work with trusted lodges, hotels and guides.",
  ],
];

const previewPhotos = [
  { id: 1, file: "/gallery-1.jpeg", label: "Image 1" },
  { id: 2, file: "/gallery-2.jpeg", label: "Image 2" },
  { id: 3, file: "/gallery-3.jpeg", label: "Image 3" },
  { id: 4, file: "/gallery-4.jpeg", label: "Image 4" },
];

function PreviewCard({ slot }) {
  const [missing, setMissing] = useState(false);

  return (
    <Link
      to="/gallery"
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900/5 ring-1 ring-ink-900/10"
    >
      {!missing ? (
        <img
          src={slot.file}
          alt={slot.label}
          onError={() => setMissing(true)}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
          <Camera className="h-7 w-7 text-brass-500" />
          <p className="mt-2 font-semibold text-ink-900">{slot.label}</p>
          <p className="mt-0.5 text-xs text-ink-900/50">public{slot.file}</p>
        </div>
      )}
    </Link>
  );
}

export default function Home() {
  const [items, setItems] = useState(null);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    supabase
      .from("packages")
      .select("*")
      .eq("active", true)
      .eq("featured", true)
      .limit(6)
      .then(({ data }) => setItems(data || []));
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-ink-900 text-white">
        <img
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1800&q=80"
          alt=""
          onError={(e) => e.currentTarget.remove()}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="container-x py-24 sm:py-32">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            wild places, planned properly.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            Book safaris, beach holidays and international tours with
            Piratessafaris, from first idea to the last sunset.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              nav(`/packages?q=${encodeURIComponent(q)}`);
            }}
            className="mt-8 flex max-w-xl gap-2 rounded-xl bg-white p-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-900/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search destination or package"
                className="w-full rounded-lg py-3 pl-10 pr-3 text-ink-900 focus:outline-none"
                aria-label="Search packages"
              />
            </div>
            <button className="btn btn-primary px-6">Search</button>
          </form>
        </div>
      </section>

      {/* CATEGORY CARDS */}
      <section className="container-x grid gap-4 py-16 md:grid-cols-3">
        {cats.map(([k, t, d, Icon]) => (
          <Link
            key={k}
            to={`/packages?category=${k}`}
            className="rounded-2xl bg-white p-6 ring-1 ring-ink-900/10 transition hover:ring-brass-500"
          >
            <Icon className="h-8 w-8 text-brass-500" />
            <h2 className="mt-4 text-xl font-semibold">{t}</h2>
            <p className="mt-1 text-sm text-ink-900/70">{d}</p>
          </Link>
        ))}
      </section>

      {/* ABOUT PIRATESSAFARIS SECTION */}
      <section id="about" className="border-y border-ink-900/10 bg-white py-16">
        <div className="container-x grid items-center gap-10 lg:grid-cols-12">
          <div className="flex justify-center lg:col-span-4">
            <img
              src="/logo.jpeg"
              alt="Piratessafaris - Pirates of the Savanna"
              className="h-60 w-60 rounded-full border-4 border-brass-500/30 object-cover shadow-xl"
            />
          </div>
          <div className="lg:col-span-8">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brass-600">
              <Compass className="h-4 w-4" /> About Piratessafaris
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">
              Pirates of the Savanna — Bold Journeys, Local Heart.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-900/80">
              Born from a genuine passion for East Africa’s untamed landscapes
              and vibrant coastlines,{" "}
              <span className="font-semibold text-ink-900">Piratessafaris</span>{" "}
              crafts unforgettable adventures for explorers who want more than
              an ordinary tour. Whether you are tracking the Big Five across the
              golden plains of the Maasai Mara, unwinding on the white sands of
              Diani and Watamu, or jetting off on a curated international
              getaway, we handle every detail—from trusted 4x4 safari cruisers
              and handpicked lodges to seamless airport transfers. With honest
              pricing, deep local knowledge, and round-the-clock support from
              our team, your only job is to show up and live the adventure.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/book" className="btn btn-primary">
                Plan Your Custom Trip
              </Link>
              <Link to="/packages" className="btn btn-outline">
                Explore Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PACKAGES */}
      <section className="container-x py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold">Featured packages</h2>
          <Link
            to="/packages"
            className="text-sm font-semibold text-brass-600 hover:underline"
          >
            View all packages
          </Link>
        </div>
        {!items ? (
          <Spinner />
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-ink-900/10 sm:p-10">
            <Compass className="mx-auto h-10 w-10 text-brass-500" />
            <h3 className="mt-3 text-2xl font-bold text-ink-900">
              New Curated Safari &amp; Holiday Packages Coming Soon!
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-900/75">
              Our team is currently finalizing fresh seasonal rates and
              exclusive itineraries for our upcoming safaris, coastal escapes,
              and international tours. In the meantime, we would love to tailor
              a custom trip just for you—reach out directly and we will put
              together a personalized quote right away.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/book" className="btn btn-primary">
                Request a Custom Itinerary
              </Link>
              <a
                href="https://wa.me/254790404260?text=Hello%20Piratessafaris!%20I%20would%20love%20to%20inquire%20about%20upcoming%20safari%20and%20holiday%20packages."
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline flex items-center gap-2"
              >
                <Phone className="h-4 w-4" /> Chat with Alex on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <PackageCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      {/* 4-PHOTO GALLERY PREVIEW */}
      <section className="border-t border-ink-900/10 bg-white py-16">
        <div className="container-x">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brass-600">
                Snapshots
              </p>
              <h2 className="mt-1 text-3xl font-bold text-ink-900">
                From Oloolua Nature trail &amp; Thiba Falls
              </h2>
            </div>
            <Link
              to="/gallery"
              className="flex items-center gap-1 text-sm font-semibold text-brass-600 hover:underline"
            >
              View full gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {previewPhotos.map((slot) => (
              <PreviewCard key={slot.id} slot={slot} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY TRAVEL WITH US + CUSTOM BOOKING CTA */}
      <section className="bg-ink-900 py-16 text-white">
        <div className="container-x">
          <h2 className="text-3xl font-bold">Why travel with Piratessafaris</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {why.map(([Icon, t, d]) => (
              <div key={t}>
                <Icon className="h-7 w-7 text-brass-400" />
                <h3 className="mt-3 font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-white/70">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold">
                Have a custom itinerary or group trip in mind?
              </h3>
              <p className="mt-1 text-sm text-white/75">
                Send an email request or message Alex on WhatsApp for a
                personalized quote.
              </p>
            </div>
            <Link to="/book" className="btn btn-primary shrink-0">
              Custom Booking &amp; Inquiry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
