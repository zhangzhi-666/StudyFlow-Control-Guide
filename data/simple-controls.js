/* Ranges use the one-based lines of the current 208-line source/1.cs. */
window.SF_SIMPLE_CONTROLS = [
  {
    type: 'Label', name: '标签',
    description: '显示标题、任务详情、倒计时和完成进度。',
    ranges: [
      { start: 28, end: 31, label: '创建显示任务信息和专注状态的标签' },
      { start: 103, end: 104, label: '统一设置标签的文字、字体和颜色' },
      { start: 65, end: 65, label: '顶部标题与说明文字' },
      { start: 84, end: 86, label: '新建任务区域的文字标签' },
      { start: 160, end: 161, label: '更新任务数量和完成百分比' },
      { start: 167, end: 168, label: '显示选中任务的详情' },
      { start: 190, end: 195, label: '显示剩余时间和专注提示' }
    ]
  },
  {
    type: 'Button', name: '按钮',
    description: '点击后添加、完成或删除任务，以及开始、暂停和重置专注。',
    ranges: [
      { start: 33, end: 34, label: '创建五个按钮' },
      { start: 105, end: 108, label: '统一设置按钮样式' },
      { start: 45, end: 45, label: '绑定任务按钮的点击事件' },
      { start: 47, end: 47, label: '绑定专注和重置按钮的点击事件' },
      { start: 126, end: 147, label: '添加、完成和删除任务' },
      { start: 166, end: 166, label: '根据选中任务设置按钮是否可用' },
      { start: 171, end: 178, label: '开始、暂停和重置专注' },
      { start: 192, end: 193, label: '根据专注状态更新按钮文字' }
    ]
  },
  {
    type: 'TextBox', name: '文本框',
    description: '输入任务名称和多行备注，添加任务时读取并清空内容。',
    ranges: [
      { start: 18, end: 19, label: '创建名称与备注文本框' },
      { start: 84, end: 86, label: '将文本框放入新建任务区域' },
      { start: 127, end: 130, label: '检查名称是否为空，并读取输入内容' },
      { start: 136, end: 136, label: '添加后清空文本并重新聚焦' }
    ]
  },
  {
    type: 'RadioButton', name: '单选按钮',
    description: '在高、中、低三个优先级中选择一项，默认选择中。',
    ranges: [
      { start: 22, end: 22, label: '创建三个选项并设置默认项' },
      { start: 81, end: 83, label: '放入同一个容器，形成互斥的单选组' },
      { start: 132, end: 134, label: '根据 Checked 读取优先级' }
    ]
  },
  {
    type: 'CheckBox', name: '复选框',
    description: '控制未完成任务筛选，以及专注结束时是否弹出提醒。',
    ranges: [
      { start: 24, end: 24, label: '创建两个独立的勾选选项' },
      { start: 46, end: 46, label: '勾选状态变化时刷新任务列表' },
      { start: 150, end: 156, label: '根据 Checked 筛选未完成任务' },
      { start: 184, end: 188, label: '倒计时结束时按勾选状态弹出提醒' }
    ]
  },
  {
    type: 'PictureBox', name: '图片框',
    description: '通过 Paint 事件在顶部绘制白色书本图标。',
    ranges: [
      { start: 63, end: 64, label: '创建图片框并绘制书本图标' },
      { start: 66, end: 66, label: '将图片框放到顶部第一列' }
    ]
  },
  {
    type: 'GroupBox', name: '分组框',
    description: '以“优先级”为标题，容纳三个单选按钮。',
    ranges: [
      { start: 81, end: 86, label: '创建优先级分组框并加入界面' }
    ]
  },
  {
    type: 'ListBox', name: '列表框',
    description: '显示本次运行中的任务，选中任务后显示详情。',
    ranges: [
      { start: 23, end: 23, label: '创建任务列表框' },
      { start: 46, end: 46, label: '绑定选中项变化事件' },
      { start: 90, end: 91, label: '将列表框加入任务清单区域' },
      { start: 149, end: 157, label: '刷新列表并保留选中项' },
      { start: 164, end: 169, label: '读取选中任务并显示详情' },
      { start: 207, end: 207, label: '任务在列表中显示的文字格式' }
    ]
  },
  {
    type: 'ComboBox', name: '下拉组合框',
    description: '选择任务分类和专注分钟数。',
    ranges: [
      { start: 20, end: 20, label: '创建两个只能选择现有选项的下拉框' },
      { start: 41, end: 42, label: '添加选项并设置默认值' },
      { start: 48, end: 48, label: '专注时长改变时重置倒计时' },
      { start: 131, end: 131, label: '添加任务时读取分类文字' },
      { start: 176, end: 178, label: '读取所选分钟数并换算成秒数' },
      { start: 191, end: 191, label: '专注开始后禁止修改时长' }
    ]
  },
  {
    type: 'DateTimePicker', name: '日期时间选择器',
    description: '选择任务截止日期，通过 Value.Date 只读取日期部分。',
    ranges: [
      { start: 21, end: 21, label: '创建使用短日期格式的日期选择器' },
      { start: 84, end: 86, label: '将截止日期选择器加入任务表单' },
      { start: 131, end: 131, label: '通过 Value.Date 读取截止日期' }
    ]
  },
  {
    type: 'StatusStrip', name: '状态栏',
    description: '在窗口底部容纳操作提示和待完成任务数量。',
    ranges: [
      { start: 99, end: 102, label: '创建状态栏并加入两个文字项' },
      { start: 54, end: 58, label: '将状态栏放入窗口底部' }
    ]
  },
  {
    type: 'ToolStripStatusLabel', name: '状态栏标签',
    description: '在状态栏内显示操作结果和待完成任务数量。',
    ranges: [
      { start: 32, end: 32, label: '创建操作提示和数量标签' },
      { start: 100, end: 101, label: '将两个标签加入状态栏' },
      { start: 136, end: 136, label: '添加任务后显示操作结果' },
      { start: 161, end: 161, label: '更新待完成任务数量' },
      { start: 186, end: 186, label: '显示专注完成提示' }
    ]
  },
  {
    type: 'ProgressBar', name: '进度条',
    description: '按“已完成数 × 100 ÷ 总数”显示全部任务的完成百分比。',
    ranges: [
      { start: 25, end: 25, label: '创建任务完成进度条' },
      { start: 97, end: 97, label: '将进度条放入专注区域' },
      { start: 150, end: 161, label: '统计完成数并更新 Value 和百分比文字' }
    ]
  },
  {
    type: 'Timer', name: '计时器',
    description: '专注时每约 1 秒将剩余秒数减 1，归零后停止。',
    ranges: [
      { start: 26, end: 26, label: '设置 Tick 间隔为 1000 毫秒' },
      { start: 35, end: 35, label: '用整数记录剩余秒数' },
      { start: 48, end: 48, label: '绑定 Tick 事件' },
      { start: 171, end: 178, label: '开始、暂停和重置倒计时' },
      { start: 180, end: 189, label: '每次 Tick 减 1 秒，归零后停止并按需提醒' },
      { start: 190, end: 195, label: '将剩余秒数显示为分和秒' },
      { start: 196, end: 197, label: '窗口关闭时释放计时器' }
    ]
  }
];
