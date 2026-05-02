# SmartSchool — Project Status

> Last updated: 2026-05-01  
> Stack: Next.js 16 · Tailwind CSS v4 · TypeScript · Lucide React · Recharts

---

## How to run
```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npx tsc --noEmit   # type check
```

**Demo flow:**  
`/` (splash 2s) → `/login` → pick role → Teacher `/teacher` | Admin `/admin` | Parent `/parent`

---

## Architecture
All three portals are **desktop-first web screens** with a 216px fixed sidebar.

| Portal  | Shell           | SideNav            | Routes        |
|---------|-----------------|--------------------|---------------|
| Admin   | `AdminShell`    | `SideNav`          | `/admin/*`    |
| Teacher | `TeacherShell`  | `TeacherSideNav`   | `/teacher/*`  |
| Parent  | `ParentShell`   | `ParentSideNav`    | `/parent/*`   |

Content padding convention: `px-8 py-8 max-w-[1280px] mx-auto`

---

## ✅ Built & Working

### Foundation
- [x] Next.js 16 scaffold + TypeScript + Tailwind v4
- [x] Brand tokens in `globals.css` (`@theme` block — `bg-primary`, `bg-surface`, `text-ink`, etc.)
- [x] Fonts: Syne · DM Sans · DM Mono via `next/font/google`
- [x] `src/lib/types.ts` — all TypeScript types
- [x] `src/lib/constants.ts` — `getGrade()`, `formatNaira()`, school constants
- [x] `src/lib/mock-data.ts` — students, scores, fees, KPIs

### Brand Components
- [x] `SmartSchoolMark` — gradient S-curve SVG logo
- [x] `SmartSchoolWordmark` — mark + "SmartSchool" in Syne 800
- [x] `StatusBanner` — green/red online/offline strip

### UI Components (`src/components/ui/`)
- [x] `Button` — 4 variants (primary/secondary/ghost/danger), 3 sizes, loading, icon
- [x] `Badge` — 6 variants, dot indicator, DM Mono
- [x] `Card` + `CardHeader` — 3 bg variants, hover scale
- [x] `Input` — label, error/hint, prefix/suffix icon
- [x] `ScoreCell` — CA/exam/total/grade types, grade-colour coding, editable mode
- [x] `CircularProgress` — SVG ring, animated, centre label
- [x] `ProgressBar` — 5 variants, animated fill
- [x] `HeatmapCell` — 5-band score colour cell

### Layout Components (`src/components/layout/`)
- [x] `AdminShell` + `SideNav`
- [x] `TeacherShell` + `TeacherSideNav`
- [x] `ParentShell` + `ParentSideNav`
- [x] `MobileShell` + `BottomNav` + `ParentTabBar` *(kept, not currently used)*

### Pages — Admin (`/admin`)
- [x] `/admin` — Command Center: 4 KPI cards, Revenue Gate banner, live Broadsheet table, Results Locked panel
- [ ] `/admin/academic` — stub only
- [ ] `/admin/revenue` — **MISSING** (linked from Command Center)
- [ ] `/admin/expenses` — **MISSING** (SmartSpend)
- [ ] `/admin/ledger` — **MISSING** (Fee Ledger)
- [ ] `/admin/inventory` — stub only
- [ ] `/admin/payroll` — stub only
- [ ] `/admin/approvals` — stub only

### Pages — Teacher (`/teacher`)
- [x] `/teacher` — Home: hero recovery card, quick actions, today at a glance
- [x] `/teacher/broadsheet` — Subject list with emoji icons
- [x] `/teacher/scores` — Score Grid: editable CA1/CA2/Exam, auto-save indicator, live position rank
- [ ] `/teacher/pulse` — **MISSING** (Friday Behavioral Pulse)
- [ ] `/teacher/results` — stub only
- [ ] `/teacher/analytics` — stub only
- [ ] `/teacher/messages` — stub only

### Pages — Parent (`/parent`)
- [x] `/parent` — Academic Report: stat cards, subject report table
- [x] `/parent/subjects` — Subject Heatmap: per-term colour grid
- [x] `/parent/trends` — Performance Trend: Recharts LineChart + BarChart vs class avg + AI card
- [x] `/parent/compare` — vs Class Average: dual progress bars per subject

### Auth
- [x] `/` — Splash screen (2s auto-redirect, ambient glow, tagline)
- [x] `/login` — Role selector (Teacher / MD), phone + PIN, loading state, redirects to portal

---

## ❌ Still To Build

### High Priority (demo blockers)
| What | Route | Notes |
|------|-------|-------|
| Light/Dark toggle | all sidebars | User requested; next-themes + CSS variable overrides |
| localStorage persistence | score grid, login | Scores lost on refresh — kills demo |
| Friday Pulse | `/teacher/pulse` | Most visual teacher screen |
| Revenue Gate | `/admin/revenue` | Linked from Command Center banner |
| Fee Ledger | `/admin/ledger` | Core admin screen |

### Medium Priority
| What | Route | Notes |
|------|-------|-------|
| SmartSpend list | `/admin/expenses` | Expense request approval list |
| Login session persistence | `/login` | Stay logged in after refresh |

### Low Priority (stubs acceptable)
| What | Route |
|------|-------|
| Academic (admin) | `/admin/academic` |
| Inventory | `/admin/inventory` |
| Payroll | `/admin/payroll` |
| Approvals | `/admin/approvals` |
| Result Gate (teacher) | `/teacher/results` |
| Analytics (teacher) | `/teacher/analytics` |
| Messages (teacher) | `/teacher/messages` |

### Spec Screens Not Yet Started
- Screen 06: Report Generation Loading
- Screen 07: Results Ready / Confetti
- Screen 08: Payment Bottom Sheet
- Screen 15: Compose Message Bottom Sheet
- Screen 17: Offline State
- Screen 18: Error Screen
- Screen 19: Empty States (reusable component)
- Screen 20: Loading Screen
- Screen 21: 404 Page
- Screen 22: Success/Confetti (reusable component)

---

## Known Issues / Notes
- `MobileShell`, `BottomNav`, `ParentTabBar` are unused but kept for potential responsive work
- All data is mock (no backend / API yet)
- Score Grid state is in-memory — localStorage persistence pending
- Dark-only theme currently — light theme toggle pending
- Branding: always **SmartSchool** — never "SmartS School"
