# Design QA — menu bar and keyboard controls

- Source visual truth:
  - `/var/folders/6b/nm6dp4r93rq5z5nql21zgqb00000gp/T/codex-clipboard-bbc9a03d-d079-458b-a222-66c08b664845.png`
  - `/var/folders/6b/nm6dp4r93rq5z5nql21zgqb00000gp/T/codex-clipboard-5b5cce68-214c-4a12-aa6d-ed7d08f400c2.png`
- Implementation screenshots:
  - `/private/tmp/dejavuscreensaver-menu-after.png`
  - `/private/tmp/dejavuscreensaver-keyboard-after.png`
- Side-by-side evidence:
  - `/private/tmp/dejavuscreensaver-qa-menu-side-by-side.png`
  - `/private/tmp/dejavuscreensaver-qa-keyboard-side-by-side.png`
- Browser viewport: 811 × 937 CSS px, device scale factor 1.
- Source pixels: menu 1274 × 444; keyboard 1406 × 780.
- Implementation pixels: 811 × 937 for each viewport capture.
- State: dark theme; DejaVu menu open; slideshow controls visible.
- Density normalization: the source and implementation were placed in equal-width columns and scaled proportionally for focused comparison. The menu-bar raster and menu popover are direct crops from the source screenshot.

## Full-view comparison evidence

The hero keeps the menu-bar proof secondary to the main headline. The previous invented product card and large Start slideshow CTA are gone. The new block uses the real selected menu-bar icon, neighboring icons, and native menu from the supplied screenshot, with the current date rendered separately.

## Focused comparison evidence

- Menu bar: the supplied menu bar and popover are rendered from direct source crops, preserving icon shapes, selected-state treatment, native menu typography, separators, disabled rows, and native translucency.
- Keyboard: the left-arrow overlay now follows the physical key bounds; Space and right-arrow overlays remain aligned.

## Required fidelity surfaces

- Fonts and typography: site typography remains unchanged; native menu text is preserved in the reference raster; dynamic date uses the existing system-font stack.
- Spacing and layout rhythm: menu bar, popover offset, and keyboard key overlays match the source proportions at the rendered scale.
- Colors and visual tokens: the native dark menu colors come from the source raster; surrounding surface uses the established site background and border tokens.
- Image quality and asset fidelity: real source crops replace the former hand-built icon approximations and invented card. No placeholder imagery remains in the changed component.
- Copy and content: menu items match the real app menu exactly. The surrounding explanatory copy remains intentionally short.

## Comparison history

1. Initial findings:
   - P1: menu-bar icons and popover content did not match the real application; the invented card suggested a nonexistent product UI.
   - P2: the left-arrow highlight was shifted right from the photographed key.
2. Fixes made:
   - Replaced the icon approximations and invented card with direct, cropped source assets from the real menu-bar screenshot.
   - Kept the date dynamic while preserving the rest of the native bar appearance.
   - Shifted and widened `.key-left` to match the photographed key boundary.
3. Post-fix evidence:
   - Side-by-side captures show the native menu content and iconography preserved.
   - The left-arrow highlight is centered on the key and no longer overlaps its right edge.

## Primary interactions and console

- Previous-photo keyboard control tested: count changed from `3 / 3` to `2 / 3`.
- Dynamic date/time remains active.
- Browser console checked: no warnings or errors.

## Findings

No actionable P0, P1, or P2 differences remain for the requested changes.

## Follow-up polish

- P3: the date is intentionally live, so its exact text differs from the timestamp in the supplied screenshot.

final result: passed
