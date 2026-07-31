import { expect, test } from "bun:test";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("the documented CLI invocation prints Hello, World!", async () => {
  const process = Bun.spawn(["bun", "run", "src/index.ts"], {
    cwd: projectRoot,
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
