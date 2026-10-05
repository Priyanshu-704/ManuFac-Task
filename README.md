# Geriatric Care Assessment Form

A single-page React 19 + TypeScript + Mantine application for visiting nurses conducting home assessments on elderly patients.

## Features & Implementation Highlights

- **Mantine + Zod Integration**: Uses `@mantine/form` with `mantine-form-zod-resolver` off the exact provided Zod schema (`src/features/assessment/schema.ts`).
- **Validation on Blur & Submit**: Input fields remain quiet until blurred or submitted, showing built-in inline error messages per field.
- **Dynamic Mobility Selection**: Dropdown options for mobility are generated dynamically directly from the `MOBILITY` const array in schema.
- **Sample Patient Fixture**: Includes a "Load sample patient" button to quickly auto-fill valid patient data for testing.
- **Simulated Save**: Async 800ms save flow displaying button loading spinner followed by a success alert rendering Zod-parsed output inside a Code block.
- **Comprehensive Unit & Integration Tests**: Vitest tests covering schema age boundaries (turning 60 vs 1 day short) and RTL form rendering/submission.

## Getting Started

### Installation

Ensure Yarn 4 (or Corepack) is enabled:

```bash
yarn install
```

### Running Development Server

```bash
yarn dev
```

### Running Tests & Checks

Run the full verification suite (formatting, linting, typechecking, Vitest tests, and production build):

```bash
yarn test
```

Or run Vitest tests directly:

```bash
yarn vitest
```

## Time Spent & Approach

- **Time Spent**: ~1.5 hours
- **Approach**:
  1. Setup Vite + Mantine template and added required dependencies (`@mantine/form`, `@mantine/dates`, `zod`, `dayjs`, `mantine-form-zod-resolver`).
  2. Implemented Zod schema and types in `schema.ts` strictly matching the problem specification.
  3. Created `GeriatricAssessmentForm.tsx` using Mantine layout components (`Container`, `Paper`, `Stack`, `Group`) and input components (`TextInput`, `DateInput`, `Select`, `NumberInput`, `Checkbox`).
  4. Added boundary unit test cases in `schema.test.ts` and integration rendering tests in `GeriatricAssessmentForm.test.tsx`.
