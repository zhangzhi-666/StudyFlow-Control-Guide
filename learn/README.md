# StudyFlow 理解版

供学习使用的独立副本：保留 14 种控件入口，为当前 `1.cs` 的全部 208 行添加中文解释。源码与展示版相同，解释放在代码旁边，不写入原始 C# 文件。

- 理解版：https://zhangzhi-666.github.io/StudyFlow-Control-Guide/learn/
- 完整源码逐行学习：https://zhangzhi-666.github.io/StudyFlow-Control-Guide/learn/#/source
- 原展示版：https://zhangzhi-666.github.io/StudyFlow-Control-Guide/

点击控件卡片，查看该控件的源码和解释；点击“从第 1 行完整学习”，按原文件顺序阅读全部源码。空行、括号和一行中的多条语句也有说明。桌面宽屏并排显示源码与解释，窄屏在每行代码下面显示解释。“复制原始代码”只复制 C# 代码。

本副本的页面、样式、脚本、源码和解释均位于 `learn/`，不需要修改原展示版。顶部的“展示版”链接会在新标签页中打开原站。

## 本地查看与检查

可以直接打开本目录的 `index.html`；通过 HTTP 服务器查看时，复制按钮需要浏览器允许访问剪贴板。也可在仓库根目录运行 `node scripts/serve.cjs`，然后打开 `http://127.0.0.1:4173/learn/`。

运行 `node learn/scripts/verify.cjs` 检查源码、208 行解释、14 种控件范围与页面资源。

源码 SHA-256：`080f4bb572c11a71b2a1cf0d929943aaa6599d909cd0be861fdef1e6a56ae977`。

若以后修改本副本源码，需要同时更新 `data/source-text.js`、`data/simple-controls.js` 和 `data/line-notes.js`，重新核对行号和解释后再发布。
