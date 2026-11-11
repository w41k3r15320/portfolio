# jozue.fr — English homepage clone

Research, implementation notes, and verification record for the clone of the
English homepage of **[jozue.fr](https://jozue.fr/)**.

- **Source:** <https://jozue.fr/> (English homepage)
- **Clone route:** `/`
- **Captured:** November 2026
- **Stack:** Next.js 16 App Router, React 19, TypeScript
- **Status:** section-by-section visual parity at 1440 × 900 and 390 × 844;
  lint, typecheck, and production build pass.

> This is a study/reference clone. All photography, logos, type, and copy belong
> to Josué Pichot. Outbound links point at the live site and its partners.

---

## 1. Scope

### In scope

| Area | Delivered |
| --- | --- |
| English homepage | Full page at `/` |
| Hero | Intro signature, rotating title, description slider, contact details, scroll cue |
| Works | Filter header, category filters, 18 projects, load-more, in-page filter island |
| Sections | Talk, Awards & Archives, Few words/About, Partners in crime, Contact |
| Chrome | Menu toggle + fullscreen menu, first-visit intro, light/dark toggle state |
| Assets | Source images, logos, fonts, favicon served from `public/sites/jozue/` |
| Responsive | Desktop and mobile layouts, including mobile-only carousels and card behavior |

### Out of scope (kept as live links)

| Destination | Handling |
| --- | --- |
| `/works/<slug>/` (18 project pages) | Absolute `https://jozue.fr/works/<slug>/` links |
| `/fr/` French homepage | Absolute link in the menu (`hreflang="fr"`) |
| Three SEO landing pages | Not rebuilt; no links were added from the cloned page |
| Award case studies | Original external URLs (Awwwards, TheFWA, CSSDA, client sites) |
| Partner sites and socials | Original external URLs |
| Sitemap, RSS, platform files | Not cloned |

Only `/` was supplied as in-scope content, so no local stub routes were created
for pages that were not part of the request.

---

## 2. Route map

```
/                         → clone (this app)
/#works                   → works section (in-page scroll)
/#about                   → about section (in-page scroll)
/#contact                 → contact section (in-page scroll)

https://jozue.fr/works/…  → external (18 project pages)
https://jozue.fr/fr/      → external French homepage
https://…                 → external awards, partners, socials, maps, tel/mailto
```

Works linked externally (all 18 are present in `data.ts`):

`arte`, `athletic-brewing-company`, `billy`, `brico-depot`, `fnac-darty`,
`graille-sur-le-rail`, `hoppy-road`, `instax`, `la-canute`, `le-monde-loreal`,
`mc-cain`, `mijote`, `msa`, `nicolas-feuillatte`, `series-mania`, `vianney`,
`youtube`, `youtube-ads`.

Menu also links `About.`, `Works.`, `Contact.`, and the French site.

---

## 3. Running it

From the repository root:

```bash
npm install
npm run dev        # http://localhost:3000
```

Production check:

```bash
npm run check      # eslint + tsc --noEmit + next build
npm run build
npm run start
```

`next.config.ts` sets `output: "standalone"` and disables the dev indicator.

---

## 4. Architecture and file ownership

```
src/app/page.tsx                 → renders <JozueHome />
src/app/layout.tsx               → metadata, lang="en", data-intro="done"
src/app/globals.css              → template reset/Tailwind layer
src/app/jozue.css                → source stylesheet + scoped clone overrides

src/components/sites/jozue/
  JozueHome.tsx                  → page state: filters, island, menu, load-more, scroll
  Chrome.tsx                     → SiteMenu (toggle + overlay) and Intro overlay
  Hero.tsx                       → hero markup, title rotation, description carousel
  FilterControls.tsx             → rotating filter slots, lists, filter island, header
  WorksSection.tsx               → works header/list, mobile observer, load-more
  Sections.tsx                   → Talk, Awards, About, Partners, Contact + carousels
  data.ts                        → works, categories, awards, partners, socials

public/sites/jozue/
  images/                        → 18 project images (webp)
  logos/                         → full/small/signature/favicon SVGs, 5 partner logos
  fonts/                         → Neue Haas Grotesk Display 55 Rg / 75 Bd (woff2)
```

The markup is re-authored as React components; the downloaded source stylesheet
is reused for pixel fidelity. Behavioral gaps (mobile carousels, filter island,
intro, menu backdrop) are handled by hand-written overrides at the end of
`jozue.css`, under `/* ===== Clone overrides ===== */`.

### Page state model (`JozueHome`)

- `selected: Set<string>` — all 10 category ids selected by default.
- `previousSelection` — remembers the prior filter set for the “all” toggle.
- `filterOpen` — desktop/filter-header expansion.
- `islandVisible` / `islandOpen` — in-page filter bar visibility and panel state.
- `loadedAll` — reveals the last 9 mobile-only works and hides “load more?”.
- `menuOpen` — fullscreen menu + body scroll lock.
- `descriptionIndex` — hero description pagination state.

---

## 5. Design tokens

| Token | Value |
| --- | --- |
| Root font size | `10px` (rem-based layout) |
| Max content width | `1399px` |
| Page gutter | `3.4rem` → content starts at `x = 47px` on 1440 |
| Red | `#f73326` |
| Cream | `#f7f2e7` |
| Off-white | `#f3f2f0` |
| Ink / dark | `#111319` |
| J signature gray | `#dcdbdb` |
| Typeface | Neue Haas Grotesk Display, 400 / 700 |
| Breakpoint | `max-width: 766px` for mobile behavior |
| Motion vars | `--motion-fast/base/slow`, `--ease-default/in/out/in-out` |

Fonts are self-hosted:

- `public/sites/jozue/fonts/NHaasGroteskDSPro-55Rg.woff2`
- `public/sites/jozue/fonts/NHaasGroteskDSPro-75Bd.woff2`
- plus the template’s `public/fonts/` copies.

---

## 6. Section geometry

Measured on the clone, matching the source within sub-pixel rounding.

### Desktop — 1440 × 900

| Section | Height |
| --- | --- |
| Hero (`#intro`) | 900 |
| Works header | 342.640625 |
| Works list | 4068 |
| Awards | 1602.1875 |
| Talk | 710 |
| About | 1342.5 |
| Partners | 530 |
| Contact | 900 |
| **Body** | **10636** |

Reference points: works title `y = 115.046875`, `h = 214`; hero red
“EXPLORE MY WORK” band is visible at 1440 × 900 exactly as on the source.

### Mobile — 390 × 844

| Section | Height |
| --- | --- |
| Hero | 844 |
| Works header | 321.1875 |
| Works list | 2034 |
| Awards | 530 |
| Talk | 530 |
| About | 1677.15625 |
| Partners | 530 |
| Contact | 844 |
| **Body** | **7557** |

Reference points: awards carousel height `254.671875`; dots box `136 × 24`.

---

## 7. Content inventory

- **Hero:** “Hi, I am Josué.”; rotating title variants:
  1. `art director + photographer`
  2. `creative + director`
  3. `product + brand designer`
  - Description slides (2): the multidisciplinary intro and the
    photography/film/AI paragraph.
  - Address, phone, email links.
- **Works:** 18 projects; categories/counts: Graphic design 6, Copywriting 4,
  Photography 9, Filmmaking 4, Art Direction 8, Product design 2, Campaigns 5,
  Websites 3, Branding 3, Social Media 4. (“all” = 18.)
- **Talk:** “let’s talk”, availability copy, “Get in touch”.
- **Awards & Archives:** 10 awards with client, context, categories, award list.
- **About:** “Few words”, marquee (Graphic Design, Art Direction, Copywriting,
  Visual Identity, Digital Design, Photography, Filmmaking, &more), four
  biography paragraphs, Instagram link, availability, “Get in touch”.
- **Partners in crime:** VIVAN, Alexandre Desane, Basile Tournier, Jonhate,
  quatrevingts.
- **Contact:** Instagram, Bluesky, LinkedIn, phone, `hi@jozue.fr`, full logo.

Copy is source text, not lorem ipsum. Assets are downloaded originals.

---

## 8. Behaviour specification

### Intro (simplified)

Source uses a choreographed signature animation. The clone keeps the concept but
simplifies it:

- First visit only: fullscreen `#111319` overlay, oversized faint J, centered
  “Hi, I am Josué.”, and a **Skip** button.
- Auto-dismisses after ~1.7s, then fades over 600ms.
- `localStorage["jozue:intro-seen"]` is the permanent first-visit guard.
- `sessionStorage["jozue-intro"]` is written as a secondary guard, so a cleared
  local store still suppresses the intro for the rest of the session.
- Reduced-motion users skip the overlay entirely.
- Clicking the overlay or Skip finishes it immediately.

### Hero

- Title rotates every 5s between three variants; the visible variant is styled
  by `.is-current`, all variants remain in the accessibility tree via the `h1`
  `aria-label`.
- Description is a two-slide scroll-snap carousel. Dots and the next arrow drive
  it; scroll position updates the active dot.
- Hero is marked `is-in` on the next animation frame for the entrance transition.
- Nav buttons and “Explore my work” smooth-scroll to `#about`, `#works`,
  `#contact`; anchors are also reflected in the URL with `replaceState`.

### Works filtering

- All categories start selected (`18` works, `isAll = true`).
- Clicking a category while all are selected narrows the set to just that
  category (e.g. Photography → 9).
- Clicking further categories toggles them; deselecting the last one falls back
  to all categories.
- “all” restores the previous multi-category selection if one exists, otherwise
  selects everything. Its `aria-pressed` stays `false` (matching the source).
- The count pill updates from the filtered list length.
- Category buttons use `aria-pressed`; disabled/selected styling follows
  `.button-selected--on/--off`.
- Roving filter slots cycle category names every 1.8s while `isAll`.

### Desktop filter header

- Collapsed at rest; expands on hover (and on click), pushing the “selected
  works” title down.
- `is-open` is applied to `#works` (`is-filter`) and drives both list columns.

### Filter island

- Appears only while the works list intersects the viewport with
  `rect.top < 0 && rect.bottom > 0`; auto-closes when scrolled out.
- Two states: collapsed bar and expanded panel. Clicking the bar toggles.
- Has its own all/category buttons, close button, and an `aria-live` count
  announcement.
- Choosing a filter from the header, island, or panel updates the same
  `selected` set.
- Opening the menu closes the island.

### Works list

- Hover shows the project image and category tags; project titles/links go to
  the live project pages.
- On mobile, the nearest card to the viewport center expands (image + details);
  other cards collapse. Implemented with a `rootMargin: "-50% 0%"` intersection
  observer plus `.visible`.
- The last 9 works are `mobileOnly` and hidden on mobile until **load more?**
  (`.homepage__work--mobile` collapses them with `opacity: 0; height: 0`).
  Desktop CSS restores all 18.
- Hidden mobile cards also get `aria-hidden` and `tabIndex={-1}` so keyboard and
  screen-reader users do not reach invisible content; desktop removes both.
- “load more?” reveals the hidden set and hides the control.
- “Got a project?” scrolls to contact.

### Awards

- Desktop: three-column editorial list matching source.
- Mobile: one-award-at-a-time scroll-snap carousel with 10 dots and a next arrow.
- Arrow wraps around; dots jump to a slide. Active dot is `.scroll-pagination--active`.
- Dot markup is inside `.scroll-nav--dots`; the awards scroll container uses
  `overflow: visible` so the dots are not clipped.

### Partners

- Desktop: horizontal 3-up track with separators and a next arrow.
- Mobile: 1-up scroll-snap carousel with the same arrow behavior.
- Track stays `justify-content: flex-start` so slides do not drift.

### About

- Marquee is duplicated for a seamless loop (`aria-hidden` on the duplicate).
- Static logo at the bottom of the section.

### Menu and toggle

- Toggle is hidden while the hero nav is visible, then fixed top-right.
- Toggle color is decided from `elementsFromPoint(innerWidth - 46, 48)`,
  filtering out the toggle/menu itself, and looking for `#intro`,
  `.homepage__works`, `.homepage__awards`, `.homepage__partners`.
  - White over red/dark sections.
  - Dark over cream works list, awards, and partners.
- Menu opens as a fullscreen dark overlay with a `#111319` backdrop, staggered
  items via `--i`, `inert`/`aria-hidden` when closed, Escape to close, body
  scroll lock, and anchor navigation that closes first then scrolls.
- English is current; Français links out to `https://jozue.fr/fr/`.

---

## 9. Asset map

All paths are under `public/sites/jozue/`.

| Asset | Files |
| --- | --- |
| Project images (18) | `images/{arte, athletic-brewing-company, billy, brico-depot, fnac-darty, graille-sur-le-rail, hoppy-road, instax, la-canute, le-monde-loreal, mc-cain, mijote, msa, nicolas-feuillatte, series-mania, vianney, youtube-ads, youtube}.webp` |
| Partner logos (5) | `logos/{vivan, alexandre-desane, basile-tournier, jonhate, quatrevingts}.webp` |
| Brand marks | `logos/logo-full.svg`, `logos/logo-full-light.svg`, `logos/logo-small.svg`, `logos/signature-j.svg`, `logos/signature-j-light.svg`, `logos/intro-j.svg`, `logos/favicon.svg` |
| Fonts (2) | `fonts/NHaasGroteskDSPro-55Rg.woff2`, `fonts/NHaasGroteskDSPro-75Bd.woff2` |

The intro J is the real source signature extracted from the page, stripped of
its animation masks, with fill `#dcdbdb`.

---

## 10. Verification

Run `npm run check` — it currently passes:

- `eslint` — no errors; 6 `@next/next/no-img-element` warnings (intentional
  `<img>` use to keep source markup/CSS behavior; Next Image would change layout).
- `tsc --noEmit` — clean.
- `next build` — succeeds; routes `/` and `/_not-found` prerendered.
  Build emits one non-fatal CSS warning for `::highlight(typewrite-rest)`, an
  experimental source selector that browsers ignore when unsupported and which
  does not affect the page.

### Interaction checks performed

| Check | Result |
| --- | --- |
| Intro shows once, skip works, no repeat after reload | Pass |
| Hero title rotates through 3 variants | Pass |
| Description dots/arrow advance and sync | Pass |
| Desktop filter expands on hover and pushes title | Pass |
| Category click narrows to 9; multi-select and deselect-to-all | Pass |
| “all” restores previous selection | Pass |
| Island appears only over works, opens/closes/selects | Pass |
| Awards arrow and all 10 dots | Pass |
| Partners arrow at desktop and mobile | Pass |
| Load more reveals 9 hidden works | Pass |
| Mobile nearest-card expansion (one visible) | Pass |
| Menu opens, links scroll, backdrop `#111319`, Escape closes | Pass |
| Toggle light/dark state per section | Pass |
| Section heights and key geometry vs. source | Pass (see §6) |

Viewport emulation: Chrome DevTools, 1440 × 900 and 390 × 844.

---

## 11. Screenshot index

All screenshots are in `docs/design-references/jozue/` (50 files).

### Paired source vs. clone

`desktop-{section}-source.png` / `desktop-{section}-clone.png` and
`mobile-{section}-source.png` / `mobile-{section}-clone.png` for:

`hero`, `works`, `awards`, `talk`, `about`, `partners`, `contact`.

### Side-by-side montages

`compare-desktop-{section}.png` (2880 × 900) and
`compare-mobile-{section}.png` (1560 × 1688) for the same seven sections.

### Interaction and state evidence

- `intro-clone.png`
- `desktop-menu-source.png`, `desktop-menu-clone.png`
- `mobile-menu-clone.png`
- `desktop-filter-open-clone.png`
- `desktop-filter-island-open-clone.png`
- `mobile-filter-island-open-clone.png`
- `mobile-works-nearest-card-clone.png`

---

## 12. Known gaps / intentional deviations

1. **Intro animation is simplified.** The source’s multi-stage signature
   choreography is replaced by a dark overlay, faint J, greeting, and fade. The
   first-visit, skip, and reduced-motion behavior is preserved.
2. **Source reveal-on-scroll animations are omitted.** `data-reveal` elements are
   intentionally left visible. Reproducing the staggered reveal would risk
   blank content on direct anchor jumps without the source’s JS orchestration.
3. **Mobile carousels use native scroll-snap** rather than the source slider
   library. Visual states and navigation match; easing/velocity physics may
   differ slightly.
4. **Six `<img>` lint warnings** are expected. Switching to `next/image` would
   alter intrinsic sizing and the source CSS’s object-fit/absolute positioning.
5. **`::highlight(typewrite-rest)` CSS warning** comes from the source stylesheet;
   it is unsupported by the build parser but harmless at runtime.
6. **Out-of-scope routes** (`/works/*`, `/fr/`, SEO landing pages) are live links,
   not local pages, so offline use will not navigate to them.
7. **Dynamic data is static.** Works, counts, awards, and partners were captured
   at clone time; future source updates are not synced.
8. **Source analytics/consent scripts** were not ported.

---

## 13. Maintenance notes

- To add a project, append to `works` in `data.ts`; category counts in
  `filtersLeft`/`filtersRight` are display values and must be updated manually.
- Mobile “load more” depends on `mobileOnly`; exactly nine works currently carry
  it so the initial mobile list shows nine.
- If changing the works section height, re-check the island trigger
  (`rect.top < 0 && rect.bottom > 0`) and the toggle light/dark probe at
  `(innerWidth - 46, 48)`.
- Hero geometry is sensitive to the description carousel becoming vertical on
  mobile; keep `.jz-desc__track` horizontal below 766px or the red band drops.
- Screenshots are static evidence; regenerate them if layout tokens change.
