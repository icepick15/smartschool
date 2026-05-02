# SmartSchool — Claude Code Build Prompt
### Ice Resources Operating · SmartS School v1.0 · Confidential

---

## 0. CONTEXT & MISSION

You are building **SmartSchool** — the first product under the **SmartS** brand by **Ice Resources Operating**. It is a multi-role school management platform built for Nigerian schools. The three portals are:

- **Admin / Proprietress (MD)** — Command Center: finances, broadsheet, fee recovery, payroll approvals
- **Teacher** — Score entry, CA tracking, behaviour pulse, analytics
- **Parent** — Academic report, subject heatmap, performance trends, fee status

The branding is defined in `Brand_Identity.html` in this project. **That file is the single source of truth for all design decisions.** Every screen must feel like it belongs to that system.

---

## 1. BRAND SYSTEM (from `Brand_Identity.html`)

### 1.1 Parent Company & Product Line
```
Ice Resources Operating (IRO)
└── SmartS (technology division)
    └── SmartS School  ← this product (in development)
    └── SmartS Ops     (planned)
    └── SmartS Insights (planned)
```

### 1.2 Logo — SmartS Mark
The logo is a fluid S-curve SVG mark with a gradient stroke. Use it as a React component:

```tsx
// SmartSMark.tsx — copy from Brand_Identity.html
function SmartSMark({ size = 40, c1 = "#7C3AED", c2 = "#6366F1" }) {
  const uid = "g" + size + c1.replace("#", "");
  return (
    <svg width={size} height={size} viewBox="0 0 40 44" fill="none">
      <defs>
        <linearGradient id={uid} x1="30" y1="7" x2="10" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <path
        d="M 31 8 C 20 7 8 10 8 17 C 8 24 33 21 33 30 C 33 38 20 39 9 38"
        stroke={`url(#${uid})`} strokeWidth="5.5" strokeLinecap="round" fill="none"
      />
    </svg>
  );
}
```

**Wordmark:** `SmartSMark` + "SmartSchool" text in Syne 800, letter-spacing -0.04em.  
In the product header, render: `SmartS` (Syne 800) + a SCHOOL chip badge beside it.

### 1.3 Typography — 3-Font System

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display / H1 | **Syne** | 800 | Page titles, hero numbers, screen headers |
| H2 | Syne | 700 | Section headers, card titles |
| H3 | Syne | 600 | Sub-section titles |
| Body / UI | **DM Sans** | 400–600 | All body text, labels, nav items, descriptions |
| Data / Labels | **DM Mono** | 400–500 | Ref numbers, timestamps, monospace values, badge chips |
| Button | DM Sans | 600 | All button text |

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 1.4 Colour Palette — Dark-First

#### Background & Surface Scale
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-base` | `#0A0A0F` | Page background |
| `--bg-shell` | `#0D0D14` | App shell, sidebar, nav |
| `--surface` | `#111118` | Cards, panels |
| `--surface-2` | `#16161F` | Nested cards, input bg, row hover |
| `--border` | `#1E1E2E` | All dividers, borders |
| `--border-subtle` | `#252535` | Input borders, faint separators |

#### Brand Accent — Violet-Led
| Token | Hex | Usage |
|-------|-----|-------|
| `--accent` | `#7C3AED` | Primary action, CTA buttons, active states |
| `--accent-hover` | `#6D28D9` | Button hover / pressed |
| `--accent-light` | `#A78BFA` | Light variant, links, highlights |
| `--accent-2` | `#6366F1` | Secondary accent, charts, tertiary UI |
| `--accent-glow` | `#818CF8` | Glow effects, indigo tertiary |

#### Text Scale
| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#F0F0FF` | Headings, key values |
| `--text-secondary` | `#C4C4E0` | Body text, descriptions |
| `--text-muted` | `#8B8BA7` | Captions, meta |
| `--text-subtle` | `#5A5A7A` | Placeholders, empty state text |
| `--text-ghost` | `#4A4A6A` | Mono labels, timestamps |

#### Semantic / Status Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#10B981` | Paid, approved, online, unlocked |
| `--warning` | `#F59E0B` | Pending, locked fees, partial payment |
| `--danger` | `#EF4444` | Error, unpaid, declined, offline |
| `--info` | `#3B82F6` | Informational, charts, secondary data |

> **Note:** The functional status banner uses `--success` (online) and `--danger` (offline). All greens in fee/score contexts use `--success` (#10B981), not a separate school-green.

### 1.5 Component Specs

#### Cards
```css
background: var(--surface);         /* #111118 */
border: 1px solid var(--border);    /* #1E1E2E */
border-radius: 12px;
padding: 16px–24px;
box-shadow: none; /* flat, dark. Add glow for active/featured cards only */
```

#### Buttons
```css
/* Primary */
background: #7C3AED;
color: #FFFFFF;
border-radius: 8px;
font-family: 'DM Sans'; font-weight: 600; font-size: 14px;
padding: 10px 18px;
hover: background #6D28D9;
active: transform scale(0.97);

/* Secondary */
background: #16161F;
color: #A78BFA;
border: 1px solid #252535;

/* Ghost */
background: transparent;
color: #6B6B8A;
hover: color #A78BFA;

/* Danger */
background: #1F1010;
color: #FCA5A5;
border: 1px solid #3B0000;

/* Full-width CTA (used on mobile / bottom of forms) */
height: 52px; width: 100%; border-radius: 10px;
```

#### Inputs
```css
background: #0A0A0F;
border: 1px solid #252535;
border-radius: 8px;
padding: 10px 14px;
color: #F0F0FF;
font-family: 'DM Sans'; font-size: 14px;
focus: border-color #7C3AED; outline none;
```

#### Badges / Chips
```css
border-radius: 100px; /* pill */
padding: 2px 10px;
font-family: 'DM Sans'; font-weight: 600; font-size: 11px;
background: {color}22; /* 13% opacity of the token color */
color: {color};
```

#### Status Banner (top of every screen)
```css
height: 32px;
font-family: 'DM Mono'; font-size: 11px; font-weight: 500;
/* Online */  background: #10B981; color: white; text: "● Online — SmartSchool · Sunshine Academy, Lagos"
/* Offline */ background: #EF4444; color: white; text: "⚡ You're offline — Saving locally"
```

#### Bottom Navigation (mobile, 4 tabs)
```css
height: 72px; background: #0D0D14; border-top: 1px solid #1E1E2E;
tabs: Home | Scores | Pulse | Messages
active-color: #7C3AED; active-bg: rgba(124,58,237,0.12); border-radius: 10px;
inactive-color: #5A5A7A;
icon-size: 22px; label: DM Sans 10px 600;
```

#### Score Cell (score entry grid)
```css
width: 48px; height: 40px;
background: #16161F; border: 1px solid #252535; border-radius: 7px;
text: center, DM Mono 14px 500, #F0F0FF;
focus: border #7C3AED; background rgba(124,58,237,0.05);
numeric keypad on focus (mobile);
```

#### Student Avatar
```css
/* initials circle */
background: #7C3AED22; color: #A78BFA;
font-family: 'DM Sans'; font-weight: 700;
sizes: 30px (rows), 36px (cards), 44px (headers);
border-radius: 50%;
```

---

## 2. TECH STACK & PROJECT SETUP

```
Framework:    React 18 + TypeScript
Styling:      Tailwind CSS v3 (with CSS variables for brand tokens)
Icons:        Lucide React (stroke-width: 2px, size: 20px default)
Routing:      React Router v6
State:        useState + useContext (no Redux needed for MVP)
Charts:       Recharts
Fonts:        Google Fonts (Syne + DM Sans + DM Mono)
Build:        Vite
```

### Folder Structure
```
src/
├── components/
│   ├── brand/
│   │   ├── SmartSMark.tsx        ← SVG logo from Brand_Identity.html
│   │   ├── SmartSWordmark.tsx    ← logo + name lockup
│   │   └── StatusBanner.tsx      ← online/offline top strip
│   ├── ui/
│   │   ├── Button.tsx            ← primary / secondary / ghost / danger
│   │   ├── Badge.tsx             ← pill chip with color variants
│   │   ├── Card.tsx              ← base card container
│   │   ├── Input.tsx             ← styled input field
│   │   ├── ScoreCell.tsx         ← score entry cell
│   │   ├── StudentAvatar.tsx     ← initials circle
│   │   ├── BottomNav.tsx         ← mobile nav bar
│   │   ├── CircularProgress.tsx  ← ring chart with center label
│   │   ├── ProgressBar.tsx       ← thin horizontal bar
│   │   ├── StarRating.tsx        ← 5-star tap-to-fill
│   │   ├── BottomSheet.tsx       ← slide-up modal
│   │   ├── Toast.tsx             ← slide-up notification
│   │   ├── EmptyState.tsx        ← emoji + title + desc + optional CTA
│   │   ├── SkeletonCard.tsx      ← shimmer loading placeholder
│   │   └── HeatmapCell.tsx       ← color-coded score square
│   └── layout/
│       ├── AdminShell.tsx        ← desktop sidebar layout
│       ├── MobileShell.tsx       ← mobile screen wrapper
│       └── SideNav.tsx           ← admin sidebar navigation
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── SplashPage.tsx
│   ├── admin/
│   │   ├── DashboardPage.tsx     ← Command Center
│   │   ├── AcademicPage.tsx
│   │   ├── RevenuePage.tsx       ← Revenue Gate
│   │   ├── ReconciliationPage.tsx
│   │   ├── InventoryPage.tsx
│   │   ├── PayrollPage.tsx
│   │   └── ApprovalsPage.tsx
│   ├── teacher/
│   │   ├── TeacherHomePage.tsx
│   │   ├── BroadsheetListPage.tsx
│   │   ├── ScoreGridPage.tsx
│   │   ├── ResultGatePage.tsx
│   │   ├── PulsePage.tsx
│   │   └── AnalyticsPage.tsx
│   └── parent/
│       ├── ParentHomePage.tsx
│       ├── SubjectHeatmapPage.tsx
│       ├── TrendPage.tsx
│       └── ComparisonPage.tsx
├── hooks/
│   ├── useOnlineStatus.ts
│   └── useAutoSave.ts
├── constants/
│   └── tokens.ts                 ← brand CSS variables as JS constants
└── styles/
    ├── globals.css               ← CSS variable declarations + base reset
    └── tailwind.config.ts
```

### CSS Variables (globals.css)
```css
:root {
  --bg-base: #0A0A0F;
  --bg-shell: #0D0D14;
  --surface: #111118;
  --surface-2: #16161F;
  --border: #1E1E2E;
  --border-subtle: #252535;

  --accent: #7C3AED;
  --accent-hover: #6D28D9;
  --accent-light: #A78BFA;
  --accent-2: #6366F1;
  --accent-glow: #818CF8;

  --text-primary: #F0F0FF;
  --text-secondary: #C4C4E0;
  --text-muted: #8B8BA7;
  --text-subtle: #5A5A7A;
  --text-ghost: #4A4A6A;

  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #3B82F6;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg-base); color: var(--text-primary); font-family: 'DM Sans', sans-serif; }
::selection { background: #7C3AED44; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg-shell); }
::-webkit-scrollbar-thumb { background: #252535; border-radius: 3px; }
```

---

## 3. SCREEN SPECIFICATIONS

> All mobile screens: **375 × 812px** (iPhone 14/15).  
> Admin portal: **Desktop-first** responsive layout with 216px sidebar.  
> Safe areas: top 44px | bottom 34px.

---

### SCREEN 01 — Splash Screen

**Purpose:** 2-second app launch screen.

**Layout:**
- Full screen background: `var(--bg-base)` `#0A0A0F`
- Center: `SmartSMark` size 80px, c1 `#7C3AED`, c2 `#6366F1`
- Below: "SmartSchool" — Syne 28px 800, `#F0F0FF`, letter-spacing -0.04em
- Below: "Your school is smart with us." — DM Sans 15px 400, `#5A5A7A`, centered, max-width 260px
- Bottom (44px from bottom): DM Mono 11px, `#4A4A6A` — "IRO · SmartS School · v1.0"
- Ambient glow: `#7C3AED` blurred circle 400px, opacity 0.12, top-right corner
- Animation: center group pulses scale(1) → scale(1.05) → scale(1), 2s ease-in-out

---

### SCREEN 02 — Login Screen

**Purpose:** Role selection + phone + PIN entry.

**Layout (top to bottom):**
- Status Banner (online, `#10B981`)
- Logo lockup centered, padding-top 32px
- "Welcome back" — Syne 22px 700, `#F0F0FF`
- "Sunshine Academy, Lagos" — DM Sans 13px, `#5A5A7A`
- Role selector — 2 cards, gap 12px:
  - Card 1: "Teacher" 👩‍🏫 | Card 2: "MD / Bursar" 💼
  - Card base: `var(--surface)` bg, border `var(--border)`, border-radius 12px, padding 18px
  - Selected: border `#7C3AED`, box-shadow `0 0 0 1px #7C3AED`, scale(1.02)
  - Emoji: 28px | Label: DM Sans 12px 700, `#F0F0FF`
- Form fields (gap 10px):
  - Label: DM Sans 12px 600, `#8B8BA7`
  - Input: "Enter your school phone" (tel)
  - Input: "PIN / 2FA Code" (password, show dots)
- Primary button: "Continue →" full-width, `#7C3AED`
- Forgot PIN — DM Sans 13px centered: "Forgot PIN?" + "WhatsApp support 💬" in `#A78BFA` 600
- Offline badge (bottom): DM Mono 11px, `#5A5A7A`, icon 🔒, "Offline mode · Login works without internet"

---

### SCREEN 03 — Teacher Home / Dashboard

**Purpose:** Teacher's main hub.

**Header bar (sticky, bg `var(--bg-shell)`):**
- Left: SmartSMark 36px
- Right: "Good morning ☀️" DM Sans 11px `#5A5A7A` + teacher name Syne 15px 700 `#F0F0FF`

**Hero recovery card (full-width):**
- Background: linear-gradient(135deg, #7C3AED → #4C1D95)
- Border-radius: 16px; padding: 20px
- Left: "Fee Recovery · This Term" 11px white 60% opacity
- Large: "78%" Syne 38px 800 white
- Delta: "↑ +12% vs last term" 11px white 55% opacity
- Inner badge: rgba(255,255,255,0.15) bg, "🏆 ₦420k recovered via Result Gate", DM Sans 11px 600 white
- Right: Circular progress ring 88×88px — stroke white 20% bg, white fill, center "78%" Syne 18px 800 white

**Quick Actions grid (2×2, gap 12px):**
| | |
|---|---|
| 📝 "Enter Scores" / "Broadsheet" | ⭐ "Friday Pulse" / "Behaviour" |
| 📋 "View Results" / "Result Gate" | 📊 "Analytics" / "Trendlines" |

- Card: `var(--surface)` bg, border `var(--border)`, border-radius 14px
- Icon container: 44×44px, border-radius 12px, colored bg at 15% opacity of accent
- Icon bg colors: `#7C3AED18`, `#F59E0B18`, `#6366F118`, `#10B98118`
- Title: DM Sans 13px 700 `#F0F0FF` | Subtitle: DM Sans 11px `#5A5A7A`

**Today at a Glance card:**
- 3 rows: label left, value right, 1px `var(--border)` dividers
- "Students Present" → "142 / 158" in `#10B981`
- "Scores Pending" → "3 subjects" in `#F59E0B`
- "Fees Collected Today" → "₦156,000" in `#A78BFA`

**Bottom:** BottomNav (Home active)

---

### SCREEN 04 — Broadsheet Subject List

**Purpose:** Select subject to enter scores.

**Header:** Back arrow + "CA1 – Primary 3" (Syne 17px 700) + "Term 1" badge (`#7C3AED`)

**Search bar:** Full width, DM Sans 14px, placeholder "🔍 Search subjects…", bg `var(--surface-2)`

**Subject list (scrollable):** Each item — bg `var(--surface)`, border `var(--border)`, height 68px, border-radius 12px:
- Left: 40×40px icon container (bg colored, border-radius 10px) + subject emoji
- Center: Subject name DM Sans 14px 600 `#F0F0FF` + "34 students · CA1" 11px `#5A5A7A`
- Right: chevron `#4A4A6A`

Subjects: Mathematics 🔢 · English Language 📚 · Basic Science 🔬 · Social Studies 🌍 · Yoruba 🗣️ · Agric 🌱 · Computer 💻 · P.E. 🏃 · Fine Arts 🎨 · Music 🎵

---

### SCREEN 05 — Broadsheet Score Grid

**Purpose:** Enter CA1, CA2, Exam scores per student.

**Header:** Back + "Mathematics" (Syne 17px 700) + "CA1 · Primary 3 · 34 students"

**Auto-save indicator:** DM Mono 10px 500, `#10B981` — "✓ Auto-saved" (appears every 3s, fades out)

**Offline banner (when offline):** `#F59E0B18` strip — "💾 Offline – All changes saving locally" DM Sans 12px `#F59E0B`

**Column headers:** DM Mono 10px 700 uppercase `#5A5A7A` — Student | CA1 | CA2 | Exam | Total | Pos

**Student rows** (each a card, bg `var(--surface)`, border-radius 10px, mb 4px):
- Student: 28px avatar + name DM Sans 11px 700 `#F0F0FF`
- CA1, CA2: ScoreCell 48×40px
- Exam: ScoreCell 58×40px
- Total: DM Mono 14px 800, color-coded:
  - ≥70: `#10B981` | 50–69: `#F59E0B` | <50: `#EF4444`
- Position: DM Mono 10px `#5A5A7A`

**Sticky bottom CTA:** "🎓 Generate Report Cards for 34 Students" — full width, `#10B981` bg, DM Sans 14px 700 white, border-radius 10px, subtle pulse glow animation

---

### SCREEN 06 — Report Generation Loading

**Layout (centered):**
- 📋 emoji 64px, pulsing
- "Generating Report Cards…" Syne 20px 700 `#F0F0FF`
- "187 students · Term 1 · Primary 1–6" DM Sans 13px `#5A5A7A`
- Progress bar: height 10px, border-radius 99px, bg `var(--border)`, fill `#10B981`, glow `0 0 10px #10B98166`
- "87% complete" — Syne 18px 800 `#10B981`
- 5 stacked PDF rectangles 40×54px, rotating -8° to +8°, turning `#7C3AED` as progress passes
- DM Sans 12px `#5A5A7A` — "PDFs flying out of the printer… 📤"

---

### SCREEN 07 — Results Ready / Result Gate

**Top success banner:**
- 🎉 52px centered
- "All Report Cards Ready!" Syne 20px 700 `#F0F0FF`
- "187 beautiful PDF reports generated" DM Sans 13px `#5A5A7A`
- Confetti: `#7C3AED` + `#A78BFA` + `#10B981` + `#F59E0B` particles burst on load

**Summary strip (3 cols):** Total · Unlocked (`#10B981`) · Locked (`#F59E0B`)

**Result cards:**

*Unlocked:*
- Border: 1px solid `#10B98133`
- Avatar + name + "Position 1/34 · Avg 82%"
- Badge: ✅ "Result unlocked" (`#10B981`)
- Button: "Download PDF ↓" secondary variant

*Locked:*
- Border: 1px solid `#F59E0B33`
- Avatar + name + position
- Badge: 🔒 "Locked · ₦18,500 owed" (`#F59E0B`)
- Button: "Pay & Unlock" bg `#7C3AED`

---

### SCREEN 08 — Payment Bottom Sheet

**Bottom sheet** (slides up, handle bar 4×36px `var(--border)` centered):
- "Unlock Result 🔓" Syne 17px 700 `#F0F0FF`
- Student info card: name, class, amount Syne 24px 800 `#A78BFA`
- Tip: 💡 "Pay once — result downloads instantly. WhatsApp receipt sent automatically." bg `#10B98112` DM Sans 12px
- Button 1: "Pay via Paystack / Card" bg `#7C3AED`
- Button 2: "Pay via Flutterwave" — secondary, border `#6366F1`
- Button 3: "Bank Transfer (Manual)" — ghost
- Cancel: DM Sans 14px `#5A5A7A` centered

**Success state:**
- Full screen `#0A0A0F` with `#10B981` glow
- ✅ 64px spring pop
- "Result Unlocked! 🎉" Syne 22px 800 `#F0F0FF`
- "Receipt sent to parent via WhatsApp" DM Sans 14px `#5A5A7A`
- Confetti burst: `#7C3AED` + `#A78BFA` + `#10B981`

---

### SCREEN 09 — Admin Command Center (Desktop)

**Shell:** 216px left sidebar (`var(--bg-shell)`, border-right `var(--border)`) + main content area

**Sidebar:**
- Top: SmartSWordmark + "SCHOOL" chip badge + "ONLINE" dot `#10B981`
- School name: DM Sans 12px `#5A5A7A`
- Nav sections:
  ```
  CORE
    Dashboard (active)
    Academic
  FINANCIALS
    Revenue Gate
    Reconciliation
  OPERATIONS
    Inventory
    Payroll
    Approvals
  ```
- Active item: bg `#7C3AED14`, border-left 2px `#7C3AED`, text `#C4B5FD`
- Inactive: text `#5A5A7A`
- Bottom: user pill (email + Sign out)

**Main header:** "Command Center" Syne 26px 800 `#F0F0FF` + "Real-time overview of your school" DM Sans 13px `#5A5A7A` + "TERM 2 · 2025/2026" badge

**4 KPI cards (grid, gap 16px):**

| Card | Icon | Value | Delta |
|------|------|-------|-------|
| CASH AT BANK | 💳 | ₦24.3M | +₦1.2M this week |
| OUTSTANDING FEES | ⚠️ | ₦12.45M | 242 students |
| STUDENTS | 👥 | 1,248 | 32 new this term |
| FEE RECOVERY | 📈 | 78% | +6% vs last term |

- Card: `var(--surface)`, border `var(--border)`, border-radius 12px
- Label: DM Mono 10px uppercase `#5A5A7A`
- Value: Syne 28px 800 `#F0F0FF`
- Delta: DM Sans 11px `#10B981` or `#EF4444`

**Revenue Gate Active banner:** bg `#10B98112`, border `#10B98133`, "Revenue Gate Active" DM Sans 14px 700 `#10B981`, subtext `#5A5A7A` + "View Recovery List →" button

**Digital Broadsheet table:**
- Section: "JSS 3 Alpha — Digital Broadsheet" Syne 16px 700 + "Continuous assessment · live preview" + Print + Generate Reports buttons
- Table headers: DM Mono 10px uppercase `#5A5A7A`
- Locked row: amber left border `#F59E0B`, row text `#8B8BA7`
- Grade badges: A+ `#10B981` | A `#6366F1` | B `#F59E0B`

**Results Locked panel (right side):**
- bg `var(--surface)`, border `1px solid #F59E0B33`, border-radius 12px
- 🔒 icon 40px `#F59E0B`
- "Results Locked" Syne 16px 700 `#F0F0FF`
- Student name + outstanding amount in `#EF4444`
- Fee breakdown table: Term fees / Paid / Balance
- "PAY & UNLOCK NOW" — full width, bg `#7C3AED`

**Reconciliation History:** "No payments yet" EmptyState with 💳 icon

---

### SCREEN 10 — Friday Behavioral Pulse

**Purpose:** Teacher rates each student's weekly behaviour.

**Header:** gradient `#7C3AED → #4C1D95`, back arrow + "Friday Pulse 📊" Syne 17px 700 white

**Nudge banner:** bg `#7C3AED12`, "🔔 It's Friday! Rate your class — takes 60 seconds." DM Sans 12px `#A78BFA`

**Progress:** "X/34 students rated" + percentage, thin `#10B981` bar

**Student cards:**
- bg `var(--surface)`, border `var(--border)`, border-radius 12px
- Completed: border `#10B98133`, ✓ badge
- 3 rating rows — Neatness ✨ | Conduct 🤝 | Punctuality ⏰
- Label: DM Sans 12px `#8B8BA7`; 5 stars: ☆ `#252535` → ⭐ `#F59E0B` on tap; tap: scale(1.3)

**Submit:** "✓ Submit for All 34 Students →" bg `#7C3AED` full-width

**Success screen:** Full `#0A0A0F` + `#10B981` glow + 🎉 + "Parents Notified!" + confetti

---

### SCREEN 11 — SmartSpend List (Admin/MD)

**Header:** "SmartSpend 💰" Syne 17px 700 + "Imprest Requests" DM Sans 12px `#5A5A7A`

**Stats strip (3 cols, bg `#6366F112`):** Total Requests | Pending (`#F59E0B`) | Approved (`#10B981`)

**Filter tabs:** All | Pending | Approved | Declined — pill buttons, active `#7C3AED`

**Expense cards:**
- Left: 40×40px icon container, category emoji
- Center: purpose 13px 700 `#F0F0FF` + requester + date 11px `#5A5A7A`
- Right: amount Syne 14px 800 `#F0F0FF` + status badge

**Pending card extras (MD view):**
- ✗ decline: 32×32px, bg `#EF444412`, icon `#EF4444`
- ✓ approve: 32×32px, bg `#10B98112`, icon `#10B981`

---

### SCREEN 12 — New Expense Request (Teacher)

**Form fields:**
- Amount: "₦" prefix, DM Mono, large 24px input
- Category: dropdown with chevron
- Description: textarea, 3 lines

**Receipt photo section:**
- Dashed border `#252535`, height 140px, border-radius 14px
- Empty: 📷 `#4A4A6A` + "Tap to snap receipt" 14px + "GPS auto-stamp included" DM Mono 11px `#5A5A7A`
- Captured: 📸 + "Receipt captured ✓" `#10B981`, border turns `#10B981`
- GPS badge: DM Mono 10px `#10B981` + coordinates + timestamp

**Submit:** "Submit for MD Approval ↗" bg `#7C3AED`

---

### SCREEN 13 — Academic Analytics

**Header:** "Academic Analytics 📊" Syne 17px 700 + "Trendlines · Heatmap · Comparison" DM Sans 12px `#5A5A7A`

**Student selector:** Horizontal scrollable pills, active `#7C3AED` white text

**Rank badge card:**
- Left: 52×52px `#6366F112` rounded, "#1" Syne 24px 800 `#6366F1`
- Right: name + "Rank 1 of 34 students" + "+9 pts vs class avg" `#10B981`

**Trendline chart card:**
- Recharts LineChart, height 200px
- Lines: Math `#6366F1` | English `#F59E0B` | Science `#7C3AED` | Social `#10B981`
- bg `var(--surface)`, grid lines `#1E1E2E`, tooltip bg `#16161F`

**Subject Heatmap:**
- Row: subject name 80px right-aligned + colored squares 24×28px, border-radius 4px
- Colors: `#EF4444` <55 | `#F59E0B` 55–64 | `#F59E0B` 65–74 | `#6366F1` 75–84 | `#10B981` 85+
- Score inside: DM Mono 8px 700

**Class Comparison:**
- Recharts BarChart — surface `var(--border)` | student `#7C3AED`
- Delta chips: +n `#10B981` | -n `#EF4444`

**AI Recommendation card:**
- bg gradient `#7C3AED0A → #6366F10A`, border `#7C3AED25`
- 🌟 + "AI Recommendation" DM Sans 11px 700 `#A78BFA`
- Text DM Sans 13px `#C4C4E0`, line-height 1.75
- Tags: "💪 Strength: Mathematics" (`#10B981`) + "📖 Focus: Yoruba" (`#F59E0B`)

---

### SCREEN 14 — Messages / Comms Inbox

**Header:** "Messages 💬" Syne 17px 700 + unread count DM Sans 12px `#5A5A7A` + "+ New" btn `#7C3AED`

**Message cards:**
- Unread: left border 3px `#7C3AED`, title `#F0F0FF`, unread dot 8px `#7C3AED`
- Read: left border `#1E1E2E`, title `#8B8BA7`
- Icon containers: fee reminder `#F59E0B12` | newsletter `#6366F112` | pulse `#10B98112`
- Timestamp: DM Mono 10px `#4A4A6A`
- Delivery count: DM Mono 10px `#4A4A6A` — "📤 340 sent · ✅ 338 delivered"

---

### SCREEN 15 — Compose Message Bottom Sheet

- Type selector pills: Newsletter | Fee Reminder | Announcement — active `#7C3AED`
- Title input
- Message textarea (height 112px, char count DM Mono 11px `#4A4A6A` bottom-right)
- Delivery notice: bg `#10B98112`, "📲 Will be delivered to all class parents via WhatsApp" DM Sans 12px `#10B981`
- "Send to All Parents →" full-width `#7C3AED` btn

---

### SCREEN 16 — Fee Ledger (Admin/MD)

**Header:** "Fee Ledger" Syne 17px 700 + term + download icon btn

**Class selector:** horizontal scrollable pills

**Summary (3 cards):** Expected `#6366F1` | Collected `#10B981` | Owed `#EF4444`

**Search + filter tabs:** All | Paid | Partial | Unpaid

**Fee record cards:**
- Name + class
- Status badge: Paid `#10B981` | Partial `#F59E0B` | Unpaid `#EF4444`
- Progress bar matching badge color
- Last payment date + ref: DM Mono 10px `#4A4A6A`

---

### SCREEN 17 — Offline State

**Banner:** `#EF4444` bg — "⚡ You're offline – Saving locally"

All screen content remains fully functional underneath. Every editable card shows "💾 Saved locally" badge in `#F59E0B`.

**Sync toast (back online):** `#10B981` slides up from bottom — "🌐 Back online – syncing…"

---

### SCREEN 18 — Error Screen

- 😕 64px
- "Something went wrong" Syne 20px 700 `#F0F0FF`
- "Your data is safe — everything was saved locally." DM Sans 14px `#5A5A7A`
- Error ID: DM Mono 11px `#4A4A6A`
- "Try again" + "WhatsApp support" buttons side by side

---

### SCREEN 19 — Empty States

Each has: large emoji 56px + Syne 16px 700 title + DM Sans 13px `#5A5A7A` description + optional CTA.

| Context | Emoji | Title | Description |
|---------|-------|-------|-------------|
| No scores | 📝 | No scores entered | Select a subject above to start |
| No results | 📋 | No reports yet | Generate report cards above |
| No messages | 📭 | No messages yet | Send a newsletter or fee reminder |
| All fees paid | 💚 | All cleared! | No outstanding fees this week |
| No expenses | 🧾 | No requests | No expense requests match this filter |

---

### SCREEN 20 — Loading Screen

- SmartSMark 48px in `#7C3AED22` rounded square, pulsing
- Three bouncing dots: bg `#7C3AED`, 8×8px, staggered 0 / 150 / 300ms
- DM Mono 11px `#4A4A6A` — "Securing your session…"

---

### SCREEN 21 — 404 Not Found

- 🔍 64px
- "Page not found" Syne 24px 800 `#F0F0FF`
- "This page doesn't exist or has moved." DM Sans 14px `#5A5A7A`
- "Go home" btn `#7C3AED`

---

### SCREEN 22 — Success / Confetti Moment (Reusable)

**Reusable component `<SuccessScreen />`:**
- bg `var(--bg-base)` + radial glow `#10B981` or `#7C3AED` from center
- Large emoji prop — spring pop animation
- Title Syne 22px 800 `#F0F0FF`
- Subtitle DM Sans 14px `#8B8BA7`
- Confetti: 22 particles — `#7C3AED` + `#A78BFA` + `#10B981` + `#F59E0B`, staggered 0–0.5s, 0.9s fall
- CTA button: bg `#7C3AED`

**Props:**
```tsx
interface SuccessScreenProps {
  emoji: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCta: () => void;
  glowColor?: string;  // default: #7C3AED
}
```

---

## 4. PARENT PORTAL

### Parent Home
- Student name: Syne 20px 700 `#F0F0FF`
- Class + Term: DM Sans 13px `#5A5A7A`

**4 stat cards:**
| | |
|---|---|
| OVERALL SCORE: 88/100 · Grade A | CLASS AVERAGE: 83/100 |
| RELATIVE POSITION: +5 above avg | FEES STATUS: ✅ Cleared |

**Subject Report table:**
- Headers: DM Mono 10px uppercase `#5A5A7A`
- Grade badges: A+ `#10B981` | A `#6366F1` | B `#F59E0B`
- Class avg column: DM Sans 12px `#5A5A7A`

**Tab navigation (horizontal scrollable):**
📄 Academic Report | 🟦 Subject Heatmap | 📈 Performance Trend | ⚖️ vs Class Average

---

## 5. MICRO-INTERACTIONS & ANIMATION

```
Button tap:        transform scale(0.97), 150ms ease
Card tap:          transform scale(0.98), 150ms ease
Screen transition: slideUp 350ms cubic-bezier(0.16, 1, 0.3, 1)
Success toast:     slideUp from bottom, 300ms ease-out
Confetti:          particles fall from center, staggered 0–0.5s
Number change:     fade + translateY(-8px) → 0, 400ms
Progress fill:     width 0% → target%, 1200ms ease
Star tap:          scale(1.3) pop, 100ms spring
Score cell focus:  border-color #7C3AED, bg rgba(124,58,237,0.05), 100ms
```

---

## 6. PROTOTYPE FLOW

```
Splash (2s auto) → Login

Login → Teacher role  → Teacher Home
Login → MD role       → Admin Command Center

Teacher Home → Broadsheet       → Subject List → Score Grid → Generate → Loading → Results Ready → Payment Sheet → Success
Teacher Home → Friday Pulse     → Pulse Screen → Submit → Parents Notified
Teacher Home → Analytics        → Academic Analytics
Teacher Home → Messages (tab)   → Compose Sheet

Admin Cmd Ctr → Revenue Gate    → Fee Ledger
Admin Cmd Ctr → SmartSpend      → List → New Request Form → Success
Admin Cmd Ctr → Payroll
Admin Cmd Ctr → Approvals

Any screen → Messages (bottom nav)
Offline drop → Offline Banner overlays active screen
Back online  → Sync toast
```

---

## 7. COMPONENT PRIORITY ORDER

Build in this order for fastest demo-ready state:

1. `globals.css` — CSS variables, base reset
2. `SmartSMark.tsx` + `SmartSWordmark.tsx` — logo (copy from Brand_Identity.html)
3. `Button.tsx`, `Badge.tsx`, `Card.tsx`, `Input.tsx`
4. `StatusBanner.tsx`, `BottomNav.tsx`
5. **Admin Command Center** (Screen 09) — highest visual impact
6. **Teacher Score Grid** (Screen 05) — core functional flow
7. **Login** (Screen 02) + **Splash** (Screen 01)
8. Remaining teacher screens
9. Parent portal
10. Empty/Error/Loading states

---

## 8. DATA PLACEHOLDERS

Use this mock data for all screens:

```ts
const school = { name: "Sunshine Academy", city: "Lagos", term: "Term 2", year: "2025/2026" };
const teacher = { name: "Mr. Adeleke", class: "JSS 3 Alpha", students: 6 };
const students = [
  { id: 1, name: "Aisha Bello",    ca1: 18, weekly: 17, exam: 56, total: 91, grade: "A+", fees: { total: 85000, paid: 85000 } },
  { id: 2, name: "Chinedu Okafor", ca1: 16, weekly: 15, exam: 51, total: 82, grade: "A",  fees: { total: 85000, paid: 85000 } },
  { id: 3, name: "Jimi Adebayo",   ca1: 14, weekly: 13, exam: 48, total: 75, grade: "B",  fees: { total: 85000, paid: 70500 } }, // locked
  { id: 4, name: "Funmi Lawal",    ca1: 19, weekly: 18, exam: 60, total: 97, grade: "A+", fees: { total: 85000, paid: 85000 } },
  { id: 5, name: "Tunde Salami",   ca1: 15, weekly: 14, exam: 49, total: 78, grade: "B",  fees: { total: 85000, paid: 85000 } },
  { id: 6, name: "Ngozi Eze",      ca1: 17, weekly: 16, exam: 54, total: 87, grade: "A",  fees: { total: 85000, paid: 85000 } },
];
const kpis = { cashAtBank: 24300000, outstandingFees: 12450000, students: 1248, feeRecovery: 78 };
const parent = { studentName: "Aisha Bello", class: "JSS 3 Alpha", overallScore: 88, classAverage: 83 };
```

---

## 9. NOTES FOR CLAUDE CODE

- **Always reference `Brand_Identity.html`** for visual decisions not covered here. It is the source of truth.
- The design is **dark-first** — no light mode needed for MVP.
- Every heading font is **Syne**. Every body/label/UI text is **DM Sans**. Data values, refs, timestamps use **DM Mono**.
- Do not use Tailwind defaults for colors — use the CSS variables defined in `globals.css`.
- The SmartS mark SVG is a custom logo — do not replace with emoji or icon library alternatives.
- Keep all surfaces dark. Cards are `#111118`, not white.
- The product is named **SmartSchool** in the app header; the parent brand mark shows **SmartS** (the tech division of Ice Resources Operating).
- All monetary values are in **₦ (Naira)**.
- School context: Nigerian school system — JSS (Junior Secondary School), SSS, Primary. Terms are Term 1 / Term 2 / Term 3.

---

*SmartS School · Ice Resources Operating · v1.0 · April 2026 · Confidential*
