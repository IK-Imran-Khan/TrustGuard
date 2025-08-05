const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const GEMINI_API_KEY = "--key--";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "checkJob" || request.type === "checkJobAuto") {
    if (request.type === "checkJobAuto") {
      chrome.storage.sync.get(["autoScanEnabled"], (result) => {
        if (result.autoScanEnabled === false) {
          sendResponse({ status: "off" });
          return;
        }
        callGeminiAPI(request.data, sender, sendResponse);
      });
      return true; 
    } else {
      callGeminiAPI(request.data, sender, sendResponse);
      return true;
    }
  }

  if (request.type === "getHistory") {
    chrome.storage.sync.get({ scanHistory: [] }, (result) => {
      sendResponse({ scanHistory: result.scanHistory });
    });
    return true;
  }
});

function callGeminiAPI(jobDetails, sender, sendResponse) {
  if (!jobDetails || !jobDetails.job_title) {
    sendResponse({ status: "error", message: "Job details missing." });
    return;
  }

  const prompt = `
    You are a reliable job/freelancer listing fraud detector AI.
    Given the following information, answer ONLY with "GENUINE" if it appears created or managed by a real human and is likely legitimate,
    or "SUSPICIOUS" if it appears automated, fake, risky, or fraudulent.
    Please provide a one-line explanation.
    Job Title: ${jobDetails.job_title}
    Company: ${jobDetails.company || "N/A"}
    Location: ${jobDetails.location || "N/A"}
    Description: ${jobDetails.description || "N/A"}
    Is this listing/profile GENUINE or SUSPICIOUS?
    `;

  fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const replyLower = reply.toLowerCase();
      let status;
      if (replyLower.includes("genuine")) {
        status = "genuine";
      } else if (
        replyLower.includes("suspicious") ||
        replyLower.includes("fraud") ||
        replyLower.includes("fake")
      ) {
        status = "suspicious";
      } else {
        status = "error";
      }

      if (status === "genuine") {
        showPassedNotification(jobDetails);
        savePassToHistory(jobDetails);
      }

      if (sender.tab?.id) {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "notifyStatus",
          status,
          message: reply,
        });
      }

      sendResponse({ status, message: reply });
    })
    .catch((error) => {
      console.error("Gemini API error:", error);
      if (sender.tab?.id)
        chrome.tabs.sendMessage(sender.tab.id, { type: "notifyStatus", status: "error" });
      sendResponse({ status: "error", message: "API call failed." });
    });
}

function showPassedNotification(job) {
  const desc = job.description ? job.description.slice(0, 80).replace(/\n/g, " ") + (job.description.length > 80 ? "..." : "") : "";
  chrome.notifications.create("scan-pass-" + Date.now(), {
    type: "basic",
    iconUrl: "icon48.png",
    title: "✔️ Genuine Job/Profile Found",
    message: `Title: ${job.job_title}\nCompany: ${job.company || "N/A"}\nLocation: ${job.location || "N/A"}\n${desc}`,
  });
}

function savePassToHistory(job) {
  chrome.storage.sync.get({ scanHistory: [] }, (result) => {
    const history = result.scanHistory;
    history.unshift({
      job_title: job.job_title,
      company: job.company,
      location: job.location,
      description: job.description,
      date: Date.now()
    });
    if (history.length > 20) history.length = 20;
    chrome.storage.sync.set({ scanHistory: history });
  });
}
