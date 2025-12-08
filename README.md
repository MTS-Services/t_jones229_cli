# Fishing Tripper — Front-end

This document explains how to use and run the Fishing Tripper front-end on a client machine. This repository is delivered as a ZIP file (not a Git repo). The ZIP is encrypted with the code: `15963` — see the "Unzip / decrypt" section below for exact commands per OS.

## Contents

- Next.js 15 front-end application (React 19)
- Tailwind CSS, Redux Toolkit, Stripe integration, Firebase authentication
- Scripts: `dev`, `build`, `start`, `lint` (see `package.json`)

## Quick facts

- Node.js: recommended 18.x or 20.x (Next 15 supports Node 18+)
- Port used by `npm run start`: 3007 (the `start` script uses `-p 3007`)
- Package manager: npm is shown in examples below; you can use `pnpm`/`yarn` if you prefer

## 1) Pre-requisites

- Node.js (18.x or 20.x recommended). Verify with:

```bash
node -v
npm -v
```

- On Linux, if `sharp` fails to install, install system dependencies (Ubuntu/Debian example):

```bash
sudo apt update
sudo apt install -y build-essential libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev librsvg2-dev libvips-dev
```

## 2) Unzip / decrypt the package (password: 15963)

The ZIP you received is encrypted with the code `15963`.

- Linux / macOS (unzip):

```bash
unzip -P 15963 fishing-tripper-frontend.zip
```

- Linux / macOS (7z):

```bash
7z x -p15963 fishing-tripper-frontend.zip
```

- Windows (PowerShell, using Expand-Archive doesn't support passworded zips). Use 7-Zip CLI or GUI:

Install 7-Zip and run (PowerShell/CMD):

```powershell
"C:\Program Files\7-Zip\7z.exe" x -p15963 fishing-tripper-frontend.zip -oC:\path\to\extract\
```

If the client prefers GUI: right-click the zip -> 7-Zip -> Open archive -> Enter password `15963` and extract.

## 3) Install dependencies

Open a terminal in the extracted folder and run:

```bash
npm install
# or (if using pnpm)
# pnpm install
# or (if using yarn)
# yarn install
```

Notes:

- The project uses `next`, `react`, `tailwindcss`, `sharp`, and other libraries listed in `package.json`.
- If `sharp` or other native modules fail, follow the system-dep instructions above.

## 4) Environment variables

This project currently contains some keys in source (Firebase config and a test Stripe publishable key). For production, we strongly recommend switching those to environment variables.

Create a `.env.local` file at the project root for local development (this file should NOT be committed if you convert this to a repo).

Recommended variables (examples):

```
# URL of the API backend (example)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Stripe publishable key (replace with your key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Firebase (if you prefer to keep them in env instead of editing the firebase file)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

How to adopt these variables in code (example):

1. Replace the hard-coded Firebase config in `src/firebase/firebaseConfig.js` with process.env variables:

```js
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
```

2. For Stripe, replace the hard-coded publishable key in files that call `loadStripe(...)` with `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

Note: the project currently contains example/hard-coded keys. Before shipping to production, rotate keys and move secrets to environment variables.

## 5) Run (development)

Start the development server (hot reload):

```bash
npm run dev
# By default Next will run on http://localhost:3000 (unless overridden). Use your browser to visit it.
```

If you need to run on a specific port for dev, set `PORT` env var:

```bash
PORT=3001 npm run dev
```

## 6) Build & Run (production-like)

To build the app for production and run the Node server included with Next:

```bash
npm run build
npm run start
```

Notes:

- `npm run start` in this project passes `-p 3007` to Next.js, so the app will serve on port `3007`.
- For real production deployments prefer a platform like Vercel or serve via a process manager (PM2/systemd) behind a reverse proxy (NGINX).

## 7) Scripts available

These scripts are defined in `package.json`:

- `dev` — development server (hot reload)
- `build` — build production assets
- `start` — start the production server (listens on port 3007 by default)
- `lint` — run Next/ESLint config

Run them with `npm run <script>`.

## 8) Static assets

The `public/` folder contains images and static assets used by the site. These are copied as-is to the built site and can be referenced from `/` paths.

## 9) Common issues & troubleshooting

- Installation fails on `sharp` or other native modules: install platform-specific dependencies (see section 1 above).
- Build fails with memory errors: ensure Node has enough memory; try `NODE_OPTIONS=--max_old_space_size=4096 npm run build`.
- Port already in use: either stop the process using the port or run with a different `PORT` environment variable.
- Missing env variables: check `.env.local` and confirm keys used by code (Firebase or Stripe). Grep for `process.env` to find places expecting envs.
- If you see unexpected behavior after changing code: clear caches and rebuild:

```bash
rm -rf node_modules .next
npm install
npm run build
```

## 10) Linting & formatting

Lint with:

```bash
npm run lint
```

This project uses Next's recommended ESLint config.

## 11) Notes about security

- The archive includes non-secret API keys/hard-coded keys for development/testing. Replace with real credentials and move secrets to environment variables before production.
- Never commit `.env.local` or other secret files to a repo.

## 12) Deploying

- For the easiest deploy, push the code to Vercel (recommended for Next.js) and set environment variables in the Vercel dashboard.
- Alternatively, build and run with a Node process manager and a reverse proxy (NGINX) for SSL and routing.

## 13) Where to look in the code (quick pointers)

- Firebase config: `src/firebase/firebaseConfig.js`
- Stripe usage examples: `src/app/(dashboard)/dashboard/edit-user-details/page.tsx` and `src/components/StripePayment/Payment.tsx`
- Redux store: `src/redux/store/store.ts`
- Main app entry: `src/app/layout.tsx` and `src/app/page.tsx`

## 14) Contact / support

If anything is unclear or you run into issues while running the app, provide the following when you contact support:

- OS and version
- Node version (`node -v`)
- Exact command you ran and the full error output
- Steps you've tried (e.g., reinstall, clearing caches)

Contact: include the client's preferred contact details here.

---

Summary: unzip with password `15963`, install Node dependencies, optionally set `.env.local` variables, then use `npm run dev` for local development or `npm run build` + `npm run start` to run the production server (on port 3007 by default).

Enjoy exploring the Fishing Tripper front-end!

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# t_jones229_cli
