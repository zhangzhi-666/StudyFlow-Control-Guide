# StudyFlow · 14 种控件源码

选择控件，直接查看它在 StudyFlow 中的 C# 代码。

网站：[StudyFlow 控件源码](https://zhangzhi-666.github.io/StudyFlow-Control-Guide/)。

## 当前对应版本

2026-10-18，同步自用户项目 `D:\Csharp_code\kongjian\1.cs`，共 **208 行**。网站 `source/1.cs` 与该文件逐字节一致；源码片段和行号以此版本为准。

- 保留 14 种课程控件，点击一次直接显示源码。
- 已删除右上角课程提示标签；底部状态栏启动时不显示初始提示。
- Timer 每约一秒使倒计时减一，支持开始、暂停、重置和结束提醒。
- 任务可添加、完成、删除、筛选，完成比例显示在进度条中。
- 任务只在本次运行期间保留。

## 使用方法

1. 点击带有中文名称的控件，例如 **Label 标签**、**Button 按钮**。
2. 直接查看其创建、事件与使用代码，不必再选实例或切换标签。
3. 代码框标注 `1.cs` 的真实行号，可复制片段。
4. 桌面端用左侧目录换控件，或点击“全部 14 种控件”返回。

控件为 Label、Button、TextBox、RadioButton、CheckBox、PictureBox、GroupBox、ListBox、ComboBox、DateTimePicker、StatusStrip、ToolStripStatusLabel、ProgressBar、Timer。Label 现有 18 个，其余控件数量保持。

## 离线浏览与维护

解压后双击 `index.html` 即可离线浏览。也可运行 `node scripts/serve.cjs` 并打开终端显示的本地地址。网站没有第三方运行依赖。

- `source/1.cs`：与用户当前项目一致的源码。
- `data/source-text.js`：源码离线镜像。
- `data/simple-controls.js`：14 种控件的说明与源码区间。
- `app.js`、`style.css`、`index.html`：目录和源码页面。
- `code.js`：语法高亮与代码复制。

更新源码后，运行 `node scripts/generate-source.cjs`，并核对 `simple-controls.js` 区间。随后运行：

```sh
node scripts/verify.cjs
```

还可以传入用户项目文件路径，额外检查两份源码逐字节一致：

```powershell
node scripts/verify.cjs 'D:\Csharp_code\kongjian\1.cs'
```

旧版截图、热点、问答和旧行号索引已从当前包中移除，历史版本可在 Git 历史中查看。源码片段用于讲解，不是 14 个独立可编译的程序。

仓库：[zhangzhi-666/StudyFlow-Control-Guide](https://github.com/zhangzhi-666/StudyFlow-Control-Guide)。GitHub Pages 从 `main` 分支根目录发布，支持直接刷新控件详情页。
