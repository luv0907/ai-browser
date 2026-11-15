// A curated list of well-known ad and tracker domains, used to power the
// browser's "Shields" ad/tracker blocking (☰ > Settings > Block ads & trackers).
//
// Honest about what this is: it's a few hundred widely-known domains, hand
// picked from major ad networks, analytics tools and tracking pixels. It is
// NOT a copy of EasyList/EasyPrivacy (which have tens of thousands of rules)
// and it will miss plenty of smaller or newer trackers. Think of it as a
// solid starting shield, not a guarantee.

const AD_TRACKER_DOMAINS = [
  // Google ads & analytics
  "doubleclick.net", "googlesyndication.com", "googleadservices.com",
  "google-analytics.com", "googletagmanager.com", "googletagservices.com",
  "adservice.google.com", "pagead2.googlesyndication.com",

  // Facebook / Meta
  "connect.facebook.net", "facebook.net", "an.facebook.com",

  // Amazon ads
  "amazon-adsystem.com",

  // Major ad exchanges / networks
  "adnxs.com", "adsrvr.org", "pubmatic.com", "rubiconproject.com",
  "openx.net", "casalemedia.com", "contextweb.com", "criteo.com",
  "criteo.net", "outbrain.com", "taboola.com", "bidswitch.net",
  "smartadserver.com", "advertising.com", "media.net", "yieldmo.com",
  "sharethrough.com", "spotxchange.com", "indexexchange.com",
  "sovrn.com", "33across.com", "adform.net", "adroll.com",
  "mathtag.com", "everesttech.net", "bluekai.com", "demdex.net",
  "moatads.com", "scorecardresearch.com", "quantserve.com",

  // Analytics / tracking pixels
  "hotjar.com", "mixpanel.com", "segment.io", "segment.com",
  "fullstory.com", "crazyegg.com", "amplitude.com", "heap.io",
  "clicktale.net", "mouseflow.com",

  // Attribution / mobile tracking
  "branch.io", "appsflyer.com", "adjust.com", "kochava.com",

  // Misc widely-blocked trackers
  "chartbeat.com", "parsely.com", "newrelic.com", "nr-data.net",
  "optimizely.com", "cxense.com", "krxd.net", "rlcdn.com",
  "tapad.com", "agkn.com", "turn.com", "exelator.com",
];

function isBlockedHost(hostname) {
  if (!hostname) return false;
  const h = hostname.toLowerCase();
  return AD_TRACKER_DOMAINS.some((d) => h === d || h.endsWith("." + d));
}

module.exports = { AD_TRACKER_DOMAINS, isBlockedHost };
