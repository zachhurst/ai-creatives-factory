#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Get file path from command line argument
const filePath = process.argv[2];

if (!filePath) {
  console.error('❌ Error: Please provide a file path as argument');
  process.exit(1);
}

try {
  // Read file content
  const content = fs.readFileSync(filePath, 'utf8');
  const characterCount = content.length;
  
  console.log(`📊 File: ${path.basename(filePath)}`);
  console.log(`📏 Character Count: ${characterCount.toLocaleString()}`);
  
  if (characterCount > 12000) {
    console.log(`❌ EXCEEDED LIMIT by ${(characterCount - 12000).toLocaleString()} characters`);
    console.log(`📋 Must be under 12,000 characters`);
    process.exit(1);
  } else {
    console.log(`✅ WITHIN LIMIT - ${(12000 - characterCount).toLocaleString()} characters remaining`);
    console.log(`🎉 Workflow size validated successfully!`);
  }
  
} catch (error) {
  console.error(`❌ Error reading file: ${error.message}`);
  process.exit(1);
}
