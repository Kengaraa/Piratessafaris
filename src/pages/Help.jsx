import { Link } from "react-router-dom";
import {
  Compass,
  CalendarCheck,
  UserPlus,
  Images,
  PhoneCall,
  MessageCircle,
  Wrench,
} from "lucide-react";

const steps = [
  {
    icon: Compass,
    title: "1. Browse Safaris, Beach & Tours",
    desc: "Head to All packages or filter directly by Safaris and Beach holidays to compare itineraries, pricing, and availability.",
    to: "/packages",
    cta: "Explore packages",
  },
  {
    icon: CalendarCheck,
    title: "2. Book a Package or Custom Trip",
    desc: "Open any package to reserve, or use Custom Booking if you want a tailor-made route, dates, or group budget.",
    to: "/book",
    cta: "Start a custom booking",
  },
  {
    icon: UserPlus,
    title: "3. Create an Account & Track Trips",
    desc: "Register or sign in to view your saved requests under My trips, while admins can manage listings and bookings from Admin.",
    to: "/register",
    cta: "Create or sign in",
  },
  {
    icon: Images,
    title: "4. Watch Moments in Gallery",
    desc: "Preview safari reels and destination highlights in the Gallery before picking your trip.",
    to: "/gallery",
    cta: "Open gallery",
  },
];

export default function Help() {
  return (
    <div className="container-x py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-brass-600">
          Help &amp; Guide
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          How to use Piratessafaris
        </h1>
        <p className="mt-3 text-sm text-ink-900/70 sm:text-base">
          A quick walkthrough of where everything lives in the app, how to book
          smoothly, and who to call if you need booking or technical support.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {steps.map(({ icon: Icon, title, desc, to, cta }) => (
          <div
            key={title}
            className="flex flex-col justify-between rounded-2xl bg-white p-6 ring-1 ring-ink-900/10"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass-500/15 text-brass-700">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm text-ink-900/70">{desc}</p>
            </div>
            <div className="mt-5">
              <Link to={to} className="btn btn-outline w-full sm:w-auto">
                {cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 rounded-2xl bg-ink-900 p-6 text-white sm:p-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brass-400">
            Booking &amp; Trip Helpline
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Need help planning a trip?
          </h2>
          <p className="mt-2 text-sm text-white/75">
            Reach out to Alex at Piratessafaris for package details, custom
            itineraries, group quotes, and booking assistance.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="tel:0790404260" className="btn btn-primary">
              <PhoneCall className="h-4 w-4" />
              Call Alex: 0790 404 260
            </a>
            <a
              href="https://wa.me/254790404260?text=Hello%20Piratessafaris!%20I%20need%20help%20with%20a%20trip."
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline border-white/25 text-white hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Alex
            </a>
          </div>
        </div>

        <div className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="flex items-center gap-2 text-brass-400">
            <Wrench className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Developer &amp; App Support
            </span>
          </div>
          <h3 className="mt-2 text-lg font-bold">
            Technical issues or site questions?
          </h3>
          <p className="mt-1.5 text-sm text-white/75">
            For bugs, account issues, or developer support, contact John Kengara
            directly on the developer helpline.
          </p>
          <div className="mt-4">
            <a
              href="tel:0743986398"
              className="btn btn-outline border-white/25 text-white hover:bg-white/10"
            >
              <PhoneCall className="h-4 w-4" />
              Developer Helpline: 0743 986 398
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
