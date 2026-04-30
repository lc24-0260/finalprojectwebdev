const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "contacts.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        name      TEXT    NOT NULL,
        email     TEXT    NOT NULL,
        message   TEXT    NOT NULL,
        submitted TEXT    NOT NULL DEFAULT (datetime('now'))
    )
`);

function insertContact(name, email, message) {
    const stmt = db.prepare(
        "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)"
    );
    return stmt.run(name, email, message);
}

function getAllContacts() {
    return db.prepare("SELECT * FROM contacts ORDER BY submitted DESC").all();
}

module.exports = { insertContact, getAllContacts };
