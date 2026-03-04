"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, FolderOpen, Plus, X, type LucideIcon } from "lucide-react"
import { CaptureInput } from "@/components/capture-input"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────────

interface VaultOption {
  id: string
  name: string
  icon: LucideIcon
  color: string
}

interface NewVaultModalProps {
  open: boolean
  onClose: () => void
  vaults?: VaultOption[]
  onStartChat?: (initialMessage?: string, targetVaultId?: string) => void
}

// ── Component ────────────────────────────────────────────────────────

export function NewVaultModal({ open, onClose, vaults = [], onStartChat }: NewVaultModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const [selectedVault, setSelectedVault] = useState<VaultOption | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedVault(null)
      setPickerOpen(false)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pickerOpen) {
          setPickerOpen(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose, pickerOpen])

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    window.addEventListener("mousedown", handler)
    return () => window.removeEventListener("mousedown", handler)
  }, [pickerOpen])

  const isUpdate = selectedVault !== null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={backdropRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={(e) => {
            if (e.target === backdropRef.current) onClose()
          }}
        >
          {/* Animated gradient mesh background */}
          <div className="absolute inset-0 overflow-hidden bg-background/80 backdrop-blur-xl">
            {/* Top-left warm blob */}
            <motion.div
              className="absolute -left-[15%] -top-[15%] h-[70vh] w-[70vh] rounded-full opacity-[0.15]"
              style={{
                background:
                  "radial-gradient(circle, #EC4899 0%, #F97316 40%, transparent 70%)",
              }}
              animate={{
                x: [0, 40, -20, 0],
                y: [0, 30, -10, 0],
                scale: [1, 1.08, 0.95, 1],
              }}
              transition={{
                duration: 18,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            {/* Centre purple blob */}
            <motion.div
              className="absolute left-[30%] top-[20%] h-[60vh] w-[60vh] rounded-full opacity-[0.12]"
              style={{
                background:
                  "radial-gradient(circle, #7C3AED 0%, #A855F7 40%, transparent 70%)",
              }}
              animate={{
                x: [0, -30, 20, 0],
                y: [0, -25, 15, 0],
                scale: [1, 1.05, 0.97, 1],
              }}
              transition={{
                duration: 22,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            {/* Bottom-right warm blob */}
            <motion.div
              className="absolute -bottom-[10%] right-[5%] h-[55vh] w-[55vh] rounded-full opacity-[0.13]"
              style={{
                background:
                  "radial-gradient(circle, #F97316 0%, #EC4899 40%, transparent 70%)",
              }}
              animate={{
                x: [0, -35, 15, 0],
                y: [0, 20, -30, 0],
                scale: [1, 0.96, 1.06, 1],
              }}
              transition={{
                duration: 20,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            {/* Subtle noise texture */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            onClick={onClose}
            className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/80 text-muted-foreground/60 backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </motion.button>

          {/* Centered content */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="relative z-10 w-full max-w-xl px-6"
          >
            {/* Heading — dynamic based on mode */}
            <div className="mb-6 text-center">
              <AnimatePresence mode="wait" initial={false}>
                {isUpdate ? (
                  <motion.div
                    key="update"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${selectedVault.color}15` }}
                      >
                        <selectedVault.icon className="h-4 w-4 text-foreground" />
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {"Add to "}{selectedVault.name}
                    </h2>
                    <p className="mt-2 text-base text-muted-foreground">
                      {"Type anything to add knowledge to this vault."}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="create"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {"Create a new vault"}
                    </h2>
                    <p className="mt-2 text-base text-muted-foreground">
                      {"Name your vault and start mapping what matters."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vault picker + CaptureInput */}
            <div className="relative">
              {/* Vault selector row */}
              {vaults.length > 0 && (
                <div className="mb-3 flex items-center justify-center">
                  <div className="relative" ref={pickerRef}>
                    <button
                      onClick={() => setPickerOpen((v) => !v)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all",
                        isUpdate
                          ? "border-primary/30 bg-primary/5 text-foreground"
                          : "border-border bg-card/80 text-muted-foreground hover:bg-card hover:text-foreground"
                      )}
                    >
                      {isUpdate ? (
                        <>
                          <selectedVault.icon className="h-3.5 w-3.5" />
                          <span className="font-medium">{selectedVault.name}</span>
                        </>
                      ) : (
                        <>
                          <FolderOpen className="h-3.5 w-3.5" />
                          <span>{"Add to existing vault"}</span>
                        </>
                      )}
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 transition-transform duration-200",
                          pickerOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {pickerOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 top-full z-20 mt-1.5 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10"
                        >
                          {/* New vault option */}
                          <button
                            onClick={() => {
                              setSelectedVault(null)
                              setPickerOpen(false)
                            }}
                            className={cn(
                              "flex w-full items-center gap-3 px-3.5 py-2.5 text-sm transition-colors hover:bg-muted/60",
                              !isUpdate && "bg-muted/40"
                            )}
                          >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                              <Plus className="h-3.5 w-3.5 text-primary" />
                            </span>
                            <div className="text-left">
                              <p className="font-medium text-foreground">
                                {"Create new vault"}
                              </p>
                            </div>
                          </button>

                          <div className="mx-3 border-t border-border" />

                          {/* Existing vaults */}
                          <div className="max-h-64 overflow-y-auto py-1">
                            {vaults.map((v) => {
                              const Icon = v.icon
                              const active = selectedVault?.id === v.id
                              return (
                                <button
                                  key={v.id}
                                  onClick={() => {
                                    setSelectedVault(v)
                                    setPickerOpen(false)
                                  }}
                                  className={cn(
                                    "flex w-full items-center gap-3 px-3.5 py-2.5 text-sm transition-colors hover:bg-muted/60",
                                    active && "bg-muted/40"
                                  )}
                                >
                                  <span
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                                    style={{ backgroundColor: `${v.color}15` }}
                                  >
                                    <Icon className="h-3.5 w-3.5 text-foreground" />
                                  </span>
                                  <p className="truncate font-medium text-foreground">
                                    {v.name}
                                  </p>
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              <CaptureInput
                placeholder={
                  isUpdate
                    ? `Add to ${selectedVault.name}...`
                    : "e.g. Sweet Crumb Bakery, Supplier contracts..."
                }
                onSubmit={(text) => {
                  if (onStartChat) {
                    onStartChat(text, selectedVault?.id)
                  } else {
                    onClose()
                  }
                }}
                animate={false}
                className="shadow-lg shadow-black/5"
              />
            </div>

            {/* Hint */}
            <p className="mt-4 text-center text-xs text-muted-foreground/50">
              {"Press "}
              <kbd className="rounded border border-border/50 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium">
                {"Enter"}
              </kbd>
              {isUpdate ? " to add" : " to create"}
              {" or "}
              <kbd className="rounded border border-border/50 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium">
                {"Esc"}
              </kbd>
              {" to cancel"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
