# Earth2Guide — Google Stitch Prompts

---

## HOW TO USE
Attach `Design.md` + this file together, then send one page prompt at a time.

---

## [SYSTEM CONTEXT] — Include with every request

```
Design a responsive web app called "Earth2Guide" — an information hub for Earth 2 metaverse game.

Design system:
- Theme: Dark, futuristic, sci-fi feel inspired by Earth 2's visual identity
- Background: Deep dark navy (#0a0f1e range)
- Accent colors: Cyan blue (#00d4ff) and emerald green (#00ff9d)
- Font: Clean sans-serif (Geist or similar)
- Card style: Glassmorphism or dark card with subtle border glow
- Mobile first, fully responsive (mobile / tablet / desktop)
- Web app UX — feels native, smooth transitions, minimal chrome

Layout rules:
- Header (mobile): logo left + hamburger menu right
- Header (desktop): logo + full nav [소식 | Earth 2 Official | 위키 | search icon | KO/ZH toggle]
- Card grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
- Max content width: 1280px, centered
- Post detail body: max-width 780px, centered
```

---

## PAGE 1 — Home

```
Design the Home page for Earth2Guide web app.

Sections (top to bottom):
1. Header — logo + nav (desktop) / hamburger (mobile)
2. Hero section — large title "Earth2Guide", subtitle "Earth 2 메타버스 정보 허브", centered search bar
3. Referral CTA banner — "Sign up for Earth 2 with referral code 00000 and get 7.5% discount" — prominent but not aggressive, horizontal on desktop / vertical stack on mobile
4. Latest News section — section title "최신 뉴스" with "더보기 →" link, PostCard grid (3 cards desktop / 1 card mobile)
5. Earth 2 Official section — same layout as news, cards show official announcements/updates
6. Wiki quick links — icon cards for categories: 계정 / Essence / Jewel / Raid / 일반
7. Footer — simple dark footer with nav links and copyright

PostCard design:
- 16:9 thumbnail image on top
- Category badge (colored pill) + date on one row
- Title (2-line clamp)
- Summary (2-line clamp)
- "읽기 →" link bottom right
```

---

## PAGE 2 — News List

```
Design the News List page for Earth2Guide web app.

- Page title: "소식"
- Full-width card grid layout
- Cards: 1 col mobile / 2 col tablet / 3 col desktop
- Each card: 16:9 thumbnail, category badge, date, title (2-line), summary (2-line), read more link
- Pagination at the bottom: prev/next only on mobile, numbered on desktop
- Same header and footer as home
```

---

## PAGE 3 — Post Detail

```
Design the Post Detail page for Earth2Guide web app.

Layout (single column, centered, max-width 780px on desktop):
1. Category badge + date row
2. Post title (H1, large)
3. Source line: "출처: Earth 2 Official →" (small, muted, with external link icon)
4. Cover image (16:9, full width of content column)
5. Body text (translated Korean content, clean typography, good line height)
6. "원문 보기" collapsible section — collapsed by default, click to expand original English text + source URL link to earth2.io
7. Referral banner (inline, between content and footer)
8. Same header and footer as home
```

---

## PAGE 4 — Earth 2 Official

```
Design the Earth 2 Official page for Earth2Guide web app.

- Page title: "Earth 2 Official"
- Tab bar below title: [공지] [뉴스] [업데이트] — horizontal scrollable on mobile
- Active tab has cyan underline or filled style
- Below tabs: same card grid as news list (1/2/3 col responsive)
- Pagination at bottom
- Same header and footer as home
```

---

## PAGE 5 — Wiki

```
Design the Wiki page for Earth2Guide web app.

Desktop layout:
- Left sidebar (240px fixed): category list — 계정 / Essence / Jewel / Raid / 일반 — with active state highlight
- Right content area: wiki article with H1, H2 headings, body text, table of contents

Mobile layout:
- No sidebar — replace with a dropdown selector at top of page
- Full width content below

Style should feel like clean documentation (Notion / GitBook) but with Earth2Guide dark theme.
```

---

## PAGE 6 — Search

```
Design the Search page for Earth2Guide web app.

- Large centered search bar at top with placeholder "Earth 2 정보 검색"
- Result count line: "N건의 결과"
- Result cards in single column list: category badge, title (with match highlight), summary excerpt, date, "읽기 →"
- Empty state design when no results found
- Same header and footer as home
```

---

## COMPONENT — Mobile Drawer Menu

```
Design the mobile hamburger drawer menu for Earth2Guide web app.

- Full screen overlay, slides in from right
- Close button (✕) top right
- Nav items vertically stacked, large touch targets: 소식 / Earth 2 Official / 위키 / 검색
- Language toggle at bottom: [KO] [ZH] pill buttons
- Dark background matching site theme, subtle backdrop blur
```
