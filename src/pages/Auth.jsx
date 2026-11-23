import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Alert } from '../components/UI'

function Shell({ title, sub, children }) {
  return (
    <div className="container-x flex justify-center py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 ring-1 ring-ink-900/10">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-ink-900/60">{sub}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

export function Login() {
  const { signIn } = useAuth()
  const nav = useNavigate()
  const from = useLocation().state?.from || '/account'
  const [f, setF] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const go = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    const { error } = await signIn(f.email, f.password)
    setBusy(false)
    error ? setErr(error.message) : nav(from, { replace: true })
  }
  return (
    <Shell title="Welcome back" sub="Sign in to manage your trips.">
      <form onSubmit={go} className="space-y-4">
        <div><label className="label" htmlFor="e">Email</label><input id="e" type="email" required autoComplete="email" className="input" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
        <div><label className="label" htmlFor="p">Password</label><input id="p" type="password" required autoComplete="current-password" className="input" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></div>
        <Alert>{err}</Alert>
        <button disabled={busy} className="btn btn-primary w-full">{busy ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <p className="mt-5 text-center text-sm">New here? <Link to="/register" className="font-semibold text-brass-600 hover:underline">Create an account</Link></p>
    </Shell>
  )
}

export function Register() {
  const { signUp } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', phone: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const go = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    const { data, error } = await signUp(f.email, f.password, f.name, f.phone)
    setBusy(false)
    if (error) return setErr(error.message)
    data.session ? nav('/account') : setMsg('Check your email to confirm your account, then sign in.')
  }
  return (
    <Shell title="Create your account" sub="Book trips and track every request in one place.">
      {msg ? <Alert tone="ok">{msg}</Alert> : (
        <form onSubmit={go} className="space-y-4">
          <div><label className="label" htmlFor="n">Full name</label><input id="n" required className="input" value={f.name} onChange={set('name')} /></div>
          <div><label className="label" htmlFor="ph">Phone</label><input id="ph" type="tel" className="input" value={f.phone} onChange={set('phone')} /></div>
          <div><label className="label" htmlFor="em">Email</label><input id="em" type="email" required autoComplete="email" className="input" value={f.email} onChange={set('email')} /></div>
          <div><label className="label" htmlFor="pw">Password</label><input id="pw" type="password" required minLength={8} autoComplete="new-password" className="input" value={f.password} onChange={set('password')} /><p className="mt-1 text-xs text-ink-900/50">At least 8 characters.</p></div>
          <Alert>{err}</Alert>
          <button disabled={busy} className="btn btn-primary w-full">{busy ? 'Creating...' : 'Create account'}</button>
        </form>
      )}
      <p className="mt-5 text-center text-sm">Already registered? <Link to="/login" className="font-semibold text-brass-600 hover:underline">Sign in</Link></p>
    </Shell>
  )
}
