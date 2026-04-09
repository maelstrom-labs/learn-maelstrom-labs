import ingestedProjectRegistry from "@/data/ingested-projects.json";

export type CollectionKey = "tutorials" | "blog" | "news" | "products";

export interface SectionBlock {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ResourceBucket {
  slug: string;
  label: string;
  description: string;
  publicPath: string;
  status: "pipeline" | "ready";
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  status: string;
  lead: string;
  featured: boolean;
  hardware: string[];
  skills: string[];
  overview: string[];
  highlights: string[];
  resourceBuckets: ResourceBucket[];
  sourceRepository?: string;
  sourceRefName?: string;
  sourceSha?: string;
  syncedAt?: string;
}

export interface CollectionEntry {
  slug: string;
  section: CollectionKey;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  audience: string;
  featured?: boolean;
  tags: string[];
  relatedProjectSlugs: string[];
  sections: SectionBlock[];
}

export interface CollectionMeta {
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  focus: string[];
}

const artifactBucketBlueprint = [
  {
    slug: "board-dimensions",
    label: "Board dimensions",
    description: "Mechanical exports, keep-outs, and enclosure references.",
  },
  {
    slug: "code",
    label: "Code",
    description: "Firmware releases, examples, and support scripts.",
  },
  {
    slug: "data-sheets",
    label: "Data sheets",
    description: "Vendor documents mirrored with the dash-separated naming used upstream.",
  },
  {
    slug: "datasheets",
    label: "Datasheets",
    description: "Compatibility bucket for generated exports that omit the dash.",
  },
  {
    slug: "schematics",
    label: "Schematics",
    description: "Rendered PDFs, source snapshots, and revision notes.",
  },
] as const;

interface IngestedProjectRecord {
  slug: string;
  name: string;
  tagline?: string;
  summary: string;
  status?: string;
  lead?: string;
  hardware?: string[];
  skills?: string[];
  overview?: string[];
  highlights?: string[];
  sourceRepository?: string;
  sourceRefName?: string;
  sourceSha?: string;
  syncedAt?: string;
}

interface IngestedProjectRegistry {
  projects: IngestedProjectRecord[];
}

function createResourceBuckets(projectSlug: string): ResourceBucket[] {
  return artifactBucketBlueprint.map((bucket) => ({
    ...bucket,
    publicPath: `/generated/${projectSlug}/${bucket.slug}/`,
    status: "pipeline",
  }));
}

const editorialProjects: Project[] = [
  {
    slug: "portable-power-monitor",
    name: "Portable Power Monitor",
    tagline: "USB-C instrumentation for bring-up benches and field kits.",
    summary:
      "A compact board that captures rail behavior, battery discharge, and inrush current without needing the entire lab bench.",
    status: "Rev B bring-up",
    lead: "Document every power anomaly where the hardware team can actually find it.",
    featured: true,
    hardware: ["USB-C PD", "INA228", "RP2040", "KiCad 8"],
    skills: ["bring-up", "firmware logging", "fixture design"],
    overview: [
      "The Portable Power Monitor exists because too many power investigations vanish into chat logs and scattered screenshots. This project page is meant to gather the board story, the debug process, and the generated hardware artifacts in one place.",
      "Every revision should leave a paper trail: what changed, why it changed, and which files a future engineer should trust during manufacturing, assembly, and test.",
    ],
    highlights: [
      "Captures voltage, current, and accumulated energy during field tests.",
      "Pairs firmware drops with schematics and board outlines in predictable folders.",
      "Makes tutorial and blog content discoverable from the project itself.",
    ],
    resourceBuckets: createResourceBuckets("portable-power-monitor"),
  },
  {
    slug: "enviro-beacon-node",
    name: "Enviro Beacon Node",
    tagline: "A low-power environmental node for long-running field deployments.",
    summary:
      "A sensor board focused on low-power logging, enclosure fit checks, and stable radio behavior across revisions.",
    status: "Mechanical validation",
    lead: "The project page should feel like the bench notebook for the entire build.",
    featured: true,
    hardware: ["nRF52", "BME688", "LiPo", "KiCad 8"],
    skills: ["low-power design", "RF layout", "enclosure iteration"],
    overview: [
      "The Enviro Beacon Node is the kind of project that generates a lot of tiny but important documentation: battery assumptions, antenna clearances, cable orientations, and field deployment notes.",
      "Keeping those notes in a static site means the team can publish immediately on GitHub now, then move the same content model into Django and React later without rewriting the information architecture.",
    ],
    highlights: [
      "Tracks enclosure, antenna, and battery fit decisions across revisions.",
      "Reserves generated folders for diagrams, code, schematics, and vendor PDFs.",
      "Acts as the anchor point for tutorials, product notes, and news posts.",
    ],
    resourceBuckets: createResourceBuckets("enviro-beacon-node"),
  },
];

function createIngestedProject(record: IngestedProjectRecord): Project {
  return {
    slug: record.slug,
    name: record.name,
    tagline:
      record.tagline ??
      "Generated hardware artifacts synced from the source repository.",
    summary: record.summary,
    status: record.status ?? "Documentation synced",
    lead:
      record.lead ??
      "This project record is maintained by the artifact ingestion workflow.",
    featured: false,
    hardware: record.hardware ?? [],
    skills: record.skills ?? [],
    overview:
      record.overview ??
      [
        `${record.name} is mirrored into this site from its source hardware repository so files and learning content can share the same public home.`,
        "As more editorial content is added, tutorials, product notes, and release posts can point back to this project slug without changing the ingestion workflow.",
      ],
    highlights:
      record.highlights ??
      [
        "Generated artifacts are synced automatically from the source repo.",
        "Project pages expose stable file buckets for schematics, code, and vendor references.",
        "The same project slug can later move into a Django-backed content system.",
      ],
    resourceBuckets: createResourceBuckets(record.slug),
    sourceRepository: record.sourceRepository,
    sourceRefName: record.sourceRefName,
    sourceSha: record.sourceSha,
    syncedAt: record.syncedAt,
  };
}

function getIngestedProjects(): Project[] {
  const registry = ingestedProjectRegistry as IngestedProjectRegistry;

  return registry.projects.map(createIngestedProject);
}

export const projects: Project[] = [...editorialProjects, ...getIngestedProjects()]
  .filter(
    (project, index, allProjects) =>
      allProjects.findIndex((candidate) => candidate.slug === project.slug) === index,
  )
  .sort((left, right) => {
    if (left.featured !== right.featured) {
      return left.featured ? -1 : 1;
    }

    return left.name.localeCompare(right.name);
  });

export const collectionMeta: Record<CollectionKey, CollectionMeta> = {
  tutorials: {
    label: "Tutorials",
    eyebrow: "Step-by-step hardware guides",
    title: "Tutorials and lab procedures",
    description:
      "Practical guides for board bring-up, publishing artifacts, and building repeatable engineering workflows.",
    actionLabel: "Browse tutorials",
    focus: [
      "Board bring-up checklists",
      "Documentation pipeline setup",
      "Repeatable test and release habits",
    ],
  },
  blog: {
    label: "Blog",
    eyebrow: "Lab notes and engineering essays",
    title: "Blog posts from the workbench",
    description:
      "Narrative write-ups about design decisions, revision lessons, and the tradeoffs behind each hardware project.",
    actionLabel: "Read the blog",
    focus: [
      "Revision retrospectives",
      "Process improvements",
      "Lessons from failed assumptions",
    ],
  },
  news: {
    label: "News",
    eyebrow: "Shipping signals",
    title: "News and release updates",
    description:
      "Short announcements covering site changes, artifact pipeline milestones, and hardware release checkpoints.",
    actionLabel: "See news updates",
    focus: [
      "Release snapshots",
      "Publishing milestones",
      "Project status updates",
    ],
  },
  products: {
    label: "Products",
    eyebrow: "Documentation-first product notes",
    title: "Product information and support docs",
    description:
      "Reference pages that explain what a board is for, how it fits into a project, and where its supporting files live.",
    actionLabel: "Review product pages",
    focus: [
      "What the board does",
      "How it should be used",
      "Where the generated support files land",
    ],
  },
};

const collections: Record<CollectionKey, CollectionEntry[]> = {
  tutorials: [
    {
      slug: "repeatable-board-bring-up",
      section: "tutorials",
      title: "A repeatable bring-up checklist for fresh PCBs",
      excerpt:
        "Turn first power-on into a documented process instead of a one-off scramble with loose bench notes.",
      publishedAt: "2026-04-08",
      readTime: "9 min read",
      audience: "Hardware engineers",
      featured: true,
      tags: ["bring-up", "pcb", "test workflow"],
      relatedProjectSlugs: ["portable-power-monitor", "enviro-beacon-node"],
      sections: [
        {
          title: "Start with inspection before power",
          paragraphs: [
            "A good bring-up document begins before the power supply turns on. Record reference photos, note any rework, and confirm the assembled board matches the intended bill of materials.",
            "That small upfront discipline prevents later confusion when someone tries to compare measurements against a board that quietly received bodge wires or substitute parts.",
          ],
          bullets: [
            "Photograph both sides of the board.",
            "Capture the assembly revision and any hand modifications.",
            "Write down expected input rails and current limits before testing.",
          ],
        },
        {
          title: "Sequence the first power events",
          paragraphs: [
            "Bring-up should read like a deterministic script: current-limited supply, rail checks, clock verification, programming attempt, then peripheral validation.",
            "If the sequence lives in the tutorial site, new engineers can follow it and leave behind comparable measurements instead of improvising from memory.",
          ],
          bullets: [
            "Power the board with a conservative current limit.",
            "Measure each major rail before loading firmware.",
            "Log every unexpected thermal or current event in the project page.",
          ],
        },
        {
          title: "Publish the result, not just the success",
          paragraphs: [
            "The point of a bring-up tutorial is not to celebrate a passing board. It is to preserve evidence, especially when something fails halfway through the sequence.",
            "Capture failures, fixes, and next actions on the same static site so later revisions inherit the process instead of relearning it.",
          ],
        },
      ],
    },
    {
      slug: "publishing-generated-hardware-files",
      section: "tutorials",
      title: "Publishing generated hardware files into the docs site",
      excerpt:
        "Set up a simple convention so another repository can push schematics, code, and dimension exports without changing the frontend.",
      publishedAt: "2026-04-06",
      readTime: "7 min read",
      audience: "Maintainers",
      featured: true,
      tags: ["github actions", "artifacts", "docs pipeline"],
      relatedProjectSlugs: ["portable-power-monitor"],
      sections: [
        {
          title: "Use stable folder names",
          paragraphs: [
            "The frontend should not need to know how KiCad, firmware, or PDF generation works. It only needs predictable folders that will exist for each project slug.",
            "This starter keeps those folders under public/generated/<project-slug>/ so GitHub Pages can serve them directly after the static export is built.",
          ],
        },
        {
          title: "Let automation own the files",
          paragraphs: [
            "Treat the documentation app as the presentation layer. Another repository or workflow should be free to publish fresh files into the generated folders without touching React components or route code.",
            "That separation is what will make the eventual move to Django easier too, because the content structure stays stable while the backing system changes.",
          ],
          bullets: [
            "board-dimensions for mechanical exports",
            "code for firmware bundles and examples",
            "data-sheets and datasheets for vendor PDFs",
            "schematics for rendered diagrams and source snapshots",
          ],
        },
        {
          title: "Link from project pages first",
          paragraphs: [
            "Project pages are the best place to expose generated files because that is where an engineer already expects to find the latest board context.",
            "From there, tutorials, news posts, and product pages can reference the same project instead of duplicating download logic everywhere.",
          ],
        },
      ],
    },
  ],
  blog: [
    {
      slug: "why-every-board-needs-a-logbook",
      section: "blog",
      title: "Why every board revision needs a permanent logbook",
      excerpt:
        "A project without a durable record becomes impossible to debug six months later, especially once the revision names start to blur together.",
      publishedAt: "2026-04-05",
      readTime: "6 min read",
      audience: "Cross-functional teams",
      featured: true,
      tags: ["documentation", "process", "hardware teams"],
      relatedProjectSlugs: ["enviro-beacon-node"],
      sections: [
        {
          title: "Revision labels are not enough",
          paragraphs: [
            "Knowing that a board is Rev B tells you almost nothing by itself. The real information is the change list, the reason for the change, and the test result that justified shipping it.",
            "A blog post can capture the story around the revision while the project page and product page hold the more durable reference information.",
          ],
        },
        {
          title: "Narrative context matters",
          paragraphs: [
            "Tutorials tell people what to do. Blog posts explain why the team changed direction, what tradeoffs were accepted, and what surprised everyone during test.",
            "That narrative layer turns a documentation site into something closer to a lab notebook than a marketing shell.",
          ],
        },
        {
          title: "The archive should stay easy to host",
          paragraphs: [
            "Keeping the first version static is a pragmatic choice. It lets the team publish now on GitHub while preserving an information model that can later move behind Django without breaking the user-facing structure.",
          ],
        },
      ],
    },
    {
      slug: "what-rev-b-actually-fixed",
      section: "blog",
      title: "What Rev B actually fixed on the Portable Power Monitor",
      excerpt:
        "A revision summary should say more than improved stability. It should explain which assumptions failed and what was changed to remove the risk.",
      publishedAt: "2026-04-03",
      readTime: "5 min read",
      audience: "Engineers and maintainers",
      tags: ["revision", "power", "retrospective"],
      relatedProjectSlugs: ["portable-power-monitor"],
      sections: [
        {
          title: "The issue was measurement trust",
          paragraphs: [
            "Rev A could gather data, but the workflow around that data was too fragile. Test captures lived in separate places and there was no dependable landing zone for the supporting files.",
            "Rev B is as much about documentation plumbing as it is about electronics.",
          ],
        },
        {
          title: "Hardware and docs changed together",
          paragraphs: [
            "The board update improved connector robustness and rail visibility, while the site structure now gives those changes a clear home: product note, project summary, and artifact folders attached to the same slug.",
          ],
        },
        {
          title: "The lesson is repeatability",
          paragraphs: [
            "If a future engineer cannot retrace the reasoning from revision note to schematic to firmware tag, the project is still under-documented. The site rebuild is meant to remove that gap.",
          ],
        },
      ],
    },
  ],
  news: [
    {
      slug: "site-rebuild-static-first",
      section: "news",
      title: "Documentation site rebuild starts with a static-first release",
      excerpt:
        "The new site structure is live as a static export so content can ship immediately on GitHub while the long-term Django plan takes shape.",
      publishedAt: "2026-04-09",
      readTime: "3 min read",
      audience: "Visitors",
      featured: true,
      tags: ["site", "release", "static export"],
      relatedProjectSlugs: ["portable-power-monitor", "enviro-beacon-node"],
      sections: [
        {
          title: "Static now, service-backed later",
          paragraphs: [
            "The immediate goal is to create a stable public home for project learning. Static export meets that requirement with almost no hosting cost and no operational overhead.",
            "The codebase is structured so the content model can later move behind Django and a richer React frontend without changing the user-facing taxonomy.",
          ],
        },
        {
          title: "The homepage is project-centered",
          paragraphs: [
            "Instead of acting like a generic company blog, the new homepage organizes content around project pages, then fans out into tutorials, products, blog posts, and release updates.",
          ],
        },
      ],
    },
    {
      slug: "generated-artifact-folders-ready",
      section: "news",
      title: "Generated artifact folders are reserved for automation",
      excerpt:
        "Project pages now expose stable target paths for schematics, firmware bundles, and mechanical exports published by other repositories.",
      publishedAt: "2026-04-07",
      readTime: "4 min read",
      audience: "Maintainers",
      tags: ["automation", "github actions", "artifacts"],
      relatedProjectSlugs: ["portable-power-monitor"],
      sections: [
        {
          title: "The convention is now explicit",
          paragraphs: [
            "Each project page publishes the expected folder targets for board-dimensions, code, data-sheets, datasheets, and schematics.",
            "That makes it straightforward for another repository to push outputs into the docs site during a release workflow.",
          ],
        },
        {
          title: "No frontend rewrite required",
          paragraphs: [
            "Because the paths are part of the project model, adding real files later does not require new routes or hand-edited pages. The site just starts serving the generated content as soon as it lands in public/generated.",
          ],
        },
      ],
    },
  ],
  products: [
    {
      slug: "portable-power-monitor-kit",
      section: "products",
      title: "Portable Power Monitor kit overview",
      excerpt:
        "Reference page for what the board does, where it fits into the workflow, and which generated artifacts should accompany each release.",
      publishedAt: "2026-04-04",
      readTime: "5 min read",
      audience: "Customers and builders",
      featured: true,
      tags: ["product", "reference", "support"],
      relatedProjectSlugs: ["portable-power-monitor"],
      sections: [
        {
          title: "Purpose",
          paragraphs: [
            "This board exists to make electrical behavior visible during development and field validation. It is most useful when paired with good release notes and a clear set of supporting artifacts.",
          ],
        },
        {
          title: "Support expectations",
          paragraphs: [
            "A product page should immediately tell a visitor where to find schematics, firmware, dimensions, and vendor data. The site rebuild is opinionated about that because support quality depends on it.",
          ],
          bullets: [
            "Link to the parent project page.",
            "Expose stable paths for generated files.",
            "Keep revision notes discoverable from the same section.",
          ],
        },
        {
          title: "Documentation style",
          paragraphs: [
            "The goal is closer to Adafruit and SparkFun docs than a polished launch page. The content should teach, not just describe.",
          ],
        },
      ],
    },
    {
      slug: "enviro-beacon-dev-kit",
      section: "products",
      title: "Enviro Beacon development kit",
      excerpt:
        "Reference information for the low-power field node, including the project context and the file buckets that future automation will fill.",
      publishedAt: "2026-04-02",
      readTime: "4 min read",
      audience: "Developers",
      tags: ["product", "sensor node", "reference"],
      relatedProjectSlugs: ["enviro-beacon-node"],
      sections: [
        {
          title: "Designed for long-lived field deployments",
          paragraphs: [
            "The kit page is not only about the board itself. It should explain deployment assumptions, enclosure concerns, power budgets, and the supporting files that make the board usable in six months, not just today.",
          ],
        },
        {
          title: "Project-linked documentation",
          paragraphs: [
            "Product information is strongest when it points back to a living project page. That is where tutorials, blog notes, and release news can stay connected to the physical hardware.",
          ],
        },
      ],
    },
  ],
};

function sortByDateDescending(entries: CollectionEntry[]): CollectionEntry[] {
  return [...entries].sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
}

export const navigation = [
  { href: "/projects", label: "Projects" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
] as const;

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

export function getCollectionEntries(section: CollectionKey): CollectionEntry[] {
  return sortByDateDescending(collections[section]);
}

export function getAllEntries(): CollectionEntry[] {
  return sortByDateDescending(
    (Object.values(collections) as CollectionEntry[][]).flat(),
  );
}

export function getFeaturedEntries(limit = 4): CollectionEntry[] {
  return getAllEntries()
    .filter((entry) => entry.featured)
    .slice(0, limit);
}

export function getEntryBySlug(
  section: CollectionKey,
  slug: string,
): CollectionEntry | undefined {
  return collections[section].find((entry) => entry.slug === slug);
}

export function getEntryHref(entry: CollectionEntry): string {
  return `/${entry.section}/${entry.slug}`;
}

export function getProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(entry: CollectionEntry): Project[] {
  return projects.filter((project) =>
    entry.relatedProjectSlugs.includes(project.slug),
  );
}

export function getProjectContent(projectSlug: string, limit = 4): CollectionEntry[] {
  return getAllEntries()
    .filter((entry) => entry.relatedProjectSlugs.includes(projectSlug))
    .slice(0, limit);
}

export function getRelatedEntries(
  currentEntry: CollectionEntry,
  limit = 3,
): CollectionEntry[] {
  return getAllEntries()
    .filter((entry) => entry.slug !== currentEntry.slug)
    .filter(
      (entry) =>
        entry.section === currentEntry.section ||
        entry.relatedProjectSlugs.some((slug) =>
          currentEntry.relatedProjectSlugs.includes(slug),
        ) ||
        entry.tags.some((tag) => currentEntry.tags.includes(tag)),
    )
    .slice(0, limit);
}

export const artifactBuckets = artifactBucketBlueprint.map((bucket) => ({
  ...bucket,
  examplePath: `public/generated/<project-slug>/${bucket.slug}/`,
}));