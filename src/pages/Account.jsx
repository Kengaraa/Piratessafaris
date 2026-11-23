import { useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase, money } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Alert, Spinner, SafeImg } from '../components/UI'

export const statusStyle = {
  pending: 'bg-amber-100 text-amber-800', confirmed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800', completed: 'bg-sky-100 text-sky-800'
}

export default function Account() {
  const { profile } = useAuth()
  const booked = useLocation().state?.booked
  const [rows, setRows] = useState(null)
  const load = useCallback(() =>
    supabase.from('bookings').select('*, packages(title,slug,image_url,currency)').order('created_at', { ascending: false })
      .then(({ data }) => setRows(data || [])), [])
  useEffect(() => { load() }, [load])
  const cancel = async id => {
    if (!window.confirm('Cancel this booking?')) return
    await supabase.rpc('cancel_booking', { b_id: id }); load()
  }
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-bold">Hello{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}</h1>
      <p className="mt-1 text-ink-900/60">Your booking requests and their status.</p>
      {booked && <div className="mt-6"><Alert tone="ok">Booking request sent. Our team will contact you to confirm details and payment.</Alert></div>}
      <div className="mt-8 space-y-4">
        {!rows ? <Spinner /> : rows.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-ink-900/10">
            <p className="text-ink-900/70">You have no bookings yet.</p>
            <Link to="/packages" className="btn btn-primary mt-4">Find a trip</Link>
          </div>
        ) : rows.map(b => (
          <div key={b.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-900/10 sm:flex-row sm:items-center">
            <SafeImg src={b.packages?.image_url} alt="" className="h-28 w-full rounded-xl sm:w-40" />
            <div className="flex-1">
              <Link to={`/packages/${b.packages?.slug}`} className="text-lg font-semibold hover:underline">{b.packages?.title}</Link>
              <p className="text-sm text-ink-900/70">Travel date {b.travel_date} - {b.adults} adult(s), {b.children} child(ren)</p>
              <p className="mt-1 font-semibold">{money(b.total_price, b.packages?.currency)}</p>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[b.status]}`}>{b.status}</span>
              {['pending', 'confirmed'].includes(b.status) && <button onClick={() => cancel(b.id)} className="text-sm text-ember hover:underline">Cancel</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
