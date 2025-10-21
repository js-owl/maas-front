// Version configuration
export const VERSION_CONFIG = {
  // Application version (matches package.json)
  APP_VERSION: '3.0.0',
  
  // API version compatibility
  API_VERSION: '3.0.0',
  
  // Minimum supported API version
  MIN_API_VERSION: '3.0.0',
  
  // Build information (populated at build time)
  BUILD_INFO: {
    version: typeof __VERSION__ !== 'undefined' ? __VERSION__ : '3.0.0',
    buildDate: typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : new Date().toISOString(),
    gitHash: typeof __GIT_HASH__ !== 'undefined' ? __GIT_HASH__ : 'unknown',
    gitBranch: typeof __GIT_BRANCH__ !== 'undefined' ? __GIT_BRANCH__ : 'unknown',
    environment: import.meta.env.MODE || 'development'
  }
} as const;

// Version comparison utilities
export function compareVersions(version1: string, version2: string): number {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;
    
    if (v1part > v2part) return 1;
    if (v1part < v2part) return -1;
  }
  
  return 0;
}

// Check if API version is compatible
export function isApiVersionCompatible(apiVersion: string): boolean {
  return compareVersions(apiVersion, VERSION_CONFIG.MIN_API_VERSION) >= 0;
}

// Get version display string
export function getVersionDisplay(): string {
  return `v${VERSION_CONFIG.APP_VERSION}`;
}

// Get full version info
export function getFullVersionInfo() {
  return {
    app: VERSION_CONFIG.APP_VERSION,
    api: VERSION_CONFIG.API_VERSION,
    build: VERSION_CONFIG.BUILD_INFO
  };
}
