# Claude Assistant Workflow

This GitHub Actions workflow enables Claude (Anthropic's AI assistant) to respond to comments on issues and pull requests, and optionally implement requested changes automatically.

## Features

- 🤖 **Automatic Response**: Claude responds to mentions in issue/PR comments
- 💬 **Multiple Command Types**: Support for implementation, review, explanation, and general help
- 🔄 **Auto-Implementation**: Can create PRs with code changes based on requests
- 🛡️ **Safety First**: Built-in protections against bot loops and unauthorized access
- 📝 **Context-Aware**: Gathers repository structure and PR changes for informed responses

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

### 3. Deploy the Workflow

The workflow is already configured in `.github/workflows/claude-assistant.yml`. It will automatically run when:

- Someone comments on an issue
- Someone comments on a pull request
- Someone adds a review comment on a PR

## Usage

### Triggering Claude

Claude responds when you mention it in a comment using one of these patterns:

#### General Format

```
@claude <your request>
```

#### Slash Command Format

```
/claude <your request>
```

### Command Types

The workflow automatically detects the type of request based on keywords:

#### 1. Implementation Requests

Triggers when you ask Claude to implement, code, fix, or create something.

**Examples:**

```
@claude implement a dark mode toggle for the settings page
@claude fix the bug in the authentication flow
@claude create a new component for user profiles
/claude add error handling to the API calls
```

**What happens:**

- Claude analyzes the request and repository context
- Provides an implementation plan or code suggestion
- If the response includes code, Claude can automatically:
  - Create a new branch (`claude/auto-implementation-<run-id>`)
  - Commit the changes
  - Open a pull request for review

#### 2. Review Requests

Triggers when you ask Claude to review, check, or analyze code.

**Examples:**

```
@claude review this pull request
@claude check if there are any security issues
@claude analyze the performance of this code
```

**What happens:**

- Claude examines the PR changes
- Provides constructive feedback
- Suggests improvements

#### 3. Explanation Requests

Triggers when you ask Claude to help, explain, or answer questions.

**Examples:**

```
@claude help me understand this error
@claude explain how the state management works
@claude what does this function do?
```

**What happens:**

- Claude provides a clear, detailed explanation
- References relevant code and documentation

#### 4. General Responses

For any other mentions that don't match the above patterns.

**Examples:**

```
@claude what do you think about this approach?
@claude any suggestions for improving this?
```

## How It Works

### Workflow Steps

1. **Trigger Detection**
   - Listens for new comments on issues and PRs
   - Filters out bot comments to prevent loops
   - Checks for `@claude` or `/claude` mentions

2. **Context Gathering**
   - Extracts comment details (body, author, URL)
   - Collects issue/PR information (title, description, number)
   - For PRs: gathers branch names, changed files, and diffs
   - Builds repository context (file tree, dependencies)

3. **Command Parsing**
   - Analyzes the comment to determine intent
   - Classifies as: implement, review, explain, or respond

4. **Claude API Call**
   - Constructs a detailed prompt with all context
   - Calls Anthropic's Claude API (Sonnet 4.5 model)
   - Receives and processes the response

5. **Action Execution**
   - **Always**: Posts Claude's response as a comment
   - **For implementations** (if code is generated):
     - Creates a new branch
     - Applies the changes
     - Commits with descriptive message
     - Pushes to remote
     - Opens a pull request
     - Comments on original issue with PR link

6. **Error Handling**
   - If anything fails, posts an error comment
   - Includes link to workflow run logs

## Safety Features

### 1. Bot Loop Prevention

```yaml
if: !github.event.comment.user.login.endsWith('[bot]')
```

The workflow will not trigger on comments from bot accounts, preventing infinite response loops.

### 2. Explicit Triggers Only

Claude only responds when explicitly mentioned with `@claude` or `/claude`. It won't respond to every comment.

### 3. Manual PR Review Required

All auto-generated PRs must be manually reviewed and merged. The workflow cannot bypass branch protection rules.

### 4. Audit Trail

Every action is logged and traceable:

- Workflow run logs
- Commit messages reference the original comment
- PR descriptions link to the triggering issue/comment

## Configuration

### Customizing Triggers

Edit `.github/workflows/claude-assistant.yml` to modify trigger conditions:

```yaml
# Current: triggers on @claude or /claude
if: |
  !github.event.comment.user.login.endsWith('[bot]') &&
  (contains(github.event.comment.body, '@claude') ||
   contains(github.event.comment.body, '/claude'))
```

### Changing the Model

Edit `.github/scripts/claude-integration.js` to use a different model:

```javascript
const message = await anthropic.messages.create({
  model: "claude-sonnet-4-20241022", // Change this to another model
  max_tokens: 4096,
  // ...
});
```

Available models (check Anthropic's documentation for the latest):

- `claude-opus-4-20241022` - Most capable, slower
- `claude-sonnet-4-20241022` - Balanced (recommended, currently used)
- `claude-haiku-3-20240307` - Fastest, more concise

### Adjusting Permissions

The workflow requires these permissions (set in `.github/workflows/claude-assistant.yml`):

```yaml
permissions:
  issues: write # To comment on issues
  pull-requests: write # To comment on and create PRs
  contents: write # To commit changes
  actions: read # To read workflow context
```

Reduce permissions if you don't want auto-implementation:

```yaml
permissions:
  issues: write
  pull-requests: write
  contents: read # Changed from write
```

## Examples

### Example 1: Bug Fix Request

**Comment:**

```
@claude fix the memory leak in the useEffect hook on the Dashboard component
```

**Claude's Response:**

```
## 🤖 Claude Assistant Response

I've identified the memory leak in `src/components/Dashboard.tsx:42`. The issue is that
the event listener isn't being cleaned up.

Here's the fix:

[code snippet with fix]

I'll create a PR with this change.
```

**Result:**

- New PR created: `🤖 Auto-implementation: fix the memory leak...`
- PR includes the fix with tests
- Links back to original issue

### Example 2: Code Review

**Comment:**

```
@claude review this PR for security issues
```

**Claude's Response:**

```
## 🤖 Claude Assistant Response

I've reviewed the changes in this PR. Here are my findings:

✅ **Positive:**
- Input validation is correctly implemented
- SQL queries use parameterized statements

⚠️ **Concerns:**
- Line 45: API key is logged in error message (potential leak)
- Line 78: User input isn't sanitized before HTML rendering (XSS risk)

**Recommendations:**
[detailed suggestions]
```

### Example 3: Implementation Request

**Comment:**

```
/claude implement pagination for the projects list with 12 items per page
```

**Claude's Response:**

```
## 🤖 Claude Assistant Response

I'll implement pagination for the projects list. Here's my plan:

1. Add pagination state to ProjectsList component
2. Create Pagination component with prev/next controls
3. Update API calls to support page parameter
4. Add URL parameter syncing

✅ I've created PR #123 with the requested implementation.

Please review: [PR link]
```

## Troubleshooting

### Workflow Not Triggering

**Check:**

1. Is the workflow file in `.github/workflows/claude-assistant.yml`?
2. Did you mention `@claude` or use `/claude` in the comment?
3. Is the comment from a bot account? (Bot comments are ignored)
4. Check the Actions tab for workflow runs and errors

### API Key Errors

**Error message:** `ERROR: ANTHROPIC_API_KEY is not set`

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

### Claude Responds But Can't Create PRs

**Possible causes:**

1. `contents: write` permission not enabled
2. Branch protection rules preventing force pushes
3. Network issues during git push

**Fix:**

- Check workflow logs for specific error messages
- Verify all permissions are enabled
- Ensure branch protection allows Claude branches

## Limitations

- **Rate Limits**: Anthropic API has rate limits; excessive use may be throttled
- **Context Size**: Very large PRs may exceed Claude's context window
- **Code Quality**: Auto-generated code should always be reviewed before merging
- **Complex Changes**: Multi-file refactorings may require manual intervention

## Cost Considerations

Each Claude API call consumes tokens and incurs costs:

- **Sonnet 4.5**: ~$3 per million input tokens, ~$15 per million output tokens
- Typical comment response: 2,000-5,000 tokens (~$0.01-$0.05 per request)

**Cost control tips:**

- Use Haiku model for simple requests (cheaper)
- Limit context by excluding large files
- Set up budget alerts in Anthropic Console

## Security Best Practices

1. **Never commit the API key** - Always use GitHub Secrets
2. **Review auto-generated PRs** - Don't auto-merge
3. **Limit who can trigger** - Consider adding author validation
4. **Monitor usage** - Check Anthropic Console for unusual activity
5. **Rotate keys periodically** - Update the secret every 90 days

### Built-in Security Features

The workflow includes several security protections:

- **Command Injection Prevention**: User input is sanitized using `github-script` instead of bash
- **String Injection Protection**: All template interpolations use `toJSON()` for safe escaping
- **File Operation Validation**: Prevents modification of `.git/` and `.github/workflows/`
- **Protected Files Warning**: Alerts on changes to `.env` or secret files
- **API Timeout**: 60-second timeout prevents hanging requests
- **Concurrency Control**: Prevents multiple simultaneous runs on the same issue/PR
- **Bot Loop Prevention**: Automatically ignores comments from bot accounts

## Future Enhancements

Potential improvements for future versions:

- [ ] Support for multiple approval workflows
- [ ] Integration with project management tools
- [ ] Custom prompt templates per repository
- [ ] Scheduled code audits and suggestions
- [ ] Support for code review directly in PR diffs

## Support

For issues or questions:

1. Check the [workflow logs](../../actions/workflows/claude-assistant.yml)
2. Review this documentation
3. Open an issue in the repository
4. Check Anthropic's [documentation](https://docs.anthropic.com/)

---

**Version**: 1.0.0
**Last Updated**: 2025-12-27
**Maintained By**: Tyler Earls
