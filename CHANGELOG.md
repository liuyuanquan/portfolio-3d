# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Migrated from Webpack to Vite for faster development and build times
- Updated project structure: organized static assets into `public/img/`, `public/css/`, and `public/ammo/` directories
- Changed shader file imports to use Vite's native `?raw` query parameter instead of a custom plugin
- Switched Ammo.js from npm package to global script tag import for simpler setup

### Removed
- Removed Webpack and related dependencies (`webpack`, `webpack-cli`, `webpack-dev-server`, `babel-loader`, `compression-webpack-plugin`)
- Removed Babel dependencies (`@babel/core`, `@babel/preset-env`) - Vite handles ES modules natively
- Removed `vite-plugin-glsl` - using Vite's native `?raw` import instead
- Removed Express server (`express` package and `server.js`) - using static hosting instead
- Removed `ammo.js` npm dependency - using global script tag import
- Removed `webpack.config.js` configuration file
- Removed duplicate `style.css` from root directory
- Removed unused `src/builds/` directory

### Added
- Added Vite configuration (`vite.config.js`)
- Added `CHANGELOG.md` for tracking project changes
- Added `engines` field to `package.json` specifying Node.js and npm version requirements
- Added `homepage` and `keywords` fields to `package.json` for better npm metadata
- Improved project structure with organized asset directories

### Fixed
- Fixed ES module compatibility issues with Ammo.js
- Fixed shader file loading using Vite's native `?raw` import
- Fixed module execution issues caused by plugin conflicts

## [1.0.0] - 2020

### Added
- Initial release
- Interactive 3D portfolio built with Three.js and Ammo.js
- Physics engine integration for real-time movement and collision detection
- Desktop and mobile responsiveness
- Raycasting for user interaction
- FPS tracker for performance monitoring

