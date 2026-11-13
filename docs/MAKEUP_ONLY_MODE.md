# Makeup-only public site mode

The public site is currently focused on bridal makeup, reception makeup, hair styling, and occasion looks. Mehendi content and data have not been deleted.

To restore the mehendi sections later, set `MEHENDI_ENABLED` to `true` in `src/config/siteFeatures.ts`, then rebuild and deploy the site. This switch controls public service, portfolio, and review visibility; contact options; package content; footer links; page copy; brand name; logo; and runtime SEO metadata. Also update the static title/social tags in `index.html` and re-add the mehendi service URLs to `public/sitemap.xml` when restoring them.

Admin records, the original mehendi package definitions, and the original `src/assets/studio-logo.png` remain available as backup. The displayed name is currently `Pradnya Bridal Makeup Studio` and switches back to `Pradnya Bridal Studio` when mehendi is enabled.
