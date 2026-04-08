# 🎰 Gumball Machine — Daily Gumloop Credits

A production-ready animated gumball machine web app built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Prisma + SQLite**.

Users get **3 daily spins** to earn randomly-weighted Gumloop Credits, with persistence, animations, a leaderboard, confetti on rare rewards, and dark mode.

---

## 🚀 Quick Start (Local Dev)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/gumball-machine.git
cd gumball-machine
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

The default `.env` uses a local SQLite file — no external DB needed for development:

```
DATABASE_URL="file:./dev.db"
```

### 3. Initialize the Database

```bash
npm run db:push
```

This runs `prisma db push` to create the SQLite schema.

### 4. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
gumball-machine/
├── prisma/
│   └── schema.prisma          # DB schema (User, Spin)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── user/route.ts      # GET user state
│   │   │   ├── spin/route.ts      # POST spin & award credits
│   │   │   └── leaderboard/route.ts # GET top earners
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Main page
│   ├── components/
│   │   ├── GumballMachine.tsx  # SVG machine + Framer Motion animations
│   │   ├── Gumball.tsx         # Individual gumball with rarity
│   │   ├── RewardDisplay.tsx   # Reward reveal card
│   │   ├── DailyCounter.tsx    # Spin dots + remaining message
│   │   ├── Leaderboard.tsx     # Expandable top-10 leaderboard
│   │   └── ThemeToggle.tsx     # Light/dark mode toggle
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── rewards.ts          # Weighted random reward logic
│   │   └── session.ts          # Anonymous session via localStorage
│   └── types/
│       └── index.ts            # Shared types + reward pool config
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── README.md
```

---

## 🎮 How It Works

### Daily Limit
- Each user gets **3 spins per day** tracked by an anonymous `sessionId` stored in `localStorage`
- Sessions are upserted in the DB on first spin
- Daily counts reset automatically (by comparing today's date string)

### Reward Pool (Weighted)
| Credits | Rarity    | Weight | Chance  |
|---------|-----------|--------|---------|
| 5       | Common    | 50     | ~50%    |
| 10      | Common    | 25     | ~25%    |
| 20      | Uncommon  | 15     | ~15%    |
| 50      | Rare 🔥   | 8      | ~8%     |
| 100     | Legendary ⭐ | 2   | ~2%     |

### Animations
- **Idle**: Subtle floating animation on machine
- **Spin**: Knob rotates, machine shakes, gumball drops through chute
- **Reward**: Card reveals with spring animation + bounce
- **Rare/Legendary**: Confetti burst via `react-confetti`

---

## 🌐 Deploy to Vercel

### Option A: Vercel + SQLite (for demo/testing)

> ⚠️ SQLite on Vercel is ephemeral — data resets on redeploy. Use for demos only.

1. Push your repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `DATABASE_URL = file:./dev.db`
4. Set Build Command: `prisma generate && prisma db push && next build`
5. Deploy!

### Option B: Vercel + Turso (Recommended for Production)

[Turso](https://turso.tech) is a hosted libSQL/SQLite DB with a generous free tier.

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create a DB
turso db create gumball-machine

# Get the URL and token
turso db show gumball-machine --url
turso db tokens create gumball-machine
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Set Vercel env vars:
```
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-token
```

Then install the Turso Prisma adapter:
```bash
npm install @libsql/client @prisma/adapter-libsql
```

### Option C: Vercel + Supabase (PostgreSQL)

1. Create a project at [supabase.com](https://supabase.com)
2. Change `prisma/schema.prisma` provider to `postgresql`
3. Set `DATABASE_URL` to your Supabase connection string
4. Run `npm run db:push` to migrate

---

## 🔌 Adding Real Gumloop API Integration

The "Use on Gumloop" button currently simulates redemption. To wire it up:

1. Create `src/app/api/redeem/route.ts`:
```ts
export async function POST(req: NextRequest) {
  const { sessionId, credits } = await req.json();
  // Call real Gumloop API here
  const result = await fetch("https://api.gumloop.com/v1/credits/add", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GUMLOOP_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: credits }),
  });
  // ...
}
```

2. Add `GUMLOOP_API_KEY` to your `.env`
3. Update the `handleRedeem` function in `src/app/page.tsx` to call `/api/redeem`

---

## 🛠 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:push` | Sync Prisma schema to DB |
| `npm run db:studio` | Open Prisma Studio (DB UI) |

---

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Prisma + SQLite (swappable to Postgres/Turso)
- **Auth**: Anonymous session tracking via localStorage UUID
- **Deployment**: Vercel

---

## 📝 License

MIT
