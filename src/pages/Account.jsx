import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { SignOutWithWarning } from "./Auth";

const DEFAULT_PREFS = {
  fullName: "",
  phone: "",
  preferredChannel: "WhatsApp",
  tripStyle: "Wildlife Safari",
  travelPace: "Balanced & Scenic",
  notes: "",
  alerts: {
    bookingUpdates: true,
    tripReminders: true,
    seasonalDeals: false,
  },
};

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!active) return;

      if (!data?.user) {
        navigate("/login");
        return;
      }

      setUser(data.user);
      const storageKey = `piratessafaris_prefs_${data.user.id}`;
      const savedLocal = localStorage.getItem(storageKey);
      const parsedLocal = savedLocal ? JSON.parse(savedLocal) : {};

      setPrefs({
        ...DEFAULT_PREFS,
        fullName:
          parsedLocal.fullName || data.user.user_metadata?.full_name || "",
        phone: parsedLocal.phone || data.user.user_metadata?.phone || "",
        preferredChannel:
          parsedLocal.preferredChannel || DEFAULT_PREFS.preferredChannel,
        tripStyle: parsedLocal.tripStyle || DEFAULT_PREFS.tripStyle,
        travelPace: parsedLocal.travelPace || DEFAULT_PREFS.travelPace,
        notes: parsedLocal.notes || "",
        alerts: {
          ...DEFAULT_PREFS.alerts,
          ...(parsedLocal.alerts || {}),
        },
      });
      setLoading(false);
    }

    loadUser();
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSavedMsg("");

    if (!user) return;
    localStorage.setItem(
      `piratessafaris_prefs_${user.id}`,
      JSON.stringify(prefs),
    );

    await supabase.auth.updateUser({
      data: {
        full_name: prefs.fullName.trim(),
        phone: prefs.phone.trim(),
      },
    });

    setSavedMsg("Your account preferences have been updated.");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-sm text-stone-600">
        Loading your traveler hub...
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      {location.state?.justSignedIn && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Welcome back, <strong>{prefs.fullName || user?.email}</strong>! Your
          session and notification alerts are active.
        </div>
      )}

      {/* Top Account Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Traveler Account Hub
          </p>
          <h1 className="mt-1 text-2xl font-bold text-stone-900">
            {prefs.fullName || "Piratessafaris Member"}
          </h1>
          <p className="text-sm text-stone-500">{user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/book"
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Plan a Trip
          </Link>
          <SignOutWithWarning />
        </div>
      </div>

      {/* Interactive Sub-Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        {[
          { id: "profile", label: "Profile & Contact" },
          { id: "preferences", label: "Safari Preferences" },
          { id: "notifications", label: "Notifications & Alerts" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setSavedMsg("");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form
        onSubmit={handleSavePreferences}
        className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
      >
        {activeTab === "profile" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900">
              Profile &amp; Contact Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-stone-700">
                  Display Name
                </label>
                <input
                  type="text"
                  value={prefs.fullName}
                  onChange={(e) =>
                    setPrefs({ ...prefs, fullName: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={prefs.phone}
                  onChange={(e) =>
                    setPrefs({ ...prefs, phone: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Preferred Way to Reach You
              </label>
              <select
                value={prefs.preferredChannel}
                onChange={(e) =>
                  setPrefs({ ...prefs, preferredChannel: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm sm:max-w-xs"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900">
              Customize Your Safari Style
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-stone-700">
                  Favorite Trip Type
                </label>
                <select
                  value={prefs.tripStyle}
                  onChange={(e) =>
                    setPrefs({ ...prefs, tripStyle: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
                >
                  <option value="Wildlife Safari">Wildlife Safari</option>
                  <option value="Coastal & Beach Getaway">
                    Coastal &amp; Beach Getaway
                  </option>
                  <option value="Group & Family Adventure">
                    Group &amp; Family Adventure
                  </option>
                  <option value="Custom Itinerary">Custom Itinerary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">
                  Travel Pace
                </label>
                <select
                  value={prefs.travelPace}
                  onChange={(e) =>
                    setPrefs({ ...prefs, travelPace: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
                >
                  <option value="Balanced & Scenic">
                    Balanced &amp; Scenic
                  </option>
                  <option value="Fast-Paced & Action-Packed">
                    Fast-Paced &amp; Action-Packed
                  </option>
                  <option value="Slow & Relaxed">Slow &amp; Relaxed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Special Notes for Future Trips
              </label>
              <textarea
                rows={3}
                value={prefs.notes}
                onChange={(e) => setPrefs({ ...prefs, notes: e.target.value })}
                placeholder="Window seat preference, dietary notes, favorite parks..."
                className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900">
              Notifications &amp; Alerts
            </h2>
            <p className="text-sm text-stone-600">
              Choose what you want to stay updated on while signed in. Signing
              out pauses active session alerts on this device.
            </p>

            {[
              {
                key: "bookingUpdates",
                label: "Booking & quote status updates",
                hint: "Alerts when your trip inquiry or itinerary is reviewed.",
              },
              {
                key: "tripReminders",
                label: "Pre-trip reminders & packing tips",
                hint: "Helpful reminders ahead of upcoming travel dates.",
              },
              {
                key: "seasonalDeals",
                label: "Seasonal packages & special offers",
                hint: "Occasional updates on new routes and deals.",
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start justify-between gap-4 rounded-xl border border-stone-200 p-4"
              >
                <div>
                  <span className="block text-sm font-semibold text-stone-900">
                    {item.label}
                  </span>
                  <span className="block text-xs text-stone-500">
                    {item.hint}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(prefs.alerts[item.key])}
                  onChange={(e) =>
                    setPrefs({
                      ...prefs,
                      alerts: { ...prefs.alerts, [item.key]: e.target.checked },
                    })
                  }
                  className="mt-1 h-4 w-4 accent-amber-600"
                />
              </label>
            ))}
          </div>
        )}

        {savedMsg && (
          <p className="mt-4 text-sm font-medium text-emerald-700">
            {savedMsg}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Save changes
          </button>
        </div>
      </form>
    </section>
  );
}
