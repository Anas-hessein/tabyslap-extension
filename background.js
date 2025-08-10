const DEFAULT_LIMIT = 5;
const DEFAULT_STYLE = "funny";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 
    globalLimit: DEFAULT_LIMIT,
    siteLimits: {},
    roastStyle: DEFAULT_STYLE,
    stats: { totalTabsOpened: 0, roastsGiven: 0, siteCounts: {} },
  });
});

chrome.tabs.onCreated.addListener(async (tab) => {
  const allTabs = await chrome.tabs.query({});
  const data = await chrome.storage.local.get([
    "globalLimit",
    "siteLimits",
    "roastStyle",
    "stats",
    "hardLimitMode"
  ]);

  let limit = data.globalLimit || DEFAULT_LIMIT;

  if (tab.pendingUrl || tab.url) {
    try {
      const domain = new URL(tab.pendingUrl || tab.url).hostname;
      if (data.siteLimits && data.siteLimits[domain]) {
        limit = data.siteLimits[domain];
      }
    } catch (e) {}
  }

  const stats = data.stats || {};
  stats.totalTabsOpened = (stats.totalTabsOpened || 0) + 1;
  const domain = tab.pendingUrl ? new URL(tab.pendingUrl).hostname : "unknown";
  stats.siteCounts[domain] = (stats.siteCounts[domain] || 0) + 1;

  if (allTabs.length > limit) {
    stats.roastsGiven = (stats.roastsGiven || 0) + 1;

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Too Many Tabs!",
      message: getRandomRoast(data.roastStyle),
      priority: 2
    });

    if (data.hardLimitMode) {
      chrome.tabs.remove(tab.id);
    }
  }

  chrome.storage.local.set({ stats });
});

function getRandomRoast(style) {
  const ROASTS = {
    funny: [
      "Another one? Really?",
      "Your RAM is crying.",
      "Ever heard of bookmarks?",
      "Tab hoarding is not a personality.",
      "You're the reason Chrome eats RAM."
    ],
    sarcastic: [
      "Wow, another tab, so unique.",
      "Breaking news: you opened a new tab.",
      "Such bravery, opening tab number infinity."
    ],
    motivational: [
      "You can do this — just close one tab.",
      "Focus brings success. Try it.",
      "Tabs down, productivity up!"
    ]
  };
  const arr = ROASTS[style] || ROASTS.funny;
  return arr[Math.floor(Math.random() * arr.length)];
}
