#!/usr/bin/env node

/**
 * Production verification script for SQLite WASM setup
 * This script verifies that all necessary files are present for production deployment
 */

import { existsSync, statSync, readdirSync } from 'fs';

const requiredFiles = [
  'dist/index.html',
  'dist/sqlite3.wasm',
  'dist/sqlite3-worker1.js',
  'dist/sqlite3-worker1-promiser.js',
  'dist/sqlite3-opfs-async-proxy.js',
  'dist/assets/sqlite3.wasm'
];

console.log('🔍 Verifying production build for SQLite WASM...\n');

let allGood = true;

// Check required files
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  if (existsSync(file)) {
    const stats = statSync(file);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`  ✅ ${file} (${size} KB)`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Check for CSS and JS assets (with hash)
console.log('\n🎨 Checking hashed assets:');
const distAssetsDir = 'dist/assets';
if (existsSync(distAssetsDir)) {
  const files = readdirSync(distAssetsDir);
  
  const cssFiles = files.filter(f => f.startsWith('index-') && f.endsWith('.css'));
  const jsFiles = files.filter(f => f.startsWith('index-') && f.endsWith('.js'));
  
  if (cssFiles.length > 0) {
    console.log(`  ✅ CSS bundle: ${cssFiles[0]}`);
  } else {
    console.log('  ❌ CSS bundle - MISSING');
    allGood = false;
  }
  
  if (jsFiles.length > 0) {
    console.log(`  ✅ JS bundle: ${jsFiles[0]}`);
  } else {
    console.log('  ❌ JS bundle - MISSING');
    allGood = false;
  }
}

// Check WASM file size (should be substantial)
console.log('\n📊 WASM file analysis:');
const wasmFile = 'dist/sqlite3.wasm';
if (existsSync(wasmFile)) {
  const stats = statSync(wasmFile);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  if (stats.size > 500000) { // Should be > 500KB
    console.log(`  ✅ SQLite WASM size: ${sizeMB} MB (Good)`);
  } else {
    console.log(`  ⚠️  SQLite WASM size: ${sizeMB} MB (Seems small)`);
  }
}

// Check deployment requirements
console.log('\n🔧 Deployment requirements:');
console.log('  ℹ️  For production deployment, ensure your web server sets:');
console.log('     - Cross-Origin-Embedder-Policy: require-corp');
console.log('     - Cross-Origin-Opener-Policy: same-origin');
console.log('  ℹ️  These headers are required for SharedArrayBuffer support');
console.log('  📖 See DEPLOYMENT.md for platform-specific configurations');

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 Production build verification PASSED!');
  console.log('✅ All SQLite WASM files are present and ready for deployment');
  process.exit(0);
} else {
  console.log('❌ Production build verification FAILED!');
  console.log('🔧 Please run "npm run build" to regenerate the build');
  process.exit(1);
}