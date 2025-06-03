# JSON Field Analysis Scripts

These scripts fetch JSON data from a URL and analyze all the fields present in the JSON structure, including nested fields. The results are displayed in the console and automatically saved to a file.

## Files

- `analyze-json-fields.js` - Node.js version (no dependencies required)
- `analyze-json-fields.ts` - TypeScript version (requires tsx)

## Features

- Fetches JSON data from any HTTP/HTTPS URL
- Recursively analyzes nested objects and arrays
- Lists all unique field names found in the JSON structure
- Groups fields by nesting depth level
- Provides alphabetical sorting of field names
- Handles complex nested structures with dot notation (e.g., `user.profile.name`)
- **Automatically saves results to a file with optional custom filename**
- Creates output directories if they don't exist
- Generates timestamped filenames when no output file is specified

## Usage

### JavaScript Version
```bash
# Run with automatic filename generation
node scripts/analyze-json-fields.js <URL>

# Run with custom output file
node scripts/analyze-json-fields.js <URL> <output-file>

# Examples:
node scripts/analyze-json-fields.js https://jsonplaceholder.typicode.com/posts
node scripts/analyze-json-fields.js https://jsonplaceholder.typicode.com/posts analysis-report.txt
node scripts/analyze-json-fields.js https://api.github.com/users output/github-users.txt
```

### TypeScript Version
```bash
# Run with automatic filename generation
npx tsx scripts/analyze-json-fields.ts <URL>

# Run with custom output file
npx tsx scripts/analyze-json-fields.ts <URL> <output-file>

# Examples:
npx tsx scripts/analyze-json-fields.ts https://jsonplaceholder.typicode.com/posts
npx tsx scripts/analyze-json-fields.ts https://jsonplaceholder.typicode.com/posts analysis-report.txt
npx tsx scripts/analyze-json-fields.ts https://api.github.com/repos/microsoft/typescript output/typescript-repo.txt
npx tsx scripts/analyze-json-fields.ts https://httpbin.org/json results/httpbin-analysis.txt
```

## Output Files

### Automatic Filename Generation
When no output file is specified, the script generates a filename using this pattern:
```
json-analysis-{hostname}-{timestamp}.txt
```

Example: `json-analysis-jsonplaceholder-typicode-com-2024-01-15T10-30-45.txt`

### Custom Output Files
You can specify any filename or path. The script will:
- Create directories if they don't exist
- Support relative and absolute paths
- Overwrite existing files

## File Format

The saved report includes:
- Analysis metadata (URL, timestamp, field count)
- Complete alphabetical list of all fields
- Fields grouped by nesting depth level

### Sample Report Content
```
JSON Field Analysis Report
==========================

Source URL: https://jsonplaceholder.typicode.com/posts
Analysis Date: 2024-01-15T10:30:45.123Z
Total unique fields found: 4

All Fields (alphabetical):
--------------------------
  1. body
  2. id
  3. title
  4. userId

Fields by Depth Level:
----------------------

Depth 1 (4 fields):
  - body
  - id
  - title
  - userId
```

## Example URLs to Test

- `https://jsonplaceholder.typicode.com/posts` - Array of blog posts
- `https://jsonplaceholder.typicode.com/users` - Array of user objects with nested data
- `https://api.github.com/repos/microsoft/typescript` - Single repository object
- `https://httpbin.org/json` - Simple JSON response

## Sample Console Output

```
Fetching JSON from: https://jsonplaceholder.typicode.com/posts

=== JSON Field Analysis for: https://jsonplaceholder.typicode.com/posts ===
Total unique fields found: 4

=== All Fields (alphabetical) ===
  1. body
  2. id
  3. title
  4. userId

=== Fields by Depth Level ===

Depth 1 (4 fields):
  - body
  - id
  - title
  - userId

✅ Report saved to: json-analysis-jsonplaceholder-typicode-com-2024-01-15T10-30-45.txt
```

## Error Handling

The scripts handle common errors such as:
- Invalid URLs
- Network connection issues
- Invalid JSON responses
- HTTP errors (4xx, 5xx status codes)
- File system errors (permissions, disk space)
- Invalid output paths

## Dependencies

- **JavaScript version**: No external dependencies (uses built-in Node.js modules)
- **TypeScript version**: Requires `tsx` for running TypeScript files

To install tsx if needed:
```bash
npm install -g tsx
# or
pnpm add -g tsx
``` 