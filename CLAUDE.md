# SmartSchool — Project Guide

## Product
Multi-role school management platform for Nigerian schools. Three portals: **Admin**, **Teacher**, **Parent**.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 (`@theme` directive, no tailwind.config.ts)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Fonts**: Syne (display/headings) · DM Sans (body/UI) · DM Mono (data/labels)
- **Lang**: TypeScript

## Architecture — All Portals Are Desktop Web Screens
All three portals use the same desktop-first layout pattern: **216px fixed sidebar + full-width scrollable main content**. There is no mobile-only view.

| Portal | Shell | Layout |
|--------|-------|--------|
| Admin   | `AdminShell` + `SideNav`         | `/admin/*`   |
| Teacher | `TeacherShell` + `TeacherSideNav` | `/teacher/*` |
| Parent  | `ParentShell` + `ParentSideNav`   | `/parent/*`  |

`MobileShell` and `BottomNav` exist in the codebase but are **not used** — kept for potential future responsive work.

## Brand
- **Name**: SmartSchool (never "SmartS School")
- **Primary**: `#7C3AED` (violet) · **Secondary**: `#6366F1` (indigo)
- **Dark-first**: base `#0A0A0F`, surface `#111118`, elevated `#1A1A24`
- **Text**: ink `#F8F8FC` → ink-5 `#3D3D52` (5 levels)
- Logo: fluid S-curve SVG gradient mark (`SmartSchoolMark`) + Syne 800 wordmark

## Key Files
- `src/app/globals.css` — all CSS variables (`@theme` block)
- `src/app/layout.tsx` — root layout with font variables
- `src/lib/mock-data.ts` — all demo data (students, scores, fees, KPIs)
- `src/lib/constants.ts` — `getGrade()`, `formatNaira()`, school constants
- `src/lib/types.ts` — all TypeScript types

## Page Content Padding Convention
All pages: `px-8 py-8 max-w-[1280px] mx-auto`

## Branding Rule
Always use "SmartSchool" — never "SmartS School", "SmartS", or any other variant.
