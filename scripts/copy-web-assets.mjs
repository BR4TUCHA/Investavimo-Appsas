import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = process.cwd();
const distDir = resolve(rootDir, "dist");
const filesToCopy = ["index.html", "styles.css", "script.js"];

if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}

mkdirSync(distDir, { recursive: true });

for (const file of filesToCopy) {
  cpSync(resolve(rootDir, file), resolve(distDir, file));
}
