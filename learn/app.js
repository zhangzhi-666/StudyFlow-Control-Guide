(() => {
  'use strict';
  const controls = window.SF_SIMPLE_CONTROLS;
  const notes = window.SF_LINE_NOTES;
  const {escape: esc, highlight, lines, text} = window.SF_CODE;
  const source = lines();
  const main = document.querySelector('#main');
  const navigation = document.querySelector('#controlNav');
  let currentRanges = [];
  const title = control => `${control.type} ${control.name}`;
  const link = control => `#/controls/${control.type}`;
  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    main.focus();
  });

  function explainedLine(line, number) {
    const explanation = notes[number];
    return `<div class="learn-row" data-source-line="${number}">
      <div class="source-cell"><span class="line-number" aria-label="第 ${number} 行">${number}</span><code class="line-code">${highlight(line)}</code></div>
      <div class="line-explanation" aria-label="第 ${number} 行解释">${explanation.length > 1 ? `<ol>${explanation.map(note => `<li>${esc(note)}</li>`).join('')}</ol>` : `<p>${esc(explanation[0])}</p>`}</div>
    </div>`;
  }

  function snippet(range, index) {
    return `<section class="snippet" aria-labelledby="snippet-${index}">
      <div class="snippet-heading"><div><h2 id="snippet-${index}">${esc(range.label)}</h2><p>1.cs · 第 ${range.start}–${range.end} 行</p></div><button class="copy-button" data-copy="${index}" aria-label="复制${esc(range.label)}原始代码">复制原始代码</button></div>
      <div class="lesson-columns" aria-hidden="true"><span>原始代码</span><span>中文逐行解释</span></div>
      <div class="lesson-rows">${source.slice(range.start - 1, range.end).map((line, offset) => explainedLine(line, range.start + offset)).join('')}</div>
    </section>`;
  }

  function render() {
    const type = location.hash.match(/^#\/controls\/([^/?]+)$/)?.[1];
    const activeControl = controls.find(control => control.type === type);
    const fullSource = location.hash === '#/source';
    const reading = Boolean(activeControl || fullSource);
    document.body.classList.toggle('show-source', reading);
    document.querySelector('#backLink').hidden = !reading;
    navigation.innerHTML = `<a class="full-source-link${fullSource ? ' active' : ''}" href="#/source"${fullSource ? ' aria-current="page"' : ''}>完整源码 · ${source.length} 行</a>` + controls.map((control, index) => `<a class="control-link${control === activeControl ? ' active' : ''}" href="${link(control)}"${control === activeControl ? ' aria-current="page"' : ''}><span class="nav-index">${String(index + 1).padStart(2, '0')}</span><span><span class="nav-type">${esc(control.type)}</span><span class="nav-name">${esc(control.name)}</span></span></a>`).join('');
    if (reading) {
      const heading = fullSource ? '逐行理解 1.cs' : title(activeControl);
      const description = fullSource ? `从程序入口到任务数据类，按原文件顺序解释全部 ${source.length} 行。` : activeControl.description;
      document.title = `${heading} · StudyFlow 理解版`;
      currentRanges = fullSource ? [{start:1, end:source.length, label:'完整源码与逐行解释'}] : activeControl.ranges;
      main.innerHTML = `<div class="page-heading"><p class="eyebrow">理解版 · 逐行解释</p><h1 tabindex="-1">${esc(heading)}</h1><p class="lead">${esc(description)}</p><p class="reading-hint">解释与行号一一对应；一行中的多条语句按顺序讲解。</p></div>${currentRanges.map(snippet).join('')}`;
    } else {
      document.title = 'StudyFlow 理解版 · 逐行解释';
      currentRanges = [];
      main.innerHTML = `<div class="page-heading"><p class="eyebrow">理解版 · 学习用</p><h1 tabindex="-1">14 种控件，一行一行看懂</h1><p class="lead">同一份 ${source.length} 行源码，每行配中文解释。选择控件即可开始。</p><a class="full-source-start" href="#/source">从第 1 行完整学习 <span aria-hidden="true">→</span></a></div><div class="control-grid">${controls.map((control, index) => `<a class="control-card" href="${link(control)}"><span class="card-number">${String(index + 1).padStart(2, '0')}</span><h2>${esc(title(control))}</h2><p>${esc(control.description)}</p><span class="card-action">查看逐行解释 <span aria-hidden="true">→</span></span></a>`).join('')}</div>`;
    }
    window.scrollTo(0, 0);
  }

  main.addEventListener('click', async event => {
    const button = event.target.closest('[data-copy]');
    if (!button) return;
    const range = currentRanges[Number(button.dataset.copy)];
    try {
      await navigator.clipboard.writeText(text(range.start, range.end));
      button.textContent = '已复制原始代码';
    } catch {
      button.textContent = '请选中代码复制';
    }
    setTimeout(() => { button.textContent = '复制原始代码'; }, 2200);
  });
  window.addEventListener('hashchange', () => {
    render();
    main.querySelector('h1').focus({preventScroll: true});
  });
  render();
})();
