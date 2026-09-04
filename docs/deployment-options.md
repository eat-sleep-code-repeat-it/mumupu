# Deployment Options

This app uses API routes (`/api/translate`, `/api/songs`) and dynamic rendering, so a static export (`output: "export"`) is not viable — it needs a running Node.js server.

## Local IIS

The standard way to put this app behind IIS is a reverse proxy.

## Option A: IIS as a reverse proxy to `next start` (recommended)

1. **Install prerequisites on the IIS machine**
   - Node.js (matching the version this repo requires).
   - [URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite) for IIS.
   - [Application Request Routing (ARR)](https://www.iis.net/downloads/microsoft/application-request-routing) for IIS.

2. **Build the app for production**
   - `pnpm install --frozen-lockfile`
   - `pnpm run build`

3. **Run the Node server as a persistent process**
   - `pnpm start` runs `next start`, which by default listens on port 3000.
   - Don't run it in a plain terminal in production — use a process manager so it survives reboots/crashes, e.g.:
     - [PM2](https://pm2.keymetrics.io/) (`pm2 start "pnpm start" --name mumupu`), or
     - **NSSM** to wrap `next start` as a native Windows Service.

4. **Enable ARR as a proxy**
   - In IIS Manager, open the server-level **Application Request Routing Cache** feature, click **Server Proxy Settings**, and check **Enable proxy**.

5. **Create the IIS site**
   - Add a new site (or use an existing one) bound to your desired hostname/port (e.g. 80/443).
   - No physical content is served directly by IIS here — it just proxies.

6. **Add a URL Rewrite reverse-proxy rule**
   - In the site's **URL Rewrite** feature, add an inbound rule:
     - Pattern: `(.*)`
     - Action: Rewrite to `http://localhost:3000/{R:1}`
   - This forwards all requests (pages and `/api/*` routes) to the Node process.

7. **(Optional) TLS termination**
   - Bind an SSL certificate to the IIS site if you need HTTPS; IIS terminates TLS and forwards plain HTTP to Node internally.

8. **Verify**
   - Browse to the IIS site's hostname and confirm `/`, `/home`, and `/api/*` all respond correctly through the proxy.

## Option B: `iisnode`

Alternative to ARR: install the [iisnode](https://github.com/Azure/iisnode) module, which lets IIS host the Node process directly via a `web.config` with an `iisnode` handler pointing at a server entry script. This is more IIS-native but less commonly used with Next.js's own server, and typically requires more custom wiring (Next.js doesn't ship an `iisnode`-compatible entry point out of the box) — Option A is simpler and more reliable for this app.

## Notes specific to this repo

- `next.config.ts` currently has no `output: "standalone"` or `"export"` set, so `pnpm start` after `pnpm build` is the correct run mode — don't attempt static export since API routes require a server.
- Make sure the `public/` and `oracle-cache/` assets are included when copying the build to the target machine if deploying from a different build location.

## Cloud options (cheap and easy)

Ordered roughly by ease of setup.

### 1. Vercel (easiest — made by the Next.js team)

- Free "Hobby" tier is enough for personal/low-traffic use.
- Push to GitHub, import the repo in Vercel, zero config needed — it detects Next.js automatically, including API routes.
- No server management, no reverse proxy setup.
- Caveat: Hobby tier is non-commercial use only per Vercel's terms.

### 2. Railway

- Connects to your GitHub repo, auto-detects `pnpm build` / `pnpm start`.
- Usage-based pricing with a small free trial credit, then low monthly cost for a small app.
- Simple dashboard, persistent Node process (no cold starts like some serverless platforms).

### 3. Render

- Free tier available for web services (spins down after inactivity, cold start on next request).
- Paid tier (~$7/mo) removes the spin-down for always-on.
- Auto-detects Next.js; just set build command `pnpm build` and start command `pnpm start`.

### 4. Fly.io

- Small free allowance, then pay-as-you-go (very low cost for a small app).
- Deploys as a lightweight VM (Firecracker), good for apps you want always-warm without Vercel's serverless cold-start model.
- Slightly more setup (`fly launch`, a generated `Dockerfile`), but still straightforward.

### 5. Cloudflare / Netlify

- Both have Next.js integrations, but support for arbitrary API routes/server behavior varies by adapter maturity — check current docs if you rely heavily on `/api/*` routes.

### Recommendation

**Vercel** is the least setup for this specific app (zero-config Next.js hosting, generous free tier, no reverse proxy needed). If you need always-on without cold starts and don't mind a bit more setup, **Fly.io** or **Railway** are the next best cheap options.
