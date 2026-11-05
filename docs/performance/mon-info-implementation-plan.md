# Mon Info correctness and loading plan

## Scope

Repair the audited Mon Info game, form, mechanics, localization, security, accessibility, and route-loading contracts without changing unrelated application behavior.

## Baseline

- The runtime manifest is 2,899,523 bytes in source and contributes to a 2,170,361-byte lazy route chunk (78,981 bytes gzip in the current build).
- The catalog contains 1,597 form shards and 20,443 profiles. Form shards are already loaded on demand.
- Focused Mon Info tests pass, but they do not cover distinct paired-version data, manifest/form-catalog parity, historical mechanics, or localized presentation.

## Stages

1. **Game identity and routing**
    - Preserve individual releases and DLC in selectors and URLs.
    - Keep legacy grouped URL slugs readable as representative-game aliases.
    - Verify with routing and option-construction tests.

2. **Form contract**
    - Build Mon Info form choices from the runtime manifest, enriched by the existing form catalog.
    - Reject form choices without data and repair invalid default-form metadata.
    - Verify every exposed form resolves to a shard.

3. **Historical mechanics and localized presentation**
    - Make type defenses and profile fields generation-aware.
    - Derive egg steps by game generation and omit mechanics that did not yet exist.
    - Add a language selector that uses the localized fields already present in each shard.

4. **Security and accessibility**
    - Escape imported strings used by the legacy HTML renderer.
    - Add labels, text alternatives, live loading/error state, and semantic navigation where practical.

5. **Manifest loading**
    - Replace the full authoring manifest in executable JavaScript with a compact generated routing index.
    - Keep rehydrated species routes in a small in-memory cache while form payloads remain lazy.
    - Compare route chunk and manifest transfer sizes before and after the production build.

## Rollback

Each stage is source-control reversible. The only catalog expansion is Ogerpon's missing Teal Mask shard and manifest route, so rollback does not require data migration or user-state conversion.

## Validation

- Focused Mon Info, evolution, and reference-index tests.
- Full ESLint and Stylelint.
- Full repository tests, with unrelated pre-existing failures reported separately.
- Production build and performance-budget check.
- Catalog integrity script covering shard identity, exposed forms, default forms, stats, EV yields, and reference links.
