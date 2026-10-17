/*
 * Pixel coordinates are calibrated against the supplied, unmodified PNG.
 * Its IHDR reports 2418 × 1560, not the dimensions quoted in the brief.
 * Coordinates use the image's natural size; the SVG and image share a container.
 * Native Windows title-bar buttons are intentionally excluded.
 * Borderless ListBox and Label extents were checked against the real screenshot
 * and the supplied Stack layout, including the screenshot's 2× DPI scaling.
 */
window.SF_IMAGE = { width: 2418, height: 1560 };

window.SF_HOTSPOTS = [
  { id: "icon", x: 58, y: 103, width: 100, height: 108, label: "顶部图标 · PictureBox / Paint", region: "top" },
  { id: "headerTitle", x: 182, y: 79, width: 400, height: 68, label: "StudyFlow 主标题 · Label", region: "top" },
  { id: "headerSubtitle", x: 182, y: 163, width: 500, height: 56, label: "功能副标题 · Label", region: "top" },
  { id: "lblHeaderClock", x: 1914, y: 79, width: 440, height: 140, label: "日期与实时时钟 · lblHeaderClock", region: "top" },

  { id: "editorTitle", x: 86, y: 343, width: 628, height: 56, label: "新建任务标题 · Label", region: "editor" },
  { id: "titleLabel", x: 86, y: 415, width: 628, height: 32, label: "任务名称标签 · Label", region: "editor" },
  { id: "txtTitle", x: 86, y: 463, width: 628, height: 38, label: "任务名称输入框 · txtTitle", region: "editor" },
  { id: "categoryLabel", x: 86, y: 535, width: 628, height: 32, label: "任务分类标签 · Label", region: "editor" },
  { id: "cmbCategory", x: 86, y: 583, width: 628, height: 39, label: "任务分类下拉框 · cmbCategory", region: "editor" },
  { id: "dueLabel", x: 86, y: 655, width: 628, height: 32, label: "截止日期标签 · Label", region: "editor" },
  { id: "dtpDueDate", x: 86, y: 703, width: 628, height: 38, label: "截止日期选择框 · dtpDueDate", region: "editor" },
  // Only the GroupBox title/border band is clickable; radios remain independent.
  { id: "priority", x: 86, y: 775, width: 628, height: 38, label: "优先级分组框 · GroupBox", region: "editor" },
  { id: "rbHigh", x: 108, y: 821, width: 70, height: 40, label: "高优先级 · rbHigh", region: "editor" },
  { id: "rbMedium", x: 189, y: 821, width: 70, height: 40, label: "中优先级 · rbMedium（源码默认）", region: "editor" },
  { id: "rbLow", x: 270, y: 821, width: 70, height: 40, label: "低优先级 · rbLow（截图当前状态）", region: "editor" },
  { id: "noteLabel", x: 86, y: 895, width: 628, height: 32, label: "任务备注标签 · Label", region: "editor" },
  { id: "txtNote", x: 86, y: 943, width: 628, height: 372, label: "多行任务备注 · txtNote", region: "editor" },
  { id: "btnAdd", x: 86, y: 1331, width: 628, height: 72, label: "添加任务 · btnAdd → AddTask()", region: "editor" },

  { id: "listTitle", x: 810, y: 343, width: 838, height: 64, label: "任务清单标题 · Label", region: "list" },
  { id: "lblListCount", x: 810, y: 423, width: 838, height: 40, label: "显示数量与总数 · lblListCount", region: "list" },
  { id: "chkOnlyPending", x: 810, y: 479, width: 838, height: 56, label: "仅显示未完成任务 · chkOnlyPending", region: "list" },
  // The empty ListBox still occupies this area. It stops before lblSelected.
  { id: "lstTasks", x: 810, y: 551, width: 838, height: 516, label: "任务列表（当前为空）· lstTasks / ListBox", region: "list" },
  { id: "lblSelected", x: 810, y: 1083, width: 838, height: 224, label: "选中任务详情 · lblSelected", region: "list" },
  { id: "btnComplete", x: 810, y: 1323, width: 419, height: 80, label: "标记完成 · btnComplete → CompleteTask()", region: "list" },
  { id: "btnDelete", x: 1241, y: 1323, width: 407, height: 80, label: "删除任务 · btnDelete → DeleteTask()", region: "list" },

  { id: "focusTitle", x: 1744, y: 343, width: 582, height: 56, label: "专注计时标题 · Label", region: "focus" },
  { id: "durationLabel", x: 1744, y: 415, width: 582, height: 32, label: "本轮专注时长标签 · Label", region: "focus" },
  { id: "cmbFocusMinutes", x: 1744, y: 463, width: 582, height: 39, label: "专注分钟数 · cmbFocusMinutes", region: "focus" },
  { id: "lblFocusTime", x: 1744, y: 531, width: 582, height: 136, label: "倒计时实现原理 · Label + Timer + Stopwatch", region: "focus" },
  { id: "lblFocusHint", x: 1744, y: 683, width: 582, height: 40, label: "计时状态提示 · lblFocusHint", region: "focus" },
  { id: "btnFocus", x: 1744, y: 739, width: 291, height: 64, label: "开始 / 暂停 / 继续专注 · btnFocus", region: "focus" },
  { id: "btnFocusReset", x: 2047, y: 739, width: 279, height: 64, label: "重置本轮计时 · btnFocusReset", region: "focus" },
  { id: "chkNotify", x: 1744, y: 819, width: 582, height: 40, label: "结束提醒开关 · chkNotify", region: "focus" },
  { id: "lblFocusTotal", x: 1744, y: 875, width: 582, height: 40, label: "本次累计专注时间 · lblFocusTotal", region: "focus" },
  { id: "progressTitle", x: 1744, y: 931, width: 582, height: 44, label: "任务完成进度标题 · Label", region: "focus" },
  { id: "lblProgressText", x: 1744, y: 991, width: 582, height: 60, label: "完成百分比文字 · lblProgressText", region: "focus" },
  { id: "progressTasks", x: 1744, y: 1067, width: 582, height: 32, label: "任务完成进度条 · progressTasks", region: "focus" },
  { id: "lblProgressSummary", x: 1744, y: 1115, width: 582, height: 288, label: "已完成与总任务数 · lblProgressSummary", region: "focus" },

  // StatusStrip shares space with ToolStripStatusLabels. Its separate entry uses
  // the empty center strip, preventing overlapping click targets.
  { id: "statusText", x: 50, y: 1507, width: 380, height: 49, label: "左侧状态信息 · statusText", region: "status" },
  { id: "bar", x: 450, y: 1507, width: 1730, height: 49, label: "底部状态栏整体 · StatusStrip", region: "status" },
  { id: "statusCount", x: 2200, y: 1507, width: 164, height: 49, label: "待完成任务数量 · statusCount", region: "status" }
];
