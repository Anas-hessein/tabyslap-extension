const DEFAULT_LIMIT = 5;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ tabLimit: DEFAULT_LIMIT });
});

chrome.tabs.onCreated.addListener(async () => {
    const tabs = await chrome.tabs.query({});
    const limitData = await chrome.storage.local.get("tabLimit");
    const limit = limitData.tabLimit || DEFAULT_LIMIT;

    if (tabs.length > limit) {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Too Many Tabs!",
            message: getRandomRoast(),
            priority: 2,
        });
    }
});

function getRandomRoast() {
    const roasts = [
            "Another one? Really?",
    "Your RAM is crying.",
    "Ever heard of bookmarks?",
    "Tab hoarding is not a personality.",
    "You're the reason Chrome eats RAM.",
    "Tabs are not pets, you know.",
    "This isn't a tab museum.",
    "You must really love clutter.",
    "Your browser called, it wants a break.",
    "Tabs are not trophies.",
    "You have more tabs than friends.",
    "Is this a tab or a black hole?",
    "You should consider tab therapy.",
    "Your browser is not a hoarder.",
    "Tabs are not your life story.",
    ];

    return roasts[Math.floor(Math.random() * roasts.length)];
}