# E&G Deployment Ledger — NSSF Uganda

A working, deployable version of the resource-allocation tool for the Enterprise & Growth
department: partner sourcing, outreach planning with skill-based staff matching, per diem
approval tracking, and field-time monitoring.

## Running it locally (VS Code)

1. Open this folder in VS Code.
2. Open a terminal (`` Ctrl+` ``) and run:
   ```
   npm install
   npm start
   ```
3. It opens automatically at `http://localhost:3000`. If it doesn't, open that URL yourself.

## Demo accounts

Every seeded account uses the same password: `NssfEG@2026`

| Role | Username | Name |
|---|---|---|
| Senior Manager | `d.kintu` | David Kintu |
| Senior Manager | `p.namono` | Patricia Namono |
| Field Staff | `a.nabatanzi` | Aisha Nabatanzi (Trainer) |
| Field Staff | `s.lubega` | Sam Lubega (Account Manager) |
| Field Staff | *(any staff member — see Manage Users once logged in)* | |

New accounts can be created from **Manage Users** while logged in as a Senior Manager.

## What this is — and isn't — ready for

This is a real, running application: real routing, real role-based page access, and data that
persists in your browser (via `localStorage`) across refreshes. It is **not yet wired to a
shared backend**, so a few things to know before this goes anywhere near production use:

### Data is per-browser, not shared

Everything you enter — new outreaches, partner results, approvals, new users — is saved to
*your browser's* local storage. Open the app on a different computer, or in a different browser,
and it starts fresh from the seed data. This is normal and expected for a local prototype, but it
means **two people can't yet see the same live data**. That requires a real backend (see below).

### Login is demo-grade, not secure

The current login checks a username/password against a list of accounts stored in the browser
itself. This is fine for demonstrating the app, but it is **not secure**:

- Passwords are stored in plain text in the browser's local storage.
- Anyone with basic browser dev tools access could read the account list, including passwords.
- There's no password hashing, no session expiry, no protection against someone editing local
  storage directly to grant themselves Senior Manager access.

### Page-level access control is real, but only goes so far

Field Staff genuinely cannot navigate to **Plan an Outreach**, **Per Diem**, or **Manage Users** —
the router redirects them, and those pages don't render for their role. This is a real
improvement over "hide the button" from the earlier prototype. However, because there's no
backend, a technically capable person could still inspect the browser's local storage and see
the underlying data for those areas. Real security requires the **server** to refuse to send that
data in the first place to anyone who isn't authenticated as a Senior Manager — the frontend
alone can never fully guarantee that.

## What a production deployment would add

To take this from "usable local tool" to "something NSSF IT would sign off on," the natural next
step is a small backend, for example:

- A lightweight API (Node/Express, or similar) with a real database (Postgres, MySQL, etc.)
  instead of `localStorage`, so data is shared across everyone using the tool.
- Real authentication — ideally against NSSF's existing staff directory/SSO if one exists, rather
  than a separate password system to maintain.
- Server-side authorization checks on every request, so a Field Staff account is technically
  incapable of retrieving Senior-Manager-only data, not just prevented from seeing a button for it.
- Hosting somewhere accessible to the whole department (an internal server, or a cloud host if
  NSSF's data policies allow it) instead of running on one person's laptop.

Happy to build that backend as a next step — it's a separate, larger piece of work from this
frontend, but this app is already structured (contexts, clean data actions) to plug into one
without a rewrite.
