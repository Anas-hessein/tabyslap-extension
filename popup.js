document.addEventListener("DOMContentLoaded", async () => {
    const globalLimitInput = document.getElementById("global-limit");
    const roastStyleSelect = document.getElementById("roast-style");
    const hardLimitCheckbox = document.getElementById("hard-limit");
    const status = document.getElementById("status");
    const tabInfo = document.getElementById("tab-info");


    const tabs = await chrome.tabs.query({});
    const data = await chrome.storage.local.get(["globalLimit", "roastStyle", "hardLimitMode"]);
    tabInfo.textContent = `you have ${tabs.length} tabs open. Limit: ${data.globalLimit || 6}`;

    globalLimitInput.value = data.globalLimit || 6;
    roastStyleSelect.value = data.roastStyle || "funny";
    hardLimitCheckbox.checked = !!data.hardLimitMode;

      document.getElementById("save").addEventListener("click", () => {
        chrome.storage.local.set({
            globalLimit: parseInt(globalLimitInput.value, 10),
            roastStyle: roastStyleSelect.value,
            hardLimitMode: hardLimitCheckbox.checked
    }, () => {
      status.textContent = "✅ Settings saved!";
      status.style.color = "#77dd77";
      setTimeout(() => status.textContent = "", 2000);
    });
  });

  document.getElementById("close-extra").addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({});
    const limit = parseInt(globalLimitInput.value, 10);
    if (tabs.length > limit) {
      const extraTabs = tabs.slice(limit);
      chrome.tabs.remove(extraTabs.map(t => t.id));
      status.textContent = "🗑 Closed extra tabs!";
      status.style.color = "#ff6b6b";
      setTimeout(() => status.textContent = "", 2000);
    } else {
      status.textContent = "✅ You're under the limit!";
      status.style.color = "#77dd77";
      setTimeout(() => status.textContent = "", 2000);
    }
  });
});