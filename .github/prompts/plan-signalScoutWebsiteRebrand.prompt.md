# Plan: Rebrand Website from AgentBase to Signal Scout

Transform the current AgentBase waitlist landing page into a Signal Scout app-install landing page, following the Cherry Pick (cherrypickcc.com/us/) template structure. Rebrand all copy/visuals, swap waitlist form for App Store/Google Play download buttons, adopt the app's purple/indigo color scheme, add screenshot-driven "How It Works" and feature sections, and remove the now-irrelevant pricing page.

---

## Phase 1: Global Rebrand & Cleanup

1. **Rename all "AgentBase" → "Signal Scout"** across every file: index.html, privacy.html, script.js, styles.css, llms.txt, sitemap.xml, robots.txt. Covers `<title>`, `<meta>` tags, nav logo, footer logo, privacy policy definitions.

2. **Rewrite llms.txt** entirely to describe Signal Scout (Kalshi prediction market alerts app with AI-analyzed news).

3. **Update sitemap.xml** — remove `pricing.html` and old blog entries, update `<lastmod>` dates.

4. **Delete pricing.html** — no longer relevant.

5. **Rename screenshot files** to web-friendly names (current names have long simulator paths with spaces):
   - `onboarding.png`, `alerts-detail.png`, `discover.png`, `discover-filtered.png`, `alerts-list.png`
   - **Consider renaming** `assets/Signal Scout/` → `assets/signal-scout/` to avoid URL-encoding issues with spaces.

---

## Phase 2: Color Scheme Overhaul (styles.css)

6. **Replace gold/amber CSS variables with purple/indigo** to match the app's UI:
   - `--accent-gold` → `--accent-purple` (~`#6C63FF`)
   - `--gold-light` → ~`#8B83FF`, `--gold-dark` → ~`#4A3FCC`
   - `--gradient-gold` → purple gradient
   - Update all `rgba(230, 194, 122, ...)` references (hover glows, shadows, borders) to purple equivalents
   - Keep dark background colors — they already match the app

---

## Phase 3: Hero Section Redesign (index.html + styles.css)

7. **Remove**: terminal badge, waitlist form, "Coming Soon" overlay, entire animated terminal preview (`.terminal-preview`, `.terminal-window`, `.terminal-body`).

8. **New hero** (following Cherry Pick's layout — text left, phone screenshot right):
   - Headline: e.g., _"Never Miss a Market Move"_
   - Tagline: e.g., _"Get instant AI-analyzed alerts when news breaks that could move your subscribed Kalshi markets."_
   - **App Store + Google Play download badges** (placeholder `href="#"` for now)
   - **Phone screenshot** on the right (use `discover.png` — the main Discover tab), ~300-350px width with subtle shadow

---

## Phase 4: Features Section (index.html)

9. **Redesign the 3-feature cards** (keep existing grid layout, update content):
   - **AI-Powered Alerts** — bell icon — _"Get real-time, AI-analyzed news alerts for your subscribed markets."_
   - **Discover & Filter** — search icon — _"Browse trending markets across Politics, Economics, Sports, and more."_
   - **Track Subscriptions** — chart icon — _"Subscribe to markets you care about and get a personalized feed."_

---

## Phase 5: "How It Works" Section (NEW)

10. **Add a 3-step section** between Features and Team Credentials (like Cherry Pick's alternating text + screenshot rows):
    - **Step 1: "Discover Markets"** — screenshot: `discover.png` — _"Browse and search Kalshi prediction markets. Filter by trending, volume, price range, or closing date."_
    - **Step 2: "Subscribe & Track"** — screenshot: `onboarding.png` — _"Subscribe to markets you want to follow. We'll monitor price movements and breaking news."_
    - **Step 3: "Get AI Alerts"** — screenshot: `alerts-detail.png` — _"Receive intelligent alerts with AI-analyzed summaries. Jump straight to Kalshi to act."_

---

## Phase 6: Final CTA Section (NEW)

11. **Add a bottom CTA** (like Cherry Pick's "Start Maximizing"):
    - Headline: _"Start Trading Smarter"_
    - Subtext: _"Join traders using Signal Scout to catch market-moving news first."_
    - App Store + Google Play download buttons (same as hero)

---

## Phase 7: Keep & Update Existing Elements

12. **Keep "Built by alumni of"** section (Uber, Goldman Sachs, CMU) — just restyle with purple accent.

13. **Update footer**: "Signal Scout" branding, keep privacy link + `founders@useagentbase.dev`, add "© 2026 Signal Scout."

---

## Phase 8: Privacy Policy & JS Cleanup

14. **Update privacy.html**: Replace "AgentBase" → "Signal Scout", update meta tags, update "Service" definition to include mobile app, update "Last updated" date.

15. **Clean up script.js**: Remove `FeedbackConfig` Supabase endpoint and waitlist form submission code. Keep: smooth scroll, mobile menu, nav scroll effects, intersection observer animations.

---

## Relevant Files

| File                                                     | Action                                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| index.html                                               | Major rewrite — hero, features, add How It Works + CTA sections              |
| styles.css                                               | Color overhaul (gold→purple), remove terminal styles, add new section styles |
| script.js                                                | Remove waitlist code, keep nav/animation logic                               |
| privacy.html                                             | Find/replace AgentBase→Signal Scout, update meta                             |
| pricing.html                                             | **DELETE**                                                                   |
| llms.txt                                                 | Full rewrite                                                                 |
| sitemap.xml                                              | Remove old entries, update dates                                             |
| Screenshots in `assets/Signal Scout/screenshots/iphone/` | Rename files, use in hero + How It Works                                     |
| `assets/favicon.png` + `assets/logo.png`                 | Need new Signal Scout icon/logo assets                                       |

---

## Verification

1. Open `index.html` in browser — hero shows headline + download buttons + phone screenshot (no waitlist/terminal)
2. All 5 sections render: Hero → Features → How It Works → Team Credentials → CTA → Footer
3. Ctrl+F confirms zero "AgentBase" text remaining across all files
4. Purple/indigo color scheme throughout — no gold remnants
5. Mobile responsive at 375px, 768px, 1024px breakpoints
6. `pricing.html` deleted, no links point to it
7. Screenshot images load (check URL-encoding for spaces in path)
8. `sitemap.xml` validates as proper XML

---

## Decisions Made

- **Domain**: Keep `www.useagentbase.dev` for now
- **Pricing page**: Delete
- **Color scheme**: Purple/indigo to match app
- **App Store links**: Placeholder URLs until available
- **Team credentials**: Keep for credibility
- **Contact**: `founders@useagentbase.dev`
- **Google Analytics**: Keep `G-FTB5NSQNWW`

---

## Further Considerations

1. **Favicon & Logo**: You'll need to provide a Signal Scout app icon to replace `assets/favicon.png` and `assets/logo.png`. The purple bell icon from the app screenshots could work.
2. **Screenshot folder name**: `assets/Signal Scout/` has a space — recommend renaming to `assets/signal-scout/` to avoid URL-encoding issues.
3. **iPad screenshots**: Available but not included in this plan. Could be added later for a tablet showcase or carousel section.
