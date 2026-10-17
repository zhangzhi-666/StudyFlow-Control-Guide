/* Every range refers to the unchanged, one-based lines in source/Program.cs. */
window.SF_SIMPLE_CONTROLS = [
  {
    type: 'Label', name: '标签',
    description: '显示标题、当前时间、任务详情和专注进度。',
    ranges: [
      { start: 36, end: 39, label: '创建需要动态更新的标签' },
      { start: 121, end: 122, label: '统一设置标签的文字、字体和颜色' },
      { start: 77, end: 78, label: '顶部标题与时钟对齐' },
      { start: 99, end: 101, label: '新建任务区域的文字标签' },
      { start: 103, end: 115, label: '任务清单与专注区域的文字标签' },
      { start: 169, end: 172, label: '更新任务数量和完成百分比' },
      { start: 174, end: 179, label: '显示选中任务的详情' },
      { start: 204, end: 211, label: '更新时钟、倒计时和专注提示' }
    ]
  },
  {
    type: 'Button', name: '按钮',
    description: '点击后添加、完成或删除任务，以及开始、暂停和重置专注。',
    ranges: [
      { start: 41, end: 42, label: '创建五个按钮' },
      { start: 123, end: 127, label: '统一设置按钮样式' },
      { start: 55, end: 55, label: '绑定添加、完成和删除的点击事件' },
      { start: 57, end: 57, label: '绑定专注和重置的点击事件' },
      { start: 146, end: 161, label: '添加、完成和删除任务的实现' },
      { start: 176, end: 176, label: '根据选中任务设置按钮是否可用' },
      { start: 181, end: 191, label: '开始、暂停和重置专注的实现' },
      { start: 207, end: 207, label: '根据专注状态更新按钮文字' }
    ]
  },
  {
    type: 'TextBox', name: '文本框',
    description: '输入任务名称和多行备注，添加任务时读取并清空内容。',
    ranges: [
      { start: 25, end: 26, label: '创建名称与备注文本框' },
      { start: 99, end: 101, label: '将文本框放入新建任务区域' },
      { start: 146, end: 151, label: '校验、读取、清空文本并重新聚焦' }
    ]
  },
  {
    type: 'RadioButton', name: '单选按钮',
    description: '在高、中、低三个优先级中选择一项，默认选择中。',
    ranges: [
      { start: 29, end: 29, label: '创建三个选项并设置默认项' },
      { start: 96, end: 98, label: '放入同一个容器，形成互斥的单选组' },
      { start: 149, end: 149, label: '添加任务时读取 Checked，保存优先级' }
    ]
  },
  {
    type: 'CheckBox', name: '复选框',
    description: '控制未完成任务筛选，以及专注结束时是否弹出提醒。',
    ranges: [
      { start: 31, end: 31, label: '创建两个独立的勾选选项' },
      { start: 56, end: 56, label: '勾选状态变化时刷新任务列表' },
      { start: 164, end: 168, label: '根据 Checked 筛选未完成任务' },
      { start: 197, end: 201, label: '倒计时结束时按勾选状态弹出提醒' }
    ]
  },
  {
    type: 'PictureBox', name: '图片框',
    description: '通过 Paint 事件在顶部绘制白色书本图标。',
    ranges: [
      { start: 75, end: 76, label: '创建图片框并绘制书本图标' },
      { start: 79, end: 79, label: '将图片框放到顶部第一列' }
    ]
  },
  {
    type: 'GroupBox', name: '分组框',
    description: '以“优先级”为标题，容纳三个单选按钮。',
    ranges: [
      { start: 94, end: 102, label: '创建优先级分组框并加入界面' }
    ]
  },
  {
    type: 'ListBox', name: '列表框',
    description: '显示任务列表，选中任务后显示详情。',
    ranges: [
      { start: 30, end: 30, label: '创建任务列表框' },
      { start: 56, end: 56, label: '绑定选中项变化事件' },
      { start: 103, end: 108, label: '将列表框加入任务清单区域' },
      { start: 162, end: 179, label: '刷新列表、保留选中项并显示任务详情' },
      { start: 253, end: 253, label: '任务对象在列表中显示的文字格式' }
    ]
  },
  {
    type: 'ComboBox', name: '下拉组合框',
    description: '选择任务分类和专注分钟数。',
    ranges: [
      { start: 27, end: 27, label: '创建两个只能选择现有选项的下拉框' },
      { start: 52, end: 53, label: '添加选项并设置默认值' },
      { start: 58, end: 58, label: '专注时长改变时重置倒计时' },
      { start: 149, end: 149, label: '添加任务时读取分类文字' },
      { start: 187, end: 191, label: '读取所选分钟数并换算成秒数' },
      { start: 209, end: 209, label: '专注开始后禁止修改时长' }
    ]
  },
  {
    type: 'DateTimePicker', name: '日期时间选择器',
    description: '选择任务截止日期，保存时只保留日期部分。',
    ranges: [
      { start: 28, end: 28, label: '创建使用短日期格式的日期选择器' },
      { start: 99, end: 101, label: '将截止日期选择器加入任务表单' },
      { start: 149, end: 149, label: '通过 Value.Date 读取截止日期' }
    ]
  },
  {
    type: 'StatusStrip', name: '状态栏',
    description: '在窗口底部容纳操作提示和待完成任务数量。',
    ranges: [
      { start: 116, end: 120, label: '创建状态栏并加入两个文字项' },
      { start: 64, end: 69, label: '将状态栏放入窗口底部' }
    ]
  },
  {
    type: 'ToolStripStatusLabel', name: '状态栏标签',
    description: '在状态栏内显示操作结果和待完成任务数量。',
    ranges: [
      { start: 40, end: 40, label: '创建操作提示和数量标签' },
      { start: 116, end: 120, label: '将两个标签加入状态栏' },
      { start: 146, end: 161, label: '添加、完成或删除任务时更新操作提示' },
      { start: 169, end: 172, label: '更新待完成任务数量' },
      { start: 197, end: 201, label: '显示专注完成提示' }
    ]
  },
  {
    type: 'ProgressBar', name: '进度条',
    description: '显示全部任务的完成百分比。',
    ranges: [
      { start: 32, end: 32, label: '创建任务完成进度条' },
      { start: 112, end: 114, label: '将进度条放入专注区域' },
      { start: 169, end: 172, label: '计算完成比例并更新 Value 和文字' }
    ]
  },
  {
    type: 'Timer', name: '计时器',
    description: '每秒刷新时钟，并根据实际经过时间更新专注倒计时。',
    ranges: [
      { start: 33, end: 33, label: '创建每秒触发一次的界面计时器' },
      { start: 35, end: 35, label: '用 Stopwatch 记录实际经过时间' },
      { start: 43, end: 44, label: '记录剩余秒数、累计秒数和运行状态' },
      { start: 58, end: 58, label: '绑定 Tick 事件并启动计时器' },
      { start: 181, end: 191, label: '开始、暂停和重置专注计时' },
      { start: 192, end: 211, label: '每次 Tick 计算时间并更新界面' },
      { start: 242, end: 242, label: '窗口释放时释放计时器' }
    ]
  }
];
