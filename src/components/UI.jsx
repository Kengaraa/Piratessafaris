import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Loader2, Clock, MapPin } from 'lucide-react'
import { money } from '../lib/supabase'

export const Spinner = () => (
  <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-brass-500" aria-label="Loading" /></div>
)

export function SafeImg({ src, alt, className = '' }) {
  const [bad, setBad] = useState(!src)
  if (bad) return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-ink-800 to-ink-950 text-brass-500 ${className}`}>
      <Compass className="h-10 w-10" />
    </div>
  )
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={`object-cover ${className}`} />
}

export const Alert = ({ children, tone = 'error' }) => children ? (
  <p role="alert" className={`rounded-lg px-4 py-3 text-sm ${tone === 'error' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>{children}</p>
) : null

export function PackageCard({ p }) {
  return (
    <Link to={`/packages/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink-900/10 transition hover:shadow-lg">
      <SafeImg src={p.image_url} alt={p.title} className="h-52 w-full transition duration-500 group-hover:scale-105" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-4 text-xs text-ink-900/60">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.destination}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.days} days</span>
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-snug">{p.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-900/70">{p.summary}</p>
        <p className="mt-auto pt-4 text-sm text-ink-900/60">From <span className="text-lg font-bold text-ink-900">{money(p.price, p.currency)}</span> per person</p>
      </div>
    </Link>
  )
}
