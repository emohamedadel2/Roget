"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit3,
  ExternalLink,
  File,
  FileSpreadsheet,
  FileText,
  Globe,
  Image as ImageIcon,
  Link2,
  Lock,
  MessageCircle,
  Mic,
  Pause,
  Pencil,
  Play,
  RefreshCw,
  Square,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)"

// ════════════════════════════════════════════════════════════════════
// COMPONENT 1 — Agent Text Message
// ════════════════════════════════════════════════════════════════════
export function AgentMessage({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className="rounded-2xl rounded-tl-md bg-card border border-border px-4 py-3 shadow-sm">
        <p className="text-[15px] leading-relaxed text-foreground">{text}</p>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 1b — User Text Message
// ════════════════════════════════════════════════════════════════════
export function UserMessage({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] rounded-2xl rounded-tr-md px-4 py-3 text-white shadow-sm"
        style={{ background: BRAND_GRADIENT }}
      >
        <p className="text-[15px] leading-relaxed">{text}</p>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 2 — Option Cards (single / multi select)
// ════════════════════════════════════════════════════════════════════
export interface OptionCardItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
}

export function OptionCards({
  items,
  multiSelect = false,
  onSelect,
  delay = 0,
}: {
  items: OptionCardItem[]
  multiSelect?: boolean
  onSelect: (ids: string[]) => void
  delay?: number
}) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) => {
    if (multiSelect) {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      )
    } else {
      onSelect([id])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="h-8 w-8 shrink-0" />
      <div className="space-y-2.5">
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const active = selected.includes(item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/5"
                )}
              >
                {item.icon && <span className="text-base">{item.icon}</span>}
                {multiSelect && (
                  <span className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                    active ? "border-primary bg-primary text-white" : "border-border"
                  )}>
                    {active && <Check className="h-2.5 w-2.5" />}
                  </span>
                )}
                <span>{item.label}</span>
                {item.description && (
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                )}
              </button>
            )
          })}
        </div>
        {multiSelect && selected.length > 0 && (
          <button
            onClick={() => onSelect(selected)}
            className="rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ background: BRAND_GRADIENT }}
          >
            {"Go"}
          </button>
        )}
        <p className="text-xs text-muted-foreground/50 italic">{"Or type your own answer below"}</p>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 3 — Suggestion Chips
// ════════════════════════════════════════════════════════════════════
export interface SuggestionChip {
  id: string
  label: string
  prefill: string
}

export function SuggestionChips({
  chips,
  onSelect,
  delay = 0,
}: {
  chips: SuggestionChip[]
  onSelect: (prefill: string) => void
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-full"
    >
      <div className="h-8 w-8 shrink-0" />
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
        {chips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => onSelect(chip.prefill)}
            className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ═════════════════════════════════════════════════════���══════════════
// COMPONENT 4 — Extraction Result Cards
// ═══��════════════════════════════════════════════════════════════════
export interface ExtractedItem {
  id: string
  content: string
  confidence: "high" | "medium" | "low"
  source: "text" | "photo" | "voice" | "file"
}

const CONFIDENCE = {
  high:   { color: "bg-emerald-500", label: "High" },
  medium: { color: "bg-amber-500",   label: "Medium" },
  low:    { color: "bg-red-500",     label: "Low" },
}

const SOURCE_ICON = {
  text:  Pencil,
  photo: ImageIcon,
  voice: Mic,
  file:  FileText,
}

export function ExtractionCards({
  items,
  summary,
  onEdit,
  onDelete,
  delay = 0,
}: {
  items: ExtractedItem[]
  summary?: string
  onEdit?: (id: string, content: string) => void
  onDelete?: (id: string) => void
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="h-8 w-8 shrink-0" />
      <div className="w-full space-y-2">
        {items.map((item, i) => {
          const conf = CONFIDENCE[item.confidence]
          const SrcIcon = SOURCE_ICON[item.source]
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.08 }}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm"
            >
              <SrcIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground leading-relaxed">{item.content}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={cn("h-1.5 w-1.5 rounded-full", conf.color)} />
                  <span className="text-[11px] text-muted-foreground/60">{conf.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => onEdit?.(item.id, item.content)}
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground/40 hover:bg-muted hover:text-foreground"
                  aria-label="Edit"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onDelete?.(item.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          )
        })}
        {summary && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: items.length * 0.08 + 0.2 }}
            className="text-sm font-medium text-primary/80 pl-1"
          >
            {summary}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 5 — Multi-World Detection Cards
// ════════════════════════════════════════════════════════════════════
export interface DetectedWorld {
  id: string
  emoji: string
  name: string
  description: string
  itemCount: number
  defaultChecked?: boolean
}

export function MultiWorldCards({
  worlds,
  onConfirm,
  delay = 0,
}: {
  worlds: DetectedWorld[]
  onConfirm: (selectedIds: string[]) => void
  delay?: number
}) {
  const [checked, setChecked] = useState<string[]>(
    worlds.filter((w) => w.defaultChecked !== false).map((w) => w.id)
  )

  const toggle = (id: string) =>
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className="w-full space-y-2.5">
        <p className="text-[15px] text-foreground leading-relaxed rounded-2xl rounded-tl-md bg-card border border-border px-4 py-3 shadow-sm">
          {"I see "}{worlds.length}{" different worlds in what you shared:"}
        </p>
        {worlds.map((world) => {
          const active = checked.includes(world.id)
          return (
            <button
              key={world.id}
              onClick={() => toggle(world.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all",
                active
                  ? "border-primary/40 bg-primary/5 shadow-sm"
                  : "border-border bg-card/60 opacity-60"
              )}
            >
              <span className={cn(
                "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                active ? "border-primary bg-primary text-white" : "border-border"
              )}>
                {active && <Check className="h-3 w-3" />}
              </span>
              <span className="text-lg">{world.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{world.name}</p>
                <p className="text-xs text-muted-foreground">{world.description}</p>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {world.itemCount}{" items"}
              </span>
            </button>
          )
        })}
        <button
          onClick={() => onConfirm(checked)}
          className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          style={{ background: BRAND_GRADIENT }}
        >
          {"Continue with selected"}
        </button>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 6 — Photo / File / Voice Preview
// ════════════════════════════════════════════════════════════════════
export function MediaPreview({
  type,
  name,
  size,
  thumbnailUrl,
  duration,
  delay = 0,
}: {
  type: "photo" | "file" | "voice"
  name?: string
  size?: string
  thumbnailUrl?: string
  duration?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex justify-end"
    >
      {type === "photo" && (
        <div className="max-w-[70%] overflow-hidden rounded-2xl rounded-tr-md border border-border shadow-sm">
          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt="Uploaded photo" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                <ImageIcon className="h-8 w-8" />
                <span className="text-xs">{"Kitchen photo"}</span>
              </div>
            )}
          </div>
        </div>
      )}
      {type === "file" && (
        <div className="flex items-center gap-3 rounded-2xl rounded-tr-md border border-border bg-card px-4 py-3 shadow-sm max-w-[70%]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <File className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{name || "Document.pdf"}</p>
            <p className="text-xs text-muted-foreground/60">{size || "PDF"}</p>
          </div>
        </div>
      )}
      {type === "voice" && (
        <div className="flex items-center gap-3 rounded-2xl rounded-tr-md border border-border bg-card px-4 py-3 shadow-sm max-w-[70%]">
          <Mic className="h-4 w-4 text-primary" />
          {/* Waveform visual */}
          <div className="flex items-center gap-[2px] h-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full bg-primary/60"
                initial={{ height: 4 }}
                animate={{ height: Math.random() * 18 + 4 }}
                transition={{ duration: 0.4, delay: i * 0.02 }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground/60 shrink-0">{duration || "0:12"}</span>
        </div>
      )}
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 7 — Processing Indicator
// ════════════════════════════════════════════════════════════════════
export function ProcessingIndicator({
  text,
  delay = 0,
}: {
  text: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className="flex items-center gap-3 rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 shadow-sm">
        {/* Animated dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ background: BRAND_GRADIENT }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 8 — Section Summary Card
// ════════════════════════════════════════════════════════════════════
export interface SectionStatus {
  name: string
  count: number
  done: boolean
}

export function SectionSummaryCard({
  vaultName,
  sections,
  onTapMissing,
  delay = 0,
}: {
  vaultName: string
  sections: SectionStatus[]
  onTapMissing?: (name: string) => void
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="h-8 w-8 shrink-0" />
      <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-[15px] font-semibold text-foreground mb-3">{vaultName}{" so far:"}</p>
        <div className="space-y-2">
          {sections.map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {s.done ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </span>
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                  </span>
                )}
                <span className={cn(
                  "text-sm",
                  s.done ? "text-foreground font-medium" : "text-muted-foreground/60"
                )}>
                  {s.name}
                </span>
              </div>
              {s.done ? (
                <span className="text-xs font-medium text-foreground/60">{s.count}{" items"}</span>
              ) : (
                <button
                  onClick={() => onTapMissing?.(s.name)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {"Add"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 9 — Magic Moment Card
// ════════════════════════════════════════════════════════════════════
export interface MagicMomentData {
  promptTitle: string
  promptPreview: string
  fullPrompt: string
  highlights: string[]
}

const PLATFORMS = [
  { id: "chatgpt", name: "ChatGPT", url: "https://chat.openai.com", color: "#10A37F" },
  { id: "claude",  name: "Claude",  url: "https://claude.ai",       color: "#CC9B7A" },
  { id: "gemini",  name: "Gemini",  url: "https://gemini.google.com", color: "#4285F4" },
]

export function MagicMomentCard({
  data,
  onPlatformSelect,
  delay = 0,
}: {
  data: MagicMomentData
  onPlatformSelect?: (platformId: string) => void
  delay?: number
}) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (platformId: string) => {
    navigator.clipboard.writeText(data.fullPrompt)
    setCopied(platformId)
    onPlatformSelect?.(platformId)
    setTimeout(() => setCopied(null), 2500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-start gap-3 max-w-[90%]"
    >
      <div className="h-8 w-8 shrink-0" />
      <div className="w-full overflow-hidden rounded-2xl border-2 border-primary/20 bg-card shadow-lg">
        {/* Header glow */}
        <div className="px-5 pt-5 pb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">
            {"Here's what AI can do for you right now"}
          </p>
          <p className="text-base font-semibold text-foreground leading-snug">{data.promptTitle}</p>
          <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{data.promptPreview}</p>
        </div>

        {/* Expandable full prompt */}
        <div className="px-5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary/70 hover:text-primary transition-colors"
          >
            <ChevronDown className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")} />
            {expanded ? "Hide full prompt" : "See full prompt"}
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <pre className="mt-2 rounded-xl bg-muted/50 border border-border p-3.5 text-xs leading-relaxed text-foreground/70 font-mono whitespace-pre-wrap">
                  {data.fullPrompt}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Platform buttons */}
        <div className="flex flex-wrap gap-2 px-5 pt-4 pb-5">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handleCopy(platform.id)}
              className={cn(
                "flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-semibold transition-all",
                copied === platform.id
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                  : "border-border bg-card text-foreground hover:border-primary/30 hover:shadow-sm"
              )}
            >
              {copied === platform.id ? (
                <>
                  <Check className="h-4 w-4" />
                  {"Copied!"}
                </>
              ) : (
                <>
                  <span className="flex h-5 w-5 items-center justify-center rounded-md" style={{ backgroundColor: `${platform.color}18` }}>
                    <ExternalLink className="h-3 w-3" style={{ color: platform.color }} />
                  </span>
                  {"Try in "}{platform.name}
                </>
              )}
            </button>
          ))}
        </div>
        <div className="border-t border-border bg-muted/30 px-5 py-3">
          <p className="text-xs text-muted-foreground/60 text-center">
            {"Paste what we just copied and see the difference."}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 10 — Keep Going Suggestions
// ════════════════════════════════════════════════════════════════════
export interface KeepGoingItem {
  id: string
  action: string
  unlocks: string[]
}

export function KeepGoingSuggestions({
  items,
  onSelect,
  onGoToVault,
  delay = 0,
}: {
  items: KeepGoingItem[]
  onSelect: (id: string) => void
  onGoToVault: () => void
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className="w-full space-y-2.5">
        <div className="rounded-2xl rounded-tl-md bg-card border border-border px-4 py-3 shadow-sm">
          <p className="text-[15px] leading-relaxed text-foreground">
            {"That was from what you shared. With a bit more, AI could also:"}
          </p>
        </div>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="w-full rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm group"
          >
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.action}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.unlocks.map((u) => (
                <span key={u} className="rounded-full bg-muted/60 px-2.5 py-0.5 text-[11px] text-muted-foreground/50">
                  {u}
                </span>
              ))}
            </div>
          </button>
        ))}
        <button
          onClick={onGoToVault}
          className="flex items-center gap-1.5 pl-1 text-sm font-medium text-primary hover:underline transition-colors"
        >
          {"Take me to my vault"}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 11 — Inline Confirm/Edit
// ════════════════════════════════════════════════════════════════════
export function InlineConfirm({
  items,
  onConfirmAll,
  onEdit,
  onDelete,
  delay = 0,
}: {
  items: ExtractedItem[]
  onConfirmAll: () => void
  onEdit?: (id: string, content: string) => void
  onDelete?: (id: string) => void
  delay?: number
}) {
  const [confirmed, setConfirmed] = useState<string[]>([])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="h-8 w-8 shrink-0" />
      <div className="w-full space-y-2">
        {items.map((item) => {
          const isConfirmed = confirmed.includes(item.id)
          return (
            <div
              key={item.id}
              className={cn(
                "group flex items-center gap-3 rounded-xl border p-3 transition-all",
                isConfirmed
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-border bg-card"
              )}
            >
              <button
                onClick={() => setConfirmed((p) => [...p, item.id])}
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  isConfirmed
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-border hover:border-emerald-400"
                )}
                aria-label="Confirm item"
              >
                {isConfirmed && <Check className="h-3 w-3" />}
              </button>
              <p className={cn(
                "flex-1 text-sm",
                isConfirmed ? "text-foreground/60" : "text-foreground"
              )}>
                {item.content}
              </p>
              {!isConfirmed && (
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit?.(item.id, item.content)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground/40 hover:bg-muted hover:text-foreground"
                    aria-label="Edit"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onDelete?.(item.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
        <button
          onClick={onConfirmAll}
          className="w-full rounded-xl border border-border bg-card py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/30"
        >
          {"Looks good"}
        </button>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 13 — Voice Recording Inline
// ════════════════════════════════════════════════════════════════════
export function VoiceRecordingInline({
  onStop,
  onCancel,
}: {
  onStop: (duration: string, transcript: string) => void
  onCancel: () => void
}) {
  const [seconds, setSeconds] = useState(0)
  const [liveTranscript, setLiveTranscript] = useState("")
  const [finalizing, setFinalizing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  // Simulate live transcription
  useEffect(() => {
    const phrases = [
      "I run a bakery",
      "I run a bakery called Sweet Crumb",
      "I run a bakery called Sweet Crumb, we make sourdough",
      "I run a bakery called Sweet Crumb, we make sourdough and pastries...",
      "I run a bakery called Sweet Crumb, we make sourdough and pastries... we have a Bongard oven",
    ]
    const intervals = phrases.map((phrase, i) =>
      setTimeout(() => setLiveTranscript(phrase), (i + 1) * 1800)
    )
    return () => intervals.forEach(clearTimeout)
  }, [])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

  const handleStop = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setFinalizing(true)
    await new Promise((r) => setTimeout(r, 1200))
    onStop(
      formatTime(seconds),
      "I run a bakery called Sweet Crumb, we specialize in sourdough and pastries. We have a Bongard deck oven and a blast chiller. My team is 5 people, Maria manages the morning shift."
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      {/* Recording indicator + timer */}
      <div className="flex items-center gap-3">
        <motion.div
          className="h-3 w-3 rounded-full bg-red-500"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <span className="text-sm font-mono font-medium text-foreground tabular-nums">
          {formatTime(seconds)}
        </span>
        <span className="text-xs text-muted-foreground/50">{"Recording..."}</span>
      </div>

      {/* Waveform visualization */}
      <div className="flex items-center gap-[2px] h-8 px-1">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-red-500/60"
            animate={{
              height: [4, Math.random() * 28 + 4, 4],
            }}
            transition={{
              duration: 0.6 + Math.random() * 0.4,
              repeat: Infinity,
              delay: i * 0.03,
            }}
          />
        ))}
      </div>

      {/* Live transcription */}
      {liveTranscript && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground/60 italic leading-relaxed min-h-[2.5rem]"
        >
          {liveTranscript}
          <motion.span
            className="inline-block w-0.5 h-3.5 bg-muted-foreground/40 ml-0.5 align-middle"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </motion.p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        {finalizing ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </motion.div>
            {"Finalizing transcript..."}
          </div>
        ) : (
          <>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <Square className="h-3 w-3 fill-current" />
              {"Stop"}
            </button>
            <button
              onClick={onCancel}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {"Cancel"}
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ── Voice message (user message with waveform) ──
export function VoiceMessageBubble({
  duration,
  transcript,
  delay = 0,
}: {
  duration: string
  transcript: string
  delay?: number
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] space-y-2">
        {/* Waveform card */}
        <div
          className="flex items-center gap-3 rounded-2xl rounded-tr-md px-4 py-3 shadow-sm"
          style={{ background: BRAND_GRADIENT }}
        >
          <button
            onClick={() => setPlaying(!playing)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
          </button>
          <div className="flex items-center gap-[2px] h-6 flex-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full bg-white/60"
                initial={{ height: 4 }}
                animate={{ height: playing ? [4, Math.random() * 18 + 4, 4] : Math.random() * 16 + 4 }}
                transition={playing ? { duration: 0.5, repeat: Infinity, delay: i * 0.02 } : { duration: 0.4, delay: i * 0.02 }}
              />
            ))}
          </div>
          <span className="text-xs text-white/70 shrink-0 tabular-nums">{duration}</span>
        </div>
        {/* Transcript below */}
        <p className="text-sm text-foreground/60 leading-relaxed px-1">{transcript}</p>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 14 — Photo Upload States
// ════════════════════════════════════════════════════════════════════
export function PhotoUploadMessage({
  photos,
  delay = 0,
}: {
  photos: { id: string; url?: string; name: string }[]
  delay?: number
}) {
  const [loaded, setLoaded] = useState<string[]>([])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex justify-end"
    >
      <div className={cn(
        "max-w-[80%]",
        photos.length > 1 ? "flex gap-2 overflow-x-auto scrollbar-none" : ""
      )}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={cn(
              "relative overflow-hidden rounded-2xl rounded-tr-md border border-border shadow-sm",
              photos.length > 1 ? "shrink-0 w-40 h-32" : "w-full aspect-[4/3] max-w-xs"
            )}
          >
            {photo.url ? (
              <>
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                  onLoad={() => setLoaded((p) => [...p, photo.id])}
                />
                {/* Upload progress overlay */}
                {!loaded.includes(photo.id) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <motion.div
                      className="h-1 w-3/4 rounded-full bg-muted-foreground/10 overflow-hidden"
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: BRAND_GRADIENT }}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5 }}
                      />
                    </motion.div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                  <motion.div className="h-1 w-20 rounded-full bg-muted-foreground/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: BRAND_GRADIENT }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Photo Scanning Animation (Agent processing a photo) ──
export function PhotoScanningIndicator({
  photoUrl,
  text,
  delay = 0,
}: {
  photoUrl?: string
  text: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className="w-full space-y-2">
        <div className="relative overflow-hidden rounded-xl border border-border shadow-sm max-w-[260px] aspect-[4/3]">
          {photoUrl ? (
            <img src={photoUrl} alt="Scanning" className="h-full w-full object-cover opacity-70" crossOrigin="anonymous" />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
          {/* Scanning line */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] shadow-lg"
            style={{ background: BRAND_GRADIENT, boxShadow: "0 0 12px rgba(124, 58, 237, 0.4)" }}
            initial={{ top: "0%" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Corner highlights */}
          {[
            "top-2 left-2 border-t-2 border-l-2",
            "top-2 right-2 border-t-2 border-r-2",
            "bottom-2 left-2 border-b-2 border-l-2",
            "bottom-2 right-2 border-b-2 border-r-2",
          ].map((pos, i) => (
            <motion.div
              key={i}
              className={cn("absolute h-3 w-3 border-primary/60 rounded-sm", pos)}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: BRAND_GRADIENT }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{text}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 15 — File Upload Message
// ════════════════════════════════════════════════════════════════════
const FILE_ICONS: Record<string, typeof FileText> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
}

export function FileUploadMessage({
  files,
  delay = 0,
}: {
  files: { id: string; name: string; size: string; ext: string; pages?: number }[]
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex justify-end"
    >
      <div className="max-w-[75%] space-y-2">
        {files.map((file) => {
          const Icon = FILE_ICONS[file.ext] || File
          return (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-2xl rounded-tr-md border border-border bg-card px-4 py-3 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground/60">
                  {file.size}
                  {file.pages ? ` \u00B7 ${file.pages} pages` : ""}
                </p>
              </div>
              {/* Upload progress */}
              <motion.div
                className="h-1 w-16 rounded-full bg-muted overflow-hidden shrink-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 1.5, duration: 0.3 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: BRAND_GRADIENT }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                />
              </motion.div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── File Reading Indicator (Agent processing a document) ──
export function FileReadingIndicator({
  fileName,
  currentPage,
  totalPages,
  delay = 0,
}: {
  fileName: string
  currentPage?: number
  totalPages?: number
  delay?: number
}) {
  const [page, setPage] = useState(currentPage || 1)

  useEffect(() => {
    if (!totalPages || totalPages <= 1) return
    const iv = setInterval(() => {
      setPage((p) => (p < totalPages ? p + 1 : p))
    }, 600)
    return () => clearInterval(iv)
  }, [totalPages])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className="flex items-center gap-3 rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 shadow-sm">
        <motion.div
          animate={{ rotateY: [0, 180, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FileText className="h-4 w-4 text-primary" />
        </motion.div>
        <div>
          <p className="text-sm text-muted-foreground">
            {"Reading "}{fileName}{"..."}
          </p>
          {totalPages && totalPages > 1 && (
            <p className="text-xs text-muted-foreground/50 tabular-nums mt-0.5">
              {"Page "}{page}{" of "}{totalPages}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 16 — Attachment Preview Bar (above input)
// ════════════════════════════════════════════════════════════════════
export interface Attachment {
  id: string
  type: "photo" | "file"
  name: string
  url?: string
  size?: string
}

export function AttachmentPreviewBar({
  attachments,
  onRemove,
}: {
  attachments: Attachment[]
  onRemove: (id: string) => void
}) {
  if (attachments.length === 0) return null
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-2 overflow-x-auto scrollbar-none px-3 pt-2 pb-1"
    >
      {attachments.map((att) => (
        <div
          key={att.id}
          className="relative shrink-0 group"
        >
          {att.type === "photo" ? (
            <div className="h-14 w-14 overflow-hidden rounded-xl border border-border bg-muted">
              {att.url ? (
                <img src={att.url} alt={att.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-14 items-center gap-2 rounded-xl border border-border bg-card px-3">
              <File className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-xs text-foreground truncate max-w-[100px]">{att.name}</span>
            </div>
          )}
          <button
            onClick={() => onRemove(att.id)}
            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background shadow-sm opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Remove attachment"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>
      ))}
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 17 — Drop Zone Overlay
// ════════════════════════════════════════════════════════════════════
export function DropZoneOverlay({
  active,
  fileType,
}: {
  active: boolean
  fileType?: "image" | "file"
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 backdrop-blur-sm"
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: BRAND_GRADIENT }}
          >
            {fileType === "image" ? (
              <ImageIcon className="h-5 w-5 text-white" />
            ) : (
              <Upload className="h-5 w-5 text-white" />
            )}
          </div>
          <p className="text-sm font-medium text-foreground">
            {fileType === "image" ? "Drop your image here" : "Drop your file here"}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {fileType === "image" ? "JPG, PNG, WebP, or HEIC" : "PDF, DOCX, XLSX, or CSV"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 18 — Error Message (conversational inline)
// ════════════════════════════════════════════════════════════════════
export function ErrorMessage({
  text,
  hint,
  onRetry,
  delay = 0,
}: {
  text: string
  hint?: string
  onRetry?: () => void
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-amber-500/20 bg-amber-500/5 px-4 py-3 shadow-sm">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <p className="text-sm text-foreground leading-relaxed">{text}</p>
            {hint && (
              <p className="mt-1 text-xs text-muted-foreground/70">{hint}</p>
            )}
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <RefreshCw className="h-3 w-3" />
                {"Try again"}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 19 — Typing Indicator (pure thinking dots)
// ════════════════════════════════════════════════════════════════════
export function TypingIndicator({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="flex items-start gap-3"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className="flex gap-1 rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3.5 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-muted-foreground/30"
            animate={{
              y: [0, -5, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 20 — URL Message Card (user-sent URL)
// ════════════════════════════════════════════════════════════════════
export interface UrlCardData {
  url: string
  domain: string
  favicon?: string
  isGoogleMaps?: boolean
}

export function UrlMessageCard({
  data,
  delay = 0,
}: {
  data: UrlCardData
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex justify-end"
    >
      <div
        className="max-w-[80%] rounded-2xl rounded-tr-md px-4 py-3 text-white shadow-sm"
        style={{ background: BRAND_GRADIENT }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
            {data.favicon ? (
              <img src={data.favicon} alt="" className="h-4 w-4 rounded-sm" crossOrigin="anonymous" />
            ) : (
              <Globe className="h-4 w-4 text-white/80" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{data.domain}</p>
            <p className="truncate text-xs text-white/60">{data.url}</p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-white/40" />
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 21 — URL Reading Indicator
// ════════════════════════════════════════════════════════════════════
export function UrlReadingIndicator({
  domain,
  text,
  pages,
  delay = 0,
}: {
  domain: string
  text: string
  pages?: { url: string; done: boolean }[]
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 shadow-sm">
        {/* Processing header */}
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="h-4 w-4 text-primary" />
          </motion.div>
          <p className="text-sm font-medium text-foreground">{text}</p>
        </div>

        {/* Multi-page crawl list */}
        {pages && pages.length > 0 && (
          <div className="mt-3 space-y-1.5 border-t border-border pt-3">
            {pages.map((page) => (
              <div key={page.url} className="flex items-center gap-2 text-xs">
                {page.done ? (
                  <Check className="h-3 w-3 shrink-0 text-emerald-500" />
                ) : (
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="h-3 w-3 shrink-0 rounded-full bg-primary/40"
                  />
                )}
                <span className={cn(
                  "truncate",
                  page.done ? "text-foreground/70" : "text-muted-foreground/50"
                )}>
                  {page.url}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 22 — Google Maps Photo Analysis
// ════════════════════════════════════════════════════════════════════
export interface PhotoAnalysisItem {
  id: string
  thumbnailUrl: string
  label: string
  description?: string
  done: boolean
}

export function PhotoAnalysisCards({
  photos,
  summary,
  delay = 0,
}: {
  photos: PhotoAnalysisItem[]
  summary?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3.5 shadow-sm space-y-3 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium text-foreground">
            {"Analyzing "}{photos.length}{" photos from your listing..."}
          </p>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-muted/40"
            >
              <div className="aspect-[4/3] w-full bg-muted/60">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.label}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="p-2">
                <p className="text-[11px] font-medium text-foreground/80 leading-snug">{photo.label}</p>
                {photo.description && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-1 text-[10px] leading-snug text-muted-foreground"
                  >
                    {photo.description}
                  </motion.p>
                )}
                {!photo.done && !photo.description && (
                  <div className="mt-1 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1 w-1 rounded-full bg-primary/40"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Combined description */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl border border-primary/15 bg-primary/5 p-3"
          >
            <p className="text-xs leading-relaxed text-foreground/80">{summary}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 23 — Blocked URL Message
// ════════════════════════════════════════════════════════════════════
export type BlockedUrlReason = "social-media" | "login-required" | "dead-link"

export interface BlockedUrlAction {
  id: string
  label: string
  icon: React.ReactNode
}

export function BlockedUrlMessage({
  reason,
  domain,
  message,
  actions,
  onActionSelect,
  delay = 0,
}: {
  reason: BlockedUrlReason
  domain: string
  message: string
  actions?: BlockedUrlAction[]
  onActionSelect?: (actionId: string) => void
  delay?: number
}) {
  const iconColor =
    reason === "social-media" ? "text-pink-500" :
    reason === "login-required" ? "text-amber-500" :
    "text-red-400"

  const borderColor =
    reason === "social-media" ? "border-pink-500/20 bg-pink-500/5" :
    reason === "login-required" ? "border-amber-500/20 bg-amber-500/5" :
    "border-red-400/20 bg-red-400/5"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className={cn("rounded-2xl rounded-tl-md border px-4 py-3 shadow-sm space-y-3", borderColor)}>
        <div className="flex items-start gap-2.5">
          {reason === "login-required" ? (
            <Lock className={cn("h-4 w-4 shrink-0 mt-0.5", iconColor)} />
          ) : (
            <AlertCircle className={cn("h-4 w-4 shrink-0 mt-0.5", iconColor)} />
          )}
          <p className="text-sm leading-relaxed text-foreground">{message}</p>
        </div>

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => onActionSelect?.(action.id)}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT 24 — Link Suggestion (agent proactive)
// ════════════════════════════════════════════════════════════════════
export function LinkSuggestionCard({
  businessName,
  onPasteLink,
  onManual,
  delay = 0,
}: {
  businessName: string
  onPasteLink: () => void
  onManual: () => void
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3 max-w-[85%]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
        <img src="/images/roget-icon.png" alt="" className="h-5 w-5 rounded-full" />
      </div>
      <div className="space-y-2.5">
        <div className="rounded-2xl rounded-tl-md bg-card border border-border px-4 py-3 shadow-sm">
          <p className="text-[15px] leading-relaxed text-foreground">
            {"Do you have a Google Maps listing or website for "}
            <span className="font-semibold">{businessName}</span>
            {"? Paste the link and I'll pull in everything automatically."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onPasteLink}
            className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/10"
          >
            <Link2 className="h-3.5 w-3.5" />
            {"Paste a link"}
          </button>
          <button
            onClick={onManual}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-primary/5"
          >
            <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
            {"I'll add things manually"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
