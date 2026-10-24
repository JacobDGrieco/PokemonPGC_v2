# PokemonPGC Mobile and Responsive Standards

Status: adopted on 2026-10-24  
Companion audit: `audits/MOBILE_RESPONSIVE_AUDIT.md`

## 1. Product principle

Mobile is a distinct completion context, not a compressed desktop canvas. Preserve the user's core capability, move secondary material behind clear disclosure when space is limited, and do not remove paid or meaningful functionality without product approval.

## 2. Supported viewport baseline

Every materially changed interface should be reviewed at:

- 320 px, 360 px, 390 px, and 430 px portrait.
- 600 px and 768 px portrait/tablet.
- A short landscape phone viewport near 844 x 390.
- 1024 px small desktop/tablet landscape.
- 1440 px desktop regression baseline.

Breakpoints should be selected where content no longer fits or remains usable, not by targeting named devices. The existing 900 px app-shell transition may remain, but components can require narrower content-driven breakpoints.

## 3. Layout rules

- Page containers must use `min-width: 0` where they participate in flex/grid layouts.
- Avoid fixed page-level minimum widths. Fixed internal minimums are allowed only inside an intentional, labeled horizontal scroller.
- Page-level horizontal overflow is a release blocker at supported widths.
- Prefer fluid grids such as `repeat(auto-fit, minmax(<usable minimum>, 1fr))` when content units are equivalent.
- Stack forms, navigation groups, and dense action clusters when their labels or targets can no longer meet readability/target standards.
- Use `dvh`/`svh` thoughtfully for viewport-bound surfaces and provide internal scrolling for content taller than the available viewport.
- Respect `env(safe-area-inset-*)` for fixed/sticky edge controls and full-height sheets.
- Do not encode a variable-height header as a permanent fixed offset. Derive offsets from normal flow or one measured shared custom property.

## 4. Shell and navigation

- A closed mobile drawer must always have a visible, reachable opener.
- The opener must expose `aria-controls` and boolean `aria-expanded`.
- A modal drawer with a scrim must:
    - Be labeled as navigation.
    - Be inert while closed.
    - Move focus to a useful control when opened.
    - Close with Escape, scrim activation, and successful destination selection.
    - Return focus to its opener.
- Resizing across the shell breakpoint must leave no stale body classes, hidden focusable controls, or open scrim.
- Primary navigation must not be removed at narrow widths; it may change presentation.

## 5. Touch and input

- Interactive targets should be at least 44 x 44 CSS px; use 48 px where density permits.
- Visual icons may be smaller than their hit areas.
- Leave enough separation that adjacent hit areas do not overlap.
- Use at least 16 px text for mobile text inputs to avoid browser auto-zoom behavior.
- Ordinary actionable labels should generally remain at least 14 px on phones; compact metadata can be smaller only when it is not the sole action label.
- Do not rely on hover to expose actions or meaning.
- Prefer Pointer Events or semantic click activation over mouse-only event handling.
- Do not globally restrict `touch-action` unless a measured gesture conflict requires it. Preserve pinch zoom.

## 6. Typography and content

- Primary task instructions must remain readable without zoom and should not be truncated when truncation hides required meaning.
- Long names, translated labels, email addresses, prices, and error messages must wrap or ellipsize only where the full value is available by another accessible means.
- Avoid shrinking core copy to solve layout pressure. Reflow the layout first.
- Keep labels associated with form controls and preserve source order when visual layout changes.

## 7. Dialogs, sheets, and popovers

- Use anchored popovers only when they can be clamped fully within the viewport and remain usable with touch.
- Convert complex contextual content to a sheet/dialog on narrow or short viewports.
- Modal surfaces must provide:
    - A visible close action with a compliant target.
    - Initial focus, contained focus where the background is unavailable, Escape close, and focus return.
    - `aria-modal`, an accessible name, and correct dialog semantics.
    - Safe margins, safe-area handling, `dvh` maximum height, and internal scroll.
    - Virtual-keyboard resilience for forms.
- Do not merge modal implementations merely because they look similar if their behavior or hierarchy differs.

## 8. Dense cards, tables, and controls

- Interactive cards need a minimum width derived from their longest essential content and target spacing.
- One-column phone layouts are preferred when a two-column layout forces text below readable sizes or clips actions.
- Preserve table semantics for genuinely tabular comparisons.
- Intentional horizontal scrollers need a visible affordance, keyboard access, and persistent context such as a sticky first column when practical.
- Bulk and destructive actions must not be made easier to trigger accidentally on touch devices.
- Advanced controls may start collapsed on mobile only when they remain discoverable, accessible, and functionally complete.

## 9. Images, motion, and mobile performance

- Serve images close to their rendered dimensions with `srcset`/`sizes` or equivalent responsive sources.
- Lazy-load below-fold images and large optional surfaces when it preserves correctness.
- Do not render or request content solely because it is hidden by a mobile layout.
- Respect `prefers-reduced-motion`; also consider coarse pointers and reduced-data contexts for decorative continuous animation.
- Prefer removing unnecessary mobile work over caching it.
- Before adding caching, document freshness, invalidation, privacy, and failure behavior.
- Measure transfer size, LCP, responsiveness, and long tasks for changed critical journeys; do not infer success from source structure alone.

## 10. Accessibility

- Preserve browser zoom and text scaling.
- Maintain logical DOM/focus order independent of visual grid placement.
- Use semantic buttons, links, headings, lists, forms, tables, navigation, and dialogs.
- Provide visible focus states with sufficient contrast.
- Ensure hidden or offscreen interactive content is not focusable or exposed to assistive technology.
- Status, validation, loading, and error messages must be announced appropriately without moving focus unexpectedly.
- Test at 200% zoom and with increased text size in addition to viewport resizing.

## 11. CSS and component conventions

- Keep responsive behavior with the owning component/style module when possible.
- Prefer shared tokens for shell breakpoint, touch target, safe-area spacing, and measured header offset.
- Avoid `!important` and selector escalation as a responsive strategy.
- Use tabs in handwritten source where the language/formatter permits, in accordance with repository rules.
- Document non-obvious breakpoint choices and gesture/focus constraints by explaining why they exist.
- Preserve equivalent behavior between React and imperative/legacy UI paths until a reviewed consolidation is undertaken.

## 12. Verification checklist

For every responsive change, record:

- Pages/components and states inspected.
- Viewport width/height and orientation.
- Whether page-level horizontal overflow exists.
- Primary task completion with touch and keyboard.
- Focus order, Escape behavior, focus return, and hidden-content exposure.
- 200% zoom and increased text behavior.
- Virtual keyboard behavior for forms.
- Long content, empty, loading, error, disabled, and signed-in/out states.
- Reduced motion and relevant slow-network/media-failure behavior.
- Desktop regression at 1024 and 1440 px.
- Commands run and any browser/device combinations not tested.

Browser automation can supplement this matrix only when the user authorizes it under the current repository instructions; it does not replace manual touch, zoom, keyboard, or assistive-technology checks.
