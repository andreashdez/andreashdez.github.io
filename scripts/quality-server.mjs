import { createServer } from "node:http";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { extname, isAbsolute, join, normalize, relative } from "node:path";
import { readFile, stat } from "node:fs/promises";

const rootDir = process.cwd();
const port = Number(process.argv[2] || 8080);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

const textLikeExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".svg",
  ".txt",
  ".webmanifest",
  ".xml",
]);

const immutableExtensions = new Set([
  ".css",
  ".ico",
  ".js",
  ".png",
  ".svg",
  ".webmanifest",
  ".woff2",
  ".xml",
]);

function getCacheControl(fileExt) {
  if (fileExt === ".html") {
    return "public, max-age=0, must-revalidate";
  }

  if (immutableExtensions.has(fileExt)) {
    return "public, max-age=31536000, immutable";
  }

  return "public, max-age=3600";
}

function getContentType(fileExt) {
  return mimeTypes[fileExt] || "application/octet-stream";
}

function compressBody(bodyBuffer, acceptEncoding) {
  if (acceptEncoding.includes("br")) {
    return {
      body: brotliCompressSync(bodyBuffer),
      encoding: "br",
    };
  }

  if (acceptEncoding.includes("gzip")) {
    return {
      body: gzipSync(bodyBuffer),
      encoding: "gzip",
    };
  }

  return {
    body: bodyBuffer,
    encoding: null,
  };
}

function resolvePath(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const sanitized = decodedPath === "/" ? "index.html" : decodedPath;
  const normalized = normalize(sanitized).replace(/^[/\\]+/, "");
  const absolutePath = join(rootDir, normalized);
  const pathFromRoot = relative(rootDir, absolutePath);

  if (pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot)) {
    return join(rootDir, "index.html");
  }

  return absolutePath;
}

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || "/", `http://127.0.0.1:${port}`);
    let filePath = resolvePath(requestUrl.pathname);

    let fileStats = await stat(filePath).catch(() => null);

    if (fileStats && fileStats.isDirectory()) {
      filePath = join(filePath, "index.html");
      fileStats = await stat(filePath).catch(() => null);
    }

    if (!fileStats || !fileStats.isFile()) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Not found");
      return;
    }

    const fileExt = extname(filePath).toLowerCase();
    const fileBuffer = await readFile(filePath);

    const shouldCompress = textLikeExtensions.has(fileExt);
    const acceptEncoding = String(req.headers["accept-encoding"] || "");
    const { body, encoding } = shouldCompress
      ? compressBody(fileBuffer, acceptEncoding)
      : { body: fileBuffer, encoding: null };

    res.statusCode = 200;
    res.setHeader("Cache-Control", getCacheControl(fileExt));
    res.setHeader("Content-Type", getContentType(fileExt));
    res.setHeader("Content-Length", String(body.byteLength));
    res.setHeader("Vary", "Accept-Encoding");

    if (encoding) {
      res.setHeader("Content-Encoding", encoding);
    }

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    res.end(body);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Internal server error");
  }
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Serving HTTP on http://127.0.0.1:${port}\n`);
});
