# CFO Accounting website revision — 20 August 2026

## Completed

- Fixed Vercel image reliability by converting all local image, logo, CSS and shared JS references to root-absolute paths.
- Added the supplied team photo to the homepage hero and stored it locally as a WebP asset.
- Reworked homepage hero copy around customer outcomes and UK small-business search intent.
- Limited the homepage to 8 primary services and added a clear “View All Accounting Services” route.
- Added relevant local imagery to service cards across the homepage, Services page and related-service cards.
- Reworked service-page titles, meta descriptions, H1s, hero copy and leading section messages around benefits, clarity and buyer intent.
- Refined About, Contact, FAQ and Insights positioning to sound more human, practical and less template-driven.
- Corrected service BreadcrumbList structured-data URLs so they match the actual clean Vercel routes.
- Updated the 2026 grants article review date and author link for stronger editorial trust signals.
- Added `SEO-KEYWORD-CONTENT-STRATEGY-UK.md` with primary, industry and long-tail UK search targets.
- Standardised desktop content width to a true 1300px maximum.
- Standardised mobile page gutters to 15px on both sides.
- Desktop typography now stays within the requested 44px–16px hierarchy; mobile within 33px–15px.
- Buttons use 15px desktop / 14px mobile text, 500 weight, and approximately 10px × 20px padding.
- Homepage and service hero imagery uses a consistent portrait treatment, with image first and copy second on mobile.
- CTA/conversion bands now have balanced top and bottom spacing instead of visually sticking to the previous section.
- Refined cards, section rhythm, hover states, image cropping, pricing, timeline and footer spacing.
- Updated sitemap modification dates to 20 August 2026.

## Verification

Run:

```bash
node verify-site.mjs
```

Current result: 30 pages, 2,297 internal links checked, 123 hash links checked, 243 local assets checked, 0 issues.

## Resend transactional form delivery

- Upgraded both live website forms to send through Resend from Vercel serverless functions.
- Every successful form now sends the submitted information to the admin inbox and a branded receipt email to the customer.
- Added an email field to the callback form so callback visitors can receive confirmation.
- Added server-side field limits, escaping, consent validation, Resend idempotency keys, plain-text email fallbacks and provider-safe error handling.
- Added `CONTACT_REPLY_TO_EMAIL` configuration and kept API credentials entirely server-side.
- Updated the Privacy Policy to transparently mention Vercel/Resend in the website-enquiry delivery flow.
- Added `RESEND-FORMS-SETUP.md` with Vercel environment variable and testing instructions.
