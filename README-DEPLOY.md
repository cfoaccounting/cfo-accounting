# CFO Accounting - GitHub and Vercel deployment

This folder is the deployment root. Upload its contents to the root of a GitHub repository, then import that repository into Vercel as an **Other** project with no framework preset and no build command.

## Required Vercel environment variables

The website uses Resend through Vercel serverless functions. **Never put the Resend API key in frontend JavaScript, HTML or GitHub.** Add it only in **Vercel > Project Settings > Environment Variables**.

- `RESEND_API_KEY` - your private Resend API key.
- `CONTACT_TO_EMAIL` - admin inbox that receives every enquiry, normally `consult@cfoaccounting.co.uk`.
- `CONTACT_FROM_EMAIL` - sender on a Resend-verified domain, for example `CFO Accounting <website@cfoaccounting.co.uk>`.
- `CONTACT_REPLY_TO_EMAIL` - business inbox used when a customer replies to their automatic confirmation; normally `consult@cfoaccounting.co.uk`.

Redeploy after adding or changing environment variables. The main enquiry form uses `/api/contact` and the callback form uses `/api/callback`. Each successful submission sends **two Resend emails**: the full lead details to the admin inbox and a branded receipt/confirmation to the customer. The callback form collects an email address so that callback visitors receive confirmation too.

The API functions also use Resend idempotency keys to reduce duplicate emails when a browser retries the same submission. See `RESEND-FORMS-SETUP.md` for the complete setup and test checklist.

## Google Analytics

Open `site-config.js` and add the real GA4 ID:

```js
window.CFO_SITE_CONFIG = {
  gaMeasurementId: "G-XXXXXXXXXX"
};
```

Analytics loads only after the visitor accepts optional cookies. Phone clicks, email clicks and successful forms push events to `dataLayer`.

## Domain and indexing

1. Connect the final domain in Vercel and set the preferred `www` or non-`www` version.
2. Update the canonical domain in HTML and `sitemap.xml` if it is not `https://www.cfoaccounting.co.uk`.
3. Submit `/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
4. Confirm the live source contains `index, follow` and no `noindex` tag.

## Details to replace when supplied by the owner

- Exact registered legal entity, active Companies House number, registered address, ICO number and AML supervisor/reference.
- Real Google Business Profile, Trustpilot and social-profile URLs.
- Real verified reviews. No fabricated reviews or aggregate rating schema is included.
- Confirmed Google Analytics ID.
- Confirmed FCA position before adding prominent credit-broking or lender-introduction claims.

## Included production features

- Clean Vercel URLs and legacy redirects.
- Responsive 404 and thank-you pages.
- Serverless contact and callback endpoints with a honeypot and consent checkbox.
- Cookie consent that blocks optional analytics until permission.
- Sitemap, robots directives, canonical tags, Open Graph data and structured data.
- Funding hub, R&D tax relief, government grants, financial statements, business valuation and 2026 grants guide.
- Keyboard focus, skip navigation, reduced-motion support and mobile layouts.
- A redesigned homepage hero, consistent responsive section spacing and a reorganised site-wide footer.
- Descriptive local WebP content images; the deployable site has no remote stock-image dependency.
- `node verify-site.mjs` checks page routes, hash targets, legal pages, form endpoints and local assets before deployment.

## Image path note — 20 August 2026

All production image, logo, CSS and shared JavaScript references now use root-absolute paths (for example `/assets/images/...`). This is deliberate for Vercel clean URLs and avoids page-relative path failures. Keep the project contents at the repository/Vercel deployment root exactly as supplied.

Run this before deployment:

```bash
node verify-site.mjs
```

The current revised package passes with zero broken local assets or internal routes.
