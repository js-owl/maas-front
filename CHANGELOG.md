# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-10-15

### Added
- Complete API v3.0.0 migration
- Base64 file upload system for 3D models and documents
- New calculator endpoints (`/calculate-price`)
- Updated parameter names (`tolerance_id`, `finish_id`, `cover_id`)
- Optional registration fields (`email`, `full_name`, `phone_number`)
- Version information display in footer
- Build information tracking
- Environment-based backend URL configuration

### Changed
- Authentication from URL-encoded to JSON format
- File upload from multipart to base64 JSON
- Calculator endpoints from `/anonymous-calc*` to `/calculate-price`
- Materials endpoint from `/calculator/materials` to `/materials`
- Coefficients endpoint from `/calculator/coefficients/` to `/coefficients`
- Service IDs to use hyphens (`cnc-lathe`, `cnc-milling`, `printing`)

### Fixed
- File access authentication issues
- Service ID validation errors
- Parameter naming inconsistencies
- Endpoint compatibility with v3 API

### Removed
- Old API endpoints (`/upload`, `/documents/upload`, `/anonymous-calc*`)
- URL-encoded request formats
- Multipart file upload system

## [0.0.0] - Initial Version
- Basic Vue.js 3 application structure
- Element Plus UI components
- Three.js 3D model viewing
- Pinia state management
- TypeScript support
