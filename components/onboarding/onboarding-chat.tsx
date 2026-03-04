"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  FileUp,
  Globe,
  ImageUp,
  LayoutGrid,
  MessageCircle,
  MessageSquarePlus,
  Mic,
  PanelLeftClose,
  Pencil,
  Send,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AgentMessage,
  UserMessage,
  OptionCards,
  SuggestionChips,
  ExtractionCards,
  MultiWorldCards,
  MediaPreview,
  ProcessingIndicator,
  SectionSummaryCard,
  MagicMomentCard,
  KeepGoingSuggestions,
  InlineConfirm,
  VoiceRecordingInline,
  VoiceMessageBubble,
  PhotoUploadMessage,
  PhotoScanningIndicator,
  FileUploadMessage,
  FileReadingIndicator,
  AttachmentPreviewBar,
  DropZoneOverlay,
  ErrorMessage,
  TypingIndicator,
  UrlMessageCard,
  UrlReadingIndicator,
  PhotoAnalysisCards,
  BlockedUrlMessage,
  LinkSuggestionCard,
  type OptionCardItem,
  type SuggestionChip,
  type ExtractedItem,
  type DetectedWorld,
  type SectionStatus,
  type MagicMomentData,
  type KeepGoingItem,
  type Attachment,
  type UrlCardData,
  type PhotoAnalysisItem,
  type BlockedUrlReason,
  type BlockedUrlAction,
} from "./chat-components"
import {
  SECTION_ICON_MAP,
  VAULT_ICON_MAP,
  type LiveVault,
  type LiveEntry,
} from "./live-vault-preview"
import {
  EmbeddedVaultDetail,
  SECTION_VISUALS,
  type Section as VaultSection,
  type Entry as VaultEntry,
  type EmbeddedVaultData,
} from "@/components/vault-detail"
import { CakeSlice, Dumbbell, ShieldCheck, ChefHat, Settings, Truck, Users, Clock, DollarSign } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import {
  NudgeAfterExtraction,
  NudgeMagicMoment,
  NudgeGuestBanner,
  NudgeKeepGoingSave,
} from "@/components/auth/sign-up-nudges"

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)"

// ── Message types ──────────────────────────────────────────────────
type MessageType =
  | { kind: "agent-text"; text: string }
  | { kind: "user-text"; text: string }
  | { kind: "option-cards"; items: OptionCardItem[]; multiSelect?: boolean }
  | { kind: "suggestion-chips"; chips: SuggestionChip[] }
  | { kind: "extraction-cards"; items: ExtractedItem[]; summary?: string }
  | { kind: "multi-world"; worlds: DetectedWorld[] }
  | { kind: "media-preview"; mediaType: "photo" | "file" | "voice"; name?: string; size?: string; thumbnailUrl?: string; duration?: string }
  | { kind: "processing"; text: string }
  | { kind: "section-summary"; vaultName: string; sections: SectionStatus[] }
  | { kind: "magic-moment"; data: MagicMomentData }
  | { kind: "keep-going"; items: KeepGoingItem[] }
  | { kind: "inline-confirm"; items: ExtractedItem[] }
  | { kind: "voice-message"; duration: string; transcript: string }
  | { kind: "photo-upload"; photos: { id: string; url?: string; name: string }[] }
  | { kind: "photo-scanning"; photoUrl?: string; text: string }
  | { kind: "file-upload"; files: { id: string; name: string; size: string; ext: string; pages?: number }[] }
  | { kind: "file-reading"; fileName: string; currentPage?: number; totalPages?: number }
  | { kind: "error"; text: string; hint?: string; retryable?: boolean }
  | { kind: "typing" }
  | { kind: "url-card"; data: UrlCardData }
  | { kind: "url-reading"; domain: string; text: string; pages?: { url: string; done: boolean }[] }
  | { kind: "photo-analysis"; photos: PhotoAnalysisItem[]; summary?: string }
  | { kind: "blocked-url"; reason: BlockedUrlReason; domain: string; message: string; actions?: BlockedUrlAction[] }
  | { kind: "link-suggestion"; businessName: string }

interface ChatMessage {
  id: string
  msg: MessageType
}

// ── Demo data ──────────────────────────────────────────────────────

const INITIAL_CHIPS: SuggestionChip[] = [
  { id: "bakery", label: "My bakery", prefill: "I run a bakery called " },
  { id: "dental", label: "My dental practice", prefill: "I run a dental practice called " },
  { id: "fitness", label: "My fitness goals", prefill: "My fitness goal is " },
  { id: "allergies", label: "My kid's allergies", prefill: "My kid has allergies to " },
  { id: "garden", label: "My garden", prefill: "I have a garden where I grow " },
]

const TOPIC_OPTIONS: OptionCardItem[] = [
  { id: "products", label: "What you make" },
  { id: "team", label: "Your team" },
  { id: "equipment", label: "Your equipment" },
  { id: "prices", label: "Your prices" },
]

const MULTI_WORLDS: DetectedWorld[] = [
  { id: "bakery", emoji: "\uD83E\uDDC1", name: "Sweet Crumb Bakery", description: "your business", itemCount: 3, defaultChecked: true },
  { id: "allergies", emoji: "\uD83C\uDFE5", name: "Amir's Food Allergies", description: "your son's health", itemCount: 1, defaultChecked: true },
  { id: "fitness", emoji: "\uD83D\uDCAA", name: "Fitness Journey", description: "your personal goal", itemCount: 1, defaultChecked: false },
]

const PRODUCT_EXTRACTIONS: ExtractedItem[] = [
  { id: "e1", content: "Sourdough loaf \u2014 signature item, long ferment, $8 retail", confidence: "high", source: "text" },
  { id: "e2", content: "Croissants \u2014 classic butter, laminated dough", confidence: "high", source: "text" },
  { id: "e3", content: "Lavender scones \u2014 seasonal special", confidence: "medium", source: "text" },
  { id: "e4", content: "Chocolate ganache tart \u2014 rich, dark chocolate", confidence: "high", source: "text" },
]

const PHOTO_EXTRACTIONS: ExtractedItem[] = [
  { id: "pe1", content: "Bongard deck oven \u2014 2-deck, electric, purchased 2021", confidence: "high", source: "photo" },
  { id: "pe2", content: "Hobart spiral mixer \u2014 20qt, countertop model", confidence: "high", source: "photo" },
  { id: "pe3", content: "Stainless steel prep table \u2014 approximately 6ft", confidence: "medium", source: "photo" },
  { id: "pe4", content: "Wire cooling rack system \u2014 5-tier, mobile", confidence: "medium", source: "photo" },
]

const SECTION_STATUSES: SectionStatus[] = [
  { name: "Products", count: 4, done: true },
  { name: "Equipment", count: 0, done: false },
  { name: "Staff", count: 0, done: false },
  { name: "Hours", count: 0, done: false },
  { name: "Suppliers", count: 0, done: false },
]

const MAGIC_MOMENT: MagicMomentData = {
  promptTitle: "Write a seasonal menu description for your weekend specials",
  promptPreview: "Using your actual products \u2014 sourdough, croissants, lavender scones, and chocolate ganache tart \u2014 AI will write compelling menu copy tailored to Sweet Crumb's artisan voice.",
  fullPrompt: `You are helping Sweet Crumb Bakery, a Portland artisan bakery specializing in sourdough and pastries.\n\nProducts:\n- Sourdough loaf \u2014 signature item, long ferment, $8 retail\n- Croissants \u2014 classic butter, laminated dough\n- Lavender scones \u2014 seasonal special\n- Chocolate ganache tart \u2014 rich, dark chocolate\n\nWrite a warm, inviting weekend specials menu description for their chalkboard. Keep the tone artisan and approachable. Highlight the seasonal lavender scones as the feature item.`,
  highlights: ["Sweet Crumb Bakery", "sourdough", "lavender scones"],
}

const KEEP_GOING_ITEMS: KeepGoingItem[] = [
  { id: "kg1", action: "Upload a photo of your kitchen", unlocks: ["Equipment inventory", "Kitchen layout analysis"] },
  { id: "kg2", action: "Tell me about your team", unlocks: ["Staff scheduling", "Training guides"] },
  { id: "kg3", action: "Share your pricing", unlocks: ["Cost analysis", "Competitive pricing"] },
]

// ── URL demo data ─────────────────────────────────────────────────

const GOOGLE_MAPS_EXTRACTIONS: ExtractedItem[] = [
  { id: "gm1", content: "Sweet Crumb Bakery \u2014 business name confirmed", confidence: "high", source: "text" },
  { id: "gm2", content: "1234 SE Hawthorne Blvd, Portland OR 97214", confidence: "high", source: "text" },
  { id: "gm3", content: "Phone: (503) 555-1234", confidence: "high", source: "text" },
  { id: "gm4", content: "Website: sweetcrumbbakery.com", confidence: "high", source: "text" },
  { id: "gm5", content: "Hours: Tue-Sat 6am-3pm, Sun-Mon closed", confidence: "high", source: "text" },
  { id: "gm6", content: "Categories: Bakery, Coffee shop", confidence: "high", source: "text" },
  { id: "gm7", content: "Rating: 4.7 stars (89 reviews)", confidence: "high", source: "text" },
]

const GOOGLE_MAPS_PHOTOS: PhotoAnalysisItem[] = [
  { id: "gp1", thumbnailUrl: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=300&h=200&fit=crop", label: "Exterior photo", description: "Corner location, brick facade, large window display, hand-painted Sweet Crumb signage", done: true },
  { id: "gp2", thumbnailUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop", label: "Interior photo", description: "Warm lighting, exposed brick walls, 8 cafe tables, counter service, chalkboard menu", done: true },
  { id: "gp3", thumbnailUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop", label: "Display case", description: "4-row pastry display \u2014 croissants, sourdough loaves, scones, tarts", done: true },
  { id: "gp4", thumbnailUrl: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=300&h=200&fit=crop", label: "Product photo", description: "Artisan sourdough loaf, scoring pattern, golden crust", done: true },
]

const GOOGLE_MAPS_VISUAL_SUMMARY = "Sweet Crumb Bakery is a warm, brick-walled corner bakery in Portland with counter service and 8 cafe tables. The display showcases croissants, sourdough loaves, scones, and tarts. Hand-painted signage and chalkboard menus give it an artisan feel."

const WEBSITE_EXTRACTIONS: ExtractedItem[] = [
  { id: "ws1", content: "Artisan bakery specializing in naturally leavened breads and French pastries", confidence: "high", source: "text" },
  { id: "ws2", content: "Sourdough loaf \u2014 signature item, 48-hour ferment, $8 retail", confidence: "high", source: "text" },
  { id: "ws3", content: "Croissants \u2014 classic butter, almond, and chocolate varieties", confidence: "high", source: "text" },
  { id: "ws4", content: "Lavender scones \u2014 seasonal, local lavender from Willamette Valley", confidence: "medium", source: "text" },
  { id: "ws5", content: "Chocolate ganache tart \u2014 dark chocolate, made daily", confidence: "high", source: "text" },
  { id: "ws6", content: "Founded 2019 by Sarah Chen, formerly of Tartine Bakery", confidence: "high", source: "text" },
  { id: "ws7", content: "All flour sourced from Mill Creek Farms, Oregon-grown grain", confidence: "medium", source: "text" },
  { id: "ws8", content: "Catering available \u2014 corporate events, weddings, private dinners", confidence: "medium", source: "text" },
]

const WEBSITE_CRAWL_PAGES = [
  { url: "sweetcrumbbakery.com", done: true },
  { url: "sweetcrumbbakery.com/menu", done: true },
  { url: "sweetcrumbbakery.com/about", done: true },
  { url: "sweetcrumbbakery.com/contact", done: true },
]

const BLOCKED_SOCIAL_ACTIONS: BlockedUrlAction[] = [
  { id: "screenshot", label: "Screenshot your posts", icon: null },
  { id: "captions", label: "Copy your captions", icon: null },
  { id: "describe", label: "Tell me about your style", icon: null },
]

// ═══════════════════════════════════════════════════════════════════
// URL HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function isUrl(text: string): boolean {
  return /^https?:\/\//i.test(text.trim()) || /^(www\.)/i.test(text.trim()) || /\.[a-z]{2,}(\/|$)/i.test(text.trim())
}

function getDomain(url: string): string {
  try {
    let cleaned = url.trim()
    if (!/^https?:\/\//i.test(cleaned)) cleaned = `https://${cleaned}`
    const u = new URL(cleaned)
    return u.hostname.replace(/^www\./, "") + (u.pathname !== "/" ? u.pathname.split("/").slice(0, 2).join("/") : "")
  } catch {
    return url.split("/")[0] || url
  }
}

function isGoogleMapsUrl(url: string): boolean {
  return /google\.\w+\/maps/i.test(url) || /maps\.google/i.test(url) || /goo\.gl\/maps/i.test(url)
}

function isSocialMediaUrl(url: string): boolean {
  return /instagram\.com|facebook\.com|fb\.com|tiktok\.com/i.test(url)
}

function getSocialPlatform(url: string): string {
  if (/instagram/i.test(url)) return "Instagram"
  if (/facebook|fb\./i.test(url)) return "Facebook"
  if (/tiktok/i.test(url)) return "TikTok"
  return "that platform"
}

// ═══════════════════════════════════════════════════════════════════
// INPUT MODE
// ═══════════════════════════════════════════════════════════════════
type InputMode = "text" | "voice" | "link"

// ═══════════════════════════════════════════════════════════════════
// INITIAL VAULT STATE (empty)
// ═══════════════════════════════════════════════════════════════════

function createEmptyVault(id: string, name: string): LiveVault {
  const mapped = VAULT_ICON_MAP[id] || { icon: CakeSlice, color: "#7C3AED" }
  return {
    id,
    name,
    icon: mapped.icon,
    color: mapped.color,
    sections: [],
    itemCount: 0,
  }
}

// ═══════════════════════════════════════════════════════════════════
// CONVERT LiveVault → EmbeddedVaultData for the real vault page
// ═══════════════════════════════════════════════════════════════════

const SOURCE_TO_CAPTURE: Record<string, "text" | "voice" | "photo" | "file"> = {
  text: "text",
  voice: "voice",
  photo: "photo",
  file: "file",
}

function liveVaultToEmbeddedData(vault: LiveVault): EmbeddedVaultData {
  const sections: VaultSection[] = vault.sections.map((ls) => {
    const visuals = SECTION_VISUALS[ls.id]
    return {
      id: ls.id,
      name: ls.name,
      icon: visuals?.icon ?? ls.icon,
      color: visuals?.color ?? ls.color,
      preview: visuals?.preview ?? "",
      suggested: ls.suggested,
      suggestedReason: ls.suggestedReason,
      entries: ls.entries.map((le): VaultEntry => ({
        id: le.id,
        content: le.content,
        captureMethod: SOURCE_TO_CAPTURE[le.source] ?? "text",
        addedAt: "Just now",
        confidence: "high",
      })),
    }
  })

  // Compute capabilities based on what sections exist
  const sectionIds = new Set(vault.sections.filter(s => !s.suggested && s.entries.length > 0).map(s => s.id))
  const unlockedCapabilities: string[] = []
  if (sectionIds.has("recipes") || sectionIds.has("products")) {
    unlockedCapabilities.push("Menu planning", "Recipe development")
  }
  if (sectionIds.has("suppliers")) unlockedCapabilities.push("Supplier emails")
  if (sectionIds.has("staff")) unlockedCapabilities.push("Staff scheduling")
  if (sectionIds.has("equipment")) unlockedCapabilities.push("Equipment descriptions")
  if (unlockedCapabilities.length > 0) unlockedCapabilities.push("Customer communication")

  const lockedCapabilities: { label: string; requires: string }[] = []
  if (!sectionIds.has("pricing")) {
    lockedCapabilities.push({ label: "Cost analysis", requires: "pricing" })
    lockedCapabilities.push({ label: "Competitor comparisons", requires: "pricing" })
  }
  if (!sectionIds.has("instagram")) {
    lockedCapabilities.push({ label: "Instagram captions", requires: "instagram" })
  }
  if (!sectionIds.has("favorites")) {
    lockedCapabilities.push({ label: "Seasonal specials", requires: "favorites" })
  }

  // Depth percent: rough calc based on item count / target
  const depthPercent = Math.min(95, Math.round((vault.itemCount / 15) * 80))

  // Last added entry
  const allEntries = vault.sections.flatMap(s => s.entries)
  const lastEntry = allEntries[allEntries.length - 1]

  return {
    vaultName: vault.name,
    vaultIcon: vault.icon,
    vaultColor: vault.color,
    sections,
    summary: vault.summary,
    itemCount: vault.itemCount,
    depthPercent,
    unlockedCapabilities,
    lockedCapabilities,
    lastAdded: lastEntry ? { label: lastEntry.content.split(" \u2014 ")[0], time: "Just now" } : undefined,
  }
}

// ═══════════════════════════════════════════════════════════════════
// WELCOME PAGE — shown when chat is collapsed and no vault exists
// ═══════════════════════════════════════════════════════════════════

const QUICK_CHIPS = [
  "My bakery",
  "My dental practice",
  "My fitness goals",
  "My kid's allergies",
  "My freelance business",
  "My garden",
]

function WelcomePage({
  onStartTalking,
  onStartWithText,
  onStartWithLink,
  onBack,
  isGuest = false,
}: {
  onStartTalking: () => void
  onStartWithText: (text: string) => void
  onStartWithLink?: () => void
  onBack: () => void
  isGuest?: boolean
}) {
  const { openSignUpModal } = useAuth()
  const cards = [
    {
      icon: MessageCircle,
      title: "Talk to Roget",
      description: "Tell me about your world and I'll build your vault as we talk.",
      buttonLabel: "Start talking",
      action: onStartTalking,
    },
    {
      icon: Globe,
      title: "Paste a link",
      description: "Drop your Google Maps listing, website, or any public page.",
      buttonLabel: "Paste a URL",
      action: () => { onStartTalking(); onStartWithLink?.() },
    },
    {
      icon: LayoutGrid,
      title: "Browse templates",
      description: "Start from a ready-made template for your type of business or project.",
      buttonLabel: "See templates",
      action: onStartTalking,
    },
  ]

  return (
    <div className="flex h-full flex-col overflow-y-auto scrollbar-none">
      {/* Atmosphere gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] overflow-hidden">
        <div
          className="h-full w-full opacity-[0.07]"
          style={{
            background: "linear-gradient(180deg, #7C3AED 0%, #EC4899 35%, #F97316 60%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-[1] mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 md:px-8">
        {/* Roget icon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15">
            <img src="/images/roget-icon.png" alt="Roget" className="h-8 w-8 rounded-xl" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-3 text-center"
        >
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl text-balance">
            {"What do you want AI to know about?"}
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            {"Build a vault \u2014 your knowledge base for any part of your world."}
          </p>
        </motion.div>

        {/* Guest sign-up nudge card — pinned above option cards */}
        {isGuest && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="mt-8 w-full max-w-xl rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl leading-none" aria-hidden="true">{"🔒"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-foreground">
                  {"Your vault disappears when you close this tab"}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {"Sign up to save your work and unlock exports, prompts, and unlimited vaults."}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => openSignUpModal("Save your vault before it disappears.")}
                    className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-[13px] font-semibold text-foreground shadow-sm transition-all hover:shadow-md"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {"Continue with Google"}
                  </button>
                  <button
                    onClick={() => openSignUpModal("Save your vault before it disappears.")}
                    className="text-[13px] font-medium text-primary hover:underline"
                  >
                    {"or sign up with email \u2192"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Option cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-3"
        >
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <button
                key={card.title}
                onClick={card.action}
                className="group flex flex-col items-start rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">{card.title}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary opacity-70 transition-opacity group-hover:opacity-100">
                  {card.buttonLabel}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Quick-start chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => onStartWithText(chip)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground hover:shadow-sm"
            >
              {chip}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Back to dashboard — only for authenticated users */}
      {!isGuest && (
        <div className="relative z-[1] shrink-0 border-t border-border bg-background/60 px-6 py-4 text-center backdrop-blur-sm">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {"Back to dashboard"}
          </button>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SPLIT-VIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function OnboardingChat({
  onComplete,
  initialMessage,
  targetVaultId,
  isGuest = false,
}: {
  onComplete: () => void
  initialMessage?: string
  targetVaultId?: string
  isGuest?: boolean
}) {
  // ── Auth / guest nudge state ──
  const { openSignUpModal, dismissedNudges, dismissNudge, isGuest: authIsGuest } = useAuth()
  const guestMode = isGuest && authIsGuest
  const [nudgeExtractionDismissed, setNudgeExtractionDismissed] = useState(false)
  const [nudgeMagicDismissed, setNudgeMagicDismissed] = useState(false)

  // ── Chat state ──
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [inputMode, setInputMode] = useState<InputMode>("text")
  const [conversationPhase, setConversationPhase] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [dragType, setDragType] = useState<"image" | "file">("file")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const initialMessageHandled = useRef(false)

  // ── Live vault state ──
  const [vaults, setVaults] = useState<LiveVault[]>([])
  const [activeVaultId, setActiveVaultId] = useState<string>("bakery")

  // ── Mobile: vault panel toggle ──
  const [mobileVaultOpen, setMobileVaultOpen] = useState(false)
  // ── Desktop: chat panel collapse (start collapsed if no initial message, welcome page is default) ──
  const [chatCollapsed, setChatCollapsed] = useState(!initialMessage)
  const chatStartedRef = useRef(false)

  const totalItemCount = vaults.reduce((sum, v) => sum + v.itemCount, 0)
  const activeVault = vaults.find((v) => v.id === activeVaultId) ?? vaults[0] ?? null

  // ── Helpers ──
  const addMessage = useCallback((msg: MessageType) => {
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, msg }])
  }, [])

  const removeMessageKind = useCallback((kind: string) => {
    setMessages((prev) => prev.filter((m) => m.msg.kind !== kind))
  }, [])

  // ── Vault mutation helpers ──
  const ensureVault = useCallback((vaultId: string, name: string) => {
    setVaults((prev) => {
      if (prev.find((v) => v.id === vaultId)) return prev
      return [...prev, createEmptyVault(vaultId, name)]
    })
    setActiveVaultId(vaultId)
  }, [])

  const addEntriesToSection = useCallback((
    vaultId: string,
    sectionId: string,
    sectionName: string,
    entries: LiveEntry[]
  ) => {
    setVaults((prev) => prev.map((v) => {
      if (v.id !== vaultId) return v
      const existingSection = v.sections.find((s) => s.id === sectionId)
      const iconData = SECTION_ICON_MAP[sectionId] || { icon: Settings, color: "#6B7280" }

      if (existingSection) {
        return {
          ...v,
          itemCount: v.itemCount + entries.length,
          sections: v.sections.map((s) =>
            s.id === sectionId
              ? { ...s, entries: [...s.entries, ...entries], highlightUntil: Date.now() + 2000 }
              : s
          ),
        }
      }
      return {
        ...v,
        itemCount: v.itemCount + entries.length,
        sections: [
          ...v.sections,
          {
            id: sectionId,
            name: sectionName,
            icon: iconData.icon,
            color: iconData.color,
            entries,
            highlightUntil: Date.now() + 2000,
          },
        ],
      }
    }))
  }, [])

  const updateVaultSummary = useCallback((vaultId: string, summary: string) => {
    setVaults((prev) => prev.map((v) =>
      v.id === vaultId ? { ...v, summary } : v
    ))
  }, [])

  const addSuggestedSection = useCallback((vaultId: string, sectionId: string, name: string, reason: string) => {
    setVaults((prev) => prev.map((v) => {
      if (v.id !== vaultId) return v
      if (v.sections.find((s) => s.id === sectionId)) return v
      const iconData = SECTION_ICON_MAP[sectionId] || { icon: Settings, color: "#6B7280" }
      return {
        ...v,
        sections: [
          ...v.sections,
          {
            id: sectionId,
            name,
            icon: iconData.icon,
            color: iconData.color,
            entries: [],
            suggested: true,
            suggestedReason: reason,
          },
        ],
      }
    }))
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }), 100)
    }
  }, [messages, inputMode])

  // ── Initial script ──
  useEffect(() => {
    const run = async () => {
      if (initialMessage && !initialMessageHandled.current) {
        initialMessageHandled.current = true
        await new Promise((r) => setTimeout(r, 400))
        addMessage({ kind: "agent-text", text: targetVaultId ? "Adding to your vault..." : "What do you want AI to know about?" })
        await new Promise((r) => setTimeout(r, 300))
        addMessage({ kind: "user-text", text: initialMessage })
        setIsProcessing(true)
        await handleTextMessage(initialMessage)
        setIsProcessing(false)
      }
      // No bootstrap when welcome page is showing — user starts on their own terms
    }
    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Start chat from welcome page (greet on first open) ──
  const startChatFromWelcome = useCallback(async (prefillText?: string, activateLinkMode?: boolean) => {
    setChatCollapsed(false)
    if (chatStartedRef.current) {
      if (prefillText) setInputValue(prefillText)
      if (activateLinkMode) setInputMode("link")
      setTimeout(() => inputRef.current?.focus(), 350)
      return
    }
    chatStartedRef.current = true
    await new Promise((r) => setTimeout(r, 350))
    addMessage({ kind: "agent-text", text: "What do you want AI to know about?" })
    await new Promise((r) => setTimeout(r, 300))
    addMessage({ kind: "suggestion-chips", chips: INITIAL_CHIPS })
    if (prefillText) {
      setInputValue(prefillText)
      setTimeout(() => inputRef.current?.focus(), 350)
    } else if (activateLinkMode) {
      setInputMode("link")
      setTimeout(() => inputRef.current?.focus(), 350)
    } else {
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [addMessage])

  // ── Drag-and-drop handlers ──
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
    const types = Array.from(e.dataTransfer.types)
    if (types.includes("Files")) {
      const items = Array.from(e.dataTransfer.items)
      const hasImage = items.some((item) => item.type.startsWith("image/"))
      setDragType(hasImage ? "image" : "file")
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    const newAttachments: Attachment[] = files.map((file, i) => {
      const isImage = file.type.startsWith("image/")
      return {
        id: `att-${Date.now()}-${i}`,
        type: isImage ? "photo" as const : "file" as const,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        url: isImage ? URL.createObjectURL(file) : undefined,
      }
    })

    const oversized = files.find((f) => f.size > 25 * 1024 * 1024)
    if (oversized) {
      addMessage({
        kind: "error",
        text: `That file is too large (${(oversized.size / 1024 / 1024).toFixed(1)}MB). The maximum is 25MB.`,
        hint: "Try a smaller file or compress it first.",
        retryable: false,
      })
      return
    }

    setAttachments((prev) => [...prev, ...newAttachments])
  }, [addMessage])

  // ── File/Photo picker handlers ──
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newAtts: Attachment[] = files.map((file, i) => ({
      id: `att-${Date.now()}-${i}`,
      type: "photo" as const,
      name: file.name,
      url: URL.createObjectURL(file),
    }))
    setAttachments((prev) => [...prev, ...newAtts])
    e.target.value = ""
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const supported = ["pdf", "doc", "docx", "xls", "xlsx", "csv"]

    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase() || ""
      if (!supported.includes(ext)) {
        addMessage({
          kind: "error",
          text: `"${file.name}" isn't a supported file type.`,
          hint: "Try PDF, DOCX, XLSX, or CSV.",
        })
        e.target.value = ""
        return
      }
    }

    const newAtts: Attachment[] = files.map((file, i) => ({
      id: `att-${Date.now()}-${i}`,
      type: "file" as const,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    }))
    setAttachments((prev) => [...prev, ...newAtts])
    e.target.value = ""
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  // ── Voice recording handlers ──
  const handleVoiceStop = async (duration: string, transcript: string) => {
    setInputMode("text")
    setIsProcessing(true)

    addMessage({ kind: "voice-message", duration, transcript })

    await new Promise((r) => setTimeout(r, 800))
    addMessage({ kind: "processing", text: "Extracting knowledge from your voice note..." })
    await new Promise((r) => setTimeout(r, 2200))
    removeMessageKind("processing")
    addMessage({
      kind: "extraction-cards",
      items: PRODUCT_EXTRACTIONS.map((e) => ({ ...e, source: "voice" as const })),
      summary: `${PRODUCT_EXTRACTIONS.length} items captured from voice`,
    })

    // Push to live vault
    ensureVault("bakery", "Sweet Crumb Bakery")
    addEntriesToSection("bakery", "recipes", "Recipes", PRODUCT_EXTRACTIONS.map((e) => ({
      id: `live-${e.id}`,
      content: e.content,
      source: "voice" as const,
      isNew: true,
    })))
    updateVaultSummary("bakery", "Sweet Crumb Bakery is an artisan bakery specializing in sourdough and pastries.")

    await new Promise((r) => setTimeout(r, 600))
    addMessage({ kind: "section-summary", vaultName: "Sweet Crumb Bakery", sections: SECTION_STATUSES })
    await new Promise((r) => setTimeout(r, 500))
    addMessage({ kind: "agent-text", text: "Want to keep going or see what AI can do with this?" })
    setConversationPhase(4)
    setIsProcessing(false)
  }

  const handleVoiceCancel = () => {
    setInputMode("text")
  }

  // ── Handle URL submission ──
  const handleUrlMessage = async (url: string) => {
    const domain = getDomain(url)

    // Show URL card as user message
    addMessage({
      kind: "url-card",
      data: { url, domain, isGoogleMaps: isGoogleMapsUrl(url) },
    })

    // Check for blocked URLs
    if (isSocialMediaUrl(url)) {
      const platform = getSocialPlatform(url)
      await new Promise((r) => setTimeout(r, 600))
      addMessage({
        kind: "blocked-url",
        reason: "social-media",
        domain,
        message: `I can't read ${platform} directly \u2014 they don't allow it. But you can:`,
        actions: BLOCKED_SOCIAL_ACTIONS,
      })
      setIsProcessing(false)
      return
    }

    // Google Maps flow
    if (isGoogleMapsUrl(url)) {
      await new Promise((r) => setTimeout(r, 800))
      addMessage({ kind: "url-reading", domain: "google.com/maps", text: "Reading your Google listing..." })

      // Batch 1: business details
      await new Promise((r) => setTimeout(r, 2500))
      removeMessageKind("url-reading")
      addMessage({
        kind: "extraction-cards",
        items: GOOGLE_MAPS_EXTRACTIONS,
        summary: "7 business details found from your Google listing",
      })

      // Push business details to vault
      ensureVault("bakery", "Sweet Crumb Bakery")
      addEntriesToSection("bakery", "location", "Location & Hours", [
        { id: "gm-loc-1", content: "1234 SE Hawthorne Blvd, Portland OR 97214", source: "text" as const, isNew: true },
        { id: "gm-loc-2", content: "Phone: (503) 555-1234", source: "text" as const, isNew: true },
        { id: "gm-loc-3", content: "Hours: Tue-Sat 6am-3pm, Sun-Mon closed", source: "text" as const, isNew: true },
      ])
      addEntriesToSection("bakery", "about", "About", [
        { id: "gm-about-1", content: "Sweet Crumb Bakery \u2014 Bakery, Coffee shop", source: "text" as const, isNew: true },
        { id: "gm-about-2", content: "Website: sweetcrumbbakery.com", source: "text" as const, isNew: true },
        { id: "gm-about-3", content: "Rating: 4.7 stars (89 reviews)", source: "text" as const, isNew: true },
      ])

      // Batch 2: photo analysis
      await new Promise((r) => setTimeout(r, 1200))
      addMessage({ kind: "processing", text: "Analyzing 4 photos from your listing..." })
      await new Promise((r) => setTimeout(r, 2000))
      removeMessageKind("processing")
      addMessage({
        kind: "photo-analysis",
        photos: GOOGLE_MAPS_PHOTOS,
        summary: GOOGLE_MAPS_VISUAL_SUMMARY,
      })

      // Push visual descriptions to vault
      addEntriesToSection("bakery", "ambiance", "Space & Ambiance", [
        { id: "gm-vis-1", content: "Corner location, brick facade, large window display, hand-painted signage", source: "photo" as const, isNew: true },
        { id: "gm-vis-2", content: "Warm lighting, exposed brick walls, 8 cafe tables, counter service, chalkboard menu", source: "photo" as const, isNew: true },
        { id: "gm-vis-3", content: "4-row pastry display \u2014 croissants, sourdough loaves, scones, tarts", source: "photo" as const, isNew: true },
      ])

      updateVaultSummary("bakery", "Sweet Crumb Bakery is a warm, brick-walled corner bakery at 1234 SE Hawthorne, Portland. Open Tue-Sat 6am-3pm with counter service and 8 cafe tables, rated 4.7 stars. The display showcases croissants, sourdough loaves, scones, and tarts with an artisan feel.")

      await new Promise((r) => setTimeout(r, 800))
      addMessage({
        kind: "agent-text",
        text: "22 items found from your Google listing \u2014 business details plus visual descriptions of your space. Want to keep adding or see what AI can do with this?",
      })

      await new Promise((r) => setTimeout(r, 600))
      addMessage({ kind: "section-summary", vaultName: "Sweet Crumb Bakery", sections: [
        { name: "Location & Hours", count: 3, done: true },
        { name: "About", count: 3, done: true },
        { name: "Space & Ambiance", count: 3, done: true },
        { name: "Products", count: 0, done: false },
        { name: "Staff", count: 0, done: false },
      ]})
      setConversationPhase(4)
      setIsProcessing(false)
      return
    }

    // Generic website flow
    await new Promise((r) => setTimeout(r, 800))
    addMessage({
      kind: "url-reading",
      domain,
      text: `Reading ${domain}...`,
      pages: WEBSITE_CRAWL_PAGES.map((p, i) => ({ ...p, done: i === 0 })),
    })

    // Simulate page crawling progress
    const crawlPageCount = WEBSITE_CRAWL_PAGES.length
    for (let i = 1; i < crawlPageCount; i++) {
      await new Promise((r) => setTimeout(r, 900))
      removeMessageKind("url-reading")
      addMessage({
        kind: "url-reading",
        domain,
        text: `Reading ${domain}...`,
        pages: WEBSITE_CRAWL_PAGES.map((p, j) => ({ ...p, done: j <= i })),
      })
    }

    await new Promise((r) => setTimeout(r, 1200))
    removeMessageKind("url-reading")
    addMessage({
      kind: "extraction-cards",
      items: WEBSITE_EXTRACTIONS,
      summary: `${WEBSITE_EXTRACTIONS.length} items found across ${WEBSITE_CRAWL_PAGES.length} pages on your website`,
    })

    // Push to vault
    ensureVault("bakery", "Sweet Crumb Bakery")
    addEntriesToSection("bakery", "about", "About", [
      { id: "ws-about-1", content: "Artisan bakery specializing in naturally leavened breads and French pastries", source: "text" as const, isNew: true },
      { id: "ws-about-2", content: "Founded 2019 by Sarah Chen, formerly of Tartine Bakery", source: "text" as const, isNew: true },
      { id: "ws-about-3", content: "All flour sourced from Mill Creek Farms, Oregon-grown grain", source: "text" as const, isNew: true },
    ])
    addEntriesToSection("bakery", "recipes", "Products", WEBSITE_EXTRACTIONS.filter(e => e.id.startsWith("ws") && ["ws2", "ws3", "ws4", "ws5"].includes(e.id)).map((e) => ({
      id: `live-${e.id}`,
      content: e.content,
      source: "text" as const,
      isNew: true,
    })))
    addEntriesToSection("bakery", "services", "Services", [
      { id: "ws-svc-1", content: "Catering available \u2014 corporate events, weddings, private dinners", source: "text" as const, isNew: true },
    ])

    updateVaultSummary("bakery", "Sweet Crumb Bakery is an artisan Portland bakery founded by Sarah Chen, specializing in naturally leavened sourdough and French pastries. Flour sourced from Mill Creek Farms. Catering available for events.")

    await new Promise((r) => setTimeout(r, 600))
    addMessage({
      kind: "agent-text",
      text: `${WEBSITE_EXTRACTIONS.length} items found across ${WEBSITE_CRAWL_PAGES.length} pages on your website. Does this look right?`,
    })
    setConversationPhase(4)
    setIsProcessing(false)
  }

  // ── Submit with attachments ──
  const handleSubmit = async () => {
    const text = inputValue.trim()
    const hasAttachments = attachments.length > 0
    if (!text && !hasAttachments) return
    if (isProcessing) return

    // Detect URL in input (either from link mode or pasted URL in text mode)
    if (text && isUrl(text) && !hasAttachments) {
      setIsProcessing(true)
      setInputValue("")
      setInputMode("text")
      await handleUrlMessage(text)
      return
    }

    setIsProcessing(true)
    setInputValue("")

    if (hasAttachments) {
      const photos = attachments.filter((a) => a.type === "photo")
      const files = attachments.filter((a) => a.type === "file")

      if (photos.length > 0) {
        addMessage({
          kind: "photo-upload",
          photos: photos.map((p) => ({ id: p.id, url: p.url, name: p.name })),
        })
      }
      if (files.length > 0) {
        addMessage({
          kind: "file-upload",
          files: files.map((f) => ({
            id: f.id,
            name: f.name,
            size: f.size || "Unknown",
            ext: f.name.split(".").pop()?.toLowerCase() || "pdf",
            pages: f.name.endsWith(".pdf") ? 12 : undefined,
          })),
        })
      }
      if (text) {
        addMessage({ kind: "user-text", text })
      }

      setAttachments([])

      if (photos.length > 0) {
        await new Promise((r) => setTimeout(r, 1000))
        addMessage({ kind: "photo-scanning", photoUrl: photos[0].url, text: `Analyzing ${photos.length > 1 ? `${photos.length} photos` : "your photo"}...` })
        await new Promise((r) => setTimeout(r, 2500))
        removeMessageKind("photo-scanning")
        addMessage({
          kind: "extraction-cards",
          items: PHOTO_EXTRACTIONS,
          summary: `${PHOTO_EXTRACTIONS.length} items found in your photo`,
        })

        // Push to live vault
        ensureVault("bakery", "Sweet Crumb Bakery")
        addEntriesToSection("bakery", "equipment", "Equipment", PHOTO_EXTRACTIONS.map((e) => ({
          id: `live-${e.id}`,
          content: e.content,
          source: "photo" as const,
          isNew: true,
        })))
        updateVaultSummary("bakery", "Sweet Crumb Bakery is an artisan bakery with a Bongard deck oven, blast chiller, and professional equipment.")

        await new Promise((r) => setTimeout(r, 600))
        addMessage({ kind: "agent-text", text: "I spotted some equipment in your photo. Does this look right?" })
        setConversationPhase(4)
      }

      if (files.length > 0 && photos.length === 0) {
        await new Promise((r) => setTimeout(r, 800))
        const firstFile = files[0]
        addMessage({
          kind: "file-reading",
          fileName: firstFile.name,
          totalPages: firstFile.name.endsWith(".pdf") ? 12 : undefined,
        })
        await new Promise((r) => setTimeout(r, 3000))
        removeMessageKind("file-reading")
        addMessage({
          kind: "extraction-cards",
          items: PRODUCT_EXTRACTIONS.map((e) => ({ ...e, source: "file" as const })),
          summary: `${PRODUCT_EXTRACTIONS.length} items extracted from ${firstFile.name}`,
        })

        ensureVault("bakery", "Sweet Crumb Bakery")
        addEntriesToSection("bakery", "recipes", "Recipes", PRODUCT_EXTRACTIONS.map((e) => ({
          id: `live-${e.id}-f`,
          content: e.content,
          source: "file" as const,
          isNew: true,
        })))

        await new Promise((r) => setTimeout(r, 500))
        addMessage({ kind: "agent-text", text: "Here's what I found in your document. Anything to adjust?" })
        setConversationPhase(4)
      }

      setIsProcessing(false)
      return
    }

    addMessage({ kind: "user-text", text })
    await handleTextMessage(text)
    setIsProcessing(false)
  }

  // ── Text conversation engine ──
  const handleTextMessage = async (userText: string) => {
    if (conversationPhase === 0) {
      const isMultiWorld = userText.length > 60 && (
        userText.includes(" and ") || userText.includes(",")
      )

      if (isMultiWorld) {
        await new Promise((r) => setTimeout(r, 800))
        addMessage({ kind: "processing", text: "Analyzing what you shared..." })
        await new Promise((r) => setTimeout(r, 2000))
        removeMessageKind("processing")
        addMessage({ kind: "multi-world", worlds: MULTI_WORLDS })

        // Create multiple vaults
        ensureVault("bakery", "Sweet Crumb Bakery")
        ensureVault("allergies", "Amir's Food Allergies")
        ensureVault("fitness", "Fitness Journey")
        setConversationPhase(1)
      } else {
        ensureVault("bakery", "Sweet Crumb Bakery")
        await new Promise((r) => setTimeout(r, 600))
        const niceName = userText.length < 40 ? userText : "that"
        addMessage({ kind: "agent-text", text: `Nice \u2014 ${niceName}! Tell me more about it.` })

        // Suggest link capture for business-sounding names
        const looksLikeBusiness = /bakery|shop|restaurant|cafe|studio|salon|clinic|practice|store|company|firm/i.test(userText) || userText.includes("I run") || userText.includes("my business")
        if (looksLikeBusiness) {
          await new Promise((r) => setTimeout(r, 500))
          const businessName = niceName.length < 40 ? niceName.replace(/^I run a? ?/i, "").replace(/^my /i, "") : "your business"
          addMessage({ kind: "link-suggestion", businessName })
        }

        await new Promise((r) => setTimeout(r, 400))
        addMessage({ kind: "option-cards", items: TOPIC_OPTIONS, multiSelect: true })
        setConversationPhase(2)
      }
    } else if (conversationPhase === 2 || conversationPhase === 3) {
      await new Promise((r) => setTimeout(r, 600))
      addMessage({ kind: "processing", text: "Extracting knowledge..." })
      await new Promise((r) => setTimeout(r, 2200))
      removeMessageKind("processing")
      addMessage({
        kind: "extraction-cards",
        items: PRODUCT_EXTRACTIONS,
        summary: `${PRODUCT_EXTRACTIONS.length} products mapped`,
      })

      // Push to live vault
      addEntriesToSection("bakery", "recipes", "Recipes", PRODUCT_EXTRACTIONS.map((e) => ({
        id: `live-${e.id}-${Date.now()}`,
        content: e.content,
        source: "text" as const,
        isNew: true,
      })))
      updateVaultSummary("bakery", "Sweet Crumb Bakery is an artisan bakery specializing in sourdough and pastries, with 4 signature products.")

      // Add suggested sections after a beat
      setTimeout(() => {
        addSuggestedSection("bakery", "pricing", "Pricing", "Add your prices for cost analysis and menu planning")
        addSuggestedSection("bakery", "instagram", "Instagram Voice", "Add your brand tone for AI-written captions")
        addSuggestedSection("bakery", "favorites", "Customer Favorites", "Know what sells best for seasonal specials")
      }, 800)

      await new Promise((r) => setTimeout(r, 600))
      addMessage({ kind: "section-summary", vaultName: "Sweet Crumb Bakery", sections: SECTION_STATUSES })
      await new Promise((r) => setTimeout(r, 500))
      addMessage({ kind: "agent-text", text: "Want to keep going or see what AI can do with this?" })
      setConversationPhase(4)
    } else if (conversationPhase === 4) {
      await new Promise((r) => setTimeout(r, 600))
      addMessage({ kind: "processing", text: "Building your first AI prompt..." })
      await new Promise((r) => setTimeout(r, 2000))
      removeMessageKind("processing")
      addMessage({ kind: "magic-moment", data: MAGIC_MOMENT })
      setConversationPhase(5)
      await new Promise((r) => setTimeout(r, 1500))
      addMessage({ kind: "keep-going", items: KEEP_GOING_ITEMS })
    } else {
      await new Promise((r) => setTimeout(r, 600))
      addMessage({ kind: "agent-text", text: "Got it! I've added that to your vault." })
      setConversationPhase(4)
    }
  }

  // Handle option card selections
  const handleOptionSelect = async (ids: string[]) => {
    if (isProcessing) return
    setIsProcessing(true)
    const labels = TOPIC_OPTIONS.filter((o) => ids.includes(o.id)).map((o) => o.label)
    addMessage({ kind: "user-text", text: labels.join(", ") })
    await new Promise((r) => setTimeout(r, 500))
    addMessage({ kind: "agent-text", text: `Great \u2014 let's start with ${labels[0]?.toLowerCase() || "that"}. Tell me everything.` })
    setConversationPhase(3)
    setIsProcessing(false)
  }

  // Handle multi-world confirm
  const handleWorldConfirm = async (ids: string[]) => {
    if (isProcessing) return
    setIsProcessing(true)
    const selectedNames = MULTI_WORLDS.filter((w) => ids.includes(w.id)).map((w) => w.name)
    addMessage({ kind: "user-text", text: `Keep: ${selectedNames.join(", ")}` })
    await new Promise((r) => setTimeout(r, 600))
    addMessage({ kind: "agent-text", text: `Great \u2014 starting with ${selectedNames[0] || "your first world"} since you shared the most about it.` })
    await new Promise((r) => setTimeout(r, 400))
    addMessage({ kind: "option-cards", items: TOPIC_OPTIONS, multiSelect: true })
    setConversationPhase(2)
    setIsProcessing(false)
  }

  // Handle chip selection
  const handleChipSelect = (prefill: string) => {
    setInputValue(prefill)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  // ── Input mode icons ──
  const inputActions = [
    { icon: Pencil, label: "Type",  active: inputMode === "text",  onTap: () => { setInputMode("text"); inputRef.current?.focus() } },
    { icon: Globe,  label: "Link",  active: inputMode === "link",  onTap: () => { setInputMode("link"); setInputValue(""); inputRef.current?.focus() } },
    { icon: Mic,    label: "Voice", active: inputMode === "voice", onTap: () => setInputMode("voice") },
    { icon: ImageUp, label: "Photo", active: false, onTap: () => photoInputRef.current?.click() },
    { icon: FileUp,  label: "File",  active: false, onTap: () => fileInputRef.current?.click() },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex bg-background"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop zone overlay */}
      <DropZoneOverlay active={dragOver} fileType={dragType} />

      {/* Hidden file inputs */}
      <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv" multiple className="hidden" onChange={handleFileSelect} />

      {/* ── LEFT: Chat panel (40% desktop, full on mobile) ── */}
      <div
        className={cn(
          "flex flex-col overflow-hidden transition-all duration-300 ease-in-out md:border-r md:border-border",
          chatCollapsed
            ? "w-full md:w-0 md:min-w-0 md:max-w-0 md:opacity-0 md:border-r-0"
            : "w-full md:w-[42%] md:min-w-[380px] md:max-w-[520px] md:opacity-100"
        )}
      >

        {/* Top bar */}
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
              <img src="/images/roget-icon.png" alt="Roget" className="h-5 w-5 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{"Roget"}</p>
              <p className="text-[11px] text-muted-foreground/60">{"Building your vault"}</p>
            </div>
          </div>
          {/* Only show controls for authenticated users */}
          {!guestMode && (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col items-end gap-0.5 mr-2">
                <p className="text-[11px] font-medium text-muted-foreground/70">{"Your vault is ready"}</p>
              </div>
              <button
                onClick={onComplete}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95"
              >
                {"View dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChatCollapsed(true)}
                className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Collapse chat"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
          )}
        </header>

        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-none">
          <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <div key={message.id}>
                  {message.msg.kind === "agent-text" && <AgentMessage text={message.msg.text} />}
                  {message.msg.kind === "user-text" && <UserMessage text={message.msg.text} />}
                  {message.msg.kind === "option-cards" && <OptionCards items={message.msg.items} multiSelect={message.msg.multiSelect} onSelect={handleOptionSelect} />}
                  {message.msg.kind === "suggestion-chips" && <SuggestionChips chips={message.msg.chips} onSelect={handleChipSelect} />}
                  {message.msg.kind === "extraction-cards" && (
                    <>
                      <ExtractionCards items={message.msg.items} summary={message.msg.summary} />
                      {guestMode && !nudgeExtractionDismissed && (
                        <NudgeAfterExtraction onDismiss={() => setNudgeExtractionDismissed(true)} />
                      )}
                    </>
                  )}
                  {message.msg.kind === "multi-world" && <MultiWorldCards worlds={message.msg.worlds} onConfirm={handleWorldConfirm} />}
                  {message.msg.kind === "media-preview" && <MediaPreview type={message.msg.mediaType} name={message.msg.name} size={message.msg.size} thumbnailUrl={message.msg.thumbnailUrl} duration={message.msg.duration} />}
                  {message.msg.kind === "processing" && <ProcessingIndicator text={message.msg.text} />}
                  {message.msg.kind === "section-summary" && <SectionSummaryCard vaultName={message.msg.vaultName} sections={message.msg.sections} />}
                  {message.msg.kind === "magic-moment" && (
                    <>
                      <MagicMomentCard data={message.msg.data} />
                      {guestMode && !nudgeMagicDismissed && (
                        <NudgeMagicMoment onDismiss={() => setNudgeMagicDismissed(true)} />
                      )}
                    </>
                  )}
                  {message.msg.kind === "keep-going" && (
                    <>
                      <KeepGoingSuggestions items={message.msg.items} onSelect={() => {}} onGoToVault={guestMode ? () => openSignUpModal("Sign up to access your dashboard.") : onComplete} />
                      {guestMode && <NudgeKeepGoingSave />}
                    </>
                  )}
                  {message.msg.kind === "inline-confirm" && <InlineConfirm items={message.msg.items} onConfirmAll={() => {}} />}
                  {message.msg.kind === "voice-message" && <VoiceMessageBubble duration={message.msg.duration} transcript={message.msg.transcript} />}
                  {message.msg.kind === "photo-upload" && <PhotoUploadMessage photos={message.msg.photos} />}
                  {message.msg.kind === "photo-scanning" && <PhotoScanningIndicator photoUrl={message.msg.photoUrl} text={message.msg.text} />}
                  {message.msg.kind === "file-upload" && <FileUploadMessage files={message.msg.files} />}
                  {message.msg.kind === "file-reading" && <FileReadingIndicator fileName={message.msg.fileName} totalPages={message.msg.totalPages} />}
                  {message.msg.kind === "error" && <ErrorMessage text={message.msg.text} hint={message.msg.hint} />}
                  {message.msg.kind === "typing" && <TypingIndicator />}
                  {message.msg.kind === "url-card" && <UrlMessageCard data={message.msg.data} />}
                  {message.msg.kind === "url-reading" && <UrlReadingIndicator domain={message.msg.domain} text={message.msg.text} pages={message.msg.pages} />}
                  {message.msg.kind === "photo-analysis" && <PhotoAnalysisCards photos={message.msg.photos} summary={message.msg.summary} />}
                  {message.msg.kind === "blocked-url" && (
                    <BlockedUrlMessage
                      reason={message.msg.reason}
                      domain={message.msg.domain}
                      message={message.msg.message}
                      actions={message.msg.actions}
                      onActionSelect={(actionId) => {
                        if (actionId === "screenshot") setInputMode("text")
                        else if (actionId === "captions") setInputMode("text")
                        else setInputMode("text")
                      }}
                    />
                  )}
                  {message.msg.kind === "link-suggestion" && (
                    <LinkSuggestionCard
                      businessName={message.msg.businessName}
                      onPasteLink={() => { setInputMode("link"); inputRef.current?.focus() }}
                      onManual={() => { setInputMode("text"); inputRef.current?.focus() }}
                    />
                  )}
                </div>
              ))}
            </AnimatePresence>

            {isProcessing && !messages.some((m) => m.msg.kind === "processing" || m.msg.kind === "typing" || m.msg.kind === "photo-scanning" || m.msg.kind === "file-reading" || m.msg.kind === "url-reading") && (
              <TypingIndicator />
            )}
          </div>
        </div>

        {/* Fixed bottom input */}
        <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="mx-auto max-w-lg px-4 py-3">
            <div className="relative rounded-2xl border border-border bg-card shadow-sm transition-shadow focus-within:shadow-md">
              <AnimatePresence>
                {attachments.length > 0 && (
                  <AttachmentPreviewBar attachments={attachments} onRemove={removeAttachment} />
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {inputMode === "voice" ? (
                  <motion.div key="voice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 py-3">
                    <VoiceRecordingInline onStop={handleVoiceStop} onCancel={handleVoiceCancel} />
                  </motion.div>
                ) : (
                  <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative px-1.5 pt-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }}
                      placeholder={
                        inputMode === "link"
                          ? "Paste a URL \u2014 your website, Google Maps, or any public page"
                          : attachments.length > 0
                            ? "Add a note about your files..."
                            : "Type your message..."
                      }
                      className="w-full rounded-xl bg-transparent px-3 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                      disabled={isProcessing}
                      aria-label={inputMode === "link" ? "Paste a URL" : "Chat message"}
                    />
                    {inputMode === "link" && !inputValue && (
                      <p className="px-3 pb-1 text-[11px] text-muted-foreground/40">
                        {"Try your Google Maps link for an instant head start"}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {inputMode !== "voice" && (
                <div className="flex items-center justify-between px-2 pb-1.5 pt-0.5">
                  <TooltipProvider>
                    <div className="flex items-center gap-0.5">
                      {inputActions.map(({ icon: Icon, label, active, onTap }) => (
                        <Tooltip key={label} delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                                active ? "bg-primary/10 text-primary" : "text-muted-foreground/40 hover:bg-muted hover:text-muted-foreground/70"
                              )}
                              aria-label={label}
                              onClick={(e) => { e.stopPropagation(); onTap() }}
                              disabled={isProcessing}
                            >
                              <Icon className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">{label}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>

                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                    style={{ background: (inputValue.trim() || attachments.length > 0) ? BRAND_GRADIENT : "hsl(var(--muted))" }}
                    aria-label="Send message"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                  >
                    <Send className={cn("h-3.5 w-3.5", (inputValue.trim() || attachments.length > 0) ? "text-white" : "text-muted-foreground/40")} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Real vault page (60% desktop, overlay on mobile) ── */}

      {/* Desktop vault panel - shows welcome until vault has items */}
      {activeVault && totalItemCount > 0 ? (
        <div className="hidden md:flex md:flex-1 md:flex-col bg-muted/30">
          {vaults.length > 1 && (
            <div className="shrink-0 border-b border-border bg-background/80 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                {vaults.map((v) => {
                  const VIcon = v.icon
                  const isActive = v.id === activeVaultId
                  return (
                    <button
                      key={v.id}
                      onClick={() => setActiveVaultId(v.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-card text-foreground shadow-sm border border-border"
                          : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/60"
                      )}
                    >
                      <VIcon className="h-3.5 w-3.5" style={{ color: isActive ? v.color : undefined }} />
                      {v.name}
                      {v.itemCount > 0 && (
                        <span className="text-xs text-muted-foreground/50">{v.itemCount}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          <EmbeddedVaultDetail
            data={liveVaultToEmbeddedData(activeVault)}
            className="flex-1"
            chatCollapsed={chatCollapsed}
            onExpandChat={() => startChatFromWelcome()}
          />
          {/* Guest banner — only shown when vault has content and user hasn't signed up */}
          <AnimatePresence>
            {guestMode && !dismissedNudges.has("tab-overlay") && totalItemCount > 0 && (
              <NudgeGuestBanner />
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="hidden md:flex md:flex-1 md:flex-col bg-background">
          <WelcomePage
            onStartTalking={() => startChatFromWelcome()}
            onStartWithText={(text) => startChatFromWelcome(text)}
            onStartWithLink={() => startChatFromWelcome(undefined, true)}
            onBack={onComplete}
            isGuest={guestMode}
          />
        </div>
      )}

      {/* Mobile: floating vault button */}
      <div className="md:hidden">
        <AnimatePresence>
          {totalItemCount > 0 && !mobileVaultOpen && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileVaultOpen(true)}
              className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-lg"
            >
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {"View your vault"}
              </span>
              <span
                className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white"
                style={{ background: BRAND_GRADIENT }}
              >
                {totalItemCount}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mobile vault overlay */}
        <AnimatePresence>
          {mobileVaultOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex flex-col bg-background"
            >
              {/* Close bar with optional vault switcher */}
              <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
                {vaults.length > 1 ? (
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {vaults.map((v) => {
                      const VIcon = v.icon
                      const isActive = v.id === activeVaultId
                      return (
                        <button
                          key={v.id}
                          onClick={() => setActiveVaultId(v.id)}
                          className={cn(
                            "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                            isActive
                              ? "bg-card text-foreground shadow-sm border border-border"
                              : "text-muted-foreground/60 hover:text-foreground"
                          )}
                        >
                          <VIcon className="h-3 w-3" style={{ color: isActive ? v.color : undefined }} />
                          {v.name}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-foreground">{"Your Vault"}</p>
                )}
                <button
                  onClick={() => setMobileVaultOpen(false)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/40 transition-colors hover:bg-muted hover:text-foreground ml-2"
                  aria-label="Close vault"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {activeVault ? (
                <EmbeddedVaultDetail
                  data={liveVaultToEmbeddedData(activeVault)}
                  className="flex-1"
                />
              ) : (
                <div className="flex flex-1 items-center justify-center px-8 text-center">
                  <p className="text-sm text-muted-foreground/40">{"No items yet. Keep chatting!"}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
