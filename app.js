(() => {
  'use strict';
  const controls = window.SF_SIMPLE_CONTROLS;
  const {escape: esc, highlight, lines, text} = window.SF_CODE;
  const source = lines();
  const main = document.querySelector('#main');
  const navigation = document.querySelector('#controlNav');
  let activeControl;
  const title = control => `${control.type} ${control.name}`;
  const link = control => `#/controls/${control.type}`;
  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    main.focus();
  });

  function snippet(range, index) {
    return `<section class="snippet" aria-labelledby="snippet-${index}">
      <div class="snippet-heading"><div><h2 id="snippet-${index}">${esc(range.label)}</h2><p>Program.cs · 第 ${range.start}–${range.end} 行</p></div><button class="copy-button" data-copy="${index}" aria-label="复制${esc(range.label)}代码">复制代码</button></div>
      <div class="code-block" tabindex="0" aria-label="${esc(range.label)}源码">${source.slice(range.start - 1, range.end).map((line, offset) => `<div class="code-line"><span class="line-number" aria-hidden="true">${range.start + offset}</span><code class="line-code">${highlight(line) || '\n'}</code></div>`).join('')}</div>
    </section>`;
  }

  function render() {
    const type = location.hash.match(/^#\/controls\/([^/?]+)$/)?.[1];
    activeControl = controls.find(control => control.type === type);
    document.body.classList.toggle('show-source', Boolean(activeControl));
    document.querySelector('#backLink').hidden = !activeControl;
    navigation.innerHTML = controls.map((control, index) => `<a class="control-link${control === activeControl ? ' active' : ''}" href="${link(control)}"${control === activeControl ? ' aria-current="page"' : ''}><span class="nav-index">${String(index + 1).padStart(2, '0')}</span><span><span class="nav-type">${esc(control.type)}</span><span class="nav-name">${esc(control.name)}</span></span></a>`).join('');
    if (activeControl) {
      document.title = `${title(activeControl)} · StudyFlow`;
      main.innerHTML = `<div class="page-heading"><p class="eyebrow">控件源码</p><h1 tabindex="-1">${esc(title(activeControl))}</h1><p class="lead">${esc(activeControl.description)}</p></div>${activeControl.ranges.map(snippet).join('')}`;
    } else {
      document.title = 'StudyFlow · 14 种控件源码';
      main.innerHTML = `<div class="page-heading"><p class="eyebrow">STUDYFLOW · C# WINFORMS</p><h1 tabindex="-1">14 种控件，点开就是源码</h1><p class="lead">选择要讲解的控件，查看它在 StudyFlow 中的实际代码。</p></div><div class="control-grid">${controls.map((control, index) => `<a class="control-card" href="${link(control)}"><span class="card-number">${String(index + 1).padStart(2, '0')}</span><h2>${esc(title(control))}</h2><p>${esc(control.description)}</p><span class="card-action">查看源码 <span aria-hidden="true">→</span></span></a>`).join('')}</div>`;
    }
    window.scrollTo(0, 0);
  }

  main.addEventListener('click', async event => {
    const button = event.target.closest('[data-copy]');
    if (!button || !activeControl) return;
    const range = activeControl.ranges[Number(button.dataset.copy)];
    try {
      await navigator.clipboard.writeText(text(range.start, range.end));
      button.textContent = '已复制';
    } catch {
      button.textContent = '请选中代码复制';
    }
    setTimeout(() => { button.textContent = '复制代码'; }, 2200);
  });
  window.addEventListener('hashchange', () => {
    render();
    main.querySelector('h1').focus({preventScroll: true});
  });
  render();
})();
