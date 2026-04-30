const express = require("express");
const cors = require("cors");
const path = require("path");
const { insertContact, getAllContacts } = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve the portfolio static files
app.use(express.static(path.join(__dirname, "..")));

app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address." });
    }

    insertContact(name.trim(), email.trim(), message.trim());
    res.json({ success: true, message: "Message received!" });
});

// View all submissions
app.get("/submissions", (req, res) => {
    res.json(getAllContacts());
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
