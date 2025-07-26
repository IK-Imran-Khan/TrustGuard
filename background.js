// ---Replace with your API endpoint and API key 🔑---
const API_ENDPOINT = 'https://api.theirstack.com/v1/jobs/search';
const API_KEY = 'YOUR_API_KEY_HERE'; // ---Put your API key 🔑 here---

// ---Listen for messages from popup 🎉---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'checkJob') {
    // ---Inject content script to get current tab's 💻 job details 📑---
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tabId = tabs[0].id;

      // ---Send message 💭 to content script to extract job details---
      chrome.tabs.sendMessage(tabId, { type: 'getJobDetails' }, (jobDetails) => {
        if (!jobDetails || !jobDetails.job_title) {
          sendResponse({ status: 'error' });
          return;
        }

        // --📲 Call API with extracted job details--
        fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jobDetails)
        })
          .then(res => res.json())
          .then(data => {
            // ---Simplified example: check if any job found 🔍---
            if (data && data.jobs && data.jobs.length > 0) {
              sendResponse({ status: 'genuine' });
            } else {
              sendResponse({ status: 'suspicious' });
            }
          })
          .catch(() => {
            sendResponse({ status: 'error' });
          });
      });
    });

    // ---Return true to indicate async response 🗿---
    return true;
  }
});
