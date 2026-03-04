"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileUp, FolderOpen, Globe, ImageUp, Mic, Pencil, Plus, X, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { LucideIcon } from "lucide-react"

const BRAND_GRADIENT = "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)"

const vaultIdeas = [
  { name: "My bakery" },
  { name: "Supplier contracts" },
  { name: "My kid\u2019s allergies" },
  { name: "Seasonal menu" },
  { name: "Staff schedule" },
]

export interface ProjectOption {
  id: string
  name: string
  icon?: LucideIcon
  color?: string
}

interface CaptureInputProps {
  /** When set, shows a vault context chip inside the card */
  vaultLabel?: string
  /** Icon component to show in the vault chip */
  vaultIcon?: React.ComponentType<{ className?: string }>
  /** Color for the vault chip icon background */
  vaultColor?: string
  /** Custom placeholder (overrides the cycling vault ideas) */
  placeholder?: string
  /** Called when value is submitted */
  onSubmit?: (value: string) => void
  /** Extra class on the outer wrapper */
  className?: string
  /** Whether to animate in on mount */
  animate?: boolean
  /** When true, hides capture mode icons (used on dashboard for a simpler look) */
  minimal?: boolean
  /** Available projects/vaults the user can link to this chat */
  projects?: ProjectOption[]
  /** Called when a project is selected from the dropdown */
  onProjectSelect?: (project: ProjectOption | null) => void
  /** Externally controlled selected project (if controlled) */
  selectedProject?: ProjectOption | null
}

export function CaptureInput({
  vaultLabel,
  vaultIcon: VaultIcon,
  vaultColor,
  placeholder,
  onSubmit,
  className,
  animate = true,
  minimal = false,
  projects = [],
  onProjectSelect,
  selectedProject: controlledProject,
}: CaptureInputProps) {
  const [current, setCurrent] = useState(0)
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState("")
  const [linkMode, setLinkMode] = useState(false)
  const [projectPickerOpen, setProjectPickerOpen] = useState(false)
  const [internalProject, setInternalProject] = useState<ProjectOption | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Use controlled or internal state
  const activeProject = controlledProject !== undefined ? controlledProject : internalProject

  const selectProject = (p: ProjectOption | null) => {
    setInternalProject(p)
    onProjectSelect?.(p)
    setProjectPickerOpen(false)
  }

  useEffect(() => {
    if (focused || placeholder || linkMode) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % vaultIdeas.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [focused, placeholder, linkMode])

  // Close picker on outside click
  useEffect(() => {
    if (!projectPickerOpen) return
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setProjectPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [projectPickerOpen])

  const idea = vaultIdeas[current]

  const toggleVoice = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      return
    }
    setRecordingError(null)
    setLinkMode(false)
    setProjectPickerOpen(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        setIsRecording(false)
        // Blob available for transcription: chunksRef.current
        // For now just signal recording stopped — real transcription would POST to /api/transcribe
      }
      mr.start()
      setIsRecording(true)
    } catch {
      setRecordingError("Microphone access denied")
      setIsRecording(false)
    }
  }

  const inputModes: { icon: LucideIcon; label: string; active: boolean; onTap: () => void }[] = [
    { icon: Pencil,  label: "Type",  active: !linkMode && !isRecording, onTap: () => { setLinkMode(false); setProjectPickerOpen(false); if (isRecording) mediaRecorderRef.current?.stop(); inputRef.current?.focus() } },
    { icon: Globe,   label: "Link",  active: linkMode,  onTap: () => { if (isRecording) mediaRecorderRef.current?.stop(); setLinkMode(true); setProjectPickerOpen(false); inputRef.current?.focus() } },
    { icon: Mic,     label: isRecording ? "Stop recording" : "Voice", active: isRecording, onTap: toggleVoice },
    { icon: ImageUp, label: "Photo", active: false, onTap: () => imageInputRef.current?.click() },
    { icon: FileUp,  label: "File",  active: false, onTap: () => {} },
  ]

  // Only show the project picker button if projects are available
  const showProjectPicker = projects.length > 0

  const handleSubmit = () => {
    if (!value.trim()) return
    onSubmit?.(value.trim())
    setValue("")
    inputRef.current?.blur()
  }

  // Determine the effective label -- selected project overrides vaultLabel
  const effectiveLabel = activeProject?.name ?? vaultLabel
  const EffectiveIcon = activeProject?.icon ?? VaultIcon
  const effectiveColor = activeProject?.color ?? vaultColor

  const inner = (
    <div className={cn("relative", className)}>
      {/* Gradient glow behind the card */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-30 blur-[2px] transition-opacity duration-300"
        style={{ background: BRAND_GRADIENT }}
        aria-hidden="true"
      />
    <div className={cn(
      "relative rounded-2xl border transition-shadow focus-within:shadow-lg focus-within:shadow-primary/10",
      "border-border/40 bg-card shadow-sm",
    )}>
      {/* Hidden image file picker */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif,image/*"
        className="hidden"
        aria-hidden="true"
        onChange={() => {}}
      />

      {/* Vault / project context chip */}
      {effectiveLabel && (
        <div className="flex items-center gap-2 px-3 pt-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 py-1 pl-1.5 pr-2 text-[13px] font-medium text-foreground/80"
          >
            {EffectiveIcon && (
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full"
                style={{ backgroundColor: effectiveColor ? `${effectiveColor}20` : "hsl(var(--muted))" }}
              >
                <EffectiveIcon className="h-2.5 w-2.5" style={{ color: effectiveColor ?? "hsl(var(--muted-foreground))" } as React.CSSProperties} />
              </span>
            )}
            {effectiveLabel}
            {/* Remove button -- only for project picker selections */}
            {activeProject && (
              <button
                onClick={(e) => { e.stopPropagation(); selectProject(null) }}
                className="ml-0.5 rounded-full p-0.5 text-muted-foreground/40 transition-colors hover:bg-muted hover:text-muted-foreground/70"
                aria-label={`Remove ${activeProject.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        </div>
      )}

      {/* Text input */}
      <div className="relative px-1.5 pt-1">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }}
          className="w-full rounded-xl bg-transparent px-3 py-3 text-[15px] text-foreground placeholder:text-transparent focus:outline-none md:text-base"
          aria-label={effectiveLabel ? `Add to ${effectiveLabel}` : "Map your world"}
        />

        {/* Animated / static placeholder — hidden during voice mode or when link helper is showing */}
        {!value && !isRecording && !recordingError && !linkMode && (
          <div className="pointer-events-none absolute inset-0 flex items-center px-3">
            {placeholder ? (
              <span className="truncate text-[15px] text-muted-foreground/50 md:text-base">
                {placeholder}
              </span>
            ) : effectiveLabel ? (
              <span className="truncate text-[15px] text-muted-foreground/50 md:text-base">
                {`Add to ${effectiveLabel}\u2026`}
              </span>
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={current}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="truncate text-[15px] text-muted-foreground/50 md:text-base"
                >
                  {"Map your world: "}{idea.name}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        )}

        {/* Link mode input placeholder */}
        {!value && linkMode && !isRecording && !recordingError && (
          <div className="pointer-events-none absolute inset-0 flex items-center px-3">
            <span className="truncate text-[15px] text-muted-foreground/50 md:text-base">
              {"Paste a URL \u2014 your website, Google Maps, or any public page"}
            </span>
          </div>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 px-3 pb-2">
            <motion.div
              className="h-2 w-2 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-[13px] font-medium text-red-500">{"Recording... tap mic to stop"}</span>
          </div>
        )}

        {/* Mic error */}
        {recordingError && (
          <p className="px-3 pb-2 text-[13px] text-destructive">{recordingError}</p>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-2 pb-2 pt-0.5">
        <TooltipProvider>
          <div className="flex items-center gap-1">
            {inputModes.map(({ icon: Icon, label, active, onTap }) => (
              <Tooltip key={label} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground/35 hover:bg-muted hover:text-muted-foreground/70"
                    )}
                    aria-label={label}
                    onClick={(e) => { e.stopPropagation(); onTap() }}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[13px]">{label}</TooltipContent>
              </Tooltip>
            ))}

            {/* Project picker button */}
            {showProjectPicker && (
              <div ref={pickerRef} className="relative">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                        projectPickerOpen
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground/35 hover:bg-muted hover:text-muted-foreground/70"
                      )}
                      aria-label="Select existing project"
                      onClick={(e) => { e.stopPropagation(); setProjectPickerOpen((v) => !v) }}
                    >
                      <FolderOpen className="h-[18px] w-[18px]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-[13px]">{"Existing project"}</TooltipContent>
                </Tooltip>

                {/* Project dropdown */}
                <AnimatePresence>
                  {projectPickerOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                    >
                      <div className="px-3 py-2.5 border-b border-border">
                        <p className="text-[13px] font-semibold text-foreground">{"Select a project"}</p>
                        <p className="text-[12px] text-muted-foreground/60">{"Link this chat to an existing vault"}</p>
                      </div>
                      <div className="max-h-60 overflow-y-auto py-1">
                        {projects.map((project) => {
                          const PIcon = project.icon
                          const isSelected = activeProject?.id === project.id
                          return (
                            <button
                              key={project.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                selectProject(isSelected ? null : project)
                              }}
                              className={cn(
                                "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                                isSelected
                                  ? "bg-primary/5 text-foreground"
                                  : "text-foreground/80 hover:bg-muted/60"
                              )}
                            >
                              {PIcon && (
                                <span
                                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                                  style={{ backgroundColor: project.color ? `${project.color}15` : "hsl(var(--muted))" }}
                                >
                                  <PIcon
                                    className="h-3.5 w-3.5"
                                    style={{ color: project.color ?? "hsl(var(--muted-foreground))" } as React.CSSProperties}
                                  />
                                </span>
                              )}
                              <span className="flex-1 truncate text-[14px] font-medium">{project.name}</span>
                              {isSelected && (
                                <Check className="h-4 w-4 shrink-0 text-primary" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </TooltipProvider>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ background: value.trim() ? BRAND_GRADIENT : "hsl(var(--muted))" }}
          aria-label={effectiveLabel ? `Add to ${effectiveLabel}` : "Create vault"}
          onClick={handleSubmit}
        >
          <Plus className={cn("h-4 w-4", value.trim() ? "text-white" : "text-muted-foreground/40")} />
        </button>
      </div>
    </div>
    </div>
  )

  if (!animate) return inner

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="w-full"
    >
      {inner}
    </motion.div>
  )
}
