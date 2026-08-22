# CFO Accounting — Navigation, Footer & Instant Content Update

Date: 22 August 2026

## Changes applied

- Removed the scroll-reveal / fade-in behaviour from all 34 HTML pages.
- Content with the existing `.reveal` class is now visible immediately on first paint.
- Removed the IntersectionObserver reveal script from every HTML page.
- Added an Insights dropdown to the desktop navigation while keeping the main **Insights** label clickable.
- Added the key Insights pages to the dropdown:
  - MTD Income Tax Guide
  - MTD Threshold Checker
  - MTD Quarterly Updates
  - MTD for Landlords
  - UK Small Business Grants 2026
  - Accounting FAQs
  - View All Insights
- Added a separate expand/collapse chevron for Insights in the mobile drawer so the **Insights** text itself still links to `/insights`.
- Added active-state highlighting for Insights and the main Insight article pages.
- Rebuilt the site-wide footer with clearer groups for Accounts & Tax, Advisory & Growth, Insights & Guides, and Company pages.
- Added Financial Statements, Business Valuation, Government Grants, R&D Tax Credits and the main MTD/Insight pages to the footer.
- Moved Privacy Policy, Terms & Conditions and Cookie Policy out of the main footer columns into a compact legal row directly above the copyright area.
- Added responsive footer and Insights dropdown styling.

## Verification

Repository verification result after changes:

- HTML pages: 34
- Internal links checked: 3,626
- Hash links checked: 142
- Local assets checked: 268
- Issues: 0
- `site.js` syntax check: passed
