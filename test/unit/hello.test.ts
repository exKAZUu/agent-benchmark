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

test("hello prints Hello, World!", async () => {
  const process = Bun.spawn(["bun", "run", entry, "hello"], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);

  expect(exitCode).toBe(0);
  expect(stderr).toBe("");
  expect(stdout).toBe("Hello, World!\n");
});
