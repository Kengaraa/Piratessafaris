import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Check, Clock, MapPin, MessageCircle } from 'lucide-react'
import { supabase, money, WHATSAPP } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { SafeImg, Spinner, Alert } from '../components/UI'

export default function PackageDetail() {
  const { slug } = useParams()
  const { user } = useAuth()
  const nav = useNavigate()
  const [p, setP] = useState(undefined)
  const [f, setF] = useState({ travel_date: '', adults: 2, children: 0, notes: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.from('packages').select('*').eq('slug', slug).eq('active', true).maybeSingle()
      .then(({ data }) => setP(data))
  }, [slug])
  if (p === undefined) return <Spinner />
  if (!p) return <div className="container-x py-24 text-center"><h1 className="text-2xl font-bold">Package not found</h1><Link to="/packages" className="btn btn-dark mt-6">Browse packages</Link></div>

  const total = p.price * (Number(f.adults) + Number(f.children) * 0.5)
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10)
  const upd = k => e => setF({ ...f, [k]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    if (!user) return nav('/login', { state: { from: `/packages/${slug}` } })
    setBusy(true); setErr('')
    const { error } = await supabase.from('bookings').insert({
      package_id: p.id, travel_date: f.travel_date, adults: Number(f.adults),
      children: Number(f.children), notes: f.notes || null
    })
    setBusy(false)
    if (error) return setErr(error.message)
    nav('/account', { state: { booked: true } })
  }
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hello Piratessafaris, I would like to know more about ${p.title}.`)}`

  return (
    <div className="container-x py-8">
      <SafeImg src={p.image_url} alt={p.title} className="h-64 w-full rounded-2xl sm:h-96" />
      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex gap-5 text-sm text-ink-900/70">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{p.destination}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{p.days} days</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{p.title}</h1>
          <p className="mt-4 max-w-prose leading-relaxed text-ink-900/80">{p.description}</p>
          {p.highlights?.length > 0 && (<>
            <h2 className="mt-8 text-xl font-semibold">What is included</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {p.highlights.map(h => <li key={h} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-brass-600" />{h}</li>)}
            </ul>
          </>)}
        </div>
        <form onSubmit={submit} className="h-fit space-y-4 rounded-2xl bg-white p-6 ring-1 ring-ink-900/10 lg:sticky lg:top-24">
          <p className="text-sm text-ink-900/60">From <span className="text-2xl font-bold text-ink-900">{money(p.price, p.currency)}</span> per adult</p>
          <div><label className="label" htmlFor="d">Travel date</label>
            <input id="d" type="date" required min={tomorrow} value={f.travel_date} onChange={upd('travel_date')} className="input" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label" htmlFor="a">Adults</label><input id="a" type="number" min="1" max="20" required value={f.adults} onChange={upd('adults')} className="input" /></div>
            <div><label className="label" htmlFor="c">Children</label><input id="c" type="number" min="0" max="20" value={f.children} onChange={upd('children')} className="input" /></div>
          </div>
          <div><label className="label" htmlFor="n">Notes</label><textarea id="n" rows="3" value={f.notes} onChange={upd('notes')} className="input" placeholder="Dietary needs, special requests" /></div>
          <div className="flex justify-between border-t pt-3 text-sm"><span>Estimated total (children pay 50%)</span><strong>{money(total, p.currency)}</strong></div>
          <Alert>{err}</Alert>
          <button disabled={busy} className="btn btn-primary w-full">{user ? (busy ? 'Booking...' : 'Request booking') : 'Sign in to book'}</button>
          <a href={wa} target="_blank" rel="noreferrer" className="btn btn-outline w-full"><MessageCircle className="h-4 w-4" />Ask on WhatsApp</a>
        </form>
      </div>
    </div>
  )
}
