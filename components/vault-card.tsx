"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Sparkles, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Vault {
  id: string
  name: string
  icon: LucideIcon
  color: string
  description: string
  promptCount?: number
  nudge?: string
}

export function VaultCard({
  vault,
  index,
  onClick,
  onPromptsTap,
}: {
  vault: Vault
  index: number
  onClick?: () => void
  onPromptsTap?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      className="group/card h-full cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300",
        "min-h-[220px] bg-card",
        hovered
          ? "border-foreground/12 shadow-xl shadow-foreground/[0.04]"
          : "border-border/50 shadow-sm"
      )}>
        {/* Colored left accent strip */}
        <div
          className="absolute left-0 top-0 h-full w-[3px] transition-opacity duration-300"
          style={{ backgroundColor: vault.color, opacity: hovered ? 0.8 : 0.35 }}
        />

        {/* Subtle top glow on hover */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
          style={{
            background: `radial-gradient(ellipse 70% 100% at 30% 0%, ${vault.color}08, transparent)`,
          }}
        />

        <div className="flex flex-1 flex-col p-6 pl-7">
          {/* Header: icon + name + arrow */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background"
              style={{ boxShadow: `0 0 0 1px ${vault.color}15` }}
            >
              <vault.icon className="h-[18px] w-[18px]" style={{ color: vault.color }} />
            </div>
            <h3 className="min-w-0 flex-1 truncate text-[17px] font-semibold text-card-foreground leading-snug">
              {vault.name}
            </h3>
            <ArrowUpRight
              className={cn(
                "h-4 w-4 shrink-0 transition-all duration-200",
                hovered ? "text-foreground/40 translate-x-0.5 -translate-y-0.5" : "text-transparent"
              )}
            />
          </div>

          {/* Description */}
          <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
            {vault.description}
          </p>

          {/* Spacer for consistent card height */}
          <div className="flex-1 min-h-4" />

          {/* Bottom indicators -- stacked vertically */}
          <div className="mt-4 flex flex-col gap-2">
            {vault.promptCount && vault.promptCount > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); onPromptsTap?.() }}
                className="flex items-center gap-1.5 text-[13px] font-medium text-primary/60 transition-colors hover:text-primary"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{vault.promptCount}{" prompts available"}</span>
              </button>
            )}
            {vault.nudge && (
              <span className="flex items-center gap-2 text-[13px] text-amber-600/70 dark:text-amber-400/70">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/60" />
                {vault.nudge}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
