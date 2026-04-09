import type { NextConfig } from "next";

function normalizeBasePath(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  if (value === "/") {
    return undefined;
  }

  const trimmed = value.replace(/^\/+|\/+$/g, "");

  return trimmed ? `/${trimmed}` : undefined;
}

const basePath = normalizeBasePath(process.env.SITE_BASE_PATH);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
