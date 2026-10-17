/* Source rendering: the original text is never reformatted. */
window.SF_CODE = (() => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const keywords = new Set('using namespace internal static class private public sealed readonly new true false bool int float string void var null return foreach for if else in is not as try catch when throw override protected params base this out get set'.split(' '));
  const types = new Set('System ApplicationConfiguration Application Form StudyFlowForm StudyTask TextBox ComboBox DateTimePicker RadioButton ListBox CheckBox ProgressBar Timer ToolTip Label ToolStripStatusLabel Button Color Path Environment Size Font Control TableLayoutPanel PictureBox Pen GroupBox FlowLayoutPanel Panel StatusStrip ToolStripItem Padding List DateTime EventArgs Convert MessageBox'.split(' '));
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
  function text(start, end) {
    return lines().slice(start - 1, end).join('\n');
  }
  return { escape, highlight, lines, text };
})();
