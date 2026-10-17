using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Windows.Forms;

namespace StudyFlowWinForms;

internal static class Program
{
    [STAThread]
    private static void Main() { ApplicationConfiguration.Initialize(); Application.Run(new StudyFlowForm()); }
}

// 所有控件均用代码创建；短声明、初始化与简单方法合并书写。
public sealed class StudyFlowForm : Form
{
    private static readonly Color PageColor = Color.FromArgb(246, 248, 252), DarkColor = Color.FromArgb(29, 43, 68);
    private static readonly Color MutedColor = Color.FromArgb(113, 125, 145), AccentColor = Color.FromArgb(36, 153, 142);
    private readonly List<StudyTask> tasks = new();
    private readonly string savePath;
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
    private readonly Stopwatch focusWatch = new();
    private readonly Label lblHeaderClock = Label("", 10, Color.White), lblListCount = Label("", 9, MutedColor);
    private readonly Label lblSelected = Label("选择一个任务查看详情", 9, MutedColor), lblFocusTime = Label("25:00", 38, DarkColor, true);
    private readonly Label lblFocusHint = Label("准备好后，开始一次专注", 9, MutedColor), lblProgressText = Label("0%", 20, AccentColor, true);
    private readonly Label lblProgressSummary = Label("", 9, MutedColor), lblFocusTotal = Label("今日会话累计：0 分 00 秒", 9, MutedColor);
    private readonly ToolStripStatusLabel statusText = new("准备就绪") { Spring = true, TextAlign = ContentAlignment.MiddleLeft }, statusCount = new();
    private readonly Button btnAdd = Button("添加任务", true), btnComplete = Button("标记完成", true), btnDelete = Button("删除任务");
    private readonly Button btnFocus = Button("开始专注", true), btnFocusReset = Button("重置");
    private int remainingSeconds = 25 * 60, focusedSeconds, countedSeconds;
    private bool focusRunning, dirty, canSave = true;

    public StudyFlowForm() : this(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "StudyFlowWinForms", "tasks.json")) { }
    internal StudyFlowForm(string dataPath)
    {
        SuspendLayout(); savePath = dataPath;
        Text = "StudyFlow - 学习任务与专注计时器"; StartPosition = FormStartPosition.CenterScreen;
        Size = new(1230, 830); MinimumSize = new(1080, 760); BackColor = PageColor; Font = new("Microsoft YaHei UI", 9F);
        cmbCategory.Items.AddRange(new object[] { "课程学习", "编程练习", "阅读复习", "其他任务" }); cmbCategory.SelectedIndex = 0;
        cmbFocusMinutes.Items.AddRange(new object[] { 15, 25, 45, 60 }); cmbFocusMinutes.SelectedItem = 25;
        BuildInterface(); LoadTasks(); RefreshTaskList(); UpdateClock(); UpdateFocusDisplay();
        btnAdd.Click += (_, _) => AddTask(); btnComplete.Click += (_, _) => CompleteTask(); btnDelete.Click += (_, _) => DeleteTask();
        lstTasks.SelectedIndexChanged += (_, _) => ShowSelectedTask(); chkOnlyPending.CheckedChanged += (_, _) => RefreshTaskList();
        btnFocus.Click += (_, _) => ToggleFocus(); btnFocusReset.Click += (_, _) => ResetFocus();
        cmbFocusMinutes.SelectedIndexChanged += (_, _) => ResetFocus(); uiTimer.Tick += UiTimer_Tick; uiTimer.Start();
        tips.SetToolTip(txtTitle, "输入任务名称后，点击“添加任务”"); tips.SetToolTip(lstTasks, "选择任务后可以查看备注、完成或删除任务");
        tips.SetToolTip(btnFocusReset, "重置本轮倒计时，保留本次打开程序期间的累计专注时间");
        AutoScaleDimensions = new(96, 96); AutoScaleMode = AutoScaleMode.Dpi; ResumeLayout(true);
    }

    private void BuildInterface()
    {
        var outer = Stack((BuildHeader(), 105), (BuildCards(), 0), (BuildStatusBar(), 32));
        foreach (Control control in outer.Controls) control.Margin = Padding.Empty;
        Controls.Add(outer);
    }
    private Control BuildHeader()
    {
        var header = new TableLayoutPanel { Dock = DockStyle.Fill, BackColor = DarkColor, Padding = new(28, 15, 28, 12), ColumnCount = 3, RowCount = 1 };
        header.RowStyles.Add(new(SizeType.Percent, 100));
        header.ColumnStyles.Add(new(SizeType.Absolute, 62)); header.ColumnStyles.Add(new(SizeType.Percent, 100)); header.ColumnStyles.Add(new(SizeType.Absolute, 220));
        var icon = new PictureBox { Dock = DockStyle.Fill, Margin = new(0, 12, 12, 12) };
        icon.Paint += (_, e) => { using var pen = new Pen(Color.White, 2); e.Graphics.DrawRectangle(pen, 7, 3, 32, 34); e.Graphics.DrawLine(pen, 23, 4, 23, 36); };
        var title = Stack((Label("StudyFlow", 23, Color.White, true), 42), (Label("学习任务管理  /  专注计时  /  完成进度", 10, Color.LightGray), 0));
        lblHeaderClock.TextAlign = ContentAlignment.MiddleRight;
        header.Controls.Add(icon, 0, 0); header.Controls.Add(title, 1, 0); header.Controls.Add(lblHeaderClock, 2, 0); return header;
    }
    private Control BuildCards()
    {
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
    private Control BuildTaskEditor()
    {
        var priority = new GroupBox { Text = "优先级", Padding = new(10, 6, 10, 6) };
        var radios = new FlowLayoutPanel { Dock = DockStyle.Fill, WrapContents = false };
        radios.Controls.AddRange(new Control[] { rbHigh, rbMedium, rbLow }); priority.Controls.Add(radios);
        return Stack((Label("新建任务", 15, DarkColor, true), 36), (Label("任务名称"), 24), (txtTitle, 36),
            (Label("任务分类"), 24), (cmbCategory, 36), (Label("截止日期"), 24), (dtpDueDate, 36), (priority, 60),
            (Label("任务备注"), 24), (txtNote, 0), (btnAdd, 44));
    }
    private Control BuildTaskList()
    {
        lblSelected.AutoEllipsis = true;
        return Stack((Label("任务清单", 15, DarkColor, true), 40), (lblListCount, 28), (chkOnlyPending, 36),
            (lstTasks, 0), (lblSelected, 120), (ButtonRow(btnComplete, btnDelete), 48));
    }
    private Control BuildFocusPanel()
    {
        lblFocusTime.TextAlign = ContentAlignment.MiddleCenter;
        return Stack((Label("专注计时", 15, DarkColor, true), 36), (Label("本轮专注时长（分钟）"), 24), (cmbFocusMinutes, 34),
            (lblFocusTime, 76), (lblFocusHint, 28), (ButtonRow(btnFocus, btnFocusReset), 40), (chkNotify, 28), (lblFocusTotal, 28),
            (Label("任务完成进度", 12, DarkColor, true), 30), (lblProgressText, 38), (progressTasks, 24), (lblProgressSummary, 0));
    }
    private Control BuildStatusBar()
    {
        var bar = new StatusStrip { Dock = DockStyle.Fill, SizingGrip = false, BackColor = Color.White, Padding = new(24, 0, 24, 0) };
        bar.Items.AddRange(new ToolStripItem[] { statusText, statusCount }); return bar;
    }
    private static Label Label(string text, float size = 9, Color? color = null, bool bold = false) => new()
    { Text = text, Dock = DockStyle.Fill, AutoSize = false, TextAlign = ContentAlignment.MiddleLeft, ForeColor = color ?? DarkColor, Font = new("Microsoft YaHei UI", size, bold ? FontStyle.Bold : FontStyle.Regular) };
    private static Button Button(string text, bool primary = false)
    {
        var button = new Button { Text = text, Dock = DockStyle.Fill, FlatStyle = FlatStyle.Flat, BackColor = primary ? AccentColor : PageColor, ForeColor = primary ? Color.White : DarkColor, Cursor = Cursors.Hand };
        button.FlatAppearance.BorderSize = 0; return button;
    }
    private static TableLayoutPanel Stack(params (Control control, int height)[] rows)
    {
        var table = new TableLayoutPanel { Dock = DockStyle.Fill, Margin = Padding.Empty, ColumnCount = 1, RowCount = rows.Length };
        table.ColumnStyles.Add(new(SizeType.Percent, 100));
        for (int i = 0; i < rows.Length; i++)
        {
            var (control, height) = rows[i]; control.Dock = DockStyle.Fill; control.Margin = new(0, 0, 0, 8);
            table.RowStyles.Add(height == 0 ? new(SizeType.Percent, 100) : new(SizeType.Absolute, height)); table.Controls.Add(control, 0, i);
        }
        return table;
    }
    private static Control ButtonRow(params Button[] buttons)
    {
        var row = new TableLayoutPanel { Dock = DockStyle.Fill, Margin = Padding.Empty, ColumnCount = buttons.Length };
        for (int i = 0; i < buttons.Length; i++) { row.ColumnStyles.Add(new(SizeType.Percent, 100F / buttons.Length)); buttons[i].Margin = new(i == 0 ? 0 : 6, 0, 0, 0); row.Controls.Add(buttons[i], i, 0); }
        return row;
    }

    private void AddTask()
    {
        if (string.IsNullOrWhiteSpace(txtTitle.Text)) { statusText.Text = "请先输入任务名称。"; txtTitle.Focus(); return; }
        var task = new StudyTask { Title = txtTitle.Text.Trim(), Note = txtNote.Text.Trim(), Category = cmbCategory.Text, DueDate = dtpDueDate.Value.Date, Priority = rbHigh.Checked ? "高" : rbLow.Checked ? "低" : "中" };
        tasks.Add(task); RefreshTaskList(task); txtTitle.Clear(); txtNote.Clear(); txtTitle.Focus(); if (SaveTasks()) statusText.Text = "任务已添加并保存。";
    }
    private void CompleteTask()
    {
        if (lstTasks.SelectedItem is not StudyTask task || task.Completed) return;
        task.Completed = true; RefreshTaskList(task); if (SaveTasks()) statusText.Text = "任务已完成，继续保持！";
    }
    private void DeleteTask()
    {
        if (lstTasks.SelectedItem is not StudyTask task) return;
        tasks.Remove(task); RefreshTaskList(); if (SaveTasks()) statusText.Text = "任务已删除并保存。";
    }
    private void RefreshTaskList(StudyTask? selected = null)
    {
        selected ??= lstTasks.SelectedItem as StudyTask;
        lstTasks.BeginUpdate(); lstTasks.Items.Clear();
        foreach (var task in tasks.Where(t => !chkOnlyPending.Checked || !t.Completed)) lstTasks.Items.Add(task);
        if (selected != null && lstTasks.Items.Contains(selected)) lstTasks.SelectedItem = selected;
        lstTasks.EndUpdate(); ShowSelectedTask();
        int done = tasks.Count(t => t.Completed), total = tasks.Count;
        progressTasks.Value = total == 0 ? 0 : (int)Math.Round(100.0 * done / total);
        lblListCount.Text = $"显示 {lstTasks.Items.Count} 项 · 全部 {total} 项"; lblProgressText.Text = $"{progressTasks.Value}%";
        lblProgressSummary.Text = $"已完成 {done} 项 / 共 {total} 项"; statusCount.Text = $"待完成 {total - done} 项";
    }
    private void ShowSelectedTask()
    {
        var task = lstTasks.SelectedItem as StudyTask; btnComplete.Enabled = task != null && !task.Completed; btnDelete.Enabled = task != null;
        lblSelected.Text = task == null ? "选择一个任务查看详情" : $"{task.Title}\n{task.Category} · {task.Priority}优先级 · 截止 {task.DueDate:yyyy-MM-dd}\n{(task.Completed ? "已完成" : "未完成")}\n{task.Note}";
        tips.SetToolTip(lblSelected, task?.Note ?? "");
    }

    private void ToggleFocus()
    {
        if (focusRunning) { focusWatch.Stop(); UiTimer_Tick(null, EventArgs.Empty); focusRunning = false; }
        else { if (remainingSeconds == 0) ResetFocus(); focusRunning = true; focusWatch.Start(); }
        UpdateFocusDisplay();
    }
    private void ResetFocus()
    {
        if (focusRunning) { focusWatch.Stop(); UiTimer_Tick(null, EventArgs.Empty); }
        focusRunning = false; focusWatch.Reset(); countedSeconds = 0; remainingSeconds = (int)(cmbFocusMinutes.SelectedItem ?? 25) * 60; UpdateFocusDisplay();
    }
    private void UiTimer_Tick(object? sender, EventArgs e)
    {
        UpdateClock(); if (!focusRunning) return;
        int elapsed = Math.Min(remainingSeconds, Math.Max(0, (int)focusWatch.Elapsed.TotalSeconds - countedSeconds));
        remainingSeconds -= elapsed; focusedSeconds += elapsed; countedSeconds += elapsed;
        if (remainingSeconds == 0)
        {
            focusRunning = false; focusWatch.Stop(); statusText.Text = "本轮专注已完成，休息一下吧！";
            UpdateFocusDisplay(); if (chkNotify.Checked) MessageBox.Show(this, "本轮专注已完成，休息一下吧！", "专注完成", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        UpdateFocusDisplay();
    }
    private void UpdateClock() => lblHeaderClock.Text = DateTime.Now.ToString("yyyy-MM-dd dddd\nHH:mm:ss");
    private void UpdateFocusDisplay()
    {
        lblFocusTime.Text = $"{remainingSeconds / 60:00}:{remainingSeconds % 60:00}"; btnFocus.Text = focusRunning ? "暂停专注" : remainingSeconds == 0 ? "再来一轮" : focusWatch.ElapsedTicks > 0 ? "继续专注" : "开始专注";
        lblFocusHint.Text = focusRunning ? "专注进行中，保持节奏" : remainingSeconds == 0 ? "本轮已完成，记得休息" : focusWatch.ElapsedTicks > 0 ? "已暂停，准备好后继续" : "准备好后，开始一次专注";
        cmbFocusMinutes.Enabled = !focusRunning && focusWatch.ElapsedTicks == 0;
        lblFocusTotal.Text = $"本次累计：{focusedSeconds / 60} 分 {focusedSeconds % 60:00} 秒";
    }

    private void LoadTasks()
    {
        try
        {
            if (!File.Exists(savePath)) return;
            var loaded = JsonSerializer.Deserialize<List<StudyTask>>(File.ReadAllText(savePath)) ?? throw new JsonException("任务数据为空。");
            if (loaded.Any(t => t == null || string.IsNullOrWhiteSpace(t.Title))) throw new JsonException("任务数据不完整。");
            tasks.AddRange(loaded); statusText.Text = "已加载本地任务。";
        }
        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException or JsonException)
        { canSave = false; statusText.Text = "任务加载失败，本次更改暂不保存，以免覆盖原文件。"; tips.SetToolTip(this, ex.Message); }
    }
    private bool SaveTasks()
    {
        dirty = true;
        if (!canSave) { statusText.Text = "原任务文件读取失败，本次更改暂未保存。"; return false; }
        try
        {
            Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);
            File.WriteAllText(savePath + ".tmp", JsonSerializer.Serialize(tasks, new JsonSerializerOptions { WriteIndented = true }));
            File.Move(savePath + ".tmp", savePath, true); dirty = false; return true;
        }
        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException) { statusText.Text = "保存失败：" + ex.Message; return false; }
    }
    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        if (dirty && !SaveTasks()) e.Cancel = MessageBox.Show(this, "任务尚未保存，仍要退出吗？", "保存提醒", MessageBoxButtons.YesNo, MessageBoxIcon.Warning) != DialogResult.Yes;
        base.OnFormClosing(e);
    }
    protected override void Dispose(bool disposing) { if (disposing) { uiTimer.Dispose(); tips.Dispose(); focusWatch.Stop(); } base.Dispose(disposing); }
}

public sealed class StudyTask
{
    public string Title { get; set; } = "";
    public string Note { get; set; } = "";
    public string Category { get; set; } = "课程学习";
    public string Priority { get; set; } = "中";
    public DateTime DueDate { get; set; } = DateTime.Today;
    public bool Completed { get; set; }
    public override string ToString() => $"{(Completed ? "✓" : "○")} [{Priority}] {Title}  ·  {DueDate:MM-dd}";
}
