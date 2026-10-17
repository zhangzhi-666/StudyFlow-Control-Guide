/* Source map, not substitute source code. Anonymous-label IDs are website anchors only. */
(function () {
  'use strict';
  const R = (start, end = start, label = '') => ({ start, end, label });
  const M = (id, label) => {
    const method = window.SF_METHODS.find(item => item.id === id);
    if (!method) throw new Error('Unknown source method: ' + id);
    return R(method.start, method.end, label || method.name);
  };
  const F = (label, method, line) => Object.assign({ label }, method ? { method } : {}, line ? { line } : {});
  const controls = [];
  function add(data) {
    controls.push(Object.assign({
      variable: data.id, group: '控件', summary: '', keyLine: 1,
      methods: [], flow: [], keywords: []
    }, data, { tabs: Object.assign({ definition: [], properties: [], layout: [], events: [], implementation: [], related: [] }, data.tabs) }));
  }
  const stack = M('Stack', 'Stack()：停靠、行高和底部间距');
  const labelFactory = M('Label', '统一 Label 工厂方法');
  const buttonFactory = M('Button', '统一 Button 工厂方法');
  const tasksRelated = [M('RefreshTaskList'), M('SaveTasks')];
  const focusMethods = ['ToggleFocus', 'ResetFocus', 'UiTimer_Tick', 'UpdateFocusDisplay'];
  const focusFlow = [F('btnFocus.Click', null, 57), F('ToggleFocus()', 'ToggleFocus'), F('focusWatch.Start()', null, 184), F('立即 UpdateFocusDisplay()', 'UpdateFocusDisplay'), F('后续 uiTimer.Tick（独立事件）', null, 58), F('UiTimer_Tick()', 'UiTimer_Tick'), F('再次 UpdateFocusDisplay()', 'UpdateFocusDisplay')];

  function inlineLabel(id, name, line, group, method, extra) {
    add(Object.assign({ id, type: 'Label', variable: 'Label("' + name + '")（内联创建）', name, group,
      summary: '此标签由 Label() 工厂方法直接创建并传入布局，没有单独的 C# 字段；' + id + ' 只是网站导航标识。', keyLine: line,
      tabs: { definition: [R(line, line, '内联 Label() 创建调用'), labelFactory], properties: [R(line), labelFactory], layout: [M(method), stack], events: [], implementation: [labelFactory], related: [M(method)] },
      methods: [method, 'Label', 'Stack'], flow: [F(method + '()', method), F('Label() 创建标签', 'Label'), F('Stack() 排列', 'Stack')], keywords: ['文字', '标题', '内联标签']
    }, extra || {}));
  }
  inlineLabel('headerTitle', 'StudyFlow', 77, '顶部区域', 'BuildHeader');
  inlineLabel('headerSubtitle', '学习任务管理  /  专注计时  /  完成进度', 77, '顶部区域', 'BuildHeader');
  inlineLabel('editorTitle', '新建任务', 99, '新建任务', 'BuildTaskEditor');
  inlineLabel('titleLabel', '任务名称', 99, '新建任务', 'BuildTaskEditor');
  inlineLabel('categoryLabel', '任务分类', 100, '新建任务', 'BuildTaskEditor');
  inlineLabel('dueLabel', '截止日期', 100, '新建任务', 'BuildTaskEditor');
  inlineLabel('noteLabel', '任务备注', 101, '新建任务', 'BuildTaskEditor');
  inlineLabel('listTitle', '任务清单', 106, '任务清单', 'BuildTaskList');
  inlineLabel('focusTitle', '专注计时', 112, '专注计时', 'BuildFocusPanel');
  inlineLabel('durationLabel', '本轮专注时长（分钟）', 112, '专注计时', 'BuildFocusPanel');
  inlineLabel('progressTitle', '任务完成进度', 114, '专注计时', 'BuildFocusPanel');

  add({ id: 'icon', type: 'PictureBox', name: '顶部书本图标', group: '顶部区域',
    summary: 'BuildHeader() 中的局部变量 icon。没有加载图片文件；Paint 事件用 Graphics 绘制白色矩形与中线。Windows 系统标题栏图标和窗口按钮不属于这个绘图控件。', keyLine: 76,
    tabs: { definition: [R(75)], properties: [R(75)], layout: [R(72, 79), stack], events: [R(76, 76, 'Paint 绘图事件')], implementation: [R(76)], related: [M('BuildHeader')] },
    methods: ['BuildHeader'], flow: [F('BuildHeader()', 'BuildHeader'), F('创建 PictureBox', null, 75), F('Paint 事件 → Graphics 绘图', null, 76)], keywords: ['图标', '绘图', 'Graphics', 'Pen', 'Paint'] });

  add({ id: 'lblHeaderClock', type: 'Label', name: '日期与实时时钟', group: '顶部区域',
    summary: 'Label 只负责显示日期与时间；uiTimer 每次 Tick 先调用 UpdateClock()，即使未开始专注也继续更新时钟。', keyLine: 204,
    tabs: { definition: [R(36)], properties: [R(36), R(78), labelFactory], layout: [R(72, 79)], events: [R(58)], implementation: [M('UpdateClock'), R(192, 194)], related: [R(33), M('UiTimer_Tick')] },
    methods: ['BuildHeader', 'UpdateClock', 'UiTimer_Tick'], flow: [F('uiTimer.Tick', null, 58), F('UiTimer_Tick()', 'UiTimer_Tick'), F('UpdateClock()', 'UpdateClock'), F('lblHeaderClock.Text', null, 204)], keywords: ['日期', '当前时间', '时钟', 'Timer'] });

  add({ id: 'txtTitle', type: 'TextBox', name: '任务名称输入框', group: '新建任务',
    summary: '保存用户输入的任务名称；最长 80 字符。AddTask() 拒绝空白名称，然后 Trim() 去掉首尾空格，添加到集合并刷新列表后，先清空输入框并重新聚焦，再调用 SaveTasks()。即使后续保存失败，输入框也已经清空。', keyLine: 148,
    tabs: { definition: [R(25)], properties: [R(25), R(59)], layout: [R(99), stack], events: [R(55, 55, '由添加按钮读取；无独立 TextChanged 绑定')], implementation: [M('AddTask')], related: tasksRelated },
    methods: ['BuildTaskEditor', 'AddTask', 'RefreshTaskList', 'SaveTasks'], flow: [F('btnAdd.Click', null, 55), F('AddTask()', 'AddTask'), F('校验并读取 Text', null, 148), F('创建 StudyTask', null, 149), F('加入集合并刷新列表', null, 150), F('清空输入框并重新聚焦', null, 150), F('SaveTasks()', 'SaveTasks')], keywords: ['名称', '输入', '文本框', 'MaxLength', 'Trim', '校验'] });
  add({ id: 'txtNote', type: 'TextBox', name: '任务备注输入框', group: '新建任务',
    summary: '多行文本框，启用纵向滚动条，最多 2000 字符。AddTask() 读取 Text.Trim() 并存入 StudyTask.Note；布局中高度 0 表示占用剩余空间。', keyLine: 26,
    tabs: { definition: [R(26)], properties: [R(26)], layout: [R(101), stack], events: [R(55, 55, '由添加按钮读取；无独立输入事件')], implementation: [M('AddTask'), M('ShowSelectedTask')], related: [R(248), M('SaveTasks')] },
    methods: ['BuildTaskEditor', 'AddTask', 'ShowSelectedTask', 'SaveTasks'], flow: [F('输入多行备注', null, 26), F('AddTask() 读取备注', 'AddTask'), F('StudyTask.Note', null, 248), F('ShowSelectedTask() 展示', 'ShowSelectedTask')], keywords: ['备注', '多行', '滚动条', 'Multiline', 'ScrollBars'] });

  add({ id: 'cmbCategory', type: 'ComboBox', name: '任务分类下拉框', group: '新建任务',
    summary: 'DropDownList 限制为选择现有选项；构造函数添加四种分类并用 SelectedIndex = 0 默认选择“课程学习”。截图中的“编程练习”是当时状态。AddTask() 实际读取 cmbCategory.Text。', keyLine: 52,
    tabs: { definition: [R(27)], properties: [R(27), R(52)], layout: [R(100), stack], events: [R(55, 55, '添加按钮触发读取；此分类下拉框无独立事件绑定')], implementation: [M('AddTask')], related: [R(249), M('SaveTasks')] },
    methods: ['StudyFlowFormDataPath', 'BuildTaskEditor', 'AddTask'], flow: [F('Items.AddRange() 添加四项', null, 52), F('SelectedIndex = 0', null, 52), F('AddTask() 读取 Text', 'AddTask')], keywords: ['分类', '下拉', '选项', 'SelectedIndex', 'Text', 'DropDownList'] });
  add({ id: 'dtpDueDate', type: 'DateTimePicker', name: '截止日期选择框', group: '新建任务',
    summary: 'Format.Short 使用系统短日期显示方式。添加任务时读取 Value.Date，仅保留日期部分。该字段没有显式设置 Value，不能把截图日期当作代码写死的默认值。', keyLine: 149,
    tabs: { definition: [R(28)], properties: [R(28)], layout: [R(100), stack], events: [R(55, 55, '由添加按钮读取日期，无 ValueChanged 绑定')], implementation: [M('AddTask')], related: [R(251), M('ShowSelectedTask')] },
    methods: ['BuildTaskEditor', 'AddTask', 'ShowSelectedTask'], flow: [F('DateTimePicker 选择日期', null, 28), F('AddTask() 读取 Value.Date', 'AddTask'), F('StudyTask.DueDate', null, 251)], keywords: ['截止', '日期', 'Value.Date', 'Format', 'Short'] });

  add({ id: 'priority', type: 'GroupBox', name: '优先级分组框', group: '新建任务',
    summary: 'BuildTaskEditor() 的局部变量 priority，标题为“优先级”。它包含 FlowLayoutPanel radios，三个单选按钮放在 radios 中，共享直接父容器而形成互斥组。', keyLine: 98,
    tabs: { definition: [R(96)], properties: [R(96)], layout: [R(96, 100), stack], events: [], implementation: [R(149, 149, '添加任务时判断优先级')], related: [R(29), M('BuildTaskEditor')] },
    methods: ['BuildTaskEditor', 'AddTask'], flow: [F('创建 GroupBox priority', null, 96), F('创建 FlowLayoutPanel radios', null, 97), F('三个 RadioButton 加入 radios', null, 98), F('AddTask() 读取 Checked', 'AddTask')], keywords: ['优先级', '分组', '容器', '单选', '互斥'] });
  [['rbHigh', '高', false], ['rbMedium', '中', true], ['rbLow', '低', false]].forEach(([id, text, checked]) => {
    add({ id, type: 'RadioButton', name: '优先级：' + text, group: '新建任务',
      summary: (checked ? '此实例在真实源码中设置 Checked = true，是默认优先级。' : '此实例未显式设置 Checked = true。') + '三个单选按钮共享 radios 容器；AddTask() 先检查 rbHigh，再检查 rbLow，否则使用“中”。截图中选中“低”不改变源码默认“中”的事实。', keyLine: 29,
      tabs: { definition: [R(29)], properties: [R(29)], layout: [R(96, 100), stack], events: [R(55, 55, '添加按钮读取 Checked；无独立 CheckedChanged 绑定')], implementation: [M('AddTask')], related: [M('BuildTaskEditor'), R(250)] },
      methods: ['BuildTaskEditor', 'AddTask'], flow: [F('在 radios 容器内单选', null, 98), F('AddTask() 读取 Checked', 'AddTask'), F('写入 StudyTask.Priority', null, 149)], keywords: ['优先级', text, 'Checked', '单选', '默认中', '互斥'] });
  });

  add({ id: 'btnAdd', type: 'Button', name: '添加任务', group: '新建任务',
    summary: 'Button() 工厂创建主色按钮；Click 事件通过 lambda 调用 AddTask()。方法校验任务名称、读取表单、添加对象、刷新列表、清空输入框并聚焦，再调用 SaveTasks()；只有保存成功才显示已保存提示。', keyLine: 55,
    tabs: { definition: [R(41), buttonFactory], properties: [R(41), buttonFactory], layout: [R(101), stack], events: [R(55)], implementation: [M('AddTask')], related: [M('StudyTask'), ...tasksRelated] },
    methods: ['Button', 'BuildTaskEditor', 'AddTask', 'RefreshTaskList', 'SaveTasks'], flow: [F('btnAdd.Click', null, 55), F('AddTask()', 'AddTask'), F('创建 StudyTask', null, 149), F('tasks.Add()', null, 150), F('RefreshTaskList()', 'RefreshTaskList'), F('清空输入框并重新聚焦', null, 150), F('SaveTasks()', 'SaveTasks')], keywords: ['添加', '新建', 'Click', '保存', '创建'] });

  add({ id: 'lblListCount', type: 'Label', name: '显示数量 / 全部数量', group: '任务清单',
    summary: 'RefreshTaskList() 分别读取 lstTasks.Items.Count 和 tasks.Count，显示筛选后的可见数量与全部任务数量。', keyLine: 171,
    tabs: { definition: [R(36)], properties: [R(36), labelFactory], layout: [R(106), stack], events: [R(56)], implementation: [M('RefreshTaskList')], related: [R(23), R(30), R(31)] },
    methods: ['BuildTaskList', 'RefreshTaskList'], flow: [F('任务变更或筛选', null, 56), F('RefreshTaskList()', 'RefreshTaskList'), F('更新显示数与总数', null, 171)], keywords: ['数量', '计数', '筛选', 'Items.Count', '显示'] });
  add({ id: 'chkOnlyPending', type: 'CheckBox', name: '仅显示未完成任务', group: '任务清单',
    summary: 'CheckedChanged 触发刷新。Where 条件是“未勾选筛选，或该任务未完成”；过滤仅影响 ListBox，完成率与总数仍基于完整 tasks 集合。', keyLine: 166,
    tabs: { definition: [R(31)], properties: [R(31)], layout: [R(106), stack], events: [R(56)], implementation: [M('RefreshTaskList')], related: [R(169, 172)] },
    methods: ['BuildTaskList', 'RefreshTaskList'], flow: [F('chkOnlyPending.CheckedChanged', null, 56), F('RefreshTaskList()', 'RefreshTaskList'), F('LINQ Where() 筛选', null, 166), F('更新 ListBox', null, 166)], keywords: ['筛选', '未完成', '复选框', 'CheckedChanged', 'Where'] });
  add({ id: 'lstTasks', type: 'ListBox', name: '任务列表（空白区域）', group: '任务清单',
    summary: '即使没有任务，ListBox 也存在并占据剩余空间。Items 中存放 StudyTask 对象，由 ToString() 决定显示文本；SelectedItem 用来查看、完成或删除所选任务。', keyLine: 166,
    tabs: { definition: [R(30)], properties: [R(30), R(59)], layout: [R(107), stack], events: [R(56)], implementation: [M('RefreshTaskList'), M('ShowSelectedTask')], related: [M('ToString'), M('CompleteTask'), M('DeleteTask')] },
    methods: ['BuildTaskList', 'RefreshTaskList', 'ShowSelectedTask', 'ToString', 'CompleteTask', 'DeleteTask'], flow: [F('RefreshTaskList()', 'RefreshTaskList'), F('Items.Add(StudyTask)', null, 166), F('ToString() 生成显示文本', 'ToString'), F('SelectedIndexChanged', null, 56), F('ShowSelectedTask()', 'ShowSelectedTask')], keywords: ['列表', '空白', '选择', 'SelectedItem', 'Items', 'ToString'] });
  add({ id: 'lblSelected', type: 'Label', name: '所选任务详情', group: '任务清单',
    summary: '无选择时提示“选择一个任务查看详情”；有选择时展示名称、分类、优先级、截止日期、完成状态和备注。AutoEllipsis 处理溢出文字，ToolTip 显示完整备注。', keyLine: 177,
    tabs: { definition: [R(37)], properties: [R(37), R(105), labelFactory], layout: [R(107), stack], events: [R(56)], implementation: [M('ShowSelectedTask')], related: [R(34), M('RefreshTaskList')] },
    methods: ['BuildTaskList', 'ShowSelectedTask', 'RefreshTaskList'], flow: [F('lstTasks.SelectedIndexChanged', null, 56), F('ShowSelectedTask()', 'ShowSelectedTask'), F('更新 Label.Text 与 ToolTip', null, 177)], keywords: ['详情', '选择', '备注', 'AutoEllipsis', 'ToolTip'] });

  [['btnComplete', '标记完成', 'CompleteTask', '修改 task.Completed = true', 155], ['btnDelete', '删除任务', 'DeleteTask', 'tasks.Remove(task)', 160]].forEach(([id, name, method, action, line]) => {
    add({ id, type: 'Button', name, group: '任务清单',
      summary: id === 'btnComplete' ? '选中未完成任务后才启用；Click 调用 CompleteTask()，将 Completed 改为 true，刷新列表并保存。若启用“仅显示未完成”，此任务完成后会从当前视图消失。' : '选中任务后才启用；Click 调用 DeleteTask()，从 tasks 集合移除所选对象，刷新界面并保存。此原程序没有删除确认弹窗。', keyLine: line,
      tabs: { definition: [R(41), buttonFactory], properties: [buttonFactory, R(176)], layout: [R(107), M('ButtonRow')], events: [R(55)], implementation: [M(method)], related: [M('ShowSelectedTask'), ...tasksRelated] },
      methods: ['Button', 'ButtonRow', 'ShowSelectedTask', method, 'RefreshTaskList', 'SaveTasks'], flow: [F(id + '.Click', null, 55), F(method + '()', method), F(action, null, line), F('RefreshTaskList()', 'RefreshTaskList'), F('SaveTasks()', 'SaveTasks')], keywords: [name, '任务', 'Click', 'Enabled', '保存'] });
  });

  add({ id: 'cmbFocusMinutes', type: 'ComboBox', name: '本轮专注时长', group: '专注计时',
    summary: '提供 15、25、45、60 分钟，默认 SelectedItem = 25。初始选择在事件绑定之前设置；绑定之后的选择变化才通过处理器触发 ResetFocus()。运行中与已暂停的未重置会话都不可更改时长。', keyLine: 53,
    tabs: { definition: [R(27)], properties: [R(27), R(53), R(209)], layout: [R(112), stack], events: [R(58)], implementation: [M('ResetFocus'), M('UpdateFocusDisplay')], related: [M('ToggleFocus')] },
    methods: ['StudyFlowFormDataPath', 'BuildFocusPanel', 'ResetFocus', 'UpdateFocusDisplay'], flow: [F('初始化后用户更改选择'), F('SelectedIndexChanged', null, 58), F('ResetFocus()', 'ResetFocus'), F('分钟 × 60 → 秒', null, 190), F('UpdateFocusDisplay()', 'UpdateFocusDisplay')], keywords: ['分钟', '时长', '下拉', 'SelectedItem', '15', '25', '45', '60'] });
  add({ id: 'lblFocusTime', type: 'Label', name: '25:00 · 倒计时实现原理', group: '专注计时',
    summary: 'lblFocusTime 是显示分钟和秒的 Label；uiTimer 每约 1000 ms 提供 UI 更新时机，focusWatch 测量实际经过时间。Tick 用 Stopwatch 的整数秒差值校正倒计时，不假设每次回调都准时经过一秒。', keyLine: 195,
    tabs: { definition: [R(37), R(33, 35, 'Timer、ToolTip 与 Stopwatch 字段（原始相邻行）'), R(43, 44, '计时与状态字段')], properties: [R(33), R(37), R(111), labelFactory], layout: [R(111, 114), stack], events: [R(57, 58)], implementation: focusMethods.map(id => M(id)), related: [R(242), R(53), M('UpdateClock')] },
    methods: focusMethods, flow: focusFlow, keywords: ['倒计时', '25:00', '计时器', 'Timer', 'Stopwatch', 'Interval', 'Tick', '秒', '暂停'] });
  add({ id: 'lblFocusHint', type: 'Label', name: '专注状态提示', group: '专注计时',
    summary: 'UpdateFocusDisplay() 根据运行状态、剩余秒数及 Stopwatch 是否已经计时，显示进行中、完成、已暂停或准备状态。', keyLine: 208,
    tabs: { definition: [R(38)], properties: [R(38), labelFactory], layout: [R(113), stack], events: [R(57, 58)], implementation: [M('UpdateFocusDisplay')], related: [M('ToggleFocus'), M('ResetFocus'), M('UiTimer_Tick')] },
    methods: ['UpdateFocusDisplay', 'ToggleFocus', 'ResetFocus', 'UiTimer_Tick'], flow: [F('计时状态变化', null, 183), F('UpdateFocusDisplay()', 'UpdateFocusDisplay'), F('更新 lblFocusHint.Text', null, 208)], keywords: ['状态', '准备', '暂停', '进行中', '提示'] });
  add({ id: 'btnFocus', type: 'Button', name: '开始 / 暂停 / 继续专注', group: '专注计时',
    summary: '一个按钮承担开始、暂停、继续与再来一轮。暂停时先 Stop()，再调用 Tick 结算末尾秒数；继续时 Start() 接着累计。UpdateFocusDisplay() 决定按钮文字。', keyLine: 183,
    tabs: { definition: [R(42), buttonFactory], properties: [buttonFactory, R(207)], layout: [R(113), M('ButtonRow')], events: [R(57)], implementation: [M('ToggleFocus')], related: [M('ResetFocus'), M('UiTimer_Tick'), M('UpdateFocusDisplay')] },
    methods: ['Button', 'ButtonRow', ...focusMethods], flow: focusFlow, keywords: ['开始', '暂停', '继续', '专注', 'Stopwatch', 'Start', 'Stop'] });
  add({ id: 'btnFocusReset', type: 'Button', name: '重置本轮专注', group: '专注计时',
    summary: 'ResetFocus() 停止当前计时并补算已经过的秒数，重置 Stopwatch 和本轮 countedSeconds，然后按所选分钟恢复剩余秒数。focusedSeconds 不清零，保留本次打开程序期间累计。', keyLine: 190,
    tabs: { definition: [R(42), buttonFactory], properties: [buttonFactory, R(60)], layout: [R(113), M('ButtonRow')], events: [R(57, 58)], implementation: [M('ResetFocus')], related: [M('UiTimer_Tick'), M('UpdateFocusDisplay')] },
    methods: ['Button', 'ButtonRow', 'ResetFocus', 'UiTimer_Tick', 'UpdateFocusDisplay'], flow: [F('btnFocusReset.Click', null, 57), F('ResetFocus()', 'ResetFocus'), F('运行时结算一次 Tick', 'UiTimer_Tick'), F('清零本轮测量，保留累计', null, 190), F('UpdateFocusDisplay()', 'UpdateFocusDisplay')], keywords: ['重置', '保留累计', 'Reset', 'countedSeconds'] });
  add({ id: 'chkNotify', type: 'CheckBox', name: '专注结束时提醒我', group: '专注计时',
    summary: '默认 Checked = true。没有独立 CheckedChanged 处理器；UiTimer_Tick() 检测剩余时间归零后读取 Checked，决定是否显示 MessageBox。取消勾选仍会更新状态文字。', keyLine: 200,
    tabs: { definition: [R(31)], properties: [R(31)], layout: [R(113), stack], events: [R(58, 58, '由 Timer.Tick 在结束时读取，无独立复选事件')], implementation: [M('UiTimer_Tick')], related: [M('UpdateFocusDisplay')] },
    methods: ['BuildFocusPanel', 'UiTimer_Tick', 'UpdateFocusDisplay'], flow: [F('UiTimer_Tick()', 'UiTimer_Tick'), F('remainingSeconds == 0', null, 197), F('读取 chkNotify.Checked', null, 200), F('勾选时 MessageBox.Show()', null, 200)], keywords: ['提醒', '通知', '复选框', 'MessageBox', 'Checked'] });
  add({ id: 'lblFocusTotal', type: 'Label', name: '本次累计专注时间', group: '专注计时',
    summary: '显示 focusedSeconds 的分钟与秒数。本次打开程序期间持续累计，重置本轮倒计时也不会清零；未保存到 JSON，不能声称跨会话或按日统计。字段初始文字会在构造函数中被更新。', keyLine: 210,
    tabs: { definition: [R(39), R(43)], properties: [R(39), labelFactory], layout: [R(113), stack], events: [R(58)], implementation: [R(195, 196), M('UpdateFocusDisplay')], related: [M('ResetFocus'), M('SaveTasks')] },
    methods: ['UiTimer_Tick', 'UpdateFocusDisplay', 'ResetFocus'], flow: [F('Stopwatch 实际经过秒数', null, 195), F('focusedSeconds += elapsed', null, 196), F('UpdateFocusDisplay()', 'UpdateFocusDisplay'), F('分钟与秒格式化', null, 210)], keywords: ['累计', '会话', 'focusedSeconds', '时间', '分钟'] });

  add({ id: 'lblProgressText', type: 'Label', name: '任务完成百分比', group: '专注计时',
    summary: '显示 progressTasks.Value 加上百分号。完成率按全部 tasks 计算，与是否只显示未完成任务无关；无任务时为 0%，其余由 Math.Round() 取整，恰好为 .5 的中点按最近偶数取整。', keyLine: 171,
    tabs: { definition: [R(38)], properties: [R(38), labelFactory], layout: [R(114), stack], events: [R(55, 56)], implementation: [M('RefreshTaskList')], related: [R(32), R(169, 172)] },
    methods: ['BuildFocusPanel', 'RefreshTaskList'], flow: [F('RefreshTaskList()', 'RefreshTaskList'), F('已完成 / 全部 × 100', null, 170), F('lblProgressText.Text', null, 171)], keywords: ['完成率', '百分比', '进度', '0%', 'Math.Round'] });
  add({ id: 'progressTasks', type: 'ProgressBar', name: '任务完成进度条', group: '专注计时',
    summary: 'RefreshTaskList() 用 tasks.Count(t => t.Completed) 统计完成数，以全部任务数为分母，乘 100 后 Math.Round()。默认中点取偶，例如 1/8 得到 12.5%，显示 12%。total == 0 时显式设为 0，避免除零。', keyLine: 170,
    tabs: { definition: [R(32)], properties: [R(32, 32, '未显式修改默认 Minimum / Maximum'), R(170)], layout: [R(114), stack], events: [R(55, 56)], implementation: [M('RefreshTaskList')], related: [M('CompleteTask'), R(171, 172)] },
    methods: ['BuildFocusPanel', 'RefreshTaskList', 'CompleteTask'], flow: [F('RefreshTaskList()', 'RefreshTaskList'), F('统计 done 和 total', null, 169), F('无任务取 0，否则 Math.Round() 取整', null, 170), F('ProgressBar.Value', null, 170)], keywords: ['进度条', '完成率', 'Math.Round', '除零', 'Value'] });
  add({ id: 'lblProgressSummary', type: 'Label', name: '已完成数量 / 总数量', group: '专注计时',
    summary: '完成数量使用全部任务中的 Completed 数量，总数量使用 tasks.Count；筛选列表不会改变这里的统计口径。', keyLine: 172,
    tabs: { definition: [R(39)], properties: [R(39), labelFactory], layout: [R(114), stack], events: [R(55, 56)], implementation: [M('RefreshTaskList')], related: [R(169, 172)] },
    methods: ['BuildFocusPanel', 'RefreshTaskList'], flow: [F('RefreshTaskList()', 'RefreshTaskList'), F('统计全部任务与完成项', null, 169), F('更新 lblProgressSummary', null, 172)], keywords: ['完成数量', '总数', '统计', '已完成'] });

  add({ id: 'bar', type: 'StatusStrip', name: '底部状态栏整体', group: '底部状态栏',
    summary: 'BuildStatusBar() 中的局部变量 bar，添加 statusText 和 statusCount 两个 ToolStripStatusLabel。关闭大小调整握柄，整个状态栏放在最外层布局的底部。', keyLine: 119,
    tabs: { definition: [R(118)], properties: [R(118)], layout: [R(66), R(118, 119)], events: [], implementation: [M('BuildStatusBar')], related: [R(40), M('RefreshTaskList')] },
    methods: ['BuildStatusBar', 'BuildInterface', 'RefreshTaskList'], flow: [F('BuildInterface()', 'BuildInterface'), F('BuildStatusBar()', 'BuildStatusBar'), F('Items.AddRange() 添加两个状态标签', null, 119)], keywords: ['状态栏', '底部', 'StatusLabel', 'Items.AddRange'] });
  add({ id: 'statusText', type: 'ToolStripStatusLabel', name: '左侧状态信息', group: '底部状态栏',
    summary: '课件中的 StatusLabel 在这里实际使用 ToolStripStatusLabel。Spring = true 让左侧标签填充剩余宽度；任务操作、计时结束和持久化错误都会修改 Text。', keyLine: 40,
    tabs: { definition: [R(40)], properties: [R(40)], layout: [M('BuildStatusBar')], events: [R(55), R(58)], implementation: [M('AddTask'), M('CompleteTask'), M('DeleteTask'), R(199), M('LoadTasks'), M('SaveTasks')], related: [M('BuildStatusBar')] },
    methods: ['BuildStatusBar', 'AddTask', 'CompleteTask', 'DeleteTask', 'LoadTasks', 'SaveTasks'], flow: [F('创建时 Spring = true', null, 40), F('任务操作 / 计时 / 读写', null, 150), F('根据结果修改 statusText.Text', null, 150)], keywords: ['状态', '提示', '保存失败', 'Spring', 'StatusLabel', '准备就绪'] });
  add({ id: 'statusCount', type: 'ToolStripStatusLabel', name: '右侧待完成任务数', group: '底部状态栏',
    summary: '状态栏右侧的 ToolStripStatusLabel，RefreshTaskList() 将全部任务数减去已完成数，更新“待完成 N 项”。', keyLine: 172,
    tabs: { definition: [R(40)], properties: [R(40)], layout: [M('BuildStatusBar')], events: [R(55, 56)], implementation: [M('RefreshTaskList')], related: [R(169, 172)] },
    methods: ['BuildStatusBar', 'RefreshTaskList'], flow: [F('RefreshTaskList()', 'RefreshTaskList'), F('total - done', null, 172), F('statusCount.Text', null, 172)], keywords: ['待完成', '状态栏', '数量', 'StatusLabel'] });

  add({ id: 'uiTimer', type: 'Timer', name: '每秒 UI 刷新计时器', group: '非可视控件',
    summary: 'System.Windows.Forms.Timer 的 Interval = 1000 表示以 1000 毫秒为期望间隔触发 Tick，在 UI 线程更新界面。实际耗时由 Stopwatch 测量，避免把延迟回调误算为仅一秒。构造函数绑定并 Start()，窗体释放时 Dispose()。', keyLine: 58,
    tabs: { definition: [R(33)], properties: [R(33)], layout: [], events: [R(58)], implementation: [M('UiTimer_Tick'), M('UpdateClock'), M('UpdateFocusDisplay')], related: [M('ToggleFocus'), M('ResetFocus'), R(35), R(242)] },
    methods: ['UiTimer_Tick', 'UpdateClock', 'UpdateFocusDisplay', 'ToggleFocus', 'ResetFocus', 'Dispose'], flow: [F('Interval = 1000 ms', null, 33), F('Tick += UiTimer_Tick; Start()', null, 58), F('后续 Tick → UiTimer_Tick()', 'UiTimer_Tick'), F('UpdateClock()', 'UpdateClock'), F('运行时计算实际秒差', null, 195), F('UpdateFocusDisplay()', 'UpdateFocusDisplay')], keywords: ['计时器', '非可视', 'Tick', 'Interval', '1000', 'UI线程', '倒计时'] });

  add({ id: 'panel', type: 'Panel', variable: 'card（局部变量，循环创建 3 个）', name: '三张白色卡片容器', group: '扩展知识',
    summary: 'BuildCards() 在循环中创建三个白色 Panel，用 Padding 留出内边距，用 Margin 分开卡片；每个 Panel 容纳一列功能界面。', keyLine: 89,
    tabs: { definition: [R(89)], properties: [R(89)], layout: [M('BuildCards')], events: [], implementation: [M('BuildCards')], related: [M('BuildTaskEditor'), M('BuildTaskList'), M('BuildFocusPanel')] },
    methods: ['BuildCards', 'BuildTaskEditor', 'BuildTaskList', 'BuildFocusPanel'], flow: [F('BuildCards()', 'BuildCards'), F('循环创建 Panel', null, 87), F('卡片内部加入内容', null, 90)], keywords: ['容器', '卡片', 'Padding', 'Margin', '布局'] });
  add({ id: 'tableLayout', type: 'TableLayoutPanel', variable: 'header / cards / table / row（局部变量）', name: '表格布局与 Stack() 布局助手', group: '扩展知识',
    summary: 'TableLayoutPanel 构成顶部三列、主区 31% / 40% / 29% 三列，以及纵向 Stack() 和按钮行。Stack() 的 height == 0 使用百分比行，其余使用绝对高度。', keyLine: 135,
    tabs: { definition: [R(72), R(83), R(130), R(141)], properties: [R(72, 74), R(83, 85), R(130, 135), R(141, 142)], layout: [M('BuildInterface'), M('BuildCards')], events: [], implementation: [M('Stack'), M('ButtonRow')], related: [M('BuildHeader')] },
    methods: ['Stack', 'ButtonRow', 'BuildInterface', 'BuildCards', 'BuildHeader'], flow: [F('BuildInterface()', 'BuildInterface'), F('Stack() 生成表格', 'Stack'), F('配置 RowStyles', null, 135), F('Controls.Add() 放入对应行', null, 135)], keywords: ['布局', '自适应', '行高', '百分比', 'Dock', 'RowStyles', 'ColumnStyles', 'Stack'] });
  add({ id: 'flowLayout', type: 'FlowLayoutPanel', variable: 'radios（局部变量）', name: '三个优先级的流式排列', group: '扩展知识',
    summary: 'radios 将高、中、低单选按钮顺序排列，WrapContents = false 禁止自动换行。三个 RadioButton 以它为共同父容器，实现组内互斥。', keyLine: 98,
    tabs: { definition: [R(97)], properties: [R(97)], layout: [R(96, 100)], events: [], implementation: [M('BuildTaskEditor')], related: [R(29), R(149)] },
    methods: ['BuildTaskEditor', 'AddTask'], flow: [F('创建 radios', null, 97), F('AddRange() 放入单选按钮', null, 98), F('priority.Controls.Add(radios)', null, 98)], keywords: ['流式布局', '单选', '优先级', '共同父容器', 'WrapContents'] });
  add({ id: 'tips', type: 'ToolTip', name: '悬停提示组件', group: '扩展知识',
    summary: '非可视组件，用 SetToolTip() 为名称框、任务列表、重置按钮、所选任务备注及读取错误设置提示。窗体释放时调用 Dispose()。', keyLine: 59,
    tabs: { definition: [R(34)], properties: [R(59, 60), R(178), R(223)], layout: [], events: [], implementation: [R(59, 60), M('ShowSelectedTask'), M('LoadTasks')], related: [R(242)] },
    methods: ['StudyFlowFormDataPath', 'ShowSelectedTask', 'LoadTasks', 'Dispose'], flow: [F('创建 ToolTip', null, 34), F('SetToolTip(control, text)', null, 59), F('鼠标悬停时显示提示', null, 59)], keywords: ['悬停', '工具提示', '备注', '非可视', 'SetToolTip'] });
  add({ id: 'focusWatch', type: 'Stopwatch', name: '真实经过时间测量', group: '扩展知识',
    summary: 'Stopwatch 是计时测量类，不是可见控件，也不负责自动更新标签。Start/Stop 支持暂停继续；Tick 用 Elapsed.TotalSeconds 减去已结算 countedSeconds，得出新增秒数。', keyLine: 195,
    tabs: { definition: [R(35), R(43)], properties: [R(35)], layout: [], events: [R(57, 58)], implementation: focusMethods.map(id => M(id)), related: [R(33), R(242)] },
    methods: focusMethods, flow: focusFlow, keywords: ['测量', 'Stopwatch', 'Elapsed', '秒差', '暂停', '累计', '误差'] });
  add({ id: 'tasks', type: 'List<StudyTask>', name: '内存中的全部任务', group: '扩展知识',
    summary: 'tasks 是完整任务集合；ListBox 只是其筛选后视图。新增和删除修改集合，完成任务修改对象的 Completed 属性。SaveTasks() 序列化整个集合。', keyLine: 23,
    tabs: { definition: [R(23)], properties: [M('StudyTask')], layout: [], events: [R(55, 56)], implementation: [M('AddTask'), M('CompleteTask'), M('DeleteTask'), M('RefreshTaskList')], related: [M('LoadTasks'), M('SaveTasks')] },
    methods: ['AddTask', 'CompleteTask', 'DeleteTask', 'RefreshTaskList', 'LoadTasks', 'SaveTasks'], flow: [F('初始化 List<StudyTask>', null, 23), F('LoadTasks()', 'LoadTasks'), F('用户进行任务增删改', 'AddTask'), F('RefreshTaskList()', 'RefreshTaskList'), F('SaveTasks()', 'SaveTasks')], keywords: ['集合', '泛型', 'List', '数据', '模型', 'tasks'] });
  add({ id: 'StudyTask', type: 'StudyTask', name: '任务数据模型', group: '扩展知识',
    summary: 'StudyTask 保存任务名称、备注、分类、优先级、截止日期和完成状态。ToString() 生成 ListBox 中的任务文字；这不是 WinForms 控件。', keyLine: 245,
    tabs: { definition: [M('StudyTask')], properties: [R(247, 252)], layout: [], events: [], implementation: [M('ToString'), M('AddTask')], related: [M('RefreshTaskList'), M('LoadTasks'), M('SaveTasks')] },
    methods: ['StudyTask', 'ToString', 'AddTask', 'RefreshTaskList', 'LoadTasks', 'SaveTasks'], flow: [F('AddTask() 创建 StudyTask', 'AddTask'), F('六个属性存储数据', null, 247), F('ToString() 显示列表项', 'ToString'), F('SaveTasks() 持久化', 'SaveTasks')], keywords: ['模型', '类', '属性', 'Completed', 'ToString', '数据对象'] });
  add({ id: 'linq', type: 'LINQ', variable: 'Where / Count / Any', name: '任务筛选、统计与数据检查', group: '扩展知识',
    summary: 'Where 根据筛选复选框选择可见任务；Count(predicate) 统计已完成任务；Any 检查读取到的数据是否含空任务或空白名称。筛选不会删除原集合中的项目。', keyLine: 166,
    tabs: { definition: [R(6)], properties: [R(166), R(169), R(219)], layout: [], events: [R(56)], implementation: [M('RefreshTaskList'), M('LoadTasks')], related: [R(23), M('StudyTask')] },
    methods: ['RefreshTaskList', 'LoadTasks'], flow: [F('CheckedChanged', null, 56), F('RefreshTaskList()', 'RefreshTaskList'), F('Where() 筛选可见任务', null, 166), F('Count() 统计已完成任务', null, 169)], keywords: ['筛选', 'Where', 'Count', 'Any', 'lambda', '统计'] });
  add({ id: 'json', type: 'JSON', variable: 'JsonSerializer / savePath', name: 'JSON 数据持久化', group: '扩展知识',
    summary: '启动时 LoadTasks() 读取 JSON 并反序列化为任务集合。变更时 SaveTasks() 先写入 .tmp，再 File.Move(..., true) 覆盖目标文件。默认保存到 LocalApplicationData 下的 StudyFlowWinForms/tasks.json。', keyLine: 232,
    tabs: { definition: [R(5, 7), R(24), R(46, 49)], properties: [R(232)], layout: [], events: [R(54, 55), M('OnFormClosing')], implementation: [M('LoadTasks'), M('SaveTasks')], related: [M('StudyTask'), M('OnFormClosing')] },
    methods: ['StudyFlowForm', 'LoadTasks', 'SaveTasks', 'OnFormClosing', 'StudyTask'], flow: [F('任务发生变化', null, 150), F('SaveTasks()', 'SaveTasks'), F('JsonSerializer.Serialize()', null, 232), F('写入 .tmp 临时文件', null, 232), F('File.Move() 替换目标 JSON', null, 233)], keywords: ['保存', '数据保存', '持久化', 'JSON', '序列化', '反序列化', '文件', '读取', '恢复'] });
  add({ id: 'tryCatch', type: 'try-catch', variable: 'canSave / dirty / catch when', name: '异常保护与退出确认', group: '扩展知识',
    summary: '读取失败时 canSave = false，阻止覆盖原任务文件；写入失败保留 dirty。关闭窗口时若仍未保存且重试失败，询问是否退出。catch 的 when 条件只处理预期的 I/O、权限和 JSON 异常。', keyLine: 223,
    tabs: { definition: [R(44)], properties: [R(222, 223), R(227, 228)], layout: [], events: [M('OnFormClosing')], implementation: [M('LoadTasks'), M('SaveTasks'), M('OnFormClosing')], related: [R(40), R(34)] },
    methods: ['LoadTasks', 'SaveTasks', 'OnFormClosing'], flow: [F('LoadTasks() / SaveTasks()', 'LoadTasks'), F('catch when 处理指定异常', null, 222), F('保留原文件或未保存状态', null, 223), F('OnFormClosing() 重试并提示', 'OnFormClosing')], keywords: ['异常', '容错', '保存失败', '加载失败', 'canSave', 'dirty', '退出确认', 'try', 'catch'] });

  window.SF_CONTROLS = controls;
}());
