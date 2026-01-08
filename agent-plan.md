# Implementation Plan: Support Modulo Operator

## Goal
Add support for the modulo (`%`) operator alongside the existing `+`, `-`, `*`, and `/` operations in both the CLI and calculation logic, with tests updated accordingly.

## Relevant Files Reviewed
- `src/cli.ts` — defines `Operator` type and `calculate` implementation.
- `src/index.ts` — CLI command parsing, operator choices.
- `tests/unit.test.ts` — unit tests for `calculate`.
- `tests/e2e.test.ts` — end-to-end CLI tests.
- `README.md` — basic usage (no operator list yet).

## Assumptions
- Modulo should follow JavaScript `%` semantics (remainder operator; works with integers and floats, sign follows dividend).
- CLI should accept `%` as a valid operator in `calc` command.
- No additional external libraries are required.

## Plan

### 1) Extend Operator Type and Calculation Logic
- Update `Operator` union in `src/cli.ts` to include `%`.
- Add a `case "%": return left % right;` branch in `calculate`.
- Ensure the `calculate` function remains exhaustive; consider adding a `default` with `throw` if you want defensive behavior (optional).

### 2) Expand CLI Operator Choices
- In `src/index.ts`, add `%` to the `choices` array for the `operator` positional.
- Update the `operator` type annotation in the handler to include `%` (e.g., `"+" | "-" | "*" | "/" | "%"`).

### 3) Add Unit Test Coverage
- In `tests/unit.test.ts`, add a test case for modulo, e.g. `expect(calculate(10, "%", 3)).toBe(1);`.
- Optionally add a test for negative operands to document semantics (e.g., `-10 % 3` yields `-1` in JS) if desired.

### 4) Add CLI End-to-End Test Coverage
- In `tests/e2e.test.ts`, add a `calc` test using `%`, e.g. `calc 10 % 3` should output `1`.

### 5) Update Documentation (Optional but Recommended)
- If you want the CLI operator set documented, update `README.md` with an example showing `%` usage.

### 6) Validation
- Run the test suite (e.g., `bun test`) and ensure both unit and e2e tests pass.
- Manually verify the CLI: `bun run src/index.ts calc 10 % 3` outputs `1`.

## External Libraries / APIs
- None required. JavaScript `%` operator is built-in.
