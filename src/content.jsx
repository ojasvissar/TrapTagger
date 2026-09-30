// Everything the page says lives here, so the components only handle layout and motion.

export const REPO = "https://github.com/ojasvissar/TrapTagger";
export const EMAIL = "ojasvissar4@gmail.com";
export const MAILTO = `mailto:${EMAIL}?subject=TrapTagger%20software%20engineer%20role`;
export const RESUME = "https://ojasvissar.tech/resume.html";

export const nav = [
  { href: "#fit", label: "Job ad" },
  { href: "#skills", label: "Skills" },
  { href: "#hours", label: "Time zones" },
];

// the section rail on the left edge, in page order
export const rail = [
  { id: "fit", label: "Job ad" },
  { id: "skills", label: "Skills" },
  { id: "air", label: "From the air" },
  { id: "hours", label: "Time zones" },
  { id: "why", label: "Why WildEye" },
  { id: "plan", label: "First 90 days" },
  { id: "contact", label: "Contact" },
];

export const checklist = [
  { title: "A degree in computer science or similar", text: "B.Tech in Computer Science & Engineering, Symbiosis Institute of Technology (2024)." },
  { title: "Strong Python", text: "My main language for over four years, used in every project on this page." },
  { title: "Cloud computing", text: "I've built serverless pipelines on AWS (Lambda, S3, EventBridge) and deploy models as live services." },
  {
    title: "React",
    text: <>I build front ends in React and in plain JavaScript. This page is a React app: <a href={REPO} target="_blank" rel="noopener">see the source on GitHub ↗</a></>,
  },
  { title: "Any experience level", text: "4+ years. I'm a data scientist at Vintality now, and I delivered 30+ freelance projects before that." },
  { title: "Strong English", text: "I studied in Canada and co-wrote a peer-reviewed paper published by Springer." },
  { title: "Machine learning, web apps, big data", bonus: true, text: "Image models (YOLO, CNNs, vision transformers), live web dashboards, and data pipelines with Spark and Snowflake." },
  { title: "A postgraduate degree", bonus: true, text: "Master of Data Science, University of British Columbia, with a perfect 4.0 GPA." },
];

export const skills = [
  {
    tag: "Image AI", img: "img/crop-1.webp",
    alt: "Diagram from my crop-yield project: satellite, weather and climate data feeding one forecast",
    title: "Teaching computers to see",
    text: "I train models that find and label things in pictures. Most recently I rebuilt a vision transformer that reads satellite images to forecast crop harvests.",
    tt: "Detecting animals and naming the species.",
    link: "https://github.com/ojasvissar/yield-forecasting-transformer", linkText: "See the project ↗",
  },
  {
    tag: "Cloud", img: "img/reddit-1.webp",
    alt: "Screenshot from my Reddit UBC Reporter project, a serverless AWS pipeline",
    title: "Pipelines that run themselves",
    text: "I built a four-step serverless pipeline on AWS Lambda that collects posts, sorts them with AI and emails a summary every week, with no servers to look after.",
    tt: "AWS Lambda brings in every upload.",
    link: "https://github.com/Vin-dictive/ubc-reddit-reporter", linkText: "See the project ↗",
  },
  {
    tag: "Web apps", img: "img/dd-1.webp",
    alt: "Screenshot of DisasterDash, a live dashboard with a map and charts",
    title: "Web apps people actually use",
    text: "DisasterDash is a live dashboard with a map, filters and a built-in AI assistant, tested automatically in a real browser.",
    tt: "A web app used by 200+ organisations.",
    link: "https://clr-saunders-dsci-532-2026-18-disasterdash-stable.share.connect.posit.cloud", linkText: "Try it live ↗",
  },
  {
    tag: "Big data", img: "img/ast-1.webp",
    alt: "Diagram from my asteroid hazard project showing orbits that cross Earth's path",
    title: "Finding the rare one",
    text: "I searched 958,524 asteroid records for the 0.2% that are dangerous, and caught 89% of them. It's the same problem as spotting a rare species among a million empty frames.",
    tt: "Millions of images, and few of them rare sightings.",
    link: "https://github.com/ojasvissar/asteroid-hazard-classification", linkText: "See the project ↗",
  },
];

// elephants in the aerial photo: x, y, w, h measured on a 700 × 466 preview
export const elephants = [[396, 180, 26, 28], [428, 255, 36, 26], [444, 278, 22, 34], [478, 298, 40, 26], [566, 332, 40, 24], [558, 350, 28, 32], [482, 420, 38, 26]];

export const perks = [
  { icon: "globe", title: "Help for the Americas", text: "Researchers in North and South America get support during their own working day." },
  { icon: "ship", title: "Safer updates", text: "My afternoon is night in Africa and Europe, when fewer people are using the site. That's a good time to ship changes." },
  { icon: "screen", title: "Remote already", text: "I work remotely at Vintality today, and my freelance clients were in Europe and India." },
  { icon: "plane", title: "In person when it counts", text: "I'm happy to fly to Johannesburg for onboarding and team meet-ups.", fly: true },
];

export const steps = [
  { when: "Weeks 1–2", title: "Learn the platform", text: "Set up my own copy of TrapTagger, follow one upload all the way through the system, and ship a few small fixes." },
  { when: "Month 1", title: "Take on the night shift", text: "Look after the platform while Johannesburg is offline, and write down how things work as I learn them." },
  { when: "Months 2–3", title: "Own a feature", text: "Build one feature you choose from start to finish, with real users testing it." },
];

export const contacts = [
  { label: "Email", value: EMAIL, href: MAILTO, main: true },
  { label: "Book a call", value: "Pick a 30-min slot ↗", href: "https://cal.com/ojasvissar/30min" },
  { label: "Résumé", value: "View on my site ↗", href: RESUME },
  { label: "LinkedIn", value: "in/ojasvissar ↗", href: "https://www.linkedin.com/in/ojasvissar/" },
  { label: "GitHub", value: "@ojasvissar ↗", href: "https://github.com/ojasvissar" },
  { label: "Portfolio", value: "ojasvissar.tech ↗", href: "https://ojasvissar.tech/" },
];

const BYSA3 = "https://creativecommons.org/licenses/by-sa/3.0/";
const BY2 = "https://creativecommons.org/licenses/by/2.0/";
export const credits = [
  { what: "camera-trap leopard", who: "MSGNP", lic: "CC BY-SA 3.0", url: BYSA3 },
  { what: "Okavango elephants", who: "diego_cue", lic: "CC BY-SA 3.0", url: BYSA3 },
  { what: "leopard at night, Madikwe", who: "flowcomm", lic: "CC BY 2.0", url: BY2 },
  { what: "leopard, South Luangwa", who: "I've Got It On Film!", lic: "CC BY 2.0", url: BY2 },
];
