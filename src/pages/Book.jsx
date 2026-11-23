import { useState } from "react";
import {
  Send,
  Phone,
  Mail,
  Instagram,
  Music2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Book() {
  const [inquiry, setInquiry] = useState({
    name: "",
    email: "",
    phone: "",
    tripType: "Safari",
    destination: "",
    dates: "",
    guests: "2 Adults",
    notes: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // 'sent' | 'error'

  const formatMessage = () =>
    `Hello Piratessafaris! I would like to book/inquire about a trip:\n\n` +
    `Name: ${inquiry.name || "N/A"}\n` +
    `Email: ${inquiry.email || "N/A"}\n` +
    `Phone/WhatsApp: ${inquiry.phone || "N/A"}\n` +
    `Trip Category: ${inquiry.tripType}\n` +
    `Destination / Package: ${inquiry.destination || "Custom Trip"}\n` +
    `Preferred Dates: ${inquiry.dates || "Flexible"}\n` +
    `Travelers: ${inquiry.guests}\n` +
    `Notes: ${inquiry.notes || "None"}`;

  const handleEmailRequest = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/piratessafaris@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `New Trip Inquiry (${inquiry.tripType}) - ${inquiry.destination || "Piratessafaris"}`,
            _template: "table",
            Name: inquiry.name,
            Email: inquiry.email,
            Phone_WhatsApp: inquiry.phone || "Not provided",
            Trip_Category: inquiry.tripType,
            Destination: inquiry.destination || "Custom Trip",
            Preferred_Dates: inquiry.dates || "Flexible",
            Travelers: inquiry.guests,
            Notes: inquiry.notes || "None",
          }),
        },
      );

      if (res.ok) {
        setStatus("sent");
        setInquiry({
          name: "",
          email: "",
          phone: "",
          tripType: "Safari",
          destination: "",
          dates: "",
          guests: "2 Adults",
          notes: "",
        });
      } else {
        throw new Error("Failed to send");
      }
    } catch {
      // Fallback to mailto if offline or blocked
      const subject = encodeURIComponent(
        `Trip Booking Inquiry (${inquiry.tripType}) - ${inquiry.destination || "Piratessafaris"}`,
      );
      const body = encodeURIComponent(formatMessage());
      window.location.href = `mailto:piratessafaris@gmail.com?subject=${subject}&body=${body}`;
      setStatus("fallback");
    } finally {
      setSending(false);
    }
  };

  const handleWhatsAppRequest = () => {
    const text = encodeURIComponent(formatMessage());
    window.open(
      `https://wa.me/254790404260?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="py-16">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brass-600">
            Custom Booking & Inquiries
          </p>
          <h1 className="mt-2 text-4xl font-bold text-ink-900">
            Plan Your Next Adventure
          </h1>
          <p className="mt-3 text-base text-ink-900/70">
            Share your preferred destination, travel dates, and group size. Send
            an email request directly to our team or start an instant WhatsApp
            chat with Alex.
          </p>
        </div>

        <div className="mt-10 grid gap-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-900/10 sm:p-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div>
              <h2 className="text-xl font-bold text-ink-900">
                Direct Desk & Socials
              </h2>
              <p className="mt-1 text-sm text-ink-900/70">
                Prefer reaching out directly? Use any of the channels below for
                fast responses.
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <a
                href="https://wa.me/254790404260"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl bg-ink-900/5 p-3.5 font-medium text-ink-900 transition hover:bg-brass-500/10"
              >
                <Phone className="h-5 w-5 text-brass-600" />
                <div>
                  <p className="text-xs text-ink-900/60">
                    WhatsApp / Call Alex
                  </p>
                  <p>0790 404 260</p>
                </div>
              </a>

              <a
                href="mailto:piratessafaris@gmail.com"
                className="flex items-center gap-3 rounded-xl bg-ink-900/5 p-3.5 font-medium text-ink-900 transition hover:bg-brass-500/10"
              >
                <Mail className="h-5 w-5 text-brass-600" />
                <div>
                  <p className="text-xs text-ink-900/60">Email Desk</p>
                  <p>piratessafaris@gmail.com</p>
                </div>
              </a>

              <a
                href="https://instagram.com/piratessafaris"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl bg-ink-900/5 p-3.5 font-medium text-ink-900 transition hover:bg-brass-500/10"
              >
                <Instagram className="h-5 w-5 text-brass-600" />
                <div>
                  <p className="text-xs text-ink-900/60">Instagram</p>
                  <p>@piratessafaris</p>
                </div>
              </a>

              <a
                href="https://tiktok.com/@piratessafaris"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl bg-ink-900/5 p-3.5 font-medium text-ink-900 transition hover:bg-brass-500/10"
              >
                <Music2 className="h-5 w-5 text-brass-600" />
                <div>
                  <p className="text-xs text-ink-900/60">TikTok</p>
                  <p>@piratessafaris</p>
                </div>
              </a>
            </div>
          </div>

          <form
            onSubmit={handleEmailRequest}
            className="space-y-4 lg:col-span-7"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-ink-900/70">
                  Full Name *
                </label>
                <input
                  required
                  value={inquiry.name}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, name: e.target.value })
                  }
                  placeholder="e.g. Jane Doe"
                  className="mt-1 w-full rounded-xl border border-ink-900/15 px-3.5 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-ink-900/70">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={inquiry.email}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-xl border border-ink-900/15 px-3.5 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-ink-900/70">
                  Phone / WhatsApp
                </label>
                <input
                  value={inquiry.phone}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, phone: e.target.value })
                  }
                  placeholder="07XX XXX XXX"
                  className="mt-1 w-full rounded-xl border border-ink-900/15 px-3.5 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-ink-900/70">
                  Trip Category
                </label>
                <select
                  value={inquiry.tripType}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, tripType: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                >
                  <option value="Safari">Safari</option>
                  <option value="Beach Holiday">Beach Holiday</option>
                  <option value="International Tour">International Tour</option>
                  <option value="Group / Corporate Trip">
                    Group / Corporate Trip
                  </option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-ink-900/70">
                  Destination
                </label>
                <input
                  value={inquiry.destination}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, destination: e.target.value })
                  }
                  placeholder="Maasai Mara, Diani..."
                  className="mt-1 w-full rounded-xl border border-ink-900/15 px-3.5 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-ink-900/70">
                  Preferred Dates
                </label>
                <input
                  value={inquiry.dates}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, dates: e.target.value })
                  }
                  placeholder="e.g. Dec 15 - Dec 19"
                  className="mt-1 w-full rounded-xl border border-ink-900/15 px-3.5 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-ink-900/70">
                  Travelers
                </label>
                <input
                  value={inquiry.guests}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, guests: e.target.value })
                  }
                  placeholder="e.g. 2 Adults, 1 Child"
                  className="mt-1 w-full rounded-xl border border-ink-900/15 px-3.5 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink-900/70">
                Trip Details / Special Requests
              </label>
              <textarea
                rows={4}
                value={inquiry.notes}
                onChange={(e) =>
                  setInquiry({ ...inquiry, notes: e.target.value })
                }
                placeholder="Tell us about your preferred lodge tier, budget, or anything else we should know..."
                className="mt-1 w-full rounded-xl border border-ink-900/15 px-3.5 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={sending}
                className="btn btn-primary flex items-center gap-2 px-6 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />{" "}
                {sending ? "Sending..." : "Send Email Request"}
              </button>
              <button
                type="button"
                onClick={handleWhatsAppRequest}
                className="btn btn-outline flex items-center gap-2 px-6"
              >
                <Phone className="h-4 w-4" /> Book via WhatsApp
              </button>
            </div>

            {status === "sent" && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Request sent! Our team at
                piratessafaris@gmail.com will reply shortly.
              </p>
            )}
            {status === "fallback" && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                <AlertCircle className="h-4 w-4" /> Opened your email app to
                finish sending your request.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
