# 🎰 Gumball Machine — Daily Gumloop Credits

A production-ready animated gumball machine built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Vercel KV** (Redis).

---

## 🚀 Quick Start (Local)

```bash
npm install
npm run dev
# → http://localhost:3000
```

No database needed locally — uses in-memory store. State resets on server restart, which is fine for development.

---

## 🌐 Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub

```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_USER/gumball-machine
git push -u origin main
```

### Step 2 — Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repo — leave all settings as default
3. Click **Deploy** ✅

The app deploys immediately. Spins work with in-memory state. Add KV for full persistence:

### Step 3 — Add Vercel KV (free, 2 minutes)

1. Vercel dashboard → **Storage** → **Create Database** → **KV**
2. Name it `gumball-kv` → Create
3. **Connect to Project** → select your project → Connect
4. **Redeploy** once — now all spins and credits persist permanently

### Step 4 — Pull env vars locally (optional)

```bash
npm i -g vercel
vercel link
vercel env pull   # writes .env.local with KV credentials
npm run dev
```

---

## 📁 Structure

```
src/
├── app/
│   ├── api/user/route.ts        # GET user state
│   ├── api/spin/route.ts        # POST spin & award credits
│   ├── api/leaderboard/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── GumballMachine.tsx
│   ├── Gumball.tsx
│   ├── RewardDisplay.tsx
│   ├── DailyCounter.tsx
│   ├── Leaderboard.tsx
│   └── ThemeToggle.tsx
└── lib/
    ├── db.ts        # Vercel KV in prod, in-memory locally
    ├── rewards.ts
    └── session.ts
```

---

## 🎮 Reward Pool

| Credits | Rarity | Chance |
|---------|--------|--------|
| 5 | Common | ~50% |
| 10 | Common | ~25% |
| 20 | Uncommon | ~15% |
| 50 | Rare 🔥 | ~8% |
| 100 | Legendary ⭐ | ~2% |

---

## 🔌 Gumloop API Integration

In `src/app/page.tsx`, replace `handleRedeem`'s `alert()` with a call to `/api/redeem`, then create that route to POST to `https://api.gumloop.com/v1/credits/add` using `process.env.GUMLOOP_API_KEY`.
