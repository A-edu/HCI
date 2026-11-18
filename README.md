# SWE482 – HCI prototypes

One site for all four flows (desktop, Arabic RTL, fake data).

| Route | Member | Flow |
|---|---|---|
| `/spl/calculator` | Abdulaziz | SPL price calculator (ready) |
| `/spl/business` | Mohammed | SPL business shipping (next) |
| `/haraj/filters` | Abdullah | Haraj search filters |
| `/haraj/alerts` | Ahmed | Haraj search alerts |

## Run locally
```
npm install
npm run dev
```

## Deploy
**Vercel:** push this folder to a GitHub repo → vercel.com → Add New Project → import the repo → Deploy (Vite is detected automatically). `vercel.json` already handles page refreshes on sub-pages.

