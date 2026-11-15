import fs from 'fs';

const content = fs.readFileSync('C:/Users/Johan/.gemini/antigravity/brain/30c4bfa2-ce88-4892-a967-adc7f0c3609e/.system_generated/steps/8816/content.md', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);

const keywords = ['customer', 'account', 'templates', 'login', 'classic', 'selling plan', 'custom_liquid', 'app'];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (const kw of keywords) {
    if (line.toLowerCase().includes(kw)) {
      console.log(`[${kw}] L${i+1}: ${line.trim()}`);
      break;
    }
  }
}
