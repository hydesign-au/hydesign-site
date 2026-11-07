// Adds photos to src/assets/photos. A JPEG keeps its original bytes; anything else (HEIC, PNG)
// is converted to JPEG with macOS `sips`. GPS and the HDR gain map are removed losslessly.
// Usage: pnpm photo <file>...

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";

import { exiftool } from "exiftool-vendored";

const photosDir = path.resolve(import.meta.dirname, "../src/assets/photos");

try {
  for (const input of process.argv.slice(2)) {
    const name = path.parse(input).name;
    const output = path.join(photosDir, `${name}.jpeg`);
    if (existsSync(output)) throw new Error(`${name}.jpeg is already in src/assets/photos`);

    if (/\.jpe?g$/i.test(input)) copyFileSync(input, output);
    else {
      execFileSync(
        "sips",
        ["-s", "format", "jpeg", "-s", "formatOptions", "92", input, "--out", output],
        {
          stdio: "ignore",
        },
      );
    }

    // The gain map is a second image appended after the photo; its MPF index is removed after it.
    await exiftool.write(output, {}, { writeArgs: ["-trailer:all=", "-overwrite_original"] });
    await exiftool.write(
      output,
      {},
      { writeArgs: ["-mpf:all=", "-gps:all=", "-overwrite_original"] },
    );
    console.log(`added ${name}`);
  }
} finally {
  await exiftool.end();
}
