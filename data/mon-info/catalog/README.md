# Generated Mon Info catalog

`npm run mon-info:publish` writes deterministic JSON for every usable imported game profile to this directory. Approval is not required; when an approved correction exists, it replaces the imported proposal for that profile.

Each `<national-id>/<form>.json` file contains all game profiles for one local form. `manifest.json` maps the HOME Dex species identity and existing local form keys to those shards. The application loads only the selected form and merges any legacy handwritten module afterward as a local override.

Do not hand-edit generated JSON. Correct the local SQLite import database or its normalization code and publish again.
