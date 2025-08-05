Job Fraud Checker Chrome Extension
Check if Job Listings and Freelancer Profiles are Genuine or Suspicious

Overview
This Chrome extension helps users quickly verify whether remote job listings or freelancer profiles on popular platforms like Upwork, Freelancer, Fiverr, and others are likely genuine or suspicious. It uses advanced AI (Google Gemini API) to analyze page content automatically and provides clear visual feedback.

Features
Automatic scanning of job/freelance pages upon loading.

Extracts job title, company, location, and description for accurate context.

Sends details to AI for fraud/genuine verification.

Banner notification on the top of job pages showing Genuine, Suspicious, or Unable to verify status.

Popup with toggle button to enable or disable automatic scanning.

Saves toggle preferences using Chrome storage.

Works on multiple popular freelancing/job platforms.

Supported Platforms
Upwork

Freelancer

Fiverr

Toptal

PeoplePerHour

Guru

Truelancer

FlexJobs

Outsourcely

Workana

Hubstaff Talent

TaskRabbit

SolidGigs

WeWorkRemotely

Installation
Clone or download this repository.

Open Chrome browser and navigate to chrome://extensions.

Enable Developer mode (top right).

Click Load unpacked and select the project folder.

The extension will appear in your toolbar.

Visit a job or freelancer profile page supported by this extension.

Click the extension icon to open the popup and toggle Auto Scan on or off.

Usage
When Auto Scan is enabled, the extension automatically scans and evaluates pages you visit.

A colored banner will appear on the page indicating:

✅ Genuine: The job/profile looks authentic.

⚠️ Suspicious: The job/profile looks potentially fraudulent or fake.

ℹ️ Unable to verify: The extension could not confidently classify the listing.

You may also manually trigger a scan from the popup.

Configuration
API Key:
Replace YOUR_GEMINI_API_KEY_HERE in background.js with your actual Google Gemini API key.

For local testing or demonstration, you can use free credits if available.

Secure your API keys and avoid sharing them publicly in production.

How It Works (Technical Details)
The extension uses a content script to extract relevant information from supported job/friend profiles.

It sends a request to the background script that forwards the details to the Google Gemini AI API.

The AI responds with a fraud or legitimacy determination.

The content script injects a banner into the page reflecting this verdict.

The popup allows users to toggle automatic scanning.

Development
Add or update CSS selectors in content.js for better data extraction or to support new platforms.

Modify AI prompts in background.js to refine detection accuracy.

Limitations
The extension depends on AI interpretation—results may vary.

Changes in job site designs may require selector updates.

API usage may be limited by quotas or key restrictions.

Contributions
Contributions, suggestions, and issue reports are welcome.

License
MIT License

Contact
For questions or support, contact: imrananeesk@gmail.com
