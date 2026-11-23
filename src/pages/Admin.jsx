import { useEffect, useState, useCallback } from 'react'
import { Users, Package, CalendarCheck, Clock, TrendingUp } from 'lucide-react'
import { supabase, money } from '../lib/supabase'
import { Alert, Spinner } from '../components/UI'
import { statusStyle } from './Account'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  const load = useCallback(async () => {
    const [s, b] = await Promise.all([
      supabase.rpc('admin_stats'),
      supabase.from('bookings').select('*, packages(title,currency), profiles(full_name,phone)').order('created_at', { ascending: false })
    ])
    if (s.error || b.error) setErr((s.error || b.error).message)
    setStats(s.data); setRows(b.data || [])
  }, [])
  useEffect(() => { load() }, [load])
  const setStatus = async (id, status) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    error ? setErr(error.message) : load()
  }
  if (!rows) return <Spinner />
  const cards = stats ? [
    [Users, 'Users', stats.users], [Package, 'Active packages', stats.packages],
    [CalendarCheck, 'Bookings', stats.bookings], [Clock, 'Pending', stats.pending],
    [TrendingUp, 'Confirmed revenue', money(stats.revenue)]
  ] : []
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-bold">Admin dashboard</h1>
      <div className="mt-4"><Alert>{err}</Alert></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([Icon, l, v]) => (
          <div key={l} className="rounded-2xl bg-white p-5 ring-1 ring-ink-900/10">
            <Icon className="h-5 w-5 text-brass-600" /><p className="mt-3 text-2xl font-bold">{v}</p><p className="text-sm text-ink-900/60">{l}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-xl font-semibold">All bookings</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-ink-900/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b bg-ink-900/5 text-ink-900/70"><tr>
            {['Customer', 'Package', 'Travel date', 'Guests', 'Total', 'Status'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan="6" className="px-4 py-8 text-center text-ink-900/60">No bookings yet.</td></tr>}
            {rows.map(b => (
              <tr key={b.id} className="border-b last:border-0">
                <td className="px-4 py-3"><p className="font-medium">{b.profiles?.full_name || 'Unnamed'}</p><p className="text-xs text-ink-900/60">{b.profiles?.phone}</p></td>
                <td className="px-4 py-3">{b.packages?.title}</td>
                <td className="px-4 py-3">{b.travel_date}</td>
                <td className="px-4 py-3">{b.adults}A / {b.children}C</td>
                <td className="px-4 py-3">{money(b.total_price, b.packages?.currency)}</td>
                <td className="px-4 py-3">
                  <select value={b.status} onChange={e => setStatus(b.id, e.target.value)} className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[b.status]}`} aria-label="Booking status">
                    {Object.keys(statusStyle).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
