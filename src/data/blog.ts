import { readingTime } from '@/lib/utils';

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  cover: string;
  coverAlt: string;
  serviceSlug: string;
  /** Mini markdown: "## heading", "- bullet", "1. step", blank-line separated paragraphs. */
  body: string;
};


export const POSTS: Post[] = [
  {
    slug: 'low-water-pressure-causes-and-fixes',
    title: 'Low Water Pressure at Home: 7 Causes and How to Fix Them',
    excerpt: 'Weak showers and slow taps are rarely random. Here are the most common causes in Nairobi homes and what to check before you call a plumber.',
    date: '2026-09-04',
    category: 'Water systems',
    tags: ['Water pressure', 'Tanks', 'Pumps'],
    cover: '/images/services/water-pressure.webp',
    coverAlt: 'Plumber checking water pressure on a household pipe',
    serviceSlug: 'low-water-pressure',
    body: `Low pressure is one of the most common plumbing complaints we hear. The good news is that the cause is usually something specific and fixable. Work through this list from the simplest check to the most involved.

## 1. A partly closed valve

Check the main stopcock and any isolating valves under basins. A valve that was not fully reopened after earlier repairs is a surprisingly frequent cause.

## 2. Blocked aerators and shower heads

Mineral scale builds up in tap aerators and shower heads, narrowing the openings. Unscrew them, soak in vinegar for an hour and rinse. If pressure returns, that was the problem.

## 3. Tank height and supply

Many homes in Nairobi store water in a roof or raised tank and rely on gravity. A tank that is too low, or one that runs nearly empty during rationing, gives weak flow upstairs. Raising the tank or adding a booster pump can help.

## 4. A failing or undersized pump

If you use a booster pump, listen for it. A pump that runs but delivers little, cycles on and off, or struggles to prime may be worn or wrongly sized for your building.

## 5. Corroded or narrow pipes

Old galvanised pipe corrodes from the inside, reducing its bore. If pressure has dropped slowly over years and your water is sometimes discoloured, repiping may be the real solution.

## 6. Hidden leaks

A leak in the line loses water and pressure before it reaches your taps. Close every tap and check whether your water meter still moves. If it does, you have a leak somewhere.

## 7. A pressure problem on the supply side

Sometimes the street supply itself is weak at peak hours. A storage tank with a pump lets you build your own steady pressure.

## When to call a plumber

If simple checks do not solve it, ask for a pressure test and inspection. We trace the cause, explain your options and you approve the price before any work starts.`,
  },
  {
    slug: 'burst-pipe-what-to-do-first',
    title: 'Burst Pipe: What to Do in the First 10 Minutes',
    excerpt: 'Water damage grows by the minute. These steps limit the damage before your plumber arrives.',
    date: '2026-09-12',
    category: 'Emergencies',
    tags: ['Burst pipes', 'Emergency', 'Leaks'],
    cover: '/images/services/broken-pipes.webp',
    coverAlt: 'Burst pipe spraying water',
    serviceSlug: 'burst-pipes-repair',
    body: `A burst pipe can release hundreds of litres of water an hour. What you do in the first few minutes decides how much damage your ceilings, floors and belongings suffer.

## Do these first

1. Close the main stopcock. Know where it is before you need it. Turn it clockwise until it stops.
2. Open the lowest tap in the house to drain remaining water from the pipes.
3. Switch off the electricity at the board if water is near sockets, appliances or light fittings. Do not stand in water to do it.
4. Switch off electric water heaters and instant showers so elements do not run dry.
5. Move valuables, rugs and electronics out of the way.
6. Use towels, buckets and a mop to limit how far the water spreads.

## What not to do

- Do not use tape or sealant as a permanent fix on a split pipe.
- Do not ignore damp patches on walls or ceilings after the water is off. Hidden moisture can lead to mould.
- Do not leave the repair for later. Pipes that burst often have weak spots nearby.

## Why pipes burst

Common causes include corrosion in old pipes, high pressure from a pump set too high, poor joints made during earlier work and physical damage during building or digging. Knowing the cause matters, because patching one section when the whole run is corroded only delays the next burst.

## Call for help

Felibest Plumbing responds 24 hours a day, 7 days a week. Once the water is under control we locate the break, explain whether a repair or replacement makes sense and agree the price with you before work begins.`,
  },
  {
    slug: 'blocked-toilet-causes-and-prevention',
    title: 'Blocked Toilet: Why It Happens and How to Stop It Coming Back',
    excerpt: 'A plunger fixes the symptom. Finding the cause stops it happening again.',
    date: '2026-09-20',
    category: 'Drains and sewer',
    tags: ['Toilets', 'Drains', 'Prevention'],
    cover: '/images/services/clogged-toilet.webp',
    coverAlt: 'Toilet being repaired by a plumber',
    serviceSlug: 'blocked-toilet-repair',
    body: `Almost everyone faces a blocked toilet at some point. A single blockage is usually a one-off. Repeated blockages are a sign that something else is going on.

## Common causes

- Too much toilet paper flushed at once.
- Wet wipes, sanitary products, nappies and cotton buds, which do not break down in the pipes.
- Objects dropped into the bowl, especially in homes with small children.
- A partial blockage further down the drain line that slowly builds up.
- Poor venting, which causes slow draining and gurgling.
- Roots or collapsed sections in older underground drains.

## Try this first

1. Stop flushing. Repeated flushing can overflow the bowl.
2. Use a flange plunger, which seals the toilet outlet better than a flat sink plunger.
3. Push down gently first to expel air, then plunge with steady strokes for about 20 seconds.
4. If the water level drops, flush once to check.

## When a plunger is not enough

If water rises when you use the shower or sink, or several fixtures gurgle, the blockage is in the main drain line, not the toilet. Do not keep trying: call a plumber, because the drain needs proper clearing.

## Preventing the next blockage

- Bin wipes, sanitary products and nappies. Only flush toilet paper and waste.
- Keep a bin with a lid in the bathroom so it is easy to do the right thing.
- Use toilets with a good flush, and fix a weak flush promptly.
- Have drains inspected if blockages repeat.

Felibest Plumbing offers same-day blocked toilet repair across Nairobi. We inspect the line, clear the cause and tell you what to change so it stays clear.`,
  },
  {
    slug: 'water-tank-maintenance-checklist',
    title: 'Water Tank Maintenance: A Practical Yearly Checklist',
    excerpt: 'Because water is often stored, your tank is part of your plumbing. Keep it clean, sealed and leak free.',
    date: '2026-10-01',
    category: 'Water systems',
    tags: ['Tanks', 'Maintenance', 'Water quality'],
    cover: '/images/services/tank-repair.webp',
    coverAlt: 'Water storage tank installed on a stand',
    serviceSlug: 'tank-installation-and-repair',
    body: `Water supply in many parts of Nairobi is rationed, so most properties depend on a storage tank. A neglected tank affects both water quality and pressure. A short yearly routine keeps it in good shape.

## Once a year

1. Drain and clean the tank. Scrub the walls and floor with a soft brush and rinse out all sediment. Do not use harsh chemicals that leave residue.
2. Inspect for cracks, bulges and discolouration. Plastic tanks that sit in strong sun can weaken with age.
3. Check the lid. It should fit tightly to keep out insects, dust and light, which encourages algae.
4. Check the float valve. A worn float valve can leave the tank overflowing or only half full.
5. Inspect the overflow and vent pipes. Make sure they are clear and screened.
6. Check all connections and isolating valves for slow leaks and corrosion.
7. Check the stand. The base must be level and strong enough for the full weight of the water.

## Warning signs

- Cloudy water, an odd smell or visible particles.
- Green slime on the inside walls.
- A tank that never seems to fill, or fills too slowly.
- Wet patches under or around the tank.

## Position matters

Raising the tank gives better gravity pressure to your taps and showers. If it is not possible to raise it, a booster pump can make up the difference.

If you are installing a new tank or repairing an old one, Felibest Plumbing can install it on the correct base, connect the plumbing and test the whole system.`,
  },
  {
    slug: 'solar-water-heater-guide-for-kenyan-homes',
    title: 'Solar Water Heaters for Kenyan Homes: Is One Right for You?',
    excerpt: 'Strong sunshine and high electricity costs make solar hot water an attractive upgrade. A short guide before you buy.',
    date: '2026-10-09',
    category: 'Water systems',
    tags: ['Solar', 'Water heaters', 'Energy saving'],
    cover: '/images/services/solar-water-heater.webp',
    coverAlt: 'Solar water heater on a roof',
    serviceSlug: 'solar-water-heater',
    body: `Heating water is one of the biggest uses of electricity in a home. With plenty of sunshine, solar water heating can cut that cost significantly.

## How it works

A solar collector on the roof absorbs heat from the sun and passes it to water stored in an insulated tank. The heated water is then available for showers, baths and kitchen use. Most systems include a backup electric element for cloudy days.

## What to consider before buying

- Roof space and orientation. Collectors work best on an unshaded roof facing the sun.
- Roof strength. A full tank is heavy, so the roof structure must carry it.
- Household size. Pick a tank volume that suits the number of people and your hot water habits.
- Water quality. Hard water leaves scale inside collectors and tanks. Plan regular flushing.
- Pressure. Check that your cold water supply and tank height suit the system.

## Installation matters

Good installation protects performance and lifespan. Pipes should be properly insulated, the tank securely mounted and the collector angled and sealed correctly. Poor joints and uninsulated pipes waste heat and can leak.

## Maintenance

- Flush the tank periodically to remove sediment.
- Inspect the collector glass or tubes and seals.
- Check the backup element, thermostat and pressure relief valve.
- Look for leaks at connections and insulation damage.

## Is it worth it?

For households that use hot water daily, solar often pays back through lower electricity bills over time. Felibest Plumbing installs and maintains solar water heaters in Nairobi, and we can assess your roof and usage to recommend the right size.`,
  },
  {
    slug: 'instant-shower-problems-and-fixes',
    title: 'Electric Instant Shower Problems: Why It Runs Cold or Leaks',
    excerpt: 'The usual faults behind a cold shower, a tripping breaker or water dripping from the unit.',
    date: '2026-10-18',
    category: 'Bathrooms and showers',
    tags: ['Instant shower', 'Electric', 'Leaks'],
    cover: '/images/services/instant-shower.webp',
    coverAlt: 'Electric instant shower unit in a bathroom',
    serviceSlug: 'electric-instant-shower',
    body: `Electric instant showers are popular because they heat water on demand. They are also a combination of water and electricity, so faults deserve careful handling.

## Safety first

If you see water leaking from the unit, smell burning or the breaker trips repeatedly, switch the shower off at the isolator or breaker and stop using it. Do not open the unit while it is connected to power.

## The shower only runs cold

- Water flow too high. These units need low flow to heat the water. Reduce the flow rate.
- Low incoming pressure. If flow is too weak the unit's flow switch may not trigger the heater.
- Scaled element. Limescale reduces heating efficiency.
- Failed heating element. After years of use, elements burn out.
- A tripped breaker or a faulty thermal cut-out.

## The unit trips the breaker

This can be caused by water entering the unit, a damaged element or wiring that is not suited to the shower's power rating. Instant showers draw a large current and need dedicated, correctly rated cabling and earthing.

## Water drips from the unit or hose

Worn seals, loose connections and cracked hoses are common. A leak at the unit itself is a risk and the unit usually needs replacement.

## Low trickle

Check the filter at the water inlet for blockages and the shower head for scale.

## When to replace

If the unit is old, repeatedly fails or leaks internally, replacement is the safe and economical choice. Felibest Plumbing diagnoses the fault, replaces faulty units and detects hidden leaks. We recommend professional installation because correct earthing and wiring are essential for safety.`,
  },
  {
    slug: 'bathroom-sewer-smell-causes',
    title: 'Why Does My Bathroom Smell Like a Sewer?',
    excerpt: 'Five common causes of drain odours and what actually fixes each one.',
    date: '2026-10-27',
    category: 'Drains and sewer',
    tags: ['Smells', 'Drains', 'Bathrooms'],
    cover: '/images/services/bathroom-smell-removal.webp',
    coverAlt: 'Bathroom floor drain being inspected',
    serviceSlug: 'sewer-smell-removal',
    body: `A sewer smell is more than unpleasant. It means gases from the drain system are entering your living space. Here are the most common reasons.

## 1. A dry trap

Every drain has a U-shaped trap that holds a small plug of water to block sewer gas. If a shower or floor drain is rarely used, the water evaporates and the smell comes through. Pour water down it and the smell may disappear for a while. If it keeps coming back, check for a slow leak or siphoning.

## 2. A blocked or partly blocked drain

Hair, soap scum and debris decompose in the pipe and trap, creating odours. Clearing the blockage removes the source.

## 3. Poor ventilation

Drain lines need air to flow properly. A blocked or missing vent allows water to be pulled out of traps and gas to push back into the room.

## 4. A leaking or poorly sealed joint

A crack or bad seal around a toilet base or a pipe joint lets gas escape. Look for staining, damp and loose fittings around the toilet.

## 5. Problems in the main drain

If several rooms smell and drains gurgle, the problem could be in the main sewer line or the septic system, which needs professional inspection.

## What not to do

- Do not rely on air fresheners. They mask but do not solve the problem.
- Do not pour strong chemicals down drains repeatedly. They can damage pipes.

## Get it fixed properly

Our plumbers inspect your drains, find the cause and fix it, whether it is clearing a blockage, resealing a joint or improving ventilation.`,
  },
  {
    slug: 'choosing-the-right-taps-and-mixers',
    title: 'Choosing the Right Taps and Mixers for Your Kitchen and Bathroom',
    excerpt: 'Finish, valve type, pressure rating and fit: what to check so your new tap works well for years.',
    date: '2026-11-05',
    category: 'Bathrooms and showers',
    tags: ['Taps', 'Mixers', 'Buying guide'],
    cover: '/images/services/kitchen-sink-tap-repair.webp',
    coverAlt: 'Modern kitchen mixer tap over a sink',
    serviceSlug: 'sink-and-tap-repair',
    body: `A good tap is something you use dozens of times a day. A poor one leaks, drips and needs replacing. Here is what to look for.

## Mixer or separate taps?

A mixer combines hot and cold in one spout and lets you adjust temperature easily. Separate taps are simple and cheap, but you cannot blend water at the spout. For kitchens and basins, a single lever mixer is practical and common.

## Check the pressure rating

Taps are designed for specific supply pressures. Many low-pressure tank-fed systems need taps rated for low pressure. Check the manufacturer's minimum operating pressure against your system before you buy.

## Look at the internals

- Ceramic disc cartridges last longer and resist drips better than rubber washers.
- Solid brass bodies are more durable than cheap alloys.
- A quality finish resists tarnish and limescale marks.

## Spout height and reach

In kitchens the spout must clear tall pots and reach the whole sink. In bathrooms, a high spout on a shallow basin splashes.

## Fit and connections

Check the thread size and the type of connectors. Flexible tap connectors with isolating valves make future changes easy, and each tap should have its own isolating valve so you can fix one without shutting down the water supply to the house.

## Thermostatic and safe-touch options

For households with children or older people, thermostatic mixers limit the maximum temperature and reduce scald risk.

## Installation

Use fresh seals, do not over-tighten and test for leaks under pressure. Felibest Plumbing installs taps and mixers, whether you buy them elsewhere or already have them.`,
  },
];

export function postReadingMinutes(p: Post): number {
  return readingTime(p.body);
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function relatedPosts(slug: string, n = 3): Post[] {
  const cur = getPost(slug);
  return POSTS.filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === cur?.category) - Number(a.category === cur?.category))
    .slice(0, n);
}
