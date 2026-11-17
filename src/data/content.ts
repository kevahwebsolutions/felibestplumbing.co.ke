export const FAQS: { q: string; a: string; group: 'Pricing and booking' | 'Plumbing advice' | 'Emergencies' }[] = [
  { group: 'Pricing and booking', q: 'What do you charge for services?', a: 'Our service charges vary depending on the type and complexity of the plumbing job. We provide transparent pricing and give you a detailed quote before any work begins, so there are no surprises. You approve the price before we start.' },
  { group: 'Pricing and booking', q: 'Do you work at night and on weekends?', a: 'Yes. We offer 24 hour service, 7 days a week, and we never charge extra for same day service, evenings or weekend appointments.' },
  { group: 'Pricing and booking', q: 'Can you install energy-efficient plumbing fixtures?', a: 'Absolutely. We can help you choose and install energy-efficient plumbing fixtures such as low-flow toilets, faucets and showerheads. These fixtures help conserve water and can also reduce your utility bills.' },
  { group: 'Plumbing advice', q: 'How long will a water heater last?', a: 'The lifespan of a water heater typically ranges from 4 to 6 years, depending on the type and maintenance. Regular maintenance can help extend the life of your water heater.' },
  { group: 'Plumbing advice', q: 'What are the signs that I need to replace my plumbing pipes?', a: 'Common signs include frequent leaks, discoloured water, reduced water pressure and unusual noises such as banging or clanging. If you notice any of these, it may be time to consider repiping.' },
  { group: 'Plumbing advice', q: 'How often should I have my plumbing inspected?', a: 'We recommend having your plumbing system inspected at least once a year. Regular inspections help identify potential issues early, prevent major repairs and ensure your plumbing is working properly.' },
  { group: 'Plumbing advice', q: 'What can I do to prevent clogs in my drains?', a: 'Avoid putting grease, coffee grounds and food scraps down the kitchen sink. Use a drain screen to catch hair and other debris in the bathroom, and be mindful of what you flush down the toilet. Regularly flushing drains with hot water or a mild drain cleaner also helps prevent build-up.' },
  { group: 'Plumbing advice', q: 'What should I do if my water bill is unusually high?', a: 'An unusually high water bill could indicate a leak or another plumbing issue. Check for visible leaks around your home and monitor your water meter for irregularities. If you cannot identify the cause, contact us for a thorough inspection to find hidden leaks.' },
  { group: 'Emergencies', q: 'What should I do in case of a plumbing emergency?', a: 'In an emergency such as a burst pipe or severe leak, shut off the main water supply to your home and contact us immediately. We offer 24/7 emergency plumbing services and will respond promptly to minimise damage.' },
];

export const TESTIMONIALS = [
  { title: 'Thanks you guys', text: 'Called for someone to come out to take a look at leak under my sidewalk next to my house/front door. Two gentleman came out on time, quickly diagnosed the problem, and gave me information about the fix.', name: 'Sonia Duvall', role: 'Supervisor' },
  { title: 'Outstanding service!', text: 'Service was great! The plumber was extremely helpful and courteous. He fixed my issue quickly and was very respectful of my time constraints with another appointment. I appreciate the help!', name: 'Donna Behrens', role: 'Homeowner' },
  { title: 'Did an Exceptional Job', text: 'Service was great! The plumber was extremely helpful and courteous. He fixed my issue quickly and was very respectful of my time constraints with another appointment. I appreciate the help!', name: 'Donna Behrens', role: 'Homeowner' },
  { title: 'Excellent Service!', text: 'Plumbers were very professional, seemed to be very knowledgeable, worked like crazy the entire time they were here, and left my house cleaner then they found it! Always happy with our service.', name: 'Donna Behrens', role: 'Homeowner' },
];

export const COVERAGE_AREAS: { zone: string; areas: string[] }[] = [
  { zone: 'Nairobi central and west', areas: ['Nairobi CBD', 'Westlands', 'Parklands', 'Kilimani', 'Kileleshwa', 'Lavington', 'Hurlingham', 'Upper Hill'] },
  { zone: 'South and Southwest', areas: ['Karen', 'Langata', 'South B', 'South C', 'Nairobi West', 'Madaraka', 'Ngong Road', 'Rongai'] },
  { zone: 'East and Northeast', areas: ['Embakasi', 'Donholm', 'Buruburu', 'Pipeline', 'Kasarani', 'Roysambu', 'Zimmerman', 'Ruaka'] },
  { zone: 'Greater Nairobi', areas: ['Kiambu Road', 'Thika Road', 'Kahawa', 'Ruiru', 'Athi River', 'Syokimau', 'Kitengela', 'Ngong'] },
];

export const HOW_IT_WORKS = [
  { title: 'Call, WhatsApp or book online', text: 'Tell us what is wrong. We answer 24 hours a day, 7 days a week, and we can usually send someone the same day.' },
  { title: 'We diagnose and quote', text: 'A licensed technician finds the real cause and gives you a clear price with no hidden fees.' },
  { title: 'You approve the price', text: 'Nothing starts until you say yes. We treat your property like our own.' },
  { title: 'Fixed, cleaned up, guaranteed', text: 'We finish on time, leave the work area clean and back it with our 100% satisfaction guarantee.' },
];

export const VALUES = [
  { title: 'The client is why we exist', text: 'Our number one priority is outstanding customer service on every job, so you walk away 100% satisfied.' },
  { title: 'On-time service', text: 'We arrive on time and finish on time. Emergency service is available 24/7.' },
  { title: 'Transparent pricing', text: 'We do not sneak in hidden fees. You approve the price before we start the job.' },
  { title: 'Reputable and licensed', text: 'Operating for more than 4 years, all of our technicians are fully licensed.' },
  { title: 'Flexibility', text: 'We offer customised solutions and accommodate your schedule.' },
  { title: 'No shortcuts', text: 'We take no shortcuts and leave the work area clean.' },
];

export type RateRow = { item: string; range: string };
export const RATE_GUIDE: RateRow[] = [
  { item: 'Call-out and assessment', range: 'KES 1,000 - 2,500' },
  { item: 'Fix a leak', range: 'KES 1,500 - 7,000' },
  { item: 'Unclog a drain', range: 'KES 1,500 - 5,000' },
  { item: 'Fix a toilet', range: 'KES 1,500 - 4,500' },
  { item: 'Tap, mixer or shower head installation', range: 'KES 1,500 - 4,500' },
  { item: 'Electric instant shower installation', range: 'KES 2,500 - 6,000' },
  { item: 'Water tank installation (labour)', range: 'From KES 5,000' },
  { item: 'Burst pipe or water main repair', range: 'KES 3,000 - 15,000' },
  { item: 'Sump pump repair', range: 'KES 3,000 - 12,000' },
];

export const PLANS = [
  { name: 'Home Care Plan', for: 'Homes and apartments', perks: ['Annual plumbing inspection', 'Water pressure test', 'Locate and label shut-off valves', 'Priority scheduling'], from: 'Ask for a quote' },
  { name: 'Hot Water Plan', for: 'Solar and electric heaters', perks: ['Yearly heater service', 'Safety and thermostat checks', 'Scale and leak inspection', 'Priority call-outs'], from: 'Ask for a quote' },
  { name: 'Business Plan', for: 'Offices, shops and hotels', perks: ['Scheduled maintenance visits', 'Priority emergency response', 'Drainage and leak inspections', 'Maintenance records'], from: 'Ask for a quote' },
];

export const DEFAULT_OFFERS = [
  { title: 'No extra charge for same-day, evening or weekend visits', description: 'Our courteous plumbers work around your busy schedule. Same day service, evenings and weekends cost no extra.', label: 'Standing offer', active: true },
  { title: 'Drain testing special', description: 'Ask about our drain testing special when you book. Our team will confirm the current offer.', label: 'Ask us', active: true },
];
