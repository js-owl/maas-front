#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Read package.json
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

// Get git information (prioritize environment variables, fallback to git commands)
let gitHash = 'unknown';
let gitBranch = 'unknown';
let gitTag = 'unknown';

// First, try to get from environment variables (from CI/CD or build args)
gitHash = process.env.GIT_HASH || process.env.CI_COMMIT_SHA || 'unknown';
gitBranch = process.env.GIT_BRANCH || process.env.CI_COMMIT_REF_NAME || 'unknown';
gitTag = process.env.GIT_TAG || process.env.CI_COMMIT_TAG || 'unknown';

// If environment variables are not available, try git commands as fallback
if (gitHash === 'unknown' || gitBranch === 'unknown' || gitTag === 'unknown') {
  try {
    if (gitHash === 'unknown') {
      gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    }
    if (gitBranch === 'unknown') {
      gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    }
    if (gitTag === 'unknown') {
      // Try to get the current tag
      try {
        gitTag = execSync('git describe --tags --exact-match HEAD', { encoding: 'utf8' }).trim();
      } catch (tagError) {
        // No tag found, try to get latest tag
        try {
          gitTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
        } catch (latestTagError) {
          gitTag = 'unknown';
        }
      }
    }
  } catch (error) {
    console.warn('Git commands failed, using environment variables or fallback values');
  }
}
const buildDate = new Date().toISOString();
const buildDateFormatted = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Create build info
const buildInfo = {
  // Use Git tag as primary version if available, otherwise use package.json version
  version: gitTag !== 'unknown' ? gitTag : packageJson.version,
  name: packageJson.name,
  description: packageJson.description,
  buildDate,
  buildDateFormatted,
  gitHash,
  gitBranch,
  gitTag,
  apiVersion: '3.0.0',
  nodeVersion: process.version,
  buildEnvironment: process.env.NODE_ENV || 'development'
};

// Write build info to public folder
writeFileSync('public/build-info.json', JSON.stringify(buildInfo, null, 2));

console.log('Build info generated:');
console.log(`Version: ${buildInfo.version}`);
console.log(`Git Hash: ${buildInfo.gitHash}`);
console.log(`Git Branch: ${buildInfo.gitBranch}`);
console.log(`Git Tag: ${buildInfo.gitTag}`);
console.log(`Build Date: ${buildInfo.buildDateFormatted}`);
console.log(`API Version: ${buildInfo.apiVersion}`);
