"use client"

import { useState, useEffect, useCallback } from "react"
import { Eye, EyeOff, ArrowRight, ArrowLeft, Mail, Check } from "lucide-react"
import Link from "next/link"

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED 0%, #EC4899 55%, #F97316 100%)"

/* ── Rotating testimonials for the left panel ───────────────────── */
const TESTIMONIALS = [
  {
    text: "Fatima\u2019s bakery vault has generated 47 prompts this month.",
    name: "Fatima",
    role: "Bakery owner",
  },
  {
    text: "James updated his guitar students vault \u2014 3 new practice plans ready.",
    name: "James",
    role: "Guitar teacher",
  },
  {
    text: "Priya asked AI about her dad\u2019s medications and got a trusted answer in seconds.",
    name: "Priya",
    role: "Daughter & caregiver",
  },
  {
    text: "Sofia\u2019s novel vault keeps her story consistent across 400 pages.",
    name: "Sofia",
    role: "Novelist",
  },
  {
    text: "David\u2019s AI writes custom workout programs for each of his 15 clients.",
    name: "David",
    role: "Personal trainer",
  },
]

/* ── SVG icons ──────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}

/* ── Left panel with rotating testimonials ───────────────────────── */
function LeftPanel() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden lg:flex">
      {/* Warm gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 30% 20%, rgba(124,58,237,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 70% 70%, rgba(236,72,153,0.14) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 90%, rgba(249,115,22,0.10) 0%, transparent 45%)
          `,
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-background/40" aria-hidden="true" />

      {/* Logo & tagline */}
      <div className="relative z-10 p-10">
        <img
          src="/images/roget-colored.png"
          alt="Roget"
          className="mb-8 h-9 w-auto"
        />
        <h2 className="text-[28px] font-bold leading-tight text-foreground">
          {"Your vaults are waiting."}
        </h2>
        <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">
          {"Pick up right where you left off."}
        </p>
      </div>

      {/* Testimonial rotator */}
      <div className="relative z-10 p-10">
        <div className="relative min-h-[120px]">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="absolute inset-0 flex flex-col justify-end transition-all duration-700 ease-in-out"
              style={{
                opacity: i === activeIndex ? 1 : 0,
                transform: i === activeIndex ? "translateY(0)" : "translateY(8px)",
              }}
              aria-hidden={i !== activeIndex}
            >
              <p className="text-[16px] italic leading-relaxed text-foreground/80">
                {"\u201C" + t.text + "\u201D"}
              </p>
              <p className="mt-3 text-[14px] font-semibold text-foreground">
                {t.name}
                <span className="ml-1.5 font-normal text-muted-foreground">
                  {"\u00B7 " + t.role}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 16 : 6,
                background: i === activeIndex
                  ? "hsl(263, 70%, 58%)"
                  : "hsl(250, 10%, 91%)",
              }}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Sign In Page ────────────────────────────────────────────────── */
export function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOAuth = async (provider: "google" | "apple") => {
    setIsLoading(true)
    setError(null)
    await new Promise((r) => setTimeout(r, 900))
    // Mock — replace with real OAuth
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim()) { setError("Email is required."); return }
    if (!password || password.length < 6) { setError("Password must be at least 6 characters."); return }
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    // Mock — replace with real sign in
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* LEFT — 55% on desktop */}
      <div className="hidden w-[55%] lg:block">
        <div className="h-full">
          <LeftPanel />
        </div>
      </div>

      {/* RIGHT — 45% on desktop, 100% on mobile */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-6 py-10 lg:w-[45%]">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <img
            src="/images/roget-colored.png"
            alt="Roget"
            className="mx-auto h-8 w-auto"
          />
          <p className="mt-3 text-center text-[16px] text-muted-foreground">
            {"Your vaults are waiting."}
          </p>
        </div>

        <div className="w-full max-w-[400px]">
          <h1 className="text-[28px] font-bold text-foreground">{"Welcome back"}</h1>
          <p className="mt-1.5 text-[15px] text-muted-foreground">
            {"Sign in to your Roget account"}
          </p>

          {/* OAuth buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => handleOAuth("google")}
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card text-[16px] font-medium text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md disabled:opacity-50"
            >
              <GoogleIcon />
              {"Continue with Google"}
            </button>
            <button
              onClick={() => handleOAuth("apple")}
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-foreground text-[16px] font-medium text-background shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
            >
              <AppleIcon />
              {"Continue with Apple"}
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[13px] text-muted-foreground/50">{"or"}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-border bg-muted/30 px-4 text-[16px] text-foreground placeholder-muted-foreground/40 outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-border bg-muted/30 px-4 pr-12 text-[16px] text-foreground placeholder-muted-foreground/40 outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p role="alert" className="text-[14px] text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[16px] font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-60"
              style={{ background: BRAND_GRADIENT }}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {"Sign in"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4">
            <Link
              href="/forgot-password"
              className="text-[14px] font-medium text-primary hover:underline"
            >
              {"Forgot password?"}
            </Link>
          </div>

          {/* Bottom link */}
          <div className="mt-10 border-t border-border pt-6 text-center">
            <p className="text-[14px] text-muted-foreground">
              {"Don\u2019t have an account? "}
              <Link
                href="/"
                className="font-medium text-primary hover:underline"
              >
                {"Try Roget free \u2192"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Forgot Password Page ────────────────────────────────────────── */
export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim()) { setError("Email is required."); return }
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setSent(true)
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* LEFT */}
      <div className="hidden w-[55%] lg:block">
        <div className="h-full">
          <LeftPanel />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-6 py-10 lg:w-[45%]">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <img
            src="/images/roget-colored.png"
            alt="Roget"
            className="mx-auto h-8 w-auto"
          />
        </div>

        <div className="w-full max-w-[400px]">
          {sent ? (
            /* ── Success state ──────────────────────────────────── */
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                <Check className="h-7 w-7 text-emerald-600" />
              </div>
              <h1 className="text-[28px] font-bold text-foreground">{"Check your email"}</h1>
              <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
                {"We sent a reset link to "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <Link
                href="/signin"
                className="mt-8 inline-flex items-center gap-1.5 text-[15px] font-medium text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                {"Back to sign in"}
              </Link>
            </div>
          ) : (
            /* ── Reset form ─────────────────────────────────────── */
            <>
              <h1 className="text-[28px] font-bold text-foreground">{"Reset your password"}</h1>
              <p className="mt-1.5 text-[15px] text-muted-foreground">
                {"Enter your email and we\u2019ll send you a reset link."}
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                    className="h-12 w-full rounded-xl border border-border bg-muted/30 pl-11 pr-4 text-[16px] text-foreground placeholder-muted-foreground/40 outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-[14px] text-destructive">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[16px] font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-60"
                  style={{ background: BRAND_GRADIENT }}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      {"Send reset link"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <Link
                href="/signin"
                className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {"Back to sign in"}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
