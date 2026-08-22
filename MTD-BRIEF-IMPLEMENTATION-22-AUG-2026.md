# MTD Client Brief Implementation — 22 August 2026

Implemented from `03-cfoaccounting-mtd-content-briefs.md` and re-verified against current GOV.UK guidance before publication.

## Completed
- Added `/making-tax-digital-income-tax` pillar page with thresholds, qualifying income, quarterly updates, software, exemptions, HMRC responsibility and FAQs.
- Added `/mtd-income-tax-threshold-checker` with four-question client-side JavaScript checker. No answers are transmitted or stored.
- Added `/mtd-quarterly-updates-explained` with cumulative quarterly update explanation, deadlines, year-end process and current 2026/27 penalty note.
- Added `/mtd-income-tax-landlords` with gross-rent, joint-property, combined-income and CGT cross-link guidance.
- Added Making Tax Digital to desktop/mobile Compliance & Tax navigation and footer links site-wide.
- Added MTD content links to Bookkeeping, Self Assessment, Services and Insights.
- Added all four pages to `sitemap.xml`.
- Created `llms.txt` because none existed in the supplied repository.
- Added Article/Breadcrumb/FAQ structured data where relevant.
- Added responsive MTD table, callout and checker styles to `site-enhancements.css`.

## Accuracy decision
The client brief's suggested pillar opening said MTD “replaces the annual Self Assessment return.” Current GOV.UK says MTD is a new way to do Self Assessment and that in-scope users still complete and submit a tax return through compatible software. The implemented copy uses the current GOV.UK formulation to avoid a misleading statement.
