"use client"

import { motion } from "framer-motion"
import { Sparkles, X, Lock, Save } from "lucide-react"
import { useAuth } from "./auth-context"

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)"

// ── Google OAuth mini button (reusable) ───────────────────────────
function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

// ── 1. After extraction nudge — inline chat card ──────────────────
export function NudgeAfterExtraction({ onDismiss }: { onDismiss: () => void }) {
  const { openSignUpModal } = useAuth()
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3 }}
      className="my-2 overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-sm shadow-primary/5"
    >
      <div className="h-0.5 w-full" style={{ background: BRAND_GRADIENT }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))" }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-foreground">{"Your vault is building nicely."}</p>
              <p className="text-[13px] text-muted-foreground">{"Sign up to keep it — guest sessions don't save."}</p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="shrink-0 rounded-md p-1 text-muted-foreground/40 hover:text-muted-foreground"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => openSignUpModal("Your vault is ready to save.")}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm shadow-primary/20"
            style={{ background: BRAND_GRADIENT }}
          >
            <GoogleLogo />
            {"Continue with Google"}
          </button>
          <button
            onClick={onDismiss}
            className="rounded-xl border border-border px-3.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted"
          >
            {"Maybe later"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── 2. Magic moment nudge — inline chat card ──────────────────────
export function NudgeMagicMoment({ onDismiss }: { onDismiss: () => void }) {
  const { openSignUpModal } = useAuth()
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3 }}
      className="my-2 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-accent/5 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14px] leading-snug text-foreground">
          {"Sign up and you'll get prompts like this — personalised to your vault — every time."}
        </p>
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-md p-1 text-muted-foreground/40 hover:text-muted-foreground"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        onClick={() => openSignUpModal("Keep your vault and unlock all prompts.")}
        className="mt-3 rounded-xl px-4 py-2 text-[13px] font-semibold text-white"
        style={{ background: BRAND_GRADIENT }}
      >
        {"Save my vault"}
      </button>
    </motion.div>
  )
}

// ── 3. Guest banner — slim amber bar at bottom of vault panel ─────
export function NudgeGuestBanner() {
  const { openSignUpModal, dismissNudge } = useAuth()
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      className="flex shrink-0 items-center justify-between gap-3 border-t border-amber-200/60 bg-amber-50/80 px-4 py-2.5 dark:border-amber-900/30 dark:bg-amber-950/30"
    >
      <p className="text-[12px] text-amber-700 dark:text-amber-400">
        {"Guest session — your vault disappears when you close this tab."}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => openSignUpModal("Save your vault before it's gone.")}
          className="whitespace-nowrap rounded-lg px-3 py-1 text-[12px] font-semibold text-white"
          style={{ background: BRAND_GRADIENT }}
        >
          {"Save vault"}
        </button>
        <button
          onClick={() => dismissNudge("tab-overlay")}
          className="text-amber-600/50 hover:text-amber-700 dark:text-amber-500/50"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

// ── 4. Tab overlay — for Export/Prompts tabs when guest ───────────
export function NudgeTabOverlay({ tab }: { tab: "export" | "prompts" }) {
  const { openSignUpModal } = useAuth()
  const label = tab === "export" ? "export your vault" : "unlock smart prompts"
  const description =
    tab === "export"
      ? "Sign up to export your vault as Markdown, JSON, or a ready-to-paste AI prompt."
      : "Sign up to access personalised prompts built from your vault data."

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-background/90 p-8 text-center backdrop-blur-sm"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))" }}
      >
        <Lock className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-[16px] font-semibold text-foreground">{"Sign up to " + label}</p>
        <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => openSignUpModal(`Sign up to ${label}.`)}
        className="rounded-xl px-5 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-primary/20"
        style={{ background: BRAND_GRADIENT }}
      >
        {"Create free account"}
      </button>
    </motion.div>
  )
}

// ── 5. Keep-going save option — extra chip in keep-going list ─────
export function NudgeKeepGoingSave() {
  const { openSignUpModal } = useAuth()
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => openSignUpModal("Save your vault and come back later.")}
      className="flex w-full items-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-4 text-left transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))" }}
      >
        <Save className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-[14px] font-semibold text-foreground">{"Save this vault and come back later"}</p>
        <p className="text-[12px] text-muted-foreground">{"Free account — takes 30 seconds"}</p>
      </div>
    </motion.button>
  )
}
