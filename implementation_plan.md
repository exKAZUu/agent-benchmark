# Implementation Plan: Support Modulo Operator

## Overview
This plan outlines the changes required to add support for the modulo operator (`%`) to the calculator CLI.

## Affected Files
- `src/cli.ts`
- `src/index.ts`
- `tests/unit.test.ts`

## Detailed Steps

### 1. Update Core Logic (`src/cli.ts`)

**Goal:** Extend the `calculate` function and `Operator` type to support the modulo operation.

**Changes:**
1.  **Update `Operator` Type Definition:**
    -   Locate the `Operator` type alias.
    -   Add `| "%"` to the union type.
    -   *Result:* `export type Operator = "+" | "-" | "*" | "/" | "%";`

2.  **Update `calculate` Function:**
    -   Inside the `calculate` function, add a new `case` to the `switch (operator)` statement.
    -   **Case:** `case "%":`
    -   **Action:** `return left % right;`

### 2. Update CLI Interface (`src/index.ts`)

**Goal:** Allow the CLI to accept the `%` operator.

**Changes:**
1.  **Update Yargs Command Configuration:**
    -   In the `calc` command definition, locate the `operator` positional argument config.
    -   Update the `choices` array to include `"%"`.
    -   *Code:* `choices: ["+", "-", "*", "/", "%"] as const,`

2.  **Update Type Assertion:**
    -   In the handler function, locate where `argv.operator` is cast.
    -   Update the cast to include `| "%"`.
    -   *Code:* `const operator = argv.operator as "+" | "-" | "*" | "/" | "%";`

### 3. Add Unit Tests (`tests/unit.test.ts`)

**Goal:** Verify the modulo operator works correctly.

**Changes:**
1.  **Add Test Case:**
    -   Inside the `describe("calculate", ...)` block, add a new `test` block.
    -   **Test Name:** `"calculates modulo"`
    -   **Implementation:** Call `calculate` with modulo arguments and check the result.
    -   *Example:*
        ```typescript
        test("calculates modulo", () => {
          expect(calculate(10, "%", 3)).toBe(1);
        });
        ```

## Verification
- Run tests using `bun test` to ensure all tests pass.
- Manually test the CLI using `bun src/index.ts calc 10 % 3` (expect output `1`).
