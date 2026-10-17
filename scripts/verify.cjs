const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const context = {window:{}};
vm.createContext(context);
for (const file of ['data/source-text.js', 'data/simple-controls.js', 'code.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename:file});
}
const w = context.window;
const source = fs.readFileSync(path.join(root, 'source/Program.cs'));
assert.equal(w.SF_SOURCE_TEXT, source.toString('utf8'), 'Source mirror differs from original');
assert.equal(w.SF_SOURCE_SHA256, crypto.createHash('sha256').update(source).digest('hex'));
const lines = w.SF_CODE.lines();
const core = ['Label','Button','TextBox','RadioButton','CheckBox','PictureBox','GroupBox','ListBox','ComboBox','DateTimePicker','StatusStrip','ToolStripStatusLabel','ProgressBar','Timer'];
assert.deepEqual(Array.from(w.SF_SIMPLE_CONTROLS, control => control.type), core, 'Exactly 14 course controls required');
let snippets = 0;
for (const control of w.SF_SIMPLE_CONTROLS) {
  assert(control.name && control.description && control.ranges.length, `Incomplete control: ${control.type}`);
  const seen = new Set();
  for (const range of control.ranges) {
    assert(range.label && range.start >= 1 && range.end <= lines.length && range.start <= range.end, `Invalid range: ${control.type}`);
    assert.equal(w.SF_CODE.text(range.start, range.end), lines.slice(range.start - 1, range.end).join('\n'));
    for(let line = range.start; line <= range.end; line++) {
      assert(!seen.has(line), `Repeated source line: ${control.type}:${line}`);
      seen.add(line);
    }
    snippets++;
  }
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const ref = match[1];
  if(!ref.includes(':')) assert(fs.existsSync(path.join(root, ref.split(/[?#]/)[0])), `Missing asset ${ref}`);
}
for(const file of fs.readdirSync(root)) {
  if(file.endsWith('.js')) new vm.Script(fs.readFileSync(path.join(root,file),'utf8'), {filename:file});
}
const unescape = value => value.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
for(const line of lines) assert.equal(unescape(w.SF_CODE.highlight(line)), line);
console.log(JSON.stringify({passed:true,controls:core.length,snippets,sourceLines:lines.length,sha256:w.SF_SOURCE_SHA256},null,2));
