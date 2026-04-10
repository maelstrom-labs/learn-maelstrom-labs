import fs from "node:fs";
import path from "node:path";
import { ResourceBucket } from "@/lib/site-content";
import { withBasePath } from "@/lib/site-config";

export interface ArtifactFile {
  name: string;
  relativePath: string;
  href: string;
  sizeBytes: number;
  sizeLabel: string;
}

export interface ProjectArtifactBucket extends ResourceBucket {
  status: "pipeline" | "ready";
  files: ArtifactFile[];
}

export interface ProjectArtifactSync {
  sourceRepository?: string;
  sourceRefName?: string;
  sourceSha?: string;
  syncedAt?: string;
}

interface PublicArtifactManifest {
  artifacts?: {
    publicRoot?: string;
    buckets?: Array<{
      slug: string;
      sourcePath?: string;
      publicPath?: string;
      files?: string[];
    }>;
  };
  sync?: ProjectArtifactSync;
}

const generatedRoot = path.join(process.cwd(), "public", "generated");

function formatBytes(sizeBytes: number): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function walkFiles(directoryPath: string, rootPath: string): ArtifactFile[] {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  return fs.readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".")) {
      return [];
    }

    const absolutePath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(absolutePath, rootPath);
    }

    const relativePath = path.relative(rootPath, absolutePath).split(path.sep).join("/");
    const stat = fs.statSync(absolutePath);

    return [
      {
        name: entry.name,
        relativePath,
        href: withBasePath(`/${path.relative(path.join(process.cwd(), "public"), absolutePath).split(path.sep).join("/")}`),
        sizeBytes: stat.size,
        sizeLabel: formatBytes(stat.size),
      },
    ];
  });
}

function readPublicArtifactManifest(projectSlug: string): PublicArtifactManifest | null {
  const manifestPath = path.join(generatedRoot, projectSlug, "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(manifestPath, "utf8")) as PublicArtifactManifest;
}

function filesFromManifest(
  publicBucketPath: string,
  filePaths: string[],
): ArtifactFile[] {
  return filePaths.flatMap((filePath) => {
    const absolutePath = path.join(process.cwd(), "public", filePath);

    if (!fs.existsSync(absolutePath)) {
      return [];
    }

    const stat = fs.statSync(absolutePath);

    if (!stat.isFile()) {
      return [];
    }

    const relativePath = path.posix.relative(publicBucketPath, filePath) || path.posix.basename(filePath);

    return [
      {
        name: path.posix.basename(filePath),
        relativePath,
        href: withBasePath(`/${filePath}`),
        sizeBytes: stat.size,
        sizeLabel: formatBytes(stat.size),
      },
    ];
  });
}

export function getProjectArtifactBuckets(
  projectSlug: string,
  resourceBuckets: ResourceBucket[],
): ProjectArtifactBucket[] {
  const manifest = readPublicArtifactManifest(projectSlug);
  const manifestBucketMap = new Map(
    (manifest?.artifacts?.buckets ?? []).map((bucket) => [bucket.slug, bucket]),
  );

  return resourceBuckets.map((bucket) => {
    const manifestBucket = manifestBucketMap.get(bucket.slug);

    if (manifestBucket) {
      const publicBucketPath = manifestBucket.publicPath ?? bucket.publicPath.replace(/^\//, "");
      const files = filesFromManifest(publicBucketPath, manifestBucket.files ?? []).sort(
        (left, right) => left.relativePath.localeCompare(right.relativePath),
      );

      return {
        ...bucket,
        publicPath: `/${publicBucketPath}`,
        status: files.length > 0 ? "ready" : "pipeline",
        files,
      };
    }

    const bucketDirectory = path.join(generatedRoot, projectSlug, bucket.slug);
    const files = walkFiles(bucketDirectory, bucketDirectory).sort((left, right) =>
      left.relativePath.localeCompare(right.relativePath),
    );

    return {
      ...bucket,
      status: files.length > 0 ? "ready" : "pipeline",
      files,
    };
  });
}

export function getProjectArtifactSync(projectSlug: string): ProjectArtifactSync | null {
  const manifest = readPublicArtifactManifest(projectSlug);

  if (!manifest) {
    return null;
  }

  return manifest.sync ?? null;
}
