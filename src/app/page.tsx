import Link from "next/link";
import {
  artifactBuckets,
  collectionMeta,
  getCollectionEntries,
  getFeaturedEntries,
  getProjects,
} from "@/lib/site-content";
import {
  ContentCard,
  ProjectCard,
  SectionHeading,
  StatCard,
} from "@/components/site-sections";

const sectionOrder = ["tutorials", "products", "blog", "news"] as const;

export default function Home() {
  const projects = getProjects();
  const featuredEntries = getFeaturedEntries(4);
  const newsEntries = getCollectionEntries("news").slice(0, 2);

  return (
    <main className="pb-24 pt-10 sm:pt-14">
      <section className="page-shell">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-7">
            <p className="eyebrow">Documentation-first electronics publishing</p>
            <div className="space-y-5">
              <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-[var(--ink)] sm:text-6xl xl:text-7xl">
                Build a hardware learning site that feels like a lab notebook, not a placeholder homepage.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                This rebuild turns the app into a static documentation hub for tutorials, blogs, product information, news, and project records. It exports cleanly for GitHub hosting now and keeps the content model portable for a future Django plus React stack.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/projects" className="button-primary">
                Explore projects
              </Link>
              <Link href="/tutorials" className="button-secondary">
                Start with tutorials
              </Link>
            </div>
          </div>

          <div className="section-card reveal rounded-[34px] p-6 sm:p-8" style={{ animationDelay: "140ms" }}>
            <div className="space-y-6">
              <div>
                <p className="mono-label text-[var(--signal)]">Publishing blueprint</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">
                  One site, four content streams, and project-linked artifacts.
                </h2>
              </div>

              <div className="grid gap-4 text-sm leading-7 text-[var(--muted)]">
                <p>
                  Projects act as the anchor pages. Tutorials teach the workflows, product pages explain the hardware, blog posts capture lessons, and news records release moments.
                </p>
                <div className="rounded-[24px] border border-[color:rgba(19,32,45,0.1)] bg-[rgba(255,255,255,0.46)] p-4 font-mono text-xs leading-6 text-[var(--blueprint)]">
                  public/generated/&lt;project-slug&gt;/
                  <br />
                  board-dimensions/
                  <br />
                  code/
                  <br />
                  data-sheets/
                  <br />
                  datasheets/
                  <br />
                  schematics/
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Projects"
          value={String(projects.length)}
          detail="Project pages keep generated files, tutorials, and release notes tied to the same hardware slug."
        />
        <StatCard
          label="Content types"
          value="4"
          detail="Tutorials, products, blog posts, and news pages are all generated from the same content model."
          index={1}
        />
        <StatCard
          label="Hosting model"
          value="Static"
          detail="Next.js exports a plain site for GitHub hosting, so there is no backend cost or runtime dependency today."
          index={2}
        />
        <StatCard
          label="Artifact buckets"
          value={String(artifactBuckets.length)}
          detail="Generated files can land in predictable folders without changing the route structure."
          index={3}
        />
      </section>

      <section className="page-shell mt-20">
        <SectionHeading
          eyebrow="Project-centered structure"
          title="Each hardware effort gets a permanent home"
          description="Project pages are the connective tissue between generated assets and the editorial content that teaches people how the hardware works."
          actionHref="/projects"
          actionLabel="View all projects"
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      <section className="page-shell mt-20">
        <SectionHeading
          eyebrow="Content streams"
          title="The site is organized like a teaching platform"
          description="This layout borrows the best parts of hardware education sites: browsable sections, practical content, and strong links back to the project that generated the knowledge."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {sectionOrder.map((section, index) => {
            const meta = collectionMeta[section];
            const entries = getCollectionEntries(section);

            return (
              <Link
                key={section}
                href={`/${section}`}
                className="section-card reveal block rounded-[28px] p-6 transition hover:-translate-y-1"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <p className="mono-label text-[var(--signal)]">{meta.label}</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                  {meta.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  {meta.description}
                </p>
                <p className="mt-6 text-sm font-semibold text-[var(--copper)]">
                  {entries.length} starter pages
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-shell mt-20">
        <SectionHeading
          eyebrow="Featured content"
          title="Start with the pages that define the workflow"
          description="These entries establish the tone of the site: teach the process, expose the supporting files, and keep the project context nearby."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredEntries.map((entry, index) => (
            <ContentCard key={entry.slug} entry={entry} index={index} />
          ))}
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="section-card rounded-[34px] p-7 sm:p-8">
          <SectionHeading
            eyebrow="Automation handoff"
            title="Reserve the artifact paths now so other repositories can publish into them later"
            description="The frontend already knows the bucket names. A GitHub Actions workflow in another repository only needs to copy generated files into the matching project slug."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {artifactBuckets.map((bucket) => (
              <div
                key={bucket.slug}
                className="rounded-[24px] border border-[color:rgba(19,32,45,0.09)] bg-[rgba(255,255,255,0.45)] p-5"
              >
                <p className="mono-label text-[var(--signal)]">{bucket.label}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {bucket.description}
                </p>
                <p className="mt-4 font-mono text-xs leading-6 text-[var(--blueprint)]">
                  {bucket.examplePath}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell mt-20 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="section-card reveal rounded-[32px] p-7 sm:p-8" style={{ animationDelay: "140ms" }}>
          <p className="mono-label text-[var(--signal)]">Why static first works</p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
            <p>
              You asked for a site that feels closer to Adafruit Learn or SparkFun documentation than a blank app shell. The right first step is a static structure with strong content types and zero backend complexity.
            </p>
            <p>
              When you are ready for Django, the presentation layer can change without rethinking the taxonomy: projects stay projects, tutorials stay tutorials, and generated artifacts still belong to the same project slugs.
            </p>
          </div>
        </div>

        <div className="section-card reveal rounded-[32px] p-7 sm:p-8" style={{ animationDelay: "220ms" }}>
          <p className="mono-label text-[var(--signal)]">Latest news</p>
          <div className="mt-5 grid gap-4">
            {newsEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/news/${entry.slug}`}
                className="rounded-[22px] border border-[color:rgba(19,32,45,0.09)] bg-[rgba(255,255,255,0.45)] p-4 transition hover:border-[color:rgba(13,122,114,0.28)]"
              >
                <p className="font-semibold text-[var(--ink)]">{entry.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{entry.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
