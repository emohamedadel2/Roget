"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  ChevronDown,
  ClipboardCopy,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  Lock,
  MessageSquare,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ── Design constants ──────────────────────────────────────────────────

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)"

// ── Types ─────────────────────────────────────────────────────────────

interface ExportEntry {
  id: string
  content: string
  isPrivate?: boolean
}

interface ExportSection {
  id: string
  name: string
  entries: ExportEntry[]
}

type FormatId = "chatgpt" | "claude" | "gemini" | "system" | "markdown"

interface FormatMeta {
  id: FormatId
  name: string
  subtitle: string
  lastExport: string
  ext: string
  mime: string
  icon: React.ComponentType<{ className?: string }>
  howToUse: string
}

// ── Mock vault sections for export ────────────────────────────────────

const EXPORT_SECTIONS: ExportSection[] = [
  {
    id: "equipment",
    name: "Equipment",
    entries: [
      { id: "e1", content: "Bongard deck oven — 2-deck, electric, purchased 2021" },
      { id: "e2", content: "Blast chiller — Irinox HBF, capacity 10kg" },
      { id: "e3", content: "Hobart spiral mixer — 20qt, used for all bread doughs" },
      { id: "e4", content: "Tempering machine — ChocoVision Revolation Delta" },
    ],
  },
  {
    id: "recipes",
    name: "Recipes",
    entries: [
      { id: "r1", content: "Sourdough loaf — 78% hydration, 18-hour cold ferment, 250g starter" },
      { id: "r2", content: "Croissants — 27 layers, 72-hour butter block, 3 turns" },
      { id: "r3", content: "Lavender scones — oat flour base, dried lavender, lemon glaze" },
      { id: "r4", content: "Chocolate ganache — 60% Valrhona, 1:1.2 ratio, infused with sea salt", isPrivate: true },
    ],
  },
  {
    id: "suppliers",
    name: "Suppliers",
    entries: [
      { id: "s1", content: "Mill Creek Flour — $45/50lb bag, all-purpose unbleached. Lead time: 3 days." },
      { id: "s2", content: "Dairy Fresh — whole milk $3.20/gal, butter $4.50/lb. Weekly delivery Mon." },
    ],
  },
  {
    id: "staff",
    name: "Staff",
    entries: [
      { id: "st1", content: "3 full-time staff. 2 part-time weekends only." },
      { id: "st2", content: "Maria — morning shift manager, opens at 5:30am, handles all prep", isPrivate: true },
    ],
  },
  {
    id: "hours",
    name: "Hours",
    entries: [
      { id: "h1", content: "Open Tuesday–Saturday, 6am–3pm. Closed Sunday & Monday." },
    ],
  },
]

// ── Icons (simple SVG wrappers for platform logos) ────────────────────

function ChatGPTIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  )
}

function ClaudeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )
}

function GeminiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
    </svg>
  )
}

// ── Format definitions ────────────────────────────────────────────────

const FORMATS: FormatMeta[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    subtitle: "Custom Instructions format",
    lastExport: "Last exported 2 days ago",
    ext: "md",
    mime: "text/markdown",
    icon: ChatGPTIcon,
    howToUse: "Copy and paste into Custom Instructions, or attach the .md file in a chat.",
  },
  {
    id: "claude",
    name: "Claude",
    subtitle: "Projects format",
    lastExport: "Never exported",
    ext: "xml",
    mime: "application/xml",
    icon: ClaudeIcon,
    howToUse: "Create a Project, upload the .xml file as project knowledge.",
  },
  {
    id: "gemini",
    name: "Gemini",
    subtitle: "Context format",
    lastExport: "Last exported 1 week ago",
    ext: "md",
    mime: "text/markdown",
    icon: GeminiIcon,
    howToUse: "Paste into the chat as context before your first message.",
  },
  {
    id: "system",
    name: "System Prompt",
    subtitle: "Universal — any AI tool",
    lastExport: "Last exported 3 days ago",
    ext: "txt",
    mime: "text/plain",
    icon: MessageSquare,
    howToUse: "Paste into any AI tool's system prompt or custom instructions field.",
  },
  {
    id: "markdown",
    name: "Markdown",
    subtitle: "Universal format",
    lastExport: "Never exported",
    ext: "md",
    mime: "text/markdown",
    icon: FileText,
    howToUse: "Universal format — works anywhere. Upload, paste, or share.",
  },
]

// ── Helper: estimate token count (~4 chars per token) ─────────────────

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

function tokenBadge(count: number) {
  if (count < 30_000) return { color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20", label: "Works great with all AI tools" }
  if (count < 50_000) return { color: "text-amber-600 bg-amber-500/10 border-amber-500/20", label: "Works well with GPT-4 and Claude" }
  return { color: "text-red-600 bg-red-500/10 border-red-500/20", label: "Large — consider selecting fewer sections" }
}

// ── Helper: build export content ──────────────────────────────────────

function buildExportContent(
  format: FormatMeta,
  sections: ExportSection[],
  enabledSections: Record<string, boolean>,
  enabledEntries: Record<string, boolean>
): string {
  const activeSections = sections.filter(s => enabledSections[s.id])
  const lines: string[] = []

  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  if (format.id === "claude") {
    // XML with <user_knowledge> tags
    lines.push(`<?xml version="1.0" encoding="UTF-8"?>`)
    lines.push(`<user_knowledge source="Roget" exported="${dateStr}">`)
    lines.push(`  <business name="Sweet Crumb Bakery">`)
    for (const s of activeSections) {
      const activeEntries = s.entries.filter(e => !e.isPrivate && enabledEntries[e.id])
      if (activeEntries.length === 0) continue
      lines.push(`    <section name="${s.name}">`)
      for (const e of activeEntries) {
        lines.push(`      <entry>${e.content}</entry>`)
      }
      lines.push(`    </section>`)
    }
    lines.push(`  </business>`)
    lines.push(`</user_knowledge>`)
  } else if (format.id === "system") {
    // Plain text system prompt
    lines.push(`You are an AI assistant helping with Sweet Crumb Bakery.`)
    lines.push(`Here is the relevant context about this business:`)
    lines.push(``)
    for (const s of activeSections) {
      const activeEntries = s.entries.filter(e => !e.isPrivate && enabledEntries[e.id])
      if (activeEntries.length === 0) continue
      lines.push(`${s.name}:`)
      for (const e of activeEntries) {
        lines.push(`- ${e.content}`)
      }
      lines.push(``)
    }
    lines.push(`Use this information to provide accurate, specific advice.`)
  } else if (format.id === "gemini") {
    // Markdown with explicit context framing for Gemini
    lines.push(`# Context: Sweet Crumb Bakery`)
    lines.push(``)
    lines.push(`The following is detailed knowledge about a small bakery business. Use this as context for all responses in this conversation.`)
    lines.push(``)
    lines.push(`---`)
    lines.push(``)
    for (const s of activeSections) {
      const activeEntries = s.entries.filter(e => !e.isPrivate && enabledEntries[e.id])
      if (activeEntries.length === 0) continue
      lines.push(`## ${s.name}`)
      lines.push(``)
      for (const e of activeEntries) {
        lines.push(`- ${e.content}`)
      }
      lines.push(``)
    }
    lines.push(`---`)
    lines.push(`*Exported from Roget on ${dateStr}*`)
  } else if (format.id === "chatgpt") {
    // Markdown with ## headings and bullet points for Custom Instructions
    lines.push(`# Sweet Crumb Bakery`)
    lines.push(``)
    lines.push(`> Knowledge base exported from Roget — ${dateStr}`)
    lines.push(``)
    for (const s of activeSections) {
      const activeEntries = s.entries.filter(e => !e.isPrivate && enabledEntries[e.id])
      if (activeEntries.length === 0) continue
      lines.push(`## ${s.name}`)
      lines.push(``)
      for (const e of activeEntries) {
        lines.push(`- ${e.content}`)
      }
      lines.push(``)
    }
  } else {
    // Markdown — clean universal format
    lines.push(`# Sweet Crumb Bakery`)
    lines.push(``)
    for (const s of activeSections) {
      const activeEntries = s.entries.filter(e => !e.isPrivate && enabledEntries[e.id])
      if (activeEntries.length === 0) continue
      lines.push(`## ${s.name}`)
      lines.push(``)
      for (const e of activeEntries) {
        lines.push(`- ${e.content}`)
      }
      lines.push(``)
    }
    lines.push(`---`)
    lines.push(`*Exported from Roget on ${dateStr}*`)
  }

  return lines.join("\n")
}

// ── Format card ───────────────────────────────────────────────────────

function FormatCard({
  format,
  selected,
  onSelect,
}: {
  format: FormatMeta
  selected: boolean
  onSelect: () => void
}) {
  const Icon = format.icon
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all duration-150",
        selected
          ? "border-primary/40 bg-primary/[0.04] ring-1 ring-primary/20"
          : "border-border bg-card hover:border-primary/20 hover:bg-primary/[0.02]"
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
            selected ? "bg-primary/15" : "bg-muted"
          )}
        >
          <Icon className={cn("h-4.5 w-4.5", selected ? "text-primary" : "text-muted-foreground/60")} />
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-primary"
          >
            <Check className="h-3 w-3 text-primary-foreground" />
          </motion.div>
        )}
      </div>
      <div>
        <p className={cn("text-sm font-semibold", selected ? "text-foreground" : "text-foreground/80")}>{format.name}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground/60">{format.subtitle}</p>
      </div>
      <p className="text-[10px] text-muted-foreground/50">{format.lastExport}</p>
    </button>
  )
}

// ── Section toggle ────────────────────────────────────────────────────

function SectionToggle({
  section,
  enabled,
  onToggle,
  enabledEntries,
  onToggleEntry,
}: {
  section: ExportSection
  enabled: boolean
  onToggle: () => void
  enabledEntries: Record<string, boolean>
  onToggleEntry: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const publicEntries = section.entries.filter(e => !e.isPrivate)
  const privateEntries = section.entries.filter(e => e.isPrivate)
  const enabledCount = section.entries.filter(e => !e.isPrivate && enabledEntries[e.id]).length

  return (
    <div
      className={cn(
        "rounded-xl border transition-colors",
        enabled ? "border-border bg-card" : "border-border/60 bg-muted/30"
      )}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-3.5 py-3">
        <button
          onClick={onToggle}
          className="shrink-0"
          aria-label={`Toggle ${section.name}`}
        >
          {enabled ? (
            <ToggleRight className="h-5 w-5 text-primary" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-muted-foreground/40" />
          )}
        </button>

        <button
          onClick={() => setExpanded(v => !v)}
          className="flex flex-1 items-center gap-2 min-w-0"
        >
          <span className={cn("text-sm font-medium truncate", enabled ? "text-foreground" : "text-muted-foreground/50")}>{section.name}</span>
          <span className={cn(
            "shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium",
            enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/40"
          )}>
            {enabledCount}{" / "}{publicEntries.length}
          </span>
        </button>

        <button
          onClick={() => setExpanded(v => !v)}
          className="flex h-6 w-6 shrink-0 items-center justify-center"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground/50 transition-transform", expanded && "rotate-180")} />
        </button>
      </div>

      {/* Expanded entries */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 px-3.5 pb-3">
              {publicEntries.map(entry => {
                const entryEnabled = enabled && enabledEntries[entry.id]
                return (
                  <button
                    key={entry.id}
                    onClick={() => enabled && onToggleEntry(entry.id)}
                    disabled={!enabled}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                      entryEnabled ? "hover:bg-muted/50" : "opacity-40"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                      entryEnabled ? "border-primary bg-primary" : "border-muted-foreground/30 bg-transparent"
                    )}>
                      {entryEnabled && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                    </div>
                    <span className={cn("text-xs leading-relaxed", entryEnabled ? "text-foreground/80" : "text-muted-foreground/40")}>{entry.content}</span>
                  </button>
                )
              })}

              {/* Private entries — always off */}
              {privateEntries.map(entry => (
                <div
                  key={entry.id}
                  className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 opacity-40"
                >
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-muted-foreground/20">
                    <Lock className="h-2.5 w-2.5 text-muted-foreground/40" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs leading-relaxed text-muted-foreground/40 line-through">{entry.content}</span>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground/40">
                      <Lock className="h-2 w-2" />
                      {"Private — never exported"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main ExportTab ────────────────────────────────────────────────────

export function ExportTab() {
  // Step 1: Format selection
  const [selectedFormat, setSelectedFormat] = useState<FormatId>("chatgpt")
  const [showHowTo, setShowHowTo] = useState(true)

  // Step 2: Section toggles
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    for (const s of EXPORT_SECTIONS) init[s.id] = true
    return init
  })
  const [enabledEntries, setEnabledEntries] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    for (const s of EXPORT_SECTIONS) {
      for (const e of s.entries) {
        init[e.id] = !e.isPrivate
      }
    }
    return init
  })

  // Step 3: Actions
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [showTokenHelp, setShowTokenHelp] = useState(false)
  const previewRef = useRef<HTMLPreElement>(null)

  const format = FORMATS.find(f => f.id === selectedFormat)!

  // Build export content
  const exportContent = useMemo(
    () => buildExportContent(format, EXPORT_SECTIONS, enabledSections, enabledEntries),
    [format, enabledSections, enabledEntries]
  )

  const tokenCount = useMemo(() => estimateTokens(exportContent), [exportContent])
  const badge = tokenBadge(tokenCount)

  // Toggle section (also toggle all entries inside)
  const toggleSection = (sectionId: string) => {
    setEnabledSections(prev => {
      const next = { ...prev, [sectionId]: !prev[sectionId] }
      // When turning off, disable all entries; when turning on, enable public entries
      const section = EXPORT_SECTIONS.find(s => s.id === sectionId)
      if (section) {
        setEnabledEntries(prevE => {
          const nextE = { ...prevE }
          for (const e of section.entries) {
            nextE[e.id] = !e.isPrivate && next[sectionId]
          }
          return nextE
        })
      }
      return next
    })
  }

  const toggleEntry = (entryId: string) => {
    setEnabledEntries(prev => ({ ...prev, [entryId]: !prev[entryId] }))
  }

  const selectAll = () => {
    const nextSections: Record<string, boolean> = {}
    const nextEntries: Record<string, boolean> = {}
    for (const s of EXPORT_SECTIONS) {
      nextSections[s.id] = true
      for (const e of s.entries) nextEntries[e.id] = !e.isPrivate
    }
    setEnabledSections(nextSections)
    setEnabledEntries(nextEntries)
  }

  const deselectAll = () => {
    const nextSections: Record<string, boolean> = {}
    const nextEntries: Record<string, boolean> = {}
    for (const s of EXPORT_SECTIONS) {
      nextSections[s.id] = false
      for (const e of s.entries) nextEntries[e.id] = false
    }
    setEnabledSections(nextSections)
    setEnabledEntries(nextEntries)
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(exportContent).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([exportContent], { type: format.mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const fileBase = format.id === "markdown" ? "sweet-crumb-bakery" : `sweet-crumb-bakery-${format.id === "system" ? "system-prompt" : format.id}`
    a.download = `${fileBase}.${format.ext}`
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  const enabledCount = Object.values(enabledSections).filter(Boolean).length
  const totalEntries = EXPORT_SECTIONS
    .filter(s => enabledSections[s.id])
    .reduce((acc, s) => acc + s.entries.filter(e => !e.isPrivate && enabledEntries[e.id]).length, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8 pb-16"
    >
      {/* ── STEP 1: Pick a format ───────────────────────────── */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground">{"Pick a format"}</h2>
          <p className="mt-1 text-xs text-muted-foreground/60">{"Choose where you'll use this export."}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {FORMATS.map(f => (
            <FormatCard
              key={f.id}
              format={f}
              selected={selectedFormat === f.id}
              onSelect={() => setSelectedFormat(f.id)}
            />
          ))}
        </div>

        {/* How to use — collapsible */}
        <div className="mt-3">
          <button
            onClick={() => setShowHowTo(v => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            <HelpCircle className="h-3 w-3" />
            {"How to use"}
            <ChevronDown className={cn("h-3 w-3 transition-transform", showHowTo && "rotate-180")} />
          </button>
          <AnimatePresence initial={false}>
            {showHowTo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={selectedFormat}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="text-xs leading-relaxed text-muted-foreground/70"
                    >
                      {format.howToUse}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── STEP 2: Choose what to include ──────────────────── */}
      <section>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">{"Choose what to include"}</h2>
            <p className="mt-1 text-xs text-muted-foreground/60">
              {enabledCount}{" sections, "}{totalEntries}{" entries selected"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={selectAll}
              className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              {"Select All"}
            </button>
            <button
              onClick={deselectAll}
              className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              {"Deselect All"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {EXPORT_SECTIONS.map(section => (
            <SectionToggle
              key={section.id}
              section={section}
              enabled={enabledSections[section.id]}
              onToggle={() => toggleSection(section.id)}
              enabledEntries={enabledEntries}
              onToggleEntry={toggleEntry}
            />
          ))}
        </div>

        {/* Token count indicator */}
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-2.5">
            <span className={cn("rounded-lg border px-2 py-1 text-[11px] font-semibold tabular-nums", badge.color)}>
              {tokenCount.toLocaleString()}{" tokens"}
            </span>
            <span className={cn("text-xs font-medium", badge.color.split(" ")[0])}>
              {badge.label}
            </span>
          </div>
          <button
            onClick={() => setShowTokenHelp(v => !v)}
            className="text-[11px] text-muted-foreground/50 underline decoration-dotted underline-offset-2 transition-colors hover:text-foreground"
          >
            {"What are tokens?"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showTokenHelp && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
                <p className="text-xs leading-relaxed text-muted-foreground/70">
                  {"Tokens are how AI tools measure text. Think of them like words — the more you include, the more context the AI has, but every tool has a limit. Most tools handle 30K+ tokens well."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── STEP 3: Preview and actions ─────────────────────── */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground">{"Preview & export"}</h2>
          <p className="mt-1 text-xs text-muted-foreground/60">
            {"Formatted for "}<span className="font-medium text-foreground">{format.name}</span>{" as ."}{format.ext}
          </p>
        </div>

        {/* Preview area */}
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedFormat}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                transition={{ duration: 0.12 }}
                className="flex items-center gap-2"
              >
                <FileText className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span className="text-[11px] font-medium text-muted-foreground/70">
                  {format.id === "markdown" ? "sweet-crumb-bakery" : `sweet-crumb-bakery-${format.id === "system" ? "system-prompt" : format.id}`}{"."}{format.ext}
                </span>
              </motion.div>
            </AnimatePresence>
            <span className="text-[10px] text-muted-foreground/40 tabular-nums">
              {exportContent.split("\n").length}{" lines"}
            </span>
          </div>

          {/* Code preview — smooth transition on format switch */}
          <div className="max-h-80 overflow-auto scrollbar-none">
            <AnimatePresence mode="wait" initial={false}>
              <motion.pre
                key={selectedFormat}
                ref={previewRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-4 text-[12px] leading-relaxed text-foreground/70 font-mono whitespace-pre-wrap break-words"
              >
                {exportContent}
              </motion.pre>
            </AnimatePresence>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Primary: Copy to clipboard */}
          <Button
            onClick={handleCopy}
            className="gap-2 rounded-xl px-5 text-sm font-medium text-white"
            style={{ background: copied ? undefined : BRAND_GRADIENT }}
            variant={copied ? "outline" : "default"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600">{"Copied! Paste into "}{format.name}</span>
              </>
            ) : (
              <>
                <ClipboardCopy className="h-4 w-4" />
                {"Copy to Clipboard"}
              </>
            )}
          </Button>

          {/* Download file */}
          <Button
            onClick={handleDownload}
            variant="outline"
            className="gap-2 rounded-xl text-sm"
          >
            {downloaded ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600">{"Downloaded!"}</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                {"Download ."}{format.ext}
              </>
            )}
          </Button>

          {/* Open in platform */}
          {(selectedFormat === "chatgpt" || selectedFormat === "claude" || selectedFormat === "gemini") && (
            <Button
              variant="ghost"
              className="gap-2 rounded-xl text-sm text-muted-foreground hover:text-foreground"
              asChild
            >
              <a
                href={
                  selectedFormat === "chatgpt"
                    ? "https://chat.openai.com"
                    : selectedFormat === "claude"
                      ? "https://claude.ai"
                      : "https://gemini.google.com"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {"Open "}{format.name}
              </a>
            </Button>
          )}
        </div>
      </section>
    </motion.div>
  )
}
