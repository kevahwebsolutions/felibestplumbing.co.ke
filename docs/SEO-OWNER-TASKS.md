# SEO tasks for the owner

The code cannot do these. None of them promises a ranking; they make sure Google and Bing can find, understand and trust the site.

## Before launch

1. **Production environment.** In the server `.env` set `NEXT_PUBLIC_SITE_URL=https://felibestplumbing.co.ke`, then build (`npm run build`). `robots.txt`, the sitemap and every canonical link are built from it at build time.
2. **www to apex and HTTP to HTTPS.** `deploy/nginx.conf.example` already 301-redirects `http://` and `www.` to `https://felibestplumbing.co.ke`. Install it, run certbot for both host names, and confirm with `curl -I http://www.felibestplumbing.co.ke/` (one 301 to the apex https URL).
3. **Keep the old URL map live.** The 108 legacy URLs are 301 redirects inside the app. Do not remove them. After DNS points at the new server run `BASE_URL=https://felibestplumbing.co.ke npm run check:redirects`.
4. **Run the audit against the live site** once: `BASE_URL=https://felibestplumbing.co.ke npm run seo:audit`.

## After launch (first week)

5. **Google Search Console.** Go to search.google.com/search-console, add a Domain property for `felibestplumbing.co.ke`, add the DNS TXT record it shows, then open Sitemaps and submit `sitemap.xml`. Use URL Inspection and click Request indexing for `/`, `/services`, the emergency, blocked toilet, burst pipe and drain pages, `/shop`, `/contact` and `/coverage`.
6. **Bing Webmaster Tools.** At bing.com/webmasters choose Import from Google Search Console (quickest), or add the site with the DNS or meta verification, then submit `https://felibestplumbing.co.ke/sitemap.xml`.
7. **Google Business Profile.** At business.google.com create the profile: name `Felibest Plumbing`, primary category Plumber, service areas from the Coverage page (Nairobi and the listed neighbourhoods), phone +254 798 174 201, hours Open 24 hours every day, website `https://felibestplumbing.co.ke`, and real photos of your work (no stock images). Verify it with the method Google offers (video or phone). If you serve customers at their homes and have no shop, hide the address instead of inventing one.
8. **Same name, phone and email everywhere.** Write them exactly as in the site footer: Felibest Plumbing, +254 798 174 201, felibestplumbing@gmail.com or info@felibestplumbing.co.ke, Nairobi, Kenya. Use the same text on Facebook, Instagram, X, TikTok, YouTube, Google Business Profile and every directory.
9. **Kenya business directories and citations.** List the business, with the identical name, phone and email, on reputable Kenyan business directories and trade listings. Skip paid link schemes.

## Ongoing

10. **Collect real customer reviews** on Google Business Profile (send customers the review link after each job). Only when you hold real, verifiable reviews can review markup be added honestly; replace the template testimonials on `/testimonials` with real ones first.
11. **Add a street address and map pin** to Google Business Profile and the site only if the business has a public location; then the markup can include it.
12. **Share image text.** If the server has no fonts, the blue band on share images shows only the logo. Run `sudo apt install fonts-dejavu-core` to show the business name too.
13. **Watch Search Console** weekly for the Page indexing and Core Web Vitals reports and fix anything it flags.
