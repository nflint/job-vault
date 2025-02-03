/**
 * @fileoverview Script to analyze TypeScript files and identify those needing documentation
 */

import { ESLint } from 'eslint'
import * as path from 'path'
import * as fs from 'fs'

interface DocumentationIssue {
  filePath: string
  issues: number
  details: string[]
}

/**
 * Gets the list of file patterns to check, filtering out non-existent directories
 * 
 * @returns {string[]} Array of file patterns to check
 */
function getFilePatterns(): string[] {
  const basePatterns = [
    './app/**/*.ts',
    './app/**/*.tsx',
    './app/**/page.tsx',
    './app/**/layout.tsx',
    './lib/**/*.ts',
    './components/**/*.tsx',
  ]

  // Add optional directory patterns if they exist
  if (fs.existsSync('./utils')) {
    basePatterns.push('./utils/**/*.ts')
  }

  return basePatterns
}

/**
 * Analyzes TypeScript files for documentation issues
 * 
 * @returns {Promise<DocumentationIssue[]>} Array of files with documentation issues
 */
async function analyzeDocumentation(): Promise<DocumentationIssue[]> {
  const eslint = new ESLint()
  const results = await eslint.lintFiles(getFilePatterns())
  
  const issues: DocumentationIssue[] = []
  
  for (const result of results) {
    const documentationWarnings = result.messages.filter(msg => 
      msg.ruleId?.startsWith('jsdoc/') || 
      msg.ruleId?.startsWith('@typescript-eslint/explicit-function-return-type')
    )
    
    if (documentationWarnings.length > 0) {
      issues.push({
        filePath: path.relative(process.cwd(), result.filePath),
        issues: documentationWarnings.length,
        details: documentationWarnings.map(w => `Line ${w.line}: ${w.message}`)
      })
    }
  }
  
  return issues.sort((a, b) => b.issues - a.issues)
}

/**
 * Generates a markdown report of documentation issues
 * 
 * @param {DocumentationIssue[]} issues - Array of documentation issues
 * @returns {string} Markdown formatted report
 */
function generateReport(issues: DocumentationIssue[]): string {
  if (issues.length === 0) {
    return '# Documentation Analysis\n\nAll files are properly documented! 🎉\n'
  }

  const report = [
    '# Documentation Analysis\n',
    `## Summary\n`,
    `Total files with documentation issues: ${issues.length}\n`,
    '## Files Needing Documentation\n',
    'Listed by number of documentation issues:\n\n'
  ]

  issues.forEach(issue => {
    report.push(`### ${issue.filePath} (${issue.issues} issues)\n`)
    issue.details.forEach(detail => {
      report.push(`- ${detail}\n`)
    })
    report.push('\n')
  })

  return report.join('')
}

/**
 * Main function to run the documentation analysis
 */
async function main(): Promise<void> {
  try {
    console.log('Analyzing documentation...')
    const issues = await analyzeDocumentation()
    const report = generateReport(issues)
    
    const reportPath = path.join(process.cwd(), 'docs/documentation-report.md')
    fs.writeFileSync(reportPath, report)
    
    console.log(`Analysis complete! Report generated at: ${reportPath}`)
    console.log(`Files with documentation issues: ${issues.length}`)
  } catch (error) {
    console.error('Error analyzing documentation:', error)
    process.exit(1)
  }
}

main() 