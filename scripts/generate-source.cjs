const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const bytes = fs.readFileSync(path.join(root, 'source', 'Program.cs'));
const hash = crypto.createHash('sha256').update(bytes).digest('hex');
fs.writeFileSync(path.join(root, 'data', 'source-text.js'), `/* Generated from source/Program.cs. Do not edit manually. SHA-256: ${hash} */\nwindow.SF_SOURCE_SHA256 = ${JSON.stringify(hash)};\nwindow.SF_SOURCE_TEXT = ${JSON.stringify(bytes.toString('utf8'))};\n`);
console.log(`Source mirror generated. SHA-256: ${hash}`);
