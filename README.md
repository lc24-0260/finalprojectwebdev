# Personal Portfolio – Panagiotis Tsimpouris

My personal portfolio website built for CS293. It covers who I am, my projects, experience, and has a contact form that actually saves messages to a database.

## Stack

- HTML, CSS, JavaScript (frontend)
- Node.js + Express + SQLite (contact form backend)
- Projects and blog posts loaded from JSON files

## Running it locally

Install dependencies first:

```
npm install
```

Then start the server:

```
npm start
```

Open `http://localhost:3000` in your browser.

The contact form submissions get stored in `server/contacts.db`. You can view them at `http://localhost:3000/submissions`.

## Structure

```
index.html        main page
styles.css        all styling
script.js         frontend JS
server/           Node.js backend
data/             JSON files for projects and blog
```
