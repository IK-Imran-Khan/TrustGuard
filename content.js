// ---Example: Extract job title and company from a generic job page---
// ---(You should adapt query selectors based on target websites.)---

function getJobDetails() {
  // ---Try to read job title, company, location from page---
  const jobTitleEl = document.querySelector('h1.job-title, h1, .job-title');
  const companyEl = document.querySelector('.company, .employer, .company-name');
  const locationEl = document.querySelector('.location, .job-location');

  return {
    job_title: jobTitleEl ? jobTitleEl.innerText.trim() : '',
    company: companyEl ? companyEl.innerText.trim() : '',
    location: locationEl ? locationEl.innerText.trim() : ''
  };
}

// ---Listen for message from background or popup asking for job details---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getJobDetails') {
    const details = getJobDetails();
    sendResponse(details);
  }

  // ---Keep the message channel open for async response---
  return true;
});
