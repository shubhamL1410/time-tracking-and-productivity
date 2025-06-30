document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/get-data")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log("Fetched Data in Popup:", data);
            let display = "";

            if (Object.keys(data).length === 0) {
                display = "<p>No data available.</p>";
            } else {
                for (let site in data) {
                    let timeSpent = Math.round(data[site]);
                    display += `<p>${site}: ${timeSpent}s</p>`;
                }
            }

            document.getElementById("data").innerHTML = display;
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
            document.getElementById("data").innerHTML = `<p>Failed to load data.</p>`;
        });

    document.getElementById("dashboard-btn").addEventListener("click", () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("../dashboard/dashboard.html") });
    });

    document.getElementById("clear-data-btn").addEventListener("click", () => {
        fetch("http://localhost:3000/clear-data", { method: "DELETE" })
            .then(() => {
                document.getElementById("data").innerHTML = "<p>Data cleared!</p>";
            })
            .catch((err) => console.error("Error clearing data:", err));
    });
});
