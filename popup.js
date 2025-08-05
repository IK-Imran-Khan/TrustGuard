document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleScan");
  const toggleLabel = document.getElementById("toggleLabel");
  const statusEl = document.getElementById("status");
  const historyEl = document.getElementById("history");

  function loadHistory() {
    chrome.runtime.sendMessage({ type: "getHistory" }, (response) => {
      if (!response || !response.scanHistory || response.scanHistory.length === 0) {
        historyEl.textContent = "No passed profiles/jobs yet.";
        return;
      }
      historyEl.innerHTML = "";
      response.scanHistory.forEach(item => {
        const div = document.createElement("div");
        div.style.marginBottom = "10px";
        div.style.padding = "7px";
        div.style.background = "#eef8ee";
        div.style.borderRadius = "6px";
        div.innerHTML = `<strong>${item.job_title}</strong> @ <em>${item.company}</em>
        <br><span style="font-size: 11px; color: #666">${item.location || "N/A"}</span>
        <br><span style="font-size: 12px">${item.description ? item.description.substring(0, 60).replace(/\n/g, " ") + (item.description.length > 60 ? "..." : "") : ""}</span>`;
        historyEl.appendChild(div);
      });
    });
  }

  chrome.storage.sync.get(["autoScanEnabled"], (result) => {
    const enabled = result.autoScanEnabled !== false;
    toggle.checked = enabled;
    toggleLabel.textContent = `Auto Scan: ${enabled ? "On" : "Off"}`;
    if (enabled) triggerScan();
    else statusEl.textContent = "Auto Scan is Off";
    loadHistory();
  });

  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;
    toggleLabel.textContent = `Auto Scan: ${enabled ? "On" : "Off"}`;
    chrome.storage.sync.set({ autoScanEnabled: enabled });
    if (enabled) {
      triggerScan();
    } else {
      statusEl.textContent = "Auto Scan is Off";
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) return;
        chrome.tabs.sendMessage(tabs[0].id, { type: "removeBanner" });
      });
    }
  });

  function triggerScan() {
    statusEl.textContent = "Checking job/profile...";
    chrome.runtime.sendMessage({ type: "checkJob" }, (response) => {
      if (!response) {
        statusEl.textContent = "❌ No response from background script.";
        statusEl.style.color = "red";
        return;
      }
      switch (response.status) {
        case "genuine":
          statusEl.textContent = "✔️ Job/profile is Genuine!";
          statusEl.style.color = "green";
          break;
        case "suspicious":
          statusEl.textContent = "⚠️ Job/profile could be Suspicious!";
          statusEl.style.color = "orange";
          break;
        case "off":
          statusEl.textContent = "ℹ️ Auto scan is OFF.";
          statusEl.style.color = "#6c757d";
          break;
        case "error":
        default:
          statusEl.textContent = `❌ Unable to verify! ${response.message || ""}`;
          statusEl.style.color = "red";
      }
      loadHistory();
    });
  }
});
