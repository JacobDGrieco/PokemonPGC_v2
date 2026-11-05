# Mon Info Paired-Game Selection Plan

## Objective

Keep paired releases and their DLC on one Mon Info game-selection row, order releases newest to oldest, and open each Pokemon on its newest available base release without losing version-specific Pokédex text or expansion locations.

## Implementation

1. Define the supported release groups in one shared utility. Each option retains its individual base-game and expansion keys for routing and data lookup while presenting one combined label such as `Red / Blue` or `Legends: Z-A`.
2. Preserve direct links to either member of a pair or DLC by resolving the requested game key to its containing release group. If no requested game is available, select the first option, which is the newest release.
3. Resolve each selected release member from the already-loaded Mon Info shard. Use the base game for shared profile data, then merge and normalize locations from every included expansion so their existing game labels remain visible.
4. Mark grouped expansion content with compact DLC badges beside the base release name rather than adding more selector rows.
5. Collapse identical localized Pokédex entries into one box. When paired versions differ, render both entries in a compact responsive grid and label each with a small overlapping version eyebrow.
6. Add focused tests for ordering, DLC grouping, direct expansion-link compatibility, merged locations, default selection, and identical-versus-different description presentation. Run the relevant test suite and production build.

## Compatibility and rollback

- Existing non-DLC single-game entries remain single options.
- Existing exact game and DLC URLs continue to resolve because grouped options retain every member key.
- The change is source-only and can be reverted normally through source control; it does not alter stored Mon Info JSON.
