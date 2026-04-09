import Link from "next/link";
import {
  CollectionEntry,
  Project,
  collectionMeta,
  formatDate,
  getEntryHref,
} from "@/lib/site-content";
import { ProjectArtifactBucket } from "@/lib/generated-artifacts";
import { withBasePath } from "@/lib/site-config";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-4">
        <p className="eyebrow">{eyebrow}</p>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>

      {actionHref && actionLabel ? (
        <Link href={actionHref} className="button-secondary w-fit">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  detail,
  index = 0,
}: {
  label: string;
  value: string;
  detail: string;
  index?: number;
}) {
  return (
    <div
      className="section-card reveal rounded-[24px] p-5"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <p className="mono-label text-[var(--signal)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{detail}</p>
    </div>
  );
}

export function TagPill({ label }: { label: string }) {
  return <span className="signal-pill">{label}</span>;
}

export function ContentCard({
  entry,
  index = 0,
}: {
  entry: CollectionEntry;
  index?: number;
}) {
  const meta = collectionMeta[entry.section];

  return (
    <Link
      href={getEntryHref(entry)}
      className="section-card reveal group block h-full rounded-[28px] p-6 transition hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
          <span className="mono-label text-[var(--signal)]">{meta.label}</span>
          <span>{formatDate(entry.publishedAt)}</span>
          <span>{entry.readTime}</span>
        </div>

        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--ink)] transition group-hover:text-[var(--signal)]">
          {entry.title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{entry.excerpt}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>

        <div className="mt-auto pt-6 text-sm font-semibold text-[var(--copper)]">
          {entry.audience}
        </div>
      </div>
    </Link>
  );
}

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="section-card reveal group block h-full rounded-[30px] p-6 transition hover:-translate-y-1"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex h-full flex-col gap-5">
        <div className="space-y-3">
          <p className="eyebrow">{project.status}</p>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-[var(--ink)] transition group-hover:text-[var(--signal)]">
              {project.name}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{project.summary}</p>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-[var(--muted)]">
          {project.highlights.map((highlight) => (
            <p key={highlight}>{highlight}</p>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.hardware.map((item) => (
            <TagPill key={item} label={item} />
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ResourceBucketCard({
  bucket,
  index = 0,
}: {
  bucket: ProjectArtifactBucket;
  index?: number;
}) {
  return (
    <div
      className="section-card reveal rounded-[24px] p-5"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mono-label text-[var(--signal)]">{bucket.label}</p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            {bucket.description}
          </p>
        </div>
        <span className="signal-pill">
          {bucket.files.length > 0
            ? `${bucket.files.length} file${bucket.files.length === 1 ? "" : "s"}`
            : bucket.status}
        </span>
      </div>

      <p className="mt-4 break-all font-mono text-xs leading-6 text-[var(--blueprint)]">
        {withBasePath(bucket.publicPath)}
      </p>

      {bucket.files.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {bucket.files.map((file) => (
            <a
              key={file.relativePath}
              href={file.href}
              className="rounded-[18px] border border-[color:rgba(19,32,45,0.09)] bg-[rgba(255,255,255,0.45)] px-4 py-3 transition hover:border-[color:rgba(13,122,114,0.28)]"
            >
              <p className="font-semibold text-[var(--ink)]">{file.name}</p>
              <p className="mt-1 font-mono text-xs leading-6 text-[var(--blueprint)]">
                {file.relativePath}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">{file.sizeLabel}</p>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
          No files are published in this bucket yet. The sync workflow will create links here when the source repository pushes fresh artifacts.
        </p>
      )}
    </div>
  );
}