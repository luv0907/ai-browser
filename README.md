# AI Browser 🛡️

A standalone desktop web browser built with Electron (Chromium + Node.js) — its own history, bookmarks, downloads and settings, plus an AI sidebar and a built-in scam-link checker. Everything is stored locally on your own machine; nothing is sent anywhere, and there is no hidden tracking of anyone who uses it.

## Features
- **Profiles** — a Chrome-style "Who's using this browser?" picker. Each profile has its own completely isolated history, bookmarks, cookies, downloads, settings and search index
- Tabs, address bar, back/forward/reload, search-or-go-to-address
- **History** — every page visit is logged locally and searchable, with per-item and clear-all delete
- **Bookmarks** — one-click star button, with a full bookmarks manager window
- **Downloads** — a downloads manager with live progress, "open file" and "show in folder"
- **My Search Engine** — a real, small-scale search engine: give it a website, and it crawls that site's own pages (same domain only, up to 40 pages) and ranks them for your queries with TF-IDF scoring plus an inlink-count "authority" boost, the same family of idea behind PageRank, just at a personal scale
- **Home page** — a Google-style search box for new tabs, which searches your own index first and falls back to a real search engine when your index has nothing relevant
- **Settings** — homepage mode, search engine, and a "clear browsing data" option
- **Keyboard shortcuts & real app menu** — ⌘T new tab, ⌘W close tab, ⌘L address bar, ⌘D bookmark, ⌘Y history, ⌘⇧J downloads, ⌘, settings, ⌘⇧N new window
- AI page summary using the Groq API
- Rule-based scam-link checker (no HTTPS, raw IP, look-alike characters, link shorteners, fake brand names, pressure words)
- High-risk addresses are stopped before loading, with a warning bar

## Where your data lives
Everything is JSON files on your own Mac, under Electron's standard per-app folder (`~/Library/Application Support/ai-browser/` on macOS). Each profile gets its own subfolder (`profiles/<id>/`) with its own `history.json`, `bookmarks.json`, `downloads.json`, `settings.json` and `search-index.json`, and its own isolated Chromium session (separate cookies and site data per profile, via Electron session partitions). Nothing is uploaded anywhere, and there is no admin account or server component that can see what another profile does — switching profiles is for organizing your own browsing, not for monitoring anyone else.

## About "My Search Engine"
This is a genuine small search engine, not a toy that fakes results — it really crawls, really builds an inverted index, and really ranks with TF-IDF and link counts (see `search-engine.js`). What it deliberately is **not**: a copy of Google. A real web-scale search engine crawls and ranks tens of billions of pages using data-center infrastructure, which isn't something a personal project can or should attempt. This crawler stays on one domain at a time, caps itself at 40 pages per site, waits between requests, and identifies itself honestly in its User-Agent string — so it's useful for indexing a handful of sites you choose, not for scraping the internet.

## Security design
- The Groq API key stays in the main process (main.js), never in the web page
- The page talks to the main process through a small preload bridge
- Page text sent to the AI is treated as untrusted data

## Run it
Needs Node.js and a free Groq API key.

    git clone https://github.com/luv0907/ai-browser.git
    cd ai-browser
    npm install
    export GROQ_API_KEY="your-key-here"
    npm start

## Honest limits
- The rules catch only obvious tricks; there is no blocklist of known bad sites yet
- Links clicked inside a page are warned about after loading, not before
- Uses Electron's webview tag, which Electron recommends replacing with WebContentsView
- History logs a page's title as it was at the moment of navigation, so the very first entry for a tab can show "New tab" before the real title loads
- No password manager, extensions, or sync between devices yet — this is a single-machine browser
- The search index ranks pages from sites you've added; it has no idea about the rest of the web beyond those sites
- Deleting a profile from the picker removes it from the list but keeps its data folder on disk, so a mistaken removal never destroys history or bookmarks

Built while learning agentic AI, cloud and cybersecurity.
