import { expect, test } from "bun:test";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const entry = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "src",
  "index.ts",
);

test("the documented command prints Hello, World!", async () => {
  const proc = Bun.spawn(["bun", "run", entry], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  expect(stdout).toBe("Hello, World!\n");
  expect(stderr).toBe("");
  expect(exitCode).toBe(0);
});
