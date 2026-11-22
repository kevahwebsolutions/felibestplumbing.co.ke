/**
 * The real shop catalogue (16 products), imported from the Beta Supplies WhatsApp catalogue that the client
 * approved for use on this site. Names, prices and the four source descriptions are copied exactly.
 * Imported into the database by `npm run db:import-catalog` (idempotent, never overwrites owner edits).
 *
 * Source descriptions contain a few non-ASCII characters (emoji and an en dash) that are written as escapes
 * here so this file stays plain ASCII. They are the supplier's own text and are kept unchanged.
 */

export type CatalogCategory = {
  slug: string;
  name: string;
  /** Short intro shown on the category page, written only from the real products in the category. */
  description: string;
  sortOrder: number;
  /** True when a plumber is normally needed to fit the products, so the "Book a plumber" cross-sell shows. */
  installable: boolean;
};

export type CatalogImage = {
  /** File name under /public/images/catalog (processed WebP). */
  file: string;
  alt: string;
  /** Original file name in the local, gitignored catalog-import/images folder. */
  source: string;
};

export type CatalogProduct = {
  slug: string;
  name: string;
  categorySlug: string;
  /** Current selling price in KES. */
  price: number;
  currency: 'KES';
  description: string;
  /** `source` = the supplier's own text. `generated-from-name` = written from the name, photos and category only. */
  descriptionStatus: 'source' | 'generated-from-name';
  /** Admin-only note about the struck-through list price in the source catalogue. Never shown to customers. */
  listPriceNote: string;
  seoTitle: string;
  seoDescription: string;
  images: CatalogImage[];
  needsReview: boolean;
  featured: boolean;
  /** Row number in the source CSV. */
  sourceRow: number;
};

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    slug: 'showers', name: 'Showers', sortOrder: 0, installable: true,
    description: 'A modern shower set with an inbuilt heater and water pump, supplied with a rainfall shower head, a handheld shower and a chrome rail.',
  },
  {
    slug: 'pumps', name: 'Pumps', sortOrder: 1, installable: true,
    description: 'The Dayliff DDA 1000P well pump: 1.0 kW, 240 V, with a 20 m submersible cable and a low-level float switch.',
  },
  {
    slug: 'washing-machine-plumbing', name: 'Washing Machine Plumbing', sortOrder: 2, installable: true,
    description: 'The water connections for a washing machine: a washing machine tap, a 3 metre inlet pipe and a 3 metre outlet pipe.',
  },
  {
    slug: 'washing-machine-covers-and-stands', name: 'Washing Machine Covers and Stands', sortOrder: 3, installable: false,
    description: 'Three front load washing machine covers at different prices, and a heavy-duty movable stand for washing machines and fridges.',
  },
  {
    slug: 'laundry-bags', name: 'Laundry Bags', sortOrder: 4, installable: false,
    description: 'Mesh bags for the wash: a set of 2 shoe washing bags, zipped laundry mesh bags and drawstring laundry mesh bags.',
  },
  {
    slug: 'laundry-care', name: 'Laundry Care', sortOrder: 5, installable: false,
    description: 'Products for the washing machine and the wash: scent beads, laundry pods, a colour and dirt catcher and drum cleaning tablets.',
  },
];

const FOOT = ' | Felibest Plumbing';

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    slug: 'milano-modern-shower', name: 'Milano modern shower', categorySlug: 'showers', price: 25000, currency: 'KES', sourceRow: 1,
    description: 'Modern Milano shower with inbuilt heater and pump - Adjustable water temperature - Inbuilt adjustable water pump - Large rainfall shower head - Handheld telephone shower - Chrome shower rail and accessories - Built-in soap dish',
    descriptionStatus: 'source', needsReview: false, featured: true,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 27,000.',
    seoTitle: `Milano modern shower${FOOT}`,
    seoDescription: 'Milano modern shower with inbuilt heater and pump, rainfall shower head, handheld shower and chrome rail. KES 25,000. Order in Nairobi.',
    images: [
      { file: 'milano-modern-shower-1.webp', source: '1-milano-modern-shower-3.jpg', alt: 'Milano modern shower installed on a tiled bathroom wall with a square rainfall shower head, handheld shower, chrome rail and white heater unit' },
    ],
  },
  {
    slug: 'dda-1000p', name: 'DDA 1000P', categorySlug: 'pumps', price: 18200, currency: 'KES', sourceRow: 2,
    description: 'Dayliff DDA 1000P well pump - Power: 1.0 kW (1.3 HP) - Maximum head: 35 m - Voltage: 240 V - Includes 20 m submersible cable - Low-level float switch - Suitable for semi-submerged operation',
    descriptionStatus: 'source', needsReview: false, featured: true,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 19,000.',
    seoTitle: `DDA 1000P Well Pump${FOOT}`,
    seoDescription: 'Dayliff DDA 1000P well pump, 1.0 kW, 240 V, with 20 m submersible cable and low-level float switch. KES 18,200. Order in Nairobi.',
    images: [
      { file: 'dda-1000p-1.webp', source: '2-dda-1000p-1.jpg', alt: 'Dayliff DDA 1000P well pump box standing outdoors' },
      { file: 'dda-1000p-2.webp', source: '2-dda-1000p-2.jpg', alt: 'Dayliff DDA 1000P stainless steel well pump with a blue float switch and black cable' },
      { file: 'dda-1000p-3.webp', source: '2-dda-1000p-3.jpg', alt: 'Close-up of the Dayliff DDA 1000P pump data label' },
    ],
  },
  {
    slug: 'shoes-mesh-bags-for-washing-machine', name: 'Shoes Mesh Bags for Washing Machine', categorySlug: 'laundry-bags', price: 1500, currency: 'KES', sourceRow: 3,
    description: 'Shoe washing mesh bags, set of 2. Keep your shoes clean and protected with these durable shoe mesh bags. Perfect for machine washing, they help protect your shoes while allowing water and detergent to clean effectively. Sold as a set of 2 pieces.',
    descriptionStatus: 'source', needsReview: false, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,700.',
    seoTitle: `Shoes Mesh Bags for Washing Machine${FOOT}`,
    seoDescription: 'Set of 2 shoe washing mesh bags that protect your shoes in the washing machine while water and detergent get through. KES 1,500 per set.',
    images: [
      { file: 'shoes-mesh-bags-for-washing-machine-1.webp', source: '3-shoes-mesh-bags-for-washing-machine-3.jpg', alt: 'Yellow shoe washing mesh bag with a white zip lying on a tiled floor' },
      { file: 'shoes-mesh-bags-for-washing-machine-2.webp', source: '3-shoes-mesh-bags-for-washing-machine-1.jpg', alt: 'Yellow shoe washing mesh bag with blue mesh ends lying on its side' },
      { file: 'shoes-mesh-bags-for-washing-machine-3.webp', source: '3-shoes-mesh-bags-for-washing-machine-2.jpg', alt: 'Grey shoe washing mesh bag with light green mesh ends' },
      { file: 'shoes-mesh-bags-for-washing-machine-4.webp', source: '3-shoes-mesh-bags-for-washing-machine-4.jpg', alt: 'Grey shoe washing mesh bag with a white zip along the side' },
    ],
  },
  {
    slug: 'front-load-washing-machine-cover-kes-800', name: 'Front Load Washing Machine Cover', categorySlug: 'washing-machine-covers-and-stands', price: 800, currency: 'KES', sourceRow: 4,
    description: 'A silver-grey cover that fits over a front load washing machine, shown in the photo on a machine standing against a tiled wall. It is sold in a sealed plastic pack. We list three front load covers at different prices, so compare the photos and message us on WhatsApp if you are unsure which suits your machine.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,000.',
    seoTitle: `Front Load Machine Cover KES 800${FOOT}`,
    seoDescription: 'Silver-grey front load washing machine cover, KES 800. One of three front load covers we stock. Order online in Nairobi or on WhatsApp.',
    images: [
      { file: 'front-load-washing-machine-cover-kes-800-1.webp', source: '4-front-load-washing-machine-cover-2.jpg', alt: 'Silver-grey cover fitted over a front load washing machine against a tiled wall' },
    ],
  },
  {
    slug: 'heavy-duty-washing-machine-stand', name: 'Heavy Duty Washing Machine Stand', categorySlug: 'washing-machine-covers-and-stands', price: 3500, currency: 'KES', sourceRow: 5,
    description: 'Heavy-duty movable washing machine and fridge stand - Strong and durable - Adjustable to fit different appliance sizes - Wheels for easy movement - Stable, anti-slip corner supports',
    descriptionStatus: 'source', needsReview: false, featured: true,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 3,700.',
    seoTitle: `Heavy Duty Washing Machine Stand${FOOT}`,
    seoDescription: 'Heavy-duty movable stand for a washing machine or fridge: adjustable, on wheels, with anti-slip corner supports. KES 3,500. Order online.',
    images: [
      { file: 'heavy-duty-washing-machine-stand-1.webp', source: '5-heavy-duty-washing-machine-stand-2.jpg', alt: 'Heavy duty movable washing machine stand with wheels at each corner on a tiled floor' },
      { file: 'heavy-duty-washing-machine-stand-2.webp', source: '5-heavy-duty-washing-machine-stand-1.jpg', alt: 'Adjustable washing machine stand frame with corner supports seen from above' },
    ],
  },
  {
    slug: 'front-load-washing-machine-cover-kes-1000', name: 'Front Load Washing Machine Cover', categorySlug: 'washing-machine-covers-and-stands', price: 1000, currency: 'KES', sourceRow: 6,
    description: 'A silver polyester cover for a front load washing machine. The pack describes it as dustproof, waterproof and sun-protecting, and the photo shows it fitted over a machine on a tiled floor with a smooth, crinkled finish. We list three front load covers at different prices, so message us if you are unsure of the fit for your machine.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,200.',
    seoTitle: `Front Load Machine Cover KES 1,000${FOOT}`,
    seoDescription: 'Silver polyester front load washing machine cover, KES 1,000. Packaging says dustproof, waterproof and sun-protecting. Order in Nairobi.',
    images: [
      { file: 'front-load-washing-machine-cover-kes-1000-1.webp', source: '6-front-load-washing-machine-cover-2.jpg', alt: 'Silver cover fitted over a washing machine standing on a tiled floor beside a tiled wall' },
    ],
  },
  {
    slug: 'zipped-laundry-mesh-bags', name: 'Zipped Laundry Mesh bags', categorySlug: 'laundry-bags', price: 1000, currency: 'KES', sourceRow: 7,
    description: 'White mesh laundry bags with a zip closure, supplied in a clear plastic pack. Put delicate clothes, underwear or small items inside before washing so they stay together and are protected in the machine. Message us to confirm the number of bags and the sizes in the pack before you order.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,200.',
    seoTitle: `Zipped Laundry Mesh bags${FOOT}`,
    seoDescription: 'White zipped laundry mesh bags to keep delicates and small items together in the wash. KES 1,000. Order online in Nairobi or on WhatsApp.',
    images: [
      { file: 'zipped-laundry-mesh-bags-1.webp', source: '7-zipped-laundry-mesh-bags-2.jpg', alt: 'White zipped laundry mesh bags in a clear plastic pack held in a hand' },
    ],
  },
  {
    slug: 'drawstring-laundry-mesh-bags', name: 'Drawstring Laundry Mesh bags', categorySlug: 'laundry-bags', price: 1200, currency: 'KES', sourceRow: 8,
    description: 'White mesh laundry bags that close with a drawstring, packed together in a clear plastic bag. They keep socks, small items and delicate clothes together in the wash while water and detergent pass through the mesh. Message us to confirm the number of bags and the sizes in the pack before you order.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,400.',
    seoTitle: `Drawstring Laundry Mesh bags${FOOT}`,
    seoDescription: 'White drawstring laundry mesh bags that keep small items and delicates together in the wash. KES 1,200. Order online in Nairobi or on WhatsApp.',
    images: [
      { file: 'drawstring-laundry-mesh-bags-1.webp', source: '8-drawstring-laundry-mesh-bags-2.jpg', alt: 'White laundry mesh bags in a clear plastic pack held in a hand' },
    ],
  },
  {
    slug: 'front-load-washing-machine-cover-kes-1200', name: 'Front Load Washing Machine Cover', categorySlug: 'washing-machine-covers-and-stands', price: 1200, currency: 'KES', sourceRow: 9,
    description: 'A silver cover for a front load washing machine with a shaped seam across the upper front and a boxy fit, as the photo shows. It comes in a clear plastic pack. We list three front load covers at different prices, so compare the photos and message us if you are unsure which one suits your machine.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,400.',
    seoTitle: `Front Load Machine Cover KES 1,200${FOOT}`,
    seoDescription: 'Silver front load washing machine cover with a shaped seam across the upper front, KES 1,200. Order online in Nairobi or on WhatsApp.',
    images: [
      { file: 'front-load-washing-machine-cover-kes-1200-1.webp', source: '9-front-load-washing-machine-cover-2.jpg', alt: 'Silver washing machine cover with a shaped seam across the upper front fitted over a machine' },
    ],
  },
  {
    slug: 'washing-machine-tap', name: 'Washing Machine Tap', categorySlug: 'washing-machine-plumbing', price: 650, currency: 'KES', sourceRow: 10,
    description: 'A metal tap with a red lever handle, a ribbed hose connector on one side and a threaded end on the other, as shown in the photo. It is the kind of tap used to supply water to a washing machine inlet hose. Message us to confirm the thread size and fit before you order.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: true,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 700.',
    seoTitle: `Washing Machine Tap${FOOT}`,
    seoDescription: 'Washing machine tap with a red lever handle and a hose connector, KES 650. Order online in Nairobi or send your order on WhatsApp.',
    images: [
      { file: 'washing-machine-tap-1.webp', source: '10-washing-machine-tap-1.jpg', alt: 'Metal washing machine tap with a red lever handle held in a hand' },
    ],
  },
  {
    slug: 'washing-machine-scent-beads', name: 'Washing Machine Scent Beads', categorySlug: 'laundry-care', price: 1000, currency: 'KES', sourceRow: 11,
    description: 'Scented beads in a small screw-top plastic bottle. The photos show the bottles in purple, orange, pink and blue, and the label reads Scent Beads. They are a laundry fragrance product for the washing machine. Message us for the scents available and how to use them before you order.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,200.',
    seoTitle: `Washing Machine Scent Beads${FOOT}`,
    seoDescription: 'Scent beads in a screw-top bottle for the washing machine, shown in purple, orange, pink and blue. KES 1,000. Order online in Nairobi.',
    images: [
      { file: 'washing-machine-scent-beads-1.webp', source: '11-washing-machine-scent-beads-1.jpg', alt: 'Bottle of Scent Beads with purple beads and a silver screw cap held in a hand' },
      { file: 'washing-machine-scent-beads-2.webp', source: '11-washing-machine-scent-beads-2.jpg', alt: 'Bottle of Scent Beads with orange beads and a silver screw cap held in a hand' },
      { file: 'washing-machine-scent-beads-3.webp', source: '11-washing-machine-scent-beads-3.jpg', alt: 'Bottle of Scent Beads with pink beads and a silver screw cap held in a hand' },
      { file: 'washing-machine-scent-beads-4.webp', source: '11-washing-machine-scent-beads-4.jpg', alt: 'Bottle of Scent Beads with blue beads and a silver screw cap held in a hand' },
    ],
  },
  {
    slug: 'barline-5-in-1-laundry-pods-40pcs', name: 'Barline 5 in 1 Laundry Pods 40pcs', categorySlug: 'laundry-care', price: 1000, currency: 'KES', sourceRow: 12,
    description: 'Barline laundry pods in a white tub with a hinged lid, 40 pieces per tub according to the name. The photos show the front of the tub, the back label, the pods inside and a single pod with colourful compartments. Pods are used in the washing machine. Read the label for directions, and message us with any questions.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,200.',
    seoTitle: `Barline 5 in 1 Laundry Pods 40pcs${FOOT}`,
    seoDescription: 'Barline 5 in 1 laundry pods, 40 pieces in a white tub with a hinged lid. KES 1,000. Order online in Nairobi or send your order on WhatsApp.',
    images: [
      { file: 'barline-5-in-1-laundry-pods-40pcs-1.webp', source: '12-barline-5-in-1-laundry-pods-40pcs-1.jpg', alt: 'White Barline laundry pods tub with a hinged lid held in a hand' },
      { file: 'barline-5-in-1-laundry-pods-40pcs-2.webp', source: '12-barline-5-in-1-laundry-pods-40pcs-2.jpg', alt: 'Back of the laundry pods tub showing the product label and barcode' },
      { file: 'barline-5-in-1-laundry-pods-40pcs-3.webp', source: '12-barline-5-in-1-laundry-pods-40pcs-3.jpg', alt: 'Open laundry pods tub filled with pink, blue and purple pods' },
      { file: 'barline-5-in-1-laundry-pods-40pcs-4.webp', source: '12-barline-5-in-1-laundry-pods-40pcs-4.jpg', alt: 'A single laundry pod with colourful compartments held between two fingers' },
    ],
  },
  {
    slug: 'washing-machine-outlet-pipe-3m', name: 'Washing Machine Outlet Pipe 3M', categorySlug: 'washing-machine-plumbing', price: 1000, currency: 'KES', sourceRow: 13,
    description: 'A grey ribbed drain hose, 3 metres long, coiled inside a clear plastic bag. It carries waste water from the washing machine to a drain or standpipe. Check that the end fittings suit your machine and your drain before you order, and message us if you are not sure.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,200.',
    seoTitle: `Washing Machine Outlet Pipe 3M${FOOT}`,
    seoDescription: 'Grey ribbed 3 metre washing machine outlet pipe for draining waste water from your machine. KES 1,000. Order online in Nairobi.',
    images: [
      { file: 'washing-machine-outlet-pipe-3m-1.webp', source: '13-washing-machine-outlet-pipe-3m-2.jpg', alt: 'Grey ribbed washing machine outlet pipe coiled inside a clear plastic bag' },
    ],
  },
  {
    slug: 'washing-machine-inlet-pipe-3m', name: 'Washing Machine Inlet Pipe 3M', categorySlug: 'washing-machine-plumbing', price: 1000, currency: 'KES', sourceRow: 14,
    description: 'A grey 3 metre water inlet hose for a washing machine, coiled in a clear pack with a printed card that reads Washing Machine Hose. It connects the tap to the machine to supply water. Message us to confirm the end fittings and pressure rating before you order.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,200.',
    seoTitle: `Washing Machine Inlet Pipe 3M${FOOT}`,
    seoDescription: 'Grey 3 metre washing machine inlet pipe that connects the tap to your machine. KES 1,000. Order online in Nairobi or on WhatsApp.',
    images: [
      { file: 'washing-machine-inlet-pipe-3m-1.webp', source: '14-washing-machine-inlet-pipe-3m-2.jpg', alt: 'Grey washing machine inlet hose coiled in a clear pack with a blue card label' },
    ],
  },
  {
    slug: 'colour-and-dirt-catcher', name: 'Colour and Dirt Catcher', categorySlug: 'laundry-care', price: 1000, currency: 'KES', sourceRow: 15,
    description: 'A boxed pack of colour and dirt catcher sheets for the washing machine, with 50 sheets per box as printed on the front. The box says it allows mixed washes and protects against colour runs, so loose dye is caught instead of staining other clothes. Follow the instructions on the box and message us with any questions.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,200.',
    seoTitle: `Colour and Dirt Catcher${FOOT}`,
    seoDescription: 'Colour and dirt catcher sheets, 50 per box, for mixed washes and to protect against colour runs. KES 1,000. Order online in Nairobi.',
    images: [
      { file: 'colour-and-dirt-catcher-1.webp', source: '15-colour-and-dirt-catcher-1.jpg', alt: 'Front of a colour and dirt catcher box marked 50 sheets held in a hand' },
      { file: 'colour-and-dirt-catcher-2.webp', source: '15-colour-and-dirt-catcher-2.jpg', alt: 'Back of the colour and dirt catcher box showing the instructions' },
    ],
  },
  {
    slug: 'drum-cleaning-tablets', name: 'Drum Cleaning Tablets', categorySlug: 'laundry-care', price: 700, currency: 'KES', sourceRow: 16,
    description: 'Washing machine drum cleaning tablets in a small blue box marked as a 12 pack with a deep clean formula for washing machines. They are used to clean the inside of the machine. Follow the instructions printed on the box, and message us if you have any questions before you order.',
    descriptionStatus: 'generated-from-name', needsReview: true, featured: false,
    listPriceNote: 'Struck-through list price in the source catalogue: KES 1,000.',
    seoTitle: `Drum Cleaning Tablets${FOOT}`,
    seoDescription: 'Washing machine drum cleaning tablets in a blue 12 pack box with a deep clean formula. KES 700. Order online in Nairobi or on WhatsApp.',
    images: [
      { file: 'drum-cleaning-tablets-1.webp', source: '16-drum-cleaning-tablets-2.jpg', alt: 'Blue box of washing machine drum cleaning tablets marked 12 pack held in a hand' },
    ],
  },
];
