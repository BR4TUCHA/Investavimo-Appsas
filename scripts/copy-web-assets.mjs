import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";

const rootDir = process.cwd();
const distDir = resolve(rootDir, "dist");
const filesToCopy = ["index.html", "styles.css", "script.js"];
const extraCopies = [
  {
    from: resolve(rootDir, "node_modules/qrcodejs/qrcode.min.js"),
    to: resolve(distDir, "vendor/qrcode.min.js"),
  },
];

if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}

mkdirSync(distDir, { recursive: true });

for (const file of filesToCopy) {
  cpSync(resolve(rootDir, file), resolve(distDir, file));
}

for (const extraFile of extraCopies) {
  mkdirSync(dirname(extraFile.to), { recursive: true });
  cpSync(extraFile.from, extraFile.to);
}
