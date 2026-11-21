# NoticeShift

**Know what changed. Know what matters.**

NoticeShift helps students, small businesses and everyday consumers keep track of meaningful changes on public webpages.

Choose what matters to you:
- **Prices & products:** price changes, discounts and availability
- **Opportunities:** scholarships, internships, grants and deadlines
- **Announcements:** school notices, policies and requirements
- **Business information:** supplier catalogues, prices and product availability

NoticeShift uses the Anakin Website Monitoring API for scheduled checks, page snapshots, change detection and AI summaries.

## Run locally

1. Install Node.js 20 or later.
2. Clone this repository and run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Anakin API key to `.env.local`:

   ```env
   ANAKIN_API_KEY=your_actual_key
   ```

5. Start the app with `npm run dev`.
6. Open http://localhost:3000.

Keep the API key on the server. Never add it to frontend code or commit `.env.local`.

## Monitoring limits

Anakin's Website Monitoring API requires a minimum interval of 15 minutes. The Free plan supports up to five active monitors. Credit use depends on watch mode and AI settings. Check Anakin's current dashboard and documentation before adding many monitors.

## Built with

- Next.js and TypeScript
- Anakin Website Monitoring API
- Lucide icons

## Status

Early hackathon MVP. The first version supports creating and listing monitors. Change history and richer category-specific comparisons are planned.
