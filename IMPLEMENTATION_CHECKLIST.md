# SmartSchool — Implementation Checklist
> Based on SmartSchool × Fixdesk Product Development Checklist (7-Day Sprint)
> Storage: **localStorage only** (no backend yet)
> Last updated: 2026-05-08

---

## Legend
- ✅ Done
- 🔲 Not started
- 🔧 Partial / needs fix

---

## PHASE 0 — Design System

> **Note:** Checklist specifies light theme (#F9FAFB bg, white cards, Inter font).
> Current codebase is dark-themed (violet, Syne/DM Sans). Keeping dark theme unless explicitly asked to switch.

| Item | Value | Status |
|------|-------|--------|
| Primary Color | `#10B981` (green as action color) | 🔧 exists as `--success`, not `--primary` |
| Danger Color | `#EF4444` | ✅ |
| Warning Color | `#F59E0B` | ✅ |
| Background | dark `#0A0A0F` (current) | 🔧 conflict with checklist light |
| Typography | Syne + DM Sans (current) | 🔧 conflict with checklist Inter |
| Button Height | 48px | 🔧 verify |
| Grid System | 8px spacing | ✅ |

---

## PHASE 1 — Global UI/UX Rules

| Item | Status |
|------|--------|
| Cards: `p-6 rounded-xl shadow-sm border` | 🔧 partial |
| Buttons: 48px height, Verb + Outcome copy | 🔧 partial |
| Icons: Lucide only, 20px, stroke 1.5 | ✅ |
| Empty states: social proof + Primary CTA | 🔲 |
| Loading: Skeleton cards with "Saving Tolu's score..." | 🔲 |
| Nav: Sidebar (current) — checklist wants bottom tab bar | 🔲 |
| Sync Status pill: Online \| Syncing \| Offline | ✅ |

---

## PHASE 2 — Authentication & Role Management ✅ DONE

### Login Flow
| Item | Status |
|------|--------|
| Themed card on `/login` | ✅ |
| Logo at top | ✅ |
| H1: "Welcome to SmartSchool" | ✅ |
| Phone number input | ✅ |
| 3-role picker: Teacher / MD-Bursar / Parent | ✅ |
| Button: "Send WhatsApp OTP" (`#10B981`) | ✅ |

### OTP Screen (`/login/otp`)
| Item | Status |
|------|--------|
| 6 input boxes with auto-submit | ✅ |
| Auto-advance + paste support | ✅ |
| 30s resend countdown | ✅ |
| Demo banner: "Demo code: 123456" | ✅ |

### School Code Screen (`/login/school`)
| Item | Status |
|------|--------|
| School code input | ✅ |
| Security subtext: "Ask your admin. This keeps Tolu's data safe." | ✅ |
| CTA copy: "Secure Tolu's Data →" | ✅ |
| Demo banner: "DEMO2025" | ✅ |
| Store `school_code` in localStorage session | ✅ |

### Role Management
| Item | Status |
|------|--------|
| Route guard on `/teacher` | ✅ |
| Route guard on `/admin` | ✅ |
| Route guard on `/parent` | ✅ |
| Wrong-role → own portal (no redirect loop) | ✅ |
| Parent multi-child dropdown "Viewing: Chidi ↓" | ✅ |
| `activeChildId` in localStorage session | ✅ |

---

## PHASE 3 — Admin Dashboard (`/admin`) ✅ DONE

### Card 1: Cashflow (Red)
| Item | Status |
|------|--------|
| Show only when owing > 0 | ✅ |
| H3: Amount behind + `[Urgent]` red badge | ✅ |
| Body: "Greenville recovered ₦12M last month using 1 button." | ✅ |
| Button `#EF4444`: "WhatsApp All Debtors" | ✅ |
| Footer: "31 of 32 schools do this weekly." | ✅ |
| `wa.me` deeplink on button | ✅ |

### Card 2: At-Risk Students (Amber)
| Item | Status |
|------|--------|
| H3: Count + `[Fix Now]` amber badge | ✅ |
| Body: "90% who don't fix Week 3 fail WAEC." | ✅ |
| Button `#F59E0B`: "Blast Parents Now" | ✅ |
| Footer: "TTI avg: 62 days. Target: 2 days." | ✅ |

### Card 3: Teacher Compliance
| Item | Status |
|------|--------|
| H3: Teacher name + on-time % + red badge if bottom 10% | ✅ |
| Body: "Period lost = ₦4,000 waste. Top schools fire bottom 10%." | ✅ |
| Button outline red: "Call Teacher" | ✅ |
| Mock teacher compliance data in localStorage | ✅ |

### Card 4: Fee Ledger Table
| Item | Status |
|------|--------|
| Columns: Name \| Class \| Owing \| Last Paid \| Action | 🔧 (revenue page exists, different cols) |
| Action: `[WhatsApp Nudge]` with `wa.me` deeplink | 🔧 (has button, no deeplink) |

### Card 5: Key Metrics
| Item | Status |
|------|--------|
| TTI — Time To Intervention (days avg) | ✅ |
| Diaries per day | ✅ |
| Unlock rate % | ✅ |
| Fix Pack purchase % | ✅ |
| Teacher streak % | ✅ |

---

## PHASE 4 — Teacher Interface (`/teacher`) ✅ MOSTLY DONE

### Home Card
| Item | Status |
|------|--------|
| Greeting: "Good morning Mr. Adeleke" | ✅ |
| Shame frame: "32 parents waiting. Don't be last." | ✅ |
| 🔥 Streak footer: "14-day streak. Don't break it." | ✅ |
| Start Class button | ✅ |

### Live Class Screen
| Item | Status |
|------|--------|
| Active class header + End Class button | ✅ |
| Attendance grid: tap = instant toggle | ✅ |
| Tabs: Attendance \| Topic \| HW \| Behavior | ✅ |

### End Class / Diary
| Item | Status |
|------|--------|
| H3: "Class Complete" | ✅ |
| Body: "Send diary or parents think you skipped." | ✅ |
| Button: "SEND DIARY – 10sec" (`#10B981`) | ✅ |
| Ghost button: "Skip" | ✅ |

### Fix Pack Analytics Card
| Item | Status |
|------|--------|
| H3: "[Name] [score]/100" + `[Risk]` red badge | ✅ |
| Body: "If [Name] fails WAEC, parents blame YOU at PTA." | ✅ |
| Button `#EF4444`: "SAVE [NAME] – Create Fix Pack" | ✅ |
| Fix Pack creation modal (5 editable action items) | ✅ |
| "Fix Pack Active" state after creation | ✅ |
| Saved flash: "Fix Pack sent to parent!" | ✅ |

---

## PHASE 5 — Parent Interface (`/parent`) ✅ MOSTLY DONE

### Card 1: Fees Due
| Item | Status |
|------|--------|
| Show only when fees owing | ✅ |
| H3: "FEES DUE ₦X" + `[Report Locked]` badge | ✅ |
| Body: "X classmates unlocked. [Name]'s waiting." | ✅ |
| Button `#10B981`: "UNLOCK [NAME]'S FUTURE" | ✅ |
| Shame text: "Avoid the talk at pickup." | ✅ |

### Card 2: Risk Alert + Fix Pack
| Item | Status |
|------|--------|
| Show when score < 40% | ✅ |
| H3: "[SUBJECT] RISK [score]/20" + `[Urgent]` badge | ✅ |
| Body: "WAEC Data: 90% who ignore this fail SS3." | ✅ |
| Scarcity: "Only 2 Fix Pack slots left today." | ✅ |
| Button `#EF4444`: "RESCUE [NAME] ₦5,000" | ✅ |
| Commitment: "You promised to help him." | ✅ |
| Post-purchase: 5 items with animated checkmarks | ✅ |
| Progress bar (0/5 → 5/5) | ✅ |
| Tap item to mark complete (localStorage) | ✅ |

### Card 3: Diary
| Item | Status |
|------|--------|
| "NEW DIARY" + `[New]` badge | ✅ |
| Teacher message | ✅ |
| "Thank [Teacher] →" button | ✅ |
| Social proof: "Other mums got this. You're caught up." | ✅ |

### Post-Payment Screen
| Item | Status |
|------|--------|
| Confetti (1.2s) | ✅ |
| H1: "You Unlocked [Name]'s Future!" | ✅ |
| Body: "You're now a Top 10% Parent." | ✅ |
| Button: "Share Badge" | ✅ |
| Ghost: "View Report" | ✅ |

### Report Gate
| Item | Status |
|------|--------|
| Blurred report | ✅ |
| Lock overlay: "Pay fees to unlock" | ✅ |
| Countdown timer: "Unlocks in 1d 4h after payment" | 🔲 |

---

## Fix Pack Feature ✅ DONE

| Item | Status |
|------|--------|
| `FixPack` + `FixPackItem` types in `types.ts` | ✅ |
| Store helpers: `getFixPacks`, `addFixPack`, `purchaseFixPack`, `toggleFixPackItem` | ✅ |
| Seeded Fix Pack for Chidi/Maths in `mock-data.ts` | ✅ |
| Teacher creates Fix Pack for at-risk student | ✅ |
| Parent purchases Fix Pack (₦5,000 simulated) | ✅ |
| Admin Key Metrics Fix Pack purchase % | 🔲 (needs Key Metrics card) |

---

## PHASE 6 — New Screens (Moats) ✅ DONE

### `/parent/passport` — Academic Passport
| Item | Status |
|------|--------|
| H1: "Academic Passport" | ✅ |
| Timeline: JSS1 T1 → SS3 T3, per-term heatmap cells | ✅ |
| Button: "Export 6-Year PDF" | ✅ |
| Copy: "WAEC is 1 day. This is 6 years." | ✅ |
| Mock 6-year data in localStorage | ✅ |

### `/teacher/friday` — Weekly Report
| Item | Status |
|------|--------|
| H1: "Weekly Report" | ✅ |
| 5 sliders: Punctuality, Participation, Conduct, Effort, Homework | ✅ |
| Voice note input (mock recorder UI) | ✅ |
| Button: "Submit – Parents get Sat 9am" | ✅ |
| Copy: "Be the teacher parents brag about." | ✅ |
| Store weekly report in localStorage | ✅ |

---

## PHASE 7 — Copy Audit ✅ DONE

| Screen | Old | New (required) | Status |
|--------|-----|----------------|--------|
| Results | "Total Students" | "Futures You Control" | ✅ (`teacher/results`) |
| Button | "Submit Pulse" | "Save Tolu From PTA Shame" | ✅ (`teacher/pulse`) |
| Empty State | —  | "Tolu's first score appears here. 32 parents waiting." | ✅ (`teacher/scores`) |
| Score Page | subtitle | "Decide Tolu's Week" | ✅ (`teacher/scores`) |
| Fee Lock | "Pay fees to unlock" | "Unlock Report Before Pickup" | ✅ (`parent/page`) |
| Diary | "Other mums…" | "Other kids submitted. Tolu?" (when HW in diary) | ✅ (`parent/page`) |
| Login | "Sign In" | "Secure Tolu's Data" | ✅ (already done) |

---

## PHASE 8 — Mobile & Offline 🔲 NOT STARTED

### WhatsApp Integration
| Item | Status |
|------|--------|
| Admin "WhatsApp All Debtors" → `wa.me` deeplink | 🔲 |
| Admin revenue per-student "WhatsApp Nudge" → `wa.me` | 🔲 |
| Parent diary "Thank Teacher" → `wa.me` | 🔲 |

### Offline Support
| Item | Status |
|------|--------|
| Offline banner: "Offline – Saved. Will send when Tolu needs it." | 🔲 |
| Skeleton loading screens | 🔲 |
| App functions offline (localStorage already works) | 🔧 partial |

---

## Implementation Order

1. ✅ **Phase 2** — Auth flow
2. ✅ **Fix Pack** — Core feature
3. ✅ **Phase 3** — Admin: Teacher Compliance card + Key Metrics card
4. ✅ **Phase 4** — Teacher: Live class tabs (Topic / HW / Behavior)
5. ✅ **Phase 6** — `/parent/passport` + `/teacher/friday` new screens
6. ✅ **Phase 7** — Copy audit (6 remaining replacements)
7. **Phase 8** — WhatsApp `wa.me` deeplinks
8. **Phase 1** — Offline banner + skeleton screens
