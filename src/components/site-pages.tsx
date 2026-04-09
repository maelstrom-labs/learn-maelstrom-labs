import Link from "next/link";
import {
  getProjectArtifactBuckets,
  getProjectArtifactSync,
} from "@/lib/generated-artifacts";
import {
  CollectionEntry,
  CollectionKey,
  Project,
  collectionMeta,
  formatDate,
  formatDateTime,
  getCollectionEntries,
  getProjectContent,
  getRelatedEntries,
  getRelatedProjects,
} from "@/lib/site-content";
import {
  ContentCard,
  ProjectCard,
  ResourceBucketCard,
  SectionHeading,
  TagPill,
} from "@/components/site-sections";

export function CollectionIndexPage({ section }: { section: CollectionKey }) {
  const meta = collectionMeta[section];
  const entries = getCollectionEntries(section);
  const featuredEntry = entries[0];
  const remainingEntries = entries.slice(1);

  return (
    <main className="pb-24 pt-10 sm:pt-14">
      <section className="page-shell">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-6">
            <p className="eyebrow">{meta.eyebrow}</p>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
                {meta.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
                {meta.description}
              </p>
            </div>
          </div>

          <div className="section-card reveal rounded-[30px] p-6" style={{ animationDelay: "120ms" }}>
            <p className="mono-label text-[var(--signal)]">Section focus</p>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-[var(--muted)]">
              {meta.focus.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {featuredEntry ? (
        <section className="page-shell mt-14">
          <SectionHeading
            eyebrow="Featured entry"
            title={featuredEntry.title}
            description={featuredEntry.excerpt}
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <ContentCard entry={featuredEntry} />
            <div className="section-card reveal rounded-[30px] p-6" style={{ animationDelay: "160ms" }}>
              <p className="mono-label text-[var(--signal)]">Why it matters</p>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                {featuredEntry.sections[0]?.paragraphs[0]}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {featuredEntry.tags.map((tag) => (
                  <TagPill key={tag} label={tag} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {remainingEntries.length > 0 ? (
        <section className="page-shell mt-14">
          <SectionHeading
            eyebrow="Archive"
            title={`More from ${meta.label}`}
            description="Every page is generated at build time, so the section stays simple to host and easy to migrate later."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {remainingEntries.map((entry, index) => (
              <ContentCard key={entry.slug} entry={entry} index={index} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

export function CollectionEntryPage({ entry }: { entry: CollectionEntry }) {
  const meta = collectionMeta[entry.section];
  const relatedProjects = getRelatedProjects(entry);
  const relatedEntries = getRelatedEntries(entry);

  return (
    <main className="pb-24 pt-10 sm:pt-14">
      <section className="page-shell">
        <div className="max-w-4xl space-y-6">
          <Link href={`/${entry.section}`} className="eyebrow">
            Back to {meta.label}
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
              {entry.title}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
              {entry.excerpt}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <span>{formatDate(entry.publishedAt)}</span>
            <span>{entry.readTime}</span>
            <span>{entry.audience}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,0.9fr)] lg:items-start">
        <article className="grid gap-6">
          {entry.sections.map((section, index) => (
            <section
              key={section.title}
              className="section-card reveal rounded-[30px] p-7 sm:p-8"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="content-prose space-y-5">
                <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </article>

        <aside className="grid gap-6 lg:sticky lg:top-24">
          <div className="section-card reveal rounded-[28px] p-6" style={{ animationDelay: "120ms" }}>
            <p className="mono-label text-[var(--signal)]">Related projects</p>
            <div className="mt-5 grid gap-4">
              {relatedProjects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className="rounded-[22px] border border-[color:rgba(19,32,45,0.09)] bg-[rgba(255,255,255,0.45)] p-4 transition hover:border-[color:rgba(13,122,114,0.28)]">
                  <p className="font-semibold text-[var(--ink)]">{project.name}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{project.tagline}</p>
                </Link>
              ))}
            </div>
          </div>

          {relatedEntries.length > 0 ? (
            <div className="section-card reveal rounded-[28px] p-6" style={{ animationDelay: "180ms" }}>
              <p className="mono-label text-[var(--signal)]">Keep reading</p>
              <div className="mt-5 grid gap-4">
                {relatedEntries.map((relatedEntry) => (
                  <Link key={relatedEntry.slug} href={`/${relatedEntry.section}/${relatedEntry.slug}`} className="rounded-[22px] border border-[color:rgba(19,32,45,0.09)] bg-[rgba(255,255,255,0.45)] p-4 transition hover:border-[color:rgba(13,122,114,0.28)]">
                    <p className="font-semibold text-[var(--ink)]">{relatedEntry.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{relatedEntry.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

export function ProjectsIndexPage({ projects }: { projects: Project[] }) {
  return (
    <main className="pb-24 pt-10 sm:pt-14">
      <section className="page-shell">
        <SectionHeading
          eyebrow="Project library"
          title="Projects are the center of the site"
          description="Each project page collects the board story, generated artifacts, tutorials, and release notes so the documentation stays closer to the hardware."
        />
      </section>

      <section className="page-shell mt-10 grid gap-6 lg:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </section>
    </main>
  );
}

export function ProjectDetailPage({ project }: { project: Project }) {
  const relatedEntries = getProjectContent(project.slug, 6);
  const artifactBuckets = getProjectArtifactBuckets(
    project.slug,
    project.resourceBuckets,
  );
  const artifactSync = getProjectArtifactSync(project.slug);
  const sourceRepository = artifactSync?.sourceRepository ?? project.sourceRepository;
  const sourceRefName = artifactSync?.sourceRefName ?? project.sourceRefName;
  const sourceSha = artifactSync?.sourceSha ?? project.sourceSha;
  const syncedAt = artifactSync?.syncedAt ?? project.syncedAt;
  const sourceRepositoryUrl = sourceRepository
    ? `https://github.com/${sourceRepository}${sourceRefName ? `/tree/${sourceRefName}` : ""}`
    : undefined;

  return (
    <main className="pb-24 pt-10 sm:pt-14">
      <section className="page-shell">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-6">
            <Link href="/projects" className="eyebrow">
              Back to projects
            </Link>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
                {project.name}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
                {project.tagline}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.hardware.map((item) => (
                <TagPill key={item} label={item} />
              ))}
            </div>
          </div>

          <div className="section-card reveal rounded-[30px] p-6" style={{ animationDelay: "140ms" }}>
            <p className="mono-label text-[var(--signal)]">Project status</p>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-[var(--ink)]">
              {project.status}
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{project.lead}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <TagPill key={skill} label={skill} />
              ))}
            </div>

            {sourceRepository ? (
              <div className="mt-6 rounded-[24px] border border-[color:rgba(19,32,45,0.09)] bg-[rgba(255,255,255,0.45)] p-4 text-sm leading-7 text-[var(--muted)]">
                <p className="mono-label text-[var(--signal)]">Source sync</p>
                <p className="mt-3">
                  Synced from{" "}
                  <a
                    href={sourceRepositoryUrl}
                    className="font-semibold text-[var(--blueprint)]"
                  >
                    {sourceRepository}
                  </a>
                </p>
                {sourceSha ? <p>Commit: {sourceSha.slice(0, 12)}</p> : null}
                {syncedAt ? <p>Last sync: {formatDateTime(syncedAt)}</p> : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="page-shell mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-start">
        <div className="grid gap-6">
          <div className="section-card reveal rounded-[30px] p-7 sm:p-8" style={{ animationDelay: "80ms" }}>
            <div className="content-prose space-y-5">
              <h2 className="text-2xl font-semibold tracking-tight">Project overview</h2>
              {project.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="section-card reveal rounded-[30px] p-7 sm:p-8" style={{ animationDelay: "140ms" }}>
            <div className="content-prose space-y-5">
              <h2 className="text-2xl font-semibold tracking-tight">Why this structure works</h2>
              <ul>
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="section-card reveal rounded-[30px] p-7" style={{ animationDelay: "200ms" }}>
          <p className="mono-label text-[var(--signal)]">Generated file buckets</p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Another repository can publish generated board files into these paths without requiring route changes in the frontend. When files are present, they appear here automatically at build time.
          </p>
          <div className="mt-6 grid gap-4">
            {artifactBuckets.map((bucket, index) => (
              <ResourceBucketCard key={bucket.slug} bucket={bucket} index={index} />
            ))}
          </div>
        </div>
      </section>

      {relatedEntries.length > 0 ? (
        <section className="page-shell mt-14">
          <SectionHeading
            eyebrow="Connected content"
            title={`Documentation linked to ${project.name}`}
            description="Project pages are most useful when the related tutorials, reference pages, blog notes, and news updates stay attached to the same slug."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedEntries.map((entry, index) => (
              <ContentCard key={entry.slug} entry={entry} index={index} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}