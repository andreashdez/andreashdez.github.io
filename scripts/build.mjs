import { basename, join } from "node:path";
import { cp, mkdir, rm, stat, writeFile } from "node:fs/promises";

const rootDir = process.cwd();
const outDir = join(rootDir, "_site");

const entries = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
  "favicon.ico",
  "favicon.svg",
  "apple-touch-icon.png",
  "social-preview.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-192.png",
  "icon-maskable-512.png",
  "CNAME",
  "assets",
];

const optionalEntries = new Set(["CNAME"]);

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir);

for (const entry of entries) {
  const source = join(rootDir, entry);
  const exists = await stat(source).catch(() => null);

  if (!exists) {
    if (optionalEntries.has(entry)) {
      continue;
    }

    throw new Error(`${entry} is missing`);
  }

  await cp(source, join(outDir, entry), {
    recursive: true,
    filter: (path) => basename(path) !== ".DS_Store",
  });
}

await writeFile(join(outDir, ".nojekyll"), "");

process.stdout.write(`Built ${outDir}\n`);
