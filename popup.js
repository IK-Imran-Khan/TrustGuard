document.getElementById('checkBtn').addEventListener('click', () => {
  const statusEl = document.getElementById('status');
  statusEl.textContent = 'Checking...';

  // ---Send message to background to get job details & check---
  chrome.runtime.sendMessage({ type: 'checkJob' }, (response) => {
    if (response && response.status === 'genuine') {
      statusEl.textContent = '✔️ Job/profile is genuine!';
    } else if (response && response.status === 'suspicious') {
      statusEl.textContent = '⚠️ Job/profile could be suspicious.';
    } else {
      statusEl.textContent = '❌ Unable to verify the job/profile.';
    }
  });
});
