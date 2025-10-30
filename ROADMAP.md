# Portfolio Website Roadmap

## Executive Summary

This roadmap outlines the development plan for Tyler Earls' portfolio website, focusing on performance optimization, modern React tooling, and enhanced user experience. The project is currently in **Phase 5 (React Compiler Integration)** with 17 open issues across performance, features, and infrastructure improvements.

**Current Focus**: React Compiler integration to improve runtime performance through automatic memoization.

---

## Table of Contents
1. [Open Issues Summary](#open-issues-summary)
2. [Phase Overview](#phase-overview)
3. [Current Sprint](#current-sprint)
4. [Recommended Implementation Order](#recommended-implementation-order)
5. [Issue Status Summary](#issue-status-summary)
6. [Changelog](#changelog)

---

## Open Issues Summary

### Priority Breakdown (17 Total)

#### 🔴 Critical Priority (0 issues)
*No critical issues at this time*

#### 🟡 High Priority (6 issues) - Effort: ~2-3 weeks
- **#38** - Integrate React Compiler with Vite build pipeline (Epic) - *~2-3 weeks*
  - **#39** - [React Compiler 1/6] Install React Compiler dependencies - *~1 hour*
  - **#40** - [React Compiler 2/6] Add React Compiler ESLint plugin (warnings only) - *~1 hour*
  - **#41** - [React Compiler 3/6] Fix React Compiler compatibility issues - *~4-6 hours*
  - **#42** - [React Compiler 4/6] Enable React Compiler ESLint rule as error - *~1 hour*
  - **#43** - [React Compiler 5/6] Configure Vite to enable React Compiler - *~3-5 hours*
  - **#44** - [React Compiler 6/6] Remove redundant memoization code - *~4-6 hours*
- **#18** - CI - Add Github Actions Pipeline - *~3-5 hours*

#### 🟢 Medium Priority (4 issues) - Effort: ~1-2 weeks
- **#14** - Add Working Email Contact Form - *~1-2 days*
- **#27** - UI - Lazy Load Routes with React Router - *~3-5 hours*
- **#28** - UI - Leverage React's built-in Meta Tag - *~1-2 hours*
- **#11** - Preload Sprite SVG in development and production - *~1-2 hours*

#### 🔵 Low Priority (6 issues) - Effort: ~2-3 weeks
- **#10** - Add Resume Page - *~4-6 hours*
- **#13** - Update Web Projects - Descriptions - *~1-2 hours*
- **#15** - Update Web Projects - Add User Selectable Tags and Search - Update Layout - *~1-2 days*
- **#33** - Spike: Integrate PRs with Graphite - *~1-2 hours*
- **#34** - Spike: Experiment with CodeRabbit - *~1-2 hours*

---

## Phase Overview

### Phase 1: Initial Setup ✅ (Completed)
*Foundation work completed - React 19, Vite, TailwindCSS, React Router 7*

### Phase 2: Core Features ✅ (Completed)
*Basic portfolio structure, navigation, project showcase*

### Phase 3: Testing Infrastructure ✅ (Completed)
*Vitest unit tests, Cypress integration tests, Why Did You Render*

### Phase 4: TailwindCSS v4 Migration ✅ (Completed - Oct 2025)
*Successfully migrated to TailwindCSS v4 with modern config*

### Phase 5: React Compiler Integration 🚧 (In Progress - Oct-Nov 2025)

**Goal**: Integrate React 19 Compiler to automatically optimize component rendering without manual memoization.

**Timeline**: 2-3 weeks (Starting Oct 30, 2025)

**Key Milestones**:
1. ✅ React 19 already installed
2. ⬜ Install React Compiler dependencies (#39)
3. ⬜ Add ESLint integration with warnings (#40)
4. ⬜ Fix compatibility issues (#41)
5. ⬜ Enable strict ESLint rules (#42)
6. ⬜ Configure Vite build integration (#43)
7. ⬜ Remove redundant memoization (#44)

**Dependencies**: React 19 (installed), Vite 6.3.5 (installed)

**Success Criteria**:
- React Compiler successfully builds components
- No ESLint errors
- Performance improvements validated
- Redundant useMemo/useCallback removed

### Phase 6: CI/CD & Production Readiness 📋 (Planned - Nov-Dec 2025)

**Goal**: Establish automated testing and deployment pipelines.

**Timeline**: 1-2 weeks

**Key Tasks**:
- #18: GitHub Actions CI/CD pipeline
- Automated testing on PRs
- Build verification
- Deployment automation

### Phase 7: UI/UX Enhancements 📋 (Planned - Dec 2025-Jan 2026)

**Goal**: Improve user experience and add advanced features.

**Timeline**: 3-4 weeks

**High-Impact Tasks**:
- #14: Working email contact form
- #27: Lazy-loaded routes for better performance
- #28: React 19 meta tag support
- #11: SVG sprite preloading

**Nice-to-Have Features**:
- #10: Resume page
- #15: Enhanced project filtering/search
- #13: Updated project descriptions

### Phase 8: Research & Experimentation 🔬 (Ongoing)

**Goal**: Evaluate new tools and workflows.

**Tasks**:
- #33: Graphite PR workflow investigation
- #34: CodeRabbit AI code review testing

---

## Current Sprint

### Sprint Goals (Oct 30 - Nov 13, 2025)

**Primary Objective**: Complete React Compiler integration (Epic #38)

**Active Work**:
1. 🎯 **#39** - Install React Compiler dependencies
   - Status: Ready to start
   - Effort: ~1 hour
   - Blocking: #40, #41, #42, #43, #44

**NEXT UP**:
2. **#40** - Add ESLint plugin with warnings
   - Depends on: #39
   - Effort: ~1 hour

3. **#41** - Fix compatibility issues
   - Depends on: #40
   - Effort: ~4-6 hours
   - Risk: May discover component patterns incompatible with compiler

4. **#42** - Enable strict ESLint rules
   - Depends on: #41
   - Effort: ~1 hour

5. **#43** - Configure Vite integration
   - Depends on: #42
   - Effort: ~3-5 hours

6. **#44** - Remove redundant memoization
   - Depends on: #43
   - Effort: ~4-6 hours
   - Impact: Cleaner codebase, smaller bundle

### Sprint Metrics
- Total issues: 6
- Estimated effort: 14-20 hours
- Priority: High
- Epic: #38

---

## Recommended Implementation Order

### Critical Path (React Compiler Integration)

```
Phase 5: React Compiler Integration
├── #39 Install dependencies (1h)
│   └── BLOCKS: #40, #41, #42, #43, #44
├── #40 ESLint warnings (1h)
│   └── BLOCKS: #41
├── #41 Fix compatibility (4-6h) ⚠️ RISK: Unknown issues
│   └── BLOCKS: #42
├── #42 ESLint errors (1h)
│   └── BLOCKS: #43
├── #43 Vite integration (3-5h)
│   └── BLOCKS: #44
└── #44 Remove memoization (4-6h)

Phase 6: CI/CD
└── #18 GitHub Actions (3-5h)
    └── ENABLES: Automated testing for Phase 7 work

Phase 7: UI/UX (Parallel track after Phase 5)
├── #28 React Meta Tag (1-2h) - Quick win
├── #11 SVG Preloading (1-2h) - Performance
├── #27 Lazy Routes (3-5h) - Performance
└── #14 Contact Form (1-2 days) - User engagement

Phase 8: Research (Anytime)
├── #33 Graphite spike (1-2h)
└── #34 CodeRabbit spike (1-2h)

Phase 7: Low Priority (As time permits)
├── #10 Resume page (4-6h)
├── #13 Project descriptions (1-2h)
└── #15 Project filtering (1-2 days)
```

### Implementation Strategy

**Week 1-2 (Current Sprint)**:
- Focus: Complete React Compiler Epic (#38)
- Expected outcome: Optimized React rendering, cleaner code

**Week 3**:
- Focus: CI/CD Pipeline (#18)
- Expected outcome: Automated testing and deployments

**Week 4-5**:
- Focus: High-impact UI improvements (#28, #11, #27, #14)
- Expected outcome: Better UX and performance

**Ongoing**:
- Low priority features as time permits
- Research spikes in downtime

---

## Dependencies & Risks

### Technical Dependencies
- ✅ React 19 installed
- ✅ Vite 6.3.5 installed
- ✅ TailwindCSS v4 installed
- ⬜ React Compiler packages (install in #39)

### Known Risks

#### 🟡 Medium Risk: React Compiler Compatibility (#41)
- **Issue**: Unknown how many components need refactoring
- **Mitigation**: ESLint warnings first (#40), then strict enforcement (#42)
- **Impact**: Could add 2-5 hours to timeline

#### 🟢 Low Risk: Vite Integration (#43)
- **Issue**: Build configuration complexity
- **Mitigation**: Well-documented integration path
- **Impact**: Minimal, ~1-2 hour buffer

### Blockers
*None at this time - #39 is ready to start*

---

## Issue Status Summary

| Priority | Open | In Progress | Completed | Total |
|----------|------|-------------|-----------|-------|
| 🔴 Critical | 0 | 0 | - | 0 |
| 🟡 High | 6 | 0 | - | 6 |
| 🟢 Medium | 5 | 0 | - | 5 |
| 🔵 Low | 6 | 0 | - | 6 |
| **TOTAL** | **17** | **0** | **-** | **17** |

### Issues by Category

**React Compiler** (6 issues): #38, #39, #40, #41, #42, #43, #44
**CI/CD** (1 issue): #18
**UI/UX** (6 issues): #10, #11, #13, #14, #15, #27, #28
**Research** (2 issues): #33, #34

### Effort Distribution

| Effort Level | Count | Issues |
|--------------|-------|---------|
| Small (< 2h) | 7 | #39, #40, #42, #28, #11, #13, #33, #34 |
| Medium (2-8h) | 7 | #41, #43, #44, #18, #27, #10 |
| Large (> 8h) | 3 | #38 (epic), #14, #15 |

---

## Timeline Estimates

### Optimistic (No blockers)
- **Phase 5**: 2 weeks (14-16 hours)
- **Phase 6**: 1 week (3-5 hours)
- **Phase 7**: 2-3 weeks (40-60 hours)
- **Total**: 5-6 weeks

### Realistic (Some discovery work needed)
- **Phase 5**: 3 weeks (20-24 hours w/ compatibility fixes)
- **Phase 6**: 1-2 weeks (5-8 hours w/ setup)
- **Phase 7**: 3-4 weeks (50-70 hours)
- **Total**: 7-9 weeks

### Pessimistic (Significant refactoring needed)
- **Phase 5**: 4 weeks (30-40 hours)
- **Phase 6**: 2 weeks (8-12 hours)
- **Phase 7**: 5-6 weeks (80-100 hours)
- **Total**: 11-12 weeks

**Recommended Target**: Realistic timeline (7-9 weeks from Oct 30, 2025 → mid-January 2026)

---

## Success Metrics

### Phase 5 (React Compiler)
- ✅ All components compile without errors
- ✅ Bundle size reduction: target 10-15% (from removing memoization)
- ✅ Performance improvement: target 5-10% render time reduction
- ✅ Zero ESLint errors from React Compiler rules

### Phase 6 (CI/CD)
- ✅ GitHub Actions running on all PRs
- ✅ Automated test suite passing
- ✅ Build verification before merge
- ✅ < 5 minute CI pipeline time

### Phase 7 (UI/UX)
- ✅ Contact form functional with spam protection
- ✅ Route-based code splitting active
- ✅ SVG sprites preloaded for instant rendering
- ✅ All meta tags using React 19 API

---

## Changelog

### 2025-10-30 - Initial Roadmap Creation
- **Status**: Created comprehensive roadmap based on 17 open GitHub issues
- **Issues Added**:
  - 6 High priority (React Compiler Epic #38 + #39-#44, CI/CD #18)
  - 5 Medium priority (UI/UX: #14, #27, #28, #11)
  - 6 Low priority (#10, #13, #15, #33, #34)
- **Phases Defined**:
  - Phase 5 (React Compiler) - In Progress
  - Phase 6 (CI/CD) - Planned
  - Phase 7 (UI/UX) - Planned
  - Phase 8 (Research) - Ongoing
- **Timeline**: 7-9 weeks (realistic estimate through mid-January 2026)
- **Next Actions**: Start #39 (Install React Compiler dependencies)

---

## Notes

### Assumptions
1. React Compiler is production-ready for React 19
2. Current component patterns are generally compatible
3. No major architectural changes required
4. Development velocity: ~10-15 hours/week

### Out of Scope (For Now)
- Server-side rendering (SSR)
- Advanced analytics/tracking
- Multi-language support
- Progressive Web App (PWA) features
- Backend API development

### Future Considerations
- Consider SSR/SSG after React Compiler stabilizes
- Evaluate Next.js vs Remix for future SSR needs
- Explore PWA features for offline support
- Add analytics for user behavior insights

---

**Last Updated**: October 30, 2025
**Maintained By**: Tyler Earls
**Generated With**: Claude Code
