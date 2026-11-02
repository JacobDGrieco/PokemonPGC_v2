# Dex grid virtualization plan

## Objective

Keep large Pokédex modals responsive by limiting full card, image, and video
construction to entries near the visible viewport while preserving the existing
scroll range, filters, status controls, forms, research actions, and sync rules.

## Stage 1: Virtualized card lifecycle

- Add a dependency-free virtual grid helper used by the imperative Dex modal.
- Create lightweight, fixed-size slots for matching entries so the scrollbar is
  stable immediately.
- Mount full cards only within an overscan area around the scroll viewport.
- Pause and detach video sources when virtual cards leave that area.
- Keep a focused card mounted so virtualization does not interrupt keyboard use.

Performance hypothesis: bounding full card and media nodes to the visible area
will remove the sustained main-thread and decoding work caused by constructing
every entry in large Dexes.

## Stage 2: Remove duplicate and unstable work

- Remove the invalid game-key call to the species mon-info loader that currently
  schedules a second full render without loading data.
- Correct Dex card intrinsic-size hints so skipped content has realistic width
  and height estimates.
- Dispose the virtual grid when the modal closes or its result set is replaced.

Performance hypothesis: a single opening render and stable slot dimensions will
reduce layout churn and keep scrollbar geometry predictable.

## Stage 3: Verification

- Add focused unit coverage for virtual mounting, unmounting, media cleanup,
  fallback behavior, and focus preservation.
- Add source-contract checks for the Dex integration and sizing rules.
- Run relevant tests, formatting/lint checks, the full test suite, and the
  production build with its existing performance budgets.

Manual follow-up: profile the largest available Dex in static and animated modes
with browser developer tools. Confirm that mounted full cards remain bounded and
that no long task is produced while dragging the scrollbar.

## Rollback

Remove the virtual grid helper and restore the former batched append loop in
`src/modals/dex-grid.js`. The change does not alter stored Dex data or its schema.
