# MANSAPP — Master Build Plan

## The Rule
A vertical is not done until all 6 buckets work inside it.
We do not move to the next vertical until the current one is complete.
We do not start a new phase until the current phase is complete.

---

## Phase 1 — Foundation ✅ COMPLETE
- [x] Next.js 16 + TypeScript + Tailwind
- [x] Neon database + Drizzle ORM + full schema
- [x] NextAuth v5 + Google OAuth
- [x] Premium design system (Playfair Display, dark palette, elevation)
- [x] Landing page, login, register
- [x] Dashboard shell
- [x] All 6 bucket placeholder pages
- [x] Deployed to mansapp.vercel.app

---

## Phase 2 — Core Loop (Logging) 🔲 NEXT
The feature that brings users back daily.
Build a complete log entry flow that works across all 6 verticals.

- [ ] Log entry form — shared shell with vertical-specific fields
  - Shotgun: date, location, discipline (sporting/skeet/trap), score, rounds, notes
  - Pistol: date, location, discipline, score, rounds, notes
  - Hunting: date, location, species, quantity, weight, method, notes
  - Fishing: date, location, species, quantity, weight, rod/bait, notes
  - Diving: date, location, depth, duration, visibility, gas mix, notes
  - DIY: date, project name, materials, time spent, notes
- [ ] Save log entry to Neon database
- [ ] Log list view (filterable by vertical)
- [ ] Log detail view
- [ ] Delete log entry

---

## Phase 3 — Verticals (one at a time, all 6 buckets each)

### 3.1 — Shotgun Shooting 🔲
- [ ] Learn: articles, technique guides, video embeds
- [ ] Gear: shotgun + ammo reviews, user gear list
- [ ] Log: full session log (from Phase 2, scoped)
- [ ] Discover: shooting clubs map, events, seasons
- [ ] Community: shotgun-scoped feed, posts, comments
- [ ] Build: DIY shotgun-related builds (stock work, reloading)

### 3.2 — Pistol Shooting 🔲
- [ ] Learn: articles, technique guides
- [ ] Gear: pistol + ammo reviews, user gear list
- [ ] Log: session log (scoped)
- [ ] Discover: ranges map, competitions, events
- [ ] Community: pistol-scoped feed
- [ ] Build: DIY pistol-related builds

### 3.3 — Hunting 🔲
- [ ] Learn: species guides, safety, technique
- [ ] Gear: rifles, optics, clothing reviews
- [ ] Log: hunt log (scoped)
- [ ] Discover: hunting areas map, seasons, bag limits, regulations
- [ ] Community: hunting feed
- [ ] Build: DIY hunting-related builds (blinds, decoys, calls)

### 3.4 — Fishing 🔲
- [ ] Learn: species guides, technique, tying
- [ ] Gear: rods, reels, tackle reviews
- [ ] Log: catch log (scoped)
- [ ] Discover: spots map, tides, regulations, fish species by season
- [ ] Community: fishing feed
- [ ] Build: DIY rod building, tackle boxes, lures

### 3.5 — Diving 🔲
- [ ] Learn: safety, techniques, certification guides
- [ ] Gear: BCD, regulator, wetsuit reviews
- [ ] Log: dive log (scoped)
- [ ] Discover: dive sites map, conditions, visibility reports
- [ ] Community: diving feed
- [ ] Build: DIY underwater photography, gear maintenance

### 3.6 — DIY & Builds 🔲
- [ ] Learn: woodworking, metalwork, finishing techniques
- [ ] Gear: tools, materials reviews
- [ ] Log: project log (scoped)
- [ ] Discover: suppliers, workshops, events
- [ ] Community: DIY feed, project showcase
- [ ] Build: featured builds gallery

---

## Phase 4 — Cross-Vertical Features 🔲
- [ ] Sport vs Bucket view switcher (functional)
- [ ] User profile page (avatar, bio, favourite verticals, stats)
- [ ] Saved items (bookmark any article, gear review, spot, post)
- [ ] Global community feed (all verticals, filterable)
- [ ] Notifications
- [ ] Settings page (view preference, account, privacy)
- [ ] Search (across all content types)

---

## Phase 5 — Monetisation 🔲
- [ ] Free vs Premium tier logic
- [ ] Paywalled content (premium articles, advanced guides)
- [ ] Gear affiliate links (Cabela's, Bass Pro, Midway USA)
- [ ] Club/group management (B2B — shooting clubs, fishing clubs)
- [ ] Digital guides for sale
- [ ] Stripe integration for Premium subscriptions

---

## Session Protocol
At the start of each session:
1. State which phase and vertical we are on
2. Complete the current task before starting a new one
3. Commit and push at the end of every session

## Design Protocol
- Claude design package to be integrated when uploaded
- Until then, use existing design system in globals.css
- Never introduce new colours or fonts outside the design system
