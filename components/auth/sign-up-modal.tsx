"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useAuth } from "./auth-context"

const GRADIENT = "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09a7.12 7.12 0 010-4.18V7.07H2.18A11.99 11.99 0 001 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}

export function SignUpModal() {
  const { signUpModalOpen, signUpModalReason, closeSignUpModal, signUp, signIn } = useAuth()

  const [mode, setMode] = useState<"signup" | "signin">("signup")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Reset everything when modal opens
  useEffect(() => {
    if (signUpModalOpen) {
      setMode("signup")
      setName("")
      setEmail("")
      setPassword("")
      setShowPw(false)
      setLoading(false)
      setError("")
    }
  }, [signUpModalOpen])

  // Escape key to close
  useEffect(() => {
    if (!signUpModalOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSignUpModal()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [signUpModalOpen, closeSignUpModal])

  const doOAuth = useCallback(async (provider: "google" | "apple") => {
    setLoading(true)
    setError("")
    await new Promise((r) => setTimeout(r, 800))
    const u = { name: provider === "google" ? "Google User" : "Apple User", email: `user@${provider}.com` }
    mode === "signup" ? signUp(u) : signIn(u)
  }, [mode, signUp, signIn])

  const doSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (mode === "signup" && !name.trim()) { setError("Name is required."); return }
    if (!email.trim()) { setError("Email is required."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    const u = { name: name || email.split("@")[0], email }
    mode === "signup" ? signUp(u) : signIn(u)
  }, [mode, name, email, password, signUp, signIn])

  const flip = () => {
    setMode((m) => (m === "signup" ? "signin" : "signup"))
    setError("")
  }

  if (!signUpModalOpen) return null

  const reason = signUpModalReason || (mode === "signup"
    ? "Save your vault before it disappears."
    : "Sign in to access your vaults.")

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
        onClick={closeSignUpModal}
      />

      {/* Centered wrapper — flexbox, no translate hacks */}
      <div
        className="fixed inset-0 z-[201] flex items-center justify-center p-4"
        onClick={closeSignUpModal}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={mode === "signup" ? "Create your account" : "Sign in to Roget"}
          className="relative w-full max-w-[440px] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-border/40 bg-card shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top accent */}
          <div className="h-1 w-full rounded-t-2xl" style={{ background: GRADIENT }} />

          <div className="p-6 sm:p-7">
            {/* Close button */}
            <button
              onClick={closeSignUpModal}
              className="absolute right-4 top-5 rounded-lg p-1.5 text-muted-foreground/40 transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <img src="/images/roget-colored.png" alt="Roget" className="mb-4 h-6 w-auto" />
            <h2 className="text-xl font-bold text-foreground">
              {mode === "signup" ? "Save your vault" : "Welcome back"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{reason}</p>

            {/* OAuth buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => doOAuth("google")}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:opacity-50"
              >
                <GoogleIcon />
                {mode === "signup" ? "Continue with Google" : "Sign in with Google"}
              </button>
              <button
                onClick={() => doOAuth("apple")}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-50"
              >
                <AppleIcon />
                {mode === "signup" ? "Continue with Apple" : "Sign in with Apple"}
              </button>
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground/50">{"or"}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Email form */}
            <form onSubmit={doSubmit} className="flex flex-col gap-3">
              {mode === "signup" && (
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                />
              )}

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              />

              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg disabled:opacity-60"
                style={{ background: GRADIENT }}
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    {mode === "signup" ? "Create account" : "Sign in"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer toggle */}
            <p className="mt-5 text-center text-xs text-muted-foreground">
              {mode === "signup" ? "Already have an account? " : "Need an account? "}
              <button onClick={flip} className="font-medium text-primary hover:underline">
                {mode === "signup" ? "Sign in" : "Sign up free"}
              </button>
            </p>

            {mode === "signup" && (
              <p className="mt-2 text-center text-[11px] text-muted-foreground/40">
                {"By signing up you agree to our Terms and Privacy Policy."}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
