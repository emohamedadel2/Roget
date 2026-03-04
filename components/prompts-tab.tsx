"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCopy,
  Copy,
  Download,
  Loader2,
  Lock,
  Megaphone,
  Pencil,
  Plus,
  Send,
  Sparkles,
  Tag,
  UtensilsCrossed,
  Wrench,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CaptureInput } from "@/components/capture-input"

// ── Design constants ──────────────────────────────────────────────────

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)"

// ── Types ─────────────────────────────────────────────────────────────

interface OutcomeCard {
  id: string
  headline: string
  description: string
  tags: { name: string; count: number }[]
  platform: "ChatGPT" | "Claude" | "Gemini" | "Any"
  promptText: string
  tokenCount?: number
  locked?: false
}

interface LockedOutcomeCard {
  id: string
  headline: string
  description: string
  unlockLabel: string
  unlockSection: string
  locked: true
}

type AnyCard = OutcomeCard | LockedOutcomeCard

interface OutcomeCategory {
  id: string
  name: string
  tagline: string
  accentColor: string
  accentBg: string
  icon: React.ReactNode
  cards: AnyCard[]
}

// ── Data ──────────────────────────────────────────────────────────────

const CATEGORIES: OutcomeCategory[] = [
  {
    id: "marketing",
    name: "Marketing",
    tagline: "Grow your bakery\u2019s presence",
    accentColor: "#EA580C",
    accentBg: "rgba(234,88,12,0.08)",
    icon: <Megaphone className="h-5 w-5" />,
    cards: [
      {
        id: "m1",
        headline: "5 Instagram Captions for This Week",
        description: "Featuring your croissants, sourdough, and seasonal lavender scones",
        tags: [{ name: "Recipes", count: 4 }, { name: "Hours", count: 1 }],
        platform: "ChatGPT",
        promptText: "Write 5 Instagram captions for this week featuring my croissants ($4.50), sourdough loaves ($8), and new seasonal lavender scones. Our hours are Tue\u2013Sat 6am\u20133pm. Keep the tone warm and artisan.",
        tokenCount: 1800,
      },
      {
        id: "m2",
        headline: "Google Business Profile Description",
        description: "Highlighting your artisan sourdough process and chocolate work",
        tags: [{ name: "Equipment", count: 4 }, { name: "Recipes", count: 4 }],
        platform: "Any",
        promptText: "Create a Google Business Profile description for Sweet Crumb Bakery. Highlight our artisan sourdough process (78% hydration, 18-hour cold ferment) and specialty chocolate work using 60% Valrhona. We use a Bongard deck oven and tempering machine.",
        tokenCount: 2100,
      },
      {
        id: "m3",
        headline: "Reply to a Customer Review",
        description: "Professional response to mixed feedback about service and pastries",
        tags: [{ name: "Staff", count: 2 }, { name: "Hours", count: 1 }],
        platform: "ChatGPT",
        promptText: "Write a professional, warm response to a 4-star review that mentioned slow service but great pastries. Our team is Maria (morning manager) plus 3 full-time bakers. We want to acknowledge the feedback and invite them back.",
        tokenCount: 1400,
      },
      {
        id: "m-locked-1",
        headline: "Instagram Captions In Your Voice",
        description: "AI would write captions that sound exactly like you",
        unlockLabel: "Add your Instagram tone to unlock this",
        unlockSection: "Instagram Voice",
        locked: true,
      },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    tagline: "Run your bakery smarter",
    accentColor: "#2563EB",
    accentBg: "rgba(37,99,235,0.08)",
    icon: <Wrench className="h-5 w-5" />,
    cards: [
      {
        id: "o1",
        headline: "Supplier Price Comparison",
        description: "Compare Mill Creek flour pricing with alternatives and build a negotiation plan",
        tags: [{ name: "Suppliers", count: 2 }],
        platform: "Claude",
        promptText: "My flour from Mill Creek is $45/50lb with a 3-day lead time. Research alternative suppliers and suggest whether I should renegotiate. Also recommend how to frame the conversation with my current supplier.",
        tokenCount: 1600,
      },
      {
        id: "o2",
        headline: "Weekly Staff Schedule",
        description: "Optimal schedule for 3 full-time and 2 part-time staff, Tue\u2013Sat 6am\u20133pm",
        tags: [{ name: "Staff", count: 2 }, { name: "Hours", count: 1 }],
        platform: "Any",
        promptText: "Create an optimal weekly staff schedule for Sweet Crumb Bakery. Staff: Maria (morning manager), 3 full-time bakers, 2 part-time. Hours: Tue\u2013Sat 6am\u20133pm. We\u2019re busiest Sat mornings and need at least 2 bakers for opening prep.",
        tokenCount: 1900,
      },
      {
        id: "o-locked-1",
        headline: "Food Cost Calculator",
        description: "AI would calculate exact food cost per item and flag where you\u2019re losing margin",
        unlockLabel: "Add your pricing to unlock this",
        unlockSection: "Pricing",
        locked: true,
      },
    ],
  },
  {
    id: "menu",
    name: "Menu Planning",
    tagline: "Expand what you offer",
    accentColor: "#16A34A",
    accentBg: "rgba(22,163,74,0.08)",
    icon: <UtensilsCrossed className="h-5 w-5" />,
    cards: [
      {
        id: "mp1",
        headline: "3 New Spring Menu Items",
        description: "Based on your Bongard oven, blast chiller, and tempering machine",
        tags: [{ name: "Equipment", count: 4 }, { name: "Recipes", count: 4 }],
        platform: "Claude",
        promptText: "Suggest 3 new spring menu items for Sweet Crumb Bakery. We have a Bongard deck oven, blast chiller, and tempering machine. Current menu includes croissants, sourdough, lavender scones, and chocolate ganache tarts. Use seasonal ingredients.",
        tokenCount: 2400,
      },
      {
        id: "mp2",
        headline: "Lunch Menu Feasibility Plan",
        description: "What you could add without buying new equipment",
        tags: [{ name: "Equipment", count: 4 }, { name: "Recipes", count: 4 }, { name: "Staff", count: 2 }],
        platform: "Any",
        promptText: "I want to add a lunch option at Sweet Crumb Bakery. Given my current equipment (Bongard deck oven, blast chiller, tempering machine) and staff (Maria + 3 FT bakers), what lunch items would be feasible without purchasing new equipment?",
        tokenCount: 2800,
      },
    ],
  },
  {
    id: "content",
    name: "Content",
    tagline: "Tell your bakery\u2019s story",
    accentColor: "#7C3AED",
    accentBg: "rgba(124,58,237,0.08)",
    icon: <Pencil className="h-5 w-5" />,
    cards: [
      {
        id: "c1",
        headline: "Blog Post: Your Sourdough Process",
        description: "78% hydration, 18-hour cold ferment, 250g starter \u2014 the full story",
        tags: [{ name: "Recipes", count: 4 }, { name: "Equipment", count: 4 }],
        platform: "ChatGPT",
        promptText: "Write a 600-word blog post about Sweet Crumb Bakery\u2019s sourdough process. Key details: 78% hydration, 18-hour cold ferment, 250g starter, baked in a Bongard deck oven. Write in a warm, educational tone that makes customers feel connected to the craft.",
        tokenCount: 2200,
      },
      {
        id: "c2",
        headline: "Behind-the-Scenes Instagram Story",
        description: "Your morning prep routine starting at 5:30am",
        tags: [{ name: "Staff", count: 2 }, { name: "Hours", count: 1 }, { name: "Equipment", count: 4 }],
        platform: "Any",
        promptText: "Create a 6-frame behind-the-scenes Instagram Story script showing the Sweet Crumb morning routine. We start at 5:30am. Maria manages the morning. Include the Bongard oven pre-heat, sourdough scoring, and croissant proofing. Make it feel real and human.",
        tokenCount: 2000,
      },
    ],
  },
]

const BUILDER_PLACEHOLDERS = [
  "I need help writing a catering proposal",
  "How should I price my new croissant flavors?",
  "Help me plan a Valentine\u2019s Day promotion",
  "Write a response to a customer complaint",
  "Plan next month\u2019s Instagram content",
]

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.name })),
]

// ── Platform utilities ─────────────────────────────────────────────────

const PLATFORM_COLORS: Record<string, string> = {
  ChatGPT: "bg-emerald-500/12 text-emerald-700",
  Claude: "bg-orange-500/12 text-orange-700",
  Gemini: "bg-blue-500/12 text-blue-700",
  Any: "bg-primary/10 text-primary",
}

const PLATFORM_STEPS: Record<string, { steps: string[]; cta: string }> = {
  ChatGPT: {
    steps: ["Open ChatGPT", "Paste the prompt", "Attach the .md file or paste the context"],
    cta: "Copy for ChatGPT",
  },
  Claude: {
    steps: ["Create a Project", "Upload the .md file as knowledge", "Paste the prompt"],
    cta: "Copy for Claude",
  },
  Gemini: {
    steps: ["Paste the context first", "Then paste the prompt below it"],
    cta: "Copy for Gemini",
  },
  Any: {
    steps: ["Copy the prompt", "Paste your vault context above it", "Send to any AI tool"],
    cta: "Copy Prompt",
  },
}

// ── Small atoms ────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[13px] font-bold", PLATFORM_COLORS[platform] ?? PLATFORM_COLORS.Any)}>
      {platform === "Any" ? "Works with any AI" : `Best with ${platform}`}
    </span>
  )
}

function SectionTag({ name, count }: { name: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-[13px] font-medium text-muted-foreground">
      <Tag className="h-3 w-3" />
      {name}
      <span className="text-muted-foreground/50">{"("}{count}{")"}</span>
    </span>
  )
}

// ── "Get This" expanded panel ──────────────────────────────────────────

function GetThisPanel({
  card,
  onClose,
}: {
  card: OutcomeCard
  onClose: () => void
}) {
  const [copied, setCopied] = useState<string | null>(null)
  const platforms = card.platform === "Any"
    ? ["ChatGPT", "Claude", "Gemini"]
    : [card.platform]

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const contextMd = card.tags
    .map((t) => `## ${t.name}\n(${t.count} entries from your vault)`)
    .join("\n\n")

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
      className="overflow-hidden"
    >
      <div className="border-t border-border px-5 pb-5 pt-5 space-y-5">

        {/* Step 1 */}
        <div>
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground/60">
            {"Step 1 \u2014 Your prompt"}
          </p>
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-[15px] leading-relaxed text-foreground/80">{card.promptText}</p>
          </div>
          <button
            onClick={() => handleCopy("prompt", card.promptText)}
            className="mt-3 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.04] px-4 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-primary/[0.08]"
          >
            <ClipboardCopy className="h-4 w-4 text-primary" />
            {"Copy prompt"}
            <AnimatePresence>
              {copied === "prompt" && (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-emerald-500">
                  <Check className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Step 2 */}
        <div>
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground/60">
            {"Step 2 \u2014 Grab your bakery context"}
          </p>
          <div className="space-y-2">
            {card.tags.map((t) => (
              <div key={t.name} className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                <span className="text-[15px] text-foreground/70">
                  {t.name}{" "}
                  <span className="text-muted-foreground/50">{"("}{t.count}{" entries)"}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(`ctx-${t.name}`, `## ${t.name}\n(${t.count} entries from your vault)`)}
                    className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {"Copy"}
                    {copied === `ctx-${t.name}` && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                  </button>
                  <button className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Download className="h-3.5 w-3.5" />
                    {".md"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleCopy("all", contextMd)}
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Copy className="h-3.5 w-3.5" />
              {"Copy All"}
              {copied === "all" && <Check className="h-3.5 w-3.5 text-emerald-500" />}
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted">
              <Download className="h-3.5 w-3.5" />
              {"Download All .md"}
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div>
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground/60">
            {"Step 3 \u2014 Use it"}
          </p>
          <div className="space-y-2">
            {platforms.map((platform) => {
              const guide = PLATFORM_STEPS[platform] ?? PLATFORM_STEPS.Any
              return (
                <div key={platform} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-2">
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[13px] font-bold", PLATFORM_COLORS[platform])}>
                      {platform}
                    </span>
                  </div>
                  <ol className="mb-3 space-y-1">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] text-muted-foreground">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-foreground/50">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <button
                    onClick={() => handleCopy(`platform-${platform}`, card.promptText)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.04] px-4 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-primary/[0.08]"
                  >
                    <ClipboardCopy className="h-4 w-4 text-primary" />
                    {guide.cta}
                    {copied === `platform-${platform}` && <Check className="h-4 w-4 text-emerald-500" />}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          {card.tokenCount && (
            <span className="text-[13px] text-muted-foreground/50">
              {"~"}{card.tokenCount.toLocaleString()}{" tokens"}
            </span>
          )}
          <button
            onClick={onClose}
            className="ml-auto flex items-center gap-1.5 text-[14px] font-medium text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            {"Collapse"}
            <ChevronDown className="h-4 w-4 rotate-180" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Outcome card (horizontal scroll version) ─────────────────────────

function OutcomeCardView({
  card,
  accentColor,
  custom,
  gridMode,
}: {
  card: OutcomeCard
  accentColor: string
  custom?: boolean
  gridMode?: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card transition-all flex flex-col",
        expanded ? "border-border shadow-md" : "border-border hover:border-border/60 hover:shadow-sm",
        !gridMode && "w-[320px] shrink-0 snap-start",
        gridMode && "w-full"
      )}
    >
      <div className="flex-1 p-5">
        {custom && (
          <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[13px] font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {"Custom"}
          </span>
        )}
        <h4 className="text-lg font-semibold leading-snug text-foreground">{card.headline}</h4>
        <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{card.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {card.tags.map((t) => (
            <SectionTag key={t.name} name={t.name} count={t.count} />
          ))}
          <PlatformBadge platform={card.platform} />
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[16px] font-semibold transition-colors"
          style={{
            background: expanded ? "hsl(var(--muted))" : accentColor + "18",
            color: expanded ? "hsl(var(--muted-foreground))" : accentColor,
          }}
        >
          {expanded ? (
            <>{"Close"}<ChevronDown className="h-4 w-4 rotate-180" /></>
          ) : (
            <>{"Get This"}<ChevronRight className="h-4 w-4" /></>
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <GetThisPanel card={card} onClose={() => setExpanded(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Locked card ────────────────────────────────────────────────────────

function LockedCardView({
  card,
  accentColor,
  gridMode,
}: {
  card: LockedOutcomeCard
  accentColor: string
  gridMode?: boolean
}) {
  const [unlockOpen, setUnlockOpen] = useState(false)

  return (
    <div className={cn(
      "rounded-2xl border border-dashed border-border bg-card/50 p-5 flex flex-col",
      !gridMode && "w-[320px] shrink-0 snap-start",
      gridMode && "w-full"
    )}>
      <div className="flex items-start gap-3 flex-1">
        <div
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: accentColor + "15" }}
        >
          <Lock className="h-4 w-4" style={{ color: accentColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-lg font-semibold text-foreground/40">{card.headline}</h4>
          <p className="mt-1 text-[15px] text-muted-foreground/50 italic leading-relaxed">
            {"\u201C"}{card.description}{"\u201D"}
          </p>
          <p className="mt-2 text-[14px] font-medium text-muted-foreground/60">
            {card.unlockLabel}
          </p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {unlockOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <CaptureInput
                animate={false}
                vaultLabel={card.unlockSection}
                placeholder={`Adding ${card.unlockSection} \u2014 so AI can help with tailored prompts`}
                onSubmit={() => setUnlockOpen(false)}
              />
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setUnlockOpen(true)}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed text-[16px] font-semibold transition-colors hover:bg-muted"
            style={{ color: accentColor, borderColor: accentColor + "40" }}
          >
            <Plus className="h-4 w-4" />
            {"Unlock This"}
          </button>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Generate more card ────────────────────────────────────────────────

function GenerateMoreCard({
  categoryName,
  accentColor,
  gridMode,
  onGenerate,
  generating,
}: {
  categoryName: string
  accentColor: string
  gridMode?: boolean
  onGenerate: () => void
  generating: boolean
}) {
  return (
    <button
      onClick={onGenerate}
      disabled={generating}
      className={cn(
        "rounded-2xl border border-dashed border-border bg-card/30 flex flex-col items-center justify-center gap-3 p-5 transition-colors hover:bg-muted/40 disabled:opacity-40",
        !gridMode && "w-[320px] shrink-0 snap-start min-h-[200px]",
        gridMode && "w-full min-h-[200px]"
      )}
    >
      {generating ? (
        <>
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
          <span className="text-[16px] font-semibold text-muted-foreground/60">{"Generating..."}</span>
        </>
      ) : (
        <>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: accentColor + "12" }}
          >
            <Sparkles className="h-5 w-5" style={{ color: accentColor }} />
          </div>
          <span className="text-[16px] font-semibold text-muted-foreground/70">
            {"Generate more ideas"}
          </span>
          <span className="text-[14px] text-muted-foreground/40">{categoryName}</span>
        </>
      )}
    </button>
  )
}

// ── Horizontal scroll row (Netflix-style) ─────────────────────────────

function CategoryRow({ category }: { category: OutcomeCategory }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState(false)

  const handleGenMore = () => {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 2000)
  }

  return (
    <section className="space-y-3">
      {/* Category header */}
      <div className="flex items-center gap-3 px-1">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: category.accentColor + "15", color: category.accentColor }}
        >
          {category.icon}
        </div>
        <div>
          <p className="text-xl font-bold" style={{ color: category.accentColor }}>
            {category.name.toUpperCase()}
          </p>
          <p className="text-[16px] text-muted-foreground">{category.tagline}</p>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {category.cards.map((card) =>
          card.locked ? (
            <LockedCardView key={card.id} card={card} accentColor={category.accentColor} />
          ) : (
            <OutcomeCardView key={card.id} card={card} accentColor={category.accentColor} />
          )
        )}
        <GenerateMoreCard
          categoryName={category.name}
          accentColor={category.accentColor}
          onGenerate={handleGenMore}
          generating={generating}
        />
      </div>
    </section>
  )
}

// ── Category grid (when specific tab selected) ────────────────────────

function CategoryGrid({ category }: { category: OutcomeCategory }) {
  const [generating, setGenerating] = useState(false)

  const handleGenMore = () => {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 2000)
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: category.accentColor + "15", color: category.accentColor }}
        >
          {category.icon}
        </div>
        <div>
          <p className="text-xl font-bold" style={{ color: category.accentColor }}>
            {category.name.toUpperCase()}
          </p>
          <p className="text-[16px] text-muted-foreground">{category.tagline}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {category.cards.map((card) =>
          card.locked ? (
            <LockedCardView key={card.id} card={card} accentColor={category.accentColor} gridMode />
          ) : (
            <OutcomeCardView key={card.id} card={card} accentColor={category.accentColor} gridMode />
          )
        )}
        <GenerateMoreCard
          categoryName={category.name}
          accentColor={category.accentColor}
          gridMode
          onGenerate={handleGenMore}
          generating={generating}
        />
      </div>
    </section>
  )
}

// ── Generated result card ──────────────────────────────────────────────

function GeneratedResultCard({
  text,
  onDismiss,
  onSave,
}: {
  text: string
  onDismiss: () => void
  onSave: () => void
}) {
  const syntheticCard: OutcomeCard = {
    id: "generated",
    headline: "Wedding Catering Proposal",
    description: "For Sweet Crumb Bakery \u2014 sourdough, croissants, lavender scones, chocolate ganache",
    tags: [{ name: "Recipes", count: 4 }, { name: "Equipment", count: 4 }, { name: "Staff", count: 2 }],
    platform: "Any",
    promptText: text,
    tokenCount: 2600,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="relative"
    >
      <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <OutcomeCardView card={syntheticCard} accentColor="#7C3AED" custom gridMode />
      <div className="mt-3 flex items-center justify-between px-1">
        <button
          onClick={onSave}
          className="flex items-center gap-2 text-[14px] font-medium text-primary/60 transition-colors hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          {"Save to library"}
        </button>
        <button
          onClick={onDismiss}
          className="flex items-center gap-1.5 text-[14px] text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          {"Dismiss"}
        </button>
      </div>
    </motion.div>
  )
}

// ── Custom prompt builder ──────────────────────────────────────────────

function PromptBuilder({
  onResult,
}: {
  onResult: (text: string) => void
}) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [phIdx, setPhIdx] = useState(0)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (focused) return
    const i = setInterval(() => setPhIdx((p) => (p + 1) % BUILDER_PLACEHOLDERS.length), 3000)
    return () => clearInterval(i)
  }, [focused])

  const handleSubmit = () => {
    if (!value.trim() || loading) return
    setLoading(true)
    setTimeout(() => {
      onResult(
        "Write a wedding catering proposal for Sweet Crumb Bakery. Include our artisan sourdough, croissants ($4.50), lavender scones, and chocolate ganache (60% Valrhona). We have a blast chiller and tempering machine. Staff: 3 full-time bakers. Open Tue\u2013Sat 6am\u20133pm, weekend prep available."
      )
      setLoading(false)
      setValue("")
    }, 2200)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-2 shadow-sm transition-shadow focus-within:shadow-md">
      <div className="relative">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          rows={2}
          className="w-full resize-none rounded-xl bg-transparent px-4 py-3 text-[16px] text-foreground placeholder:text-transparent focus:outline-none"
          style={{ minHeight: "80px" }}
          aria-label="What do you want AI to help with today?"
        />
        {!value && (
          <div className="pointer-events-none absolute inset-0 flex items-start px-4 py-3">
            <AnimatePresence mode="wait">
              <motion.span
                key={phIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-[16px] text-muted-foreground/50"
              >
                {BUILDER_PLACEHOLDERS[phIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-2 pb-1.5">
        <span className="pl-2 text-[14px] text-muted-foreground/50">
          {"Roget builds a tailored prompt from your vault data"}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || loading}
          className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors disabled:opacity-30"
          style={{ background: value.trim() ? BRAND_GRADIENT : "hsl(var(--muted))" }}
          aria-label="Generate prompt"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Send className={cn("h-4 w-4", value.trim() ? "text-white" : "text-muted-foreground/40")} />
          )}
        </button>
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────

export function PromptsTab() {
  const [generatedResult, setGeneratedResult] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const filteredCategories = activeTab === "all"
    ? CATEGORIES
    : CATEGORIES.filter((c) => c.id === activeTab)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Page header */}
      <div>
        <h2 className="text-[28px] font-bold leading-tight text-foreground">
          {"What do you want AI to help with today?"}
        </h2>
        <p className="mt-1.5 text-[16px] leading-relaxed text-muted-foreground">
          {"Every idea below is built from your real vault data \u2014 your products, prices, equipment, and staff."}
        </p>
      </div>

      {/* Custom prompt builder */}
      <PromptBuilder onResult={(text) => setGeneratedResult(text)} />

      {/* Generated result */}
      <AnimatePresence>
        {generatedResult && (
          <GeneratedResultCard
            text={generatedResult}
            onDismiss={() => setGeneratedResult(null)}
            onSave={() => setGeneratedResult(null)}
          />
        )}
      </AnimatePresence>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-[15px] font-semibold transition-colors",
              activeTab === tab.id
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category rows or grid */}
      <div className="space-y-8">
        {filteredCategories.map((category) =>
          activeTab === "all" ? (
            <CategoryRow key={category.id} category={category} />
          ) : (
            <CategoryGrid key={category.id} category={category} />
          )
        )}
      </div>

      {/* Bottom note */}
      <p className="pb-4 text-center text-[14px] text-muted-foreground/50">
        {"As you add more to your vault, new ideas will appear."}
      </p>
    </motion.div>
  )
}
