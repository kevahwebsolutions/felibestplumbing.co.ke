import { imagesByPrefix, img, type Img } from '@/lib/images';

export type IconKey =
  | 'drain' | 'siren' | 'bath' | 'gutter' | 'glass' | 'pipe' | 'shower' | 'sink' | 'gauge' | 'house'
  | 'building' | 'consult' | 'pump' | 'toilet' | 'tap' | 'burst' | 'smell' | 'bolt' | 'sun' | 'tank'
  | 'sofa' | 'shield' | 'wrench' | 'droplet';

export type ServiceGroup = 'Emergency and repairs' | 'Drains and sewer' | 'Bathrooms and showers' | 'Water systems' | 'Property and projects';

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: IconKey;
  group: ServiceGroup;
  seoTitle: string;
  seoDescription: string;
  paragraphs: string[];
  listHeading?: string;
  list?: { title?: string; text: string }[];
  listKind?: 'steps' | 'tips';
  faqs: { q: string; a: string }[];
  heroSrc: string;
  galleryPrefixes: string[];
  related: string[];
  emergency?: boolean;
};

export const SERVICES: Service[] = [
  {
    slug: 'emergency-plumbing',
    title: 'Emergency Plumbing',
    short: 'Burst pipe, flooded bathroom or sewage backup? We respond 24 hours a day across Nairobi.',
    icon: 'siren',
    group: 'Emergency and repairs',
    seoTitle: '24/7 Emergency Plumber in Nairobi',
    seoDescription: 'Burst pipes, flooding, sewage backups and broken fixtures? Felibest Plumbing responds 24 hours, 7 days a week across Nairobi. Call +254 798 174 201.',
    paragraphs: [
      'Plumbing emergencies rarely wait for office hours. Whether it is a burst pipe, a flooded bathroom or a severely clogged drain, our team is available around the clock to help anywhere in Nairobi. We arrive with the tools and expertise to stop the damage quickly and get your home or business back to normal.',
      'Our emergency service covers water leaks, broken water heaters, sewage backups and malfunctioning fixtures. We handle complex problems every week, so you get an efficient fix rather than a temporary patch, and you approve the price before any work starts.',
    ],
    listHeading: 'How to handle a plumbing emergency',
    listKind: 'steps',
    list: [
      { title: 'Turn off the water', text: 'Shut off the main water supply to prevent flooding.' },
      { title: 'Assess the situation', text: 'Identify the source of the problem, such as a leak or a clog.' },
      { title: 'Contain the damage', text: 'Use towels or buckets to limit how far the water spreads.' },
      { title: 'Avoid DIY fixes', text: 'Do not attempt complex repairs yourself, as this can make the problem worse.' },
      { title: 'Call a plumber', text: 'Contact Felibest Plumbing for fast emergency service.' },
    ],
    faqs: [
      { q: 'Do you really work at night and on weekends?', a: 'Yes. We offer 24 hour service, 7 days a week, and we never charge extra for same day service, evenings or weekend appointments.' },
      { q: 'What should I do before the plumber arrives?', a: 'Turn off the main water supply, switch off any electric water heater, move valuables away from the water and mop up standing water if it is safe to do so.' },
    ],
    heroSrc: '/images/services/plumbing-emergency.webp',
    galleryPrefixes: ['/images/services2/emer'],
    related: ['burst-pipes-repair', 'blocked-toilet-repair', 'drain-lines'],
    emergency: true,
  },
  {
    slug: 'burst-pipes-repair',
    title: 'Burst Pipes Repair',
    short: 'Fast, reliable burst pipe repair that stops water damage and restores your supply.',
    icon: 'burst',
    group: 'Emergency and repairs',
    seoTitle: 'Burst Pipes Repair in Nairobi',
    seoDescription: 'Burst pipe repair in Nairobi, available 24/7. Felibest Plumbing finds the break, repairs or replaces the pipe and limits damage to your property.',
    paragraphs: [
      'Burst pipes can cause significant damage to your property, leading to water wastage, structural issues and potential mould growth. Our experienced plumbers are available 24/7 to respond quickly, minimise the damage and restore your plumbing system efficiently. Whether it is a minor leak or a major rupture, we have the tools to fix it promptly.',
      'Our approach starts with a thorough assessment of the damage, using non-invasive methods where possible to find the source. We then offer tailored solutions, from simple pipe patches to full replacements, using durable materials to prevent future bursts and give long-lasting results.',
    ],
    faqs: [
      { q: 'What do I do when a pipe bursts?', a: 'Close the main stopcock immediately, open the taps to drain the line, switch off electricity near the water and call us. Do not try to wrap a burst pipe permanently yourself.' },
      { q: 'Do you repair or replace the pipe?', a: 'It depends on the damage. A small split can be repaired with a proper coupling, but corroded or repeatedly failing sections are better replaced. We explain both options and you approve the price first.' },
    ],
    heroSrc: '/images/services/broken-pipes.webp',
    galleryPrefixes: ['/images/services2/burst-pipes'],
    related: ['emergency-plumbing', 'piping-and-repiping', 'low-water-pressure'],
    emergency: true,
  },
  {
    slug: 'blocked-toilet-repair',
    title: 'Blocked Toilet Repair',
    short: 'Same-day clearing of blocked toilets, from simple plunging to advanced drain clearing.',
    icon: 'toilet',
    group: 'Drains and sewer',
    seoTitle: 'Blocked Toilet Repair in Nairobi',
    seoDescription: 'Blocked toilet repair across Nairobi with same-day service. Felibest Plumbing finds the cause of the blockage and clears it. Call +254 798 174 201.',
    paragraphs: [
      'A blocked toilet disrupts your day and can become a health hazard if left untreated. We clear blockages throughout Nairobi, from a minor obstruction to a serious problem deep within the pipes, using the right tools for each case, from plunging to advanced drain-clearing techniques.',
      'We prioritise same-day service to minimise downtime. Our plumbers inspect the line to find the real cause, whether it is an object lodged in the pipe or a build-up of waste, and apply a targeted fix so the toilet keeps flushing properly.',
    ],
    faqs: [
      { q: 'Why does my toilet keep blocking?', a: 'Repeated blockages usually point to something further down the line, such as a partial obstruction, a poorly vented drain or too much paper. We inspect the line instead of only plunging the bowl.' },
      { q: 'What should never be flushed?', a: 'Wipes, sanitary products, nappies, cotton buds and kitchen paper do not break down and are the most common cause of blocked toilets.' },
    ],
    heroSrc: '/images/services/clogged-toilet.webp',
    galleryPrefixes: ['/images/services2/blocked-toilet'],
    related: ['drain-lines', 'blocked-sink-bath-shower', 'sewer-smell-removal'],
  },
  {
    slug: 'drain-lines',
    title: 'Unclogging Drain Lines',
    short: 'Clear slow and blocked drains caused by grease, hair, soap scum and debris.',
    icon: 'drain',
    group: 'Drains and sewer',
    seoTitle: 'Drain Cleaning and Unclogging in Nairobi',
    seoDescription: 'Drain unclogging and drain line cleaning in Nairobi. Felibest Plumbing removes grease, hair and debris and shows you how to prevent the next blockage.',
    paragraphs: [
      'Drain clogs are blockages that occur within your plumbing system, usually from the accumulation of grease, hair, soap scum and other foreign objects. Over time these materials build up, causing water to drain slowly or stop completely, with unpleasant odours and potential damage to your plumbing.',
      'We locate the blockage, clear it and confirm the line runs freely. Then we show you what caused it so it does not come straight back.',
    ],
    listHeading: 'How to avoid drain clogs',
    listKind: 'tips',
    list: [
      { text: 'Dispose of grease and oil in the trash, not down the sink.' },
      { text: 'Use a drain screen to catch hair and debris in bathrooms.' },
      { text: 'Avoid flushing non-biodegradable items down the toilet.' },
      { text: 'Regularly flush your drains with hot water or a mild cleaner.' },
      { text: 'Perform regular maintenance checks on your plumbing system.' },
    ],
    faqs: [
      { q: 'Are chemical drain cleaners safe to use?', a: 'Use them sparingly. Strong chemicals can damage older pipes and are dangerous to handle. If a drain stays slow after one treatment, call us for a proper clearing.' },
      { q: 'How can I tell if the blockage is in my line or the main sewer?', a: 'If only one fixture is slow the blockage is local. If several fixtures drain slowly or gurgle together, the main drain line is likely affected and needs inspection.' },
    ],
    heroSrc: '/images/services2/clog1.webp',
    galleryPrefixes: ['/images/services2/clog'],
    related: ['blocked-sink-bath-shower', 'blocked-toilet-repair', 'sewer-smell-removal'],
  },
  {
    slug: 'blocked-sink-bath-shower',
    title: 'Blocked Sink, Bathtub and Slow Shower Drain Repair',
    short: 'Hair, soap residue and grease cleared fast, with advice to keep drains flowing.',
    icon: 'sink',
    group: 'Drains and sewer',
    seoTitle: 'Blocked Sink and Bath Drains in Nairobi',
    seoDescription: 'Blocked sink, bathtub or slow shower drain in Nairobi? Felibest Plumbing locates and clears the blockage quickly and helps you prevent a repeat.',
    paragraphs: [
      'Blocked sinks, bathtubs and slow shower drains disrupt your routine and cause unpleasant odours. Hair, soap residue, food particles and grease accumulate over time and lead to slow drainage or complete blockages. We use professional tools to locate the blockage and clear it, restoring proper flow.',
      'Preventing the next blockage matters as much as fixing this one. We also advise on regular cleaning, drain screens and avoiding grease or non-biodegradable items down the sink, so your drains keep running smoothly.',
    ],
    faqs: [
      { q: 'Why does my kitchen sink drain slowly?', a: 'Grease and food particles coat the pipe walls and gradually narrow the drain. A proper clearing removes the build-up rather than pushing it further down the line.' },
      { q: 'Can a slow shower drain cause a smell?', a: 'Yes. Trapped hair and soap residue decompose in the trap and can produce odours. Clearing the drain usually removes the smell.' },
    ],
    heroSrc: '/images/services/blocked-sink-repair.webp',
    galleryPrefixes: ['/images/services2/drain-clog'],
    related: ['drain-lines', 'sink-and-tap-repair', 'sewer-smell-removal'],
  },
  {
    slug: 'sewer-smell-removal',
    title: 'Fixing Sewer Smell in the Bathroom',
    short: 'Find and fix the cause of sewer odours: dried traps, blocked drains or poor ventilation.',
    icon: 'smell',
    group: 'Drains and sewer',
    seoTitle: 'Bathroom Sewer Smell Removal in Nairobi',
    seoDescription: 'Sewer smell in your bathroom? Felibest Plumbing finds the root cause, from dried P-traps to blocked drains and ventilation faults, and fixes it for good.',
    paragraphs: [
      'An unpleasant sewer smell in your bathroom is usually a sign of a plumbing fault, not a cleaning problem. Common causes are clogged or damaged drains, dried-up P-traps and ventilation problems.',
      'Our plumbers inspect your system, identify the root cause and provide a lasting solution. Whether it means clearing blockages, resealing pipes or improving ventilation, the aim is a fresh, hygienic bathroom.',
    ],
    faqs: [
      { q: 'Why does my bathroom smell only sometimes?', a: 'A trap that dries out in a rarely used bathroom, or wind and pressure changes pulling air through a poorly vented line, can cause intermittent smells.' },
      { q: 'Will air fresheners fix it?', a: 'No. They only mask the smell. The source, such as a dry trap or a leaking joint, has to be found and fixed.' },
    ],
    heroSrc: '/images/services/bathroom-smell-removal.webp',
    galleryPrefixes: ['/images/services2/sewer-smell'],
    related: ['drain-lines', 'blocked-toilet-repair', 'blocked-sink-bath-shower'],
  },
  {
    slug: 'leaking-taps-and-mixers',
    title: 'Leaking Shower Taps and Mixers Repair',
    short: 'Stop drips and leaks by replacing worn washers, valves and cartridges.',
    icon: 'tap',
    group: 'Emergency and repairs',
    seoTitle: 'Leaking Tap and Mixer Repair in Nairobi',
    seoDescription: 'Leaking shower taps and mixers repaired in Nairobi. Felibest Plumbing replaces worn washers, valves and cartridges to stop waste and protect your walls.',
    paragraphs: [
      'Leaking shower taps and mixers waste water and push up your bills. We find and repair leaks in your shower system, replacing worn-out washers, valves or cartridges to restore your taps and mixers to full working order.',
      'Left unchecked, a leaking shower can damage walls and flooring. We fix the immediate problem and make sure the repair lasts, so your shower operates smoothly for years.',
    ],
    faqs: [
      { q: 'Should I repair or replace a leaking mixer?', a: 'If the body is sound, a new cartridge or washer is often enough. If the mixer is corroded or parts are no longer available, replacement is better value.' },
      { q: 'How much water does a dripping tap waste?', a: 'A steady drip can waste many litres a day, which adds up on a metered supply. Repairing it is usually quick and inexpensive.' },
    ],
    heroSrc: '/images/services/leaking-tap.webp',
    galleryPrefixes: ['/images/services2/leaking-shower'],
    related: ['sink-and-tap-repair', 'shower-head-installation', 'electric-instant-shower'],
  },
  {
    slug: 'sink-and-tap-repair',
    title: 'Kitchen Sink and Tap Repair',
    short: 'Leaky faucets, clogged sinks and worn fittings repaired with quality parts.',
    icon: 'sink',
    group: 'Emergency and repairs',
    seoTitle: 'Kitchen Sink and Tap Repair in Nairobi',
    seoDescription: 'Kitchen sink and tap repair in Nairobi. Felibest Plumbing fixes leaky faucets and clogged sinks using quality parts, with clear communication throughout.',
    paragraphs: [
      'A malfunctioning kitchen sink or tap disrupts your daily routine. Whether it is a leaky faucet, a clogged sink or another problem, our technicians diagnose and repair a wide range of kitchen sink and tap faults so your kitchen stays functional.',
      'We use quality parts so repairs last, and we keep you informed throughout. Whether you need a quick fix or a more complex repair, we restore your sink and tap to perfect working order.',
    ],
    listHeading: 'Tips to maintain your kitchen sink and taps',
    listKind: 'tips',
    list: [
      { title: 'Regular cleaning', text: 'Clean your sink and taps with mild soap and water to prevent build-up of grime and stains.' },
      { title: 'Check for leaks', text: 'Periodically inspect faucets and the sink for signs of leaks, which waste water and lead to bigger issues.' },
      { title: 'Avoid harsh chemicals', text: 'Use non-corrosive cleaners to avoid damaging surfaces.' },
      { title: 'Tighten fixtures', text: 'Make sure fittings are properly tightened to prevent leaks and drips.' },
      { title: 'Clear clogs promptly', text: 'Address slow drainage immediately so clogs do not worsen.' },
    ],
    faqs: [
      { q: 'Can you replace my kitchen mixer tap?', a: 'Yes. We supply and fit mixers or fit one you have bought. We check the isolating valves and flexible connectors at the same time.' },
      { q: 'Why is water pressure weak at only the kitchen tap?', a: 'A blocked aerator, a partly closed isolating valve or a worn cartridge are the usual causes, and each is a quick fix.' },
    ],
    heroSrc: '/images/services/kitchen-sink-tap-repair.webp',
    galleryPrefixes: ['/images/services2/kitchensink'],
    related: ['leaking-taps-and-mixers', 'blocked-sink-bath-shower', 'low-water-pressure'],
  },
  {
    slug: 'low-water-pressure',
    title: 'Fix Low Water Pressure',
    short: 'We trace the cause of weak flow, from blockages and leaks to faulty fixtures, and restore pressure.',
    icon: 'gauge',
    group: 'Water systems',
    seoTitle: 'Low Water Pressure Repair in Nairobi',
    seoDescription: 'Low water pressure at home or work in Nairobi? Felibest Plumbing inspects your system, finds blockages or leaks and restores strong, reliable flow.',
    paragraphs: [
      'Low water pressure affects simple tasks like showering or washing dishes. The causes include clogs in the plumbing, leaks or problems with the supply. We diagnose and address the underlying cause so you get a steady flow throughout your home.',
      'Our plumbers inspect the system for blockages, leaks and fixture problems, then use quality materials and proper techniques to restore pressure. We test the result before we leave.',
    ],
    listHeading: 'Our approach to fixing low water pressure',
    listKind: 'steps',
    list: [
      { title: 'Initial assessment', text: 'We evaluate your plumbing system to identify pressure issues.' },
      { title: 'Identify causes', text: 'We investigate potential causes such as leaks or blockages.' },
      { title: 'System repairs', text: 'We carry out the repairs needed to restore optimal pressure.' },
      { title: 'Pressure testing', text: 'After repairs we test to make sure pressure levels are satisfactory.' },
      { title: 'Ongoing maintenance', text: 'We give you tips for maintaining water pressure over time.' },
    ],
    faqs: [
      { q: 'Could the problem be my water tank or pump?', a: 'Yes. In many Nairobi homes pressure depends on tank height, a booster pump and the pipe size. We check all three, not just the taps.' },
      { q: 'Why is pressure low on only one floor?', a: 'Upper floors rely on tank height or a pump. A blocked pipe section or a partly closed valve can also affect a single level.' },
    ],
    heroSrc: '/images/services/water-pressure.webp',
    galleryPrefixes: ['/images/services2/waterpressure'],
    related: ['piping-and-repiping', 'tank-installation-and-repair', 'sump-pump-repair'],
  },
  {
    slug: 'piping-and-repiping',
    title: 'Piping and Repiping',
    short: 'New-build pipework and full repiping of old, corroded lines by licensed plumbers.',
    icon: 'pipe',
    group: 'Water systems',
    seoTitle: 'Piping and Repiping in Nairobi',
    seoDescription: 'Pipe installation and repiping for Nairobi homes and businesses. Licensed Felibest plumbers use quality materials to improve pressure and stop leaks.',
    paragraphs: [
      'We offer expert piping and repiping in Nairobi so your plumbing system runs efficiently and reliably. Whether you are constructing a new building or replacing old, corroded pipes, our licensed plumbers provide quality workmanship and durable materials for residential and commercial projects.',
      'Repiping improves water pressure, eliminates leaks and enhances overall performance. From small pipe repairs to full system replacements, we keep disruption to your home or business to a minimum.',
    ],
    listHeading: 'Our approach to piping and repiping',
    listKind: 'steps',
    list: [
      { title: 'Initial inspection', text: 'We assess your existing plumbing to identify issues and recommend the best course of action.' },
      { title: 'Customised solutions', text: 'Solutions are tailored to your needs and property requirements.' },
      { title: 'High-quality materials', text: 'We only work with durable, top-grade materials.' },
      { title: 'Skilled installation', text: 'Precise installation with minimal disruption to your daily life.' },
      { title: 'Post-work inspection', text: 'We inspect after installation to confirm everything functions flawlessly.' },
    ],
    faqs: [
      { q: 'What are the signs I need to replace my pipes?', a: 'Frequent leaks, discoloured water, reduced pressure and unusual noises such as banging or clanging are common signs that repiping should be considered.' },
      { q: 'Can you repipe without breaking up the whole house?', a: 'Often yes. We plan routes to minimise opening walls and floors, and we agree the scope with you before work starts.' },
    ],
    heroSrc: '/images/services/piping-and-repiping.webp',
    galleryPrefixes: ['/images/services2/pip'],
    related: ['burst-pipes-repair', 'low-water-pressure', 'commercial-plumbing'],
  },
  {
    slug: 'shower-head-installation',
    title: 'Shower Head Installation',
    short: 'Rain showers and high-efficiency shower heads fitted securely with the right flow.',
    icon: 'shower',
    group: 'Bathrooms and showers',
    seoTitle: 'Shower Head Installation in Nairobi',
    seoDescription: 'Shower head installation in Nairobi. Felibest Plumbing fits rain showers and efficient models securely for good flow and a leak-free finish.',
    paragraphs: [
      'We offer professional shower head installation across Nairobi so you enjoy a refreshing shower. Whether you are upgrading to a high-efficiency model, fitting a rain shower head or replacing an outdated unit, our technicians handle every step with care.',
      'We guide you through choosing a shower head that suits your needs and checking compatibility with your existing plumbing, then install it securely for maximum flow and efficiency.',
    ],
    listHeading: 'Tips for maintaining your shower head',
    listKind: 'tips',
    list: [
      { title: 'Regular cleaning', text: 'Clean your shower head monthly to remove mineral build-up and maintain flow.' },
      { title: 'Vinegar soaks', text: 'Soak the shower head in vinegar to dissolve limescale and deposits.' },
      { title: 'Check for leaks', text: 'Inspect regularly and replace worn washers or O-rings to prevent water wastage.' },
      { title: 'Watch the pressure', text: 'Very high pressure can lead to premature wear and damage.' },
      { title: 'Replace when necessary', text: 'Consider replacing the shower head every few years or if performance drops noticeably.' },
    ],
    faqs: [
      { q: 'Will a rain shower work with my pressure?', a: 'Large rain heads need decent flow. We check your pressure first and recommend a model that performs well with it.' },
      { q: 'Can you install a shower head I bought myself?', a: 'Yes. We fit customer-supplied fixtures and test them for leaks before we leave.' },
    ],
    heroSrc: '/images/services/shower-repair.webp',
    galleryPrefixes: ['/images/services2/shower-install'],
    related: ['electric-instant-shower', 'leaking-taps-and-mixers', 'glass-shower-cubicles'],
  },
  {
    slug: 'electric-instant-shower',
    title: 'Electric Instant Shower Replacement and Leakage Detection',
    short: 'Safe replacement of faulty instant showers and detection of hidden leaks.',
    icon: 'bolt',
    group: 'Bathrooms and showers',
    seoTitle: 'Instant Shower Replacement in Nairobi',
    seoDescription: 'Electric instant shower replacement and leak detection in Nairobi. Felibest Plumbing diagnoses faults, replaces units and finds hidden leaks safely.',
    paragraphs: [
      'Whether your shower is malfunctioning or you suspect a water leak, our technicians handle the problem efficiently. We quickly diagnose issues, replace faulty electric showers and detect hidden leaks to prevent water damage.',
      'Our goal is a shower that works safely and effectively, giving you reliable hot water every time. Because water and electricity are a serious combination, we recommend professional installation and testing.',
    ],
    faqs: [
      { q: 'My instant shower gives only cold water. Is it faulty?', a: 'It could be low water pressure, a tripped breaker, a failed heating element or scale build-up. We test each cause before recommending a repair or replacement.' },
      { q: 'Is it safe to install an electric shower myself?', a: 'We strongly advise against it. Correct earthing, cabling and water connections are essential to prevent shock and fire.' },
    ],
    heroSrc: '/images/services/instant-shower.webp',
    galleryPrefixes: ['/images/services2/shower-replacement'],
    related: ['shower-head-installation', 'solar-water-heater', 'leaking-taps-and-mixers'],
  },
  {
    slug: 'solar-water-heater',
    title: 'Solar Water Heater Installation and Maintenance',
    short: 'Energy-efficient solar hot water installed and maintained to cut your electricity bills.',
    icon: 'sun',
    group: 'Water systems',
    seoTitle: 'Solar Water Heaters in Nairobi',
    seoDescription: 'Solar water heater installation and maintenance in Nairobi. Felibest Plumbing fits efficient systems that cut electricity use and keep hot water flowing.',
    paragraphs: [
      'We install and maintain solar water heaters in Nairobi. Our team fits energy-efficient systems that harness the sun, reducing your electricity bills and environmental footprint.',
      'We also provide maintenance to keep your solar water heater performing, prolonging its lifespan and ensuring a consistent hot water supply. Whether you need a new system or maintenance on an existing one, we are your partner for solar water heating.',
    ],
    faqs: [
      { q: 'How long does a water heater last?', a: 'Lifespan depends on the type and how well it is maintained. Regular maintenance helps extend the life of your water heater.' },
      { q: 'Do I still need a back-up heating element?', a: 'On cloudy days a back-up element keeps hot water available. We discuss this when we assess your usage.' },
    ],
    heroSrc: '/images/services/solar-water-heater.webp',
    galleryPrefixes: ['/images/services2/solar-water-heater'],
    related: ['tank-installation-and-repair', 'electric-instant-shower', 'piping-and-repiping'],
  },
  {
    slug: 'tank-installation-and-repair',
    title: 'Tank Installation and Repair',
    short: 'Water tanks installed and repaired to protect your supply from leaks and corrosion.',
    icon: 'tank',
    group: 'Water systems',
    seoTitle: 'Water Tank Installation in Nairobi',
    seoDescription: 'Water tank installation and repair across Nairobi. Felibest Plumbing sets up durable tanks and fixes leaks and corrosion to keep your water flowing.',
    paragraphs: [
      'We provide professional tank installation and repair services across Nairobi. Whether you are installing a new water tank or repairing an existing one, our experienced team ensures a seamless process.',
      'We set up durable tanks that meet your storage needs and carry out repairs to prevent leaks, corrosion and other issues that affect performance, helping maintain consistent water flow for your home or business.',
    ],
    faqs: [
      { q: 'Where should a water tank be positioned?', a: 'On a solid, level base with good access for maintenance. Raising the tank improves gravity pressure to your fixtures.' },
      { q: 'How often should a tank be cleaned?', a: 'We recommend cleaning and inspecting a storage tank at least once a year, or sooner if the water looks cloudy or smells.' },
    ],
    heroSrc: '/images/services/tank-repair.webp',
    galleryPrefixes: ['/images/services2/tank-repair'],
    related: ['low-water-pressure', 'solar-water-heater', 'sump-pump-repair'],
  },
  {
    slug: 'sump-pump-repair',
    title: 'Sump Pump Repair and Installation',
    short: 'Keep basements and low areas dry with reliable sump pump repair and installation.',
    icon: 'pump',
    group: 'Water systems',
    seoTitle: 'Sump Pump Repair in Nairobi',
    seoDescription: 'Sump pump repair and installation in Nairobi. Felibest Plumbing diagnoses mechanical, electrical and discharge faults to keep your property dry.',
    paragraphs: [
      'A working sump pump keeps your basement or low-lying area dry and protected from flooding, especially in heavy rain. Over time wear and tear can cause failure to activate, strange noises or inefficient water removal.',
      'We repair sump pumps in Nairobi and diagnose mechanical problems, electrical issues and clogged discharge pipes quickly. We work on various pump types and brands, restoring the system to full working order.',
    ],
    faqs: [
      { q: 'How do I know my sump pump is failing?', a: 'The pump does not start, runs constantly, makes grinding noises or leaves water standing in the pit.' },
      { q: 'Can you install a new sump pump?', a: 'Yes. We size the pump to the pit, set the float switch correctly and route the discharge safely away from the building.' },
    ],
    heroSrc: '/images/services/sump-pump.webp',
    galleryPrefixes: ['/images/services2/sump-pump'],
    related: ['tank-installation-and-repair', 'emergency-plumbing', 'gutter-installations'],
  },
  {
    slug: 'gutter-installations',
    title: 'Gutter Installations',
    short: 'Durable gutter systems that carry rainwater away from your foundation.',
    icon: 'gutter',
    group: 'Property and projects',
    seoTitle: 'Gutter Installation in Nairobi',
    seoDescription: 'Gutter installation in Nairobi for homes and businesses. Felibest Plumbing fits durable gutters that guide rainwater away from your building.',
    paragraphs: [
      'We specialise in professional gutter installations that protect your home or business from water damage caused by poor drainage. Our team uses quality materials to install durable, efficient gutter systems that direct rainwater away from your building foundation.',
      'Whether you want to replace old gutters or install new ones, we deliver precision and reliability, giving you peace of mind during the rainy season.',
    ],
    faqs: [
      { q: 'When is the best time to install gutters?', a: 'Before the rains. Installing early protects walls and foundations from the first heavy downpours.' },
      { q: 'Can you replace my existing gutters?', a: 'Yes. We remove the old system, check the fascia and install new gutters and downpipes sized for your roof area.' },
    ],
    heroSrc: '/images/services2/wth1.webp',
    galleryPrefixes: ['/images/services2/wth'],
    related: ['sump-pump-repair', 'commercial-plumbing', 'residential-plumbing'],
  },
  {
    slug: 'bathroom-renovations',
    title: 'Bathroom Renovations',
    short: 'From new showerheads to full remodels, planned and delivered with attention to detail.',
    icon: 'bath',
    group: 'Bathrooms and showers',
    seoTitle: 'Bathroom Renovation in Nairobi',
    seoDescription: 'Bathroom renovation in Nairobi, from fixture upgrades to full remodels. Felibest Plumbing plans, plumbs and finishes with quality materials.',
    paragraphs: [
      'We specialise in bathroom renovations in Nairobi with tailored solutions for your style and functionality needs. Whether you want to update outdated fixtures, install modern plumbing or completely transform the space, we work with quality materials and proven techniques to deliver precision and durability.',
      'Our renovations enhance both the look and function of your bathroom, maximising water efficiency and improving drainage. We serve residential bathrooms and commercial facilities with timely, cost-effective and reliable service.',
    ],
    listHeading: 'Our approach to bathroom renovations',
    listKind: 'steps',
    list: [
      { title: 'Personalised consultation', text: 'We begin with a detailed consultation to understand your vision, preferences and budget.' },
      { title: 'Comprehensive design planning', text: 'We create a functional, attractive design that maximises your space and reflects your style.' },
      { title: 'Quality materials', text: 'We source quality materials and fixtures for durability and longevity.' },
      { title: 'Skilled craftsmanship', text: 'Our professionals handle every aspect with meticulous attention to detail.' },
      { title: 'Timely completion', text: 'We value your time and complete renovations efficiently while minimising disruption.' },
    ],
    faqs: [
      { q: 'Do you handle the plumbing and the finishing?', a: 'We plan and deliver the plumbing and fixtures, and can coordinate interior design and glass work through Felibest Interiors and our glass installation service.' },
      { q: 'How do I get a price?', a: 'Book a consultation. We assess the space, agree the scope and you approve the price before any work starts.' },
    ],
    heroSrc: '/images/services/bathroom-renovation.webp',
    galleryPrefixes: ['/images/services2/bth'],
    related: ['interior-design', 'glass-shower-cubicles', 'shower-head-installation'],
  },
  {
    slug: 'glass-shower-cubicles',
    title: 'Glass Shower Cubicle Installations',
    short: 'Frameless and semi-frameless glass cubicles made to fit your bathroom.',
    icon: 'glass',
    group: 'Bathrooms and showers',
    seoTitle: 'Glass Shower Cubicles in Nairobi',
    seoDescription: 'Glass shower cubicle installation in Nairobi. Felibest Plumbing fits custom frameless and semi-frameless cubicles for a sleek, durable finish.',
    paragraphs: [
      'Glass shower cubicles are a sleek, modern upgrade for any bathroom. We install custom glass shower cubicles tailored to fit your space, with precision in every installation and a seamless look that lifts the whole room.',
      'From frameless to semi-frameless designs, we offer styles to suit your preference. Our installation is efficient and detail-oriented, with minimal disruption to your home.',
    ],
    listHeading: 'Our approach to glass shower cubicle installations',
    listKind: 'steps',
    list: [
      { title: 'Consultation and assessment', text: 'We measure your space and discuss the style you want.' },
      { title: 'System selection', text: 'We help you choose the right cubicle for your bathroom and usage.' },
      { title: 'Expert installation', text: 'Our technicians install with precision and care.' },
      { title: 'Quality materials', text: 'We use durable, high-quality glass and hardware.' },
      { title: 'Post-installation support', text: 'We guide you on operating and maintaining your new cubicle.' },
    ],
    faqs: [
      { q: 'Frameless or semi-frameless?', a: 'Frameless gives the cleanest look but uses thicker glass. Semi-frameless is a good balance of style and value. We show both options for your space.' },
      { q: 'How should I clean a glass cubicle?', a: 'Squeegee after showers and wipe with a mild cleaner to prevent limescale marks.' },
    ],
    heroSrc: '/images/services/glass-shower.webp',
    galleryPrefixes: ['/images/services2/gcb'],
    related: ['glass-shower-enclosures', 'bathroom-renovations', 'shower-head-installation'],
  },
  {
    slug: 'glass-shower-enclosures',
    title: 'Glass Shower Enclosure Repair and Installation',
    short: 'New enclosures and repairs, from leak fixes to replacing damaged panels.',
    icon: 'glass',
    group: 'Bathrooms and showers',
    seoTitle: 'Glass Shower Enclosure Repair in Nairobi',
    seoDescription: 'Glass shower enclosure repair and installation in Nairobi. Felibest Plumbing installs new enclosures, fixes leaks and replaces damaged panels.',
    paragraphs: [
      'Our glass shower enclosure repair and installation services give your bathroom a sleek, modern upgrade. Whether you are installing a new enclosure or repairing an existing one, our team ensures a flawless finish with quality materials and expert craftsmanship.',
      'We offer designs tailored to your space, and our repair service covers everything from fixing leaks to replacing damaged panels. With a focus on durability and style, we help you create a bathroom that is both functional and visually appealing.',
    ],
    faqs: [
      { q: 'Why does my enclosure leak at the door?', a: 'Worn seals, misaligned hinges or poor sealant at the base are the usual causes. We reseal or realign the door.' },
      { q: 'Can a cracked panel be repaired?', a: 'Tempered glass cannot be patched. A cracked or chipped panel should be replaced for safety.' },
    ],
    heroSrc: '/images/services/glass-shower-enclosure-repair-and-installation-services.webp',
    galleryPrefixes: ['/images/services2/gcb'],
    related: ['glass-shower-cubicles', 'bathroom-renovations', 'leaking-taps-and-mixers'],
  },
  {
    slug: 'interior-design',
    title: 'Interior Design and Decoration',
    short: 'Felibest Interiors: concept, space planning and styling for homes and offices.',
    icon: 'sofa',
    group: 'Property and projects',
    seoTitle: 'Interior Design in Nairobi',
    seoDescription: 'Interior design and decoration in Nairobi by Felibest Interiors. Space planning, furniture selection and styling for homes and offices.',
    paragraphs: [
      'Transform your home or office into a stylish, comfortable space with Felibest Interiors. Our interior design and decoration services combine creativity, functionality and modern aesthetics to bring your vision to life.',
      'From concept development and space planning to furniture selection and decor styling, we tailor every detail to your taste and lifestyle. Whether you prefer contemporary, classic or minimalist designs, we deliver elegant, timeless interiors.',
    ],
    faqs: [
      { q: 'Can interior design be combined with a bathroom renovation?', a: 'Yes. Planning the finishes together with the plumbing avoids rework and gives a more cohesive result.' },
      { q: 'Do you design offices as well as homes?', a: 'Yes, we design both residential and commercial interiors.' },
    ],
    heroSrc: '/images/services/interior-design-and-decoration.webp',
    galleryPrefixes: ['/images/services2/in'],
    related: ['bathroom-renovations', 'glass-shower-cubicles', 'plumbing-consultation'],
  },
  {
    slug: 'residential-plumbing',
    title: 'Residential Plumbing',
    short: 'Everything a home needs: leaks, drains, new pipes, fixtures and water heaters.',
    icon: 'house',
    group: 'Property and projects',
    seoTitle: 'Residential Plumbing Services in Nairobi',
    seoDescription: 'Residential plumbing services in Nairobi: leak repair, drain unclogging, new pipework, fixtures and water heaters by Felibest Plumbing.',
    paragraphs: [
      'Residential plumbing keeps your home comfortable and functional. From water supply systems to drainage, a reliable setup ensures clean water for daily tasks and a safe way to remove waste. Routine maintenance, emergency repairs and fixture upgrades keep it running and extend the life of your plumbing.',
      'We understand what homeowners need. Our skilled technicians fix leaks, unclog drains, install new pipes and fit water heaters, prioritising efficient, long-lasting solutions and top-quality workmanship.',
    ],
    faqs: [
      { q: 'How often should my home plumbing be inspected?', a: 'We recommend an inspection at least once a year. It helps catch small issues early, prevent major repairs and keep the system working properly.' },
      { q: 'My water bill is unusually high. What should I check?', a: 'An unusually high bill can signal a leak. Check for visible leaks and watch your water meter. If you cannot find the cause, we can inspect and locate hidden leaks.' },
    ],
    heroSrc: '/images/services/residential-plumbing.webp',
    galleryPrefixes: ['/images/services2/residential'],
    related: ['emergency-plumbing', 'drain-lines', 'piping-and-repiping'],
  },
  {
    slug: 'commercial-plumbing',
    title: 'Commercial Plumbing',
    short: 'Maintenance and emergency plumbing for businesses with minimal disruption.',
    icon: 'building',
    group: 'Property and projects',
    seoTitle: 'Commercial Plumbing Services in Nairobi',
    seoDescription: 'Commercial plumbing services in Nairobi: routine maintenance, emergency repairs, leak fixing and drainage for businesses. Felibest Plumbing.',
    paragraphs: [
      'Commercial plumbing keeps businesses running smoothly. We handle everything from routine maintenance to emergency repairs, keeping disruption to your operations to a minimum.',
      'We tailor our service to the needs of commercial properties, from fixing leaks to maintaining drainage systems. Our team keeps your plumbing efficient so you avoid costly repairs and downtime.',
    ],
    faqs: [
      { q: 'Do you offer planned maintenance for businesses?', a: 'Yes. Regular inspections and servicing reduce emergency call-outs and keep downtime low.' },
      { q: 'Can you work outside business hours?', a: 'Yes. We work 24 hours a day, 7 days a week, so jobs can be scheduled to avoid disrupting trading.' },
    ],
    heroSrc: '/images/services/commercial-plumbing.webp',
    galleryPrefixes: ['/images/services2/commercial'],
    related: ['emergency-plumbing', 'piping-and-repiping', 'fire-and-safety'],
  },
  {
    slug: 'plumbing-consultation',
    title: 'Consultation Services',
    short: 'Expert guidance on renovations, new fixtures and persistent plumbing problems.',
    icon: 'consult',
    group: 'Property and projects',
    seoTitle: 'Plumbing Consultation in Nairobi',
    seoDescription: 'Plumbing consultation in Nairobi. Felibest Plumbing assesses your project, recommends the best solutions and explains scope, materials and timelines.',
    paragraphs: [
      'Our consultation services give you expert guidance on all your plumbing needs. Whether you are planning a major renovation, installing new fixtures or dealing with persistent problems, we assess your situation and recommend the best solutions, based on your requirements, budget and preferences.',
      'Consultations cover leak detection, water heater installations, drain cleaning and bathroom renovations. We explain the scope of the project, materials needed and expected timelines, so you can make informed decisions for long-lasting results.',
    ],
    faqs: [
      { q: 'What happens in a consultation?', a: 'We look at the property, listen to what you need and explain options, materials and timelines. You decide whether to proceed.' },
      { q: 'Will I get a quote?', a: 'Yes. We provide a detailed quote and you approve the price before any work begins.' },
    ],
    heroSrc: '/images/services/consultation-services.webp',
    galleryPrefixes: ['/images/services2/consultation'],
    related: ['bathroom-renovations', 'residential-plumbing', 'commercial-plumbing'],
  },
  {
    slug: 'fire-and-safety',
    title: 'Fire and Safety Solutions',
    short: 'Design, installation and maintenance of fire protection systems with Felibest Fire and Safety.',
    icon: 'shield',
    group: 'Property and projects',
    seoTitle: 'Fire and Safety Systems in Nairobi',
    seoDescription: 'Fire and safety systems in Nairobi: alarms, smoke detectors, sprinklers, extinguishers and evacuation systems installed and maintained by Felibest.',
    paragraphs: [
      'At Felibest Fire and Safety we design, install and maintain advanced fire protection systems. Our services include fire alarms, smoke detectors, sprinklers, extinguishers and emergency evacuation systems, tailored to meet safety regulations and give maximum protection for your property and personnel.',
      'Our technicians provide regular inspections, maintenance and risk assessments to keep your systems performing optimally. Whether for residential, commercial or industrial spaces, we deliver solutions that safeguard lives and assets.',
    ],
    faqs: [
      { q: 'Which systems do you install?', a: 'Fire alarms, smoke detectors, sprinklers, extinguishers and emergency evacuation systems.' },
      { q: 'Do you maintain systems you did not install?', a: 'We carry out inspections, maintenance and risk assessments. Contact us with details of your system.' },
    ],
    heroSrc: '/images/services/fr6.webp',
    galleryPrefixes: ['/images/services2/fr'],
    related: ['commercial-plumbing', 'emergency-plumbing', 'plumbing-consultation'],
  },
];

export const SERVICE_BY_SLUG: Record<string, Service> = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));

export function getService(slug: string): Service | undefined {
  return SERVICE_BY_SLUG[slug];
}

export function serviceHero(s: Service): Img {
  return img(s.heroSrc, `${s.title} by Felibest Plumbing in Nairobi`);
}

export function serviceGallery(s: Service): Img[] {
  return s.galleryPrefixes.flatMap((p) => imagesByPrefix(p, `${s.title} work by Felibest Plumbing`));
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  'Emergency and repairs',
  'Drains and sewer',
  'Bathrooms and showers',
  'Water systems',
  'Property and projects',
];
