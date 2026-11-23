import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Compass, Phone } from "lucide-react";
import { supabase } from "../lib/supabase";
import { PackageCard, Spinner } from "../components/UI";

const tabs = [
  ["", "All"],
  ["safari", "Safaris"],
  ["beach", "Beach holidays"],
  ["international", "International"],
];

export default function Packages() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState(null);
  const [sort, setSort] = useState("featured");
  const cat = params.get("category") || "";
  const q = params.get("q") || "";

  useEffect(() => {
    supabase
      .from("packages")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setAll(data || []));
  }, []);

  const set = (k, v) => {
    const n = new URLSearchParams(params);
    v ? n.set(k, v) : n.delete(k);
    setParams(n, { replace: true });
  };

  const list = useMemo(() => {
    let r = (all || []).filter(
      (p) =>
        (!cat || p.category === cat) &&
        `${p.title} ${p.destination} ${p.summary}`
          .toLowerCase()
          .includes(q.toLowerCase()),
    );
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "days") r = [...r].sort((a, b) => a.days - b.days);
    return r;
  }, [all, cat, q, sort]);

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Tour packages</h1>
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map(([k, l]) => (
            <button
              key={k}
              onClick={() => set("category", k)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                cat === k
                  ? "bg-ink-900 text-white"
                  : "bg-white ring-1 ring-ink-900/15 hover:bg-ink-900/5"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/40" />
            <input
              className="input pl-9"
              placeholder="Search"
              value={q}
              onChange={(e) => set("q", e.target.value)}
              aria-label="Search"
            />
          </div>
          <select
            className="input w-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort"
          >
            <option value="featured">Newest</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="days">Shortest trips</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        {!all ? (
          <Spinner />
        ) : list.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-ink-900/10 sm:p-12">
            <Compass className="mx-auto h-10 w-10 text-brass-500" />
            <h2 className="mt-3 text-2xl font-bold text-ink-900">
              {all.length === 0
                ? "Tailored Safari & Holiday Packages Coming Soon!"
                : "Looking for a Specific Destination?"}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-900/75">
              {all.length === 0
                ? "We are currently updating our seasonal packages and exclusive group rates. Meanwhile, our team is ready to craft a custom safari, beach getaway, or international itinerary built around your exact dates and budget."
                : "We do not have a pre-listed package matching that exact filter yet—but Piratessafaris plans custom trips across Kenya and beyond! Let us build an itinerary tailored just for you."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {all.length > 0 && (
                <button
                  type="button"
                  onClick={() => setParams({}, { replace: true })}
                  className="btn btn-outline"
                >
                  Reset Filters
                </button>
              )}
              <Link to="/book" className="btn btn-primary">
                Request a Custom Itinerary
              </Link>
              <a
                href="https://wa.me/254790404260?text=Hello%20Piratessafaris!%20I%20would%20love%20to%20plan%20a%20custom%20safari%20or%20holiday%20package."
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
            {list.map((p) => (
              <PackageCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
