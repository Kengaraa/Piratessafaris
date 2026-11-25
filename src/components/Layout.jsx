import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Phone,
  Mail,
  Instagram,
  Music2,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { configured } from "../lib/supabase";

const links = [
  ["/", "Home"],
  ["/packages", "All packages"],
  ["/packages?category=safari", "Safaris"],
  ["/packages?category=beach", "Beach holidays"],
  ["/gallery", "Gallery"],
  ["/book", "Custom Booking"],
  ["/help", "Help & Guide"],
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const nav = useNavigate();
  const out = async () => {
    await signOut();
    setOpen(false);
    nav("/");
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-ink-900 text-white shadow">
        <div className="container-x flex h-16 items-center justify-between gap-2">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 font-display text-lg font-bold sm:gap-2.5 sm:text-xl"
          >
            <img
              src="/logo.jpeg"
              alt="Piratessafaris Logo"
              className="h-9 w-9 rounded-full border border-brass-400/50 object-cover sm:h-10 sm:w-10"
            />
            <span>Piratessafaris</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm lg:flex">
            {links.map(([to, l]) => (
              <NavLink
                key={to}
                to={to}
                end
                className="text-white/80 hover:text-brass-400"
              >
                {l}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="btn btn-outline border-white/30 text-white hover:bg-white/10"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/account"
                  className="btn btn-outline border-white/30 text-white hover:bg-white/10"
                >
                  <User className="h-4 w-4" />
                  My trips
                </Link>
                <button
                  onClick={out}
                  className="p-2 text-white/70 hover:text-white"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-white/80 hover:text-white"
                >
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Create account
                </Link>
              </>
            )}
          </div>
          <button
            className="p-1.5 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="border-t border-white/10 bg-ink-900 px-4 pb-4 lg:hidden">
            {links.map(([to, l]) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="block border-b border-white/5 py-2.5 text-sm text-white/90"
              >
                {l}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 pt-1">
              {user ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="py-1.5 text-sm"
                  >
                    My trips
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="py-1.5 text-sm"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={out}
                    className="py-1.5 text-left text-sm text-white/80"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="py-1.5 text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary w-full"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {!configured && (
        <p className="bg-ember px-4 py-2 text-center text-xs text-white sm:text-sm">
          Supabase is not configured. Copy .env.example to .env and add your
          project keys.
        </p>
      )}

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>

      <footer className="bg-ink-950 text-white/70">
        <div className="container-x grid gap-8 py-12 md:grid-cols-3">
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 font-display text-lg font-bold text-white"
            >
              <img
                src="/logo.jpeg"
                alt="Piratessafaris Logo"
                className="h-11 w-11 rounded-full border border-brass-400/50 object-cover"
              />
              <div>
                <p>Piratessafaris</p>
                <p className="font-sans text-xs font-normal text-brass-400">
                  Pirates of the Savanna
                </p>
              </div>
            </Link>
            <p className="mt-3 max-w-xs text-sm">
              Safaris, beach holidays and international tours, planned with
              transparent pricing and support at every step.
            </p>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-white">Explore</p>
            {links.slice(1).map(([to, l]) => (
              <Link
                key={to}
                to={to}
                className="mt-2 block hover:text-brass-400"
              >
                {l}
              </Link>
            ))}
          </div>

          <div className="space-y-2.5 text-sm">
            <p className="font-semibold text-white">Connect With Us</p>
            <a
              href="https://wa.me/254790404260?text=Hello%20Piratessafaris!%20I%20would%20like%20to%20inquire%20about%20a%20trip."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-brass-400"
            >
              <Phone className="h-4 w-4 text-brass-400" />
              WhatsApp: 0790 404 260
            </a>
            <a
              href="mailto:piratessafaris@gmail.com"
              className="flex items-center gap-2 hover:text-brass-400"
            >
              <Mail className="h-4 w-4 text-brass-400" />
              piratessafaris@gmail.com
            </a>
            <a
              href="https://instagram.com/piratessafaris"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-brass-400"
            >
              <Instagram className="h-4 w-4 text-brass-400" />
              Instagram: @piratessafaris
            </a>
            <a
              href="https://tiktok.com/@piratessafaris"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-brass-400"
            >
              <Music2 className="h-4 w-4 text-brass-400" />
              TikTok: @piratessafaris
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-xs">
          <div className="container-x flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} Piratessafaris. All rights
              reserved.
            </p>
            <p className="text-white/60">
              This web app was built and designed by{" "}
              <span className="font-semibold text-brass-400">John Kengara</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
