const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_FILE = "database.json";

app.use(cors());
app.use(express.json());

// Load existing data
function loadData() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    } catch (error) {
        return {};
    }
}

// Save data to JSON file
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get time tracking data
app.get("/get-data", (req, res) => {
    const data = loadData();
    res.json(data);
});

// Save time tracking data
app.post("/save-data", (req, res) => {
    let data = loadData();
    const { website, time } = req.body;

    if (!data[website]) {
        data[website] = 0;
    }
    data[website] += time;

    saveData(data);
    res.json({ success: true });
});

// Clear all data
app.delete("/clear-data", (req, res) => {
    saveData({});
    res.json({ success: true });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
