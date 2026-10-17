using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace StudyFlowWinForms;

internal static class Program {
    [STAThread]
    private static void Main() { ApplicationConfiguration.Initialize(); Application.Run(new StudyFlowForm()); }
}

// 答辩简化版：14 种课程控件，任务只在本次运行期间保留。
public sealed class StudyFlowForm : Form {
    private static readonly Color PageColor = Color.FromArgb(246, 248, 252), DarkColor = Color.FromArgb(29, 43, 68);
    private static readonly Color MutedColor = Color.FromArgb(113, 125, 145), AccentColor = Color.FromArgb(36, 153, 142);
    private readonly List<StudyTask> tasks = new();
    private readonly TextBox txtTitle = new() { PlaceholderText = "例如：完成 C# 控件练习", MaxLength = 80 };
    private readonly TextBox txtNote = new() { Multiline = true, ScrollBars = ScrollBars.Vertical, PlaceholderText = "记录任务步骤或学习要点…", MaxLength = 2000 };
    private readonly ComboBox cmbCategory = new() { DropDownStyle = ComboBoxStyle.DropDownList }, cmbFocusMinutes = new() { DropDownStyle = ComboBoxStyle.DropDownList };
    private readonly DateTimePicker dtpDueDate = new() { Format = DateTimePickerFormat.Short };
    private readonly RadioButton rbHigh = new() { Text = "高", AutoSize = true }, rbMedium = new() { Text = "中", AutoSize = true, Checked = true }, rbLow = new() { Text = "低", AutoSize = true };
    private readonly ListBox lstTasks = new() { BorderStyle = BorderStyle.None, IntegralHeight = false, HorizontalScrollbar = true, ItemHeight = 28 };
    private readonly CheckBox chkOnlyPending = new() { Text = "仅显示未完成任务" }, chkNotify = new() { Text = "专注结束时提醒我", Checked = true };
    private readonly ProgressBar progressTasks = new();
    private readonly System.Windows.Forms.Timer uiTimer = new() { Interval = 1000 };
    private readonly ToolTip tips = new();
    private readonly Label lblListCount = Label("", 9, MutedColor);
    private readonly Label lblSelected = Label("选择一个任务查看详情", 9, MutedColor), lblFocusTime = Label("25:00", 38, DarkColor, true);
    private readonly Label lblFocusHint = Label("准备好后，开始一次专注", 9, MutedColor), lblProgressText = Label("0%", 20, AccentColor, true);
    private readonly Label lblProgressSummary = Label("", 9, MutedColor), lblFocusTip = Label("一次只做一件事，保持专注", 9, MutedColor);
    private readonly ToolStripStatusLabel statusText = new("") { Spring = true, TextAlign = ContentAlignment.MiddleLeft }, statusCount = new();
    private readonly Button btnAdd = Button("添加任务", true), btnComplete = Button("标记完成", true), btnDelete = Button("删除任务");
    private readonly Button btnFocus = Button("开始专注", true), btnFocusReset = Button("重置");
    private int remainingSeconds = 25 * 60;

    public StudyFlowForm() {
        SuspendLayout();
        Text = "StudyFlow - 学习任务与专注计时器"; StartPosition = FormStartPosition.CenterScreen;
        Size = new(1230, 830); MinimumSize = new(1080, 760); BackColor = PageColor; Font = new("Microsoft YaHei UI", 9F);
        cmbCategory.Items.AddRange(new object[] { "课程学习", "编程练习", "阅读复习", "其他任务" }); cmbCategory.SelectedIndex = 0;
        cmbFocusMinutes.Items.AddRange(new object[] { 15, 25, 45, 60 }); cmbFocusMinutes.SelectedItem = 25;
        BuildInterface(); RefreshTaskList(); UpdateFocusDisplay();
        // 控件事件：点击按钮或更改选项时，调用对应方法。
        btnAdd.Click += (_, _) => AddTask(); btnComplete.Click += (_, _) => CompleteTask(); btnDelete.Click += (_, _) => DeleteTask();
        lstTasks.SelectedIndexChanged += (_, _) => ShowSelectedTask(); chkOnlyPending.CheckedChanged += (_, _) => RefreshTaskList();
        btnFocus.Click += (_, _) => ToggleFocus(); btnFocusReset.Click += (_, _) => ResetFocus();
        cmbFocusMinutes.SelectedIndexChanged += (_, _) => ResetFocus(); uiTimer.Tick += UiTimer_Tick;
        tips.SetToolTip(txtTitle, "输入任务名称后，点击添加任务"); tips.SetToolTip(lstTasks, "选择任务后，可以查看详情、完成或删除任务");
        tips.SetToolTip(btnFocusReset, "恢复到所选分钟数，重新开始计时");
        AutoScaleDimensions = new(96, 96); AutoScaleMode = AutoScaleMode.Dpi; ResumeLayout(true);
    }

    private void BuildInterface() {
        var outer = Stack((BuildHeader(), 105), (BuildCards(), 0), (BuildStatusBar(), 32));
        foreach (Control control in outer.Controls) control.Margin = Padding.Empty;
        Controls.Add(outer);
    }
    private Control BuildHeader() {
        var header = new TableLayoutPanel { Dock = DockStyle.Fill, BackColor = DarkColor, Padding = new(28, 15, 28, 12), ColumnCount = 2, RowCount = 1 };
        header.RowStyles.Add(new(SizeType.Percent, 100));
        header.ColumnStyles.Add(new(SizeType.Absolute, 62)); header.ColumnStyles.Add(new(SizeType.Percent, 100));
        var icon = new PictureBox { Dock = DockStyle.Fill, Margin = new(0, 12, 12, 12) };
        icon.Paint += (_, e) => { using var pen = new Pen(Color.White, 2); e.Graphics.DrawRectangle(pen, 7, 3, 32, 34); e.Graphics.DrawLine(pen, 23, 4, 23, 36); };
        var title = Stack((Label("StudyFlow", 23, Color.White, true), 42), (Label("学习任务管理  /  专注计时  /  完成进度", 10, Color.LightGray), 0));
        header.Controls.Add(icon, 0, 0); header.Controls.Add(title, 1, 0); return header;
    }
    private Control BuildCards() {
        var cards = new TableLayoutPanel { Dock = DockStyle.Fill, Padding = new(18), ColumnCount = 3, RowCount = 1 };
        foreach (float width in new[] { 31F, 40F, 29F }) cards.ColumnStyles.Add(new(SizeType.Percent, width));
        cards.RowStyles.Add(new(SizeType.Percent, 100));
        Control[] contents = { BuildTaskEditor(), BuildTaskList(), BuildFocusPanel() };
        for (int i = 0; i < contents.Length; i++)
        {
            var card = new Panel { Dock = DockStyle.Fill, Padding = new(18), Margin = new(6), BackColor = Color.White };
            card.Controls.Add(contents[i]); cards.Controls.Add(card, i, 0);
        }
        return cards;
    }
    private Control BuildTaskEditor() {
        var priority = new GroupBox { Text = "优先级", Padding = new(10, 6, 10, 6) };
        var radios = new FlowLayoutPanel { Dock = DockStyle.Fill, WrapContents = false };
        radios.Controls.AddRange(new Control[] { rbHigh, rbMedium, rbLow }); priority.Controls.Add(radios);
        return Stack((Label("新建任务", 15, DarkColor, true), 36), (Label("任务名称"), 24), (txtTitle, 36),
            (Label("任务分类"), 24), (cmbCategory, 36), (Label("截止日期"), 24), (dtpDueDate, 36), (priority, 60),
            (Label("任务备注"), 24), (txtNote, 0), (btnAdd, 44));
    }
    private Control BuildTaskList() {
        lblSelected.AutoEllipsis = true;
        return Stack((Label("任务清单", 15, DarkColor, true), 40), (lblListCount, 28), (chkOnlyPending, 36),
            (lstTasks, 0), (lblSelected, 120), (ButtonRow(btnComplete, btnDelete), 48));
    }
    private Control BuildFocusPanel() {
        lblFocusTime.TextAlign = ContentAlignment.MiddleCenter;
        return Stack((Label("专注计时", 15, DarkColor, true), 36), (Label("本轮专注时长（分钟）"), 24), (cmbFocusMinutes, 34),
            (lblFocusTime, 76), (lblFocusHint, 28), (ButtonRow(btnFocus, btnFocusReset), 40), (chkNotify, 28), (lblFocusTip, 28),
            (Label("任务完成进度", 12, DarkColor, true), 30), (lblProgressText, 38), (progressTasks, 24), (lblProgressSummary, 0));
    }
    private Control BuildStatusBar() {
        var bar = new StatusStrip { Dock = DockStyle.Fill, SizingGrip = false, BackColor = Color.White, Padding = new(24, 0, 24, 0) };
        bar.Items.AddRange(new ToolStripItem[] { statusText, statusCount }); return bar;
    }
    private static Label Label(string text, float size = 9, Color? color = null, bool bold = false) => new()
    { Text = text, Dock = DockStyle.Fill, AutoSize = false, TextAlign = ContentAlignment.MiddleLeft, ForeColor = color ?? DarkColor, Font = new("Microsoft YaHei UI", size, bold ? FontStyle.Bold : FontStyle.Regular) };
    private static Button Button(string text, bool primary = false) {
        var button = new Button { Text = text, Dock = DockStyle.Fill, FlatStyle = FlatStyle.Flat, BackColor = primary ? AccentColor : PageColor, ForeColor = primary ? Color.White : DarkColor, Cursor = Cursors.Hand };
        button.FlatAppearance.BorderSize = 0; return button;
    }
    private static TableLayoutPanel Stack(params (Control control, int height)[] rows) {
        var table = new TableLayoutPanel { Dock = DockStyle.Fill, Margin = Padding.Empty, ColumnCount = 1, RowCount = rows.Length };
        table.ColumnStyles.Add(new(SizeType.Percent, 100));
        for (int i = 0; i < rows.Length; i++)
        {
            var (control, height) = rows[i]; control.Dock = DockStyle.Fill; control.Margin = new(0, 0, 0, 8);
            table.RowStyles.Add(height == 0 ? new(SizeType.Percent, 100) : new(SizeType.Absolute, height)); table.Controls.Add(control, 0, i);
        }
        return table;
    }
    private static Control ButtonRow(params Button[] buttons) {
        var row = new TableLayoutPanel { Dock = DockStyle.Fill, Margin = Padding.Empty, ColumnCount = buttons.Length };
        for (int i = 0; i < buttons.Length; i++) { row.ColumnStyles.Add(new(SizeType.Percent, 100F / buttons.Length)); buttons[i].Margin = new(i == 0 ? 0 : 6, 0, 0, 0); row.Controls.Add(buttons[i], i, 0); }
        return row;
    }

    // 读取输入，添加任务。
    private void AddTask() {
        if (string.IsNullOrWhiteSpace(txtTitle.Text))
        { statusText.Text = "请先输入任务名称。"; txtTitle.Focus(); return; }
        var task = new StudyTask();
        task.Title = txtTitle.Text.Trim(); task.Note = txtNote.Text.Trim();
        task.Category = cmbCategory.Text; task.DueDate = dtpDueDate.Value.Date;
        if (rbHigh.Checked) task.Priority = "高";
        else if (rbLow.Checked) task.Priority = "低";
        else task.Priority = "中";
        tasks.Add(task); RefreshTaskList(); lstTasks.SelectedItem = task;
        txtTitle.Clear(); txtNote.Clear(); txtTitle.Focus(); statusText.Text = "任务已添加。";
    }
    private void CompleteTask() {
        var task = lstTasks.SelectedItem as StudyTask;
        if (task == null) return;
        task.Completed = true; RefreshTaskList(); statusText.Text = "任务已完成。";
    }
    private void DeleteTask() {
        var task = lstTasks.SelectedItem as StudyTask;
        if (task == null) return;
        tasks.Remove(task); RefreshTaskList(); statusText.Text = "任务已删除。";
    }
    // 刷新任务列表、完成比例和状态栏。
    private void RefreshTaskList() {
        var selected = lstTasks.SelectedItem as StudyTask;
        lstTasks.Items.Clear(); int done = 0;
        foreach (var task in tasks)
        {
            if (task.Completed) done++;
            if (!chkOnlyPending.Checked || !task.Completed) lstTasks.Items.Add(task);
        }
        if (selected != null && lstTasks.Items.Contains(selected)) lstTasks.SelectedItem = selected;
        int total = tasks.Count; progressTasks.Value = 0;
        if (total > 0) progressTasks.Value = done * 100 / total;
        lblListCount.Text = $"显示 {lstTasks.Items.Count} 项 · 全部 {total} 项"; lblProgressText.Text = $"{progressTasks.Value}%";
        lblProgressSummary.Text = $"已完成 {done} 项 / 共 {total} 项"; statusCount.Text = $"待完成 {total - done} 项";
        ShowSelectedTask();
    }
    private void ShowSelectedTask() {
        var task = lstTasks.SelectedItem as StudyTask;
        btnDelete.Enabled = task != null; btnComplete.Enabled = task != null && !task.Completed;
        if (task == null) { lblSelected.Text = "选择一个任务查看详情"; return; }
        lblSelected.Text = $"{task.Title}\n{task.Category} · {task.Priority}优先级\n截止：{task.DueDate:yyyy-MM-dd}\n{task.Note}";
    }
    // 开始、暂停和重置倒计时。
    private void ToggleFocus() {
        if (uiTimer.Enabled) uiTimer.Stop();
        else { if (remainingSeconds == 0) ResetFocus(); uiTimer.Start(); }
        UpdateFocusDisplay();
    }
    private void ResetFocus() {
        uiTimer.Stop(); remainingSeconds = Convert.ToInt32(cmbFocusMinutes.SelectedItem) * 60; UpdateFocusDisplay();
    }
    // 每约一秒减一，归零后停止。
    private void UiTimer_Tick(object? sender, EventArgs e) {
        if (!uiTimer.Enabled || remainingSeconds <= 0) return;
        remainingSeconds--; if (remainingSeconds == 0) uiTimer.Stop();
        UpdateFocusDisplay();
        if (remainingSeconds == 0)
        {
            statusText.Text = "本轮专注已完成！";
            if (chkNotify.Checked) MessageBox.Show("专注结束，休息一下吧！", "提示");
        }
    }
    private void UpdateFocusDisplay() {
        lblFocusTime.Text = $"{remainingSeconds / 60:00}:{remainingSeconds % 60:00}"; cmbFocusMinutes.Enabled = !uiTimer.Enabled;
        if (uiTimer.Enabled) { btnFocus.Text = "暂停专注"; lblFocusHint.Text = "专注进行中"; }
        else { btnFocus.Text = "开始 / 继续"; lblFocusHint.Text = "点击按钮开始或继续专注"; }
        if (remainingSeconds == 0) lblFocusHint.Text = "本轮专注已完成";
    }
    protected override void Dispose(bool disposing)
    { if (disposing) { uiTimer.Dispose(); tips.Dispose(); } base.Dispose(disposing); }
}

public sealed class StudyTask {
    public string Title { get; set; } = "";
    public string Note { get; set; } = "";
    public string Category { get; set; } = "课程学习";
    public string Priority { get; set; } = "中";
    public DateTime DueDate { get; set; } = DateTime.Today;
    public bool Completed { get; set; }
    public override string ToString() => $"{(Completed ? "✓" : "○")} [{Priority}] {Title}  ·  {DueDate:MM-dd}";
}
