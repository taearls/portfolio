# Claude Code GitHub Integration

This repository uses the official [Anthropic Claude Code GitHub Action](https://github.com/anthropics/claude-code-action) to enable Claude to respond to comments on issues and pull requests.

## Features

- 🤖 **Automatic Response**: Claude responds to @claude mentions in issue/PR comments
- 💬 **Intelligent Mode Detection**: Automatically determines whether to review, implement, or explain
- 🔄 **Code Implementation**: Can create PRs with code changes based on requests
- 🛡️ **Safety First**: Built-in protections against bot loops and unauthorized access
- 📝 **Context-Aware**: Uses CLAUDE.md for project-specific guidelines

## Setup

### 1. Add Anthropic API Key to Secrets

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your Anthropic API key (get one at https://console.anthropic.com/)
5. Click **Add secret**

### 2. Enable Workflow Permissions

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### 3. Workflow is Ready

The workflow is configured in `.github/workflows/claude-code.yml` and will automatically run when:

- Someone mentions @claude in an issue comment
- Someone mentions @claude in a pull request comment
- Someone mentions @claude in a PR review
- An issue is opened or assigned with @claude in the title or body

## Usage

### Triggering Claude

Simply mention `@claude` in any comment and provide your request:

```
@claude can you review this PR for security issues?
```

```
@claude implement a dark mode toggle for the settings page
```

```
@claude explain how the state management works in this codebase
```

## How It Works

### Official Claude Code Action

The workflow uses `anthropics/claude-code-action@v1`, the official GitHub Action maintained by Anthropic. This action:

1. **Detects Mentions**: Listens for @claude in comments across issues and PRs
2. **Gathers Context**: Automatically understands the repository structure and relevant code
3. **Processes Requests**: Uses Claude Code (not just the API) for intelligent code understanding
4. **Takes Action**: Can respond with comments, create branches, commit changes, and open PRs
5. **Tracks Progress**: Updates comments with progress indicators

### Configuration

The workflow is configured in `.github/workflows/claude-code.yml`:

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    claude_args: |
      --model claude-sonnet-4-5-20250929
      --max-turns 15
      --system-prompt "You are assisting with Tyler Earls' portfolio website..."
```

### Repository Context (CLAUDE.md)

The action automatically reads `CLAUDE.md` from the repository root for project-specific guidelines. This file provides Claude with:

- Project overview and architecture
- Essential commands (dev, test, build, deploy)
- Coding standards and patterns
- Testing strategy
- Key file locations

## Safety Features

### 1. Bot Loop Prevention

The workflow only triggers on human-authored comments, not bot accounts.

### 2. Explicit Triggers Only

Claude only responds when explicitly mentioned with `@claude`.

### 3. Manual PR Review Required

All auto-generated PRs must be manually reviewed and merged. The workflow respects branch protection rules.

### 4. Audit Trail

Every action is logged:
- Workflow run logs in GitHub Actions
- Commit messages reference the original request
- PR descriptions link to triggering comments

## Configuration Options

### Changing the Model

Edit `.github/workflows/claude-code.yml` to use a different model:

```yaml
claude_args: |
  --model claude-opus-4-1-20250805  # More capable, slower
  --max-turns 15
```

Available models:
- `claude-sonnet-4-5-20250929` - Balanced (currently used)
- `claude-opus-4-1-20250805` - Most capable

### Customizing Behavior

You can customize Claude's behavior with additional CLI arguments:

```yaml
claude_args: |
  --model claude-sonnet-4-5-20250929
  --max-turns 20
  --allowedTools "Bash(npm install),Bash(npm run build),Bash(npm test)"
  --system-prompt "Custom instructions here..."
```

### Advanced Settings

For advanced configuration, see the [official documentation](https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md).

## Troubleshooting

### Workflow Not Triggering

**Check:**

1. Is the workflow file at `.github/workflows/claude-code.yml`?
2. Did you mention `@claude` in the comment?
3. Is the comment from a human account (not a bot)?
4. Check the Actions tab for workflow runs and errors

### API Key Errors

**Error message:** `Error: Missing required input 'anthropic_api_key'`

**Fix:**

1. Verify the secret is named exactly `ANTHROPIC_API_KEY` (case-sensitive)
2. Check that the secret has a valid API key value
3. Try re-saving the secret

### Permission Errors

**Error message:** `Resource not accessible by integration`

**Fix:**

1. Go to **Settings** → **Actions** → **General**
2. Enable **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**

## Cost Considerations

Each Claude API call consumes tokens and incurs costs:

- **Sonnet 4.5**: ~$3 per million input tokens, ~$15 per million output tokens
- Typical comment response: 2,000-5,000 tokens (~$0.01-$0.05 per request)

**Cost control tips:**
- Monitor usage in Anthropic Console
- Set up budget alerts
- Use `--max-turns` to limit lengthy interactions

## Security Best Practices

1. **Never commit the API key** - Always use GitHub Secrets
2. **Review auto-generated PRs** - Don't auto-merge
3. **Monitor usage** - Check Anthropic Console for unusual activity
4. **Rotate keys periodically** - Update the secret every 90 days

## Learn More

- [Claude Code Action Repository](https://github.com/anthropics/claude-code-action)
- [Official Documentation](https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md)
- [Common Workflows](https://code.claude.com/docs/en/common-workflows)
- [Anthropic Documentation](https://docs.anthropic.com/)

---

**Version**: 2.0.0 (Using Official Action)
**Last Updated**: 2025-12-29
**Maintained By**: Tyler Earls
