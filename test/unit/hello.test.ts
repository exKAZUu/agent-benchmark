import { expect, test } from "bun:test";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const entry = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "src",
  "index.ts",
);

test("running the CLI prints Hello, World!", async () => {
  const process = Bun.spawn(["bun", "run", entry], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);

  expect(stdout).toBe("Hello, World!\n");
  expect(stderr).toBe("");
  expect(exitCode).toBe(0);
});
