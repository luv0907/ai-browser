// A small, same-site crawler and ranked search index.
// This is NOT a copy of Google — it only crawls the pages of a site YOU add,
// stays on that one domain, fetches a small number of pages with a delay
// between requests, and identifies itself honestly in its User-Agent.

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1]).trim() : "";
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ");
}

function extractLinks(html, baseUrl) {
  const links = [];
  const re = /<a\s+[^>]*href\s*=\s*["']([^"'#]+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const u = new URL(m[1], baseUrl);
      if (u.protocol === "http:" || u.protocol === "https:") links.push(u.href.split("#")[0]);
    } catch {
      // a malformed href is just skipped
    }
  }
  return [...new Set(links)];
}

// Crawls one site, staying on the same hostname, up to maxPages pages.
async function crawlSite(seedUrl, { maxPages = 40, delayMs = 250 } = {}) {
  const seed = new URL(seedUrl.startsWith("http") ? seedUrl : "https://" + seedUrl);
  const host = seed.hostname;
  const visited = new Set();
  const queue = [seed.href];
  const pages = {};

  while (queue.length && visited.size < maxPages) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "AI-Browser-PersonalSearchBot/1.0 (local learning project, same-site only)" },
        signal: AbortSignal.timeout(8000),
      });
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("text/html")) continue;

      const html = await res.text();
      const title = extractTitle(html) || url;
      const text = stripTags(decodeEntities(html)).replace(/\s+/g, " ").trim().slice(0, 20000);
      const links = extractLinks(html, url).filter((l) => {
        try { return new URL(l).hostname === host; } catch { return false; }
      });

      pages[url] = { title, text, links, crawledAt: Date.now() };
      links.forEach((l) => { if (!visited.has(l)) queue.push(l); });
    } catch {
      // a page that fails to load (timeout, 404, etc.) is just skipped
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return pages;
}

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "of", "to", "in", "on", "and", "or", "for", "with",
  "this", "that", "it", "as", "by", "at", "be", "was", "were", "from", "you", "your",
]);

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

// How many other indexed pages link to each page — a tiny, same-site version
// of the idea behind PageRank (a page many others link to ranks higher).
function buildInlinkCounts(pages) {
  const counts = {};
  Object.values(pages).forEach((p) => {
    (p.links || []).forEach((l) => {
      if (pages[l]) counts[l] = (counts[l] || 0) + 1;
    });
  });
  return counts;
}

// Ranks indexed pages for a query using TF-IDF, boosted by inlink count
// and a title-match bonus. This is the same family of idea real search
// engines use, just at a tiny, single-site scale.
function rankQuery(pages, query, limit = 10) {
  const qTerms = tokenize(query);
  const urls = Object.keys(pages);
  if (!qTerms.length || !urls.length) return [];

  const N = urls.length;
  const inlinks = buildInlinkCounts(pages);
  const df = {};
  const docTokens = {};

  urls.forEach((u) => {
    const toks = tokenize((pages[u].title || "") + " " + (pages[u].text || ""));
    docTokens[u] = toks;
    new Set(toks).forEach((t) => { df[t] = (df[t] || 0) + 1; });
  });

  const scored = urls
    .map((u) => {
      const toks = docTokens[u];
      if (!toks.length) return null;
      const tf = {};
      toks.forEach((t) => (tf[t] = (tf[t] || 0) + 1));

      let score = 0;
      qTerms.forEach((t) => {
        if (tf[t]) {
          const idf = Math.log((N + 1) / ((df[t] || 1) + 1)) + 1;
          score += (tf[t] / toks.length) * idf;
        }
      });
      if (score <= 0) return null;

      score *= 1 + Math.log(1 + (inlinks[u] || 0));
      const titleToks = new Set(tokenize(pages[u].title || ""));
      if (qTerms.some((t) => titleToks.has(t))) score *= 1.5;

      return { url: u, score, title: pages[u].title, text: pages[u].text || "" };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((r) => {
    const lower = r.text.toLowerCase();
    let idx = -1;
    for (const t of qTerms) {
      idx = lower.indexOf(t);
      if (idx >= 0) break;
    }
    const start = Math.max(0, idx - 60);
    const snippet =
      (idx > 0 ? "…" : "") +
      r.text.slice(start, start + 200) +
      (r.text.length > start + 200 ? "…" : "");
    return { url: r.url, title: r.title, snippet, score: Math.round(r.score * 100) / 100 };
  });
}

module.exports = { crawlSite, rankQuery };
