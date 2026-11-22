# Owner checklist

These need a person; none was attempted.

1. **Replace the low-resolution photos.** All 29 photos are screen captures (370 to 500 px wide). Upload the originals from the supplier in Admin, Products, Images. Start with the ones that show a price mark: the KES 800 cover, washing machine tap, scent beads, colour and dirt catcher, inlet pipe (list in docs/catalog-images.md).
2. **Confirm prices and list prices.** Check the 16 prices against the supplier. Each product has an internal "list price note" with the struck-through higher price. Decide whether you ever show a sale price, and only if it is a genuine previous price.
3. **Fix the supplier text.** The Milano shower, DDA 1000P and shoe bag descriptions contain "Price: KSh ..." lines; the shoe bag text also gives the Beta Supplies phone number and location; the stand text says "Order yours today!". Consider editing them so customers contact Felibest and prices cannot go stale.
4. **Confirm stock, availability, fulfilment and delivery.** Stock is not counted (all products show "Available to order"). Decide who fulfils and delivers each product and the delivery fee, then switch on stock counting per product if you want it.
5. **Write or confirm the 12 generated descriptions.** The admin dashboard shows "N products need description review" and each product has a "Description to be confirmed" tag. Also confirm pack counts (the bag photos show handwritten "6 pcs" and "4 pcs"), what the three covers fit, and the scents of the scent beads.
6. **Confirm categories** (Showers, Pumps, Washing Machine Plumbing, Washing Machine Covers and Stands, Laundry Bags, Laundry Care) and the three cover slugs.
7. **Written permission.** Confirm Beta Supplies has agreed in writing to the use of their product names, photos and descriptions.
8. **Deploy.** On the production server run `npm run db:migrate && npm run db:import-catalog` (use `-- --dry-run` first to see the plan). Copy `public/images/catalog/` with the build.
