/* 教学排版版：仅调整原始 C# 的换行和缩进；键为原文件行号。 */
window.SF_TEACHING_LINES = {
  "25": [
    {
      "code": "    private readonly TextBox txtTitle = new() {",
      "comment": "创建名称输入框。"
    },
    {
      "code": "        PlaceholderText = \"例如：完成 C# 控件练习\",",
      "comment": "空输入时显示提示，不作为真实输入保存。"
    },
    {
      "code": "        MaxLength = 80 };",
      "comment": "限制最多输入 80 个字符。"
    }
  ],
  "26": [
    {
      "code": "    private readonly TextBox txtNote = new() {",
      "comment": "创建备注输入框。"
    },
    {
      "code": "        Multiline = true,",
      "comment": "允许输入多行文本。"
    },
    {
      "code": "        ScrollBars = ScrollBars.Vertical,",
      "comment": "显示垂直滚动条。"
    },
    {
      "code": "        PlaceholderText = \"记录任务步骤或学习要点…\",",
      "comment": "为空时显示备注提示。"
    },
    {
      "code": "        MaxLength = 2000 };",
      "comment": "限制最多输入 2000 个字符。"
    }
  ],
  "27": [
    {
      "code": "    private readonly ComboBox cmbCategory = new() { DropDownStyle = ComboBoxStyle.DropDownList },",
      "comment": "创建只允许选择已有选项的分类下拉框。"
    },
    {
      "code": "        cmbFocusMinutes = new() { DropDownStyle = ComboBoxStyle.DropDownList };",
      "comment": "同样创建专注时长下拉框。"
    }
  ],
  "29": [
    {
      "code": "    private readonly RadioButton rbHigh = new() { Text = \"高\", AutoSize = true },",
      "comment": "创建高优先级按钮，未显式设置选中。"
    },
    {
      "code": "        rbMedium = new() { Text = \"中\", AutoSize = true, Checked = true },",
      "comment": "中优先级显式 Checked=true，是源码默认选择。"
    },
    {
      "code": "        rbLow = new() { Text = \"低\", AutoSize = true };",
      "comment": "创建低优先级按钮；截图选中低不代表默认低。"
    }
  ],
  "31": [
    {
      "code": "    private readonly CheckBox chkOnlyPending = new() { Text = \"仅显示未完成任务\" },",
      "comment": "创建未完成筛选复选框。"
    },
    {
      "code": "        chkNotify = new() { Text = \"专注结束时提醒我\", Checked = true };",
      "comment": "结束提醒默认勾选。"
    }
  ],
  "40": [
    {
      "code": "    private readonly ToolStripStatusLabel statusText = new(\"准备就绪\") { Spring = true, TextAlign = ContentAlignment.MiddleLeft },",
      "comment": "左侧状态文字占据状态栏剩余空间。"
    },
    {
      "code": "        statusCount = new();",
      "comment": "右侧状态项显示待完成数量。"
    }
  ],
  "41": [
    {
      "code": "    private readonly Button btnAdd = Button(\"添加任务\", true),",
      "comment": "创建添加按钮，使用强调样式。"
    },
    {
      "code": "        btnComplete = Button(\"标记完成\", true),",
      "comment": "创建完成按钮，同样使用强调样式。"
    },
    {
      "code": "        btnDelete = Button(\"删除任务\");",
      "comment": "创建删除按钮，使用普通样式。"
    }
  ],
  "42": [
    {
      "code": "    private readonly Button btnFocus = Button(\"开始专注\", true),",
      "comment": "创建开始或暂停专注按钮。"
    },
    {
      "code": "        btnFocusReset = Button(\"重置\");",
      "comment": "创建重置本轮按钮。"
    }
  ],
  "49": [
    {
      "code": "        SuspendLayout();",
      "comment": "先暂停布局计算。"
    },
    {
      "code": "        savePath = dataPath;",
      "comment": "保存传入的数据文件路径。"
    }
  ],
  "50": [
    {
      "code": "        Text = \"StudyFlow - 学习任务与专注计时器\";",
      "comment": "设置系统窗体标题文字。"
    },
    {
      "code": "        StartPosition = FormStartPosition.CenterScreen;",
      "comment": "启动时在屏幕居中。"
    }
  ],
  "51": [
    {
      "code": "        Size = new(1230, 830);",
      "comment": "设置初始窗口尺寸。"
    },
    {
      "code": "        MinimumSize = new(1080, 760);",
      "comment": "限制窗口最小尺寸。"
    },
    {
      "code": "        BackColor = PageColor;",
      "comment": "设置页面背景色。"
    },
    {
      "code": "        Font = new(\"Microsoft YaHei UI\", 9F);",
      "comment": "设置默认中文字体。"
    }
  ],
  "52": [
    {
      "code": "        cmbCategory.Items.AddRange(new object[] { \"课程学习\", \"编程练习\", \"阅读复习\", \"其他任务\" });",
      "comment": "添加四种任务分类。"
    },
    {
      "code": "        cmbCategory.SelectedIndex = 0;",
      "comment": "默认选第一项课程学习。"
    }
  ],
  "53": [
    {
      "code": "        cmbFocusMinutes.Items.AddRange(new object[] { 15, 25, 45, 60 });",
      "comment": "添加四个整数分钟选项。"
    },
    {
      "code": "        cmbFocusMinutes.SelectedItem = 25;",
      "comment": "默认选值为 25 的对象。"
    }
  ],
  "54": [
    {
      "code": "        BuildInterface();",
      "comment": "创建完整界面。"
    },
    {
      "code": "        LoadTasks();",
      "comment": "读取已有任务。"
    },
    {
      "code": "        RefreshTaskList();",
      "comment": "生成列表并同步任务统计。"
    },
    {
      "code": "        UpdateClock();",
      "comment": "立即显示当前日期时间。"
    },
    {
      "code": "        UpdateFocusDisplay();",
      "comment": "立即更新计时文字与控件状态。"
    }
  ],
  "55": [
    {
      "code": "        btnAdd.Click += (_, _) => AddTask();",
      "comment": "订阅添加按钮点击，调用 AddTask()。"
    },
    {
      "code": "        btnComplete.Click += (_, _) => CompleteTask();",
      "comment": "订阅完成按钮点击。"
    },
    {
      "code": "        btnDelete.Click += (_, _) => DeleteTask();",
      "comment": "订阅删除按钮点击。"
    }
  ],
  "56": [
    {
      "code": "        lstTasks.SelectedIndexChanged += (_, _) => ShowSelectedTask();",
      "comment": "选中项改变时显示任务详情。"
    },
    {
      "code": "        chkOnlyPending.CheckedChanged += (_, _) => RefreshTaskList();",
      "comment": "筛选勾选状态改变时刷新列表。"
    }
  ],
  "57": [
    {
      "code": "        btnFocus.Click += (_, _) => ToggleFocus();",
      "comment": "开始或暂停按钮统一调用 ToggleFocus()。"
    },
    {
      "code": "        btnFocusReset.Click += (_, _) => ResetFocus();",
      "comment": "重置按钮调用 ResetFocus()。"
    }
  ],
  "58": [
    {
      "code": "        cmbFocusMinutes.SelectedIndexChanged += (_, _) => ResetFocus();",
      "comment": "时长选项改变时重置本轮。"
    },
    {
      "code": "        uiTimer.Tick += UiTimer_Tick;",
      "comment": "订阅定时更新事件。"
    },
    {
      "code": "        uiTimer.Start();",
      "comment": "启动 UI 定时器，暂停专注时它仍更新时钟。"
    }
  ],
  "59": [
    {
      "code": "        tips.SetToolTip(txtTitle, \"输入任务名称后，点击“添加任务”\");",
      "comment": "为名称输入框设置悬停说明。"
    },
    {
      "code": "        tips.SetToolTip(lstTasks, \"选择任务后可以查看备注、完成或删除任务\");",
      "comment": "为任务列表设置操作提示。"
    }
  ],
  "61": [
    {
      "code": "        AutoScaleDimensions = new(96, 96);",
      "comment": "使用 96 DPI 作为缩放基准。"
    },
    {
      "code": "        AutoScaleMode = AutoScaleMode.Dpi;",
      "comment": "按 DPI 自动缩放。"
    },
    {
      "code": "        ResumeLayout(true);",
      "comment": "恢复并执行布局。"
    }
  ],
  "72": [
    {
      "code": "        var header = new TableLayoutPanel {",
      "comment": "创建顶栏表格布局。"
    },
    {
      "code": "            Dock = DockStyle.Fill,",
      "comment": "填满父容器。"
    },
    {
      "code": "            BackColor = DarkColor,",
      "comment": "采用深蓝背景。"
    },
    {
      "code": "            Padding = new(28, 15, 28, 12),",
      "comment": "设置顶栏内边距。"
    },
    {
      "code": "            ColumnCount = 3, RowCount = 1 };",
      "comment": "顶栏划为三列、一行。"
    }
  ],
  "74": [
    {
      "code": "        header.ColumnStyles.Add(new(SizeType.Absolute, 62));",
      "comment": "左侧图标列固定宽度。"
    },
    {
      "code": "        header.ColumnStyles.Add(new(SizeType.Percent, 100));",
      "comment": "中间标题列占剩余宽度。"
    },
    {
      "code": "        header.ColumnStyles.Add(new(SizeType.Absolute, 220));",
      "comment": "右侧时钟列固定宽度。"
    }
  ],
  "76": [
    {
      "code": "        icon.Paint += (_, e) => {",
      "comment": "在 PictureBox 重绘时执行绘图处理程序。"
    },
    {
      "code": "            using var pen = new Pen(Color.White, 2);",
      "comment": "创建白色画笔，结束时自动释放。"
    },
    {
      "code": "            e.Graphics.DrawRectangle(pen, 7, 3, 32, 34);",
      "comment": "绘制图标外侧矩形。"
    },
    {
      "code": "            e.Graphics.DrawLine(pen, 23, 4, 23, 36);",
      "comment": "绘制中间竖线。"
    },
    {
      "code": "        };",
      "comment": "结束事件处理程序。"
    }
  ],
  "77": [
    {
      "code": "        var title = Stack((Label(\"StudyFlow\", 23, Color.White, true), 42),",
      "comment": "将主标题和副标题按纵向布局组合。"
    },
    {
      "code": "            (Label(\"学习任务管理  /  专注计时  /  完成进度\", 10, Color.LightGray), 0));",
      "comment": "副标题使用浅灰文字并占剩余高度。"
    }
  ],
  "79": [
    {
      "code": "        header.Controls.Add(icon, 0, 0);",
      "comment": "图标放入顶栏第一列。"
    },
    {
      "code": "        header.Controls.Add(title, 1, 0);",
      "comment": "标题组合放入第二列。"
    },
    {
      "code": "        header.Controls.Add(lblHeaderClock, 2, 0);",
      "comment": "时钟放入第三列。"
    },
    {
      "code": "        return header;",
      "comment": "返回顶栏容器。"
    }
  ],
  "89": [
    {
      "code": "            var card = new Panel {",
      "comment": "创建白色内容卡片 Panel。"
    },
    {
      "code": "                Dock = DockStyle.Fill,",
      "comment": "填满网格单元。"
    },
    {
      "code": "                Padding = new(18),",
      "comment": "设置内容与卡片边缘的距离。"
    },
    {
      "code": "                Margin = new(6),",
      "comment": "设置卡片外部间距。"
    },
    {
      "code": "                BackColor = Color.White };",
      "comment": "设置白色背景。"
    }
  ],
  "90": [
    {
      "code": "            card.Controls.Add(contents[i]);",
      "comment": "将功能内容加入卡片。"
    },
    {
      "code": "            cards.Controls.Add(card, i, 0);",
      "comment": "将卡片放入对应列。"
    }
  ],
  "98": [
    {
      "code": "        radios.Controls.AddRange(new Control[] { rbHigh, rbMedium, rbLow });",
      "comment": "三个单选按钮直接共享 radios 父容器。"
    },
    {
      "code": "        priority.Controls.Add(radios);",
      "comment": "再将流式面板放入 GroupBox。"
    }
  ],
  "118": [
    {
      "code": "        var bar = new StatusStrip {",
      "comment": "创建底部状态栏。"
    },
    {
      "code": "            Dock = DockStyle.Fill,",
      "comment": "填满底部布局行。"
    },
    {
      "code": "            SizingGrip = false,",
      "comment": "隐藏尺寸调整抓手。"
    },
    {
      "code": "            BackColor = Color.White,",
      "comment": "使用白色背景。"
    },
    {
      "code": "            Padding = new(24, 0, 24, 0) };",
      "comment": "设置左右内边距。"
    }
  ],
  "119": [
    {
      "code": "        bar.Items.AddRange(new ToolStripItem[] { statusText, statusCount });",
      "comment": "向状态栏 Items 加入两个状态文字项。"
    },
    {
      "code": "        return bar;",
      "comment": "返回状态栏。"
    }
  ],
  "122": [
    {
      "code": "    { Text = text,",
      "comment": "设置标签文字。"
    },
    {
      "code": "        Dock = DockStyle.Fill,",
      "comment": "填满分配的单元区域。"
    },
    {
      "code": "        AutoSize = false,",
      "comment": "由布局决定标签尺寸。"
    },
    {
      "code": "        TextAlign = ContentAlignment.MiddleLeft,",
      "comment": "文字垂直居中、靠左显示。"
    },
    {
      "code": "        ForeColor = color ?? DarkColor,",
      "comment": "未传颜色时回退到深蓝。"
    },
    {
      "code": "        Font = new(\"Microsoft YaHei UI\", size, bold ? FontStyle.Bold : FontStyle.Regular) };",
      "comment": "根据参数设置字体大小和粗体。"
    }
  ],
  "125": [
    {
      "code": "        var button = new Button {",
      "comment": "创建样式统一的按钮。"
    },
    {
      "code": "            Text = text,",
      "comment": "设置按钮文字。"
    },
    {
      "code": "            Dock = DockStyle.Fill,",
      "comment": "填满布局单元。"
    },
    {
      "code": "            FlatStyle = FlatStyle.Flat,",
      "comment": "使用平面样式。"
    },
    {
      "code": "            BackColor = primary ? AccentColor : PageColor,",
      "comment": "强调按钮用青绿，普通按钮用页面背景色。"
    },
    {
      "code": "            ForeColor = primary ? Color.White : DarkColor,",
      "comment": "强调按钮用白字，普通按钮用深蓝字。"
    },
    {
      "code": "            Cursor = Cursors.Hand };",
      "comment": "鼠标悬停使用手形光标。"
    }
  ],
  "126": [
    {
      "code": "        button.FlatAppearance.BorderSize = 0;",
      "comment": "去掉按钮的平面边框。"
    },
    {
      "code": "        return button;",
      "comment": "返回已配置的按钮实例。"
    }
  ],
  "130": [
    {
      "code": "        var table = new TableLayoutPanel {",
      "comment": "创建纵向表格布局。"
    },
    {
      "code": "            Dock = DockStyle.Fill,",
      "comment": "填满父容器。"
    },
    {
      "code": "            Margin = Padding.Empty,",
      "comment": "移除外边距。"
    },
    {
      "code": "            ColumnCount = 1,",
      "comment": "仅有一列。"
    },
    {
      "code": "            RowCount = rows.Length };",
      "comment": "行数等于传入控件的数量。"
    }
  ],
  "134": [
    {
      "code": "            var (control, height) = rows[i];",
      "comment": "从当前元组取出控件和行高。"
    },
    {
      "code": "            control.Dock = DockStyle.Fill;",
      "comment": "控件填满布局单元。"
    },
    {
      "code": "            control.Margin = new(0, 0, 0, 8);",
      "comment": "控件底部留出间距。"
    }
  ],
  "135": [
    {
      "code": "            table.RowStyles.Add(height == 0 ? new(SizeType.Percent, 100) : new(SizeType.Absolute, height));",
      "comment": "高度 0 表示剩余空间百分比行，其余使用固定高度。"
    },
    {
      "code": "            table.Controls.Add(control, 0, i);",
      "comment": "把控件加入对应行。"
    }
  ],
  "142": [
    {
      "code": "        for (int i = 0; i < buttons.Length; i++) {",
      "comment": "遍历传入按钮；for 中的分号保留在循环头内。"
    },
    {
      "code": "            row.ColumnStyles.Add(new(SizeType.Percent, 100F / buttons.Length));",
      "comment": "按按钮数均分列宽。"
    },
    {
      "code": "            buttons[i].Margin = new(i == 0 ? 0 : 6, 0, 0, 0);",
      "comment": "除第一个外，其余按钮增加左侧间距。"
    },
    {
      "code": "            row.Controls.Add(buttons[i], i, 0); }",
      "comment": "将当前按钮加入对应列。"
    }
  ],
  "148": [
    {
      "code": "        if (string.IsNullOrWhiteSpace(txtTitle.Text)) {",
      "comment": "标题为空或纯空白时进入校验失败分支。"
    },
    {
      "code": "            statusText.Text = \"请先输入任务名称。\";",
      "comment": "在状态栏给出输入提示。"
    },
    {
      "code": "            txtTitle.Focus();",
      "comment": "将输入焦点返回标题框。"
    },
    {
      "code": "            return; }",
      "comment": "提前返回，阻止创建空白任务。"
    }
  ],
  "149": [
    {
      "code": "        var task = new StudyTask {",
      "comment": "创建承载当前输入的新任务对象。"
    },
    {
      "code": "            Title = txtTitle.Text.Trim(),",
      "comment": "去掉标题两端空白。"
    },
    {
      "code": "            Note = txtNote.Text.Trim(),",
      "comment": "去掉备注两端空白，备注可以为空。"
    },
    {
      "code": "            Category = cmbCategory.Text,",
      "comment": "读取选中的分类文本。"
    },
    {
      "code": "            DueDate = dtpDueDate.Value.Date,",
      "comment": "读取日期部分，去掉时间。"
    },
    {
      "code": "            Priority = rbHigh.Checked ? \"高\" : rbLow.Checked ? \"低\" : \"中\" };",
      "comment": "先判断高，再判断低，否则保存中。"
    }
  ],
  "150": [
    {
      "code": "        tasks.Add(task);",
      "comment": "把任务加入完整数据集合。"
    },
    {
      "code": "        RefreshTaskList(task);",
      "comment": "刷新界面并尝试选中新任务。"
    },
    {
      "code": "        txtTitle.Clear();",
      "comment": "清空名称输入框。"
    },
    {
      "code": "        txtNote.Clear();",
      "comment": "清空备注输入框。"
    },
    {
      "code": "        txtTitle.Focus();",
      "comment": "聚焦名称框，便于继续输入。"
    },
    {
      "code": "        if (SaveTasks())",
      "comment": "尝试保存，只有成功时才写成功提示。"
    },
    {
      "code": "        statusText.Text = \"任务已添加并保存。\";",
      "comment": "提示任务已添加并保存。"
    }
  ],
  "154": [
    {
      "code": "        if (lstTasks.SelectedItem is not StudyTask task || task.Completed)",
      "comment": "未选中有效任务，或任务已完成时，不再处理。"
    },
    {
      "code": "        return;",
      "comment": "提前返回。"
    }
  ],
  "155": [
    {
      "code": "        task.Completed = true;",
      "comment": "把任务模型标记为完成。"
    },
    {
      "code": "        RefreshTaskList(task);",
      "comment": "刷新列表、进度和选中详情。"
    },
    {
      "code": "        if (SaveTasks())",
      "comment": "尝试保存并检查结果。"
    },
    {
      "code": "        statusText.Text = \"任务已完成，继续保持！\";",
      "comment": "保存成功后显示完成提示。"
    }
  ],
  "159": [
    {
      "code": "        if (lstTasks.SelectedItem is not StudyTask task)",
      "comment": "没有有效选中任务时不删除。"
    },
    {
      "code": "        return;",
      "comment": "提前结束删除流程。"
    }
  ],
  "160": [
    {
      "code": "        tasks.Remove(task);",
      "comment": "从完整集合移除选中的任务对象。"
    },
    {
      "code": "        RefreshTaskList();",
      "comment": "刷新列表与任务统计。"
    },
    {
      "code": "        if (SaveTasks())",
      "comment": "尝试保存修改。"
    },
    {
      "code": "        statusText.Text = \"任务已删除并保存。\";",
      "comment": "仅保存成功时显示删除成功。"
    }
  ],
  "165": [
    {
      "code": "        lstTasks.BeginUpdate();",
      "comment": "暂停列表重绘，减少批量更新闪烁。"
    },
    {
      "code": "        lstTasks.Items.Clear();",
      "comment": "清空显示项，不清空 tasks 数据。"
    }
  ],
  "166": [
    {
      "code": "        foreach (var task in tasks.Where(t => !chkOnlyPending.Checked || !t.Completed))",
      "comment": "遍历满足筛选条件的任务；未筛选时全部可见。"
    },
    {
      "code": "        lstTasks.Items.Add(task);",
      "comment": "将对象加入 ListBox，ToString() 提供显示文字。"
    }
  ],
  "167": [
    {
      "code": "        if (selected != null && lstTasks.Items.Contains(selected))",
      "comment": "目标对象仍在可见列表中时才恢复选择。"
    },
    {
      "code": "        lstTasks.SelectedItem = selected;",
      "comment": "设置当前选中对象。"
    }
  ],
  "168": [
    {
      "code": "        lstTasks.EndUpdate();",
      "comment": "恢复列表重绘。"
    },
    {
      "code": "        ShowSelectedTask();",
      "comment": "更新详情和操作按钮状态。"
    }
  ],
  "169": [
    {
      "code": "        int done = tasks.Count(t => t.Completed),",
      "comment": "用条件 Count 统计已完成数量。"
    },
    {
      "code": "            total = tasks.Count;",
      "comment": "直接读取全部任务数。"
    }
  ],
  "170": [
    {
      "code": "        progressTasks.Value = total == 0 ? 0 :",
      "comment": "空任务集合显示 0，避免除零。"
    },
    {
      "code": "            (int)Math.Round(100.0 * done / total);",
      "comment": "否则计算比例并取整；Math.Round 中点默认取偶数。"
    }
  ],
  "171": [
    {
      "code": "        lblListCount.Text = $\"显示 {lstTasks.Items.Count} 项 · 全部 {total} 项\";",
      "comment": "显示当前可见项数与完整任务总数。"
    },
    {
      "code": "        lblProgressText.Text = $\"{progressTasks.Value}%\";",
      "comment": "读取进度条 Value 生成百分比文字。"
    }
  ],
  "172": [
    {
      "code": "        lblProgressSummary.Text = $\"已完成 {done} 项 / 共 {total} 项\";",
      "comment": "显示已完成数量及总数。"
    },
    {
      "code": "        statusCount.Text = $\"待完成 {total - done} 项\";",
      "comment": "待完成数量等于总数减已完成数。"
    }
  ],
  "176": [
    {
      "code": "        var task = lstTasks.SelectedItem as StudyTask;",
      "comment": "将当前选中项安全转换为 StudyTask。"
    },
    {
      "code": "        btnComplete.Enabled = task != null && !task.Completed;",
      "comment": "只有选中未完成任务时才能标记完成。"
    },
    {
      "code": "        btnDelete.Enabled = task != null;",
      "comment": "有选中任务时才启用删除。"
    }
  ],
  "177": [
    {
      "code": "        lblSelected.Text = task == null ? \"选择一个任务查看详情\" :",
      "comment": "没有选择任务时显示提示，否则准备显示详情。"
    },
    {
      "code": "            $\"{task.Title}\\n{task.Category} · {task.Priority}优先级 · 截止 {task.DueDate:yyyy-MM-dd}\\n{(task.Completed ? \"已完成\" : \"未完成\")}\\n{task.Note}\";",
      "comment": "以多行字符串显示任务属性和备注。"
    }
  ],
  "178": [
    {
      "code": "        tips.SetToolTip(lblSelected, task?.Note ?? \"\");",
      "comment": "把当前任务备注设为悬停提示，未选中时使用空字符串。"
    }
  ],
  "183": [
    {
      "code": "        if (focusRunning) {",
      "comment": "若专注正在运行，进入暂停分支。"
    },
    {
      "code": "            focusWatch.Stop();",
      "comment": "停止测量，但保留已过时间。"
    },
    {
      "code": "            UiTimer_Tick(null, EventArgs.Empty);",
      "comment": "主动结算暂停前已经过的整秒。"
    },
    {
      "code": "            focusRunning = false; }",
      "comment": "标记为暂停；不会停止 uiTimer。"
    }
  ],
  "184": [
    {
      "code": "        else {",
      "comment": "当前没有运行时，准备开始或继续。"
    },
    {
      "code": "            if (remainingSeconds == 0) ResetFocus();",
      "comment": "如果上一轮已结束，先重置本轮。"
    },
    {
      "code": "            focusRunning = true;",
      "comment": "标记专注开始运行。"
    },
    {
      "code": "            focusWatch.Start(); }",
      "comment": "开始或继续 Stopwatch 测量。"
    }
  ],
  "185": [
    {
      "code": "        UpdateFocusDisplay();",
      "comment": "按最新计时状态同步显示。"
    }
  ],
  "189": [
    {
      "code": "        if (focusRunning) {",
      "comment": "如果正在运行，重置前先结算时间。"
    },
    {
      "code": "            focusWatch.Stop();",
      "comment": "先停止测量。"
    },
    {
      "code": "            UiTimer_Tick(null, EventArgs.Empty); }",
      "comment": "将已过整秒计入会话累计。"
    }
  ],
  "190": [
    {
      "code": "        focusRunning = false;",
      "comment": "标记本轮未运行。"
    },
    {
      "code": "        focusWatch.Reset();",
      "comment": "停止并清零本轮测量。"
    },
    {
      "code": "        countedSeconds = 0;",
      "comment": "清空本轮已入账整秒数。"
    },
    {
      "code": "        remainingSeconds = (int)(cmbFocusMinutes.SelectedItem ?? 25) * 60;",
      "comment": "按所选分钟数恢复倒计时；空值时使用 25 分钟。"
    },
    {
      "code": "        UpdateFocusDisplay();",
      "comment": "更新界面；focusedSeconds 会话累计不被清零。"
    }
  ],
  "194": [
    {
      "code": "        UpdateClock();",
      "comment": "始终先更新顶栏时钟。"
    },
    {
      "code": "        if (!focusRunning) return;",
      "comment": "未进行专注时跳过后续计时。"
    }
  ],
  "195": [
    {
      "code": "        int elapsed = Math.Min(remainingSeconds,",
      "comment": "计算本次新经过的整秒，并限制在剩余时间内。"
    },
    {
      "code": "            Math.Max(0, (int)focusWatch.Elapsed.TotalSeconds - countedSeconds));",
      "comment": "Stopwatch 累计整秒减已入账值；负值按零处理。"
    }
  ],
  "196": [
    {
      "code": "        remainingSeconds -= elapsed;",
      "comment": "减少本轮剩余秒数。"
    },
    {
      "code": "        focusedSeconds += elapsed;",
      "comment": "增加本次打开程序的累计专注秒数。"
    },
    {
      "code": "        countedSeconds += elapsed;",
      "comment": "记录这些整秒已被结算，防止重复计入。"
    }
  ],
  "197": [
    {
      "code": "        if (remainingSeconds == 0)",
      "comment": "检查本轮是否已经倒计时归零。"
    }
  ],
  "199": [
    {
      "code": "            focusRunning = false;",
      "comment": "结束本轮运行状态。"
    },
    {
      "code": "            focusWatch.Stop();",
      "comment": "停止 Stopwatch 测量。"
    },
    {
      "code": "            statusText.Text = \"本轮专注已完成，休息一下吧！\";",
      "comment": "状态栏提示本轮专注完成。"
    }
  ],
  "200": [
    {
      "code": "            UpdateFocusDisplay();",
      "comment": "先同步结束后的界面显示。"
    },
    {
      "code": "            if (chkNotify.Checked)",
      "comment": "只有勾选提醒时才弹窗。"
    },
    {
      "code": "            MessageBox.Show(this, \"本轮专注已完成，休息一下吧！\", \"专注完成\", MessageBoxButtons.OK, MessageBoxIcon.Information);",
      "comment": "显示本轮完成的信息对话框。"
    }
  ],
  "204": [
    {
      "code": "    private void UpdateClock() => lblHeaderClock.Text =",
      "comment": "UpdateClock() 只负责更新时钟标签文字。"
    },
    {
      "code": "        DateTime.Now.ToString(\"yyyy-MM-dd dddd\\nHH:mm:ss\");",
      "comment": "按日期、星期与时分秒两行格式显示本地时间。"
    }
  ],
  "207": [
    {
      "code": "        lblFocusTime.Text = $\"{remainingSeconds / 60:00}:{remainingSeconds % 60:00}\";",
      "comment": "把剩余秒数格式化为两位分钟、两位秒数。"
    },
    {
      "code": "        btnFocus.Text = focusRunning ? \"暂停专注\" :",
      "comment": "运行时显示暂停。"
    },
    {
      "code": "            remainingSeconds == 0 ? \"再来一轮\" :",
      "comment": "归零时显示再来一轮。"
    },
    {
      "code": "            focusWatch.ElapsedTicks > 0 ? \"继续专注\" : \"开始专注\";",
      "comment": "已有经过时间时显示继续，否则显示开始。"
    }
  ],
  "208": [
    {
      "code": "        lblFocusHint.Text = focusRunning ? \"专注进行中，保持节奏\" :",
      "comment": "运行时显示进行中。"
    },
    {
      "code": "            remainingSeconds == 0 ? \"本轮已完成，记得休息\" :",
      "comment": "归零时显示本轮完成。"
    },
    {
      "code": "            focusWatch.ElapsedTicks > 0 ? \"已暂停，准备好后继续\" : \"准备好后，开始一次专注\";",
      "comment": "已有经过时间为暂停状态，否则为尚未开始。"
    }
  ],
  "209": [
    {
      "code": "        cmbFocusMinutes.Enabled = !focusRunning && focusWatch.ElapsedTicks == 0;",
      "comment": "只有未运行且本轮未开始时允许修改分钟数。"
    }
  ],
  "210": [
    {
      "code": "        lblFocusTotal.Text = $\"本次累计：{focusedSeconds / 60} 分 {focusedSeconds % 60:00} 秒\";",
      "comment": "显示会话累计时间；不是持久化的每日统计。"
    }
  ],
  "218": [
    {
      "code": "            var loaded = JsonSerializer.Deserialize<List<StudyTask>>(File.ReadAllText(savePath))",
      "comment": "读取正式文件并反序列化为任务列表。"
    },
    {
      "code": "            ?? throw new JsonException(\"任务数据为空。\");",
      "comment": "反序列化结果为空时抛出明确的数据异常。"
    }
  ],
  "219": [
    {
      "code": "            if (loaded.Any(t => t == null || string.IsNullOrWhiteSpace(t.Title)))",
      "comment": "检查是否含空对象或空白任务标题。"
    },
    {
      "code": "            throw new JsonException(\"任务数据不完整。\");",
      "comment": "发现无效条目时拒绝加载。"
    }
  ],
  "220": [
    {
      "code": "            tasks.AddRange(loaded);",
      "comment": "将校验通过的任务加入完整集合。"
    },
    {
      "code": "            statusText.Text = \"已加载本地任务。\";",
      "comment": "提示本地任务加载成功。"
    }
  ],
  "222": [
    {
      "code": "        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException or JsonException)",
      "comment": "仅捕获 IO、权限或 JSON 相关异常。"
    }
  ],
  "223": [
    {
      "code": "        { canSave = false;",
      "comment": "加载失败后禁止本次覆盖原任务文件。"
    },
    {
      "code": "            statusText.Text = \"任务加载失败，本次更改暂不保存，以免覆盖原文件。\";",
      "comment": "状态栏说明本次更改暂不保存。"
    },
    {
      "code": "            tips.SetToolTip(this, ex.Message); }",
      "comment": "将异常详情放入窗体悬停提示。"
    }
  ],
  "228": [
    {
      "code": "        if (!canSave) {",
      "comment": "原文件未能正确加载时进入保护分支。"
    },
    {
      "code": "            statusText.Text = \"原任务文件读取失败，本次更改暂未保存。\";",
      "comment": "说明本次更改尚未保存。"
    },
    {
      "code": "            return false; }",
      "comment": "拒绝保存，保护原文件。"
    }
  ],
  "231": [
    {
      "code": "            Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);",
      "comment": "确保目标目录存在；! 只抑制可空分析警告。"
    }
  ],
  "232": [
    {
      "code": "            File.WriteAllText(savePath + \".tmp\",",
      "comment": "先把序列化结果写入 .tmp 临时文件。"
    },
    {
      "code": "                JsonSerializer.Serialize(tasks, new JsonSerializerOptions { WriteIndented = true }));",
      "comment": "序列化完整任务集合，WriteIndented 保持 JSON 易读。"
    }
  ],
  "233": [
    {
      "code": "            File.Move(savePath + \".tmp\", savePath, true);",
      "comment": "用已写好的临时文件替换正式文件。"
    },
    {
      "code": "            dirty = false;",
      "comment": "只有替换成功后才清除未保存标记。"
    },
    {
      "code": "            return true;",
      "comment": "向调用方返回保存成功。"
    }
  ],
  "235": [
    {
      "code": "        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException) {",
      "comment": "只处理 IO 和访问权限异常。"
    },
    {
      "code": "            statusText.Text = \"保存失败：\" + ex.Message;",
      "comment": "显示保存失败与异常消息。"
    },
    {
      "code": "            return false; }",
      "comment": "保留 dirty 状态并报告失败。"
    }
  ],
  "239": [
    {
      "code": "        if (dirty && !SaveTasks())",
      "comment": "存在未保存更改且重试保存仍失败时，询问是否退出。"
    },
    {
      "code": "        e.Cancel =",
      "comment": "根据用户选择决定是否取消关闭。"
    },
    {
      "code": "            MessageBox.Show(this, \"任务尚未保存，仍要退出吗？\", \"保存提醒\", MessageBoxButtons.YesNo, MessageBoxIcon.Warning) != DialogResult.Yes;",
      "comment": "弹出是/否确认框；非“是”则保留窗口。"
    }
  ],
  "242": [
    {
      "code": "    protected override void Dispose(bool disposing) {",
      "comment": "重写资源释放方法。"
    },
    {
      "code": "        if (disposing) {",
      "comment": "仅在释放托管资源时处理这些组件。"
    },
    {
      "code": "            uiTimer.Dispose();",
      "comment": "释放 WinForms Timer。"
    },
    {
      "code": "            tips.Dispose();",
      "comment": "释放 ToolTip 组件。"
    },
    {
      "code": "            focusWatch.Stop(); }",
      "comment": "停止 Stopwatch。"
    },
    {
      "code": "        base.Dispose(disposing); }",
      "comment": "继续执行基类资源释放。"
    }
  ],
  "253": [
    {
      "code": "    public override string ToString() =>",
      "comment": "重写 ToString()，为 ListBox 提供可读摘要。"
    },
    {
      "code": "    $\"{(Completed ? \"✓\" : \"○\")} [{Priority}] {Title}  ·  {DueDate:MM-dd}\";",
      "comment": "输出完成符号、优先级、名称与月日，不修改模型。"
    }
  ]
};
