# NoticeShift

**Know what changed. Know what matters.**

NoticeShift helps students, small businesses and everyday consumers keep track of meaningful changes on public webpages.

Choose what matters to you:
- **Prices & products:** price changes, discounts and availability
- **Opportunities:** scholarships, grants and deadlines
- **Announcements:** school notices, policies and requirements
- **Business information:** supplier catalogues, prices and product availability

NoticeShift uses the Anakin Website Monitoring API for scheduled checks, page snapshots and change detection.

## Run locally

1. Install Node.js 20 or later.
2. Clone this repository and run `npm install`.
3. Create `.env.local` and add your Anakin API key:

   ```env
   ANAKIN_API_KEY=your_actual_key
   ```

4. Start the app with `npm run dev`.
5. Open http://localhost:3000.

Keep the API key on the server. Never add it to frontend code or commit `.env.local`.

## Deploy on Netlify

1. Push this repository to GitHub.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Connect GitHub and select `fawazfff/noticeshift`.
4. Netlify should detect Next.js. Use `npm run build` as the build command. The current Next.js adapter handles App Router pages and API route handlers.
5. In **Site configuration → Environment variables**, add `ANAKIN_API_KEY` with your Anakin key. Keep it private.
6. Deploy the site. If you add or change the environment variable after the first deploy, trigger a new deploy.

Do not add a static SPA catch-all redirect. NoticeShift uses Next.js server routes for the monitoring API.

## Monitoring limits

Anakin's Website Monitoring API requires a minimum interval of 15 minutes. The Free plan supports up to five active monitors. Credit use depends on watch mode and AI settings. Check Anakin's current dashboard and documentation before adding many monitors.

## Built with

- Next.js App Router and TypeScript
- Anakin Website Monitoring API
- Lucide icons
- Netlify for hosting

## Current MVP scope

- Add public webpages to a monitoring list
- Group monitoring intent by prices, opportunities, announcements and business information
- View the watchlist and individual monitor details
- Dedicated Overview, Watchlist, Change Insights and Settings routes

Change history is displayed when the monitoring API returns recorded snapshots or detected changes. The interface does not fabricate change records.


## Demo architecture

- The public product introduction lives at `/`.
- The monitoring workspace lives at `/app`; watchlist, insights, settings and individual monitor pages are separate routes.
- Monitoring records are created and retrieved through the Anakin API using the server-only `ANAKIN_API_KEY` environment variable.
- This MVP currently uses the connected Anakin monitoring workspace as its persistence layer. It does not yet provide individual accounts, private user workspaces or a separate application database. Avoid adding sensitive or personal URLs to a shared demo.
- The landing page includes a static product preview for presentation. Its example rows are illustrative and are not live monitoring results.
