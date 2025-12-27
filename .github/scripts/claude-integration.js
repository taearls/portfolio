#!/usr/bin/env node

/**
 * Claude Integration Script for GitHub Actions
 *
 * This script handles the integration between GitHub Actions and Anthropic's Claude API.
 * It processes comment requests, gathers context, calls Claude, and prepares responses.
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Environment variables
const {
  ANTHROPIC_API_KEY,
  COMMENT_BODY,
  COMMAND_TYPE,
  ISSUE_TITLE,
  ISSUE_BODY,
  IS_PULL_REQUEST,
  CONTEXT_DIR,
  GITHUB_OUTPUT,
} = process.env;

// Validate required environment variables
if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY is not set');
  process.exit(1);
}

if (!GITHUB_OUTPUT) {
  console.error('ERROR: GITHUB_OUTPUT is not set');
  process.exit(1);
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

/**
 * Read repository context files
 */
function gatherContext() {
  const context = {
    commentBody: COMMENT_BODY,
    commandType: COMMAND_TYPE,
    issueTitle: ISSUE_TITLE,
    issueBody: ISSUE_BODY,
    isPullRequest: IS_PULL_REQUEST === 'true',
  };

  if (CONTEXT_DIR && existsSync(CONTEXT_DIR)) {
    // Read file tree
    const fileTreePath = join(CONTEXT_DIR, 'file-tree.txt');
    if (existsSync(fileTreePath)) {
      context.fileTree = readFileSync(fileTreePath, 'utf-8');
    }

    // Read package.json
    const packageJsonPath = join(CONTEXT_DIR, 'package.json');
    if (existsSync(packageJsonPath)) {
      context.packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    }

    // Read changed files (for PRs)
    const changedFilesPath = join(CONTEXT_DIR, 'changed-files.txt');
    if (existsSync(changedFilesPath)) {
      context.changedFiles = readFileSync(changedFilesPath, 'utf-8')
        .split('\n')
        .filter(Boolean);
    }
  }

  return context;
}

/**
 * Build the prompt for Claude based on command type
 */
function buildPrompt(context) {
  let systemPrompt = `You are a helpful AI assistant integrated into a GitHub repository workflow. You help developers by:
- Answering questions about code and issues
- Reviewing pull requests
- Suggesting implementations for requested features
- Providing explanations and documentation

Repository context:
- Issue/PR Title: ${context.issueTitle}
- Is Pull Request: ${context.isPullRequest}
`;

  if (context.fileTree) {
    systemPrompt += `\nRepository structure:\n${context.fileTree.slice(0, 2000)}`;
  }

  if (context.packageJson) {
    systemPrompt += `\n\nProject dependencies: ${Object.keys(context.packageJson.dependencies || {}).join(', ')}`;
  }

  let userPrompt = `User comment: ${context.commentBody}`;

  if (context.issueBody) {
    userPrompt += `\n\nIssue/PR description:\n${context.issueBody}`;
  }

  if (context.changedFiles && context.changedFiles.length > 0) {
    userPrompt += `\n\nFiles changed in this PR:\n${context.changedFiles.join('\n')}`;
  }

  // Customize prompt based on command type
  switch (context.commandType) {
    case 'implement':
      systemPrompt += `\n\nYour task is to provide a detailed implementation plan or code suggestion. Be specific and actionable.`;
      break;
    case 'review':
      systemPrompt += `\n\nYour task is to review the code changes and provide constructive feedback.`;
      break;
    case 'explain':
      systemPrompt += `\n\nYour task is to provide a clear, concise explanation.`;
      break;
    default:
      systemPrompt += `\n\nProvide a helpful response to the user's request.`;
  }

  return { systemPrompt, userPrompt };
}

/**
 * Call Claude API
 */
async function callClaude(systemPrompt, userPrompt) {
  console.log('Calling Claude API...');

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const response = message.content[0].text;
    console.log('Claude API call successful');
    return response;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

/**
 * Process Claude's response and determine next actions
 */
function processResponse(response, commandType) {
  const result = {
    response: response,
    shouldImplement: false,
    changesSummary: '',
  };

  // For implementation requests, check if Claude provided code or actionable steps
  if (commandType === 'implement') {
    // Check if response contains code blocks
    const hasCodeBlocks = response.includes('```');
    const hasActionableSteps = /\d+\.\s+/g.test(response);

    if (hasCodeBlocks || hasActionableSteps) {
      result.shouldImplement = true;
      result.changesSummary = extractSummary(response);
    }
  }

  return result;
}

/**
 * Extract a summary from Claude's response
 */
function extractSummary(response) {
  // Try to extract first paragraph or first 200 characters
  const lines = response.split('\n').filter(Boolean);
  const firstMeaningfulLine = lines.find(
    (line) => line.length > 20 && !line.startsWith('#')
  );

  if (firstMeaningfulLine) {
    return firstMeaningfulLine.slice(0, 200) + (firstMeaningfulLine.length > 200 ? '...' : '');
  }

  return response.slice(0, 200) + '...';
}

/**
 * Write output to GitHub Actions output file
 */
function setOutput(key, value) {
  const output = `${key}=${value}\n`;
  writeFileSync(GITHUB_OUTPUT, output, { flag: 'a' });
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('Starting Claude integration...');
    console.log('Command type:', COMMAND_TYPE);

    // Gather context
    const context = gatherContext();

    // Build prompt
    const { systemPrompt, userPrompt } = buildPrompt(context);

    // Call Claude
    const response = await callClaude(systemPrompt, userPrompt);

    // Process response
    const result = processResponse(response, COMMAND_TYPE);

    // Set outputs for GitHub Actions
    setOutput('response', result.response.replace(/\n/g, '\\n'));
    setOutput('should_implement', result.shouldImplement);
    setOutput('changes_summary', result.changesSummary.replace(/\n/g, '\\n'));

    console.log('Claude integration completed successfully');
    console.log('Should implement:', result.shouldImplement);
  } catch (error) {
    console.error('Fatal error:', error);
    setOutput('response', `Error: ${error.message}`);
    setOutput('should_implement', 'false');
    process.exit(1);
  }
}

// Run main function
main();
