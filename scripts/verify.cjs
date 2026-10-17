const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname,'..');
const context = {window:{}};
vm.createContext(context);
const names = ['source-text','source-index','controls','hotspots','explanations','annotations','teaching-lines'];
for (const name of names) vm.runInContext(fs.readFileSync(path.join(root,'data',name+'.js'),'utf8'),context,{filename:name+'.js'});
vm.runInContext(fs.readFileSync(path.join(root,'code.js'),'utf8'),context);
const w=context.window;
const source=fs.readFileSync(path.join(root,'source','Program.cs'));
assert.equal(w.SF_SOURCE_TEXT,source.toString('utf8'),'Offline mirror differs from original source');
assert.equal(w.SF_SOURCE_SHA256,crypto.createHash('sha256').update(source).digest('hex'));
const lines=w.SF_CODE.lines();
const controls=w.SF_CONTROLS,methods=w.SF_METHODS,hotspots=w.SF_HOTSPOTS;
const core=['Label','Button','TextBox','RadioButton','CheckBox','PictureBox','GroupBox','ListBox','ComboBox','DateTimePicker','StatusStrip','ToolStripStatusLabel','ProgressBar','Timer'];
assert.equal(new Set(controls.map(c=>c.id)).size,controls.length);
assert.equal(new Set(methods.map(c=>c.id)).size,methods.length);
assert.equal(new Set(hotspots.map(c=>c.id)).size,hotspots.length);
for(const method of methods){assert(method.start>=1&&method.end<=lines.length&&method.end>=method.start);assert(lines[method.start-1].includes(method.id==='StudyFlowFormDataPath'?'StudyFlowForm':method.id),`Method starts on wrong line: ${method.id}`);}
for(const type of core){assert(controls.some(c=>c.type===type),`Missing type ${type}`);assert(w.SF_EXPLANATIONS[type].questions.length>=3,`Missing questions ${type}`);}
for(const c of controls){
  assert(w.SF_EXPLANATIONS[c.type],`Missing explanation ${c.type}`);assert(w.SF_INSTANCE_NOTES[c.id],`Missing instance note ${c.id}`);
  assert(c.keyLine>0&&c.keyLine<=lines.length);
  for(const name of ['definition','properties','layout','events','implementation','related']){
    assert(Array.isArray(c.tabs[name]),`Missing tab ${c.id}.${name}`);
    for(const range of c.tabs[name]){assert(range.start>=1&&range.end<=lines.length&&range.start<=range.end,`Bad range ${c.id}`);assert.equal(w.SF_CODE.text(range.start,range.end),lines.slice(range.start-1,range.end).join('\n'));}
  }
  for(const id of c.methods)assert(methods.some(m=>m.id===id),`Unknown method ${id}`);
  for(const step of c.flow){if(step.method)assert(methods.some(m=>m.id===step.method));if(step.line)assert(step.line>0&&step.line<=lines.length);}
}
const png=fs.readFileSync(path.join(root,'assets','studyflow-main.png'));
assert.equal(png.readUInt32BE(16),w.SF_IMAGE.width);assert.equal(png.readUInt32BE(20),w.SF_IMAGE.height);
for(const h of hotspots){assert(controls.some(c=>c.id===h.id));assert(h.x>=0&&h.y>=48&&h.width>0&&h.height>0&&h.x+h.width<=w.SF_IMAGE.width&&h.y+h.height<=w.SF_IMAGE.height);}
for(let i=0;i<hotspots.length;i++)for(let j=i+1;j<hotspots.length;j++){const a=hotspots[i],b=hotspots[j];assert(!(a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y),`Overlapping hotspots: ${a.id} / ${b.id}`);}
for(const [line,annotation] of Object.entries(w.SF_ANNOTATIONS)){assert(Number(line)>0&&Number(line)<=lines.length&&typeof annotation==='string');}
// Teaching expansion changes whitespace only, preserving all original code tokens.
for(const [number,parts] of Object.entries(w.SF_TEACHING_LINES)){
  assert.equal(parts.map(p=>p.code).join('').replace(/\s/g,''),lines[Number(number)-1].replace(/\s/g,''),`Teaching expansion changed line ${number}`);
  assert(parts.every(p=>typeof p.code==='string'&&typeof p.comment==='string'));
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const ref=match[1];if(!ref.includes(':'))assert(fs.existsSync(path.join(root,ref)),`Missing asset ${ref}`);}
for(const file of fs.readdirSync(root)){if(file.endsWith('.js'))new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});}
// Highlighting must keep every character of the real source, including interpolation and quotes.
const unescape=value=>value.replace(/<[^>]*>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
for(const line of lines)assert.equal(unescape(w.SF_CODE.highlight(line)),line);
console.log(JSON.stringify({passed:true,sourceLines:lines.length,controlEntries:controls.length,requiredTypes:core.length,methods:methods.length,hotspots:hotspots.length,annotations:Object.keys(w.SF_ANNOTATIONS).length,sha256:w.SF_SOURCE_SHA256},null,2));
