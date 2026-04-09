import fs from "node:fs";
import path from "node:path";

const defaultBuckets = [
  { slug: "board-dimensions", path: "board-dimensions" },
  { slug: "code", path: "code" },
  { slug: "data-sheets", path: "data-sheets" },
  { slug: "datasheets", path: "datasheets" },
  { slug: "schematics", path: "schematics" },
];

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[index + 1];
    parsed[key] = value;
    index += 1;
  }

  return parsed;
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function copyDirectoryContents(sourceDirectory, targetDirectory) {
  if (!fs.existsSync(sourceDirectory)) {
    return [];
  }

  ensureDirectory(targetDirectory);

  const copiedFiles = [];

  for (const entry of fs.readdirSync(sourceDirectory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const sourcePath = path.join(sourceDirectory, entry.name);
    const targetPath = path.join(targetDirectory, entry.name);

    if (entry.isDirectory()) {
      copiedFiles.push(...copyDirectoryContents(sourcePath, targetPath));
      continue;
    }

    ensureDirectory(path.dirname(targetPath));
    fs.copyFileSync(sourcePath, targetPath);
    copiedFiles.push(targetPath);
  }

  return copiedFiles;
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function uniqueSorted(values = []) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

const args = parseArgs(process.argv.slice(2));
const sourceRoot = path.resolve(args["source-root"] ?? process.cwd());
const targetRoot = path.resolve(args["target-root"] ?? process.cwd());
const manifestPath = path.resolve(
  sourceRoot,
  args["manifest-path"] ?? "learn-manifest.json",
);

if (!fs.existsSync(manifestPath)) {
  throw new Error(`Missing manifest file: ${manifestPath}`);
}

const manifest = readJsonFile(manifestPath);
const project = manifest.project ?? {};
const artifacts = manifest.artifacts ?? {};
const projectSlug = args["project-slug"] ?? project.slug;

if (!projectSlug) {
  throw new Error("The manifest must define project.slug or --project-slug must be provided.");
}

const artifactRoot = path.resolve(
  sourceRoot,
  args["source-artifact-root"] ?? artifacts.root ?? "documents",
);

const buckets = (artifacts.buckets ?? defaultBuckets).map((bucket) => ({
  slug: bucket.slug,
  path: bucket.path ?? bucket.slug,
}));

const publishedAt = new Date().toISOString();
const sourceRepository =
  args["source-repository"] ?? process.env.GITHUB_REPOSITORY ?? undefined;
const sourceRefName =
  args["source-ref-name"] ?? process.env.GITHUB_REF_NAME ?? undefined;
const sourceSha = args["source-sha"] ?? process.env.GITHUB_SHA ?? undefined;

const targetGeneratedRoot = path.join(targetRoot, "public", "generated", projectSlug);
fs.rmSync(targetGeneratedRoot, { recursive: true, force: true });
ensureDirectory(targetGeneratedRoot);

const copiedBuckets = buckets.map((bucket) => {
  const sourceBucketPath = path.join(artifactRoot, bucket.path);
  const targetBucketPath = path.join(targetGeneratedRoot, bucket.slug);
  const copiedFiles = copyDirectoryContents(sourceBucketPath, targetBucketPath);

  return {
    slug: bucket.slug,
    sourcePath: bucket.path,
    files: copiedFiles.map((filePath) =>
      path.relative(targetGeneratedRoot, filePath).split(path.sep).join("/"),
    ),
  };
});

writeJsonFile(path.join(targetGeneratedRoot, "manifest.json"), {
  project: {
    slug: projectSlug,
    name: project.name ?? projectSlug,
    summary: project.summary ?? "",
  },
  sync: {
    sourceRepository,
    sourceRefName,
    sourceSha,
    syncedAt: publishedAt,
  },
  artifacts: {
    root: path.relative(sourceRoot, artifactRoot).split(path.sep).join("/"),
    buckets: copiedBuckets,
  },
});

const registryPath = path.join(targetRoot, "src", "data", "ingested-projects.json");
const registry = fs.existsSync(registryPath)
  ? readJsonFile(registryPath)
  : { projects: [] };

const ingestedProjectRecord = {
  slug: projectSlug,
  name: project.name ?? projectSlug,
  tagline:
    project.tagline ??
    "Generated hardware artifacts synced from the source repository.",
  summary:
    project.summary ??
    "This project was synced from a hardware repository using the learn-maelstrom-labs artifact pipeline.",
  status: project.status ?? "Documentation synced",
  lead:
    project.lead ??
    `Keep the generated outputs for ${project.name ?? projectSlug} attached to the same project slug as the public documentation site grows.`,
  hardware: uniqueSorted(project.hardware ?? []),
  skills: uniqueSorted(project.skills ?? []),
  overview:
    project.overview ??
    [
      `${project.name ?? projectSlug} is synced from its source repository so board files can be published without hand-copying them into the docs site.`,
      "The generated files land under public/generated/<project-slug>/ and are surfaced automatically on the project page during the static build.",
    ],
  highlights:
    project.highlights ??
    [
      "Publishes generated hardware artifacts into stable buckets.",
      "Updates the site project registry automatically.",
      "Keeps the docs site ready for future backend migration.",
    ],
  sourceRepository,
  sourceRefName,
  sourceSha,
  syncedAt: publishedAt,
};

registry.projects = (registry.projects ?? []).filter(
  (existingProject) => existingProject.slug !== projectSlug,
);
registry.projects.push(ingestedProjectRecord);
registry.projects.sort((left, right) => left.name.localeCompare(right.name));
writeJsonFile(registryPath, registry);

console.log(
  JSON.stringify(
    {
      projectSlug,
      copiedBuckets: copiedBuckets.map((bucket) => ({
        slug: bucket.slug,
        fileCount: bucket.files.length,
      })),
    },
    null,
    2,
  ),
);