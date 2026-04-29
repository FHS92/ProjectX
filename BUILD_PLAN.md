# MANSAPP — Master Build Plan

## The Product
**The personal performance tracker for people who take their outdoor sport seriously.**

Log every session. Understand your trends. Set goals. Know your spots. Track your gear. Connect with your squad.

No CMS. No affiliate content. No generic feeds. Everything connects back to your data.

## The Six Features
| # | Feature | What it does |
|---|---------|--------------|
| 1 | **Log** | Record every session with sport-specific fields |
| 2 | **Stats** | Understand your performance — trends, bests, progression |
| 3 | **Goals** | Set targets, track progress, earn milestones |
| 4 | **Spots** | Personal map of everywhere you've been |
| 5 | **Gear** | Your kit, tied to your logs |
| 6 | **Squad** | Share logs and compete with your people |

---

## Phase 1 — Foundation ✅ COMPLETE
- [x] Next.js 16 + TypeScript + Tailwind
- [x] Neon database + Drizzle ORM + full schema
- [x] NextAuth v5 + Google OAuth
- [x] Premium design system (Playfair Display, dark palette, elevation)
- [x] Landing page, login, register
- [x] Dashboard shell
- [x] Deployed to mansapp.vercel.app

---

## Phase 2 — Log ✅ COMPLETE
The foundation everything else is built on.

- [x] New log form — vertical selector + sport-specific fields
  - Pistol IPSC: match, stage, timer, draw, power factor, A/C/D/M/steel, HF calculator
  - Shotgun: 5 disciplines (Skeet, DTL, Olympic Trap, Compak, ZZ Bird) with scoring
  - Hunting: species, quantity, weight
  - Fishing: species, quantity, weight
  - Diving: type, depth, duration, visibility, water temp, gas mix, tank pressure, weight, buddy
- [x] Save to Neon database
- [x] Log list view with vertical-specific sublines
- [x] Log detail view (sport-specific score cards)
- [x] Edit log entry (full pre-filled form)
- [x] Delete log entry

---

## Phase 3 — Stats 🔲 NEXT
Turn the log data into insight. This is the feature that makes logging feel worth it.

### 3.1 — Dashboard (rebuild)
- [ ] Replace placeholder links with a live personal summary:
  - Recent activity strip (last 3 logs, tappable)
  - Quick "Log Now" button (prominent)
  - Per-vertical stat cards (sessions this month, personal best)
  - Streak counter (consecutive days/weeks with a log)

### 3.2 — Stats page per vertical
- [ ] **Pistol**: HF trend line, best HF, avg HF per month, draw time trend, stage count
- [ ] **Shotgun**: score trend by discipline, best round, avg per discipline, rounds fired total
- [ ] **Hunting**: total harvest, species breakdown, sessions per season, best haul
- [ ] **Fishing**: total catch, species breakdown, catch rate (qty per session), weight record
- [ ] **Diving**: total dives, max depth reached, deepest dive, avg visibility, gas used (bar total)
- [ ] Vertical filter tabs at top of Stats page
- [ ] All-time summary card (total sessions, all verticals)

### 3.3 — Personal Records
- [ ] Auto-detected PRs from log data (best HF, deepest dive, biggest fish, etc.)
- [ ] PR card shown on log detail when a record is broken
- [ ] PR history list on Stats page

---

## Phase 4 — Goals 🔲
Give users something to work toward.

- [ ] Create a goal: choose vertical, metric, target value, deadline
  - Examples: "HF 5.0 by Dec", "25 straight Skeet", "50 dives total", "10kg fish"
- [ ] Progress bar auto-calculated from log history
- [ ] Goals list page (active + completed)
- [ ] Milestone notification when a goal is hit
- [ ] Milestone badges shown on profile

---

## Phase 5 — Spots 🔲
A personal map of everywhere you've been.

- [ ] Spots page with map (Mapbox or Google Maps)
- [ ] Auto-tag a location when logging (from device GPS or manual entry)
- [ ] Spot detail: all sessions logged there, conditions history
- [ ] Add spot independently (name, coords, vertical, notes, private flag)
- [ ] Filter spots by vertical on map
- [ ] "Log here again" shortcut from spot detail

---

## Phase 6 — Gear 🔲
Your kit, tied to your performance.

- [ ] Gear list per vertical (name, brand, model, notes, image)
- [ ] Tag gear on a log entry (multi-select from your bag)
- [ ] Gear detail: all sessions it was used in
- [ ] Performance by gear: avg HF with gun A vs gun B, catch rate by rod, etc.
- [ ] Add / edit / retire gear items
- [ ] Ammo tracker for shooting (rounds fired per session, per gun)

---

## Phase 7 — Squad 🔲
People-first social. Not a public feed — a tight circle.

- [ ] Add friends by username
- [ ] Share a specific log entry with squad (toggle on log detail)
- [ ] Squad feed: shared entries from people you follow, most recent first
- [ ] For shooting: squad members who logged the same match → aggregate stage view
- [ ] For diving: buddy tracking (buddy auto-tagged if they're in your squad)
- [ ] Challenge: send a score to a friend as a challenge, they log a response
- [ ] Profile page: avatar, bio, verticals, recent activity (what you choose to share)

---

## Phase 8 — Polish & Monetisation 🔲
- [ ] Settings page (account, privacy, notification preferences)
- [ ] Push notifications (goal hit, squad challenge, streak reminder)
- [ ] Premium tier (Stripe): unlimited goals, squad challenges, gear performance analytics
- [ ] Log export: PDF dive logbook, IPSC scorecard, hunt record
- [ ] Onboarding flow for new users (choose verticals, set first goal)

---

## Session Protocol
1. State which phase we are on at the start of each session
2. Complete the current task before starting a new one
3. Build in order — Stats before Goals, Goals before Spots, etc.
4. Commit and push at the end of every session

## Design Protocol
- Use existing design system in globals.css only
- Never introduce new colours or fonts outside the system
- Mobile-first — all layouts max-width 480px, tested on small screen
