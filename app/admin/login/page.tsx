'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LogoScrollBar from '@/components/LogoScrollBar'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const disabled = useMemo(() => {
    return loading || !username.trim() || !password.trim()
  }, [loading, username, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const body = {
        username: username.trim(),
        password: password.trim(),
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        router.push('/admin/dashboard')
        router.refresh()
        return
      }

      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Invalid credentials')
    } catch (err) {
      console.error('Admin login error', err)
      setError('Unable to log in right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFAF7] text-text">
      <LogoScrollBar />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#F1EDE4] blur-3xl" />
        <div className="absolute left-10 bottom-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl">
          <div className="mb-10 flex items-center justify-between text-sm text-text/70">
            <Link href="/" className="inline-flex items-center gap-2 font-medium hover:text-primary transition-colors">
              <span className="text-lg" aria-hidden>←</span>
              <span>Back to site</span>
            </Link>
            <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-text/70 border border-white/70 shadow-sm">
              Admin access only
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-text/70 border border-white/70 shadow-sm">
                <span>Secure Portal</span>
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" aria-hidden />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Sign in to the admin console
              </h1>
              <p className="max-w-xl text-lg text-text/70">
                Manage posts, users, and comments from a unified control room. Access is restricted to authorized admins.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'Glassmorphic secure session',
                  'Role-gated admin actions',
                  'Instant redirects after login',
                  'Input trimming and validation',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/50 bg-white/70 px-4 py-3 text-sm text-text/80 shadow-sm backdrop-blur"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-white/50 blur-lg" />
              <div className="relative rounded-2xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-xl smooth-shadow-lg">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text/60">
                    Admin Login
                  </p>
                  <h2 className="text-2xl font-semibold text-text mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Welcome back
                  </h2>
                  <p className="text-sm text-text/60 mt-1">
                    Use your admin credentials to continue. Default username is <span className="font-semibold text-text">bigguy</span>.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-text">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      autoComplete="username"
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-lg border border-[#E8E1D6] bg-white/80 px-4 py-3 text-text shadow-sm outline-none ring-2 ring-transparent focus:border-primary/70 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-text">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-[#E8E1D6] bg-white/80 px-4 py-3 pr-12 text-text shadow-sm outline-none ring-2 ring-transparent focus:border-primary/70 focus:ring-primary/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text/60 hover:text-text transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015.12 5.12m3.29 3.29L12 12m-6.59-6.59l4.242 4.242M12 12l-1.348-1.348M12 12l3.29 3.29m0 0a9.97 9.97 0 001.563-3.029M15.29 15.29L12 12" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={disabled}
                    className="group relative inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/90 px-5 py-3 text-white font-semibold shadow-lg transition-all duration-200 hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="relative">
                      {loading ? 'Signing in...' : 'Log in to dashboard'}
                    </span>
                    <svg
                      className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </form>

                <div className="mt-6 flex flex-col gap-2 text-sm text-text/70">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>Sessions last 7 days by default.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>Need help?</span>
                    <Link href="mailto:admin@nfast.local" className="font-semibold text-primary underline-offset-4 hover:underline">Contact support</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between text-sm text-text/60">
            <span>Protected area — unauthorized access prohibited.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

