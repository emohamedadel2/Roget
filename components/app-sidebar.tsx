"use client"

import { useState, createContext, useContext } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Gift,
  Menu,
  Plus,
  Search,
  Settings,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMobile } from "@/components/ui/use-mobile"
import { NotificationPanel } from "@/components/notification-panel"
import { NewVaultModal } from "@/components/new-vault-modal"

// ── Types ───────────────────────────────────────────────────────────

interface SidebarVault {
  id: string
  name: string
  icon: LucideIcon
  color: string
}

interface VaultNavItem {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

// ── Sidebar inner content ───────────────────────────────────────────

function SidebarInner({
  vaults,
  collapsed,
  onToggle,
  showToggle,
  onBellClick,
  notifOpen,
  onNewVault,
  vaultNav,
  activeVaultId,
  activeVaultNav,
  onVaultNavChange,
  onBackToDashboard,
}: {
  vaults: SidebarVault[]
  collapsed: boolean
  onToggle: () => void
  showToggle: boolean
  onBellClick: () => void
  notifOpen: boolean
  onNewVault: () => void
  vaultNav?: VaultNavItem[]
  activeVaultId?: string
  activeVaultNav?: string
  onVaultNavChange?: (id: string) => void
  onBackToDashboard?: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      {/* ── Logo + New Vault ─────────────────────────────────── */}
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-sidebar-border",
          collapsed ? "h-16 justify-center px-3" : "h-16 justify-between px-4"
        )}
      >
        {!collapsed ? (
          <>
            <Image
              src="/images/roget-logo-colored.png"
              alt="Roget"
              width={160}
              height={40}
              className="h-9 w-auto"
              priority
            />
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={onNewVault}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  aria-label="Add New Vault"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {"Add New Vault"}
              </TooltipContent>
            </Tooltip>
          </>
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Image
                src="/images/roget-icon.png"
                alt="Roget"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {"Roget"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* ── Search ──────────────────────────────────────────────── */}
      <div className="px-3 pt-3">
        <SidebarItem
          icon={<Search className="h-4 w-4" />}
          label="Search"
          collapsed={collapsed}
          onClick={() => {}}
        />
      </div>

      {/* ── Vault context nav (when inside a vault) ──────────── */}
      {vaultNav && vaultNav.length > 0 && (
        <>
          <Separator className="mx-3 my-3 w-auto bg-sidebar-border" />
          <div className="px-3">
            {/* Back to all vaults — expanded only */}
            {!collapsed && (
              <button
                onClick={onBackToDashboard}
                className="mb-2 flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
              >
                <ArrowLeft className="h-3 w-3" />
                {"All vaults"}
              </button>
            )}
            {/* Active vault header */}
            {activeVaultId && (
              (() => {
                const av = vaults.find(v => v.id === activeVaultId)
                if (!av) return null
                const header = (
                  <div
                    className={cn(
                      "mb-2 flex items-center gap-2.5 rounded-xl bg-sidebar-accent py-2",
                      collapsed ? "justify-center px-0" : "px-2"
                    )}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${av.color}15` }}
                    >
                      <av.icon className="h-4 w-4 text-foreground" />
                    </span>
                    {!collapsed && (
                      <span className="truncate text-sm font-semibold text-sidebar-foreground">{av.name}</span>
                    )}
                  </div>
                )
                if (collapsed) {
                  return (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>{header}</TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">{av.name}</TooltipContent>
                    </Tooltip>
                  )
                }
                return header
              })()
            )}
            {/* Vault tab nav items */}
            <nav className="space-y-0.5">
              {vaultNav.map((item) => {
                const Icon = item.icon
                const iconEl = Icon
                  ? <Icon className="h-4 w-4 shrink-0" />
                  : <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                return (
                  <SidebarItem
                    key={item.id}
                    icon={iconEl}
                    label={item.label}
                    collapsed={collapsed}
                    onClick={() => onVaultNavChange?.(item.id)}
                    active={activeVaultNav === item.id}
                  />
                )
              })}
            </nav>
          </div>
        </>
      )}

      <Separator className="mx-3 my-3 w-auto bg-sidebar-border" />

      {/* ── Vault list ─────────────────────────────────��────────── */}
      <div className="flex-1 overflow-y-auto px-3">
        {!collapsed && (
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            {"Vaults"}
          </p>
        )}
        <nav className="space-y-0.5">
          {vaults.map((vault) => (
            <SidebarVaultItem
              key={vault.id}
              vault={vault}
              collapsed={collapsed}
            />
          ))}

        </nav>
      </div>

      <Separator className="mx-3 my-2 w-auto bg-sidebar-border" />

      {/* ── Bottom highlights + nav ─────────────────────────── */}
      <div className="shrink-0 space-y-2 px-3 pb-3">

        {/* Highlight cards — only when expanded */}
        {!collapsed && (
          <div className="space-y-2 pb-1">
            {/* Share Roget */}
            <button className="group flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted">
              <div>
                <p className="text-sm font-semibold text-card-foreground">{"Share Roget"}</p>
                <p className="text-xs text-muted-foreground">{"Invite friends, earn free vaults"}</p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-background">
                <Gift className="h-4 w-4 text-foreground" />
              </div>
            </button>

            {/* Vault usage / upgrade */}
            <button className="group flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left transition-all hover:shadow-sm"
              style={{ boxShadow: "inset 0 0 0 1.5px transparent" }}
            >
              <div>
                <p className="text-sm font-semibold text-card-foreground">{"4 of 5 vaults used"}</p>
                <p className="text-xs text-muted-foreground">{"Upgrade for unlimited vaults"}</p>
              </div>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)" }}
              >
                <Zap className="h-4 w-4 text-white" />
              </div>
            </button>
          </div>
        )}

        {/* Notifications */}
        <SidebarItem
          icon={
            <span className="relative">
              <Bell className="h-4 w-4" />
              {!notifOpen && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent" />
              )}
            </span>
          }
          label="Notifications"
          collapsed={collapsed}
          onClick={onBellClick}
          active={notifOpen}
        />
        <SidebarItem
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
          collapsed={collapsed}
          onClick={() => {}}
        />

        <Separator className="!my-2 w-full bg-sidebar-border" />

        {/* Avatar */}
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-sidebar-accent",
            collapsed && "justify-center px-0"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0 border-2 border-sidebar-primary/20">
            <AvatarFallback className="bg-sidebar-primary/10 text-sidebar-primary text-xs font-semibold">
              {"FA"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {"Fatima"}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/50">
                {"fatima@sweetcrumb.com"}
              </p>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Sidebar nav item ───────────────────────���────────────────────────

function SidebarItem({
  icon,
  label,
  collapsed,
  onClick,
  muted,
  active,
}: {
  icon: React.ReactNode
  label: string
  collapsed: boolean
  onClick: () => void
  muted?: boolean
  active?: boolean
}) {
  const inner = (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-sidebar-accent",
        collapsed && "justify-center px-0",
        active && "bg-sidebar-accent",
        muted
          ? "text-sidebar-foreground/40 hover:text-sidebar-foreground/60"
          : "text-sidebar-foreground"
      )}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return inner
}

// ── Sidebar vault item ──────────────────────────────────────────────

function SidebarVaultItem({
  vault,
  collapsed,
}: {
  vault: SidebarVault
  collapsed: boolean
}) {
  const inner = (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-sidebar-accent",
        collapsed && "justify-center px-0"
      )}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${vault.color}15` }}
      >
        <vault.icon className="h-4 w-4 text-foreground" />
      </span>
      {!collapsed && (
        <span className="truncate text-sidebar-foreground">{vault.name}</span>
      )}
    </button>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {vault.name}
        </TooltipContent>
      </Tooltip>
    )
  }

  return inner
}

// ── Main layout ─────────────────────────────────────────────────────

const SIDEBAR_W = 256
const SIDEBAR_W_COLLAPSED = 64

export function AppShell({
  children,
  vaults,
  vaultNav,
  activeVaultId,
  activeVaultNav,
  onVaultNavChange,
  onBackToDashboard,
  onStartChat,
}: {
  children: React.ReactNode
  vaults: SidebarVault[]
  vaultNav?: VaultNavItem[]
  activeVaultId?: string
  activeVaultNav?: string
  onVaultNavChange?: (id: string) => void
  onBackToDashboard?: () => void
  onStartChat?: (initialMessage?: string, targetVaultId?: string) => void
}) {
  const isMobile = useIsMobile()
  const [pinned, setPinned] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [newVaultOpen, setNewVaultOpen] = useState(false)

  const collapsed = !pinned && !hovered

  // Mobile: Sheet drawer
  if (isMobile) {
    return (
      <SidebarContext.Provider value={{ collapsed: false, setCollapsed: () => {} }}>
        <TooltipProvider>
          <div className="flex min-h-screen flex-col bg-background">
            {/* Mobile top bar */}
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl"
                      aria-label="Open navigation"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[280px] bg-sidebar-background p-0"
                  >
                    <SheetTitle className="sr-only">
                      {"Navigation"}
                    </SheetTitle>
                    <SidebarInner
                      vaults={vaults}
                      collapsed={false}
                      onToggle={() => setMobileOpen(false)}
                      showToggle={false}
                      onBellClick={() => setNotifOpen((v) => !v)}
                      notifOpen={notifOpen}
                      onNewVault={() => { setMobileOpen(false); setNewVaultOpen(true) }}
                      vaultNav={vaultNav}
                      activeVaultId={activeVaultId}
                      activeVaultNav={activeVaultNav}
                      onVaultNavChange={onVaultNavChange}
                      onBackToDashboard={onBackToDashboard}
                    />
                  </SheetContent>
                </Sheet>
                <Image
                  src="/images/roget-logo-colored.png"
                  alt="Roget"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              <button
                onClick={() => setNewVaultOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Add New Vault"
              >
                <Plus className="h-4 w-4" />
              </button>
            </header>

            {/* Content */}
            <main className="flex-1">{children}</main>

            {/* New Vault Modal */}
            <NewVaultModal open={newVaultOpen} onClose={() => setNewVaultOpen(false)} vaults={vaults} onStartChat={(msg, vid) => { setNewVaultOpen(false); onStartChat?.(msg, vid) }} />
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }

  // Desktop: persistent sidebar, collapsed by default, expands on hover
  const sidebarWidth = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed: (v: boolean) => setPinned(!v) }}>
      <TooltipProvider>
        <div className="flex min-h-screen bg-background">
          {/* Sidebar */}
          <motion.aside
            initial={false}
            animate={{
              width: sidebarWidth,
              boxShadow: collapsed
                ? "none"
                : "4px 0 24px rgba(0, 0, 0, 0.08)",
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 z-40 flex-shrink-0 overflow-hidden border-r border-sidebar-border"
            style={{ backgroundColor: "hsl(var(--sidebar-background))" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <SidebarInner
              vaults={vaults}
              collapsed={collapsed}
              onToggle={() => setPinned(!pinned)}
              showToggle
              onBellClick={() => setNotifOpen((v) => !v)}
              notifOpen={notifOpen}
              onNewVault={() => setNewVaultOpen(true)}
              vaultNav={vaultNav}
              activeVaultId={activeVaultId}
              activeVaultNav={activeVaultNav}
              onVaultNavChange={onVaultNavChange}
              onBackToDashboard={onBackToDashboard}
            />
          </motion.aside>

          {/* Notification panel — anchored beside the sidebar */}
          <NotificationPanel
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            anchorLeft={collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W}
          />

          {/* Main area -- pinned to the collapsed width so content doesn't shift on hover */}
          <div
            className="flex min-h-screen flex-1 flex-col"
            style={{ marginLeft: SIDEBAR_W_COLLAPSED }}
          >
            <main className="flex-1">{children}</main>
          </div>

          {/* New Vault Modal */}
            <NewVaultModal open={newVaultOpen} onClose={() => setNewVaultOpen(false)} vaults={vaults} onStartChat={(msg, vid) => { setNewVaultOpen(false); onStartChat?.(msg, vid) }} />
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}
