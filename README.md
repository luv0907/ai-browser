# AI Browser 🛡️

A standalone desktop web browser built with Electron (Chromium + Node.js) — its own history, bookmarks, downloads and settings, plus an AI sidebar and a built-in scam-link checker. Everything is stored locally on your own machine; nothing is sent anywhere, and there is no hidden tracking of anyone who uses it.

## Features
- Tabs, address bar, back/forward/reload, search-or-go-to-address
- **History** — every page visit is logged locally and searchable, with per-item and clear-all delete
- **Bookmarks** — one-click star button, with a full bookmarks manager window
- **Downloads** — a downloads manager with live progress, "open file" and "show in folder"
- **Settings** — homepage, search engine, and a "clear browsing data" option
- **Keyboard shortcuts & real app menu** — ⌘T new tab, ⌘W close tab, ⌘L address bar, ⌘D bookmark, ⌘Y history, ⌘⇧J downloads, ⌘, settings, ⌘⇧N new window
- AI page summary using the Groq API
- Rule-based scam-link checker (no HTTPS, raw IP, look-alike characters, link shorteners, fake brand names, pressure words)
- High-risk addresses are stopped before loading, with a warning bar

## Where your data lives
All of it is a handful of JSON files on your own Mac, under Electron's standard per-app folder (`~/Library/Application Support/ai-browser/browser-data/` on macOS) — `history.json`, `bookmarks.json`, `downloads.json`, `settings.json`. Nothing is uploaded, and the app has no server component or admin account that can see another user's activity.

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

Built while learning agentic AI, cloud and cybersecurity.
