(() => {
  'use strict';
  const C = window.SF_CODE, esc = C.escape;
  const controls = window.SF_CONTROLS || [], methods = window.SF_METHODS || [];
  const hotspots = window.SF_HOTSPOTS || [], imageInfo = window.SF_IMAGE || {width:2418,height:1560};
  const coreTypes = ['Label','Button','TextBox','RadioButton','CheckBox','PictureBox','GroupBox','ListBox','ComboBox','DateTimePicker','StatusStrip','ToolStripStatusLabel','ProgressBar','Timer'];
  const typeNames = {
    Label:'标签', Button:'按钮', TextBox:'文本框', RadioButton:'单选按钮', CheckBox:'复选框',
    PictureBox:'图片框', GroupBox:'分组框', ListBox:'列表框', ComboBox:'下拉组合框',
    DateTimePicker:'日期时间选择器', StatusStrip:'状态栏', ToolStripStatusLabel:'状态栏标签',
    ProgressBar:'进度条', Timer:'计时器', Panel:'面板', TableLayoutPanel:'表格布局面板',
    FlowLayoutPanel:'流式布局面板', ToolTip:'工具提示', Stopwatch:'秒表',
    'List<StudyTask>':'任务列表集合', StudyTask:'任务数据模型', LINQ:'语言集成查询',
    JSON:'数据交换格式', 'try-catch':'异常处理'
  };
  const displayType = type => typeNames[type] ? `${type}（${typeNames[type]}）` : type;
  const sidebarType = type => `<span class="type-english">${esc(type)}</span><span class="type-chinese">（${esc(typeNames[type])}）</span>`;
  const tabLabels = {definition:'控件定义',properties:'属性初始化',layout:'界面布局',events:'事件绑定',implementation:'功能实现',related:'关联与流程'};
  const $ = selector => document.querySelector(selector);
  const byId = id => controls.find(control => control.id === id);
  const byMethod = id => methods.find(method => method.id === id || method.name === id);
  const safeStore = { get(key,fallback){try{return localStorage.getItem(key) ?? fallback;}catch{return fallback;}}, set(key,value){try{localStorage.setItem(key,value);}catch{}} };
  const state = {tab:'implementation',mode:'raw',level:'quick',showNotes:true,showHotspots:false,region:'all',lastControl:null,collapsed:new Set(),sourceStart:0,sourceEnd:0,sourceQuery:'',sourceHits:[],hitIndex:0,defense:false,font:14};
  let previousRoute = '', toastTimer;
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2400);}
  function routeTo(path){if(location.hash === '#'+path) render();else location.hash=path;}
  function controlUrl(id){return `#/control/${encodeURIComponent(id)}`;}
  function sourceUrl(start,end=start){return `#/source?line=${start}&end=${end}`;}
  function methodUrl(id){return `#/methods/${encodeURIComponent(id)}`;}
  function readRoute(){const raw=location.hash.slice(1)||'/home';const [path,query='']=raw.split('?');return {path,parts:path.split('/').filter(Boolean),query:new URLSearchParams(query)};}
  function types(){return [...new Set(controls.map(control=>control.type))];}
  function icon(type){return ({Label:'Aa',Button:'↗',TextBox:'I',RadioButton:'◉',CheckBox:'☑',PictureBox:'▧',GroupBox:'□',ListBox:'≡',ComboBox:'⌄',DateTimePicker:'▦',StatusStrip:'▱',ToolStripStatusLabel:'T',ProgressBar:'▰',Timer:'◷'})[type]||'◇';}
  function sidebar(route){
    const current=route.parts[0], currentControl=byId(route.parts[1]);
    $('#sidebar').innerHTML=`<div class="nav-group-title">工作台 · WORKSPACE</div>
      ${[['home','▧','程序界面'],['controls','⊞','控件大家族'],['source','⌘','完整源码'],['defense','◈','课堂答辩']].map(([id,symbol,title])=>`<a class="nav-link ${current===id||(id==='source'&&current==='methods')?'active':''}" href="#/${id}"><span class="nav-symbol">${symbol}</span>${title}${id==='controls'?'<span class="nav-count">14</span>':''}</a>`).join('')}
      <div class="nav-group-title">课程控件 · CONTROLS</div>${coreTypes.map(type=>`<a href="#/controls/${type}" class="type-nav ${currentControl?.type===type||(current==='controls'&&route.parts[1]===type)?'active':''}"><span class="type-dot"></span><span class="type-name">${sidebarType(type)}</span><span class="nav-count">${controls.filter(c=>c.type===type).length}</span></a>`).join('')}
      <div class="nav-group-title">延伸理解 · EXPLORE</div><details ${currentControl&&!coreTypes.includes(currentControl.type)?'open':''}><summary>布局、计时与数据</summary>${types().filter(t=>!coreTypes.includes(t)).map(type=>`<a class="type-nav" href="#/controls/${encodeURIComponent(type)}"><span class="type-name">${sidebarType(type)}</span></a>`).join('')}</details>
      <a class="nav-link" href="#/control/uiTimer"><span class="nav-symbol">◷</span>非可视控件 · ${esc(displayType("Timer"))}</a>
      <a class="nav-link" href="#/control/tips"><span class="nav-symbol">ⓘ</span>非可视控件 · ${esc(displayType("ToolTip"))}</a>
      <div class="side-footer"><b>● 原始源码驱动</b><br>Program.cs · ${C.lines().length} 行<br>C# / Windows Forms<br><span>按 H 返回程序界面</span></div>`;
  }
  function preview(selected='',mini=false){
    if(mini){const h=hotspots.find(h=>h.id===selected);return `<div class="mini-preview"><img src="assets/studyflow-main.png" width="${imageInfo.width}" height="${imageInfo.height}" alt="当前控件在真实程序截图中的位置"><svg viewBox="0 0 ${imageInfo.width} ${imageInfo.height}" aria-hidden="true">${h?`<rect class="mini-selected" x="${h.x}" y="${h.y}" width="${h.width}" height="${h.height}"/>`:''}</svg></div>`;}
    return `<div class="screenshot-wrap ${state.showHotspots?'show-hotspots':''}"><img src="assets/studyflow-main.png" width="${imageInfo.width}" height="${imageInfo.height}" alt="StudyFlow 原始运行截图，任务编辑、任务清单、专注计时三个面板"><svg class="hotspot-layer" viewBox="0 0 ${imageInfo.width} ${imageInfo.height}" role="group" aria-label="点击控件查看真实 C# 源码">${hotspots.map(h=>`<a href="${controlUrl(h.id)}" aria-label="${esc(h.label)}：查看 C# 源码"><rect class="hotspot ${selected===h.id?'selected':''} ${state.region!=='all'&&state.region===h.region?'region-active':''}" data-hotspot="${h.id}" x="${h.x}" y="${h.y}" width="${h.width}" height="${h.height}" rx="2" tabindex="0"><title>${esc(h.label)} · 点击查看源码</title></rect></a>`).join('')}</svg></div>`;
  }
  function home(route){
    const selected=route.query.get('locate')||'';
    $('#main').innerHTML=`<div class="page-heading"><div><div class="eyebrow">VISUAL SOURCE NAVIGATOR</div><h1>从界面，走进源码。</h1><p class="lead">点击程序中的任意控件，查看它的定义、事件与实现。</p></div><div class="small-stats"><div><strong>14</strong>课程控件类型</div><div><strong>${hotspots.length}</strong>真实界面热点</div><div><strong>${C.lines().length}</strong>原始代码行</div></div></div>
      <section class="workspace-card"><div class="workspace-toolbar"><span class="file-label"><i class="live-dot"></i>StudyFlow · 真实程序界面</span><div class="region-tabs">${[['all','全部区域'],['editor','新建任务'],['list','任务清单'],['focus','专注计时']].map(([id,title])=>`<button data-region="${id}" class="${state.region===id?'active':''}">${title}</button>`).join('')}</div><div class="toolbar-actions"><button class="button ${state.showHotspots?'active':''}" data-action="hotspots" aria-pressed="${state.showHotspots}">⊙ ${state.showHotspots?'隐藏':'显示'}热点</button><button class="button" data-action="fullscreen" aria-label="全屏显示原图">⛶ 全屏</button></div></div>
      <div class="screenshot-area">${preview(selected)}</div><div class="snapshot-footer"><span><strong>⌖ 悬停识别 · 点击查看源码</strong> ${selected&&byId(selected)?` · 已定位：${esc(byId(selected).name)}`:''}</span><span>原图 ${imageInfo.width} × ${imageInfo.height} · 等比例显示 · 系统窗口按钮不设热点</span></div></section>
      <div class="home-bottom"><a class="quick-card" href="#/control/btnAdd"><span class="quick-icon">↗</span><div><h3>一个按钮，如何添加任务？</h3><p>Click → AddTask → 保存数据</p></div><span class="arrow">→</span></a><a class="quick-card" href="#/control/lblFocusTime"><span class="quick-icon">◷</span><div><h3>25:00 背后的计时逻辑</h3><p>${esc(displayType("Label"))} · ${esc(displayType("Timer"))} · ${esc(displayType("Stopwatch"))}</p></div><span class="arrow">→</span></a><a class="quick-card" href="#/defense"><span class="quick-icon">{ }</span><div><h3>准备好，开始答辩</h3><p>执行流程与常见追问</p></div><span class="arrow">→</span></a></div>
      <p class="page-footnote">截图记录运行时状态；源码默认优先级为「中」、分类为「课程学习」。所有代码均来自你提供的 Program.cs。</p>`;
  }
  function catalog(route){
    const filter=decodeURIComponent(route.parts[1]||'');
    const selected=filter?controls.filter(c=>c.type===filter):[];
    $('#main').innerHTML=`<div class="page-heading"><div><div class="eyebrow">CONTROL LIBRARY</div><h1>${filter?esc(displayType(filter)):'控件大家族'}</h1><p class="lead">${filter?'选择具体实例，直接查看它在程序中的代码。':'14 种课程控件，以及支撑界面、计时和数据保存的扩展知识。'}</p></div><a class="button" href="#/home">← 返回程序界面</a></div>${filter?`<div class="catalog-grid">${selected.map(c=>`<a href="${controlUrl(c.id)}" class="control-card"><div class="card-type">${esc(c.name)}<span>↗</span></div><p>${esc(c.summary)}</p><span class="badge">${esc(c.variable||c.type)}</span><div class="card-footer">第 ${c.keyLine} 行 · 查看实现 →</div></a>`).join('')}</div>`:
      `<h2 class="catalog-section-title">课程要求 <span>14 / 14 类控件</span></h2><div class="catalog-grid">${coreTypes.map(type=>typeCard(type)).join('')}</div><h2 class="catalog-section-title">扩展知识 <span>理解程序如何组合与运行</span></h2><div class="catalog-grid">${types().filter(t=>!coreTypes.includes(t)).map(type=>typeCard(type)).join('')}</div>`}`;
  }
  function typeCard(type){const list=controls.filter(c=>c.type===type), explain=window.SF_EXPLANATIONS?.[type];return `<a href="#/controls/${encodeURIComponent(type)}" class="control-card"><div class="card-type"><strong class="type-name">${esc(displayType(type))}</strong><span>${String(coreTypes.indexOf(type)+1).padStart(2,'0').replace('00','＋')}</span></div><p>${esc(explain?.what||list[0]?.summary||'查看源码中的实际使用方式')}</p><div class="card-footer">${list.length} 个实例 / 入口 <span style="float:right">→</span></div></a>`;}
  function codeOptions(){return `<div class="code-options"><div class="segmented" aria-label="代码显示模式"><button data-mode="raw" class="${state.mode==='raw'?'active':''}">真实源码</button><button data-mode="annotated" class="${state.mode==='annotated'?'active':''}">中文注释版</button></div><div class="font-buttons"><button class="button" data-action="font-minus" aria-label="缩小代码字号">A−</button><span id="fontSizeLabel">${state.font}px</span><button class="button" data-action="font-plus" aria-label="放大代码字号">A+</button></div></div>${state.mode==='annotated'?'<div class="annotation-note">教学排版版：长行按语句展开；左列为原行号·分段号，右侧为新增注释。原始代码请切换「真实源码」。</div>':''}`;}
  function rangeSnippet(range,index=0){return `<section class="snippet"><div class="snippet-title"><span>Program.cs → <b>${range.start>=245?'StudyTask':range.start<19?'文件 / Program':'StudyFlowForm'}</b> → ${esc(range.label||'源码片段')}<br>第 ${range.start}–${range.end} 行</span><span class="snippet-actions"><a class="text-button" href="${sourceUrl(range.start,range.end)}">在完整源码中查看 ↗</a><button class="text-button" data-copy-start="${range.start}" data-copy-end="${range.end}">复制代码</button></span></div><div class="code-scroll">${C.range(range.start,range.end,{annotated:state.mode==='annotated',prefix:`s${index}-L`})}</div></section>`;}
  function flowHtml(flow){return `<div class="flow-strip">${(flow||[]).map((step,i)=>`${i?'<span class="flow-arrow" aria-hidden="true">→</span>':''}${step.method&&byMethod(step.method)?`<a class="flow-node" href="${methodUrl(step.method)}">${esc(step.label)} <small>↗</small></a>`:step.line?`<a class="flow-node" href="${sourceUrl(step.line)}">${esc(step.label)}</a>`:`<span class="flow-node">${esc(step.label)}</span>`}`).join('')}</div>`;}
  function detail(route){
    let id=decodeURIComponent(route.parts.slice(1).join('/'));
    // Friendly aliases retain the requested hash route examples.
    id=({'button/add':'btnAdd','textbox/title':'txtTitle',timer:'uiTimer'})[id]||id;
    const control=byId(id);if(!control){notFound();return;}
    if(state.lastControl!==id){state.tab=control.tabs.implementation?.length?'implementation':'definition';state.lastControl=id;}
    const explanation=window.SF_EXPLANATIONS?.[control.type]||{}, note=window.SF_INSTANCE_NOTES?.[id]||{};
    const ranges=control.tabs[state.tab]||[];
    const related=(control.methods||[]).map(byMethod).filter(Boolean);
    const body=state.tab==='related'?`${control.flow?.length?flowHtml(control.flow):'<p class="flow-note">从下方关联方法查看该控件的创建、布局和更新。</p>'}${ranges.map(rangeSnippet).join('')}${related.length?`<div class="method-links">${related.map(m=>`<a class="button" href="${methodUrl(m.id)}">${esc(m.name)} · L${m.start}</a>`).join('')}</div>`:''}`:ranges.length?ranges.map(rangeSnippet).join(''):'<div class="empty-state">此实例在当前分类下没有独立源码片段。<br>非可视对象没有界面布局；未绑定事件的控件由其他方法读取或更新。<br>可通过「功能实现」或「关联与流程」继续查看。</div>';
    $('#main').innerHTML=`<div class="breadcrumbs"><a href="#/home">程序界面</a><span>/</span><a href="#/controls/${encodeURIComponent(control.type)}">${esc(displayType(control.type))}</a><span>/</span><span>${esc(control.name)}</span></div><div class="control-heading"><div class="control-title-row"><div><div class="eyebrow">${id==='lblFocusTime'?'COUNTDOWN EXPLAINED':'CONTROL INSPECTOR'}</div><h1>${id==='lblFocusTime'?'倒计时实现原理':esc(control.name)}</h1><span class="badge">${esc(displayType(control.type))}</span><span class="muted" style="font:11px Consolas,monospace">${esc(control.variable||control.id)}</span></div><a class="button" href="#/home?locate=${id}">← 返回程序界面</a></div><div class="instances">${controls.filter(c=>c.type===control.type).map(c=>`<a class="instance ${c.id===id?'active':''}" href="${controlUrl(c.id)}">${esc(c.name)}</a>`).join('')}</div></div>
      <div class="detail-grid ${!state.showNotes?'no-explanation':''}"><div><section class="workspace-card"><div class="tabs" role="tablist">${Object.entries(tabLabels).map(([key,title])=>`<button class="tab ${state.tab===key?'active':''}" role="tab" aria-selected="${state.tab===key}" data-tab="${key}">${title}</button>`).join('')}</div>${codeOptions()}${body}<div class="related-nav"><button class="text-button" data-action="related-prev">← 上一个关联方法</button><button class="text-button" data-action="notes">${state.showNotes?'隐藏':'显示'}中文讲解</button><button class="text-button" data-action="related-next">下一个关联方法 →</button></div></section>${control.flow?.length&&state.tab!=='related'?`<section class="workspace-card" style="margin-top:14px"><div class="workspace-toolbar"><span>执行路径</span><span class="muted">点击节点查看真实代码</span></div>${flowHtml(control.flow)}</section>`:''}</div>
      ${state.showNotes?`<aside class="explanation-panel"><div>${preview(id,true)}<div class="mini-caption"><span>${hotspots.some(h=>h.id===id)?'当前控件在原图中的位置':'非可视或结构性对象'}</span><a class="text-button" href="#/home?locate=${id}">原图定位 ↗</a></div><div class="explanation-level"><button class="button ${state.level==='quick'?'active':''}" data-level="quick">20–30 秒回答</button><button class="button ${state.level==='detailed'?'active':''}" data-level="detailed">详细讲解</button></div><h3>${state.level==='quick'?'答辩时可以这样说':'从属性到执行过程'}</h3><p>${esc(note[state.level]||explanation[state.level]||control.summary)}</p>${state.level==='detailed'&&note.detailed&&explanation.detailed?`<p>${esc(explanation.detailed)}</p>`:''}<h3>这是什么控件？</h3><p class="muted">${esc(explanation.what||control.summary)}</p><h3>为什么用这个控件？</h3><p class="muted">${esc(explanation.why||control.summary)}</p>${note.keyExplanation?`<div class="callout">${esc(note.keyExplanation)}</div>`:''}${explanation.caution?`<div class="callout">${esc(explanation.caution)}</div>`:''}<a class="text-button" href="${sourceUrl(control.keyLine)}">关键代码 · Program.cs 第 ${control.keyLine} 行 ↗</a></div><div><h3>老师可能继续问</h3>${(note.questions?.length?note.questions:explanation.questions||[]).map(qaHtml).join('')}</div></aside>`:''}</div>`;
  }
  function qaHtml(qa){return `<details class="qa-item"><summary>${esc(qa.q)}</summary><p>${esc(qa.a)}</p></details>`;}
  function source(route){
    const selectedMethod=route.parts[0]==='methods'?byMethod(decodeURIComponent(route.parts[1]||'')):null;
    state.sourceStart=selectedMethod?.start||Number(route.query.get('line'))||0;state.sourceEnd=selectedMethod?.end||Number(route.query.get('end'))||state.sourceStart;
    if(state.sourceStart){for(const method of methods){if(method.start<=state.sourceEnd&&method.end>=state.sourceStart)state.collapsed.delete(method.id);}}
    const current=selectedMethod||methods.filter(m=>m.start<=state.sourceStart&&m.end>=state.sourceStart).sort((a,b)=>(a.end-a.start)-(b.end-b.start))[0];
    $('#main').innerHTML=`<div class="page-heading"><div><div class="eyebrow">THE SINGLE SOURCE OF TRUTH</div><h1>${selectedMethod?esc(selectedMethod.name):'完整源码'}</h1><p class="lead">Program.cs · ${C.lines().length} 行 · 保留原文与准确行号</p></div><a class="button" href="${state.lastControl?'#/home?locate='+state.lastControl:'#/home'}">← 返回控件位置</a></div>
      <div class="source-layout"><aside class="method-directory"><h3>方法导航</h3>${methods.map(m=>`<a href="${methodUrl(m.id)}" class="${current?.id===m.id?'active':''}">${esc(m.name)}<span>${m.start}</span></a>`).join('')}</aside><section class="workspace-card source-view"><div class="source-tools"><input id="sourceSearch" type="search" aria-label="搜索源码或方法名" placeholder="搜索源码或方法名…" value="${esc(state.sourceQuery)}"><button class="button" data-action="source-find">查找</button><button class="button" data-action="hit-prev" aria-label="上一个搜索结果">↑</button><button class="button" data-action="hit-next" aria-label="下一个搜索结果">↓</button><input id="lineInput" type="number" min="1" max="${C.lines().length}" placeholder="行号" aria-label="跳转行号"><button class="button" data-action="goto-line">跳转</button><button class="button" data-action="collapse-all">${state.collapsed.size?'展开':'折叠'}方法</button><button class="button" data-action="copy-method">复制${current?'当前方法':'全部源码'}</button></div>${codeOptions()}<div class="code-scroll" id="sourceScroll">${sourceBody()}</div><div class="source-meta"><span id="sourceSearchInfo">${current?`${esc(current.name)} · 第 ${current.start}–${current.end} 行`:'点击行号即可固定定位；方法可独立折叠。'}</span><a href="source/Program.cs" download class="text-button">下载原始 Program.cs ↓</a></div>${state.lastControl?`<div class="related-nav"><button class="text-button" data-action="related-prev">← 上一个关联方法</button><a class="text-button" href="${controlUrl(state.lastControl)}">返回 ${esc(byId(state.lastControl)?.name||"控件详情")}</a><button class="text-button" data-action="related-next">下一个关联方法 →</button></div>`:""}</section></div>`;
    if(state.sourceStart)requestAnimationFrame(()=>scrollSource(state.sourceStart));
  }
  function sourceBody(){
    const rows=C.lines();let html='<div class="code-content">';
    for(let n=1;n<=rows.length;n++){
      const method=methods.find(m=>m.start===n&&m.end>m.start);
      if(method){html+=`<button class="source-fold" data-fold="${method.id}">${state.collapsed.has(method.id)?'▸':'▾'} ${esc(method.name)} · L${method.start}–${method.end}${state.collapsed.has(method.id)?' · 展开方法':''}</button>`;if(state.collapsed.has(method.id)){n=method.end;continue;}}
      html+=C.row(rows[n-1],n,{annotated:state.mode==='annotated',start:state.sourceStart,end:state.sourceEnd});
    }return html+'</div>';
  }
  function scrollSource(line){const row=$(`#L${line}`),box=$('#sourceScroll');if(row&&box){box.scrollTop=row.offsetTop-box.offsetTop-50;row.classList.add('highlight');}}
  const defenseFlows=[
    {name:'01 / 添加任务',id:'btnAdd',note:'先验证任务名；只有 SaveTasks() 返回 true，才显示“任务已添加并保存”。'},
    {name:'02 / 完成任务',id:'btnComplete',note:'没有选中任务或任务已经完成时直接返回。数据对象先变化，再刷新界面并保存。'},
    {name:'03 / 删除任务',id:'btnDelete',note:'从 tasks 集合移除选中的 StudyTask，随后刷新列表、统计和进度。'},
    {name:'04 / 筛选任务',id:'chkOnlyPending',note:'Where() 决定列表里显示哪些任务；完成率仍然使用全部 tasks 计算。'},
    {name:'05 / 专注计时',id:'lblFocusTime',note:'Timer.Tick 是后续独立触发的事件，不是 Stopwatch.Start() 的同步调用。实际经过时间由 Stopwatch 测量。'},
    {name:'06 / 保存与恢复',id:'json',note:'任务变化后写入 .tmp 文件，再移动替换目标 JSON；启动时 LoadTasks() 恢复。加载失败会禁止覆盖原数据。'}
  ];
  function defense(){
    $('#main').innerHTML=`<div class="page-heading"><div><div class="eyebrow">READY FOR YOUR DEFENSE</div><h1>讲清每一步，答好每一问。</h1><p class="lead">从控件事件到数据变化，沿着真实源码解释程序。</p></div><button class="button primary" data-action="defense">${state.defense?'退出':'开启'}答辩模式</button></div>
      <div class="defense-intro"><div class="intro-block"><h2>先用 30 秒介绍这个项目</h2><p>StudyFlow 是一个用 C# Windows Forms 编写的学习任务与专注计时器。界面控件全部由代码创建，任务用 List&lt;StudyTask&gt; 管理，并通过 JSON 保存到本机。按钮和选择框通过事件连接业务方法；计时部分由 Timer 更新界面，用 Stopwatch 测量实际经过的时间。</p><a class="text-button" href="${methodUrl('StudyFlowFormDataPath')}">查看程序初始化过程 →</a></div><div class="intro-block"><h3>现场演示快捷键</h3><div class="shortcut"><span>搜索中文、控件、变量、方法</span><kbd>Ctrl / ⌘ + K</kbd></div><div class="shortcut"><span>返回真实程序界面</span><kbd>H</kbd></div><div class="shortcut"><span>开启 / 退出答辩模式</span><kbd>D</kbd></div><div class="shortcut"><span>全屏展示</span><kbd>F</kbd></div><div class="shortcut"><span>关闭搜索 / 退出全屏</span><kbd>Esc</kbd></div></div></div>
      <h2 class="catalog-section-title">程序执行流程 <span>点击任一代码节点，直达原文件</span></h2>${defenseFlows.map(item=>{const control=byId(item.id);return `<section class="workspace-card flow-card"><h3>${item.name}</h3>${flowHtml(control?.flow||[])}<p class="flow-note">${item.note} <a class="text-button" href="${controlUrl(item.id)}">查看详细讲解 ↗</a></p></section>`;}).join('')}
      <h2 class="catalog-section-title">老师常见追问 <span>14 类控件 · 结合本项目回答</span></h2><div class="questions-grid">${coreTypes.map(type=>`<section class="questions-block"><h3><a href="#/controls/${type}">${esc(displayType(type))} ↗</a></h3>${(window.SF_EXPLANATIONS?.[type]?.questions||[]).map(qaHtml).join('')}</section>`).join('')}</div><p class="page-footnote">课件中的 StatusLabel 在本项目里对应 ToolStripStatusLabel。计时累计仅代表本次打开程序的会话，不是跨天统计。</p>`;
  }
  function notFound(){$('#main').innerHTML='<div class="empty-state"><h1>未找到这个入口</h1><p>可以通过控件目录或搜索找到真实源码。</p><a class="button primary" href="#/home">返回程序界面</a></div>';}
  function render(){
    const route=readRoute();sidebar(route);$('#hotspotTooltip').hidden=true;
    if(route.path!==previousRoute){window.scrollTo(0,0);$('#sidebar').classList.remove('open');previousRoute=route.path;}
    ({home:()=>home(route),controls:()=>catalog(route),control:()=>detail(route),source:()=>source(route),methods:()=>source(route),defense})[route.parts[0]]?.()||(!['home','controls','control','source','methods','defense'].includes(route.parts[0])&&notFound());
    document.documentElement.style.setProperty('--code-size',state.font+'px');document.querySelectorAll('.code-content').forEach(el=>el.style.setProperty('--code-size',state.font+'px'));
    $('#defenseToggle').setAttribute('aria-pressed',String(state.defense));
    document.title=(byId(route.parts[1])?.name||({home:'程序界面',controls:'控件大家族',source:'完整源码',methods:'方法源码',defense:'课堂答辩'})[route.parts[0]]||'源码导航')+' · StudyFlow';
  }
  function updateSearch(value=''){
    const q=value.trim().toLowerCase();
    const items=[...controls.map(c=>({title:c.name,sub:`${displayType(c.type)} · ${c.variable||c.id}`,info:'控件',url:controlUrl(c.id),text:[c.name,displayType(c.type),c.variable,c.summary,...(c.keywords||[]),...(c.methods||[])].join(' ').toLowerCase()})),...methods.map(m=>({title:m.name,sub:`Program.cs · 第 ${m.start}–${m.end} 行`,info:'方法',url:methodUrl(m.id),text:m.name.toLowerCase()}))];
    const matches=q?items.filter(item=>item.text.includes(q)).sort((a,b)=>Number(!a.title.toLowerCase().includes(q))-Number(!b.title.toLowerCase().includes(q))):items.filter(item=>['添加任务','倒计时','专注时长'].some(key=>item.title.includes(key))||item.title==='SaveTasks()');
    $('#searchResults').innerHTML=matches.length?matches.slice(0,50).map(item=>`<a class="search-result" href="${item.url}" role="listitem"><div><b>${esc(item.title)}</b><small>${esc(item.sub)}</small></div><span>${item.info} ↵</span></a>`).join(''):'<div class="empty-state">没有匹配项，试试变量名或中文功能名。</div>';
  }
  function openSearch(){updateSearch($('#globalSearch').value);$('#searchDialog').showModal();$('#globalSearch').focus();}
  async function copy(text){try{await navigator.clipboard.writeText(text);toast('代码已复制');}catch{const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();const ok=document.execCommand('copy');area.remove();toast(ok?'代码已复制':'浏览器未允许复制，可选中代码后按 Ctrl+C');}}
  function toggleDefense(){state.defense=!state.defense;state.font=state.defense?19:14;document.body.classList.toggle('defense-mode',state.defense);render();toast(state.defense?'答辩模式已开启 · H 返回首页 · Ctrl+K 搜索':'已退出答辩模式');}
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('当前浏览器限制网页全屏，可使用浏览器的 F11');}}
  function findSource(delta=0){
    const q=$('#sourceSearch') ? $('#sourceSearch').value.trim() : state.sourceQuery;
    if(q!==state.sourceQuery||!delta){state.sourceQuery=q;state.sourceHits=C.lines().flatMap((line,i)=>q&&line.toLowerCase().includes(q.toLowerCase())?[i+1]:[]);state.hitIndex=0;}else state.hitIndex=(state.hitIndex+delta+state.sourceHits.length)%state.sourceHits.length;
    if(!state.sourceHits.length){$('#sourceSearchInfo').textContent=q?'没有匹配的代码行':'输入文本或方法名进行查找';return;}
    const line=state.sourceHits[state.hitIndex];for(const m of methods){if(m.start<=line&&m.end>=line)state.collapsed.delete(m.id);}
    state.sourceStart=line;state.sourceEnd=line;$('#sourceScroll').innerHTML=sourceBody();scrollSource(line);$('#sourceSearchInfo').textContent=`${state.hitIndex+1} / ${state.sourceHits.length} 个匹配行 · 第 ${line} 行`;
  }
  function navigateRelated(direction){const control=byId(state.lastControl),list=(control?.methods||[]).map(byMethod).filter(Boolean);if(!list.length){toast('此实例没有独立关联方法');return;}const route=readRoute();const current=list.findIndex(m=>m.id===decodeURIComponent(route.parts[1]||''));const next=current<0?(direction>0?0:list.length-1):(current+direction+list.length)%list.length;routeTo('/methods/'+list[next].id);}
  document.addEventListener('click',event=>{
    const target=event.target.closest('button,a,rect');if(!target)return;
    if(target.closest('#searchResults'))$('#searchDialog').close();
    if(target.dataset.tab){state.tab=target.dataset.tab;render();}
    if(target.dataset.mode){state.mode=target.dataset.mode;render();}
    if(target.dataset.level){state.level=target.dataset.level;render();}
    if(target.dataset.region){state.region=target.dataset.region;render();}
    if(target.dataset.copyStart)copy(C.text(+target.dataset.copyStart,+target.dataset.copyEnd,state.mode==='annotated'));
    if(target.dataset.line)routeTo('/source?line='+target.dataset.line);
    if(target.dataset.fold){const id=target.dataset.fold;state.collapsed.has(id)?state.collapsed.delete(id):state.collapsed.add(id);$('#sourceScroll').innerHTML=sourceBody();}
    const action=target.dataset.action;
    if(action==='search')openSearch();if(action==='close-search')$('#searchDialog').close();
    if(action==='theme'){document.body.classList.toggle('dark');safeStore.set('studyflow-theme',document.body.classList.contains('dark')?'dark':'light');}
    if(action==='menu')$('#sidebar').classList.toggle('open');
    if(action==='hotspots'){state.showHotspots=!state.showHotspots;render();}
    if(action==='fullscreen')fullscreen();if(action==='defense')toggleDefense();
    if(action==='notes'){state.showNotes=!state.showNotes;render();}
    if(action==='font-minus'||action==='font-plus'){state.font=Math.min(28,Math.max(11,state.font+(action==='font-plus'?1:-1)));document.documentElement.style.setProperty('--code-size',state.font+'px');document.querySelectorAll('.code-content').forEach(el=>el.style.setProperty('--code-size',state.font+'px'));if($('#fontSizeLabel'))$('#fontSizeLabel').textContent=state.font+'px';}
    if(action==='related-prev')navigateRelated(-1);if(action==='related-next')navigateRelated(1);
    if(action==='source-find')findSource();if(action==='hit-prev')findSource(-1);if(action==='hit-next')findSource(1);
    if(action==='goto-line'){const number=Number($('#lineInput').value);if(!Number.isInteger(number)||number<1||number>C.lines().length){toast(`请输入 1–${C.lines().length} 的行号`);return;}routeTo('/source?line='+number);}
    if(action==='collapse-all'){if(state.collapsed.size)state.collapsed.clear();else methods.filter(m=>m.end>m.start).forEach(m=>state.collapsed.add(m.id));$('#sourceScroll').innerHTML=sourceBody();target.textContent=state.collapsed.size?'展开方法':'折叠方法';}
    if(action==='copy-method'){const m=byMethod(decodeURIComponent(readRoute().parts[1]||''))||methods.filter(m=>m.start<=state.sourceStart&&m.end>=state.sourceStart).sort((a,b)=>(a.end-a.start)-(b.end-b.start))[0];copy(m?C.text(m.start,m.end,state.mode==='annotated'):(state.mode==='raw'?window.SF_SOURCE_TEXT:C.text(1,C.lines().length,true)));}
  });
  document.addEventListener('input',event=>{if(event.target.id==='globalSearch')updateSearch(event.target.value);});
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();return;}
    if(event.key==='Enter'&&event.target.id==='globalSearch'){const result=$('#searchResults a');if(result){$('#searchDialog').close();location.hash=result.hash;}return;}
    if(event.key==='Enter'&&event.target.id==='sourceSearch'){findSource();return;}
    if(event.key==='Enter'&&event.target.id==='lineInput'){$('[data-action="goto-line"]').click();return;}
    if((event.key==='Enter'||event.key===' ')&&event.target.dataset.hotspot){event.preventDefault();routeTo('/control/'+event.target.dataset.hotspot);return;}
    if(event.target.matches('input,textarea,select')||$('#searchDialog').open||event.ctrlKey||event.metaKey||event.altKey)return;
    if(event.key.toLowerCase()==='h')routeTo('/home');if(event.key.toLowerCase()==='d')toggleDefense();if(event.key.toLowerCase()==='f')fullscreen();
  });
  document.addEventListener('pointermove',event=>{const hit=event.target.closest('[data-hotspot]');const tip=$('#hotspotTooltip');if(!hit){tip.hidden=true;return;}const h=hotspots.find(h=>h.id===hit.dataset.hotspot);tip.textContent=`${h.label} · 点击查看源码`;tip.hidden=false;tip.style.left=Math.min(event.clientX+15,window.innerWidth-tip.offsetWidth-10)+'px';tip.style.top=Math.max(8,Math.min(event.clientY+16,window.innerHeight-tip.offsetHeight-10))+'px';});
  document.addEventListener('pointerout',event=>{if(event.target.dataset?.hotspot)$('#hotspotTooltip').hidden=true;});
  window.addEventListener('hashchange',render);
  document.body.classList.toggle('dark',safeStore.get('studyflow-theme','light')==='dark');
  if(!controls.length||!methods.length){$('#main').innerHTML='<div class="empty-state">源码映射文件未能加载，请确认已完整解压项目文件。</div>';return;}
  render();
  // HTTP deployments use the original file. The generated mirror supports file:// offline use.
  if(location.protocol!=='file:')fetch('./source/Program.cs').then(r=>{if(!r.ok)throw new Error('source unavailable');return r.text();}).then(text=>{if(text!==window.SF_SOURCE_TEXT){toast('源码与映射版本不一致，请重新生成 source-text.js 并检查映射');}else window.SF_SOURCE_TEXT=text;}).catch(()=>toast('原始源码读取失败，正在使用已验证的本地源码镜像'));
})();
