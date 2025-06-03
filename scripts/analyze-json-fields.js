#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Recursively extract all field names from an object or array of objects
 * @param {any} data - The data to analyze
 * @param {Set} fields - Set to store unique field names
 * @param {string} prefix - Prefix for nested fields
 */
function extractFields(data, fields, prefix = '') {
  if (Array.isArray(data)) {
    // If it's an array, process each item
    data.forEach(item => extractFields(item, fields, prefix));
  } else if (data !== null && typeof data === 'object') {
    // If it's an object, process each property
    Object.keys(data).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      fields.add(fullKey);
      
      // Recursively process nested objects/arrays
      extractFields(data[key], fields, fullKey);
    });
  }
}

/**
 * Build a hierarchical tree structure from field names
 * @param {string[]} fields - Array of field names with dot notation
 * @returns {Object} - Tree structure representing field hierarchy
 */
function buildFieldTree(fields) {
  const tree = {};
  
  fields.forEach(field => {
    const parts = field.split('.');
    let current = tree;
    
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          children: {},
          isLeaf: index === parts.length - 1,
          fullPath: parts.slice(0, index + 1).join('.'),
          depth: index + 1
        };
      }
      current = current[part].children;
    });
  });
  
  return tree;
}

/**
 * Generate tree display with proper indentation and formatting
 * @param {Object} tree - Tree structure
 * @param {number} indent - Current indentation level
 * @param {string} prefix - Prefix for tree formatting
 * @returns {string} - Formatted tree string
 */
function generateTreeDisplay(tree, indent = 0, prefix = '') {
  let result = '';
  const keys = Object.keys(tree).sort();
  
  keys.forEach((key, index) => {
    const node = tree[key];
    const isLast = index === keys.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const childPrefix = isLast ? '    ' : '│   ';
    
    result += prefix + connector + key + '\n';
    
    // Recursively process children
    if (Object.keys(node.children).length > 0) {
      result += generateTreeDisplay(node.children, indent + 1, prefix + childPrefix);
    }
  });
  
  return result;
}

/**
 * Generate flat list grouped by parent
 * @param {Object} tree - Tree structure
 * @param {string} parentPath - Current parent path
 * @returns {Object} - Object with parent paths as keys and their children as values
 */
function generateParentChildGroups(tree, parentPath = '') {
  const groups = {};
  
  Object.keys(tree).forEach(key => {
    const node = tree[key];
    const currentPath = parentPath ? `${parentPath}.${key}` : key;
    
    // If this node has children, create a group for it
    if (Object.keys(node.children).length > 0) {
      const children = [];
      Object.keys(node.children).forEach(childKey => {
        children.push(childKey);
      });
      groups[currentPath] = children.sort();
      
      // Recursively process nested groups
      const nestedGroups = generateParentChildGroups(node.children, currentPath);
      Object.assign(groups, nestedGroups);
    }
  });
  
  return groups;
}

/**
 * Fetch JSON data from a URL
 * @param {string} url - The URL to fetch
 * @returns {Promise<any>} - Promise that resolves to parsed JSON data
 */
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to fetch URL: ${error.message}`));
    });
  });
}

/**
 * Generate the analysis report as a string with hierarchical structure
 * @param {string[]} sortedFields - Sorted array of field names
 * @param {Object} fieldsByDepth - Fields grouped by depth
 * @param {Object} tree - Hierarchical tree structure
 * @param {Object} parentChildGroups - Parent-child groupings
 * @param {string} url - The original URL
 * @returns {string} - Formatted report
 */
function generateReport(sortedFields, fieldsByDepth, tree, parentChildGroups, url) {
  let report = '';
  
  report += `JSON Field Analysis Report\n`;
  report += `==========================\n\n`;
  report += `Source URL: ${url}\n`;
  report += `Analysis Date: ${new Date().toISOString()}\n`;
  report += `Total unique fields found: ${sortedFields.length}\n\n`;
  
  // Tree structure view
  report += `Field Hierarchy (Tree View):\n`;
  report += `----------------------------\n`;
  report += generateTreeDisplay(tree);
  
  // Parent-child relationships
  report += `\nParent-Child Relationships:\n`;
  report += `---------------------------\n`;
  const parentKeys = Object.keys(parentChildGroups).sort();
  if (parentKeys.length === 0) {
    report += `No nested fields found - all fields are at root level.\n`;
  } else {
    parentKeys.forEach(parent => {
      const children = parentChildGroups[parent];
      report += `\n${parent}:\n`;
      children.forEach(child => {
        report += `  └── ${child}\n`;
      });
    });
  }
  
  // Root level fields
  const rootFields = sortedFields.filter(field => !field.includes('.'));
  if (rootFields.length > 0) {
    report += `\nRoot Level Fields (${rootFields.length}):\n`;
    report += `------------------------\n`;
    rootFields.forEach((field, index) => {
      report += `${(index + 1).toString().padStart(3, ' ')}. ${field}\n`;
    });
  }
  
  // All fields alphabetically
  report += `\nAll Fields (alphabetical):\n`;
  report += `--------------------------\n`;
  sortedFields.forEach((field, index) => {
    report += `${(index + 1).toString().padStart(3, ' ')}. ${field}\n`;
  });
  
  // Fields by depth level
  report += `\nFields by Depth Level:\n`;
  report += `----------------------\n`;
  Object.keys(fieldsByDepth).sort((a, b) => parseInt(a) - parseInt(b)).forEach(depth => {
    report += `\nDepth ${depth} (${fieldsByDepth[depth].length} fields):\n`;
    fieldsByDepth[depth].forEach(field => {
      report += `  - ${field}\n`;
    });
  });
  
  return report;
}

/**
 * Save report to file
 * @param {string} content - Report content
 * @param {string} outputFile - Output file path
 */
function saveToFile(content, outputFile) {
  try {
    // Ensure the directory exists
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, content, 'utf8');
    console.log(`\n✅ Report saved to: ${outputFile}`);
  } catch (error) {
    console.error(`❌ Failed to save file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Main function to analyze JSON fields from a URL
 */
async function analyzeJsonFields() {
  const url = process.argv[2];
  const outputFile = process.argv[3];
  
  if (!url) {
    console.error('Usage: node analyze-json-fields.js <URL> [output-file]');
    console.error('');
    console.error('Examples:');
    console.error('  node analyze-json-fields.js https://jsonplaceholder.typicode.com/posts');
    console.error('  node analyze-json-fields.js https://jsonplaceholder.typicode.com/posts analysis-report.txt');
    console.error('  node analyze-json-fields.js https://api.github.com/users output/github-users.txt');
    process.exit(1);
  }
  
  try {
    console.log(`Fetching JSON from: ${url}`);
    const jsonData = await fetchJson(url);
    
    const fields = new Set();
    extractFields(jsonData, fields);
    
    const sortedFields = Array.from(fields).sort();
    
    // Build hierarchical tree structure
    const tree = buildFieldTree(sortedFields);
    const parentChildGroups = generateParentChildGroups(tree);
    
    // Group fields by depth level
    const fieldsByDepth = {};
    sortedFields.forEach(field => {
      const depth = field.split('.').length;
      if (!fieldsByDepth[depth]) {
        fieldsByDepth[depth] = [];
      }
      fieldsByDepth[depth].push(field);
    });
    
    // Display results to console
    console.log('\n=== JSON Field Analysis ===');
    console.log(`Total unique fields found: ${sortedFields.length}`);
    
    console.log('\n=== Field Hierarchy (Tree View) ===');
    console.log(generateTreeDisplay(tree));
    
    console.log('=== Parent-Child Relationships ===');
    const parentKeys = Object.keys(parentChildGroups).sort();
    if (parentKeys.length === 0) {
      console.log('No nested fields found - all fields are at root level.');
    } else {
      parentKeys.forEach(parent => {
        const children = parentChildGroups[parent];
        console.log(`\n${parent}:`);
        children.forEach(child => {
          console.log(`  └── ${child}`);
        });
      });
    }
    
    // Root level fields
    const rootFields = sortedFields.filter(field => !field.includes('.'));
    if (rootFields.length > 0) {
      console.log(`\n=== Root Level Fields (${rootFields.length}) ===`);
      rootFields.forEach((field, index) => {
        console.log(`${index + 1}. ${field}`);
      });
    }
    
    // Save to file if output path is provided
    if (outputFile) {
      const report = generateReport(sortedFields, fieldsByDepth, tree, parentChildGroups, url);
      saveToFile(report, outputFile);
    } else {
      // Generate default filename if none provided
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/\./g, '-');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const defaultFile = `json-analysis-${hostname}-${timestamp}.txt`;
      
      const report = generateReport(sortedFields, fieldsByDepth, tree, parentChildGroups, url);
      saveToFile(report, defaultFile);
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
analyzeJsonFields(); 