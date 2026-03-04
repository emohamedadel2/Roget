"use client"

import { useState, useRef, useEffect } from "react"
import { CaptureInput, type ProjectOption } from "@/components/capture-input"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  CakeSlice,
  Cat,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  GraduationCap,
  Hammer,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AppShell } from "@/components/app-sidebar"
import { VaultCard, type Vault } from "@/components/vault-card"

// ── Data ────────────────────────────────────────────────────────────

const vaults: Vault[] = [
  {
    id: "1",
    name: "Sweet Crumb Bakery",
    icon: CakeSlice,
    color: "#F97316",
    description: "Sourdough, croissants, team of 5, open Tue\u2013Sat",
    promptCount: 12,
    nudge: "Flour price worth checking",
  },
  {
    id: "2",
    name: "My Fitness Journey",
    icon: Dumbbell,
    color: "#059669",
    description: "Strength training 4x/week, meal tracking",
    promptCount: 4,
  },
  {
    id: "3",
    name: "Amir\u2019s Food Allergies",
    icon: ShieldCheck,
    color: "#3B82F6",
    description: "Peanut and tree nut allergies, 4 safe brands, pediatrician on file",
    promptCount: 8,
  },
  {
    id: "4",
    name: "Home Renovation",
    icon: Hammer,
    color: "#EAB308",
    description: "Kitchen remodel in progress, contractor selected",
  },
  {
    id: "5",
    name: "Delivery Van",
    icon: Truck,
    color: "#64748B",
    description: "2019 Ford Transit, insurance current, brakes due next month",
    promptCount: 3,
    nudge: "Insurance renewal coming up",
  },
  {
    id: "6",
    name: "Luna the Cat",
    icon: Cat,
    color: "#8B5CF6",
    description: "Indoor tabby, 4 years old, special diet for sensitive stomach",
    promptCount: 2,
  },
]

interface QuickPrompt {
  id: string
  headline: string
  vaultName: string
  vaultColor: string
}

const quickPrompts: QuickPrompt[] = [
  { id: "qp1", headline: "5 Instagram Captions for This Week", vaultName: "Sweet Crumb", vaultColor: "#F97316" },
  { id: "qp2", headline: "Weekly Staff Schedule Template", vaultName: "Sweet Crumb", vaultColor: "#F97316" },
  { id: "qp3", headline: "Safe Snack List for School", vaultName: "Amir\u2019s Allergies", vaultColor: "#3B82F6" },
  { id: "qp4", headline: "This Week\u2019s Workout Plan", vaultName: "Fitness", vaultColor: "#059669" },
  { id: "qp5", headline: "Van Maintenance Checklist", vaultName: "Delivery Van", vaultColor: "#64748B" },
  { id: "qp6", headline: "Luna\u2019s Vet Visit Summary", vaultName: "Luna the Cat", vaultColor: "#8B5CF6" },
]

interface Insight {
  id: string
  text: string
  action: string
}

const insights: Insight[] = [
  {
    id: "i1",
    text: "Your lavender scones use oat flour \u2014 worth noting in Amir\u2019s allergy vault?",
    action: "Add it",
  },
  {
    id: "i2",
    text: "Your van insurance renewal is coming up \u2014 you mentioned brake issues twice.",
    action: "Open vault",
  },
  {
    id: "i3",
    text: "You\u2019ve mentioned meal prep 4 times across vaults \u2014 might deserve its own space.",
    action: "Create vault",
  },
  {
    id: "i4",
    text: "Luna\u2019s vet records overlap with Amir\u2019s allergy notes \u2014 pet dander sensitivity?",
    action: "Review",
  },
]

interface SuggestedVaultData {
  id: string
  name: string
  reason: string
}

const suggestedVaultsData: SuggestedVaultData[] = [
  {
    id: "s1",
    name: "Cake Decorating Classes",
    reason: "You mentioned selling custom classes twice in your bakery vault",
  },
  {
    id: "s2",
    name: "Weekend Meal Prep",
    reason: "Recipes from your bakery vault + Amir\u2019s safe brands could combine here",
  },
  {
    id: "s3",
    name: "Family Health Records",
    reason: "Amir\u2019s allergies + Luna\u2019s vet records suggest a broader health vault",
  },
  {
    id: "s4",
    name: "Business Expenses",
    reason: "Your bakery costs and van maintenance could be tracked together",
  },
]

// ── Smart greeting ──────────────────────────────────────────────────

function getGreeting(): { heading: string; nudge: string | null } {
  const hour = new Date().getHours()
  const dayOfWeek = new Date().getDay()
  const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening"
  const heading = `Good ${timeOfDay}, Fatima`

  const nudges = [
    "You added 3 recipes last week \u2014 ChatGPT doesn\u2019t know about them yet",
    "Your flour price might need checking",
    null,
  ]

  if (dayOfWeek === 2 && hour < 12) {
    return { heading: "Good morning, Fatima", nudge: "Opening day \u2014 your flour price might need checking" }
  }

  return { heading, nudge: nudges[new Date().getDate() % nudges.length] }
}

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)"
const ITEMS_PER_PAGE = 3

// ── Quick Prompts with Pagination ───────────────────────────────────

function QuickPromptsRow() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(quickPrompts.length / ITEMS_PER_PAGE)
  const visible = quickPrompts.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary/60" />
          <h2 className="text-lg font-semibold text-foreground">{"Quick prompts"}</h2>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous prompts"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === page ? "w-4 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/30"
                  )}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next prompts"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((qp) => (
            <button
              key={qp.id}
              className="group/qp flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-foreground/10 hover:shadow-lg hover:shadow-primary/5 text-left"
            >
              <div className="h-1 w-full opacity-50" style={{ background: BRAND_GRADIENT }} />
              <div className="flex flex-1 flex-col p-5">
                <span
                  className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white"
                  style={{ background: qp.vaultColor }}
                >
                  {qp.vaultName}
                </span>
                <p className="mt-3 text-[15px] font-semibold text-foreground leading-snug">{qp.headline}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-colors group-hover/qp:text-primary/80">
                  {"Get This"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/qp:translate-x-0.5" />
                </span>
              </div>
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}

// ── Roget Noticed ───────────────────────────────────────────────────

const MAX_INSIGHTS_VISIBLE = 3

function RogetNoticed() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const [accepted, setAccepted] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const all = insights.filter((i) => !dismissed.includes(i.id) && !accepted.includes(i.id))
  const visible = expanded ? all : all.slice(0, MAX_INSIGHTS_VISIBLE)
  const hiddenCount = all.length - MAX_INSIGHTS_VISIBLE

  if (all.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="mt-10"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-primary/60" />
        <h2 className="text-lg font-semibold text-foreground">{"Roget noticed\u2026"}</h2>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {visible.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
              className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-foreground/10 hover:shadow-md"
            >
              {/* Gradient left accent bar */}
              <div
                className="absolute left-0 top-0 h-full w-1 opacity-40"
                style={{ background: BRAND_GRADIENT }}
              />
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.12))" }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] leading-relaxed text-foreground/80">
                  {insight.text}
                </p>
              </div>
              {/* Quick action buttons: Accept / Dismiss */}
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => setAccepted((a) => [...a, insight.id])}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100 hover:border-emerald-300 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                  aria-label={`Accept: ${insight.action}`}
                  title={insight.action}
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDismissed((d) => [...d, insight.id])}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
                  aria-label="Dismiss insight"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 flex items-center gap-1 text-[14px] font-medium text-primary/70 transition-colors hover:text-primary"
        >
          {`Show ${hiddenCount} more`}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      )}
      {expanded && all.length > MAX_INSIGHTS_VISIBLE && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-3 flex items-center gap-1 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {"Show less"}
          <ChevronDown className="h-3.5 w-3.5 rotate-180" />
        </button>
      )}
    </motion.section>
  )
}

// ── Suggested Vaults with Pagination ────────────────────────────────

function SuggestedVaults() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const all = suggestedVaultsData.filter((v) => !dismissed.includes(v.id))
  const totalPages = Math.ceil(all.length / 2)
  const visible = all.slice(page * 2, (page + 1) * 2)

  if (all.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary/60" />
          <h2 className="text-lg font-semibold text-foreground">{"You might want a vault for\u2026"}</h2>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous suggestions"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === page ? "w-4 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/30"
                  )}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next suggestions"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {visible.map((sv) => (
            <div
              key={sv.id}
              className="group rounded-2xl p-[1.5px] transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/10"
              style={{ background: BRAND_GRADIENT }}
            >
              <div className="relative flex h-full flex-col gap-3 rounded-[calc(1rem-1.5px)] bg-card p-5">
                <button
                  onClick={() => setDismissed((d) => [...d, sv.id])}
                  className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground/30 transition-colors hover:bg-muted hover:text-muted-foreground/60"
                  aria-label={`Dismiss ${sv.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <span
                  className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
                  style={{ background: BRAND_GRADIENT }}
                >
                  <Sparkles className="h-3 w-3" />
                  {"Roget suggested"}
                </span>
                <h3 className="pr-6 text-[17px] font-semibold text-foreground">{sv.name}</h3>
                <p className="text-[14px] leading-relaxed text-foreground/60">{sv.reason}</p>
                <button className="mt-auto flex items-center gap-1.5 text-[14px] font-semibold text-primary transition-colors hover:text-primary/80">
                  {"Start this vault"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}

// ── Dashboard ───────────────────────────────────────────────────────

const MAX_VISIBLE_DESKTOP = 6
const MAX_VISIBLE_MOBILE = 4

export function Dashboard({
  onVaultSelect,
  onStartChat,
}: {
  onVaultSelect?: (id: string) => void
  onStartChat?: (initialMessage?: string, targetVaultId?: string) => void
}) {
  const [showAll, setShowAll] = useState(false)
  const { heading, nudge } = getGreeting()

  // Build project options from vault data for the capture input picker
  const projectOptions: ProjectOption[] = vaults.map((v) => ({
    id: v.id,
    name: v.name,
    icon: v.icon,
    color: v.color,
  }))

  const visibleVaults = showAll ? vaults : vaults.slice(0, MAX_VISIBLE_DESKTOP)

  const sidebarVaults = vaults.map((v) => ({
    id: v.id,
    name: v.name,
    icon: v.icon,
    color: v.color,
  })) as { id: string; name: string; icon: import("lucide-react").LucideIcon; color: string }[]

  return (
    <AppShell vaults={sidebarVaults} onStartChat={onStartChat}>
      {/* Top gradient atmosphere */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[360px] overflow-hidden">
        <div
          className="h-full w-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 0%, #F97316 0%, #EC4899 40%, #7C3AED 70%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-[1] mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-10">

        {/* ── Greeting + Input ─────────────────────────────────── */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-1"
          >
            <h1 className="text-2xl font-bold text-foreground md:text-[28px]">
              {heading}
            </h1>
            {nudge && (
              <p className="text-[15px] text-muted-foreground md:text-[16px]">
                {nudge}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="mt-5 w-full"
          >
            <CaptureInput animate={false} projects={projectOptions} onSubmit={(text) => onStartChat?.(text)} />
          </motion.div>
        </div>

        {/* ── Vault Cards ──────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="mt-10"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {visibleVaults.map((vault, i) => (
                <div
                  key={vault.id}
                  className={cn(
                    !showAll && i >= MAX_VISIBLE_MOBILE && "hidden sm:block"
                  )}
                >
                  <VaultCard
                    vault={vault}
                    index={i}
                    onClick={() => onVaultSelect?.(vault.id)}
                    onPromptsTap={() => onVaultSelect?.(vault.id)}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {vaults.length > MAX_VISIBLE_MOBILE && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mx-auto mt-5 flex items-center gap-1.5 rounded-xl px-4 py-2 text-[15px] font-medium text-primary/70 transition-colors hover:bg-muted hover:text-primary"
            >
              <span>{`View all ${vaults.length} vaults \u2192`}</span>
            </button>
          )}

          {showAll && vaults.length > MAX_VISIBLE_DESKTOP && (
            <button
              onClick={() => setShowAll(false)}
              className="mx-auto mt-5 flex items-center gap-1.5 rounded-xl px-4 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <span>{"Show less"}</span>
              <ChevronDown className="h-3.5 w-3.5 rotate-180 transition-transform" />
            </button>
          )}
        </motion.section>

        {/* ── Quick Prompts ────────────────────────────────────── */}
        {quickPrompts.length > 0 && <QuickPromptsRow />}

        {/* ── Roget Noticed ────────────────────────────────────── */}
        <RogetNoticed />

        {/* ── Suggested Vaults ─────────────────────────────────── */}
        <SuggestedVaults />

        {/* Bottom breathing room */}
        <div className="h-12" />
      </div>
    </AppShell>
  )
}
