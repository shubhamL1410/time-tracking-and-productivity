document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "getData" }, (data) => {
        const UNPRODUCTIVE_SITES = ["youtube.com", "facebook.com", "instagram.com", "twitter.com"];
        const productiveTable = document.querySelector("#productive-table tbody");
        const unproductiveTable = document.querySelector("#unproductive-table tbody");

        for (let site in data) {
            let domain = site.replace("www.", "").split("/")[0]; // Normalize domain
            let row = `<tr><td>${domain}</td><td>${Math.round(data[site])}s</td></tr>`;

            if (UNPRODUCTIVE_SITES.includes(domain)) {
                unproductiveTable.innerHTML += row;
            } else {
                productiveTable.innerHTML += row;
            }
        }
    });

    document.getElementById("download-report").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "getData" }, (data) => {
            let content = "Productivity Report\n\nWebsite - Time Spent (s)\n\n";
            for (let site in data) {
                let domain = site.replace("www.", "").split("/")[0]; // Normalize domain
                content += `${domain} - ${Math.round(data[site])}s\n`;
            }
            let blob = new Blob([content], { type: "text/plain" });
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "ProductivityReport.txt";
            a.click();
        });
    });
});
