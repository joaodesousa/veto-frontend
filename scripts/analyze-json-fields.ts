#!/usr/bin/env npx tsx

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

interface FieldAnalysis {
  totalFields: number;
  fields: string[];
  fieldsByDepth: Record<number, string[]>;
}

/**
 * Recursively extract all field names from an object or array of objects
 */
function extractFields(data: any, fields: Set<string>, prefix: string = ''): void {
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
 * Fetch JSON data from a URL using modern fetch API
 */
async function fetchJson(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch or parse JSON: ${error.message}`);
    }
    throw new Error('Failed to fetch or parse JSON: Unknown error');
  }
}

/**
 * Analyze JSON structure and return field information
 */
function analyzeJsonStructure(jsonData: any): FieldAnalysis {
  const fields = new Set<string>();
  extractFields(jsonData, fields);
  
  const sortedFields = Array.from(fields).sort();
  
  // Group fields by depth level
  const fieldsByDepth: Record<number, string[]> = {};
  sortedFields.forEach(field => {
    const depth = field.split('.').length;
    if (!fieldsByDepth[depth]) {
      fieldsByDepth[depth] = [];
    }
    fieldsByDepth[depth].push(field);
  });
  
  return {
    totalFields: sortedFields.length,
    fields: sortedFields,
    fieldsByDepth
  };
}

/**
 * Generate the analysis report as a string
 */
function generateReport(analysis: FieldAnalysis, url: string): string {
  let report = '';
  
  report += `JSON Field Analysis Report\n`;
  report += `==========================\n\n`;
  report += `Source URL: ${url}\n`;
  report += `Analysis Date: ${new Date().toISOString()}\n`;
  report += `Total unique fields found: ${analysis.totalFields}\n\n`;
  
  report += `All Fields (alphabetical):\n`;
  report += `--------------------------\n`;
  analysis.fields.forEach((field, index) => {
    report += `${(index + 1).toString().padStart(3, ' ')}. ${field}\n`;
  });
  
  report += `\nFields by Depth Level:\n`;
  report += `----------------------\n`;
  Object.keys(analysis.fieldsByDepth)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach(depth => {
      const fieldsAtDepth = analysis.fieldsByDepth[depth];
      report += `\nDepth ${depth} (${fieldsAtDepth.length} fields):\n`;
      fieldsAtDepth.forEach(field => {
        report += `  - ${field}\n`;
      });
    });
  
  return report;
}

/**
 * Save report to file
 */
function saveToFile(content: string, outputFile: string): void {
  try {
    // Ensure the directory exists
    const dir = dirname(outputFile);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    writeFileSync(outputFile, content, 'utf8');
    console.log(`\n✅ Report saved to: ${outputFile}`);
  } catch (error) {
    console.error(`❌ Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

/**
 * Format and display the analysis results
 */
function displayResults(analysis: FieldAnalysis, url: string): void {
  console.log(`\n=== JSON Field Analysis for: ${url} ===`);
  console.log(`Total unique fields found: ${analysis.totalFields}`);
  
  console.log('\n=== All Fields (alphabetical) ===');
  analysis.fields.forEach((field, index) => {
    console.log(`${(index + 1).toString().padStart(3, ' ')}. ${field}`);
  });
  
  console.log('\n=== Fields by Depth Level ===');
  Object.keys(analysis.fieldsByDepth)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach(depth => {
      const fieldsAtDepth = analysis.fieldsByDepth[depth];
      console.log(`\nDepth ${depth} (${fieldsAtDepth.length} fields):`);
      fieldsAtDepth.forEach(field => {
        console.log(`  - ${field}`);
      });
    });
}

/**
 * Generate default filename based on URL and timestamp
 */
function generateDefaultFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/\./g, '-');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `json-analysis-${hostname}-${timestamp}.txt`;
  } catch {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `json-analysis-${timestamp}.txt`;
  }
}

/**
 * Main function to analyze JSON fields from a URL
 */
async function main(): Promise<void> {
  const url = process.argv[2];
  const outputFile = process.argv[3];
  
  if (!url) {
    console.error('Usage: npx tsx analyze-json-fields.ts <URL> [output-file]');
    console.error('   or: node analyze-json-fields.js <URL> [output-file]');
    console.error('');
    console.error('Examples:');
    console.error('  npx tsx analyze-json-fields.ts https://jsonplaceholder.typicode.com/posts');
    console.error('  npx tsx analyze-json-fields.ts https://jsonplaceholder.typicode.com/posts analysis-report.txt');
    console.error('  npx tsx analyze-json-fields.ts https://api.github.com/repos/microsoft/typescript output/typescript-repo.txt');
    console.error('  npx tsx analyze-json-fields.ts https://httpbin.org/json results/httpbin-analysis.txt');
    process.exit(1);
  }
  
  try {
    console.log(`Fetching JSON from: ${url}`);
    console.log('Please wait...\n');
    
    const jsonData = await fetchJson(url);
    const analysis = analyzeJsonStructure(jsonData);
    
    // Display results to console
    displayResults(analysis, url);
    
    // Generate and save report
    const report = generateReport(analysis, url);
    const finalOutputFile = outputFile || generateDefaultFilename(url);
    saveToFile(report, finalOutputFile);
    
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    process.exit(1);
  }
}

// Run the script
main(); 