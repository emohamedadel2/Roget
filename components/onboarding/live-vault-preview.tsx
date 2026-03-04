"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CakeSlice,
  Check,
  ChefHat,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  Dumbbell,
  Heart,
  Instagram,
  Lock,
  Pencil,
  Settings,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)"

// ── Types shared with onboarding-chat ─────────────────────────────

export interface LiveEntry {
  id: string
  content: string
  source: "text" | "voice" | "photo" | "file"
  isNew?: boolean
}

export interface LiveSection {
  id: string
  name: string
  icon: LucideIcon
  color: string
  entries: LiveEntry[]
  suggested?: boolean
  suggestedReason?: string
  highlightUntil?: number
}

export interface LiveVault {
  id: string
  name: string
  icon: LucideIcon
  color: string
  sections: LiveSection[]
  summary?: string
  itemCount: number
}

// ── Section icon map ──────────────────────────────────────────────

export const SECTION_ICON_MAP: Record<string, { icon: LucideIcon; color: string }> = {
  equipment:  { icon: Settings,    color: "#3B82F6" },
  recipes:    { icon: ChefHat,     color: "#F97316" },
  products:   { icon: ChefHat,     color: "#F97316" },
  suppliers:  { icon: Truck,       color: "#10B981" },
  staff:      { icon: Users,       color: "#8B5CF6" },
  hours:      { icon: Clock,       color: "#14B8A6" },
  pricing:    { icon: DollarSign,  color: "#F59E0B" },
  instagram:  { icon: Instagram,   color: "#EC4899" },
  favorites:  { icon: Heart,       color: "#EF4444" },
  allergies:  { icon: ShieldCheck,  color: "#3B82F6" },
  fitness:    { icon: Dumbbell,    color: "#059669" },
}

export const VAULT_ICON_MAP: Record<string, { icon: LucideIcon; color: string }> = {
  bakery:    { icon: CakeSlice,   color: "#7C3AED" },
  allergies: { icon: ShieldCheck,  color: "#3B82F6" },
  fitness:   { icon: Dumbbell,    color: "#059669" },
}

// ── LiveVaultPreview component ────────────────────────────────────

export function LiveVaultPreview({
  vaults,
  activeVaultId,
  onVaultChange,
  className,
}: {
  vaults: LiveVault[]
  activeVaultId: string
  onVaultChange: (id: string) => void
  className?: string
}) {
  const vault = vaults.find((v) => v.id === activeVaultId) ?? vaults[0]
  const hasMultipleVaults = vaults.length > 1

  if (!vault) {
    return <EmptyVaultPlaceholder className={className} />
  }

  const filledSections = vault.sections.filter((s) => !s.suggested && s.entries.length > 0)
  const suggestedSections = vault.sections.filter((s) => s.suggested)
  const isEmpty = filledSections.length === 0

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Vault header */}
      <div className="shrink-0 border-b border-border bg-background/95 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${vault.color}15` }}
          >
            <vault.icon className="h-5 w-5" style={{ color: vault.color }} />
          </div>
          <div className="min-w-0 flex-1">
            {hasMultipleVaults ? (
              <VaultSwitcher
                vaults={vaults}
                activeId={activeVaultId}
                onChange={onVaultChange}
              />
            ) : (
              <h2 className="text-lg font-bold text-foreground truncate">{vault.name || "New Vault"}</h2>
            )}
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              {vault.itemCount > 0
                ? `${vault.itemCount} items across ${filledSections.length} section${filledSections.length !== 1 ? "s" : ""}`
                : "Your vault will appear here as we build it together"
              }
            </p>
          </div>
        </div>

        {/* Depth indicator */}
        {vault.itemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">{"Vault depth"}</span>
              <span className="text-[11px] font-medium tabular-nums" style={{ color: vault.color }}>
                {Math.min(vault.itemCount * 2, 100)}{"%"}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: BRAND_GRADIENT }}
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(vault.itemCount * 2, 100)}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Vault content */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center px-8 py-12 text-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${vault.color}10` }}
            >
              <vault.icon className="h-7 w-7" style={{ color: `${vault.color}40` }} />
            </div>
            <p className="text-sm font-medium text-foreground/60">
              {"Your vault will appear here"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground/40 max-w-[240px] leading-relaxed">
              {"As you tell me about your world, I'll organize everything into sections you can browse, edit, and use with AI."}
            </p>
          </div>
        ) : (
          <div className="px-5 py-5 space-y-3">
            {/* AI Summary */}
            {vault.summary && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">{"Roget knows "}</span>
                  {vault.summary}
                </p>
              </motion.div>
            )}

            {/* Filled sections */}
            <AnimatePresence initial={false}>
              {filledSections.map((section) => (
                <LiveSectionBlock key={section.id} section={section} />
              ))}
            </AnimatePresence>

            {/* Suggested sections */}
            {suggestedSections.length > 0 && (
              <div className="pt-2">
                <p className="mb-2 text-[11px] font-medium text-muted-foreground/40 uppercase tracking-wider px-1">
                  {"Suggested sections"}
                </p>
                {suggestedSections.map((section) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 rounded-xl border border-dashed border-border/60 px-4 py-3 mb-2"
                  >
                    <section.icon className="h-4 w-4 text-muted-foreground/30" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-muted-foreground/60">{section.name}</p>
                      {section.suggestedReason && (
                        <p className="text-[11px] text-muted-foreground/40 mt-0.5 truncate">{section.suggestedReason}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Empty placeholder ─────────────────────────────────────────────

function EmptyVaultPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col items-center justify-center px-8 text-center", className)}>
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/60">
        <Sparkles className="h-8 w-8 text-muted-foreground/20" />
      </div>
      <p className="text-base font-medium text-foreground/50">
        {"Your vault will appear here"}
      </p>
      <p className="mt-2 text-sm text-muted-foreground/40 max-w-[280px] leading-relaxed">
        {"Start telling Roget about your world and watch it come to life in real time."}
      </p>
    </div>
  )
}

// ── Vault switcher dropdown ───────────────────────────────────────

function VaultSwitcher({
  vaults,
  activeId,
  onChange,
}: {
  vaults: LiveVault[]
  activeId: string
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const active = vaults.find((v) => v.id === activeId)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-lg font-bold text-foreground transition-colors hover:text-primary"
      >
        <span className="truncate">{active?.name || "Vault"}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full z-20 mt-1 w-56 rounded-xl border border-border bg-card shadow-lg py-1.5"
            >
              {vaults.map((v) => (
                <button
                  key={v.id}
                  onClick={() => { onChange(v.id); setOpen(false) }}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/60",
                    v.id === activeId && "bg-primary/5"
                  )}
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${v.color}15` }}
                  >
                    <v.icon className="h-3.5 w-3.5" style={{ color: v.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{v.name}</p>
                    <p className="text-[11px] text-muted-foreground/50">
                      {v.itemCount}{" item"}{v.itemCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {v.id === activeId && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Section block ─────────────────────────────────────────────────

function LiveSectionBlock({ section }: { section: LiveSection }) {
  const [expanded, setExpanded] = useState(true)
  const isHighlighted = section.highlightUntil && Date.now() < section.highlightUntil

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "rounded-xl border bg-card overflow-hidden transition-all duration-300",
        isHighlighted
          ? "border-primary/30 shadow-sm shadow-primary/5"
          : "border-border"
      )}
    >
      {/* Section header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30"
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${section.color}12` }}
        >
          <section.icon className="h-4 w-4" style={{ color: section.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{section.name}</span>
            <span className="text-[11px] tabular-nums text-muted-foreground/50">{section.entries.length}</span>
          </div>
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 text-muted-foreground/30 transition-transform duration-200",
            expanded && "rotate-90"
          )}
        />
      </button>

      {/* Entries */}
      <AnimatePresence initial={false}>
        {expanded && section.entries.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/50 px-4 py-2 space-y-0.5">
              {section.entries.map((entry) => (
                <LiveEntryRow key={entry.id} entry={entry} sectionColor={section.color} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Entry row ─────────────────────────────────────────────────────

const SOURCE_LABEL: Record<string, string> = {
  text: "typed",
  voice: "voice",
  photo: "photo",
  file: "document",
}

function LiveEntryRow({ entry, sectionColor }: { entry: LiveEntry; sectionColor: string }) {
  return (
    <motion.div
      initial={entry.isNew ? { opacity: 0, x: -8, backgroundColor: `${sectionColor}10` } : { opacity: 1 }}
      animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-2.5 rounded-lg px-2 py-2 group"
    >
      <div
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: `${sectionColor}40` }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-relaxed text-foreground/80">{entry.content}</p>
        <p className="text-[11px] text-muted-foreground/40 mt-0.5">
          {"via "}{SOURCE_LABEL[entry.source] || entry.source}
        </p>
      </div>
      <button
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/20 opacity-0 transition-all hover:bg-muted hover:text-muted-foreground/60 group-hover:opacity-100"
        aria-label="Edit entry"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </motion.div>
  )
}
