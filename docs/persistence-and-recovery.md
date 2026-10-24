# Persistence and Recovery

## Layers

1. **localStorage:** `ppgc_v1` is the immediate browser snapshot and primary local durability layer.
2. **IndexedDB/File System Access API:** `src/persistence.js` can retain folder handles and write/read backup artifacts when the browser grants permission.
3. **Cloud:** authenticated per-game snapshots live in `GameSave` and are accessed through `/api/progress`.

The layers are coordinated, not interchangeable. Do not delete compatibility readers or keys without a migration and recovery test.

## Snapshot contracts

Snapshots contain navigation and feature-specific maps/task trees. IDs such as `gameKey`, task IDs, Dex IDs, form IDs, and collection IDs connect authored data to persisted decisions. Renaming one can make existing progress appear missing.

Cloud validation accepts a plain object below 1,000,000 serialized characters. The database stores whole JSON documents; there is no schema-version field or field-level merge.

## Save and restore behavior

- Local interactions save synchronously for immediate durability.
- Authenticated cloud updates are per game and can be debounced/periodic depending on the calling flow.
- Account restore can fetch every saved game and apply it through generation-specific code.
- The current system does not use revisions or compare-and-swap. Concurrent devices are therefore last-write/whole-snapshot and can overwrite newer work.

Do not optimize away immediate local writes or redesign cloud startup until crash recovery, conflict precedence, backward compatibility, and failure UX are specified and tested.

## Recovery checklist

1. Preserve the original browser profile, folder backup, and cloud data; do not reset first.
2. Identify the affected game key and which copy has the newest trustworthy progress.
3. Export/copy recoverable artifacts before attempting repair.
4. Load the required generation data before applying a snapshot.
5. Apply the narrowest repair and verify representative tasks, Dex/form state, collections, and navigation.
6. Reload the page and re-open the same game to confirm persistence.
7. Only then allow cloud sync to resume.

## Browser support

`localStorage` is broadly available but can be cleared by browser/user policy. Folder backup depends on the File System Access API and permissions may need to be re-granted; unsupported browsers need export/cloud alternatives. Verify the intended browser matrix manually.

## Privacy

Progress snapshots and save files are private user data. Do not log full snapshots, raw save content, email addresses, auth tokens, or local folder paths. Authenticated API responses remain private/no-store.
