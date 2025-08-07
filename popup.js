document.addEventListener("DOMContentLoaded", () => {
    const limitInput = document.getElementById("limit");
    const status = document.getElementById("status");
    const saveBtn = document.getElementById("save");

    chrome.storage.local.get("tabLimit", (data) => {
        limitInput.value = data.tabLimit || 5;
    });

saveBtn.addEventListener("click", () => {
    const newLimit = parseInt(limitInput.value, 10);
    if (!isNaN(newLimit) && newLimit > 0) {
        chrome.storage.local.set({ tabLimit: newLimit }, () => {
        status.textContent = `✅ Limit saved: ${newLimit}`;
        status.style.color = "#77dd77";
     
        setTimeout(() => {
            status.textContent = "";
        }, 3000);
        });
    } else {
        status.textContent = "❌ Please enter a valid number.";
        status.style.color = "#ff6b6b";
        }
  });
});