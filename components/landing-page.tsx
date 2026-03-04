"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Globe,
  LayoutGrid,
  X,
  Zap,
  Shield,
  Download,
  FileText,
  Mic,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CaptureInput } from "@/components/capture-input"

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED 0%, #EC4899 55%, #F97316 100%)"
const BRAND_GRADIENT_VIVID = "linear-gradient(135deg, #8B5CF6 0%, #EC4899 40%, #F97316 75%, #FBBF24 100%)"

// ── Fade in on scroll ──────────────────────────────────────────────
function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Animated subtitle cycling ─────────────────────────────────────
const ROTATING_LINES = [
  "Skip re-explaining yourself. Every. Single. Time.",
  "First response. Actually usable.",
  "Stop telling ChatGPT your business. It should already know.",
  "No more generic advice. No more made-up facts.",
  "3 minutes to build. Every AI conversation improved forever.",
]

function AnimatedSubtitle() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ROTATING_LINES.length), 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative h-[28px] sm:h-[32px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-x-0 text-center text-[15px] leading-relaxed text-muted-foreground sm:text-[17px]"
        >
          {ROTATING_LINES[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// ── AI tool SVG logos (official paths) ────────────────────────────
function ChatGPTLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  )
}

function ClaudeLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.709 15.955l4.71-2.644.08-.23-.08-.127h-.237l-.789-.049-2.69-.071-2.334-.098-2.26-.12-.572-.122L0 11.965l.054-.352.481-.321.684.06 1.516.103 2.273.158 1.648.096 2.442.255h.389l.054-.158-.134-.097-.102-.096-2.352-1.595-2.546-1.684-1.332-.97-.722-.491-.365-.46-.156-1.005.653-.722.879.06 1.546 1.048 2.506 1.644 1.788 1.224 2.033 1.413.237.06.049-.073-.049-.134-1.168-2.14L7.15 4.3l-.632-1.37-.353-.83-.025-.747.433-.743.81-.176.72.376.886 1.593.997 2.107.83 1.675.936 2.11.134.243.098-.012.025-.091.012-2.449.146-2.48.158-1.51.134-1.194.23-.64.81-.452.699.146.407.528.054.936-.085 1.55-.195 2.382-.352 3.024-.158 2.037-.049.35.085.073.098-.049.134-.364.79-1.205 1.638-1.504 1.522-.684.267-.267.073.061.11.243-.061 1.07-.158 2.176-.237 1.054-.102 1.546-.109 3.008-.316.789-.52.474-.636-.08-.484.32-.329-.745-.329-1.474.321-1.92.389-1.925.316-1.53.285-1.898.17-.632-.013-.042-.14.018-1.431 1.964-2.176 2.94-1.722 1.843-.412.164-.717-.371.067-.66.4-.587 2.382-3.032 1.437-1.877.926-1.085-.006-.158h-.054l-6.326 4.11-1.126.146-.486-.454.06-.744.231-.243 1.903-1.308z" />
    </svg>
  )
}

function GeminiLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12" />
    </svg>
  )
}

function CopilotLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.886.007A12.076 12.076 0 000 12.03a11.95 11.95 0 004.66 9.526l.342.236v-6.1a4.006 4.006 0 01.09-.799c.074-.404.227-.789.451-1.135a4.14 4.14 0 01.388-.49L8.81 9.91A8.21 8.21 0 0112 9.478a8.21 8.21 0 013.19.431l2.878 3.358c.15.157.28.33.389.49a3.78 3.78 0 01.541 1.934v6.1l.342-.235A11.95 11.95 0 0024 12.031 12.076 12.076 0 0011.886.007z" />
      <path d="M9.27 14.074l-2.395-2.8a6.47 6.47 0 015.129-2.12 6.47 6.47 0 015.128 2.12l-2.395 2.8a3.3 3.3 0 00-2.733-1.25 3.3 3.3 0 00-2.734 1.25z" />
      <path d="M5.492 21.068v-5.376a2.64 2.64 0 01.04-.432c.035-.21.116-.41.238-.585.1-.155.228-.293.375-.408l1.754-2.05L12 17.1l4.1-4.883 1.755 2.05c.147.115.274.253.375.408.122.176.203.376.238.585.025.14.039.285.04.432v5.376A11.9 11.9 0 0112 23.96a11.9 11.9 0 01-6.508-2.893z" />
    </svg>
  )
}

function PerplexityLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.383 21.01V14.04H1.455V9.3h3.928V2.99l5.18 4.762h2.888L18.617 2.99V9.3h3.928v4.74h-3.928v6.97l-5.204-4.784h-2.826zm1.728-1.593l3.453-3.17h3.914l3.794 3.488V14.04h-4.204V9.3h4.204V7.04l-3.645 3.351h-4.062L6.92 7.113V9.3h4.133v4.74H6.92v5.377z" />
    </svg>
  )
}

// ── Floating mesh particles ───────────────────────────────────────
function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + i * 4,
            height: 6 + i * 4,
            left: `${10 + i * 18}%`,
            top: `${15 + (i % 3) * 28}%`,
            background: i % 3 === 0 ? "#7C3AED" : i % 3 === 1 ? "#EC4899" : "#F97316",
            opacity: 0.15,
          }}
          animate={{
            y: [0, -25 - i * 5, 0],
            x: [0, 8 + i * 3, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  )
}

// ── Sticky nav with real Roget logo ───────────────────────────────
function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/20 bg-background/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        <Image
          src="/images/roget-colored.png"
          alt="Roget"
          width={200}
          height={56}
          className="h-10 w-auto"
          priority
        />
        <Link
          href="/signin"
          className="rounded-xl border border-border/60 bg-card px-5 py-2.5 text-[15px] font-semibold text-foreground transition-all hover:border-primary/30 hover:shadow-md"
        >
          {"Sign in"}
        </Link>
      </div>
    </header>
  )
}

// ── Hero ───────────────────────────────────────────────────────────
function Hero({ onEnterApp }: { onEnterApp: (msg?: string) => void }) {
  const suggestions = [
    "My bakery",
    "My dental practice",
    "My fitness goals",
    "My kid's allergies",
    "My freelance rates",
    "My rental property",
  ]

  return (
    <section className="relative overflow-hidden pb-12 pt-14 md:pb-16 md:pt-20">
      {/* Vibrant hero gradient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 20% 0%, rgba(124,58,237,0.22) 0%, transparent 55%),
            radial-gradient(ellipse 70% 60% at 80% 10%, rgba(236,72,153,0.18) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 50% 70%, rgba(249,115,22,0.12) 0%, transparent 45%),
            radial-gradient(ellipse 40% 30% at 10% 90%, rgba(124,58,237,0.10) 0%, transparent 40%),
            radial-gradient(ellipse 35% 25% at 90% 80%, rgba(236,72,153,0.06) 0%, transparent 35%)
          `,
        }}
        aria-hidden="true"
      />
      <FloatingParticles />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-[5] opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(hsl(263 70% 58%) 1px, transparent 1px), linear-gradient(90deg, hsl(263 70% 58%) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Static headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="text-balance text-[40px] font-bold leading-[1.08] tracking-tight text-foreground md:text-[56px] lg:text-[64px]"
        >
          {"AI doesn\u2019t know you."}
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT_VIVID }}>
            {"Let\u2019s fix that."}
          </span>
        </motion.h1>

        {/* Animated subtitle cycling */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-5 max-w-lg"
        >
          <AnimatedSubtitle />
        </motion.div>

        {/* CaptureInput as main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-8 max-w-2xl"
        >
          <CaptureInput
            animate={false}
            onSubmit={(text) => onEnterApp(text)}
            placeholder="Build your AI knowledge base in 3 minutes"
          />
        </motion.div>

        {/* Suggestion chips - single row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="mt-4 flex items-center justify-center gap-2 overflow-x-auto scrollbar-none"
        >
          <span className="shrink-0 text-[13px] text-muted-foreground/50">{"Try:"}</span>
          {suggestions.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + i * 0.04 }}
              onClick={() => onEnterApp(s)}
              className="shrink-0 rounded-full border border-border/60 bg-card/80 px-3 py-1 text-[12px] font-medium text-foreground/70 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground hover:shadow-md hover:shadow-primary/10"
            >
              {s}
            </motion.button>
          ))}
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-5 text-[13px] text-muted-foreground/40"
        >
          {"No sign up needed \u00B7 Free to start \u00B7 Export in one click"}
        </motion.p>
      </div>
    </section>
  )
}

// ── Logos strip with real SVG marks ────────────────────────────────
function LogosStrip() {
  const logos = [
    { name: "ChatGPT", Icon: ChatGPTLogo, color: "#10A37F" },
    { name: "Claude", Icon: ClaudeLogo, color: "#D97757" },
    { name: "Gemini", Icon: GeminiLogo, color: "#8E75B2" },
    { name: "Copilot", Icon: CopilotLogo, color: "#0078D4" },
    { name: "Perplexity", Icon: PerplexityLogo, color: "#20808D" },
  ]

  return (
    <FadeIn>
      <div
        className="relative border-y border-border/40 py-8"
        style={{
          background: `
            radial-gradient(ellipse 80% 100% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 80% at 80% 50%, rgba(236,72,153,0.03) 0%, transparent 50%)
          `,
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6">
          <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">
            {"Works with your favorite AI tools"}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map(({ name, Icon, color }) => (
              <motion.div
                key={name}
                className="group flex items-center gap-2.5"
                whileHover={{ scale: 1.06, y: -1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Icon className="h-6 w-6 text-muted-foreground/40 transition-colors group-hover:text-[var(--hover-color)]" style={{ "--hover-color": color } as React.CSSProperties} />
                <span className="text-[15px] font-medium text-muted-foreground/40 transition-colors group-hover:text-foreground/70">
                  {name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

// ── Comparison ─────────────────────────────────────────────────────
function ComparisonSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20" id="features">
      {/* Multi-point brand gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 85% 20%, rgba(124,58,237,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 15% 60%, rgba(236,72,153,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 40% 35% at 50% 90%, rgba(249,115,22,0.06) 0%, transparent 45%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-6">
        <FadeIn className="mb-10 text-center">
          <span className="mb-3 inline-block text-[12px] font-semibold uppercase tracking-widest text-primary">
            {"The difference"}
          </span>
          <h2 className="text-balance text-[30px] font-bold leading-tight text-foreground md:text-[40px]">
            {"See what "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
              {"personalized AI"}
            </span>
            {" looks like"}
          </h2>
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Without */}
          <FadeIn delay={0.05}>
            <div className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                  <X className="h-4 w-4 text-destructive" />
                </div>
                <span className="text-[15px] font-semibold text-muted-foreground">{"Without Roget"}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="rounded-2xl bg-muted/50 px-4 py-3">
                  <p className="text-[14px] text-foreground/60">{"\u201CWrite Instagram captions for my bakery\u201D"}</p>
                </div>
                <div className="rounded-2xl bg-muted/30 px-4 py-3">
                  <p className="text-[14px] leading-relaxed text-muted-foreground">
                    {"\u201C1. Fresh bread daily! Come visit us! \u2728 2. Nothing beats fresh pastries! 3. Start your morning right!\u201D"}
                  </p>
                </div>
              </div>
              <p className="mt-auto text-[13px] font-medium text-destructive/60">
                {"Generic. Could be any bakery on earth."}
              </p>
            </div>
          </FadeIn>

          {/* With - gradient border */}
          <FadeIn delay={0.15}>
            <motion.div
              className="rounded-3xl p-[2px] shadow-2xl shadow-primary/15"
              style={{ background: BRAND_GRADIENT }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex h-full flex-col gap-4 rounded-[calc(1.5rem-2px)] bg-card p-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-[15px] font-semibold text-primary">{"With Roget"}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="rounded-2xl bg-muted/50 px-4 py-3">
                    <p className="text-[14px] text-foreground/60">{"\u201CWrite Instagram captions for this week\u201D"}</p>
                  </div>
                  <div className="rounded-2xl px-4 py-3" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(236,72,153,0.04))" }}>
                    <p className="text-[14px] leading-relaxed text-foreground/80">
                      {"\u201CTuesday sourdough almost gone \u2014 our 78% hydration loaves with 18-hour cold ferment sell out by 10am. $8 while they last. Only at Sweet Crumb, Tue\u2013Sat 6am\u20133pm.\u201D"}
                    </p>
                  </div>
                </div>
                <p className="mt-auto text-[13px] font-semibold text-primary">
                  {"Specific. Personal. Actually useful."}
                </p>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ── Vault stories — lifestyle editorial ──────────────────────────
const VAULT_STORIES = [
  {
    img: "/images/vault-stories/bakery.jpg",
    name: "Fatima",
    role: "Bakery owner",
    built: "Her full bakery \u2014 menu, suppliers, equipment, team",
    result: "AI writes her Instagram captions using her real recipes and prices",
  },
  {
    img: "/images/vault-stories/guitar-teacher.jpg",
    name: "James",
    role: "Guitar teacher",
    built: "His 23 students \u2014 skill levels, lesson history, goals",
    result: "AI generates personalized practice plans for each student",
  },
  {
    img: "/images/vault-stories/caregiver.jpg",
    name: "Priya",
    role: "Daughter & caregiver",
    built: "Her dad\u2019s health \u2014 medications, allergies, doctors, appointments",
    result: "AI answers drug interaction questions she can actually trust",
  },
  {
    img: "/images/vault-stories/food-truck.jpg",
    name: "Marcus",
    role: "Food truck owner",
    built: "His menu, route schedule, truck maintenance",
    result: "AI plans weekly specials based on what sold best",
  },
  {
    img: "/images/vault-stories/novelist.jpg",
    name: "Sofia",
    role: "Novelist",
    built: "Her characters, plot threads, world-building, timeline",
    result: "AI keeps her story consistent across 400 pages",
  },
  {
    img: "/images/vault-stories/dog-breeder.jpg",
    name: "Yuki",
    role: "Shiba Inu breeder",
    built: "Each dog \u2014 vet records, lineage, temperament, buyer matches",
    result: "AI helps her match puppies to the right families",
  },
  {
    img: "/images/vault-stories/trainer.jpg",
    name: "David",
    role: "Personal trainer",
    built: "15 clients \u2014 goals, injuries, equipment, progress",
    result: "AI writes custom workout programs that actually fit",
  },
  {
    img: "/images/vault-stories/mom.jpg",
    name: "Amara",
    role: "Mom",
    built: "Her son\u2019s food allergies \u2014 safe brands, school protocols, emergency contacts",
    result: "AI generates safe meal plans and travel checklists",
  },
  {
    img: "/images/vault-stories/dj.jpg",
    name: "Ray",
    role: "DJ",
    built: "His music library \u2014 BPM, energy, crowd reactions, set history",
    result: "AI suggests setlists for different venue types",
  },
  {
    img: "/images/vault-stories/homeowners.jpg",
    name: "Tom & Alex",
    role: "Homeowners",
    built: "Their renovation \u2014 contractor quotes, materials, dimensions, timeline",
    result: "AI drafts emails to contractors using real specs",
  },
]

function VaultStoriesSection({ onEnterApp }: { onEnterApp: () => void }) {
  const CARD_WIDTH = 320  // px — matches w-[320px] below
  const GAP = 20          // px — gap-5
  const CARDS_PER_VIEW = 4

  // All stories + 1 CTA slot
  const totalItems = VAULT_STORIES.length + 1
  const totalPages = Math.ceil(totalItems / CARDS_PER_VIEW)

  const [page, setPage] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)

  // Scroll container to the right position for a given page
  const scrollToPage = (p: number) => {
    const el = scrollRef.current
    if (!el) return
    const pageWidth = (CARD_WIDTH + GAP) * CARDS_PER_VIEW
    el.scrollTo({ left: p * pageWidth, behavior: "smooth" })
    setPage(p)
  }

  // Sync page state when user scrolls manually (trackpad / mouse)
  const handleScroll = () => {
    if (isScrolling.current) return
    const el = scrollRef.current
    if (!el) return
    const pageWidth = (CARD_WIDTH + GAP) * CARDS_PER_VIEW
    const newPage = Math.round(el.scrollLeft / pageWidth)
    setPage(Math.min(newPage, totalPages - 1))
  }

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      {/* Warm gradient bg */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 25% 30%, rgba(124,58,237,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 75% 70%, rgba(249,115,22,0.06) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Header row with title + pagination controls */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
          <FadeIn className="text-center sm:text-left">
            <span className="mb-3 inline-block text-[12px] font-semibold uppercase tracking-widest text-primary">
              {"Real people, real vaults"}
            </span>
            <h2 className="text-balance text-[30px] font-bold leading-tight text-foreground md:text-[40px]">
              {"People are building vaults for "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
                {"everything"}
              </span>
            </h2>
          </FadeIn>

          {totalPages > 1 && (
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={() => scrollToPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous stories"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToPage(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === page ? "w-4 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"
                    )}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => scrollToPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next stories"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Single scrollable track — full-bleed so first/last cards can peek at edges */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 scrollbar-none"
        style={{ paddingLeft: "max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))", paddingRight: 24 }}
      >
        {VAULT_STORIES.map((story, i) => (
          <motion.div
            key={story.name}
            className="group w-[320px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/10"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative h-[200px] overflow-hidden">
              <Image
                src={story.img}
                alt={`${story.name}, ${story.role}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <p className="text-[14px] font-semibold text-white drop-shadow-md">
                  {story.name}
                  <span className="ml-1.5 font-normal text-white/80">{"\u00B7 " + story.role}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <p className="text-[13px] font-medium leading-snug text-foreground">{story.built}</p>
              <p className="text-[13px] leading-snug text-primary/80">
                {"\u201C" + story.result + "\u201D"}
              </p>
            </div>
          </motion.div>
        ))}

        {/* CTA card */}
        <motion.div
          className="flex w-[320px] shrink-0 snap-start flex-col items-center justify-center gap-5 rounded-2xl p-10"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(236,72,153,0.04), rgba(249,115,22,0.04))",
            border: "1px dashed hsl(var(--border))",
            minHeight: 360,
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))" }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-[22px] font-bold text-foreground">{"What will you build?"}</h3>
          <p className="text-center text-[14px] text-muted-foreground">
            {"Join thousands building personal knowledge vaults"}
          </p>
          <button
            onClick={onEnterApp}
            className="mt-1 rounded-xl px-6 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            style={{ background: BRAND_GRADIENT }}
          >
            {"Start your vault"}
          </button>
        </motion.div>
      </div>
    </section>
  )
}

// ── Features ─────────��────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: MessageSquare, label: "Talk, type, or drop files", desc: "Tell Roget about your world however feels natural \u2014 voice, text, photos, URLs, or files.", color: "#7C3AED" },
    { icon: Zap, label: "Instant structure", desc: "AI extracts facts and organizes them into a clean knowledge vault automatically.", color: "#EC4899" },
    { icon: Globe, label: "Any public URL", desc: "Drop a Google Maps listing, website, or menu link. Roget reads it for you.", color: "#F97316" },
    { icon: Download, label: "One-click export", desc: "Export your vault as a knowledge file or prompt to any AI tool instantly.", color: "#7C3AED" },
    { icon: Shield, label: "Always yours", desc: "Your knowledge base lives with you. Use it in any tool, any time.", color: "#EC4899" },
    { icon: LayoutGrid, label: "Ready-made templates", desc: "Start from a bakery, clinic, freelancer, or fitness vault \u2014 then make it yours.", color: "#F97316" },
  ]

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      {/* Vibrant gradient band behind features */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,58,237,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(249,115,22,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 20% 20%, rgba(236,72,153,0.06) 0%, transparent 45%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-6">
        <FadeIn className="mb-10 text-center">
          <span className="mb-3 inline-block text-[12px] font-semibold uppercase tracking-widest text-primary">
            {"Features"}
          </span>
          <h2 className="text-balance text-[30px] font-bold leading-tight text-foreground md:text-[40px]">
            {"Everything you need, "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
              {"nothing you don\u2019t"}
            </span>
          </h2>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeIn key={f.label} delay={i * 0.06}>
              <motion.div
                className="flex h-full flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 transition-shadow"
                whileHover={{ y: -3, boxShadow: `0 16px 32px -10px ${f.color}20` }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${f.color}18, ${f.color}08)` }}
                >
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground">{f.label}</h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How it works ───────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      n: "01",
      title: "Tell Roget about your world",
      body: "Type, talk, upload photos, drop files, or paste your Google Maps link. Any format works.",
      icon: Mic,
      color: "#7C3AED",
    },
    {
      n: "02",
      title: "Roget organizes everything",
      body: "AI extracts the key facts and builds a structured, editable knowledge vault in seconds.",
      icon: Sparkles,
      color: "#EC4899",
    },
    {
      n: "03",
      title: "Use it in any AI tool",
      body: "Export to ChatGPT, Claude, Gemini, or any prompt. AI finally knows you.",
      icon: Download,
      color: "#F97316",
    },
  ]

  return (
    <section
      className="relative overflow-hidden py-16 md:py-20"
      id="how-it-works"
      style={{
        background: `
          linear-gradient(180deg, hsl(250 12% 95% / 0.4) 0%, hsl(0 0% 98%) 100%),
          radial-gradient(ellipse 60% 40% at 30% 20%, rgba(124,58,237,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 70% 80%, rgba(249,115,22,0.05) 0%, transparent 50%)
        `,
      }}
    >
      <div className="mx-auto max-w-5xl px-6">
        <FadeIn className="mb-12 text-center">
          <span className="mb-3 inline-block text-[12px] font-semibold uppercase tracking-widest text-primary">
            {"Three steps"}
          </span>
          <h2 className="text-balance text-[30px] font-bold text-foreground md:text-[40px]">
            {"How it works"}
          </h2>
        </FadeIn>

        <div className="relative grid gap-6 md:grid-cols-3">
          {/* Connector line */}
          <div className="pointer-events-none absolute left-[calc(16.66%)] right-[calc(16.66%)] top-[40px] hidden h-[2px] md:block" style={{ background: BRAND_GRADIENT, opacity: 0.15 }} aria-hidden="true" />

          {steps.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="relative mb-5 flex h-[80px] w-[80px] items-center justify-center rounded-3xl text-white shadow-xl"
                  style={{ background: BRAND_GRADIENT, boxShadow: `0 14px 28px -8px ${step.color}40` }}
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-card text-[11px] font-bold text-foreground shadow-md ring-2 ring-background">
                    {step.n}
                  </span>
                </motion.div>
                <h3 className="mb-2 text-[17px] font-semibold text-foreground">{step.title}</h3>
                <p className="max-w-[260px] text-[14px] leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ────────────────────────────────────────────────────────
function PricingSection() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      desc: "Start immediately, no card needed",
      features: ["1 vault", "50 entries", "All export formats", "Normal prompts"],
      cta: "Start free",
      highlight: false,
    },
    {
      name: "Personal",
      price: "$7",
      period: "/mo",
      annual: "Billed $84/yr",
      desc: "For individuals who want more",
      features: ["5 vaults", "Unlimited entries", "All export formats", "Smart prompts", "Ready-made templates"],
      cta: "Get Personal",
      highlight: true,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/mo",
      annual: "Billed $228/yr",
      desc: "Teams and power users",
      features: ["Unlimited vaults", "Unlimited entries", "All export formats", "Smart prompts", "Custom templates", "Priority AI", "Team sharing"],
      cta: "Get Pro",
      highlight: false,
    },
  ]

  return (
    <section className="relative overflow-hidden py-16 md:py-20" id="pricing">
      {/* Multi-point brand gradient wash */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 20% 70%, rgba(236,72,153,0.07) 0%, transparent 50%),
            radial-gradient(ellipse 40% 35% at 80% 80%, rgba(249,115,22,0.06) 0%, transparent 45%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-6">
        <FadeIn className="mb-10 text-center">
          <span className="mb-3 inline-block text-[12px] font-semibold uppercase tracking-widest text-primary">
            {"Pricing"}
          </span>
          <h2 className="text-[30px] font-bold text-foreground md:text-[40px]">
            {"Simple, honest pricing"}
          </h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {"Start free. Upgrade when you need more."}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground/60">
            {"Prices shown are billed annually"}
          </p>
        </FadeIn>

        <div className="grid items-stretch gap-5 sm:grid-cols-3">
          {tiers.map((tier, i) => (
            <FadeIn key={tier.name} delay={i * 0.08} className="flex">
              {tier.highlight ? (
                <motion.div
                  className="w-full rounded-3xl p-[2px] shadow-2xl shadow-primary/15"
                  style={{ background: BRAND_GRADIENT }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative flex h-full flex-col gap-4 rounded-[calc(1.5rem-2px)] bg-card p-6">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white" style={{ background: BRAND_GRADIENT }}>
                      {"Most popular"}
                    </div>
                    <PricingContent tier={tier} highlight />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="flex h-full w-full flex-col gap-4 rounded-3xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <PricingContent tier={tier} highlight={false} />
                </motion.div>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingContent({
  tier,
  highlight,
}: {
  tier: { name: string; price: string; period?: string; annual?: string; desc: string; features: string[]; cta: string }
  highlight: boolean
}) {
  return (
    <>
      <div>
        <p className={cn("text-[14px] font-semibold", highlight ? "text-primary" : "text-muted-foreground")}>{tier.name}</p>
        <div className="mt-1.5 flex items-end gap-1">
          <span className="text-[36px] font-bold tracking-tight text-foreground">{tier.price}</span>
          {tier.period && <span className="mb-1.5 text-[14px] text-muted-foreground">{tier.period}</span>}
        </div>
        {tier.annual && <p className="mt-0.5 text-[11px] text-muted-foreground/60">{tier.annual}</p>}
        <p className="mt-1 text-[13px] text-muted-foreground">{tier.desc}</p>
      </div>

      <ul className="flex flex-1 flex-col gap-2.5">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[13px] text-foreground/80">
            <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", highlight ? "text-primary" : "text-muted-foreground/50")} />
            {f}
          </li>
        ))}
      </ul>

      <button
        className={cn(
          "mt-auto w-full rounded-xl py-2.5 text-[14px] font-semibold transition-all",
          highlight
            ? "text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            : "border border-border bg-muted/40 text-foreground hover:bg-muted"
        )}
        style={highlight ? { background: BRAND_GRADIENT } : {}}
      >
        {tier.cta}
      </button>
    </>
  )
}

// ── Final CTA ───────────────────────────────────────────────────��──
function FinalCTA({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Bold brand gradient — dashboard-style warmth */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 30%, rgba(124,58,237,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 25% 70%, rgba(236,72,153,0.14) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 75% 60%, rgba(249,115,22,0.12) 0%, transparent 45%),
            radial-gradient(ellipse 30% 25% at 60% 10%, rgba(124,58,237,0.06) 0%, transparent 35%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-3xl px-6 text-center">
        <FadeIn>
          <Image
            src="/images/roget-colored-icon.png"
            alt="Roget"
            width={64}
            height={64}
            className="mx-auto mb-5 h-16 w-16"
          />
          <h2 className="text-[30px] font-bold text-foreground md:text-[40px]">
            {"Ready to build your vault?"}
          </h2>
          <p className="mt-3 text-[16px] text-muted-foreground">
            {"No sign up. No credit card. 3 minutes to your first vault."}
          </p>
          <motion.button
            onClick={onEnterApp}
            className="mt-7 inline-flex items-center gap-2.5 rounded-2xl px-8 py-3.5 text-[15px] font-semibold text-white shadow-xl shadow-primary/25"
            style={{ background: BRAND_GRADIENT }}
            whileHover={{ scale: 1.04, boxShadow: "0 20px 40px -10px rgba(124,58,237,0.35)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="h-4.5 w-4.5" />
            {"Try Roget free"}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </FadeIn>
      </div>
    </section>
  )
}

// ── Footer with real logo ──────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 sm:flex-row">
        <Image
          src="/images/roget-colored.png"
          alt="Roget"
          width={90}
          height={30}
          className="h-7 w-auto"
        />
        <p className="text-[12px] text-muted-foreground/50">{"\u00A9 2026 Roget. Build AI that actually knows you."}</p>
        <div className="flex gap-5">
          {["Privacy", "Terms"].map((l) => (
            <a key={l} href="#" className="text-[12px] text-muted-foreground/50 hover:text-foreground transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ── Root export ────────────────────────────────────────────────────
export function LandingPage({ onEnterApp }: { onEnterApp: (msg?: string) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero onEnterApp={onEnterApp} />
        <LogosStrip />
        <ComparisonSection />
        <VaultStoriesSection onEnterApp={() => onEnterApp()} />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <FinalCTA onEnterApp={() => onEnterApp()} />
      </main>
      <Footer />
    </div>
  )
}
