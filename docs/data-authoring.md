# Data Authoring

PokemonPGC content is executable JavaScript registered into the shared data registry. Treat authored identifiers as a persistence schema, not presentation text.

## Workflow

1. Find the closest equivalent game in `data/tasks/`, Dex, distribution, layout, and sync directories.
2. Reuse the existing helper shape from `data/helpers/`; do not invent a parallel schema.
3. Use stable lowercase game/generation keys already declared in `data/data.js`.
4. Add the module to the correct `data/bootstraps/gen*.js` lazy boundary.
5. Add/update layout ordering and any cross-entry sync metadata.
6. Search for every new ID and every referenced target.
7. Run formatter, lint, tests, and production build.
8. Manually verify local save/reload and any affected modal/progress summary.

## Stability rules

- Task IDs, Dex IDs, form IDs, section IDs, collection IDs, game keys, and sync references may be stored in user snapshots.
- Never renumber/reuse an ID just to make a file look tidy.
- Do not remove a persisted item without a migration/compatibility decision.
- `taskSync` and `dexSync` targets must exist and must not create an unintended cascade cycle.
- Asset paths go through `assetPath`/data asset helpers so static and external bases behave consistently.
- Preserve source order where the UI intentionally uses it; layout files own deliberate presentation order.

## Task shapes

The dominant shapes include standard boolean tasks, nested children, tiered counters, either/mutually exclusive choices, multi-option tasks, and trainer battle metadata. Copy an existing same-type task and keep required properties consistent.

Trainer parties may contain sprite resolver functions bound to a game key. That binding is intentional: it prevents later runtime state from resolving images against the wrong title.

## Dex and forms

Regional and national Dex files use numeric entry IDs plus optional form arrays and shiny/alpha metadata. Cross-Dex links use `{game,dexType,id,form?}`. A form label in sync metadata must match the authored form contract exactly.

## Distributions and collectibles

Distributions have event identity, availability, regions, Pokemon/item/move metadata, and completion state keyed by stable IDs. Fashion, curry, sandwich, sticker, and medal modules use separate persistence maps even when their UI patterns are shared.

## Ambiguity

`ruby-sapphire.js` and `ruby-sapphire2.js` coexist in distributions and their authority is not documented. Do not consolidate or delete either without source/provenance review. Content licensing/attribution is also unresolved and must be established before broad redistribution.
