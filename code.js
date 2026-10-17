/* Source rendering: the original text is never reformatted. */
window.SF_CODE = (() => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const keywords = new Set('using namespace internal static class private public sealed readonly new true false bool int float string void var null return foreach for if else in is not as try catch when throw override protected params base this out get set'.split(' '));
  const types = new Set('System ApplicationConfiguration Application Form StudyFlowForm StudyTask TextBox ComboBox DateTimePicker RadioButton ListBox CheckBox ProgressBar Timer ToolTip Stopwatch Label ToolStripStatusLabel Button Color Path Environment Size Font Control TableLayoutPanel PictureBox Pen GroupBox FlowLayoutPanel Panel StatusStrip ToolStripItem Padding List DateTime EventArgs Math MessageBox JsonSerializer JsonSerializerOptions JsonException Exception IOException UnauthorizedAccessException File Directory FormClosingEventArgs'.split(' '));
  function highlight(line) {
    const pattern = /\/\/.*$|\$?@?"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?[fFdD]?\b|\b[A-Za-z_]\w*\b/g;
    let html = '', last = 0, match;
    while ((match = pattern.exec(line))) {
      html += escape(line.slice(last, match.index));
      const token = match[0];
      const cls = token.startsWith('//') ? 'comment' : /^[\$@"']/.test(token) ? 'string' : /^\d/.test(token) ? 'number' : keywords.has(token) ? 'keyword' : types.has(token) || /^[A-Z]\w*(?:Style|Mode|Format|Alignment|Buttons|Icon|Result|Type|Args)$/.test(token) ? 'type' : /^\s*\(/.test(line.slice(pattern.lastIndex)) ? 'method' : '';
      html += cls ? `<span class="token-${cls}">${escape(token)}</span>` : escape(token);
      last = pattern.lastIndex;
    }
    return html + escape(line.slice(last));
  }
  const lines = () => window.SF_SOURCE_TEXT.split(/\r?\n/).filter((_, i, all) => i < all.length - 1 || all[i] !== '');
  function row(line, number, options = {}) {
    const expanded = options.annotated && window.SF_TEACHING_LINES?.[number];
    if (expanded?.length) {
      const selected = number >= options.start && number <= options.end;
      return expanded.map((part,index) => `<div class="code-line${selected?' highlight':''}" id="${options.prefix||'L'}${number}${index?'-part'+index:''}"><button class="line-number" data-line="${number}" title="原文件第 ${number} 行 · 教学分段 ${index+1}">${number}<small>·${index+1}</small></button><code class="line-code">${highlight(part.code)}${part.comment?`<span class="line-annotation">  // ${escape(part.comment)}</span>`:''}</code></div>`).join('');
    }
    const note = options.annotated && window.SF_ANNOTATIONS?.[number];
    const selected = number >= options.start && number <= options.end;
    return `<div class="code-line${selected ? ' highlight' : ''}" id="${options.prefix || 'L'}${number}"><button class="line-number" data-line="${number}" title="定位原文件第 ${number} 行">${number}</button><code class="line-code">${highlight(line)}${note ? `<span class="line-annotation">  // ${escape(note)}</span>` : ''}</code></div>`;
  }
  function range(start, end, options = {}) {
    return `<div class="code-content">${lines().slice(start - 1, end).map((line, index) => row(line, start + index, options)).join('')}</div>`;
  }
  function text(start, end, annotated = false) {
    return lines().slice(start - 1, end).map((line, index) => {
      const parts = annotated && window.SF_TEACHING_LINES?.[start+index];
      if(parts?.length)return parts.map(part=>part.code+(part.comment?`  // ${part.comment}`:'')).join('\n');
      return line + (annotated && window.SF_ANNOTATIONS?.[start + index] ? `  // ${window.SF_ANNOTATIONS[start + index]}` : '');
    }).join('\n');
  }
  return { escape, highlight, lines, row, range, text };
})();
