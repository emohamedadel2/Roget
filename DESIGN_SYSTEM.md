# Roget Design System

A living reference for every visual and interaction pattern used in Roget's UI.
All new screens **must** follow this system exactly.

---

## 1. Brand Gradient

The signature gradient runs purple → pink → orange in a 135deg direction.
Use it for: border highlights on hover, chip backgrounds, submit buttons (active state), icon fills, upgrade CTAs.

```css
/* Full brand gradient */
background: linear-gradient(135deg, #7C3AED, #EC4899, #F97316);

/* Atmospheric page wash (top of page, 12% opacity, fades to transparent) */
background: linear-gradient(180deg, #7C3AED 0%, #EC4899 35%, #F97316 60%, transparent 100%);
```

**Never** use the full gradient as a solid background for large surfaces.
**Never** mix it with opposing temperature colors (e.g. green, blue).

---

## 2. Color Tokens

Defined in `app/globals.css`. Always reference tokens — never raw hex values for structural colors.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `hsl(0 0% 98%)` | `hsl(220 9% 6%)` | Page background |
| `--foreground` | `hsl(220 9% 24%)` | `hsl(250 15% 95%)` | Primary text |
| `--card` | `hsl(0 0% 100%)` | `hsl(220 9% 9%)` | Card surfaces |
| `--card-foreground` | Same as foreground | Same | Card text |
| `--muted` | `hsl(250 12% 95%)` | `hsl(220 8% 14%)` | Subtle fills, icon containers |
| `--muted-foreground` | `hsl(220 5% 45%)` | `hsl(250 10% 55%)` | Secondary text, metadata |
| `--primary` | `hsl(263 70% 58%)` | Same | Purple — links, active states, progress |
| `--accent` | `hsl(25 95% 53%)` | Same | Orange — notification dots, attention badges |
| `--border` | `hsl(250 10% 91%)` | `hsl(220 8% 16%)` | Default borders |
| `--sidebar-background` | `hsl(250 15% 97%)` | `hsl(220 9% 8%)` | Sidebar surface |
| `--sidebar-accent` | `hsl(250 15% 93%)` | `hsl(220 8% 14%)` | Sidebar hover/active bg |

### Brand color hex values (gradient only)
```
Purple:  #7C3AED
Pink:    #EC4899
Orange:  #F97316
```

### Vault accent colors (per-vault, not design tokens)
Each vault has its own color used for its icon tint:
`#7C3AED` `#059669` `#3B82F6` `#F43F5E` `#F97316` `#8B5CF6` `#EC4899` `#14B8A6`

---

## 3. Typography

**Font stack:** DM Sans (sans) + DM Mono (mono). Loaded via `next/font/google` in `app/layout.tsx`.

```tsx
// layout.tsx
import { DM_Sans, DM_Mono } from 'next/font/google'
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" })
// body className: font-sans antialiased
```

| Role | Class | Size |
|---|---|---|
| Page heading | `text-2xl font-semibold md:text-3xl text-balance` | 24–30px |
| Section label | `text-xs font-semibold uppercase tracking-wider text-muted-foreground` | 12px |
| Card title | `text-sm font-semibold text-card-foreground leading-tight text-pretty` | 14px |
| Body / reason text | `text-sm text-foreground/70 leading-relaxed` | 14px |
| Metadata / timestamps | `text-xs text-muted-foreground` | 12px |
| Micro label (chip) | `text-[9px] font-semibold uppercase tracking-wider` | 9px |

**Heading fade effect** (used on greeting):
```tsx
<h1>
  <span className="text-foreground">Good morning, </span>
  <span className="text-muted-foreground/50">Fatima.</span>
</h1>
```

---

## 4. Spacing & Sizing

| Use | Value |
|---|---|
| Card inner padding (standard) | `p-5` |
| Card inner padding (compact/suggested) | `p-4` |
| Section padding | `p-5 md:p-6` |
| Icon container (standard) | `h-11 w-11 rounded-xl` |
| Icon container (compact) | `h-10 w-10 rounded-xl` |
| Icon container (sidebar vault) | `h-7 w-7 rounded-lg` |
| Page max width | `max-w-5xl` |
| Hero input max width | `max-w-xl` |
| Gap between cards | `gap-4` |
| Card border radius | `rounded-3xl` (outer) / `rounded-[22px]` (inner card) |

---

## 5. Card Pattern — Gradient Border Wrapper

Every interactive card uses this two-layer structure. The gradient border appears on hover for active vaults, and at 40% opacity at rest for suggested vaults (persistent signal that they're AI-generated).

```tsx
{/* OUTER: gradient border wrapper */}
<div
  className="group/outer relative h-full rounded-3xl p-[1.5px] transition-all duration-300"
  style={{ background: "hsl(var(--border))" }}  // resting state: plain border
>
  {/* Gradient overlay — fades in on hover */}
  <div
    className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover/outer:opacity-100"
    style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)" }}
  />

  {/* INNER: actual card */}
  <Card className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[22px] border-0 bg-card transition-all duration-300">
    <CardContent className="flex flex-1 flex-col p-5">
      {/* content */}
    </CardContent>
  </Card>
</div>
```

**Suggested card variant:** `opacity-40` at rest → `opacity-100` on hover (always slightly visible gradient).

---

## 6. Gradient Chip (AI badge)

Used on suggested vault cards to signal AI-generated content.

```tsx
<span
  className="inline-flex items-center gap-1 rounded-full px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-white"
  style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)" }}
>
  <Lightbulb className="h-2 w-2" />
  Suggested
</span>
```

**Rule:** Only use gradient-filled chips for AI-generated or AI-action content. Other chips use `bg-muted` with `text-foreground`.

---

## 7. Gradient Impact Icon

Replaces stars. A bolt SVG filled with the brand gradient. Used to indicate AI improvement potential on vault topics (1–3 icons).

```tsx
function GradientImpactIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="roget-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#roget-grad)" opacity="0.7" />
    </svg>
  )
}
```

---

## 8. Page Atmosphere Gradient

Applied at the top of every main content page. It sits behind all content at `z-0` and uses `pointer-events-none`.

```tsx
<div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] overflow-hidden">
  <div
    className="h-full w-full opacity-[0.12]"
    style={{
      background: "linear-gradient(180deg, #7C3AED 0%, #EC4899 35%, #F97316 60%, transparent 100%)",
    }}
  />
</div>
```

Content must use `relative z-[1]` to sit above the gradient.

---

## 9. Sidebar

**Structure:** `AppShell` wraps all pages. On desktop the sidebar is `64px` collapsed / `256px` expanded, hover to expand. On mobile it becomes a `Sheet` drawer.

| Element | Pattern |
|---|---|
| Logo expanded | `h-8 w-auto`, `width={140}` |
| Logo collapsed | `h-7 w-7`, `width={28}` |
| Nav item | `rounded-xl px-2 py-2 text-sm hover:bg-sidebar-accent` |
| Active nav item | `bg-sidebar-accent` |
| Vault item icon | `h-7 w-7 rounded-lg` with `vault.color + 15` (15% opacity bg) |
| Vault item icon color | `text-foreground` (black in light mode) |
| Section separator | `<Separator className="mx-3 my-2 w-auto bg-sidebar-border" />` |

**Bottom cards (expanded only):**
```tsx
// Share card — plain border
<button className="group flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
  <Gift className="h-4 w-4 text-foreground" />
</button>

// Upgrade card — gradient bolt icon
<div
  className="flex h-9 w-9 items-center justify-center rounded-xl"
  style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899, #F97316)" }}
>
  <Zap className="h-4 w-4 text-white" />
</div>
```

**Notification bell:** Has orange dot (`bg-accent`) when unread. Dot disappears when panel is open.

---

## 10. Notification Panel

Slides in from beside the sidebar (`fixed`, `left: sidebarWidth + 8px`). Width: `360px`. Full height minus `8px` top/bottom.

| Element | Pattern |
|---|---|
| Container | `rounded-3xl border border-border bg-background shadow-2xl shadow-primary/10` |
| Tabs | `rounded-xl py-2`, active: `bg-muted text-foreground` |
| Unread dot | `h-1.5 w-1.5 rounded-full bg-accent` |
| Notification card | `rounded-2xl border border-border bg-card p-4` |
| Icon container | `h-8 w-8 rounded-xl bg-muted` |
| CTA link | `text-xs font-semibold text-primary` + `ArrowUpRight` icon |
| Dismiss button | Appears on `group-hover`, `opacity-0 → opacity-100` |
| Empty state | Centered, `h-12 w-12 rounded-2xl bg-muted` with muted icon |

---

## 11. Dashboard Layout

```
AppShell
└── Atmosphere gradient (absolute, z-0, h-420px)
└── Content (relative, z-1, max-w-5xl, px-5 py-8 md:px-8 md:py-12)
    ├── Hero section (max-w-xl, text-center)
    │   ├── Greeting (heading fade effect)
    │   └── HeroCreateInput
    ├── Vaults section (mt-10, rounded-3xl bg-muted/40 p-5)
    │   ├── Section label
    │   ├── Grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4)
    │   │   └── VaultCard × N (max 6 visible)
    │   └── "View all N vaults" button (ChevronDown, toggles)
    └── SuggestedCarousel (mt-6)
        ├── Header + arrow pagination buttons
        └── Draggable horizontal scroll (cursor-grab, scrollbar-none)
            └── SuggestedVaultCard × N (w-[300px] md:w-[320px] shrink-0)
```

---

## 12. Hero Create Input

```tsx
<div className="rounded-2xl border border-border bg-card p-1.5 shadow-sm focus-within:shadow-md">
  {/* Text input with animated cycling placeholder */}
  {/* Bottom bar: input mode icons (Type/Voice/Photo/File) + submit button */}
</div>
```

**Submit button states:**
- Empty: `bg-muted`, icon `text-muted-foreground/40`
- Has value: `background: linear-gradient(135deg, #7C3AED, #EC4899, #F97316)`, icon `text-white`

**Input modes:** Pencil (active, `bg-primary/10 text-primary`), Mic, Camera, FileUp (`text-muted-foreground/40`).

---

## 13. Animations (Framer Motion)

| Pattern | Usage |
|---|---|
| `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` | Card entrance |
| `transition={{ duration: 0.35, delay: index * 0.08 }}` | Staggered card entrance |
| `whileHover={{ y: -3 }}` | Card lift on hover |
| `whileTap={{ scale: 0.98 }}` | Card press |
| `initial={{ opacity: 0, x: -12, scale: 0.98 }}` | Panel slide-in |
| `transition={{ duration: 0.2, ease: "easeOut" }}` | Panel animation |
| `<AnimatePresence mode="popLayout">` | Notification dismiss |
| `exit={{ opacity: 0, x: 24 }}` | Notification exit |
| `exit={{ opacity: 0, scale: 0.95 }}` | Card dismiss |
| Sidebar `animate={{ width }}` | `duration: 0.2, ease: "easeInOut"` |

---

## 14. Utilities

```css
/* Hide scrollbar (horizontal carousels) */
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar { display: none; }

/* Drag cursor */
.cursor-grab { cursor: grab; }
.active\:cursor-grabbing:active { cursor: grabbing; }
```

---

## 15. Component File Map

| Component | File | Role |
|---|---|---|
| `AppShell` | `components/app-sidebar.tsx` | Layout wrapper + sidebar |
| `NotificationPanel` | `components/notification-panel.tsx` | Slide-out notification overlay |
| `VaultCard` | `components/vault-card.tsx` | Active vault card (grid) |
| `SuggestedVaultCard` | `components/suggested-vault-card.tsx` | AI-suggested vault card (carousel) |
| `Dashboard` | `components/dashboard.tsx` | Main dashboard page |
| Design tokens | `app/globals.css` | CSS variables |
| Fonts + metadata | `app/layout.tsx` | DM Sans, DM Mono |

---

## 16. Rules for New Screens

1. **Always wrap content in `<AppShell>`** — never bypass the sidebar.
2. **Always add the atmosphere gradient** at the top of new pages (`h-[420px]`, `opacity-[0.12]`).
3. **All cards use the gradient border wrapper** — plain border at rest, gradient on hover.
4. **AI-generated content gets the gradient chip** — nothing else.
5. **Sidebar icons are always `text-foreground`** — never colored.
6. **Never use `localStorage`** — all state goes in React state or a database.
7. **Never exceed 5 colors** — use the 3 brand + neutrals from tokens only.
8. **Heading fade**: important nouns fade to `text-muted-foreground/50`.
9. **Section labels**: always `text-xs font-semibold uppercase tracking-wider text-muted-foreground`.
10. **Lists > 6 items**: always add a "View all N" toggle with `ChevronDown`.
