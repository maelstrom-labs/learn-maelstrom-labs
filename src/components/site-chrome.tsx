import Link from "next/link";
import { artifactBuckets, navigation } from "@/lib/site-content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:rgba(19,32,45,0.08)] bg-[rgba(251,248,242,0.84)] backdrop-blur-xl">
      <div className="page-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex flex-col gap-1">
          <span className="mono-label text-[var(--signal)]">Learn Maelstrom Labs</span>
          <span className="max-w-xl text-sm text-[var(--muted)]">
            Static docs for electronics projects, tutorials, product notes, and release updates.
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--ink)]">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-transparent px-4 py-2 transition hover:border-[color:rgba(19,32,45,0.1)] hover:bg-[rgba(255,255,255,0.55)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[color:rgba(19,32,45,0.08)] bg-[rgba(255,250,243,0.75)]">
      <div className="page-shell grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="mono-label text-[var(--copper)]">Static now. Structured for later.</p>
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            This site is designed to publish fast on GitHub today and migrate cleanly into a Django plus React stack later.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Content is modeled separately from the page shell so project records, tutorials, product notes, and release updates can keep the same information architecture when a real backend arrives.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="section-card rounded-[28px] p-6">
            <p className="mono-label text-[var(--signal)]">Sections</p>
            <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="font-semibold text-[var(--ink)] transition hover:text-[var(--signal)]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="section-card rounded-[28px] p-6">
            <p className="mono-label text-[var(--signal)]">Artifact buckets</p>
            <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
              {artifactBuckets.map((bucket) => (
                <div key={bucket.slug}>
                  <p className="font-semibold text-[var(--ink)]">{bucket.label}</p>
                  <p>{bucket.examplePath}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}