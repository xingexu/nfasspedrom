'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LogoScrollBar from '@/components/LogoScrollBar'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/'

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGuestContinue = () => {
    router.push('/')
    router.refresh()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        // Always redirect admins to dashboard, unless from is already an admin route
        const redirectTo = from.startsWith('/admin') ? from : '/admin/dashboard'
        router.push(redirectTo)
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Invalid username or password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Initial view - ask if they're an admin
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white flex flex-col">
        <LogoScrollBar />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md animate-fade-in">
            <div className="relative">
              {/* Decorative background elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl opacity-50"></div>
              
              <div className="relative border border-neutral-200/80 rounded-3xl shadow-xl bg-white/80 backdrop-blur-sm px-8 py-12">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h1
                    className="text-4xl font-bold text-text mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Welcome
                  </h1>
                  <p className="text-text-muted text-base">
                    Choose how you'd like to continue
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsAdmin(true)}
                    className="group w-full px-6 py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl text-base font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      I'm an Admin
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                  
                  <button
                    onClick={handleGuestContinue}
                    className="w-full px-6 py-4 bg-neutral-50 hover:bg-neutral-100 text-text rounded-xl text-base font-medium border border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Continue as Guest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Admin login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white flex flex-col">
      <LogoScrollBar />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl opacity-50"></div>
            
            <div className="relative border border-neutral-200/80 rounded-3xl shadow-xl bg-white/80 backdrop-blur-sm px-8 py-10">
              <div className="mb-8">
                <button
                  onClick={() => setIsAdmin(null)}
                  className="text-sm text-text-muted hover:text-primary transition-colors mb-6 inline-flex items-center gap-2 font-medium group"
                >
                  <svg
                    className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1
                      className="text-3xl font-bold text-text"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Admin Login
                    </h1>
                    <p className="text-text-muted text-sm mt-1">
                      Log in to create and edit posts
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-2 border-neutral-200 rounded-xl px-4 py-3 bg-white text-text focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-2 border-neutral-200 rounded-xl px-4 py-3 pr-12 bg-white text-text focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
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
                  <div className="text-sm text-red-600 bg-red-50 border-2 border-red-100 rounded-xl px-4 py-3 flex items-center gap-2 animate-fade-in">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full px-6 py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl text-base font-semibold hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



