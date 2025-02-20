// @ts-ignore
const { readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function getStagedFiles() {
  const output = execSync('git diff --cached --name-only --diff-filter=ACM').toString();
  return output.split('\n').filter((filePath: string) => filePath.length > 0);
}

// @ts-ignore
function removePublicModifier(filePath: string) {
  if (filePath.endsWith('.component.ts') || filePath.endsWith('.service.ts')) {
    const fileContent = readFileSync(filePath, 'utf-8');
    const updatedContent = fileContent.replace(/^\s{2}public\s+/gm, '  ');

    if (updatedContent !== fileContent) {
      writeFileSync(filePath, updatedContent, 'utf-8');
      execSync(`git add ${filePath}`);
    }
  }
}

function processStagedFiles() {
  const stagedFiles = getStagedFiles();

  for (const filePath of stagedFiles) {
    const absolutePath = path.resolve(filePath);
    removePublicModifier(absolutePath);
  }
}

processStagedFiles();
