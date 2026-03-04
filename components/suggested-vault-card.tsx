"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, X, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)"

export interface SuggestedVault {
  id: string
  name: string
  icon: LucideIcon
  reason: string
  /** Optional cross-vault connection label, e.g. "Connects: Bakery + Allergies" */
  connection?: string
}

export function SuggestedVaultCard({
  vault,
  index,
  onDismiss,
}: {
  vault: SuggestedVault
  index: number
  onDismiss: (id: string) => void
}) {
  const [dismissed, setDismissed] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmDelete(true)
  }

  const handleConfirmDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDismissed(true)
    setTimeout(() => onDismiss(vault.id), 300)
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          transition={{ duration: 0.35, delay: index * 0.08 }}
          className="h-full"
        >
          <Card className="group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-foreground/10 hover:shadow-lg hover:shadow-primary/5">
            {/* Gradient accent strip */}
            <div className="h-1 w-full opacity-50" style={{ background: BRAND_GRADIENT }} />

            <CardContent className="relative flex flex-1 flex-col p-5">
              {/* Delete confirmation overlay */}
              <AnimatePresence initial={false}>
                {confirmDelete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-card px-6 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-[15px] font-semibold text-foreground">{"Dismiss this suggestion?"}</p>
                    <p className="text-[13px] text-muted-foreground/70 leading-relaxed">
                      {"Roget suggested "}<span className="font-medium text-foreground">{vault.name}</span>{" based on your vaults."}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(false) }}
                        className="rounded-xl border border-border px-4 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        {"Keep it"}
                      </button>
                      <button
                        onClick={handleConfirmDismiss}
                        className="rounded-xl px-4 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                        style={{ background: "hsl(var(--destructive))" }}
                      >
                        {"Dismiss"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className="absolute right-3 top-4 z-[5] flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/30 transition-colors hover:bg-muted hover:text-muted-foreground/60"
                aria-label={`Dismiss ${vault.name} suggestion`}
              >
                <X className="h-3 w-3" />
              </button>

              {/* Header: icon + label + name */}
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                  <vault.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1 pr-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                      style={{ background: BRAND_GRADIENT }}
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      {"Roget noticed"}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-card-foreground leading-snug text-pretty">
                    {vault.name}
                  </h3>
                </div>
              </div>

              {/* Reason -- the smart cross-vault insight */}
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/60">
                {vault.reason}
              </p>

              {/* Start button */}
              <div className="mt-auto pt-4">
                <button
                  className="group/btn flex w-full items-center justify-between rounded-xl bg-muted/60 px-4 py-2.5 text-[15px] font-medium text-card-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{"Start this vault"}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:text-primary" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
