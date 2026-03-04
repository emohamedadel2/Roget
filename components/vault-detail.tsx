"use client"

import { useState, useRef, useEffect } from "react"
import type { LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Clock,
  Compass,
  Download,
  FileUp,
  ImageUp,
  Keyboard,
  LayoutGrid,
  Lightbulb,
  Lock,
  MessageSquarePlus,
  Mic,
  Pencil,
  Plus,
  Settings,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/app-sidebar"
import { CaptureInput } from "@/components/capture-input"
import { PromptsTab } from "@/components/prompts-tab"
import { ExportTab } from "@/components/export-tab"
import { NudgeTabOverlay } from "@/components/auth/sign-up-nudges"
import { useAuth } from "@/components/auth/auth-context"
import {
  CakeSlice,
  Dumbbell,
  ShieldCheck,
  Truck,
  Cat,
  GraduationCap,
  Hammer,
  ChefHat,
  DollarSign,
  Instagram,
  Heart,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// ── Types ────────────────────────────────────────────────────────────

export type CaptureMethod = "photo" | "voice" | "file" | "text"
export type Confidence = "high" | "medium" | "low"

export interface Entry {
  id: string
  content: string
  captureMethod: CaptureMethod
  addedAt: string
  isPrivate?: boolean
  isStale?: boolean
  staleValue?: string
  confidence?: Confidence
  done?: boolean
}

export interface Insight {
  id: string
  text: string
  actionLabel: string
}

export interface Section {
  id: string
  name: string
  entries: Entry[]
  suggested?: boolean
  suggestedReason?: string
  insights?: Insight[]
  icon?: LucideIcon
  color?: string
  preview?: string
}

export interface MissingItem {
  label: string
  accuracyGain: number
}

// ── Section visual metadata ──────────────────────────────────────────

export const SECTION_VISUALS: Record<string, { icon: LucideIcon; color: string; preview: string }> = {
  equipment: {
    icon: Settings,
    color: "#3B82F6",
    preview: "Bongard deck oven, blast chiller, Hobart mixer, +1 more",
  },
  recipes: {
    icon: ChefHat,
    color: "#F97316",
    preview: "Sourdough loaf, croissants, lavender scones, +1 more",
  },
  suppliers: {
    icon: Truck,
    color: "#10B981",
    preview: "Mill Creek Flour, Dairy Fresh",
  },
  staff: {
    icon: Users,
    color: "#8B5CF6",
    preview: "3 full-time, 2 part-time · Maria manages mornings",
  },
  hours: {
    icon: Clock,
    color: "#14B8A6",
    preview: "Tue-Sat 6am-3pm",
  },
  pricing: {
    icon: DollarSign,
    color: "#F59E0B",
    preview: "",
  },
  instagram: {
    icon: Instagram,
    color: "#EC4899",
    preview: "",
  },
  favorites: {
    icon: Heart,
    color: "#EF4444",
    preview: "",
  },
}

// ── Mock data ─────────────────────────────────────────────────────────

const VAULT_SECTIONS: Section[] = [
  {
    id: "equipment",
    name: "Equipment",
    insights: [
      {
        id: "i1",
        text: "Your blast chiller and tempering machine mean you can handle volume AND specialty chocolate work. Should I note chocolate specialties as a capability?",
        actionLabel: "Yes, add it",
      },
    ],
    entries: [
      { id: "e1", content: "Bongard deck oven — 2-deck, electric, purchased 2021", captureMethod: "photo", addedAt: "3 months ago", confidence: "high" },
      { id: "e2", content: "Blast chiller — Irinox HBF, capacity 10kg", captureMethod: "photo", addedAt: "3 months ago", confidence: "high" },
      { id: "e3", content: "Hobart spiral mixer — 20qt, used for all bread doughs", captureMethod: "photo", addedAt: "3 months ago", confidence: "high" },
      { id: "e4", content: "Tempering machine — ChocoVision Revolation Delta", captureMethod: "photo", addedAt: "2 months ago", confidence: "medium" },
    ],
  },
  {
    id: "recipes",
    name: "Recipes",
    entries: [
      { id: "r1", content: "Sourdough loaf — 78% hydration, 18-hour cold ferment, 250g starter", captureMethod: "text", addedAt: "5 months ago", confidence: "high" },
      { id: "r2", content: "Croissants — 27 layers, 72-hour butter block, 3 turns", captureMethod: "text", addedAt: "4 months ago", confidence: "high" },
      { id: "r3", content: "Lavender scones — oat flour base, dried lavender, lemon glaze", captureMethod: "text", addedAt: "4 months ago", confidence: "medium" },
      { id: "r4", content: "Chocolate ganache — 60% Valrhona, 1:1.2 ratio, infused with sea salt", captureMethod: "text", addedAt: "2 months ago", isPrivate: true, confidence: "high" },
    ],
  },
  {
    id: "suppliers",
    name: "Suppliers",
    entries: [
      {
        id: "s1",
        content: "Mill Creek Flour — $45/50lb bag, all-purpose unbleached. Lead time: 3 days.",
        captureMethod: "voice",
        addedAt: "4 months ago",
        isStale: true,
        staleValue: "$45/50lb",
        confidence: "low",
      },
      { id: "s2", content: "Dairy Fresh — whole milk $3.20/gal, butter $4.50/lb. Weekly delivery Mon.", captureMethod: "voice", addedAt: "2 months ago", confidence: "high" },
    ],
  },
  {
    id: "pricing",
    name: "Pricing",
    suggested: true,
    entries: [],
    suggestedReason: "Adding your prices means AI can help with cost analysis, menu planning, and competitor comparisons.",
  },
  {
    id: "staff",
    name: "Staff",
    entries: [
      { id: "st1", content: "3 full-time staff. 2 part-time weekends only.", captureMethod: "text", addedAt: "6 months ago", confidence: "high" },
      { id: "st2", content: "Maria — morning shift manager, opens at 5:30am, handles all prep", captureMethod: "text", addedAt: "6 months ago", isPrivate: true, confidence: "high" },
    ],
  },
  {
    id: "hours",
    name: "Hours",
    insights: [
      {
        id: "i2",
        text: "You're closed Sun-Mon but your Instagram gets the most engagement on Sundays. Worth noting for scheduling posts?",
        actionLabel: "Note it",
      },
    ],
    entries: [
      { id: "h1", content: "Open Tuesday-Saturday, 6am-3pm. Closed Sunday & Monday.", captureMethod: "voice", addedAt: "6 months ago", confidence: "high" },
    ],
  },
  {
    id: "instagram",
    name: "Instagram Voice",
    suggested: true,
    entries: [],
    suggestedReason: "Adding your brand tone means AI can write captions that actually sound like you.",
  },
  {
    id: "favorites",
    name: "Customer Favorites",
    suggested: true,
    entries: [],
    suggestedReason: "Knowing what sells best helps AI suggest seasonal specials and marketing angles.",
  },
]

const MISSING_ITEMS: MissingItem[] = [
  { label: "Pricing", accuracyGain: 12 },
  { label: "Instagram voice", accuracyGain: 8 },
  { label: "Customer favorites", accuracyGain: 6 },
  { label: "Seasonal menu", accuracyGain: 4 },
]

const SIDEBAR_VAULTS = [
  { id: "1", name: "Sweet Crumb Bakery", icon: CakeSlice, color: "#7C3AED" },
  { id: "2", name: "My Fitness Journey", icon: Dumbbell, color: "#059669" },
  { id: "3", name: "Amir's Allergies", icon: ShieldCheck, color: "#3B82F6" },
  { id: "4", name: "Home Renovation", icon: Hammer, color: "#F43F5E" },
  { id: "5", name: "Delivery Van", icon: Truck, color: "#F97316" },
  { id: "6", name: "Luna the Cat", icon: Cat, color: "#8B5CF6" },
  { id: "7", name: "Cake Classes", icon: GraduationCap, color: "#EC4899" },
]

const VAULT_NAV = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "export",   label: "Export",   icon: Upload },
  { id: "prompts",  label: "Prompts",  icon: Sparkles },
]

// ── Constants ─────────────────────────────────────────────────────────

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)"

// ── AI capabilities ──────────────────────────────────────────────────

const UNLOCKED_CAPABILITIES = [
  "Menu planning",
  "Supplier emails",
  "Staff scheduling",
  "Recipe development",
  "Equipment descriptions",
  "Customer communication",
]

const LOCKED_CAPABILITIES = [
  { label: "Cost analysis", requires: "pricing" },
  { label: "Competitor comparisons", requires: "pricing" },
  { label: "Instagram captions", requires: "instagram" },
  { label: "Seasonal specials", requires: "favorites" },
]

// ── Gradient bolt ─────────────────────────────────────────────────────

function GradientImpactIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#bolt-grad)" opacity="0.8" />
    </svg>
  )
}

// ── Capture method icon ───────────────────────────────────────────────

const CAPTURE_META: Record<CaptureMethod, { icon: LucideIcon; label: string; color: string; bg: string }> = {
  photo: { icon: ImageUp,  label: "Image", color: "#3B82F6", bg: "#3B82F615" },
  voice: { icon: Mic,      label: "Voice", color: "#EC4899", bg: "#EC489915" },
  file:  { icon: FileUp,   label: "File",  color: "#F97316", bg: "#F9731615" },
  text:  { icon: Keyboard, label: "Text",  color: "#7C3AED", bg: "#7C3AED15" },
}

function CaptureIcon({ method }: { method: CaptureMethod }) {
  const meta = CAPTURE_META[method]
  const Icon = meta.icon
  return (
    <span
      title={meta.label}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: meta.bg }}
    >
      <Icon className="h-4 w-4" style={{ color: meta.color }} />
    </span>
  )
}

// ── Confidence badge ──────────────────────────────────────────────────

const CONFIDENCE_META: Record<Confidence, { label: string; border: string; dot: string }> = {
  high:   { label: "High",   border: "border-emerald-400/50", dot: "bg-emerald-400" },
  medium: { label: "Medium", border: "border-amber-400/50",   dot: "bg-amber-400" },
  low:    { label: "Low",    border: "border-rose-400/50",    dot: "bg-rose-400" },
}

// ── AI Hero Summary ──────────────────────────────────────────────────

function VaultHeroSummary({
  sections,
  summaryText,
  vaultName,
  depthPercent,
  unlockedCapabilities,
  lockedCapabilities,
  lastAdded,
}: {
  sections?: Section[]
  summaryText?: string
  vaultName?: string
  depthPercent?: number
  unlockedCapabilities?: string[]
  lockedCapabilities?: { label: string; requires: string }[]
  lastAdded?: { label: string; time: string }
}) {
  const [expanded, setExpanded] = useState(false)
  const srcSections = sections ?? VAULT_SECTIONS
  const totalEntries = srcSections.filter(s => !s.suggested).reduce((n, s) => n + s.entries.length, 0)
  const activeSections = srcSections.filter(s => !s.suggested).length
  const percent = depthPercent ?? 82
  const caps = unlockedCapabilities ?? UNLOCKED_CAPABILITIES
  const locked = lockedCapabilities ?? LOCKED_CAPABILITIES
  const name = vaultName ?? "Sweet Crumb Bakery"
  const summary = summaryText ?? `is an artisan operation specializing in sourdough and pastries. You run a serious production kitchen \u2014 Bongard deck oven, blast chiller, tempering machine \u2014 with a team of 5 led by Maria on mornings. You source flour from Mill Creek ($45/50lb) and dairy from Dairy Fresh. Open Tue-Sat, 6am-3pm.`
  const lastItem = lastAdded ?? { label: "Chocolate ganache recipe", time: "2 days ago" }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
      {/* Roget badge + progress line */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: BRAND_GRADIENT }}
        >
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-foreground">{"Roget's understanding"}</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {`${percent}% mapped`}{" · "}{totalEntries}{" items across "}{activeSections}{" sections"}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted mb-6">
        <motion.div
          className="h-full rounded-full"
          style={{ background: BRAND_GRADIENT }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </div>

      {/* AI Summary paragraph */}
      <p className="text-base leading-relaxed text-foreground/85">
        {"Roget knows "}
        <span className="font-semibold text-foreground">{name}</span>
        {" "}{summary}
      </p>

      {/* Capabilities */}
      <div className="mt-6">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          {"AI can help you with"}
        </p>
        <div className="flex flex-wrap gap-2">
          {caps.map((cap) => (
            <span
              key={cap}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-[13px] font-medium text-primary"
            >
              <Check className="h-3 w-3" />
              {cap}
            </span>
          ))}
          {locked.slice(0, expanded ? locked.length : 2).map((cap) => (
            <span
              key={cap.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-[13px] text-muted-foreground/60"
            >
              <Lock className="h-3 w-3" />
              {cap.label}
            </span>
          ))}
          {!expanded && locked.length > 2 && (
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex items-center rounded-full px-3 py-1.5 text-[13px] font-medium text-primary/70 transition-colors hover:text-primary"
            >
              {"+"}
              {locked.length - 2}
              {" more"}
            </button>
          )}
        </div>
        {expanded && (
          <p className="mt-3 text-[13px] text-muted-foreground/60 leading-relaxed">
            {"Add "}
            <span className="font-medium text-foreground/70">{"pricing"}</span>
            {" to unlock cost analysis and competitor comparisons"}
          </p>
        )}
      </div>

      {/* Recent activity pulse */}
      <div className="mt-6 flex items-center gap-2 pt-5 border-t border-border">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <p className="text-[14px] text-muted-foreground">
          {"Last added: "}
          <span className="font-medium text-foreground/80">{lastItem.label}</span>
          {" · "}{lastItem.time}
        </p>
      </div>
    </div>
  )
}

// ── Section export popover ────────────────────────────────────────────

type PlatformId = "ChatGPT" | "Claude" | "Gemini"

interface PlatformMeta {
  id: PlatformId
  lastExport: string
  ext: string
  mime: string
}

const PLATFORM_META: PlatformMeta[] = [
  { id: "ChatGPT",  lastExport: "Last sent 2 days ago",             ext: "md",  mime: "text/markdown" },
  { id: "Claude",   lastExport: "Never exported",                   ext: "xml", mime: "application/xml" },
  { id: "Gemini",   lastExport: "3 new entries since last export",  ext: "md",  mime: "text/markdown" },
]

function SectionExportButton({ sectionName }: { sectionName: string }) {
  const [open, setOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<PlatformId | null>(null)
  const [downloadedId, setDownloadedId] = useState<PlatformId | null>(null)

  const buildContent = (platform: PlatformId) =>
    `[${sectionName} — Sweet Crumb Bakery]\nExported for ${platform}.\n(content here)`

  const handleCopy = (e: React.MouseEvent, p: PlatformMeta) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(buildContent(p.id)).catch(() => {})
    setCopiedId(p.id)
    setTimeout(() => setCopiedId(null), 1600)
  }

  const handleDownload = (e: React.MouseEvent, p: PlatformMeta) => {
    e.stopPropagation()
    const blob = new Blob([buildContent(p.id)], { type: p.mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${sectionName.toLowerCase().replace(/\s+/g, "-")}-${p.id.toLowerCase()}.${p.ext}`
    a.click()
    URL.revokeObjectURL(url)
    setDownloadedId(p.id)
    setTimeout(() => setDownloadedId(null), 1600)
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/40 transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Export ${sectionName}`}
      >
        <Upload className="h-3.5 w-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false) }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-8 z-50 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-black/10"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="px-2 pb-2 pt-1 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
                {"Quick export"}
              </p>

              <div className="space-y-0.5">
                {PLATFORM_META.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl px-2.5 py-2 hover:bg-muted/60 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                <span className="text-[15px] font-medium text-foreground">{p.id}</span>
                <p className="mt-0.5 truncate text-[13px] text-muted-foreground/60 leading-none">
                        {p.lastExport}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 ml-2">
                      <button
                        onClick={(e) => handleCopy(e, p)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-background text-muted-foreground hover:text-foreground"
                        aria-label={`Copy ${sectionName} for ${p.id}`}
                        title="Copy to clipboard"
                      >
                        {copiedId === p.id
                          ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                          : <Clipboard className="h-3.5 w-3.5" />
                        }
                      </button>
                      <button
                        onClick={(e) => handleDownload(e, p)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-background text-muted-foreground hover:text-foreground"
                        aria-label={`Download ${sectionName} for ${p.id} as .${p.ext}`}
                        title={`Download as .${p.ext}`}
                      >
                        {downloadedId === p.id
                          ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                          : <Download className="h-3.5 w-3.5" />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-1.5 border-t border-border pt-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); setOpen(false) }}
                  className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-[13px] text-muted-foreground/60 transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  <span>{"More formats (JSON, PDF, plain text)"}</span>
                  <ChevronRight className="h-3 w-3 shrink-0" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Entry item ────────────────────────────────────────────────────────

function EntryItem({
  entry,
  onDismissStale,
  onDelete,
}: {
  entry: Entry
  onDismissStale: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(entry.content)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const conf = entry.confidence ? CONFIDENCE_META[entry.confidence] : null

  return (
    <div
      className={cn(
        "group/entry relative rounded-2xl border bg-card p-4 transition-colors hover:border-border/80",
        conf ? conf.border : "border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <CaptureIcon method={entry.captureMethod} />

        <div className="min-w-0 flex-1">
          {editing ? (
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => { if (e.key === "Escape") setEditing(false) }}
              rows={3}
              autoFocus
              className="w-full resize-none rounded-xl border border-primary/30 bg-background px-3 py-2 text-[15px] leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          ) : (
            <p className="text-[15px] leading-relaxed text-foreground/85">{value}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2.5">
                <span className="text-[13px] text-muted-foreground/60">{entry.addedAt}</span>
            {entry.isPrivate && (
                <span className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground/50">
                <Lock className="h-3 w-3" />
                {"Private"}
              </span>
            )}
            {conf && (
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground/60">
                <span className={cn("h-2 w-2 rounded-full", conf.dot)} />
                {conf.label}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons — edit + delete */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover/entry:opacity-100">
          <button
            onClick={() => { setEditing(true); setTimeout(() => inputRef.current?.focus(), 50) }}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Edit entry"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete entry"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Delete confirmation strip */}
      <AnimatePresence initial={false}>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                <p className="text-[15px] text-foreground/70">{"Delete this entry? This cannot be undone."}</p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setConfirmDelete(false)}
                    className="rounded-xl border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {"Cancel"}
                  </button>
                  <button
                    onClick={() => { setEditingEntry(null); setConfirmDeleteEntry(null) }}
                    className="rounded-xl px-3 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: "hsl(var(--destructive))" }}
                >
                  {"Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stale nudge */}
      {entry.isStale && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-3">
              <p className="text-[14px] text-amber-700 dark:text-amber-300">
            {"Is "}
            <span className="font-semibold">{entry.staleValue}</span>
            {" still accurate?"}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onDismissStale(entry.id)}
                className="flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-1.5 text-[13px] font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Pencil className="h-3 w-3" />
                {"Update"}
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-1.5 text-[13px] font-medium text-foreground hover:bg-muted transition-colors">
              <Pencil className="h-3 w-3" />
              {"Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Woven insight card ────────────────────────────────────────────────

function WovenInsight({ insight, onDismiss }: { insight: Insight; onDismiss: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group/wi relative flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/[0.03] px-4 py-4"
    >
      <button
        onClick={onDismiss}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/20 opacity-0 transition-all group-hover/wi:opacity-100 hover:bg-muted hover:text-muted-foreground/60"
      >
        <X className="h-3 w-3" />
      </button>
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
        style={{ background: BRAND_GRADIENT }}
      >
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1 pr-5">
              <p className="text-[15px] leading-relaxed text-foreground/80">{insight.text}</p>
              <button className="mt-2 text-[14px] font-semibold text-primary hover:underline">
          {insight.actionLabel}
        </button>
      </div>
    </motion.div>
  )
}

// ── Section capture hints ─────────────────────────────────────────────

interface CaptureOption {
  method: CaptureMethod
  hint: string
}

const DEFAULT_HINTS: Record<CaptureMethod, string> = {
  photo: "Upload an image",
  voice: "Describe it out loud",
  file:  "Upload a document",
  text:  "Type it manually",
}

const SECTION_HINTS: Record<string, Partial<Record<CaptureMethod, string>>> = {
  suppliers: {
    photo: "Upload an invoice or business card",
    voice: "Tell me about a new supplier",
    file:  "Upload a supplier list or contract",
    text:  "Type supplier details",
  },
  recipes: {
    photo: "Upload a recipe photo",
    voice: "Dictate your recipe",
    file:  "Upload a recipe document",
    text:  "Type your recipe",
  },
  equipment: {
    photo: "Upload a photo of your equipment",
    voice: "Describe your equipment",
    file:  "Upload equipment specs",
    text:  "Type equipment details",
  },
  staff: {
    photo: "Upload a photo or ID",
    voice: "Tell me about a team member",
    file:  "Upload a staff roster",
    text:  "Type staff details",
  },
  hours: {
    photo: "Upload a sign or schedule photo",
    voice: "Tell me your hours",
    file:  "Upload a schedule document",
    text:  "Type your hours",
  },
}

function getSectionHints(sectionId: string): CaptureOption[] {
  const overrides = SECTION_HINTS[sectionId] ?? {}
  return (["photo", "voice", "file", "text"] as CaptureMethod[]).map((method) => ({
    method,
    hint: overrides[method] ?? DEFAULT_HINTS[method],
  }))
}

// ── Section capture selector ──────────────────────��───────────────────

function SectionCaptureSelector({
  sectionId,
  sectionName,
  vaultId,
  onClose,
  onStartChat,
}: {
  sectionId: string
  sectionName: string
  vaultId?: string
  onClose: () => void
  onStartChat?: (initialMessage?: string, targetVaultId?: string) => void
}) {
  const hints = getSectionHints(sectionId)
  const placeholderHint = hints.find(h => h.method === "text")?.hint

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
    >
      <div className="mb-2 flex items-center justify-end">
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/30 transition-colors hover:bg-muted hover:text-muted-foreground/60"
          aria-label="Close"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      <CaptureInput
        animate={false}
        vaultLabel={sectionName}
        placeholder={placeholderHint}
        onSubmit={(text) => {
          onClose()
          onStartChat?.(text, vaultId)
        }}
      />
    </motion.div>
  )
}

// ── New section input ─────────────────────────────────────────────────

function NewSectionInput({ onAdd }: { onAdd: (name: string) => void }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOpen = () => {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) { setOpen(false); setValue(""); return }
    onAdd(trimmed)
    setValue("")
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit()
    if (e.key === "Escape") { setOpen(false); setValue("") }
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={handleOpen}
            className="group flex w-full items-center gap-4 rounded-2xl border border-dashed border-border bg-card/40 p-5 text-left transition-all hover:border-muted-foreground/30 hover:bg-card"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-muted/60 transition-colors group-hover:border-muted-foreground/30">
              <Plus className="h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/70" />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-muted-foreground/60 group-hover:text-foreground transition-colors">
                {"New section"}
              </p>
              <p className="mt-0.5 text-[13px] text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors">
                {"Create a custom section for this vault"}
              </p>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="rounded-2xl border border-dashed border-primary/40 bg-card p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Plus className="h-4 w-4 text-primary" />
                </span>
                <p className="text-base font-semibold text-foreground">{"New section"}</p>
              </div>
              <button
                onClick={() => { setOpen(false); setValue("") }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground/30 transition-colors hover:bg-muted hover:text-muted-foreground/60"
                aria-label="Cancel"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's this section about?"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => { setOpen(false); setValue("") }}
                className="rounded-xl px-4 py-2 text-[14px] text-muted-foreground/60 transition-colors hover:bg-muted"
              >
                {"Cancel"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!value.trim()}
                className={cn(
                  "rounded-xl px-4 py-2 text-[14px] font-medium text-white transition-all",
                  value.trim() ? "opacity-100 cursor-pointer" : "opacity-30 cursor-not-allowed"
                )}
                style={{ background: BRAND_GRADIENT }}
              >
                {"Create section"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Section block ────────────────────────────────────────────────────

function SectionBlock({ section, onDelete, vaultId, onStartChat }: { section: Section; onDelete?: () => void; vaultId?: string; onStartChat?: (initialMessage?: string, targetVaultId?: string) => void }) {
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deletedEntryIds, setDeletedEntryIds] = useState<string[]>([])
  const [staleDismissed, setStaleDismissed] = useState<string[]>([])
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([])

  const visuals = SECTION_VISUALS[section.id]
  const SectionIcon = visuals?.icon ?? Settings
  const sectionColor = visuals?.color ?? "#6B7280"
  const sectionPreview = visuals?.preview ?? ""

  if (dismissed) return null

  // Suggested / empty section
  if (section.suggested) {
    return (
      <div className="relative rounded-3xl p-[1.5px] transition-all duration-300" style={{ background: "hsl(var(--border))" }}>
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-40"
          style={{ background: BRAND_GRADIENT }}
        />
        <div className="relative rounded-[22px] bg-card p-5 md:p-6">

          {/* Delete confirmation overlay */}
          <AnimatePresence initial={false}>
            {confirmDelete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-[22px] bg-card px-8 text-center"
              >
                <p className="text-base font-semibold text-foreground">{"Remove this suggestion?"}</p>
                <p className="text-sm text-muted-foreground/70 leading-relaxed">
                  {"Roget suggested "}<span className="font-medium text-foreground">{section.name}</span>{" based on your vault. You can always add it later."}
                </p>
                <div className="flex items-center gap-2.5 mt-1">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-xl border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {"Keep it"}
                  </button>
                  <button
                    onClick={() => setDismissed(true)}
                    className="rounded-xl px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: "hsl(var(--destructive))" }}
                  >
                    {"Remove"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {/* Section icon */}
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${sectionColor}15` }}
              >
                <SectionIcon className="h-5 w-5" style={{ color: sectionColor }} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 mb-1">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    <Lightbulb className="h-2.5 w-2.5" />
                    {"Suggested"}
                  </span>
                  <h3 className="text-base font-semibold text-card-foreground">{section.name}</h3>
                </div>
                <p className="text-[14px] text-muted-foreground/70 leading-relaxed">{section.suggestedReason}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {addOpen && (
                <button
                  onClick={() => setAddOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Collapse"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              )}
              {!addOpen && (
                <Button
                  size="sm"
                  className="h-9 rounded-xl px-4 text-sm font-medium text-white"
                  style={{ background: BRAND_GRADIENT }}
                  onClick={() => setAddOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  {"Add"}
                </Button>
              )}
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground/30 hover:bg-muted hover:text-muted-foreground/60 transition-colors"
                aria-label="Remove suggestion"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Inline capture input */}
          <AnimatePresence initial={false}>
            {addOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="mt-4"
              >
                <SectionCaptureSelector
                  sectionId={section.id}
                  sectionName={section.name}
                  vaultId={vaultId}
                  onClose={() => setAddOpen(false)}
                  onStartChat={onStartChat}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  const visibleEntries = section.entries.filter(
    (e) => !staleDismissed.includes(e.id) && !deletedEntryIds.includes(e.id)
  )
  const visibleInsights = (section.insights ?? []).filter(i => !dismissedInsights.includes(i.id))
  const hasStale = visibleEntries.some(e => e.isStale)
  const hasInsight = visibleInsights.length > 0

  return (
    <div className="relative rounded-2xl border border-border bg-card/50 overflow-hidden">
      {/* Delete confirmation — replaces entire card content */}
      <AnimatePresence initial={false}>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col items-center justify-center gap-4 px-8 py-10 text-center"
          >
            <p className="text-base font-semibold text-foreground">{"Delete this section?"}</p>
            <p className="text-sm text-muted-foreground/70 leading-relaxed">
              {"All entries in "}<span className="font-medium text-foreground">{section.name}</span>{" will be permanently removed. This cannot be undone."}
            </p>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-xl border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {"Cancel"}
              </button>
              <button
                onClick={() => { setConfirmDelete(false); onDelete?.() }}
                className="rounded-xl px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "hsl(var(--destructive))" }}
              >
                {"Delete"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal card content — hidden while confirm is showing */}
      {!confirmDelete && (<>

      {/* Header */}
      <div className="group/header flex w-full items-center gap-3 px-5 py-4">
        {/* Section icon */}
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${sectionColor}15` }}
        >
          <SectionIcon className="h-5 w-5" style={{ color: sectionColor }} />
        </span>

        {/* Clickable title area */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-1 flex-col text-left min-w-0"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base font-semibold text-card-foreground truncate">{section.name}</span>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[13px] font-medium text-muted-foreground">
              {visibleEntries.length}
            </span>
            {/* Attention dots */}
            {!open && (
              <span className="flex shrink-0 items-center gap-1.5" aria-label="Needs attention">
                {hasStale && (
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" title="Stale entry needs confirmation" />
                )}
                {hasInsight && (
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#7C3AED" }} title="Roget has a suggestion" />
                )}
              </span>
            )}
          </div>
          {/* Preview text when collapsed */}
          {!open && sectionPreview && (
                <p className="mt-1 text-[14px] text-muted-foreground/60 truncate">{sectionPreview}</p>
          )}
        </button>

        {/* Action buttons — appear on row hover */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover/header:opacity-100">
          <SectionExportButton sectionName={section.name} />
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/40 transition-colors hover:bg-muted hover:text-destructive"
            aria-label="Delete section"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Chevron */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-8 w-8 shrink-0 items-center justify-center"
          aria-label={open ? "Collapse section" : "Expand section"}
        >
          <ChevronDown
            className={cn("h-5 w-5 text-muted-foreground/50 transition-transform duration-200", open && "rotate-180")}
          />
        </button>
      </div>

      {/* Entries */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-5 pb-5">
              {/* Woven insights */}
              <AnimatePresence mode="popLayout">
                {visibleInsights.map((insight) => (
                  <WovenInsight
                    key={insight.id}
                    insight={insight}
                    onDismiss={() => setDismissedInsights(prev => [...prev, insight.id])}
                  />
                ))}
              </AnimatePresence>

              {visibleEntries.map((entry) => (
                <EntryItem
                  key={entry.id}
                  entry={entry}
                  onDismissStale={(id) => setStaleDismissed(prev => [...prev, id])}
                  onDelete={(id) => setDeletedEntryIds(prev => [...prev, id])}
                />
              ))}

              {/* Add button + inline capture selector */}
              <div className="mt-2 space-y-3">
                <button
                  onClick={() => setAddOpen(v => !v)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl border border-dashed px-4 py-3 text-sm transition-colors",
                    addOpen
                      ? "border-primary/40 bg-primary/[0.03] text-primary/80"
                      : "border-border text-muted-foreground/60 hover:border-primary/30 hover:text-primary/70"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  {"Add to "}{section.name}
                </button>

                <AnimatePresence initial={false}>
                  {addOpen && (
                    <SectionCaptureSelector
                      sectionId={section.id}
                      sectionName={section.name}
                      vaultId={vaultId}
                      onClose={() => setAddOpen(false)}
                      onStartChat={onStartChat}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </>)}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────

function EmptyVaultState({ onStartDiscovery }: { onStartDiscovery: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-3xl"
        style={{ background: BRAND_GRADIENT }}
      >
        <Sparkles className="h-8 w-8 text-white" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-foreground text-balance">
        {"Tell me about your bakery."}
      </h3>
      <p className="mt-3 max-w-sm text-base text-muted-foreground leading-relaxed">
        {"What makes it special? Start capturing and Roget will build AI responses that actually know your business."}
      </p>
      <div className="mt-8 flex gap-3">
        <Button
          className="h-11 rounded-xl px-6 text-sm font-medium text-white"
          style={{ background: BRAND_GRADIENT }}
          onClick={onStartDiscovery}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {"Start capturing"}
        </Button>
        <Button
          variant="outline"
          className="h-11 rounded-xl px-6 text-sm font-medium"
          onClick={() => {}}
        >
          <Plus className="h-4 w-4 mr-2" />
          {"Add a section"}
        </Button>
      </div>
    </motion.div>
  )
}

// ── Add knowledge FAB ─────────────────────────────────────────────────

function AddKnowledgeFAB({
  vaultName,
  vaultId,
  onStartChat,
}: {
  vaultName: string
  vaultId?: string
  onStartChat?: (initialMessage?: string, targetVaultId?: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[520px]"
          >
            <CaptureInput
              animate={false}
              vaultLabel={vaultName}
              placeholder="What do you want to capture?"
              onSubmit={(text) => {
                setOpen(false)
                onStartChat?.(text, vaultId)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => setOpen(!open)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shadow-primary/25"
          style={{ background: BRAND_GRADIENT }}
          aria-label="Add knowledge"
        >
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.15 }}>
            <Plus className="h-6 w-6 text-white" />
          </motion.span>
        </motion.button>
      </div>
    </>
  )
}

// ── Sections list ─────────────────────────────────────────────────────

function SectionsList({ vaultId, onStartChat, sections: externalSections }: { vaultId?: string; onStartChat?: (initialMessage?: string, targetVaultId?: string) => void; sections?: Section[] }) {
  const [customSections, setCustomSections] = useState<Section[]>([])
  const [deletedIds, setDeletedIds] = useState<string[]>([])

  const handleAddSection = (name: string) => {
    const newSection: Section = {
      id: `custom-${Date.now()}`,
      name,
      entries: [],
      insights: [],
    }
    setCustomSections((prev) => [...prev, newSection])
  }

  const handleDelete = (id: string) => {
    setDeletedIds((prev) => [...prev, id])
    setCustomSections((prev) => prev.filter((s) => s.id !== id))
  }

  const srcSections = externalSections ?? VAULT_SECTIONS
  const regularSections = srcSections.filter(
    (s) => !s.suggested && !deletedIds.includes(s.id)
  )
  const suggestedSections = srcSections.filter(
    (s) => s.suggested && !deletedIds.includes(s.id)
  )
  const orderedSections = [...regularSections, ...customSections, ...suggestedSections]

  return (
    <div className="space-y-3">
      {orderedSections.map((section) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          layout
        >
          <SectionBlock
            section={section}
            onDelete={() => handleDelete(section.id)}
            vaultId={vaultId}
            onStartChat={onStartChat}
          />
        </motion.div>
      ))}

      <NewSectionInput onAdd={handleAddSection} />
    </div>
  )
}

// ── Vault name dropdown ───────────────────────────────────────────────

export interface VaultOption {
  id: string
  name: string
  icon: LucideIcon
  color: string
  itemCount?: number
}

function VaultNameDropdown({
  activeVaultId,
  vaults,
  onSelect,
  nameClassName,
}: {
  activeVaultId: string
  vaults: VaultOption[]
  onSelect: (id: string) => void
  nameClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const activeVault = vaults.find((v) => v.id === activeVaultId) ?? vaults[0]
  const VaultIcon = activeVault?.icon

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  if (!activeVault) return null

  const words = activeVault.name.split(" ")
  const first = words.slice(0, -1).join(" ")
  const last = words.slice(-1)[0]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group flex items-center gap-2 rounded-xl transition-colors hover:bg-muted/40 -mx-2 px-2 py-1",
          nameClassName
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn("font-bold tracking-tight text-balance leading-tight")}>
          <span className="text-foreground">{first} </span>
          <span className="text-muted-foreground/40">{last}{"."}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-foreground/60 transition-transform duration-200 group-hover:text-foreground/90",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10"
            role="listbox"
          >
            <div className="px-2 py-2">
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                {"Your vaults"}
              </p>
              {vaults.map((vault) => {
                const Icon = vault.icon
                const isActive = vault.id === activeVaultId
                return (
                  <button
                    key={vault.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => { onSelect(vault.id); setOpen(false) }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors",
                      isActive
                        ? "bg-primary/8 text-foreground"
                        : "text-foreground hover:bg-muted/60"
                    )}
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${vault.color}18` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: vault.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium">{vault.name}</p>
                      {vault.itemCount !== undefined && (
                        <p className="text-[13px] text-muted-foreground/60">
                          {vault.itemCount} {"items"}
                        </p>
                      )}
                    </div>
                    {isActive && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="border-t border-border px-2 py-2">
              <button className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[15px] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-dashed border-border">
                  <Plus className="h-4 w-4" />
                </div>
                {"New vault"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Vault detail page ─────────────────────────────────────────────────

export function VaultDetail({
  vaultId,
  onBack,
  onStartChat,
}: {
  vaultId: string
  onBack: () => void
  onStartChat?: (initialMessage?: string, targetVaultId?: string) => void
}) {
  const [activeTab, setActiveTab] = useState("overview")
  const [confirmDeleteVault, setConfirmDeleteVault] = useState(false)
  const [activeVaultId, setActiveVaultId] = useState(vaultId)
  const isEmpty = false
  const vault = SIDEBAR_VAULTS.find((v) => v.id === activeVaultId) ?? SIDEBAR_VAULTS[0]

  return (
    <AppShell
      vaults={SIDEBAR_VAULTS}
      vaultNav={VAULT_NAV}
      activeVaultId="1"
      activeVaultNav={activeTab}
      onVaultNavChange={setActiveTab}
      onBackToDashboard={onBack}
      onStartChat={onStartChat}
    >
      {/* Atmosphere gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] overflow-hidden">
        <div
          className="h-full w-full opacity-[0.12]"
          style={{
            background: "linear-gradient(180deg, #7C3AED 0%, #EC4899 35%, #F97316 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-[1] mx-auto max-w-3xl px-5 py-8 pb-28 md:px-8 md:py-12">

        {/* ── Page header ────────────────────────────────��─────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-10"
        >
          <button
            onClick={onBack}
            className="mb-5 flex items-center gap-1.5 text-[14px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            {"All vaults"}
          </button>

          <div className="flex items-center gap-5">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${vault.color}15` }}
            >
              <vault.icon className="h-8 w-8" style={{ color: vault.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <VaultNameDropdown
                activeVaultId={activeVaultId}
                vaults={SIDEBAR_VAULTS}
                onSelect={(id) => setActiveVaultId(id)}
                nameClassName="text-3xl"
              />
              <p className="mt-1 text-[15px] text-muted-foreground">{"82 items · Last updated 1 day ago"}</p>
            </div>
            {/* Delete vault button */}
            <button
              onClick={() => setConfirmDeleteVault(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground/40 transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
              aria-label="Delete vault"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Delete vault confirmation dialog */}
          <AnimatePresence initial={false}>
            {confirmDeleteVault && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-5 text-center"
              >
              <p className="text-base font-semibold text-foreground">{"Delete Sweet Crumb Bakery?"}</p>
              <p className="text-[14px] text-muted-foreground/70 leading-relaxed max-w-sm">
                  {"All sections, entries, and AI context for this vault will be permanently removed. This cannot be undone."}
                </p>
                <div className="flex items-center gap-2.5 mt-1">
                  <button
                    onClick={() => setConfirmDeleteVault(false)}
                    className="rounded-xl border border-border bg-card px-5 py-2 text-[14px] font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {"Cancel"}
                  </button>
                  <button
                    onClick={() => { setConfirmDeleteVault(false); onBack() }}
                    className="rounded-xl px-5 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: "hsl(var(--destructive))" }}
                  >
                    {"Delete vault"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vault nav tabs */}
          <div className="mt-7 flex gap-1 rounded-2xl bg-muted/60 p-1.5">
            {VAULT_NAV.map((item) => {
              const Icon = item.icon
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[15px] font-medium transition-all duration-150",
                    active
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground/60")} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ── Overview tab ───────────────────────────────────────── */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* AI Hero Summary */}
            {!isEmpty && <VaultHeroSummary />}

            {/* Sections */}
            {isEmpty ? (
              <EmptyVaultState onStartDiscovery={() => setActiveTab("overview")} />
            ) : (
              <SectionsList vaultId={vaultId} onStartChat={onStartChat} />
            )}
          </motion.div>
        )}

        {/* ── Prompts tab ───────���─────────────────────────────── */}
        {activeTab === "prompts" && <PromptsTab />}

        {/* ── Export tab ────────────────────────────────────────── */}
        {activeTab === "export" && <ExportTab />}

      </div>

      {/* Fixed floating add button */}
      <AddKnowledgeFAB vaultName={vault.name} vaultId={vaultId} onStartChat={onStartChat} />
    </AppShell>
  )
}

// ── Embedded vault detail (for split-view onboarding) ────────────────

export interface EmbeddedVaultData {
  vaultName: string
  vaultIcon: LucideIcon
  vaultColor: string
  sections: Section[]
  summary?: string
  itemCount: number
  depthPercent: number
  unlockedCapabilities: string[]
  lockedCapabilities: { label: string; requires: string }[]
  lastAdded?: { label: string; time: string }
}

export function EmbeddedVaultDetail({
  data,
  className,
  onExpandChat,
  chatCollapsed,
  vaults,
  onVaultChange,
}: {
  data: EmbeddedVaultData
  className?: string
  onExpandChat?: () => void
  chatCollapsed?: boolean
  vaults?: VaultOption[]
  onVaultChange?: (id: string) => void
}) {
  const [activeTab, setActiveTab] = useState("overview")
  const { isGuest } = useAuth()
  const VaultIcon = data.vaultIcon
  const isEmpty = data.sections.filter(s => !s.suggested).every(s => s.entries.length === 0)
  const hasAnySections = data.sections.length > 0

  return (
    <div className={cn("relative flex flex-col overflow-hidden", className)}>
      {/* Atmosphere gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] overflow-hidden">
        <div
          className="h-full w-full opacity-[0.12]"
          style={{
            background: "linear-gradient(180deg, #7C3AED 0%, #EC4899 35%, #F97316 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Scrollable content */}
      <div className="relative z-[1] flex-1 overflow-y-auto scrollbar-none">
        <div className="mx-auto max-w-3xl px-5 py-8 pb-28 md:px-8 md:py-10">

          {/* ── Page header ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${data.vaultColor}15` }}
              >
                <VaultIcon className="h-7 w-7" style={{ color: data.vaultColor }} />
              </div>
              <div className="flex-1 min-w-0">
                {vaults && vaults.length > 1 && onVaultChange ? (
                  <VaultNameDropdown
                    activeVaultId={vaults.find(v => v.name === data.vaultName)?.id ?? vaults[0].id}
                    vaults={vaults}
                    onSelect={onVaultChange}
                    nameClassName="text-2xl"
                  />
                ) : (
                  <h1 className="text-2xl font-bold tracking-tight text-balance">
                    <span className="text-foreground">{data.vaultName.split(" ").slice(0, -1).join(" ")} </span>
                    <span className="text-muted-foreground/40">{data.vaultName.split(" ").slice(-1)[0]}{"."}</span>
                  </h1>
                )}
                <p className="mt-0.5 text-[15px] text-muted-foreground">
                  {data.itemCount}{" items · Building now"}
                </p>
              </div>
            </div>

            {/* Vault nav tabs */}
            <div className="mt-6 flex gap-1 rounded-2xl bg-muted/60 p-1.5">
              {VAULT_NAV.map((item) => {
                const Icon = item.icon
                const active = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[15px] font-medium transition-all duration-150",
                      active
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground/60")} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* ── Overview tab ── */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* AI Hero Summary — show once we have some content */}
              {!isEmpty && data.summary && (
                <VaultHeroSummary
                  sections={data.sections}
                  summaryText={data.summary}
                  vaultName={data.vaultName}
                  depthPercent={data.depthPercent}
                  unlockedCapabilities={data.unlockedCapabilities}
                  lockedCapabilities={data.lockedCapabilities}
                  lastAdded={data.lastAdded}
                />
              )}

              {/* Sections */}
              {hasAnySections ? (
                <SectionsList sections={data.sections} />
              ) : (
                <EmptyVaultState onStartDiscovery={onExpandChat ?? (() => {})} />
              )}
            </motion.div>
          )}

          {/* ── Prompts tab ── */}
          {activeTab === "prompts" && (
            <div className="relative">
              <PromptsTab />
              {isGuest && <NudgeTabOverlay tab="prompts" />}
            </div>
          )}

          {/* ── Export tab ── */}
          {activeTab === "export" && (
            <div className="relative">
              <ExportTab />
              {isGuest && <NudgeTabOverlay tab="export" />}
            </div>
          )}
        </div>
      </div>

      {/* Expand chat FAB — shown when chat is collapsed */}
      {onExpandChat && (
        <div className="absolute bottom-6 right-6 z-30">
          <AnimatePresence>
            {chatCollapsed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onExpandChat}
                className="flex items-center gap-2.5 rounded-2xl px-5 py-3 shadow-lg shadow-primary/20 text-white text-[15px] font-medium"
                style={{ background: BRAND_GRADIENT }}
              >
                <MessageSquarePlus className="h-4 w-4" />
                {"Continue with Roget"}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
