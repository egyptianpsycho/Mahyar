// Central source of truth for all portfolio content.
// Each project has: cover (image URL), text (title/description), date (year), and images array.

const photo = (seed, w = 1200, h = 1500) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const SAMPLE_VIDEO_1 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const SAMPLE_VIDEO_2 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";

const makeImages = (id, count) =>
  Array.from({ length: count }, (_, i) => photo(`${id}-${i + 1}`));

const rawPhoto = [
  { id: "p01", index: "01", title: "Electric Midnight", date: "2024", category: "Editorial", description: "Tokyo's neon subcultures captured on 35mm, available light only.", aspect: "aspect-[4/5]", span: "md:col-span-2 md:row-span-2", gallery: 8 },
  { id: "p02", index: "02", title: "Concrete Silence", date: "2024", category: "Architecture", description: "A study of brutalist geometry across post-war Berlin.", aspect: "aspect-[3/4]", gallery: 7 },
  { id: "p03", index: "03", title: "Dune Resonance", date: "2023", category: "Landscape", description: "Long shadows and sand in the Iranian Lut desert.", aspect: "aspect-[16/10]", span: "md:col-span-2", gallery: 6 },
  { id: "p04", index: "04", title: "Bone & Linen", date: "2023", category: "Fashion", description: "A whisper-soft editorial for an independent maison.", aspect: "aspect-[4/5]", gallery: 9 },
  { id: "p05", index: "05", title: "Salt Hours", date: "2023", category: "Documentary", description: "Mediterranean salt harvesters at first light.", aspect: "aspect-[3/4]", gallery: 8 },
  { id: "p06", index: "06", title: "Velvet Static", date: "2023", category: "Portrait", description: "Studio portraits lit with a single tungsten source.", aspect: "aspect-[1/1]", gallery: 6 },
  { id: "p07", index: "07", title: "After the Rain", date: "2022", category: "Street", description: "Reflections of a city rebuilding itself after the storm.", aspect: "aspect-[4/5]", gallery: 7 },
  { id: "p08", index: "08", title: "North Wind", date: "2022", category: "Landscape", description: "Iceland in February: ice fields, basalt, white silence.", aspect: "aspect-[16/10]", span: "md:col-span-2", gallery: 10 },
  { id: "p09", index: "09", title: "Crimson Hour", date: "2022", category: "Editorial", description: "A magazine cover story shot at magic hour in Lisbon.", aspect: "aspect-[3/4]", gallery: 8 },
  { id: "p10", index: "10", title: "Halogen Dreams", date: "2022", category: "Fashion", description: "A neo-noir capsule for an underground label.", aspect: "aspect-[4/5]", gallery: 9 },
  { id: "p11", index: "11", title: "Paper Cathedrals", date: "2021", category: "Architecture", description: "Origami-like facades along the Japanese coast.", aspect: "aspect-[1/1]", gallery: 6 },
  { id: "p12", index: "12", title: "Tea & Smoke", date: "2021", category: "Documentary", description: "A week with tea growers high in the Assam hills.", aspect: "aspect-[3/4]", gallery: 8 },
  { id: "p13", index: "13", title: "Glass Animals", date: "2021", category: "Portrait", description: "Identical twins photographed through fractured glass.", aspect: "aspect-[4/5]", gallery: 7 },
  { id: "p14", index: "14", title: "Saffron Trails", date: "2020", category: "Travel", description: "From Mashhad to Marrakech — a personal travel diary.", aspect: "aspect-[16/10]", span: "md:col-span-2", gallery: 10 },
  { id: "p15", index: "15", title: "Quiet Machines", date: "2020", category: "Industrial", description: "Factories at rest. The poetry of dormant machinery.", aspect: "aspect-[3/4]", gallery: 6 },
];

const rawVideo = [
  { id: "v01", index: "01", title: "Nocturnal Pulse", date: "2024", category: "Short Film", description: "A 7-minute neo-noir about a courier who outruns dawn.", gallery: 6 },
  { id: "v02", index: "02", title: "Atlas of Light", date: "2024", category: "Commercial", description: "A global watch campaign filmed across four continents.", gallery: 5 },
  { id: "v03", index: "03", title: "Reverie", date: "2024", category: "Music Video", description: "A dream-state visual for an indie electronic record.", gallery: 6 },
  { id: "v04", index: "04", title: "Field Notes", date: "2023", category: "Documentary", description: "Three farmers, three seasons, one disappearing valley.", gallery: 7 },
  { id: "v05", index: "05", title: "Carbon Bloom", date: "2023", category: "Commercial", description: "A spec spot for an EV manufacturer, shot anamorphic.", gallery: 5 },
  { id: "v06", index: "06", title: "Soft Riot", date: "2023", category: "Music Video", description: "Slow-motion choreography against industrial textures.", gallery: 6 },
  { id: "v07", index: "07", title: "House of Mirrors", date: "2022", category: "Short Film", description: "A fashion-led narrative piece staged in a single room.", gallery: 6 },
  { id: "v08", index: "08", title: "Drift Sequence", date: "2022", category: "Branded Doc", description: "Profile of a Tokyo drift driver and his rebuilt R32.", gallery: 7 },
  { id: "v09", index: "09", title: "Marble & Static", date: "2021", category: "Commercial", description: "Luxury fragrance campaign with practical light only.", gallery: 5 },
  { id: "v10", index: "10", title: "Slow Tide", date: "2021", category: "Short Film", description: "A wordless film about waiting, set at a coastal motel.", gallery: 6 },
];

export const photographyProjects = rawPhoto.map((p) => {
  const images = makeImages(p.id, p.gallery);
  return {
    ...p,
    kind: "photo",
    year: p.date,
    text: p.description,
    cover: images[0],
    images,
    seeds: Array.from({ length: p.gallery }, (_, i) => `${p.id}-${i + 1}`),
  };
});

export const videographyProjects = rawVideo.map((p, i) => {
  const images = makeImages(p.id, p.gallery);
  return {
    ...p,
    kind: "video",
    aspect: "aspect-video",
    year: p.date,
    text: p.description,
    cover: images[0],
    videoUrl: i % 2 === 0 ? SAMPLE_VIDEO_1 : SAMPLE_VIDEO_2,
    images,
    seeds: Array.from({ length: p.gallery }, (_, i) => `${p.id}-${i + 1}`),
  };
});

export const recentProjects = [
  photographyProjects[0],
  videographyProjects[0],
  photographyProjects[2],
  videographyProjects[1],
  photographyProjects[7],
  videographyProjects[2],
];

export const recentMediaProjects = [
  {
    id: "rm-01", index: "05", title: "Jumeirah Al Qasr", date: "2024", year: "2024",
    category: "Hospitality Film", kind: "mixed",
    description: "A mixed-media love letter to a coastal palace — drone plates, kitchen close-ups and twilight architecture.",
    text: "A mixed-media love letter to a coastal palace.",
    cover: photo("jumeirah-poster", 1600, 900),
    media: [
      { type: "video", src: SAMPLE_VIDEO_1, poster: photo("jumeirah-poster", 1600, 900) },
      { type: "image", src: photo("jumeirah-arch", 1200, 1500), alt: "Architecture" },
      { type: "image", src: photo("jumeirah-pool", 1200, 1500) },
      { type: "image", src: photo("jumeirah-detail", 1200, 1400) },
      { type: "image", src: photo("jumeirah-sea", 1400, 900) },
      { type: "image", src: photo("jumeirah-pasta", 1200, 1500) },
    ],
    images: [photo("jumeirah-arch"), photo("jumeirah-pool"), photo("jumeirah-detail"), photo("jumeirah-sea"), photo("jumeirah-pasta")],
  },
  {
    id: "rm-02", index: "06", title: "Abbas Visuals · Chef", date: "2024", year: "2024",
    category: "Brand Film", kind: "mixed",
    description: "A 59-second portrait of a Michelin chef — slow hands, fast knives, plated stillness.",
    text: "A 59-second portrait of a Michelin chef.",
    cover: photo("chef-poster", 1600, 900),
    media: [
      { type: "video", src: SAMPLE_VIDEO_2, poster: photo("chef-poster", 1600, 900) },
      { type: "image", src: photo("chef-portrait", 1200, 1500) },
      { type: "image", src: photo("chef-prep", 1200, 1500) },
      { type: "image", src: photo("chef-plate", 1200, 1500) },
      { type: "video", src: SAMPLE_VIDEO_1, poster: photo("chef-poster2", 1600, 900) },
      { type: "image", src: photo("chef-herbs", 1200, 1400) },
    ],
    images: [photo("chef-portrait"), photo("chef-prep"), photo("chef-plate"), photo("chef-herbs")],
  },
];

export const marketingCampaigns = [
  { id: "c01", index: "01", client: "Nokta", title: "Midnight Drop", date: "2024", cover: photo("campaign-nokta", 1600, 1000), text: "A 14-day teaser-to-launch sprint across Instagram, TikTok and OOH that sold out the capsule in 36 hours.", description: "A 14-day teaser-to-launch sprint across Instagram, TikTok and OOH that sold out the capsule in 36 hours.", seed: "campaign-nokta", tags: ["Paid Social", "Content", "OOH"], kpis: [{ value: "+312%", label: "Reach" }, { value: "1.2M", label: "Impressions" }, { value: "8.4×", label: "ROAS" }] },
  { id: "c02", index: "02", client: "Halcyon Hotels", title: "Slow Mornings", date: "2024", cover: photo("campaign-halcyon", 1600, 1000), text: "A year-long always-on content engine producing 80+ assets/month.", description: "A year-long always-on content engine producing 80+ assets/month with a single hero shoot per quarter.", seed: "campaign-halcyon", tags: ["Brand", "UGC", "Editorial"], kpis: [{ value: "+184%", label: "Bookings" }, { value: "640K", label: "Followers" }, { value: "5.1%", label: "Engagement" }] },
  { id: "c03", index: "03", client: "Kestrel Audio", title: "Frequencies", date: "2023", cover: photo("campaign-kestrel", 1600, 1000), text: "Product launch tying influencer seeding, performance ads and a kinetic film.", description: "Product launch tying influencer seeding, performance ads and a kinetic film into a single sound-led system.", seed: "campaign-kestrel", tags: ["Launch", "Influencer", "Film"], kpis: [{ value: "12M", label: "Video Views" }, { value: "+92%", label: "Pre-orders" }, { value: "0.74€", label: "CPM" }] },
  { id: "c04", index: "04", client: "Saint Cloud", title: "After Hours", date: "2023", cover: photo("campaign-saintcloud", 1600, 1000), text: "A community-driven editorial rollout that turned customers into the campaign.", description: "A community-driven editorial rollout that turned customers into the campaign — zero stock imagery used.", seed: "campaign-saintcloud", tags: ["Community", "Editorial", "Email"], kpis: [{ value: "+47%", label: "AOV" }, { value: "210K", label: "Subscribers" }, { value: "38%", label: "Open Rate" }] },
];

export const designProjects = [
  { id: "d01", index: "01", title: "Mono Identity", title1: "Mono", title2: "Identity", date: "2024", year: "2024", category: "Brand System", seed: "design-mono", cover: photo("design-mono", 1600, 1000), text: "A monochrome identity system built around a single typographic mark.", description: "A monochrome identity system built around a single typographic mark, scaled across print, packaging and motion." },
  { id: "d02", index: "02", title: "Helix Web", title1: "Helix", title2: "Web", date: "2024", year: "2024", category: "Website", seed: "design-helix", cover: photo("design-helix", 1600, 1000), text: "Editorial-led website for a biotech studio.", description: "Editorial-led website for a biotech studio — typography-first, with a kinetic homepage and a deep case-study layer." },
  { id: "d03", index: "03", title: "Phase OS", title1: "Phase", title2: "OS", date: "2023", year: "2023", category: "Product UI", seed: "design-phase", cover: photo("design-phase", 1600, 1000), text: "Design system and core UI for a music production OS.", description: "Design system and core UI for a music production OS. Dense, dark, keyboard-driven; built for flow." },
  { id: "d04", index: "04", title: "Verso Press", title1: "Verso", title2: "Press", date: "2023", year: "2023", category: "Editorial", seed: "design-verso", cover: photo("design-verso", 1600, 1000), text: "Independent press identity and a six-issue magazine series.", description: "Independent press identity and a six-issue magazine series. Hand-set covers, asymmetric grids, riso interiors." },
  { id: "d05", index: "05", title: "Atelier 9", title1: "Atelier", title2: "9", date: "2022", year: "2022", category: "Brand & Web", seed: "design-atelier", cover: photo("design-atelier", 1600, 1000), text: "Full rebrand and site for a Parisian fashion atelier.", description: "Full rebrand and site for a Parisian fashion atelier — quiet luxury, oversized type, no stock imagery." },
  { id: "d06", index: "06", title: "Ronin Co.", title1: "Ronin", title2: "Co.", date: "2022", year: "2022", category: "Identity", seed: "design-ronin", cover: photo("design-ronin", 1600, 1000), text: "Identity for a whisky importer.", description: "Identity for a whisky importer. A wordmark cut from a single brushstroke, paired with a stark editorial system." },
];

export const clients = [
  "Nokta", "Apex", "Loup", "Mercer & Sons", "Studio Ora", "Halcyon",
  "Northwind", "Atelier 9", "Verso", "Kestrel", "Ronin Co.", "Mono",
  "Phase", "Helix", "Saint Cloud",
];

// Legacy aliases (used by existing components)
export const photoProjects = photographyProjects;
export const videoProjects = videographyProjects;
