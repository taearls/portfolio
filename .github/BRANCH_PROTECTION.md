# Branch Protection Setup

This document explains how to enable branch protection rules to ensure all PRs pass CI checks before merging.

## Required Status Checks

The CI workflow (`.github/workflows/ci.yml`) runs three jobs that should be required:

1. **Lint** - Code quality checks (ESLint, OxLint, Prettier)
2. **Test** - Unit and integration tests
3. **Build** - TypeScript compilation and Vite build

## Setting Up Branch Protection

### Via GitHub UI

1. Go to **Settings** > **Branches** in your repository
2. Click **Add rule** under "Branch protection rules"
3. Set **Branch name pattern**: `main`
4. Enable the following settings:

#### Required Settings

- ✅ **Require a pull request before merging**
  - Require approvals: 0 (for solo projects) or 1+ (for team projects)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Required status checks:
    - `Lint`
    - `Test`
    - `Build`
    - `Cloudflare Pages` (if using Cloudflare Pages deployment)

- ✅ **Require conversation resolution before merging** (optional but recommended)

- ✅ **Do not allow bypassing the above settings** (recommended for production)

#### Optional Settings

- **Require deployments to succeed before merging** - If you have deployment checks
- **Require signed commits** - For additional security
- **Include administrators** - Apply rules to admins too (recommended)

### Via GitHub CLI

```bash
# Note: GitHub CLI doesn't support all branch protection settings
# Use the UI for comprehensive setup

# Basic protection (requires PR checks)
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]=Lint \
  --field required_status_checks[contexts][]=Test \
  --field required_status_checks[contexts][]=Build \
  --field enforce_admins=true \
  --field required_pull_request_reviews[required_approving_review_count]=0
```

## Verification

After enabling branch protection:

1. Create a test PR with intentionally failing code
2. Verify CI checks run automatically
3. Verify merge button is blocked until checks pass
4. Fix the code and verify merge button becomes available

## CI Workflow Details

The CI workflow runs on:

- **Pull requests** targeting `main` branch
- **Push events** to `main` branch

### Job Execution Order

```
Lint ────┐
         ├──> Build (runs only if Lint AND Test pass)
Test ────┘
```

- **Lint** and **Test** run in parallel for faster feedback
- **Build** only runs if both Lint and Test succeed
- Build artifacts are uploaded and retained for 7 days

### Commands Run

- **Lint**:
  - `npm run lint:check` (ESLint)
  - `npm run oxlint:check` (OxLint)
  - `npm run format:check` (Prettier)

- **Test**:
  - `npm run test` (Vitest unit tests)
  - `npm run test:integration` (Cypress E2E tests)

- **Build**:
  - `npm run build` (TypeScript + Vite)

## Troubleshooting

### CI Checks Not Appearing

- Verify the workflow file is in `.github/workflows/ci.yml`
- Check GitHub Actions tab for errors
- Ensure workflow triggers match your PR/push pattern

### Checks Failing

- Review the specific job logs in the Actions tab
- Run the same commands locally to reproduce
- Common issues:
  - Missing dependencies (`npm ci` vs `npm install`)
  - Environment differences (Node version, OS)
  - Flaky tests (especially Cypress)

### Merge Blocked Incorrectly

- Check if all required status checks are listed correctly
- Verify check names match exactly (case-sensitive)
- Consider "Require branches to be up to date" setting impact
