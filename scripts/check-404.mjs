const baseUrl = process.argv[2] || "http://127.0.0.1:8080";
const missingPath = "/missing/nested/";
const assetPaths = [
  "/assets/js/theme-boot.js",
  "/assets/js/theme.js",
  "/assets/css/main.css",
  "/assets/css/404.css",
];

const response = await fetch(new URL(missingPath, baseUrl));

if (response.status !== 404) {
  throw new Error(`${missingPath} returned ${response.status}, expected 404`);
}

if (!response.headers.get("content-type")?.startsWith("text/html")) {
  throw new Error(`${missingPath} did not return HTML`);
}

const html = await response.text();

for (const assetPath of assetPaths) {
  if (!html.includes(`"${assetPath}"`)) {
    throw new Error(`${missingPath} does not reference ${assetPath}`);
  }

  const assetResponse = await fetch(new URL(assetPath, baseUrl));

  if (!assetResponse.ok) {
    throw new Error(`${assetPath} returned ${assetResponse.status}`);
  }
}

process.stdout.write("Custom 404 route and assets passed.\n");
