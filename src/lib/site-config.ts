function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function normalizeBasePath(value?: string): string {
  if (!value || value === "/") {
    return "";
  }

  const trimmed = value.replace(/^\/+|\/+$/g, "");

  return trimmed ? `/${trimmed}` : "";
}

export const siteUrl = stripTrailingSlash(
  process.env.SITE_URL ?? "https://learn.maelstromlabs.com",
);

export const siteBasePath = normalizeBasePath(process.env.SITE_BASE_PATH);

export function withBasePath(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (!siteBasePath) {
    return normalizedPath;
  }

  if (normalizedPath === "/") {
    return siteBasePath;
  }

  return `${siteBasePath}${normalizedPath}`;
}

export function resolveSiteUrl(pathname = "/"): string {
  return new URL(withBasePath(pathname), `${siteUrl}/`).toString();
}