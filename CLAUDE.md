# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Tyler Earls' portfolio website built with React, Vite, TailwindCSS, and React Router. The project uses TypeScript throughout and follows a component-based architecture with XState for state management.

## Essential Commands

### Development

- `npm run dev` - Start development server with Vite on port 3000 (auto-opens browser)
- `npm run build` - Build for production (runs TypeScript compiler first, then Vite)

### Testing

- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:vitest:ui` - Open Vitest UI for interactive testing
- `npm run test:integration` - Run Cypress integration tests (headless)
- `npm run test:cypress:open` - Open Cypress test runner (interactive)
- `npm run test:all` - Run both unit and integration tests

### Code Quality

- `npm run lint:check` - Check ESLint issues
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run oxlint:check` - Run OxLint checks (faster alternative linter)
- `npm run oxlint:fix` - Auto-fix OxLint issues
- `npm run format:check` - Check Prettier formatting
- `npm run format:fix` - Auto-fix formatting with Prettier

## Architecture

### Core Technologies

- **Build Tool**: Vite with React plugin
- **Framework**: React 19 with React Router 7
- **Styling**: TailwindCSS with CSS Modules for component-specific styles
- **State Management**: XState with React bindings (actor context pattern)
- **TypeScript**: Strict configuration with separate configs for app/node/tests
- **Testing**: Vitest for unit tests, Cypress for integration tests

### Project Structure

- `/src/components/` - React components organized by feature
  - Layout components in `/layout/`
  - Navigation components in `/navigation/`
  - Individual UI components with their own folders
  - CSS Modules use `.module.css` extension
- `/src/pages/` - Page components for routing
- `/src/state/` - State management with XState
  - `/contexts/` - React contexts (ThemeContext uses XState actors)
  - `/machines/` - XState state machines (themeMachine, navigationMachine)
- `/src/hooks/` - Custom React hooks
- `/src/util/` - Utility functions and constants
- `/src/types/` - TypeScript type definitions
- `/tests/` - Test files organized by type
  - `/unit/` - Unit tests with Vitest
  - `/integration/` - Cypress E2E tests
  - `/component/` - Component-specific tests

### Key Patterns

- **Path Aliasing**: `@/` maps to `/src/` directory
- **CSS Modules**: Component styles use camelCase conversion
- **State Machines**: XState for complex state logic (theme toggling, navigation)
- **Image Optimization**: Cloudinary integration for optimized image delivery
- **Performance Monitoring**: Why Did You Render development tool integrated

### Testing Strategy

- Unit tests run in jsdom environment
- Integration tests use Cypress with a local dev server on port 4173
- Test files follow `.test.ts` or `.spec.tsx` naming convention
- Component tests use Testing Library utilities

### Development Notes

- React Router configured for client-side only (SSR disabled)
- Vite dev server runs on port 3000
- CSS modules generate scoped class names (hash-based in production)
- The project includes performance profiling with why-did-you-render in development
