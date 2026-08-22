# CFO Accounting — GitHub Deployment Notes

Updated: 22 August 2026

## Deploy
1. Replace the existing GitHub repository files with the contents of this folder, preserving the same directory structure.
2. Commit and push the changes.
3. Let the existing Vercel deployment complete.
4. Confirm these new routes load:
   - /making-tax-digital-income-tax
   - /mtd-income-tax-threshold-checker
   - /mtd-quarterly-updates-explained
   - /mtd-income-tax-landlords
5. Test the MTD threshold checker on desktop and mobile.
6. Submit the updated sitemap in Google Search Console and request indexing for the four new MTD URLs.

## Automated verification completed
- 34 HTML pages
- 2,742 internal links checked
- 142 hash/anchor links checked
- 268 local assets checked
- 0 issues reported by `node verify-site.mjs`
- JSON-LD on all pages parsed successfully
- No duplicate IDs detected
- MTD checker JavaScript passed Node syntax validation

## Important content note
The supplied MTD brief suggested wording that MTD “replaces the annual Self Assessment return.” Current GOV.UK guidance still requires in-scope users to complete and submit their tax return through compatible MTD software. The implemented copy follows current GOV.UK guidance instead of the outdated/misleading phrase.
