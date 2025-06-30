let activeTab = null;
let startTime = null;
const SERVER_URL = "http://localhost:3000";

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    handleTabSwitch(tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        handleTabSwitch(tab.url);
    }
});

function handleTabSwitch(url) {
    if (activeTab) {
        let totalTime = (Date.now() - startTime) / 1000;
        sendDataToServer(activeTab, totalTime);
    }
    activeTab = new URL(url).hostname;
    startTime = Date.now();
}

// Send Data to Backend
function sendDataToServer(website, timeSpent) {
    console.log(`Sending Data: ${website} - ${timeSpent}s`); // Debugging log

    fetch(`${SERVER_URL}/save-data`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ website, time: timeSpent }),
    })
    .then(res => res.json())
    .then(data => console.log("Server Response:", data))
    .catch((err) => console.error("Error sending data:", err));
}

// Fetch Data from Server
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getData") {
        fetch(`${SERVER_URL}/get-data`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Data in Background.js:", data); // Debugging log
                sendResponse(data);
            })
            .catch((err) => console.error("Error fetching data:", err));
        return true;
    }
});
