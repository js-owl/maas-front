#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Read package.json
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

// Get git information (with fallback if git is not available)
let gitHash = 'unknown';
let gitBranch = 'unknown';

try {
  gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
} catch (error) {
  console.warn('Git not available, using fallback values for git info');
  // Try to get git info from environment variables if available
  gitHash = process.env.GIT_HASH || 'unknown';
  gitBranch = process.env.GIT_BRANCH || 'unknown';
}
const buildDate = new Date().toISOString();
const buildDateFormatted = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Create build info
const buildInfo = {
  version: packageJson.version,
  name: packageJson.name,
  description: packageJson.description,
  buildDate,
  buildDateFormatted,
  gitHash,
  gitBranch,
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
console.log(`Build Date: ${buildInfo.buildDateFormatted}`);
console.log(`API Version: ${buildInfo.apiVersion}`);
