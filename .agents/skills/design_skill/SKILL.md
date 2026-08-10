---
name: Dashboard Design System
description: >
  Comprehensive reference for building modern, minimalist, professional dashboards.
  Covers UI/UX principles, design tokens, layout patterns, typography, color palettes,
  component anatomy, micro-animations, accessibility, responsive design, and React
  component architecture. Use this skill whenever designing or building any admin
  dashboard, control panel, or data-driven interface.
---

# Dashboard Design System — Comprehensive Reference

> **Purpose**: This document is the single source of truth for all dashboard design
> decisions in this project. Every component, layout, color, and animation must align
> with the principles defined here.

---

## Table of Contents

1. [Core Philosophy](#1-core-philosophy)
2. [Design Tokens (CSS Custom Properties)](#2-design-tokens)
3. [Color System](#3-color-system)
4. [Typography System](#4-typography-system)
5. [Spacing & Grid System](#5-spacing--grid-system)
6. [Layout Architecture](#6-layout-architecture)
7. [Sidebar Navigation](#7-sidebar-navigation)
8. [KPI Cards & Metrics](#8-kpi-cards--metrics)
9. [Data Tables](#9-data-tables)
10. [Forms & Inputs](#10-forms--inputs)
11. [Buttons & CTAs](#11-buttons--ctas)
12. [Data Visualization](#12-data-visualization)
13. [Loading States](#13-loading-states)
14. [Notifications & Feedback](#14-notifications--feedback)
15. [Empty States & Error Handling](#15-empty-states--error-handling)
16. [Micro-Animations & Transitions](#16-micro-animations--transitions)
17. [Dark Mode Implementation](#17-dark-mode-implementation)
18. [Responsive Design](#18-responsive-design)
19. [Accessibility (WCAG)](#19-accessibility-wcag)
20. [React Component Architecture](#20-react-component-architecture)
21. [Performance Checklist](#21-performance-checklist)
22. [Quick Reference Cheatsheet](#22-quick-reference-cheatsheet)

---

## 1. Core Philosophy

### The Three Pillars

| Pillar | Definition |
|--------|-----------|
| **Minimalism** | Remove anything that does not directly support the user's primary goal. White space is structure, not emptiness. |
| **Glanceability** | A user must understand the most critical information within **3 seconds**. If they can't, the dashboard has failed. |
| **Action-Orientation** | Every piece of data should lead the user toward a clear next step. Avoid "observation without a path to action." |

### Cognitive Load Theory

Apply these three types to every design decision:

- **Intrinsic Load** — The inherent complexity of the data itself. Cannot be reduced, only presented well.
- **Extraneous Load** — Clutter, unlabeled charts, confusing navigation. **Must be eliminated ruthlessly.**
- **Germane Load** — Pattern recognition and insight. **Maximize this** by giving users clean, well-organized data.

### The "Quiet Chrome" Principle

Modern minimalist dashboards use "quiet" UI elements:
- Reduce borders, shadows, and decorations
- Establish hierarchy through **typography weight, spacing, and contrast** — not visual "noise"
- Use 1px borders or very soft shadows instead of heavy drop shadows
- Color is used for **meaning** (status indicators), not decoration

### Design Mantras

```
✓ "Does this element help the user make a decision?"
✓ "Can I remove this without losing clarity?"
✓ "Is the most important thing the most visible thing?"
✓ "Would a first-time user understand this in 3 seconds?"
```

---

## 2. Design Tokens

Use a **two-tier architecture**: Primitives → Semantic Tokens.

### Tier 1: Primitives (Raw Values)

```css
:root {
  /* ─── Colors: Neutrals ─── */
  --gray-50:  #FAFAFA;
  --gray-100: #F5F5F5;
  --gray-200: #E5E5E5;
  --gray-300: #D4D4D4;
  --gray-400: #A3A3A3;
  --gray-500: #737373;
  --gray-600: #525252;
  --gray-700: #404040;
  --gray-800: #262626;
  --gray-900: #171717;
  --gray-950: #0A0A0A;

  /* ─── Colors: Brand Accent (choose ONE) ─── */
  --accent-50:  #EFF6FF;
  --accent-100: #DBEAFE;
  --accent-200: #BFDBFE;
  --accent-300: #93C5FD;
  --accent-400: #60A5FA;
  --accent-500: #3B82F6;
  --accent-600: #2563EB;
  --accent-700: #1D4ED8;
  --accent-800: #1E40AF;
  --accent-900: #1E3A8A;

  /* ─── Colors: Semantic Status ─── */
  --green-500: #22C55E;
  --green-50:  #F0FDF4;
  --red-500:   #EF4444;
  --red-50:    #FEF2F2;
  --amber-500: #F59E0B;
  --amber-50:  #FFFBEB;
  --blue-500:  #3B82F6;
  --blue-50:   #EFF6FF;

  /* ─── Spacing (4px base grid) ─── */
  --space-0:  0px;
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  /* ─── Border Radius ─── */
  --radius-none:  0px;
  --radius-sm:    2px;
  --radius-md:    6px;
  --radius-lg:    8px;
  --radius-xl:    12px;
  --radius-2xl:   16px;
  --radius-full:  9999px;

  /* ─── Shadows (Elevation) ─── */
  --shadow-xs:  0 1px 2px 0 rgba(0,0,0,0.05);
  --shadow-sm:  0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
  --shadow-md:  0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  --shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  --shadow-xl:  0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);

  /* ─── Typography ─── */
  --font-sans:  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono:  'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

  /* ─── Transitions ─── */
  --duration-fast:   150ms;
  --duration-normal: 250ms;
  --duration-slow:   350ms;
  --ease-out:        cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:     cubic-bezier(0.45, 0, 0.55, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ─── Z-Index Scale ─── */
  --z-dropdown:   10;
  --z-sticky:     20;
  --z-overlay:    30;
  --z-modal:      40;
  --z-toast:      50;
}
```

### Tier 2: Semantic Tokens (Contextual Aliases)

```css
:root {
  /* ─── Surfaces ─── */
  --color-bg-page:       var(--gray-50);
  --color-bg-surface:    #FFFFFF;
  --color-bg-elevated:   #FFFFFF;
  --color-bg-sunken:     var(--gray-100);
  --color-bg-sidebar:    var(--gray-900);

  /* ─── Text ─── */
  --color-text-primary:   var(--gray-900);
  --color-text-secondary: var(--gray-500);
  --color-text-tertiary:  var(--gray-400);
  --color-text-inverse:   #FFFFFF;
  --color-text-link:      var(--accent-600);

  /* ─── Borders ─── */
  --color-border-default: var(--gray-200);
  --color-border-strong:  var(--gray-300);
  --color-border-focus:   var(--accent-500);

  /* ─── Interactive ─── */
  --color-interactive-primary:       var(--accent-600);
  --color-interactive-primary-hover: var(--accent-700);
  --color-interactive-secondary:     var(--gray-100);
  --color-interactive-danger:        var(--red-500);

  /* ─── Status ─── */
  --color-status-success:      var(--green-500);
  --color-status-success-bg:   var(--green-50);
  --color-status-error:        var(--red-500);
  --color-status-error-bg:     var(--red-50);
  --color-status-warning:      var(--amber-500);
  --color-status-warning-bg:   var(--amber-50);
  --color-status-info:         var(--blue-500);
  --color-status-info-bg:      var(--blue-50);

  /* ─── Component Tokens ─── */
  --card-bg:           var(--color-bg-surface);
  --card-border:       var(--color-border-default);
  --card-radius:       var(--radius-lg);
  --card-shadow:       var(--shadow-xs);
  --card-padding:      var(--space-6);

  --input-bg:          var(--color-bg-surface);
  --input-border:      var(--color-border-default);
  --input-radius:      var(--radius-md);
  --input-padding-x:   var(--space-3);
  --input-padding-y:   var(--space-2);
  --input-focus-ring:  0 0 0 3px rgba(59, 130, 246, 0.15);

  --sidebar-width:          260px;
  --sidebar-width-collapsed: 72px;
  --header-height:           64px;
}
```

### Naming Convention

Use **kebab-case** with the pattern: `--category-property-variant`

```
--color-bg-page        ✓ (category: color, property: bg, variant: page)
--space-4              ✓ (category: space, value: 4)
--radius-lg            ✓ (category: radius, variant: lg)
--dark-blue            ✗ (describes appearance, not usage)
```

---

## 3. Color System

### The "One-Accent" Rule

Choose **one** bold, saturated color for primary CTAs and critical data points. Everything else is grayscale or neutral.

| Layer | Light Mode | Dark Mode |
|-------|-----------|-----------|
| **Page Background** | `#FAFAFA` (gray-50) | `#0A0A0A` (gray-950) |
| **Surface/Card** | `#FFFFFF` | `#171717` (gray-900) |
| **Elevated Surface** | `#FFFFFF` + shadow | `#262626` (gray-800) |
| **Sunken/Inset** | `#F5F5F5` (gray-100) | `#0A0A0A` (gray-950) |
| **Primary Text** | `#171717` (gray-900) | `#FAFAFA` (gray-50) |
| **Secondary Text** | `#737373` (gray-500) | `#A3A3A3` (gray-400) |
| **Border** | `#E5E5E5` (gray-200) | `#404040` (gray-700) |
| **Accent/CTA** | `#2563EB` (accent-600) | `#60A5FA` (accent-400) |

### Semantic Color Usage

| Color | Meaning | Usage |
|-------|---------|-------|
| **Green** `#22C55E` | Success, Positive trend, Active | Status badges, +% metrics, "Live" indicators |
| **Red** `#EF4444` | Error, Negative trend, Danger | Form errors, -% metrics, "Delete" actions |
| **Amber** `#F59E0B` | Warning, Caution, Pending | "Needs review" badges, low-stock indicators |
| **Blue** `#3B82F6` | Info, Neutral, Navigation | Links, info tooltips, selected states |

### Rules

1. **Never use color alone** to convey information — always pair with text, icon, or pattern
2. **Avoid generic colors** (plain red, blue, green) — use curated, specific shades
3. **Use tinted backgrounds** for status: e.g., red text on light-red bg (`#FEF2F2`)
4. **Maintain WCAG AA contrast** (4.5:1 for normal text, 3:1 for large text)
5. **In dark mode**: Use lighter/desaturated versions of status colors for readability

---

## 4. Typography System

### Font Stack

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'; /* Inter OpenType features */
}
```

### The Single-Font Rule

Use **one font family** for the entire dashboard. Establish hierarchy through **weight and size only**.

### Type Scale (3-Tier Hierarchy)

| Level | Name | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| **Display** | `--text-display` | 30px | 700 | 1.2 | -0.02em | Page titles, main headings |
| **Heading L** | `--text-heading-lg` | 22px | 600 | 1.3 | -0.015em | Section headings |
| **Heading M** | `--text-heading-md` | 18px | 600 | 1.4 | -0.01em | Card titles |
| **Heading S** | `--text-heading-sm` | 15px | 600 | 1.4 | 0 | Widget headers |
| **Body L** | `--text-body-lg` | 16px | 400 | 1.6 | 0 | Primary body text |
| **Body M** | `--text-body-md` | 14px | 400 | 1.5 | 0 | Default body, table cells |
| **Body S** | `--text-body-sm` | 13px | 400 | 1.5 | 0 | Secondary descriptions |
| **Caption** | `--text-caption` | 12px | 500 | 1.4 | 0.01em | Labels, footnotes, badges |
| **Overline** | `--text-overline` | 11px | 600 | 1.3 | 0.06em | Category labels, uppercase |
| **KPI Value** | `--text-kpi` | 28px | 700 | 1.2 | -0.02em | Hero metric numbers |

### CSS Implementation

```css
:root {
  --text-display:    700 30px/1.2 var(--font-sans);
  --text-heading-lg: 600 22px/1.3 var(--font-sans);
  --text-heading-md: 600 18px/1.4 var(--font-sans);
  --text-heading-sm: 600 15px/1.4 var(--font-sans);
  --text-body-lg:    400 16px/1.6 var(--font-sans);
  --text-body-md:    400 14px/1.5 var(--font-sans);
  --text-body-sm:    400 13px/1.5 var(--font-sans);
  --text-caption:    500 12px/1.4 var(--font-sans);
  --text-overline:   600 11px/1.3 var(--font-sans);
  --text-kpi:        700 28px/1.2 var(--font-sans);
}
```

### Rules

1. **Use tabular figures** for numbers in tables and KPIs (`font-variant-numeric: tabular-nums`)
2. **Never use more than 3 font weights** on a single page (400, 500/600, 700)
3. **Avoid all-uppercase text** except for overline labels and badges
4. **Maximum line length**: 65–75 characters for readability
5. **Minimum font size**: 12px for any text the user needs to read

---

## 5. Spacing & Grid System

### 4px Base Grid

All spacing values must be multiples of 4px. This creates rhythm and visual harmony.

```
4px → 8px → 12px → 16px → 20px → 24px → 32px → 40px → 48px → 64px → 80px
```

### Spacing Usage Guide

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing: between icon and label, inline elements |
| `--space-2` | 8px | Default gap: between form elements, compact lists |
| `--space-3` | 12px | Input padding, small gaps between related elements |
| `--space-4` | 16px | Card padding (compact), section sub-gaps |
| `--space-5` | 20px | Standard component spacing |
| `--space-6` | 24px | Card padding (default), section gaps |
| `--space-8` | 32px | Section separators, major content gaps |
| `--space-10` | 40px | Page-level section spacing |
| `--space-12` | 48px | Major layout sections |
| `--space-16` | 64px | Full page vertical rhythm |

### Dashboard Grid

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);       /* 24px between cards */
  padding: var(--space-6);    /* 24px page padding */
}

/* Common card spans */
.card--full    { grid-column: span 12; }
.card--half    { grid-column: span 6; }
.card--third   { grid-column: span 4; }
.card--quarter { grid-column: span 3; }
.card--two-thirds { grid-column: span 8; }
```

---

## 6. Layout Architecture

### Page Anatomy

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER (64px)  [Logo]  [Search]  [Notifications]  [Avatar] │
├─────────┬────────────────────────────────────────────────────┤
│         │                                                    │
│  SIDE   │  MAIN CONTENT                                     │
│  BAR    │  ┌──────────────────────────────────────────────┐  │
│ (260px) │  │  Page Title + Breadcrumb + Actions            │  │
│         │  ├──────────────────────────────────────────────┤  │
│  ● Home │  │  KPI Cards Row (3-4 cards)                    │  │
│  ● Data │  ├──────────────────────────────────────────────┤  │
│  ● ...  │  │  Primary Content (Charts / Tables)            │  │
│         │  ├──────────────────────────────────────────────┤  │
│         │  │  Secondary Content (Details / Activity)       │  │
│         │  └──────────────────────────────────────────────┘  │
│         │                                                    │
└─────────┴────────────────────────────────────────────────────┘
```

### CSS Grid Template

```css
.dashboard-layout {
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: var(--header-height) 1fr;
  min-height: 100vh;
}

.sidebar { grid-area: sidebar; }
.header  { grid-area: header; }
.main    { grid-area: main; overflow-y: auto; }
```

### Information Hierarchy (Top → Bottom)

1. **Page Title & Context** — Where am I? What can I do here?
2. **Hero KPI Cards** — The 3–5 most critical metrics at a glance
3. **Primary Content** — Charts, tables, or forms for the main task
4. **Secondary Content** — Activity logs, recent items, or auxiliary data
5. **Footer/Meta** — Last updated, version info, help links

### Rules

1. **The most important data occupies the top-left** (natural eye-scanning pattern: F-pattern or Z-pattern)
2. **Limit top-level KPIs to 5–7** (cognitive processing limit)
3. **Group related metrics** together to reduce cognitive load
4. **Use consistent alignment** — left-align text, right-align numbers

---

## 7. Sidebar Navigation

### Anatomy

```
┌─────────────────┐
│  [Logo]         │ ← Brand identity
│─────────────────│
│  🏠 Dashboard   │ ← Primary nav (6-8 max)
│  📊 Analytics   │
│  🎁 Offers      │
│  🏷️ Codes       │
│  ⚙️ Settings    │
│─────────────────│
│                 │ ← Spacer (pushes bottom items)
│─────────────────│
│  ❓ Help        │ ← Utilities (bottom-pinned)
│  👤 Profile     │
│  🚪 Logout      │
└─────────────────┘
```

### Best Practices

| Rule | Implementation |
|------|---------------|
| **Collapsible** | Toggle between full (260px) and icon-only rail (72px) |
| **Active State** | Highlighted background + accent color left-border or text color |
| **Icons + Labels** | Always pair icons with text labels; icon-only in collapsed state |
| **Grouping** | Separate primary nav from utilities with a divider |
| **Max Items** | 6–8 primary items; use sub-menus for overflow |
| **Keyboard** | Arrow keys navigate between items; Enter activates |
| **Mobile** | Off-canvas drawer with overlay; swipe to close |

### CSS Pattern

```css
.sidebar {
  width: var(--sidebar-width);
  background: var(--color-bg-sidebar);
  color: var(--color-text-inverse);
  display: flex;
  flex-direction: column;
  transition: width var(--duration-normal) var(--ease-out);
  overflow: hidden;
}

.sidebar.collapsed {
  width: var(--sidebar-width-collapsed);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--gray-400);
  transition: all var(--duration-fast) var(--ease-out);
  cursor: pointer;
}

.nav-item:hover {
  color: var(--color-text-inverse);
  background: rgba(255, 255, 255, 0.08);
}

.nav-item.active {
  color: var(--color-text-inverse);
  background: rgba(255, 255, 255, 0.12);
  font-weight: 500;
}
```

---

## 8. KPI Cards & Metrics

### Card Anatomy

```
┌──────────────────────────────────────┐
│  📈  Monthly Revenue                 │ ← Overline label + icon
│                                      │
│  $42,580                             │ ← Hero value (large, bold)
│                                      │
│  ▲ +12.5% vs last month             │ ← Comparison (colored)
│  ════════════════════                │ ← Optional sparkline
└──────────────────────────────────────┘
```

### Best Practices

| Principle | Details |
|-----------|---------|
| **Label** | Clear, unambiguous title — "Monthly Revenue" not "MRR" |
| **Hero Value** | Large (28px), bold (700), `tabular-nums` for alignment |
| **Comparison** | Always include context: % change, vs target, vs period |
| **Color Coding** | Green ▲ for positive, Red ▼ for negative, Gray – for neutral |
| **Sparkline** | Optional mini trend-line to show direction instantly |
| **Placement** | Top of page, 3–4 cards in a row on desktop |
| **Limit** | Maximum 5–7 KPI cards to avoid cognitive overload |

### CSS Pattern

```css
.kpi-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.kpi-card__label {
  font: var(--text-caption);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.kpi-card__value {
  font: var(--text-kpi);
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
}

.kpi-card__trend {
  font: var(--text-body-sm);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.kpi-card__trend--positive { color: var(--color-status-success); }
.kpi-card__trend--negative { color: var(--color-status-error); }
.kpi-card__trend--neutral  { color: var(--color-text-tertiary); }
```

---

## 9. Data Tables

### Anatomy

```
┌──────────────────────────────────────────────────────┐
│  Table Title              [Filter] [Search] [Export] │
├────────┬──────────┬──────────┬──────────┬────────────┤
│  Name ▼│  Status  │  Value   │  Date    │  Actions   │ ← Sticky header
├────────┼──────────┼──────────┼──────────┼────────────┤
│  ...   │  ...     │  ...     │  ...     │  ...       │
│  ...   │  ...     │  ...     │  ...     │  ...       │
├────────┴──────────┴──────────┴──────────┴────────────┤
│  Showing 1-10 of 48               [< 1 2 3 4 5 >]   │ ← Pagination
└──────────────────────────────────────────────────────┘
```

### Best Practices

| Feature | Implementation |
|---------|---------------|
| **Sticky Headers** | `position: sticky; top: 0;` — always visible when scrolling |
| **Alignment** | Text: left-aligned. Numbers: right-aligned. Status: center. |
| **Row Hover** | Subtle background change on hover (`var(--gray-50)`) |
| **Sorting** | Clear arrow icons in headers; default sort by most recent |
| **Pagination** | Numbered pages for task-oriented views; "Load More" for feeds |
| **Density** | Offer "Compact" (36px rows) vs "Comfortable" (48px rows) |
| **Responsive** | Card layout on mobile; or horizontal scroll with sticky first column |
| **Zebra Stripes** | Optional — only if table has 10+ rows and no row borders |

### CSS Pattern

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font: var(--text-body-md);
}

.data-table thead {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: var(--color-bg-surface);
}

.data-table th {
  font: var(--text-caption);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--color-border-strong);
  user-select: none;
  cursor: pointer;
}

.data-table td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border-default);
  color: var(--color-text-primary);
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background: var(--color-bg-sunken);
}

/* Right-align numeric columns */
.data-table td.numeric,
.data-table th.numeric {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
```

---

## 10. Forms & Inputs

### Best Practices

1. **Single-column layout** — easier to scan, reduces cognitive load
2. **Progressive disclosure** — show only necessary fields; group complex forms into steps
3. **Always use visible labels** — never rely solely on placeholder text
4. **Helper text** below inputs for formatting guidance
5. **Inline validation** — show errors next to the field, not in a separate alert

### Input States

| State | Visual Treatment |
|-------|-----------------|
| **Default** | 1px border (`--color-border-default`), white background |
| **Hover** | Border darkens to `--color-border-strong` |
| **Focus** | Border changes to `--color-border-focus` + focus ring |
| **Error** | Border + focus ring in `--color-status-error`, error message below |
| **Disabled** | Reduced opacity (0.5), `cursor: not-allowed` |
| **Read-only** | Same as default but no hover/focus, `cursor: default` |

### CSS Pattern

```css
.form-input {
  width: 100%;
  padding: var(--input-padding-y) var(--input-padding-x);
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--input-radius);
  font: var(--text-body-md);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color var(--duration-fast),
              box-shadow var(--duration-fast);
}

.form-input:hover {
  border-color: var(--color-border-strong);
}

.form-input:focus {
  border-color: var(--color-border-focus);
  box-shadow: var(--input-focus-ring);
}

.form-input.error {
  border-color: var(--color-status-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-label {
  display: block;
  font: var(--text-body-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.form-helper {
  font: var(--text-caption);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}

.form-error {
  font: var(--text-caption);
  color: var(--color-status-error);
  margin-top: var(--space-1);
}
```

---

## 11. Buttons & CTAs

### Hierarchy (3 Levels)

| Level | Name | Usage | Appearance |
|-------|------|-------|-----------|
| **1** | Primary | Main CTA per section — "Save", "Create" | Filled accent color |
| **2** | Secondary | Supporting actions — "Cancel", "Export" | Outlined or ghost |
| **3** | Tertiary/Ghost | Low-emphasis — "Learn more", inline actions | Text-only with hover bg |

### Button States

| State | Visual |
|-------|--------|
| **Default** | Standard appearance |
| **Hover** | Slightly darker background or subtle scale |
| **Active/Pressed** | `transform: scale(0.98)`, darker shade |
| **Focus** | Focus ring (keyboard navigation) |
| **Loading** | Spinner icon replaces text; disabled interactions |
| **Disabled** | Reduced opacity (0.5), `cursor: not-allowed` |

### Rules

1. **Action-oriented labels**: "Save Changes" not "Submit", "Download Report" not "OK"
2. **One primary button per section** — never two equal-weight CTAs side by side
3. **Consistent sizing**: Small (32px), Medium (40px), Large (48px) height
4. **Icon + Text**: Icon on the left, text on the right. Never icon-only without tooltip.

### CSS Pattern

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0 var(--space-4);
  height: 40px;
  border-radius: var(--radius-md);
  font: var(--text-body-md);
  font-weight: 500;
  cursor: pointer;
  border: none;
  outline: none;
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Primary */
.btn-primary {
  background: var(--color-interactive-primary);
  color: white;
}
.btn-primary:hover {
  background: var(--color-interactive-primary-hover);
}
.btn-primary:active {
  transform: scale(0.98);
}

/* Secondary */
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
}
.btn-secondary:hover {
  background: var(--color-interactive-secondary);
  border-color: var(--color-border-strong);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
}
.btn-ghost:hover {
  background: var(--color-interactive-secondary);
  color: var(--color-text-primary);
}

/* Danger */
.btn-danger {
  background: var(--color-interactive-danger);
  color: white;
}

/* Disabled */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Sizes */
.btn-sm { height: 32px; padding: 0 var(--space-3); font-size: 13px; }
.btn-lg { height: 48px; padding: 0 var(--space-6); font-size: 16px; }
```

---

## 12. Data Visualization

### Chart Type Selection Guide

| Data Purpose | Chart Type | When to Use |
|-------------|-----------|-------------|
| **Trend over time** | Line Chart | Revenue over months, user growth |
| **Comparison** | Bar / Column Chart | Sales by region, category comparison |
| **Composition** | Stacked Bar / Donut | Market share, budget allocation |
| **Progress** | Progress Bar / Gauge | Goal completion, quota tracking |
| **Distribution** | Histogram | Age groups, response time distribution |
| **Relationship** | Scatter Plot | Correlation between two metrics |

### Rules

1. **Start y-axis at zero** unless showing stock/market data
2. **Limit to 5–7 data series** per chart
3. **Use consistent colors** for the same data series across all charts
4. **Direct labeling** over legends when possible (reduces eye travel)
5. **Gridlines**: Subtle, light gray, horizontal only
6. **Tooltips**: Show on hover with exact values
7. **Responsive**: Charts must resize with their container

### Color Palette for Charts

```css
:root {
  --chart-1: #3B82F6; /* Blue */
  --chart-2: #8B5CF6; /* Purple */
  --chart-3: #06B6D4; /* Cyan */
  --chart-4: #10B981; /* Emerald */
  --chart-5: #F59E0B; /* Amber */
  --chart-6: #EF4444; /* Red */
  --chart-7: #EC4899; /* Pink */
}
```

---

## 13. Loading States

### The 3-Tier Wait-Time Model

| Duration | Feedback Type | Implementation |
|----------|--------------|----------------|
| **< 300ms** | None | Too fast; any indicator would be distracting |
| **300ms – 10s** | Skeleton / Spinner | Show skeleton for layouts, spinner for discrete actions |
| **> 10s** | Progress Bar | Determinate bar showing estimated completion |

### Skeleton Screens

- Use for **full-page or complex component** loading
- Must **accurately mimic** the structure of the final content
- Include a **shimmer/pulse animation** to indicate activity
- **Never show for < 300ms** — use a delay before showing

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-100) 25%,
    var(--gray-200) 50%,
    var(--gray-100) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Common skeleton shapes */
.skeleton-text   { height: 14px; width: 60%; }
.skeleton-title  { height: 22px; width: 40%; }
.skeleton-avatar { height: 40px; width: 40px; border-radius: var(--radius-full); }
.skeleton-card   { height: 120px; width: 100%; }
```

### Button Loading

```css
.btn.loading {
  pointer-events: none;
  position: relative;
  color: transparent;
}

.btn.loading::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 14. Notifications & Feedback

### Notification Hierarchy

| Type | Component | Behavior | Duration | Use Case |
|------|-----------|----------|----------|----------|
| **Validation** | Inline error | Static until resolved | Persistent | Field-level form errors |
| **Toast** | Floating snackbar | Auto-dismiss | 3–5 seconds | "Changes saved", "File uploaded" |
| **Banner** | Full-width bar | Dismissible | Until dismissed | System announcements, maintenance |
| **Alert/Modal** | Blocking dialog | Requires action | Until resolved | "Delete permanently?", "Payment failed" |
| **Badge** | Dot/counter | Passive indicator | Persistent | Unread notifications, pending items |

### Toast Anatomy

```
┌───────────────────────────────────────────┐
│  ✅  Changes saved successfully    [✕]   │
└───────────────────────────────────────────┘
```

### Rules

1. **Position**: Toasts at top-right corner; banners at top of page
2. **Stack**: Maximum 3 toasts visible; older ones dismiss first (FIFO)
3. **Duration**: Success = 3s, Info = 5s, Error = persistent (user must dismiss)
4. **Accessibility**: Use `role="alert"` and `aria-live="polite"` for screen readers
5. **Never notify for trivial events** — only what impacts the user's goals

### CSS Pattern

```css
.toast {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: var(--z-toast);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  animation: toast-slide-in var(--duration-normal) var(--ease-out);
}

@keyframes toast-slide-in {
  from { opacity: 0; transform: translateX(100%); }
  to   { opacity: 1; transform: translateX(0); }
}

.toast--success { border-left: 3px solid var(--color-status-success); }
.toast--error   { border-left: 3px solid var(--color-status-error); }
.toast--warning { border-left: 3px solid var(--color-status-warning); }
.toast--info    { border-left: 3px solid var(--color-status-info); }
```

---

## 15. Empty States & Error Handling

### Empty State Anatomy

```
┌──────────────────────────────────────┐
│                                      │
│         📦                           │
│                                      │
│    No offers yet                     │  ← Clear headline
│                                      │
│    Create your first offer to        │  ← Helpful description
│    start engaging customers.         │
│                                      │
│    [ + Create Offer ]                │  ← Actionable CTA
│                                      │
└──────────────────────────────────────┘
```

### Types of Empty States

| Type | Trigger | Content |
|------|---------|---------|
| **First-time use** | User hasn't created any items | Welcome message + CTA to create first item |
| **Zero search results** | Search/filter returns nothing | "No results found" + "Clear Filters" button |
| **Data unavailable** | API error or loading failure | Error message + "Retry" button |
| **Completed state** | All tasks done / inbox zero | Positive message + illustration |

### Error Handling Rules

1. **Use plain, non-technical language** — "Something went wrong" not "500 Internal Server Error"
2. **Show errors inline** near the affected element, not in a distant alert
3. **Always provide a recovery path** — "Retry", "Go Back", "Contact Support"
4. **Use error boundaries** — a single component failure must not crash the entire page
5. **Log errors silently** for debugging; show human-friendly messages to users

---

## 16. Micro-Animations & Transitions

### Core Principle: Motion as Communication

Every animation must have a **purpose**:
- **Feedback**: Confirm an action was received (button press)
- **Orientation**: Show where content came from or went to (page transition)
- **Focus**: Draw attention to something important (notification)
- **Delight**: Subtle polish that makes the UI feel alive (hover states)

### Duration Guidelines

| Animation Type | Duration | Easing |
|---------------|----------|--------|
| **Micro-interactions** (hover, focus) | 100–150ms | `ease-out` |
| **Element transitions** (expand, slide) | 200–300ms | `ease-out` |
| **Page transitions** | 300–500ms | `ease-in-out` |
| **Background animations** (shimmer) | 1000–2000ms | `ease-in-out` |

### Common Patterns

```css
/* ─── Card Hover (Tactile Press) ─── */
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
  transition: all var(--duration-fast) var(--ease-out);
}

.card:active {
  transform: scale(0.99);
  box-shadow: var(--shadow-xs);
}

/* ─── Fade In on Mount ─── */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in var(--duration-normal) var(--ease-out);
}

/* ─── Staggered List Items ─── */
.stagger-item {
  animation: fade-in var(--duration-normal) var(--ease-out) both;
}
.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 50ms; }
.stagger-item:nth-child(3) { animation-delay: 100ms; }
.stagger-item:nth-child(4) { animation-delay: 150ms; }

/* ─── Collapsible Sidebar ─── */
.sidebar {
  transition: width var(--duration-normal) var(--ease-out);
}

/* ─── Tooltip Appear ─── */
.tooltip {
  opacity: 0;
  transform: translateY(4px);
  transition: opacity var(--duration-fast), transform var(--duration-fast);
  pointer-events: none;
}
.trigger:hover .tooltip {
  opacity: 1;
  transform: translateY(0);
}
```

### Rules

1. **Keep it under 300ms** for interactive feedback — users perceive > 300ms as slow
2. **Use GPU-accelerated properties**: `transform` and `opacity` only; avoid `top`, `left`, `width`, `height`
3. **Respect `prefers-reduced-motion`** — disable or reduce all non-essential animations:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

4. **Never animate layout-critical elements** that could cause content shift
5. **Pair hover effects with `:focus-visible`** for keyboard users

---

## 17. Dark Mode Implementation

### Strategy: Semantic Token Overrides

```css
/* Light mode (default) */
:root {
  --color-bg-page:       var(--gray-50);
  --color-bg-surface:    #FFFFFF;
  --color-bg-elevated:   #FFFFFF;
  --color-bg-sunken:     var(--gray-100);
  --color-bg-sidebar:    var(--gray-900);
  --color-text-primary:  var(--gray-900);
  --color-text-secondary: var(--gray-500);
  --color-border-default: var(--gray-200);
  --card-shadow:         var(--shadow-xs);
}

/* Dark mode */
[data-theme="dark"] {
  --color-bg-page:        var(--gray-950);
  --color-bg-surface:     var(--gray-900);
  --color-bg-elevated:    var(--gray-800);
  --color-bg-sunken:      var(--gray-950);
  --color-bg-sidebar:     var(--gray-950);
  --color-text-primary:   var(--gray-50);
  --color-text-secondary: var(--gray-400);
  --color-border-default: var(--gray-700);
  --card-shadow:          none; /* Shadows invisible in dark mode */

  /* Accent colors shift lighter in dark mode */
  --color-interactive-primary: var(--accent-500);
  --color-text-link:           var(--accent-400);
}
```

### Rules

1. **Never use pure black** (`#000000`) — use `#0A0A0A` or `#121212`
2. **Elevation in dark mode** = lighter background, not shadows
3. **Desaturate status colors slightly** for dark backgrounds
4. **Test contrast ratios** for both modes (WCAG AA: 4.5:1)
5. **Transition smoothly** between themes:
```css
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### Theme Toggle Implementation

```javascript
// Check for saved preference or system preference
const getTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme immediately (place in <head> to prevent FOUC)
document.documentElement.setAttribute('data-theme', getTheme());

// Toggle function
const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
};
```

---

## 18. Responsive Design

### Breakpoints

| Name | Range | Layout |
|------|-------|--------|
| **Mobile (S)** | 0 – 480px | Single column, bottom nav, stacked cards |
| **Tablet (M)** | 481 – 768px | 2-column grid, collapsible sidebar |
| **Small Desktop (L)** | 769 – 1024px | Sidebar rail + content, 3-col grid |
| **Desktop (XL)** | 1025 – 1366px | Full sidebar + content, 4-col grid |
| **Wide (2XL)** | 1367px+ | Full layout, max-width container |

### Adaptation Patterns

```css
/* Mobile: stack everything */
@media (max-width: 768px) {
  .dashboard-layout {
    grid-template-areas:
      "header"
      "main";
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    z-index: var(--z-overlay);
    transform: translateX(-100%);
    transition: transform var(--duration-normal) var(--ease-out);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    padding: var(--space-4);
  }

  .card--half,
  .card--third,
  .card--quarter {
    grid-column: span 1;
  }
}

/* Tablet: collapsed sidebar */
@media (min-width: 769px) and (max-width: 1024px) {
  .dashboard-layout {
    grid-template-columns: var(--sidebar-width-collapsed) 1fr;
  }

  .dashboard-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .card--third { grid-column: span 3; }
  .card--quarter { grid-column: span 3; }
}

/* Desktop: full layout */
@media (min-width: 1025px) {
  .dashboard-grid {
    grid-template-columns: repeat(12, 1fr);
  }
}

/* Wide: constrain width */
@media (min-width: 1440px) {
  .main {
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

### Container Queries (Modern Approach)

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (max-width: 300px) {
  .kpi-card {
    flex-direction: column;
    text-align: center;
  }
}

@container card (min-width: 400px) {
  .kpi-card {
    flex-direction: row;
    justify-content: space-between;
  }
}
```

### Mobile-Specific Rules

1. **Touch targets**: Minimum 44px × 44px for all interactive elements
2. **No hover-dependent interactions** — everything must work with tap
3. **Progressive disclosure** — show summary first, details on drill-down
4. **Bottom sheet** for actions instead of dropdowns
5. **Swipe gestures** for common actions (delete, archive)

---

## 19. Accessibility (WCAG)

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Move between interactive elements |
| `Arrow Keys` | Navigate within composite widgets (tabs, menus, grids) |
| `Enter` / `Space` | Activate buttons, links, selections |
| `Escape` | Close modals, dropdowns, tooltips |

### Focus Management

```css
/* Always provide visible focus indicators */
:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* Remove default outline only when replacing with custom */
:focus:not(:focus-visible) {
  outline: none;
}
```

### ARIA Landmarks

```html
<body>
  <nav role="navigation" aria-label="Main navigation">...</nav>
  <header role="banner">...</header>
  <main role="main">
    <section aria-label="Key Metrics">...</section>
    <section aria-label="Recent Activity">...</section>
  </main>
</body>
```

### Rules

1. **Use native HTML elements** (`<button>`, `<a>`, `<input>`) — they have built-in keyboard support
2. **Never use `<div>` with `onClick`** without `role="button"`, `tabindex="0"`, and `onKeyDown`
3. **All images must have `alt` text** (or `alt=""` for decorative images)
4. **Color is never the only indicator** — pair with text, icon, or pattern
5. **Use `aria-live="polite"`** for dynamic updates (toast notifications, counters)
6. **Focus order must match visual order** — avoid positive `tabindex` values
7. **Test with keyboard-only** and screen reader before shipping

### Contrast Requirements

| Element | WCAG AA | WCAG AAA |
|---------|---------|----------|
| Normal text (< 18px) | 4.5:1 | 7:1 |
| Large text (≥ 18px bold / 24px) | 3:1 | 4.5:1 |
| UI components & graphics | 3:1 | — |

---

## 20. React Component Architecture

### Feature-Based Folder Structure

```
src/
├── assets/              # Static files (images, fonts, icons)
├── components/          # Shared/Global UI components
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   └── index.js
│   ├── Card/
│   ├── Input/
│   ├── Modal/
│   ├── Table/
│   ├── Toast/
│   └── Skeleton/
├── features/            # Feature-based modules
│   ├── dashboard/
│   │   ├── components/  # Dashboard-specific widgets
│   │   │   ├── KPICard.jsx
│   │   │   ├── ActivityFeed.jsx
│   │   │   └── QuickActions.jsx
│   │   ├── hooks/       # Dashboard-specific logic
│   │   ├── services/    # API calls
│   │   └── index.js     # Public exports
│   ├── brand-owner/
│   │   ├── components/
│   │   │   ├── OffersTab.jsx
│   │   │   ├── CodesTab.jsx
│   │   │   ├── AnalyticsTab.jsx
│   │   │   └── SettingsTab.jsx
│   │   ├── hooks/
│   │   └── index.js
│   └── auth/
├── hooks/               # Global custom hooks
├── layouts/             # Layout wrappers
│   ├── DashboardLayout.jsx
│   └── AuthLayout.jsx
├── lib/                 # Third-party initializations
│   └── supabase.js
├── pages/               # Route-level (thin) components
├── styles/              # Global CSS
│   ├── tokens.css       # Design tokens
│   ├── reset.css        # CSS reset
│   └── global.css       # Global styles
└── utils/               # Pure helper functions
```

### Component Rules

1. **Co-location**: Keep files close to where they are used
2. **Feature isolation**: Each `features/` folder is self-contained
3. **Thin pages**: Pages only compose features + layouts — no business logic
4. **Public API**: Use `index.js` to control what each feature exports
5. **Max file size**: If a component exceeds ~300 lines, split it into sub-components

### Component Anatomy

```jsx
// ComponentName.jsx
import './ComponentName.css';

/**
 * @param {Object} props
 * @param {string} props.title - The card title
 * @param {string} props.value - The metric value
 * @param {string} props.trend - "positive" | "negative" | "neutral"
 */
export function KPICard({ title, value, trend = 'neutral', trendValue }) {
  return (
    <article className="kpi-card" role="region" aria-label={title}>
      <span className="kpi-card__label">{title}</span>
      <span className="kpi-card__value">{value}</span>
      {trendValue && (
        <span className={`kpi-card__trend kpi-card__trend--${trend}`}>
          {trend === 'positive' ? '▲' : trend === 'negative' ? '▼' : '–'}
          {' '}{trendValue}
        </span>
      )}
    </article>
  );
}
```

---

## 21. Performance Checklist

| Area | Best Practice |
|------|--------------|
| **Images** | Use WebP/AVIF format; lazy-load below-the-fold images |
| **Fonts** | Use `font-display: swap`; preload critical font files |
| **CSS** | Use CSS variables instead of runtime theme computation |
| **Animations** | Only animate `transform` and `opacity` (GPU-accelerated) |
| **Data Loading** | Load above-the-fold KPIs first; lazy-load charts and tables |
| **Bundle** | Code-split by route; tree-shake unused components |
| **Caching** | Cache API responses with appropriate TTLs |
| **Rendering** | Use `React.memo()` for expensive list items; virtualize long lists |

---

## 22. Quick Reference Cheatsheet

### Spacing Quick Reference

```
Tight:     4px   (icon-label gap, inline spacing)
Default:   8px   (form element gaps, compact lists)
Comfy:     12px  (input padding, small sections)
Standard:  16px  (card padding compact, sub-sections)
Spacious:  24px  (card padding default, grid gaps)
Section:   32px  (between major sections)
Page:      48-64px (page-level vertical rhythm)
```

### Shadow Quick Reference

```
Flat:      none                    (cards in dark mode)
Subtle:    0 1px 2px rgba(0,0,0,0.05)   (default cards)
Raised:    0 4px 6px rgba(0,0,0,0.1)    (hover state, dropdowns)
Floating:  0 10px 15px rgba(0,0,0,0.1)  (modals, popovers)
```

### Border Radius Quick Reference

```
Sharp:     2px   (badges, tags)
Soft:      6px   (inputs, small buttons)
Rounded:   8px   (cards, containers)
Pill:      9999px (avatar, status dots, rounded buttons)
```

### Animation Quick Reference

```
Hover:     150ms ease-out   (instant feedback)
Expand:    250ms ease-out   (accordion, dropdown)
Page:      350ms ease-in-out (route transition)
Attention: 600ms ease-in-out (pulse, shake)
```

### Semantic Color Quick Reference

```
Success:   #22C55E on #F0FDF4   (green on light-green bg)
Error:     #EF4444 on #FEF2F2   (red on light-red bg)
Warning:   #F59E0B on #FFFBEB   (amber on light-amber bg)
Info:      #3B82F6 on #EFF6FF   (blue on light-blue bg)
```

---

> **Last Updated**: August 2026
> **Sources**: Research compiled from uxpilot.ai, adminlte.io, aufaitux.com, orbix.studio,
> medium.com, dev.to, uxplanet.org, nngroup.com, muz.li, fanruan.com, navbar.gallery,
> designsystemscollective.com, css-tricks.com, mozilla.org, w3.org, balsamiq.com,
> eleken.co, uxdesign.cc, and other UX industry publications (2025–2026).
