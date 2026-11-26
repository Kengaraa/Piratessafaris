import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const SIGNUP_BENEFITS = [
  {
    title: "Track Every Trip in One Place",
    desc: "Keep your safari, coastal, and custom itinerary requests organized without digging through chats.",
  },
  {
    title: "Faster Re-Booking & Quotes",
    desc: "Save your contact details and travel style so future requests take seconds.",
  },
  {
    title: "Booking & Safari Updates",
    desc: "Stay tuned to quote updates, itinerary notes, and seasonal safari alerts.",
  },
];

async function notifyAlexOnSignup({ fullName, phone, email }) {
  try {
    await fetch("https://formsubmit.co/ajax/piratessafaris@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: "New Piratessafaris Traveler Sign-Up",
        "Full Name": fullName,
        Phone: phone,
        Email: email,
        "Signed Up At": new Date().toLocaleString(),
      }),
    });
  } catch {
    // Non-blocking alert helper so sign-up never fails if email alert hiccups
  }
}

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [welcomeUser, setWelcomeUser] = useState(null);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            phone: form.phone.trim(),
          },
        },
      });

      if (signUpError) throw signUpError;

      await notifyAlexOnSignup({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      });

      setWelcomeUser({
        fullName: form.fullName.trim() || "Explorer",
        email: form.email.trim(),
        hasSession: Boolean(data?.session),
      });
    } catch (err) {
      setError(
        err?.message || "Could not create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (welcomeUser) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Member Pass Activated
          </p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900">
            Welcome aboard, {welcomeUser.fullName}!
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Your Piratessafaris traveler account ({welcomeUser.email}) is ready.
            Head to your Account hub to customize your contact channel, safari
            preferences, and alert settings.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(welcomeUser.hasSession ? "/account" : "/login")
              }
              className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700"
            >
              {welcomeUser.hasSession
                ? "Open My Account Hub"
                : "Continue to Sign In"}
            </button>
            <Link
              to="/packages"
              className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              Explore Packages
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-12">
        <aside className="rounded-2xl bg-stone-900 p-6 text-white lg:col-span-5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Why Join Piratessafaris
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Travel smarter with your own safari hub
          </h2>
          <p className="mt-2 text-sm text-stone-300">
            Creating an account unlocks personal tools built for smooth planning
            from day one:
          </p>

          <ul className="mt-6 space-y-4">
            {SIGNUP_BENEFITS.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <h3 className="text-sm font-semibold text-amber-300">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-stone-300">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </aside>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm lg:col-span-7 sm:p-8">
          <h1 className="text-2xl font-bold text-stone-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Book trips, save preferences, and track every request in one place.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Full name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={form.fullName}
                onChange={onChange}
                placeholder="Jane Mwangi"
                className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={onChange}
                placeholder="0712 345 678"
                className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                value={form.password}
                onChange={onChange}
                placeholder="At least 8 characters"
                className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-stone-600">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-amber-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) throw signInError;
      navigate("/account", { state: { justSignedIn: true } });
    } catch (err) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          Welcome Back
        </p>
        <h1 className="mt-1 text-2xl font-bold text-stone-900">
          Sign in to your account
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Access your saved preferences, trip requests, and notification
          settings.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-600">
          New to Piratessafaris?{" "}
          <Link
            to="/register"
            className="font-semibold text-amber-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

export function SignOutWithWarning({ className = "" }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const confirmSignOut = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      setOpen(false);
      navigate("/login", {
        state: {
          signedOutNotice:
            "You are signed out. Active session notifications and live account updates on this device are paused until you sign back in.",
        },
      });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          "rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
        }
      >
        Sign out
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="signout-warning-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Before You Sign Out
            </p>
            <h2
              id="signout-warning-title"
              className="mt-1 text-xl font-bold text-stone-900"
            >
              Pause notifications &amp; session sync?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              If you sign out now, you{" "}
              <strong>will not receive active account notifications</strong> or
              live trip/status alerts tied to your signed-in session on this
              device. Your saved profile and trip records stay safely stored for
              when you return.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
              >
                Stay signed in
              </button>
              <button
                type="button"
                disabled={signingOut}
                onClick={confirmSignOut}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {signingOut ? "Signing out..." : "Sign out anyway"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}