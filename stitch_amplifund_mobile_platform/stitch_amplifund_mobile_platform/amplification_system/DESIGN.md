---
name: Amplification System
colors:
  surface: '#f6fbf1'
  surface-dim: '#d7dcd2'
  surface-bright: '#f6fbf1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f5eb'
  surface-container: '#ebefe6'
  surface-container-high: '#e5eae0'
  surface-container-highest: '#dfe4da'
  on-surface: '#181d17'
  on-surface-variant: '#404943'
  inverse-surface: '#2d322b'
  inverse-on-surface: '#eef2e8'
  outline: '#707973'
  outline-variant: '#c0c9c1'
  surface-tint: '#326850'
  primary: '#05432d'
  on-primary: '#ffffff'
  primary-container: '#245b43'
  on-primary-container: '#98d1b2'
  inverse-primary: '#9ad3b4'
  secondary: '#59605a'
  on-secondary: '#ffffff'
  secondary-container: '#dde4dc'
  on-secondary-container: '#5f6660'
  tertiary: '#5b2f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#7c4300'
  on-tertiary-container: '#ffb575'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b5efd0'
  primary-fixed-dim: '#9ad3b4'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#175039'
  secondary-fixed: '#dde4dc'
  secondary-fixed-dim: '#c1c8c1'
  on-secondary-fixed: '#161d18'
  on-secondary-fixed-variant: '#414843'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#ffb77a'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6d3a00'
  background: '#f6fbf1'
  on-background: '#181d17'
  surface-variant: '#dfe4da'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 34px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Newsreader
    fontSize: 21px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-micro:
    fontFamily: Plus Jakarta Sans
    fontSize: 10.5px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  gutter-lg: 1.5rem
  margin: 1.25rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an authoritative, editorial aesthetic for a civic-minded distribution platform where communities pool resources to broadcast impactful messages. Rejecting both the hyperactive gamification of crowdfunding apps and the speculative sheen of Web3, the atmosphere is restrained, journalistic, and transparent.

### Core Tenets
- **Editorial Authority:** The experience balances the tactile credibility of physical broadsheets and long-form publications with modern digital ergonomics.
- **Objective Clarity:** Backers are distribution partners, not donors. Visual hierarchy prioritizes narrative context, verified reach metrics, and distribution milestones over emotional pleading.
- **Institutional Weight:** Deep forest greens and warm paper-like substrates convey permanence, stewardship, and civic responsibility.

## Colors

The palette simulates fine-milled unbleached paper complemented by deep archival ink and institutional botanical greens.

### Functional Roles
- **Canvas Base (`#F8F8F3`):** Warm ivory ground that prevents retinal glare, grounding content in an editorial atmosphere.
- **Primary Ink (`#245B43`):** Deep forest green reserved for primary commitments, verified campaign markers, active tab indicators, and major headline emphasis.
- **Surface Layer (`#FFFFFF`):** Pure white dedicated to elevation containers, cards, and modal bottom sheets, framed with low-contrast containment strokes (`#E2E7E0`).
- **Secondary Accent (`#E8EFE7`):** Muted sage for resting badge backgrounds, category filters, and inactive progress rails.
- **Charcoal Text System:** Primary copy renders at `#20251F`, secondary copy drops to `#565E54`, and placeholder or disabled copy settles at `#879284`.
- **Feedback & Milestones:**
  - **Amplified / Active (`#2F855A`):** Soft emerald signaling live campaigns and completed distribution goals.
  - **In Review / Pending (`#D9822B`):** Warm muted amber for verification queues and message clearance.
  - **Restricted / Critical (`#C84C40`):** Muted editorial crimson for validation errors and policy disclaimers.

## Typography

The type scale combines an authoritative transitional serif (`Newsreader`) for headlines with an approachable, high-clarity sans-serif (`Plus Jakarta Sans`) for operational UI, body text, and structural data.

### Hierarchy & Style Rules
- **Editorial Headlines (`Newsreader`):** Used strictly for campaign titles, section headers, and impact quotes. Optical sizing remains medium weight (500) to replicate legacy press clarity without heavy ink-bleed.
- **Operational UI (`Plus Jakarta Sans`):** Standardizes all form controls, transactional values, data figures, and narrative descriptions.
- **Micro-Labels (`label-micro`):** Used for platform taxonomy, verification tags, and campaign status. Must be rendered in all-caps with generous letter-spacing (`0.08em`) to guarantee legibility at small sizes.

## Layout & Spacing

A disciplined 8-point base grid governs layout composition, maintaining consistent structural alignment.

### Screen Geometry
- **Mobile Edge Margins:** Default to `1.25rem` (20px) on standard viewports, reducing to `1rem` (16px) on compact devices (<380px wide).
- **Component Padding Scale:**
  - Micro tags, compact inputs: `space-xs` (4px) vertical, `space-sm` (8px) horizontal.
  - Interactive cells, card containers: `space-md` (16px) to `space-lg` (24px).
  - Page-level content grouping: `space-xl` (32px).
- **Touch Ergonomics:** All interactive targets (buttons, filter chips, input fields, navigation targets) maintain an explicit minimum footprint of 44x44 CSS pixels.

## Elevation & Depth

Visual hierarchy relies on crisp surface separation, perimeter framing, and subtle ambient shadows instead of deep drop shadows or blurs.

### Surface System
- **Layer 0 (Canvas):** Base background `#F8F8F3`. Flat, non-elevated.
- **Layer 1 (Card & Section):** Crisp white `#FFFFFF` bounded by a 1px solid stroke (`#E2E7E0`). Shadow: `0 1px 3px rgba(32, 37, 31, 0.04), 0 4px 12px rgba(32, 37, 31, 0.03)`.
- **Layer 2 (Floating Controls & Navigation):** Elevated navigation strips and fixed action bars. Background `#FFFFFF` with 1px border `#E2E7E0`. Shadow: `0 -2px 10px rgba(32, 37, 31, 0.05)`.
- **Layer 3 (Modal Sheets):** Full or partial overlay containers surfaced in `#FFFFFF` with top-edge borders and a soft scrim: `rgba(32, 37, 31, 0.40)`.

## Shapes

The interface balances soft modern curves with structural restraint.

### Radius Assignments
- **Cards & Primary Modules:** 16px to 20px corner radii (`rounded-lg` through `rounded-xl`).
- **Modal Sheets:** 20px top corner radius; flush lower edge.
- **Form Fields & Inputs:** 10px to 12px for balanced thumb targeting.
- **Chips & Status Pills:** Full pill geometry (`rounded-full` / 9999px) for clear categorical distinction from structural rectangular cards.
- **Progress Trackers:** Fully rounded end-caps on both rail and indicator fills.

## Components

### Buttons
- **Primary Amplification Action:** `#245B43` background, `#FFFFFF` text, subtle 1px border in `#1E4E39`. 48px height, 12px radius, font `headline-sm`. Hover/pressed state shifts to `#1B4432`.
- **Secondary / Supporting Action:** `#E8EFE7` background, `#245B43` label, no border.
- **Ghost / Narrative Action:** Transparent background, 1px border `#E2E7E0`, `#20251F` text.

### Progress Gauges (Distribution Trackers)
- **Geometry:** 8px height with continuous track fill.
- **Rail:** `#E8EFE7` solid fill, no border.
- **Fill:** `#245B43` for standard funding stages; transitions to `#2F855A` upon meeting broadcast readiness.
- **Data Labels:** Micro-labels positioned above the track displaying percentage reached and audience impressions unlocked.

### Chips & Badges
- **Status Pills:** Background in `#E8EFE7`, text in `#245B43` using `label-micro`. Padding: 4px vertical, 10px horizontal.
- **Pending Verification:** Background in `#FDF3E7`, text and border in `#D9822B`.
- **Active Distribution:** Background in `#EBF5F0`, text and border in `#2F855A`.

### Cards & Narrative Feeds
- **Structure:** Solid `#FFFFFF` background, 1px solid `#E2E7E0` perimeter stroke, 18px radius.
- **Content Flow:** Upper slot holds the topic chip and verification marker; middle section displays the `Newsreader` headline and excerpt; lower section houses the progress gauge and real-time backer counts.

### Form Inputs
- **Field Base:** `#FFFFFF` fill, 1px solid `#CCD4CB` border, 10px border radius, 48px min height.
- **Focus:** 1.5px border `#245B43`, zero glowing outline rings.
- **Validation Messages:** Rendered via `body-sm` using `#C84C40` accompanied by a structural inline alert icon.

### Bottom Navigation
- **Architecture:** Fixed bar with `#FFFFFF` fill, 1px top border `#E2E7E0`, 64px structural height plus device bottom-inset padding.
- **Iconography:** 24px clean vector glyphs. Active items use filled strokes in `#245B43` with `label-micro` text; inactive items drop to `#879284`.