function getJobDetails() {
  const jobTitleSelectors = [
    'h1[data-test="job-title"]',
    ".fe-profile-title",
    ".identity-content-title",
    "h1",
    ".job-title",
    ".posting-title",
    ".title",
  ];

  const companySelectors = [
    ".identity-content-company",
    ".company",
    ".client-name",
    ".employer",
    ".company-name",
    ".break",
  ];

  const locationSelectors = [
    ".fe-location",
    ".identity-content-location",
    ".location",
    ".job-location",
    ".city",
    ".job-meta-location",
  ];

  const descriptionSelectors = [
    ".description",
    ".job-description",
    ".overview",
    ".up-card-section",
    "[data-test='job-description-text']",
  ];

  function findText(selectors) {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim() !== "") return el.innerText.trim();
    }
    return "";
  }

  return {
    job_title: findText(jobTitleSelectors),
    company: findText(companySelectors),
    location: findText(locationSelectors),
    description: findText(descriptionSelectors),
  };
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "notifyStatus") {
    showStatusBanner(msg.status, msg.message);
  } else if (msg.type === "removeBanner") {
    const banner = document.getElementById("job-fraud-checker-banner");
    if (banner) banner.remove();
  }
});

function showStatusBanner(status, message) {
  const oldBanner = document.getElementById("job-fraud-checker-banner");
  if (oldBanner) oldBanner.remove();

  const banner = document.createElement("div");
  banner.id = "job-fraud-checker-banner";

  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.right = "0";
  banner.style.padding = "15px 10px";
  banner.style.backgroundColor =
    status === "genuine"
      ? "#28a745"
      : status === "suspicious"
      ? "#dc3545"
      : status === "off"
      ? "#6c757d"
      : "#6c757d";
  banner.style.color = "white";
  banner.style.fontWeight = "bold";
  banner.style.fontSize = "16px";
  banner.style.textAlign = "center";
  banner.style.zIndex = "9999999";
  banner.style.fontFamily =
    '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
  banner.style.cursor = "pointer";
  banner.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";

  banner.title = message || "";

  if (status === "genuine") {
    banner.textContent = "✔️ This job/profile appears GENUINE";
  } else if (status === "suspicious") {
    banner.textContent = "⚠️ Warning: This job/profile could be SUSPICIOUS";
  } else if (status === "off") {
    banner.textContent = "ℹ️ Auto scan is currently OFF";
  } else {
    banner.textContent = "ℹ️ Unable to VERIFY job/profile status";
  }

  banner.onclick = () => banner.remove();

  document.body.prepend(banner);

  setTimeout(() => banner.remove(), 12000);
}

window.addEventListener("load", () => {
  chrome.storage.sync.get(["autoScanEnabled"], (result) => {
    if (result.autoScanEnabled === false) return;
    const jobDetails = getJobDetails();
    if (!jobDetails.job_title) {
      console.warn("Job title not found for fraud check.");
      return;
    }
    chrome.runtime.sendMessage({ type: "checkJobAuto", data: jobDetails }, (response) => {
      if (response?.status) {
        showStatusBanner(response.status, response.message);
      } else {
        showStatusBanner("error", "No response from background.");
      }
    });
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "notifyStatus") {
    showStatusBanner(msg.status, msg.message);
  } else if (msg.type === "removeBanner") {
    const banner = document.getElementById("job-fraud-checker-banner");
    if (banner) banner.remove();
  }
});
