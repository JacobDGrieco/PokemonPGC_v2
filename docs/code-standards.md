# PokemonPGC Code Standards

Status: proposed standards from the 2026-10-18 consistency audit. Apply only after review and in small, behavior-preserving changes.

## Guiding rules

1. Preserve game progress, account data, billing integrity, accessibility, and existing behavior.
2. Prefer the clearest successful local pattern over a new abstraction.
3. Give each UI behavior one owner.
4. Treat DOM hooks, persisted fields, routes, provider payloads, and global bridge APIs as contracts.
5. Consolidate equivalent behavior, not merely similar appearance.
6. Keep migrations small enough to review and reverse through normal source control unless a separate data migration is explicitly approved.

## Formatting

- Use UTF-8 and LF line endings.
- Use tabs for indentation with a visual width of 4.
- Use spaces only where the language/formatter requires them or for alignment after indentation.
- Use double quotes for JavaScript and JSX string literals.
- Use double quotes for JSX attributes.
- Use semicolons.
- Use trailing commas where supported for multiline arrays, objects, imports, parameters, and calls.
- Let the approved formatter decide wrapping; do not hand-align large object tables.
- Do not mix formatting-only changes with behavior changes.

Exceptions:

- Prisma formatting is controlled by Prisma.
- JSON and configuration formats follow their parser/formatter requirements.
- Generated files and imported third-party data are not manually reformatted.

## Variables and constants

- Use `camelCase` for local variables and mutable bindings.
- Use descriptive plural nouns for arrays and collections: `games`, `taskEntries`, `subscriptionEvents`.
- Use `ById`, `ByKey`, or another lookup suffix for maps: `gamesByKey`.
- Use `UPPER_SNAKE_CASE` for module-level immutable configuration and protocol constants.
- Use predicate names for booleans: `isOpen`, `hasSubscription`, `canImport`, `shouldRestore`.
- Include units when ambiguous: `retryDelayMs`, `maxFileSizeBytes`, `currentPeriodEndSeconds`.
- Use `Count`, `Total`, `Percent`, or the established `Pct` suffix consistently within one domain.
- Use `Id` casing: `userId`, `sectionId`, `subscriptionId`.
- Prefer `event`, `element`, `button`, `response`, and `request` in nontrivial scopes.
- Short conventional names (`event` callback index, `req`/`res`, coordinates, tight reducers) are acceptable when unambiguous.

### Domain abbreviations

- `gameKey`, `genKey`, `sectionId`, `mon`, and `dex` are established domain vocabulary.
- New cross-feature APIs should prefer `nationalDexId` over `natiId`.
- Existing `natiId` data and persisted fields remain unchanged until an explicit compatibility migration exists.

### Private names

- Module scope is private by default; do not add a leading underscore solely to communicate privacy.
- Existing underscore-prefixed exports or object properties may be contracts. Migrate them through aliases, not direct renames.

## Functions

Use verb prefixes consistently:

- `getX`: return locally available or synchronously derived data
- `findX`: search and possibly return no match
- `fetchX`: perform network access
- `loadX`: coordinate one or more data sources/lifecycle steps
- `ensureX`: initialize or load only when missing
- `resolveX`: derive or select a value from inputs/fallbacks
- `parseX`: convert external text/bytes into structured data
- `normalizeX`: produce a canonical representation
- `validateX`: check input and return/throw a validation result
- `buildX`: construct an in-memory value without persistence
- `createX`: create a resource or stateful object
- `saveX`/`updateX`/`deleteX`: mutate persisted or durable state
- `renderX`: create/update UI representation
- `wireX`: connect legacy DOM behavior; use only inside the imperative layer
- `handleX`: internal event handler
- `onX`: callback prop or callback option supplied by a caller
- `isX`/`hasX`/`canX`/`shouldX`: predicate

Async functions should make latency/side effects clear through the verb rather than an `Async` suffix.

Document functions when they have non-obvious business rules, mutation, ordering, persistence, permissions, cleanup, or fallback behavior.

## Files and directories

### React

- Component and page files: `PascalCase.jsx`
- Component name matches filename.
- Hooks: `useDescriptiveName.js`
- One primary exported component per component file; small private helpers may remain colocated.
- Feature-specific components stay with the feature until reuse is proven.

### JavaScript modules

- Feature modules with multiple words: kebab-case, matching the dominant `src/modals` and data convention.
- Small utility/service modules may use camelCase when named after their main export, matching `src/utils` and `src/services`.
- Avoid new ambiguous `helpers.js`, `utils.js`, or `common.js` buckets. Name the domain responsibility.
- Framework-reserved and Vercel route filenames remain unchanged.
- Correct typos only in isolated changes that update and verify every consumer.

### Tests

When tests are added:

- Colocate focused unit tests as `name.test.js`/`Name.test.jsx`, or use a consistent repository-level test directory selected during test setup.
- Name tests by observable behavior.
- Do not use CSS classes as test selectors when a stable semantic query or `data-testid` is needed.

## React component standards

- Use named function components.
- Use `onX` for callback props and `handleX` inside components.
- Prefer React state/effects for behavior owned by React.
- Do not query within React-owned markup from unrelated modules unless the element is an explicitly documented imperative bridge host.
- Clean up every global event listener, timer, observer, and global callback in the owning effect.
- Avoid broad boolean-prop combinations. Prefer focused components or a small `variant` value.
- Extract a shared component only when it standardizes behavior, accessibility, testing, or a stable visual primitive.
- Do not build a universal card, modal, or button with unrelated feature switches.

### State access

- During migration, continue using the existing store and bridge events rather than adding another state library.
- Access `window.PPGC` through narrow adapter modules/hooks where practical.
- New components should not add undocumented properties to `window.PPGC`.

## React/imperative bridge

Every imperative island should define:

- The React-owned host element
- The function that mounts/renders imperative content
- The data and DOM hooks it consumes
- Cleanup responsibilities
- Events or callbacks emitted back to React
- Whether rerendering is idempotent

Prefer a single shared imperative-host component when the lifecycle contract is equivalent.

Never let both React and legacy code independently own the same listener, open/closed state, or mutable child subtree.

## HTML and accessibility

- Use semantic buttons for actions and links for navigation.
- Set `type="button"` on non-submit buttons inside or near forms.
- Every input has an accessible label.
- Errors are associated with their fields and announced appropriately.
- Loading/status messages use `role="status"` or an appropriate `aria-live` region without announcing unrelated page changes.
- Destructive errors use `role="alert"` only when immediate interruption is justified.
- Dialogs synchronize visual visibility, `hidden`, `aria-hidden`, and `aria-modal` state.
- Dialogs support Escape, backdrop behavior where intended, initial focus, focus containment, and focus restoration.
- Menus/dropdowns support keyboard dismissal and predictable focus.
- Decorative images use empty `alt`; meaningful images describe their content/purpose.
- Do not remove browser zoom or depend on hover alone.

## CSS classes

### Naming

- Use lowercase semantic kebab-case.
- Prefix feature classes: `account-`, `pricing-`, `task-`, `dex-`, `home-`, `dist-`, `mon-info-`.
- For complex widgets, use BEM-like structure: `model-viewer__toolbar`, `model-viewer--solo`.
- Use `is-*` for transient state: `is-open`, `is-active`, `is-loading`, `is-error`, `is-disabled`.
- Use `has-*` for structural/content state: `has-extra`, `has-custom-icon`.
- Avoid new generic global classes such as `.row`, `.item`, `.name`, `.body`, `.content`, `.wrapper`, or `.container`.
- Avoid implementation prefixes such as `.react-*` in new names.

Existing class names queried or toggled by JavaScript are frozen until a complete consumer map and rename table are reviewed.

### Selectors and specificity

- Scope selectors to a feature root.
- Keep nesting shallow; prefer one feature root plus element/state.
- Do not use IDs for styling in new code; existing modal ID scoping may remain during migration.
- Do not add `!important` except for documented visibility utilities, reduced-motion overrides, or unavoidable third-party/user-agent overrides.
- Annotate non-obvious specificity workarounds with why they are required.

### Tokens

- Use root tokens for shared design decisions: surfaces, text, borders, shadows, control sizes, radii, spacing, durations, and z-index layers.
- Use feature-local custom properties for genuinely contextual values such as dynamic accent/color or calculated geometry.
- Do not replace unique values with meaningless numbered tokens.
- Prefer semantic names such as `--color-text-muted`, `--radius-control`, and `--duration-fast` when expanding the token set.
- Migrate existing generic tokens such as `--gap`, `--radius`, and `--accent` only with a full usage map.

### Responsive and motion

- Treat 900px as the application shell/nav transition unless product behavior changes.
- Add feature breakpoints where content requires them; document their purpose.
- Avoid device-name breakpoints.
- All motion must respect `prefers-reduced-motion: reduce`.
- Use transform/opacity for animation where practical and avoid layout-heavy perpetual motion.

### Interaction states

Every interactive control pattern needs:

- Default
- Hover where applicable
- `:focus-visible`
- Active/pressed where applicable
- Disabled
- Loading where applicable
- Error/invalid where applicable

Do not remove focus outlines without a visible replacement.

## UI primitives

### Buttons

Establish a small shared baseline with semantic variants such as primary, secondary, quiet, and danger. Feature-specific controls may extend the baseline. Model-viewer pills and visual task controls remain specialized.

### Cards and panels

Share surface/border/radius/spacing tokens. Do not force home, pricing, battle, and collection cards into one configurable component.

### Forms

The auth rework should define the canonical field, label, hint, error, submit, and pending patterns. Reuse those semantics in account and billing forms where appropriate.

### Status, error, and empty states

Provide small shared components/classes for page/section status messages. Keep feature-specific copy and recovery actions local.

### Dialogs

Create one lifecycle contract before migrating markup. A shared shell must own behavior, not merely wrap children.

## Data attributes

- `data-action="verb"` for delegated commands.
- `data-state="value"` or `data-variant="value"` for state/variant exposure.
- Descriptive domain keys such as `data-task-id` and `data-game-key` for identity.
- Use `true`/`false` consistently for new boolean string attributes unless presence-only semantics are appropriate.
- Keep stable test hooks separate as `data-testid` only where semantic queries are insufficient.
- Never rename existing `data-*` hooks without searching JavaScript, JSX, CSS, tests, and generated HTML templates.

## API and persistence contracts

The following require explicit approval and compatibility planning:

- API paths/actions and JSON property names
- Prisma tables/fields
- Environment variables
- Cookie names
- Local/session-storage keys
- Cloud snapshot properties
- Game, generation, section, task, and dex keys
- Provider webhook fields and identifiers
- URL paths/query parameters
- `window.PPGC`, `window.DATA`, and `window.store` properties

Map external snake_case provider fields at the provider boundary. Internal application objects remain camelCase.

## Errors and logging

- User-facing errors should explain the next action without exposing secrets/provider internals.
- Preserve original errors for server logs with a stable feature prefix.
- Do not leave verbose debug `console.log` calls in production paths.
- Use `console.debug` only for intentionally optional diagnostics and consider a development/debug gate.
- Never log passwords, auth tokens, raw reset/verification tokens, webhook secrets, or full private snapshots.

## Automated enforcement proposal

Adopt in stages after approval:

1. Track EditorConfig and a single Prettier configuration.
2. Add Prettier as a development dependency and `format`/`format:check` scripts.
3. Add ESLint with JavaScript, React, hooks, and import correctness rules.
4. Add Stylelint with basic correctness first; phase in class naming for new/touched CSS.
5. Add a `check` script that runs format check, lint, syntax/tests, and build.
6. Run checks in CI before adding pre-commit hooks.

Do not enable hundreds of naming errors at once. Establish a baseline and tighten rules by directory or touched-file policy.

## Verification requirements

After each implementation batch:

- Format only affected files
- Run lint and syntax/type checks available for the project
- Run focused unit/integration tests
- Run the production build
- Search for old filenames, identifiers, classes, IDs, and data hooks
- Verify all dynamic HTML-template selectors
- Verify local/cloud save round trips when persisted behavior is touched
- Verify authentication/payment flows with provider test environments when relevant
- Check keyboard focus, Escape, overlays, scroll locking, and focus restoration for modal/menu work
- Check 320, 360, 390, 430, tablet, and desktop widths for UI changes
- Check reduced-motion behavior
- Record manual visual checks until automated visual coverage exists
