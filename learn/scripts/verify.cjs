const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

// Resolve everything from this script, so the learn folder can be moved or copied.
const root = path.resolve(__dirname, '..');
const expectedTypes = ['Label', 'Button', 'TextBox', 'RadioButton', 'CheckBox',
  'PictureBox', 'GroupBox', 'ListBox', 'ComboBox', 'DateTimePicker',
  'StatusStrip', 'ToolStripStatusLabel', 'ProgressBar', 'Timer'];

function verify() {
  const source = fs.readFileSync(path.join(root, 'source/1.cs'));
  const sourceText = source.toString('utf8');
  const sourceLines = sourceText.split(/\r\n|\n|\r/);
  if (sourceLines.at(-1) === '') sourceLines.pop();
  assert.equal(sourceLines.length, 208, 'The C# source must contain 208 physical lines');
  const sha256 = crypto.createHash('sha256').update(source).digest('hex');

  const parentSource = path.resolve(root, '..', 'source/1.cs');
  const parentSourceChecked = fs.existsSync(parentSource);
  if (parentSourceChecked) {
    assert(source.equals(fs.readFileSync(parentSource)), 'Learning and exhibition source bytes differ');
  }

  const context = vm.createContext({window: {}});
  for (const file of ['data/source-text.js', 'data/simple-controls.js', 'code.js', 'data/line-notes.js']) {
    const filePath = path.join(root, file);
    assert(fs.existsSync(filePath), `Missing ${file}; generate this file before verification`);
    vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, {filename: file, timeout: 1000});
  }
  const w = context.window;
  assert.equal(typeof w.SF_SOURCE_TEXT, 'string', 'SF_SOURCE_TEXT must be a string');
  assert(Buffer.from(w.SF_SOURCE_TEXT, 'utf8').equals(source), 'Embedded source bytes differ from source/1.cs');
  assert.equal(w.SF_SOURCE_SHA256, sha256, 'Source mirror SHA-256 is incorrect');
  assert.equal(w.SF_LEARNING_SOURCE_SHA256, sha256, 'Line explanations refer to a different source SHA-256');
  assert.deepEqual(Array.from(w.SF_CODE.lines()), sourceLines, 'Rendered source lines differ from physical source lines');

  assert(Array.isArray(w.SF_SIMPLE_CONTROLS), 'Controls must be an array');
  const types = Array.from(w.SF_SIMPLE_CONTROLS, control => control.type);
  assert.equal(types.length, 14, 'Exactly 14 control types are required');
  assert.equal(new Set(types).size, 14, 'Control types must be unique');
  assert.deepEqual([...types].sort(), [...expectedTypes].sort(), 'Unexpected control type');
  let snippets = 0;
  for (const control of w.SF_SIMPLE_CONTROLS) {
    assert(typeof control.name === 'string' && control.name.trim(), `Missing Chinese name: ${control.type}`);
    assert(typeof control.description === 'string' && control.description.trim(), `Missing description: ${control.type}`);
    assert(Array.isArray(control.ranges) && control.ranges.length, `Missing source ranges: ${control.type}`);
    const seen = new Set();
    for (const range of control.ranges) {
      assert(Number.isInteger(range.start) && Number.isInteger(range.end), `Non-integer source range: ${control.type}`);
      assert(range.start >= 1 && range.start <= range.end && range.end <= sourceLines.length,
        `Source range out of bounds: ${control.type} ${range.start}-${range.end}`);
      assert(typeof range.label === 'string' && range.label.trim(), `Missing range label: ${control.type}`);
      assert.equal(w.SF_CODE.text(range.start, range.end), sourceLines.slice(range.start - 1, range.end).join('\n'),
        `Snippet does not match original source: ${control.type}`);
      for (let line = range.start; line <= range.end; line++) {
        assert(!seen.has(line), `Duplicate source line within one control: ${control.type}:${line}`);
        seen.add(line);
      }
      snippets++;
    }
  }

  const notes = w.SF_LINE_NOTES;
  assert(notes && typeof notes === 'object' && !Array.isArray(notes), 'SF_LINE_NOTES must be a line-number object');
  const expectedKeys = Array.from({length: sourceLines.length}, (_, i) => String(i + 1));
  assert.deepEqual(Object.keys(notes).sort((a, b) => Number(a) - Number(b)), expectedKeys,
    'Explanations must contain exactly the keys 1 through 208');
  let explanationCount = 0;
  for (const key of expectedKeys) {
    assert(Array.isArray(notes[key]) && notes[key].length > 0, `Line ${key} has no explanations`);
    for (const note of notes[key]) {
      assert(typeof note === 'string' && note.trim(), `Line ${key} contains an empty explanation`);
      assert(/\p{Script=Han}/u.test(note), `Line ${key} contains an explanation without Chinese text`);
      explanationCount++;
    }
  }

  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  let localReferences = 0;
  for (const match of html.matchAll(/\b(?:src|href)\s*=\s*(["'])(.*?)\1/gi)) {
    const ref = match[2];
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(ref)) continue;
    const localPath = decodeURIComponent(ref.split(/[?#]/)[0]);
    if (!localPath) continue;
    assert(fs.existsSync(path.resolve(root, localPath)), `Missing local HTML reference: ${ref}`);
    localReferences++;
  }

  const scriptFiles = [];
  function checkJavaScript(directory) {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      const filePath = path.join(directory, entry.name);
      if (entry.isDirectory()) checkJavaScript(filePath);
      else if (/\.(?:js|cjs)$/.test(entry.name)) {
        const relative = path.relative(root, filePath);
        new vm.Script(fs.readFileSync(filePath, 'utf8'), {filename: relative});
        scriptFiles.push(relative);
      }
    }
  }
  checkJavaScript(root);
  assert(scriptFiles.includes('app.js'), 'app.js is missing');

  const unescape = value => value.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  for (const line of sourceLines) {
    assert.equal(unescape(w.SF_CODE.highlight(line)), line, 'Syntax highlighting changes source text');
  }

  console.log(JSON.stringify({passed: true, controls: types.length, snippets,
    sourceLines: sourceLines.length, explainedLines: expectedKeys.length, explanationCount,
    sha256, parentSourceChecked, localReferences, syntaxCheckedFiles: scriptFiles.length}, null, 2));
}

try {
  verify();
} catch (error) {
  console.error(`Verification failed: ${error.message}`);
  process.exitCode = 1;
}
