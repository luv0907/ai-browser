# AI Browser 🛡️

A small desktop web browser built with Electron (Chromium + Node.js), with an AI sidebar and a built-in scam-link checker.

## Features
- Tabs, address bar, back/forward/reload
- AI page summary using the Groq API
- Rule-based scam-link checker (no HTTPS, raw IP, look-alike characters, link shorteners, fake brand names, pressure words)
- High-risk addresses are stopped before loading, with a warning bar

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

Built while learning agentic AI, cloud and cybersecurity.
