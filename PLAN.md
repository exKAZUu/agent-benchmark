# Implementation Plan - Change Greeting Message

## User Review Required

> [!NOTE]
> This plan modifies the application's default greeting message.

- **Proposed Change**: Update the output message from "Hello via Bun!" to "Hello, World!".
- **Impact**: 
  - `src/cli.ts`: The `currentText` constant will be updated.
  - `tests/e2e.test.ts`: The end-to-end test will be updated to verify the new message.

## Proposed Changes

### Codebase

#### [src/cli.ts](src/cli.ts)

- Update the `currentText` constant definition.
- **Change**: `export const currentText = "Hello via Bun!";` -> `export const currentText = "Hello, World!";`

### Tests

#### [tests/e2e.test.ts](tests/e2e.test.ts)

- Update the expected output in the "hello prints the current text" test case.
- **Change**: `expect(result.stdout).toBe("Hello via Bun!");` -> `expect(result.stdout).toBe("Hello, World!");`

## Verification Plan

### Automated Tests
- Run the full test suite to ensure the change is correctly implemented and no regressions are introduced.
- Command: `bun test`
- Expected Result: All tests, including the updated "hello prints the current text" case, should pass.

### Manual Verification
- Run the CLI command manually to observe the output.
- Command: `bun run src/index.ts hello`
- Expected Result: The output should be "Hello, World!".
