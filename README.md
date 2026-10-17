# StudyFlow · C# WinForms 可视化源码答辩系统

点击真实 StudyFlow 窗口中的控件，查看其声明、属性、布局、事件和业务实现，并用中文解释代码。网站展示的是原始 WinForms 工程的源码导航；无需运行或编译该工程。

## 立即使用

**离线打开：**解压完整项目后，双击 `index.html`。所有资源随项目提供，无需安装依赖、联网或登录。请保留文件夹结构，不要只复制 HTML。

**本地预览：**如果电脑已安装 Node.js，在项目根目录打开终端：

```sh
node scripts/serve.cjs
```

打开 [本地预览](http://localhost:4173/)，按 `Ctrl+C` 停止服务。部署前推荐使用此方式检查。

网站使用原生 HTML、CSS、JavaScript 和 SVG，没有后端、数据库、第三方运行依赖或 Python 文件。资源均使用相对路径，页面使用 Hash 路由，可部署到 GitHub Pages 的仓库子路径，刷新详情页无需服务器路由配置。

## 答辩时怎么用

1. 在“程序界面”点击截图热点，直接进入对应实例；空白任务列表也可以点击。
2. 在详情页切换“定义、属性、布局、事件、实现、流程”标签。点击源码位置可在完整 `Program.cs` 中定位。
3. 同类型控件可切换实例，例如五个按钮、两个文本框和两个下拉框。
4. 切换“真实源码 / 中文注释”，调整代码字号；需要更多代码空间时隐藏右侧讲解。
5. 通过“课堂答辩”查看快速回答、详细说明、追问和可点击的方法流程。

| 快捷键 | 功能 |
| --- | --- |
| `Ctrl+K`（macOS 为 `⌘K`） | 搜索控件类型、变量、方法、中文名称或功能 |
| `H` | 返回程序界面 |
| `D` | 开启 / 关闭答辩模式 |
| `F` | 进入 / 退出全屏 |
| `Esc` | 关闭搜索；浏览器全屏下可退出全屏 |

输入框中键入文字时，单字母快捷键不会触发。全屏和剪贴板受浏览器权限限制；可使用界面按钮完成对应操作。界面支持浅色 / 深色主题、全部热点轮廓开关、截图定位、浏览器前进 / 后退、方法折叠和源码行号跳转。

## 材料与源码真实性

- `source/Program.cs` 保留用户提供的原始文件内容，共 **254 行**。全部源码片段使用该文件的真实行号；没有修改 WinForms 工程。
- `assets/studyflow-main.png` 是用户上传的真实截图。PNG 文件头确认尺寸为 **2418 × 1560**，与需求模板中写的 2048 × 1332 不同。SVG 使用实际尺寸，图片保持原始比例。
- 首页共 **41 个独立热点**，含三个独立优先级单选按钮、空任务列表、顶部绘图和底部状态栏。系统最小化、最大化、关闭按钮不属于项目控件，没有设置热点。
- 导航包含 **52 个实例 / 知识入口**，覆盖要求的 **14 类课件控件**及 **10 项扩展知识**。Timer、ToolTip 等不可见对象可以从目录进入。
- 课件所称的“StatusLabel”在该工程中使用的是 `ToolStripStatusLabel`。
- 提供 183 条原行中文说明，并把 84 个长行展开为 244 个带注释教学片段。教学排版版只调整换行和缩进，左列标注“原行号·分段号”；真实源码模式保留原文。请以 `Program.cs` 为唯一代码事实依据。
- 本项目只需提供的 `Program.cs` 即可建立源码映射，不需要 `.csproj`；没有因此声称已编译或运行原 WinForms 工程。

截图记录的是某次运行状态，不能当作全部默认值：源码默认选中“中”优先级（`rbMedium.Checked = true`）和“课程学习”（`cmbCategory.SelectedIndex = 0`），截图中是“低”和“编程练习”。默认专注时长是 25 分钟，结束提醒默认开启。本次累计专注时间来自 `focusedSeconds`，只累计此次程序运行期间的专注时间；`Timer` 负责每秒触发界面更新，`Stopwatch` 负责实际经过时间的测量。

## 项目结构

```text
StudyFlow-Control-Guide/
├── index.html                  # 页面入口，可离线直接打开
├── style.css                   # 页面、投影和响应式样式
├── app.js                      # 路由、页面和交互
├── code.js                     # 源码显示与语法高亮
├── assets/
│   ├── studyflow-main.png       # 原始截图
│   └── favicon.svg
├── source/
│   └── Program.cs              # 唯一源码事实依据
├── data/
│   ├── source-text.js          # 原始源码的离线镜像，脚本生成
│   ├── source-index.js         # 方法及源码区间索引
│   ├── controls.js             # 统一控件实例与源码映射
│   ├── hotspots.js             # 原图尺寸与 SVG 热点坐标
│   ├── explanations.js         # 中文讲解、答辩与问答
│   ├── annotations.js          # 原行中文说明
│   └── teaching-lines.js       # 保留代码字符的教学分段
├── scripts/
│   ├── generate-source.cjs     # 生成离线源码镜像
│   ├── verify.cjs              # 静态数据与映射检查
│   └── serve.cjs               # 本地预览服务
├── TEST-REPORT.md              # 已执行检查与发布状态
└── README.md
```

## 更新代码或截图

修改 `source/Program.cs` 后，在项目根目录运行：

```sh
node scripts/generate-source.cjs
node scripts/verify.cjs
```

`source-text.js` 将原文作为 JavaScript 字符串提供给浏览器，解决双击 HTML 时 `file://` 无法可靠读取本地源码的问题。通过 HTTP 预览时，网站也会读取 `source/Program.cs` 并检查与离线镜像是否一致。请勿手动改写镜像。

**重新生成镜像不等于自动重新校准全部映射。**如果改动导致行号、方法或控件变化，还需同步核对 `source-index.js`、`controls.js`、`annotations.js`、`teaching-lines.js` 和相关讲解，再运行验证脚本。

如果换了截图，先读取新图片的实际宽高，再更新 `hotspots.js` 的 `SF_IMAGE` 和各热点 `x / y / width / height`。坐标始终按原图像素填写，SVG 会随图片等比缩放。列表空白区域与详情标签需分开，优先级分组标题不能覆盖单选按钮，状态栏三个入口不能互相覆盖。

## 验证记录

- 热点数据已检查：41 个唯一 ID，全部位于图片边界内，热点之间没有重叠。
- 已以原尺寸查看实际截图，并依据真实界面和源码布局核对位置。
- `verify.cjs` 用于重复检查源码镜像、行号范围和数据关联；它不能代替人工阅读源码及浏览器操作。
- 已使用独立无头 Edge 浏览器逐个点击 41 个热点，检查 52 个入口和 312 个标签页；离线模式与 `/StudyFlow-Control-Guide/` 子路径均通过。
- 已检查 1920×1080、1440×1000、1366×768、390×844 视口；搜索、定位、复制、折叠、全屏、主题、答辩模式、返回与详情刷新均通过。未发现脚本异常或静态资源加载失败。具体范围见 `TEST-REPORT.md`。
- GitHub Pages 尚未发布，公网及真实手机设备访问仍待发布后验证。窄屏浏览器测试不等于真实手机设备测试。

## GitHub Pages 发布

用户已明确授权创建公开仓库并发布 GitHub Pages。仓库为 [zhangzhi-666/StudyFlow-Control-Guide](https://github.com/zhangzhi-666/StudyFlow-Control-Guide)，发布分支为 `main`，目录为仓库根目录。实际部署状态可在仓库的 Settings → Pages 和 Actions 中查看。

手动发布的最少步骤：

1. 在 GitHub 检查是否已存在 `zhangzhi-666/StudyFlow-Control-Guide`。不存在时自行创建；已存在时先确认可以使用该仓库。
2. 将**本文件所在目录内的内容**上传到仓库根目录，使 `index.html` 位于根目录，提交到 `main`。不要额外再套一层 `StudyFlow-Control-Guide` 文件夹，也不要覆盖仓库中未经确认的现有文件。
3. 进入仓库 **Settings → Pages**，选择 **Deploy from a branch**，分支选择 **main**、文件夹选择 **/(root)**，保存。
4. 等 GitHub 显示部署完成后，打开其给出的实际地址，检查截图、热点、详情、源码以及详情页刷新。再用手机或窄屏视口检查布局。

网站地址为 [StudyFlow-Control-Guide](https://zhangzhi-666.github.io/StudyFlow-Control-Guide/)，首次部署完成前可能暂时返回 404。无需在前端代码中填写 GitHub 密码或访问令牌。
