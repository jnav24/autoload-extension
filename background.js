let intervalId;
const intervals = {};

function runTabQuery(request) {
  if (request.action === "start") {
    if (!intervalId) {
      intervalId = setInterval(() => {
        // Query the active tab in the current window
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          console.log('::::::::::::::::::::: tabs', tabs);
          if (tabs.length > 0) {
            chrome.tabs.reload(tabs[0].id); // Reload the active tab
          }
        });
      }, request.interval);
    }
  } else if (request.action === "stop") {
    clearInterval(intervalId);
    intervalId = null;
  }
};

function runSenderTab(request, sender) {
  if (request.action === "start") {
    if (!intervalId) {
      intervalId = setInterval(() => {
        chrome.tabs.reload(sender.id);
      }, request.interval);
    }
  } else if (request.action === "stop") {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function runOnSelectedTab(request) {
  console.log(':::::::::::::::::::::::::: request', request);
  console.log(':::::::::::::::::::::::::: intervals', intervals);
  console.log(':::::::::::::::::::::::::: condition', request.action === "start" && request.tabId && !intervals[request.tabId]);

  if (request.action === "start" && request.tabId && !intervals[request.tabId]) {
    console.log(':::::::::::::::::::::: starting: ', `tab: ${request.tabId}`, `timestamp: ${new Date().toISOString()}`);

    intervals[request.tabId] = setInterval(() => {
      console.log(':::::::::::::::::::::: reloading: ', `tab: ${request.tabId}`, `timestamp: ${new Date().toISOString()}`);
      chrome.tabs.reload(request.tabId);
    }, request.interval);
    
    return;
  }

  console.log(':::::::::::::::::::::: clearing: ', `tab: ${request.tabId}`, `timestamp: ${new Date().toISOString()}`);
  clearInterval(intervals[request.tabId]);
  delete intervals[request.tabId];  
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log(':::::::::::::::::::::::::: request', request);
  // console.log(':::::::::::::::::::::::::: sender', sender);
  runOnSelectedTab(request);
  // runTabQuery(request);
  // runSenderTab(request, sender);
});


