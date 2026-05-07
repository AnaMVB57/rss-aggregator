# RSS Aggregator CLI

**Gator** is a powerful, terminal-based RSS feed aggregator. It allows you to manage users, follow multiple RSS feeds, and aggregate posts into a local database so you can browse the latest tech news without leaving your terminal.

---
## For Windows users

If you are running this on Windows, WSL 2 (Windows Subsystem for Linux) is a strict requirement.

---

## Prerequisites

Before you start, make sure you have the following installed:

* **Node.js** Version 22.15.0
* **Database** PostgreSQL 16+
* **Environment** WSL 2 (for Windows users)

---

## Node version management (NVM)

We use .nvmrc to ensure the correct Node version.

```bash
nvm use
```

---

## Database Setup (WSL/Linux)

Install Postgres:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Start the service:

```bash
sudo service postgresql start
```

Configure User and DB

```bash
sudo -u postgres psql
# Inside psql:
CREATE DATABASE gator;
ALTER USER postgres PASSWORD 'postgres';
\q
```

---

## Installation and setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rss-aggregator.git
cd rss-aggregator
```

### 2. Application Configuration

This project stores state (current user and DB credentials) in a hidden JSON file in your HOME directory: `~/.gatorconfig.json`.

Manually create the file:

```JSON
{
  "db_url": "postgres://postgres:postgres@localhost:5432/gator"
}
```

### 3. Install dependencies
```bash
npm install
```

### 3. Database configuration
This project uses **Drizzle ORM**. Ensure your connection string is set up. Create a `.env` file (or adjust your `config.ts`) with your PostgreSQL credentials. 

Then, run the migrations:
```bash
npx drizzle-kit push
```

---

## Available commands

You can run the program using `npm run start <command> [args]`. Here are the main categories:

### User management
* `register <name>`: Create a new user account.
* `login <name>`: Log in as an existing user.
* `users`: List all registered users.

### Feed management
* `addfeed <name> <url>`: Add a new RSS feed to the system (Requires login).
* `feeds`: List all available feeds and the users who added them.
* `follow <url>`: Start following a specific feed.
* `following`: Show all feeds you are currently following.
* `unfollow <url>`: Stop following a feed.

### Aggregation and browsing
* **`agg <time_interval>`**: The heart of the program. Collects posts from all feeds every `X` (e.g., `1m`, `1h`).
* **`browse [limit]`**: View the latest posts from the feeds you follow. Default limit is 2.

### System
* `reset`: **Warning!** Deletes all users, feeds, and posts from the database.

---

## Project structure

```text
src/
├── commands/      # Command handlers & Logic
├── lib/
│   └── database/  # Drizzle schema, migrations & queries
├── utils/         # Helper functions & Config
└── index.ts       # Main Entry point
```

---

## Technical stack
* **Runtime:** Node.js
* **Language:** TypeScript (run with `tsx`)
* **Database:** PostgreSQL
* **ORM:** Drizzle ORM

---

### Notes
* Most feed-related commands require you to be logged in (handled via middleware).
* The `agg` command will continue running until you manually stop it with `Ctrl+C`.

---
