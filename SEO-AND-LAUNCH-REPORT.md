# CFO Accounting website. SEO and launch report

## Result

The supplied 21-page website has been reviewed and expanded into a 30-page GitHub/Vercel-ready website. All original pages and sections remain, with new funding, insight and conversion pages added from the client briefs.

The completed on-page SEO checklist score is **98/100**. This is a transparent pre-launch checklist score, not a promise of a Google ranking. A final live Lighthouse/PageSpeed score should be recorded after deployment because hosting, caching and server response time affect the live result.

## Client feedback update. 19 August 2026

- Site colours are now locked to the supplied logo: navy `#0B1E3D`, primary gold `#B8863D`, and bright gold `#F4B424` for accents on dark backgrounds.
- Fashion & Retail and Entertainment are included in the industry grid.
- E-commerce Accounting and ERP Advisory are included in the navigation and footer service lists.
- Pricing is clearly labelled as indicative and subject to a requirements review.
- Unverified Google rating, testimonial, client-volume, savings and retention claims are not used.
- Company number `14829371` was removed because the official Companies House record belongs to DW Investing Ltd, not CFO Accounting, and is shown as dissolved.
- Unverified firm-level ICO, AML, ICAEW and AAT claims were replaced with factual service and experience wording pending the client's current registration details.
- Duplicate theme-colour metadata and repeated image priority attributes were cleaned up across all pages.
- All public-facing VC Global references were removed so the current CFO Accounting name is consistent.
- The primary number from the developer brief, `+44 77491 597650`, is now formatted and linked consistently.
- Business Funding & Grants, R&D Tax Relief, Government Grants, Financial Statement Preparation, Business Valuation, Insights, thank-you and 404 pages were added.
- Forms now use Vercel serverless endpoints and return an honest configuration error until email delivery credentials are supplied.
- Clean production URLs, legacy redirects, security headers, cookie consent and analytics event hooks were added.
- The homepage hero was redesigned with clearer keyword-led copy, a professional accounting consultation image and a cleaner benefit hierarchy.
- The oversized repeated CTA shown in client feedback was removed from the Home and Services pages; remaining conversion bands were made more compact.
- Section spacing was reduced and standardised across desktop, tablet and mobile layouts.
- The footer was reorganised into Accounts & Tax, Growth Support, Company and Legal groups with direct contact details.
- All remote content images were localised as descriptive, compressed WebP assets to reduce third-party loading risk.

## Improvements completed

- Unique page titles and search descriptions checked across all 21 pages.
- Long page titles shortened where needed.
- Missing or weak descriptions improved, including the homepage, About, Team, Contact and legal pages.
- One canonical URL added to every page.
- Index/follow instructions and large-image preview permission added.
- Open Graph and X/Twitter sharing metadata added to every page.
- One clear H1 retained on every page.
- Existing structured data retained and validated; all JSON-LD blocks parse correctly.
- Existing image alternative text retained and checked; no image is missing alt text.
- Descriptive team image filename added: `atif-abbas-senior-finance-consultant.jpg`.
- Image decoding and loading hints added, with the first main image prioritised.
- All internal links checked; no broken internal link was found.
- Skip navigation, visible keyboard focus and reduced-motion support added.
- Shared visual polish added for spacing, cards, buttons, header, hero area and mobile layouts.
- Generic placeholder office address removed from the privacy policy.
- Generic social links marked as nofollow until the client's real profile links are supplied.

## Checklist score

| Area | Score | Notes |
|---|---:|---|
| Page titles and descriptions | 20/20 | Present and within the target length range on every page |
| Heading structure | 10/10 | Exactly one H1 per page |
| Canonicals and crawl control | 15/15 | Canonical and robots metadata present on every page |
| Image SEO and accessibility | 15/15 | Alt text complete; content images use descriptive local WebP filenames |
| Structured data | 10/10 | Existing JSON-LD validates as parseable JSON |
| Internal links | 10/10 | No broken local page links |
| Social sharing metadata | 8/10 | Complete; a dedicated 1200×630 social image would improve previews |
| Accessibility and mobile polish | 10/10 | Keyboard focus, skip link, reduced motion and mobile overrides included |
| **Total** | **98/100** | Pre-launch on-page checklist |

## Client details still required before public launch

1. Confirm the registered legal entity name, active Companies House number, registered office address, ICO number and AML supervisor/reference before publishing any of those credentials.
2. Add the Resend environment variables listed in `README-DEPLOY.md` so enquiry and callback emails can be delivered from Vercel.
3. Add verified social-profile links only when the firm's exact URLs are available.
4. Add a dedicated 1200×630 px social-sharing image and replace the current logo-based `og:image` if a richer link preview is wanted.

## Recommended live checks

After uploading the site, submit `sitemap.xml` in Google Search Console, inspect the homepage URL, and run PageSpeed Insights on the homepage plus one service page. Search performance should then be reviewed after Google has crawled the site; on-page optimisation improves eligibility and relevance but does not guarantee a particular position.
