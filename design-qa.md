# Design QA — full-site check (v0.4.0, build 24)

- Tool: headless Chromium (Playwright), local `index.html`
- Viewports: 1920, 1440, 1280, 1180, 1161, 1160, 1100, 1024, 921, 820, 660, 390, 320 px wide

## Results

- Console: no errors or warnings; no failed requests; all images load and have `alt`.
- Horizontal scroll: none at any tested width.
- Demo interactions: ← / → (keyboard and on-screen keys), Space pause/resume, Static / Ken Burns,
  current time, photo details and each detail checkbox all work.
- On-screen keys ←, →, Space and their hint text are clickable (not covered) at every tested width.

## Fixes made in this pass

- [P1] 621–1160 px: the simplified settings panel covered the on-screen ← → keys. The keyboard now
  aligns left below 1160 px, so the panel no longer overlaps it. Desktop layout above 1160 px is unchanged.
- [P2] ≤ 620 px: the iMac (112% wide) caused 8 px horizontal scroll; the demo section now clips it.
- [P2] After clicking an on-screen key, pressing the physical Space activated that key again instead of
  pausing. Mouse clicks now release focus; keyboard (Tab) users keep native button behaviour.
- [P3] ≤ 620 px: Finder illustration was clipped; ≤ 360 px: nav overflowed. Both fixed.

final result: passed
