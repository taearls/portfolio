# Graphite Setup Guide

This document provides setup instructions for using [Graphite](https://graphite.com) with this repository. Graphite is a tool for managing stacked PRs, enabling faster code review cycles and unblocked development.

## What is Graphite?

Graphite enables **stacked PRs** - breaking down large features into smaller, dependent pull requests that can be reviewed independently. This workflow offers:

- **Faster reviews**: Smaller PRs are easier to review and less likely to be rubber-stamped
- **Stay unblocked**: Continue working while waiting for reviews
- **Fewer merge conflicts**: Smaller changes mean less to conflict with
- **Better code quality**: Atomic, focused changes are easier to understand

## Installation

### macOS (Homebrew - Recommended)

```bash
brew install withgraphite/tap/graphite
gt --version
```

### macOS/Linux/Windows (npm)

```bash
npm install -g @withgraphite/graphite-cli@stable
gt --version
```

### Git Version Requirement

Graphite v1.0.0+ requires Git 2.38.0 or later. Check your version:

```bash
git --version
```

If needed, update via Homebrew:

```bash
brew install git
```

## Authentication

1. Visit [https://app.graphite.com/activate](https://app.graphite.com/activate) and sign in with your GitHub account
2. Copy the displayed command and run it:

```bash
gt auth --token <your_cli_auth_token>
```

You should see: `Saved auth token to ~/.graphite_user_config`

## Core Concepts

### Stacks

A **stack** is a series of dependent branches/PRs where each builds on the previous one. Instead of one large PR with 500+ lines, you create multiple small PRs (< 200 lines each) that form a stack.

```text
main
 └── feature/auth-types      (PR #1: Add types)
      └── feature/auth-api   (PR #2: Add API layer)
           └── feature/auth-ui (PR #3: Add UI)
```

### Key Terminology

- **Upstack**: Branches/PRs that depend on the current one
- **Downstack**: Branches/PRs that the current one depends on
- **Restack**: Rebasing the stack to incorporate changes

## Essential Commands

### Creating Branches

```bash
# Create a new branch (automatically tracks dependencies)
gt branch create <branch-name>

# Or use the shorthand
gt bc <branch-name>
```

### Committing Changes

```bash
# Create a commit (similar to git commit)
gt commit create -m "message"

# Or use the shorthand
gt cc -m "message"

# Amend the current commit
gt commit amend
```

### Submitting PRs

```bash
# Submit the current branch as a PR
gt submit

# Submit the entire stack
gt stack submit
```

### Syncing

```bash
# Sync your stack with the latest main
gt stack sync

# Restack after changes
gt stack restack
```

### Viewing Your Stack

```bash
# View your current stack
gt log short

# View detailed log
gt log
```

### Navigation

```bash
# Move to the bottom of your stack
gt bottom

# Move to the top of your stack
gt top

# Move up one branch
gt up

# Move down one branch
gt down
```

## Recommended Workflow

1. **Start from main**:

   ```bash
   gt trunk  # Switch to main and sync
   ```

2. **Create your first branch**:

   ```bash
   gt bc feature/add-types
   # Make changes
   gt cc -m "Add TypeScript types for auth"
   ```

3. **Stack another branch on top**:

   ```bash
   gt bc feature/add-api
   # Make changes
   gt cc -m "Add auth API endpoints"
   ```

4. **Submit your stack for review**:

   ```bash
   gt stack submit
   ```

5. **After reviews, sync and land**:
   ```bash
   gt stack sync
   # After approval, PRs merge from bottom to top
   ```

## Best Practices

1. **Keep PRs small**: Aim for < 200 lines of code per PR
2. **Review bottom-up**: When reviewing stacks, start from the base
3. **Use "merge when ready"**: Enable auto-merge for approved PRs
4. **Don't wait for downstack approval**: Review each PR independently
5. **Make atomic changes**: Each PR should make sense on its own

## VS Code Extension

Graphite also offers a VS Code extension for visual stack management:

- Install from VS Code marketplace: "Graphite"
- Provides visual stack overview
- Quick actions for common operations

## Troubleshooting

### Stack out of sync

```bash
gt stack sync
gt stack restack
```

### Merge conflicts

Resolve conflicts normally, then:

```bash
gt continue
```

### Reset a branch

```bash
gt branch checkout <branch-name>
gt repo sync --force
```

## Resources

- [Graphite Documentation](https://graphite.com/docs)
- [Graphite Guides](https://graphite.com/guides)
- [Stacked PRs Best Practices](https://graphite.com/docs/best-practices-for-reviewing-stacks)
- [Command Reference](https://graphite.com/docs/command-reference)
