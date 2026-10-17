# StudyFlow · 14 种控件源码

为课堂讲解准备的简单源码目录：选择控件，直接查看它在 StudyFlow 中的真实 C# 代码。

网站地址：[StudyFlow 控件源码](https://zhangzhi-666.github.io/StudyFlow-Control-Guide/)。

## 使用方法

1. 首页只有 14 种课程控件，每个名称都有中文，例如 **Label 标签**、**Button 按钮**。
2. 点击任意控件，立即显示源码；不用再选择实例或切换标签。
3. 源码按实际用途分段显示，保留 `Program.cs` 原行号，可复制代码。
4. 桌面端可用左侧目录换一个控件；也可点击“全部 14 种控件”返回首页。

页面已去掉扩展知识、截图热点、关联流程、多层详情、问答、搜索和模式切换。

## 14 种控件

Label 标签、Button 按钮、TextBox 文本框、RadioButton 单选按钮、CheckBox 复选框、PictureBox 图片框、GroupBox 分组框、ListBox 列表框、ComboBox 下拉组合框、DateTimePicker 日期时间选择器、StatusStrip 状态栏、ToolStripStatusLabel 状态栏标签、ProgressBar 进度条、Timer 计时器。

## 运行与检查

解压后双击 `index.html` 即可离线浏览。也可在此目录运行：

```sh
node scripts/serve.cjs
```

打开终端显示的本地地址。网站使用原生 HTML、CSS 和 JavaScript，无第三方运行依赖，无需编译 C# 工程。

```sh
node scripts/verify.cjs
```

检查 14 种控件、源码区间、离线镜像、文件引用和语法高亮的原文一致性。

## 源码与维护

- `source/Program.cs`：原始 C# 源码，254 行，内容未修改。
- `data/source-text.js`：原始源码的离线镜像。
- `data/simple-controls.js`：当前 14 种控件的中文名、用途和源码区间。
- `app.js`、`style.css`、`index.html`：目录与直接显示源码的界面。
- `code.js`：源码文字和语法高亮。

源码区间是原文件的摘录，供讲解使用，不是 14 个独立可编译的程序。其他类型可能作为原始代码的一部分出现，例如 Timer 代码中测量实际时间的 Stopwatch。

修改原 C# 文件后运行 `node scripts/generate-source.cjs`，并重新核对 `simple-controls.js` 行号，再运行检查。早期版本的数据与截图保留在仓库中，当前页面不加载这些功能。

仓库为 [zhangzhi-666/StudyFlow-Control-Guide](https://github.com/zhangzhi-666/StudyFlow-Control-Guide)。GitHub Pages 从 `main` 分支根目录发布；Hash 路由兼容仓库子路径，详情可以直接刷新。
