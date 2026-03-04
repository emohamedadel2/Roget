"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpRight,
  Check,
  Clock,
  Sparkle,
  Upload,
  Vault,
  X,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ── Types ───────────────────────────────────────────────────────────

type Tab = "attention" | "new"

interface Notification {
  id: string
  icon: React.ReactNode
  title: string
  body: string
  time: string
  cta?: string
}

// ── Data ────────────────────────────────────────────────────────────

const attentionItems: Notification[] = [
  {
    id: "a1",
    icon: <Clock className="h-4 w-4 text-accent" />,
    title: "Your flour price may be outdated",
    body: "It's been 4 months since you logged $45/50lb in Sweet Crumb Bakery. Still accurate?",
    time: "4 months old",
    cta: "Check it",
  },
  {
    id: "a2",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="np-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#np-grad-1)" />
      </svg>
    ),
    title: "ChatGPT doesn't know about your sourdough recipe",
    body: "You added it last week but Sweet Crumb Bakery hasn't been re-exported to ChatGPT yet.",
    time: "1 week ago",
    cta: "Re-export",
  },
  {
    id: "a3",
    icon: <Vault className="h-4 w-4 text-primary" />,
    title: "Your delivery van keeps coming up",
    body: "You've mentioned it 8 times across two vaults. It might deserve its own space.",
    time: "Noticed now",
    cta: "Start vault",
  },
]

const newItems: Notification[] = [
  {
    id: "n1",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="np-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="url(#np-grad-2)" />
      </svg>
    ),
    title: "5 new prompts for Sweet Crumb Bakery",
    body: "Roget generated tailored prompts based on your bakery knowledge. Ready to use in ChatGPT.",
    time: "Just now",
    cta: "View prompts",
  },
  {
    id: "n2",
    icon: <Check className="h-4 w-4 text-emerald-500" />,
    title: "Amir's Food Allergies is 90% mapped",
    body: "Great coverage. Only emergency contacts are missing — adding them would complete this vault.",
    time: "Today",
    cta: "Add contacts",
  },
  {
    id: "n3",
    icon: <Upload className="h-4 w-4 text-primary" />,
    title: "New: upload PDFs to any vault",
    body: "You can now drop menus, lab reports, or any PDF directly into a vault. Roget will extract what matters.",
    time: "2 days ago",
  },
]

// ── Notification card ────────────────────────────────────────────────

function NotifCard({
  notif,
  onDismiss,
}: {
  notif: Notification
  onDismiss: (id: string) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
      className="group relative rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
    >
      {/* Dismiss */}
      <button
        onClick={() => onDismiss(notif.id)}
        className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground/30 opacity-0 transition-all hover:bg-muted hover:text-muted-foreground group-hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-3 w-3" />
      </button>

      <div className="flex items-start gap-3 pr-4">
        {/* Icon */}
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted">
          {notif.icon}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-card-foreground leading-snug text-pretty">
            {notif.title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {notif.body}
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            {notif.cta && (
              <button className="flex items-center gap-1 text-xs font-semibold text-primary transition-opacity hover:opacity-70">
                {notif.cta}
                <ArrowUpRight className="h-3 w-3" />
              </button>
            )}
            <span className="text-xs text-muted-foreground/50">{notif.time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Panel ────────────────────────────────────────────────────────────

export function NotificationPanel({
  open,
  onClose,
  anchorLeft,
}: {
  open: boolean
  onClose: () => void
  /** px offset from left edge of screen (sidebar width) */
  anchorLeft: number
}) {
  const [tab, setTab] = useState<Tab>("attention")
  const [dismissed, setDismissed] = useState<string[]>([])

  const dismiss = (id: string) => setDismissed((prev) => [...prev, id])

  const attention = attentionItems.filter((n) => !dismissed.includes(n.id))
  const newNotifs = newItems.filter((n) => !dismissed.includes(n.id))
  const items = tab === "attention" ? attention : newNotifs

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: -12, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ left: anchorLeft + 8 }}
            className="fixed bottom-4 top-4 z-50 flex w-[360px] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl shadow-primary/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">
                {"Notifications"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-xl text-muted-foreground"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex shrink-0 gap-1 px-4 pt-3">
              {(["attention", "new"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "relative flex-1 rounded-xl py-2 text-sm font-medium transition-colors",
                    tab === t
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t === "attention" ? "Needs Attention" : "What's New"}
                  {/* Unread dot */}
                  {t === "attention" && attention.length > 0 && (
                    <span className="absolute right-3 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                    <Check className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {"All clear"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    {"Nothing here right now."}
                  </p>
                </div>
              ) : (
                <motion.div layout className="space-y-2.5">
                  <AnimatePresence mode="popLayout">
                    {items.map((notif) => (
                      <NotifCard
                        key={notif.id}
                        notif={notif}
                        onDismiss={dismiss}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
