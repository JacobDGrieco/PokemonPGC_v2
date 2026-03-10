# PokemonPGC

_Pokémon Post-Game Checklist, Dex Tracker, and Data Hub_

> **Unofficial fan project.** Pokémon and all related names/images are trademarks of The Pokémon Company, Nintendo, Game Freak, etc. This is a personal hobby tool with no commercial affiliation.

> **PROJECT IS STILL WIP!!!** I'm currently working to add all data for each game, but the general idea is pretty much done. Commits will be pretty often as I'm adding the data, fixing little bugs I notice, changing things around, and adding new features. Once all data is added properly and I don't notice any bugs, an official release will be created.

> **I'm working towards making this a public website.** Once I can get an official release here on GitHub, I will be looking into get a domain name and everything surrounding that completed so that we can have a public website for all to enjoy together. And you won't have to worry about installing your own local version if you don't want to, which I know I don't always want to do for a simple tracker.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Per-Game Checklists](#per-game-checklists)
  - [Dex Viewer & Forms Layout](#dex-viewer--forms-layout)
  - [Tasks, Sidequests & Research](#tasks-sidequests--research)
  - [Event Distributions](#event-distributions)
  - [Fashion, Recipes & Collectibles](#fashion-recipes--collectibles)
  - [Shiny / Alpha Tracking](#shiny--alpha-tracking)
  - [Dex Sync (Regional ↔ National)](#dex-sync-regional--national)
- [Data Model (High Level)](#data-model-high-level)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure-conceptual)
- [Getting Started](#getting-started)
  - [Frontend-Only](#1-frontend-only-local-checklist)
  - [Full Backend Setup](#2-full-setup-with-backend-accounts--cloud-backup)
- [Save / Backup Options](#save--backup-options)
- [Self-Hosting Tips](#self-hosting-tips)
- [Roadmap / Ideas](#roadmap--ideas)
- [Contributing / Customizing](#contributing--customizing)
- [Legal](#legal)

---

## Overview

**PokemonPGC** (Pokémon Post-Game Checklist) is a web app that helps you track virtually everything across your Pokémon games:

- Main story & post‑game checklists per game
- Regional & national Pokédex completion
- Forms, gender differences, shiny / alpha variants
- Sidequests, research tasks, trades, gifts, rankings
- Event distributions (with region filters)
- Fashion items, curry/sandwich recipes, and other collectibles

The app is designed to run entirely in the browser (using localStorage) **or** with an optional Node/Express backend for multi-device syncing.

---

## Features

### Per-Game Checklists

- Each supported game has its own tab/section.
- Summary header shows:
  - Completion percentage
  - Visual progress bar
- Tasks can be grouped by:
  - Story / post-game
  - Sidequests / optional content
  - Game-specific systems (Battle Frontier, contests, etc.)
- Supports subtasks, tags, and optional metadata for richer tracking.

### Dex Viewer & Forms Layout

- Regional and national dexes per generation.
- Each dex entry includes:
  - ID, name, regular & shiny sprite paths
  - Optional forms (regional forms, gender forms, etc.)
  - Possible `mythical` flag for Set All
- Form entries are rendered in a **radial/grid layout** inside a modal:
  - Radial view of forms up to 7 forms
  - Grid view of forms with 8 or more forms
  - Automatic card spacing & scaling to avoid clipping
  - Vertical scrolling when there are many forms
- Shiny toggle for switching between regular/shiny display, persisted in state.

### Tasks, Sidequests & Research

- Rich tracking beyond “beat the game”:
  - Sidequests, unique encounters, etc.
  - Research/task-based systems (e.g. Legends-style research entries).
  - Trades, gift Pokémon, rankings, and special events.
- Tasks live in data files (plain JS objects) and are fully customizable.

### Event Distributions

- Dedicated **Distributions** view for tracking event Pokémon.
- Each card can define:
  - Event name/description
  - Applicable games
  - Regions (e.g., `North America`, `Europe`, `Japan`, `Region Free`)
  - Shiny / alpha flags
- Region dropdown filter:
  - Shows only distributions for the selected region.
  - `Region Free` events are always visible regardless of filter.
- Cards show region tags and optional shiny/alpha badges.

### Fashion, Recipes & Collectibles

- Separate modules for things like:
  - Fashion items (clothes, accessories, etc.)
  - Curry/sandwich/food recipes
  - Other collectible subsystems per game
- Use similar card+meter patterns:
  - Per-section meter (`X / Y` items collected)
  - Cards arranged in radial rings, with icons and completion toggles.

### Shiny / Alpha Tracking

- Dex entries store both `img` (regular) and `imgS` (shiny).
- Global shiny-mode toggle affects how sprites are rendered.
- Distributions and other modules can show shiny/alpha badges for relevant content.

### Dex Sync (Regional ↔ National)

- Dex entries can define `dexSync` links, e.g.:
  ```js
  dexSync: [
    { game: "ruby", dexType: "regional", id: 201 },
    { game: "ruby", dexType: "national", id: 385 },
  ];
  ```
- Allows cross-linking between regional and national dex entries.
- Makes it easier to keep completion consistent across dex views.

---

## Data Model (High Level)

The project is heavily data-driven. Basically all content is defined in JS data files.

**Checklist Tasks**

```js
{
	id: "legendsza-catching-2",
	text: "Obtain all In-Game Gift Pokémon",
	done: false,
	children: [
		...,
		...,
		{
			id: "legendsza-catching-2-i",
			text: "AZ's Floette",
			done: false,
			img: "imgs/sprites/gen9/legendsza/base-icons/670-e.png",
			taskSync: ["legendsza-story-2-a", "legendsza-mega-stones-26"],
			dexSync: [{ game: "legendsza", dexType: "regional", id: 39, form: "Eternal Flower" }],
		},
	],
}
```

![Checkbox Task + Subtask Example](github-imgs/chrome_PGugZ84qZu.png)

```js
{
	id: "legendsza-upgrades-1-a",
	text: "Red Canari Plush",
	img: "imgs/items/gen9/legendsza/redcanariplushlv.3.png",
	type: "tiered",
	tiers: [3, 5, 8],
	currentTier: 0,
	currentCount: 0,
	unit: "caught",
	tooltip: "Increase EXP Points gained.\nTier thresholds are 3, 5, and 8 Colorful Screws.",
},
```

![Slider Task Example](github-imgs/chrome_ZnPgeIyfVX.png)

**Dex Entries**

```js
{
	id: 158,
	name: "Furfrou",
	img: "imgs/sprites/gen9/legendsza/base-icons/676.png",
	imgS: "imgs/sprites/gen9/legendsza/shiny-icons/676.png",
	forms: [
		{
			name: "Natural Trim",
			img: "imgs/sprites/gen9/legendsza/base-icons/676.png",
			imgS: "imgs/sprites/gen9/legendsza/shiny-icons/676.png",
		},
		...,
		{
			name: "Pharaoh Trim",
			img: "imgs/sprites/gen9/legendsza/base-icons/676-ph.png",
			imgS: "imgs/sprites/gen9/legendsza/shiny-icons/676-ph.png",
		},
		],
},
```

![Dex Entries Example](github-imgs/chrome_S65K5uqZiV.png)
![Form Entries Example](github-imgs/chrome_qzUdmE90h6.png)

**Distributions**

```js
...,
{
	id: 5,
	eventTitle: "Early Purchase Ralts",
	region: "Region Free",
	name: "Ralts",
	image: "imgs/sprites/gen9/legendsza/base-icons/280.png",
	gender: "female",
	"start-date": "2025-10-16",
	"end-date": "2026-02-28",
	ball: { name: "Cherish Ball", img: "imgs/balls/gen9/legendsza/pokeball.png" },
	level: 6,
	tid: "",
	heldItem: [
		{ name: "Gardevoirite", img: "imgs/mega_stones/gardevoirite.png" },
	],
	moves: [
		{ name: "Disarming Voice", img: "", type: "Fairy" },
		{ name: "Confusion", img: "", type: "Psychic" },
		{ name: "Growl", img: "", type: "Normal" },
		{ name: "Swift", img: "", type: "Normal" },
	],
	extra: ["Go to Link Play → Mystery Gift → Get via Internet"],
},
...,
```

![Distributions Example](github-imgs/chrome_VDJ6czAii2.png)

**Fashion / Collectibles**

```js
{
	id: "cardigan-and-blouse",
	name: "Cardigan & Blouse Set",
	forms: [
		{ id: "cardigan-and-blouse-1", name: "Flowery White" },
		{ id: "cardigan-and-blouse-2", name: "Flowery Blue" },
		{ id: "cardigan-and-blouse-3", name: "Bow-and-Bone Black" },
		{ id: "cardigan-and-blouse-4", name: "Bow-and-Bone Purple" },
	],
},
```

![Fashion Items Example](github-imgs/chrome_8DjRX7day0.png)
![Fashion Forms Example](github-imgs/chrome_QzNLCUXRxY.png)

---

## Tech Stack

**Frontend**

- Plain **HTML, CSS, and JavaScript** (no big frontend framework).
- Custom modules for:
  - Sidebar & tab navigation
  - Global store and persistence
  - Dex & radial layouts
  - Distributions, fashion, and other feature UIs
- Uses **localStorage** for offline/guest saves.
- Also has an optional **local backup** menu for saving data to **json** files for an extra layer of saving.

**Backend (Optional)**

- **Node.js + Express** web server.
- **Prisma** ORM with a relational database (SQLite/Postgres/etc.).
- Provides:
  - Account system (sign up / login)
  - Progress backup & restore via `/progress` and other endpoints

The frontend works fully standalone, but connecting the backend enables multi-device sync and more robust backups.

---

## Project Structure (Conceptual)

Actual layout may differ, but the core idea:

```text
PokemonPGC/
  	frontend/
		index.html               	# App entry point
		api.js						# Backend chatting
		data/						# Per-Game data
			data.js               	# initialization for titles
			bootstrap.js			# Hub for data file imports
			distributions/...		# Any internet/serial-code/IRL events distribution
			fashion/...				# Any collectable fashion item
			layouts/...				# Layouts for tasks/subtasks
			natidexs/...			# All Pokemon in a game's National Dex
			regidexs/...			# All Pokemon in a game's Regional Dex
			tasks/...				# All sections and tasks
		dist/...					# Files to bundling site for better performance
		fonts/...					# Pokemon themed fonts for possible use
		imgs/...					# All images used for the site
		src/
			modals/...
			ui/...
			index.js
			persistence.js
			progress.js
			registry.js
			store.js
			tasks.js
		styles/...					# All CSS styling for elements
  	backend/
		package.json
		src/
			server.js             	# Express entry
			db.js
			routes/
				auth.js
				health.js
				progress.js
		prisma/
			schema.prisma
			.env.example
		scripts/
			dev-setup.sh
```

---

## Getting Started

### 1. Frontend-Only (Local Checklist)

This is the easiest way to use PokemonPGC for personal tracking.

1. Clone or download the repository.
2. Ensure the `imgs/` folder contains the required sprites/icons.
3. Open `index.html` in your browser:
   - Double-click it, or
   - Serve the folder with a simple HTTP server (`python -m http.server`, etc.).
4. Your progress is automatically stored in **localStorage**.

> This mode requires no backend or database.

### 2. Full Setup with Backend (Accounts & Cloud Backup)

To enable account login and server-side backups:

1. **Install dependencies** (from the `backend/` directory):

   Look in dev-setup.sh file

2. **Configure environment variables**:

   - Create a `.env` file (you can start from `.env.example` if present).
   - Set at least:
     ```dotenv
     DATABASE_URL="your_database_connection_string_here"
     JWT_SECRET="your_long_random_secret_here"
     ```

3. **Initialize the database via Prisma**:

   ```bash
   npx prisma migrate dev
   # or
   npx prisma db push
   ```

4. **Start the backend server**:

   ```bash
   npm run dev
   # or
   npm start
   ```

5. **Point the frontend at the backend**:
   - In your frontend config (e.g., a `config.js` or constant), set:
     ```js
     const API_BASE_URL = "http://localhost:3000";
     ```
   - Open `index.html` in your browser and use the login UI.
   - On login, the app:
     - Fetches any existing save from the server.
     - Upserts new progress via the `/progress` route when you trigger backups.

If the backend is offline, the app continues to function using localStorage only.

---

## Save / Backup Options

PokemonPGC supports several layers of saving:

1. **LocalStorage (always enabled)**

   - Stores your progress per browser/device.

2. **Manual Export/Import**

   - Export your progress to a JSON (or zipped) file.
   - Import a file to restore/migrate your save.

3. **Server Backup (optional)**
   - When logged in, progress is synced to the database via API.
   - Signing in on another device can restore your save from the server.

---

## Self-Hosting Tips

- Lightweight enough for a **Raspberry Pi 5** or similar (Possibly smaller, but untested).
- You can:
  - Run the backend (Node + DB) on the device.
  - Serve the frontend either directly from Node or any static file server.
- With a VPN solution like Tailscale, you can access your instance from other devices while keeping it private.

---

## Roadmap / Ideas

These are not guaranteed, but are on the conceptual wishlist:

- Save-file parsing:
  - Upload `.sav` / `.bin` / `main` files.
  - Decode hex to auto-fill dex, tasks, and event flags (per-game, format-dependent).
- More detailed modules:
  - Battle facility tracking, contest tracking, etc.
- Aggregated “global stats” once multi-user usage is common.
- Descriptive tooltips for locations/guides
- Helpful links to other websites for guides/other info

---

## Contributing / Customizing

### Adding a New Game

1. Add a new `gameKey` and configuration to `/data/data.js`.
2. Create corresponding data files in `/data`:
   - Checklist tasks
   - Regional dex (+ any dexSync entries)
   - Optional modules: distributions, fashion, recipes, etc.
3. Register the game’s UI section in your content/layout config.
4. Wire any new modules into the store and persistence layer.

### Editing Data

- All tasks, dex entries, distributions, fashion items, etc. are defined in `/data`.
- You can freely edit these files to:
  - Fix typos
  - Add new tasks
  - Point to new sprites
  - Add new events or items

### Code Contributions

Areas where improvements are especially impactful:

- `rings.js` – radial layout logic used by dex and fashion views.
- `persistence.js` – localStorage and import/export handling.
- `distributions.js` – region filter, shiny/alpha badge display.
- Backend routes – error handling, robustness, and additional endpoints.

### Issues/Suggestions

If you notice ANY issues issues at all, please let me know. That can be:

- Typos
- Improper syncing between tasks/dex entries
- Improper format
- Incorrect catagorization
- Missing tasks/dex entries
- Incorrect information

If you have any suggestions in terms of tasks to add or whole new pieces that could be cool for the project, pretty pretty please let me know. I want this to be an amazing website/tool, so any user feedback is greatly appreciated.

---

## Legal

- This is an **unofficial fan-made project**.
- Pokémon, Pokémon character names, and sprites are trademarks of their respective owners.
- Use of official assets is intended for personal, non-commercial, and educational purposes.
- If you fork or host your own instance, it’s your responsibility to follow the policies of Nintendo, Game Freak, The Pokémon Company, and any asset providers.
