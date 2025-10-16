# myNotes · 北京交通大学软件工程课程知识库

<p align="center">
  <a href="https://routhleck.github.io/myNotes/"><img src="https://img.shields.io/badge/Preview-Docs%20Portal-0071e3" alt="Docs Portal"></a>
  <a href="AGENTS.md"><img src="https://img.shields.io/badge/For%20Contributors-Guidelines-34c759" alt="Contributor Guide"></a>
  <a href="https://github.com/Routhleck/myNotes/stargazers"><img src="https://img.shields.io/github/stars/Routhleck/myNotes?style=flat" alt="GitHub Repo stars"></a>
</p>

> 从大一到大三的核心课程、实验项目与实训资料，全部集中在一个仓库中。每份笔记都配有 PDF / HTML 版本，方便在线浏览或离线下载。

---

## 🚀 快速导航
- 🎨 **在线浏览入口**：使用全新的 React 导航页，快速按年级与关键词筛选资料。<br>
  - GitHub Pages（推荐）：`https://routhleck.github.io/myNotes/`
  - 本地预览：`uv run python -m http.server --directory docs 8000`
- 🗂️ **课程数据源**：`docs/data/courses.json`（课程卡片元数据）。
- 🤝 **贡献指南**：详见 [`AGENTS.md`](AGENTS.md)，包含 LFS、校验脚本与命名规范。
- 🛠️ **克隆 & 预览速查**：见下方“⚙️ 克隆与本地预览”。

## ⚙️ 克隆与本地预览
1. 首次 clone 后运行 `git lfs install`，确保大文件走 LFS 管道。
2. 按需获取大文件：`git lfs pull --include="docs/**"` 拉取门户所需；若需全部资料，执行 `git lfs pull`。
3. 本地浏览 React 门户：`uv run python -m http.server --directory docs 8000` 并访问 `http://localhost:8000`。
4. 更新课程目录时同步维护 `docs/data/courses.json`，提交前运行 `uv run scripts/validate_courses.py` 与 `uv run scripts/report_large_assets.py --min-mb 20`。

---

## 📚 课程地图

### 🧩 大一基础
- [大学物理 I](https://github.com/Routhleck/myNotes/tree/main/大学物理I) · PDF · 力学、电磁学知识点梳理
- [JAVA](https://github.com/Routhleck/myNotes/tree/main/JAVA) · HTML · 面向对象与常用 API 速览
- [计算机组成原理](https://github.com/Routhleck/myNotes/tree/main/计算机组成原理) · PDF · 指令系统、存储结构、流水线

### 🛠️ 大二进阶
- [大学物理 II](https://github.com/Routhleck/myNotes/tree/main/大学物理II) · PDF · 光学与近代物理公式整理
- [离散数学](https://github.com/Routhleck/myNotes/tree/main/离散数学) · PDF · 集合、图论与常考题型
- [数据结构](https://github.com/Routhleck/myNotes/tree/main/数据结构) · PDF · 练习题与解析
- [大数据概论](https://github.com/Routhleck/myNotes/tree/main/大数据概论) · HTML · 平台生态与案例
- [数据库概论](https://github.com/Routhleck/myNotes/tree/main/数据库概论) · HTML · SQL、范式与设计
- [软件系统设计与分析](https://github.com/Routhleck/myNotes/tree/main/软件系统设计与分析) · HTML · 需求建模与架构风格
- [人工智能基础](https://github.com/Routhleck/myNotes/tree/main/人工智能基础) · HTML · 搜索、推理、机器学习初识
- [概率论与数理统计](https://github.com/Routhleck/myNotes/tree/main/概率论与数理统计) · HTML · 分布、估计与检验速记

### 🚀 大三深化
- [科技论文写作](https://github.com/Routhleck/myNotes/tree/main/科技论文写作) · HTML · 科研写作流程与排版技巧
- [软件项目管理与产品运维](https://github.com/Routhleck/myNotes/tree/main/软件项目管理与产品运维) · HTML / PDF · 项目规划与运维案例
- [操作系统](https://github.com/Routhleck/myNotes/tree/main/操作系统) · HTML · 进程、内存、文件系统
- [软件测试与质量保证](https://github.com/Routhleck/myNotes/tree/main/软件测试与质量保证) · HTML / PDF / PPT · 测试设计方法
- [机器学习](https://github.com/Routhleck/myNotes/tree/main/机器学习) · HTML / PDF · 经典算法与调参心得
- [c++ 程序设计](https://github.com/Routhleck/myNotes/tree/main/c%2B%2B程序设计) · HTML / PDF · STL 与项目案例
- [大规模计算](https://github.com/Routhleck/myNotes/tree/main/大规模计算) · HTML / PDF · HPC 基础与实验记录
- [大型平台软件分析与设计](https://github.com/Routhleck/myNotes/tree/main/大型平台软件分析与设计) · HTML / PDF · 平台架构与设计模式
- [API 设计与实现](https://github.com/Routhleck/myNotes/tree/main/API设计与实现) · HTML · REST / GraphQL 实践
- [轻量化平台开发](https://github.com/Routhleck/myNotes/tree/main/轻量化平台开发) · HTML · 小程序架构与云开发
- [LeetCode 题解](https://github.com/Routhleck/myNotes/tree/main/LeetCode) · HTML · 高频题型与思路记录

---

## 🧪 课设 & 实训精选
| 项目 | 方向 | Stars |
| --- | --- | --- |
| [航班延误预测系统](https://github.com/Routhleck/flight-delay-predict) | 大数据 / 预测 | ![](https://img.shields.io/github/stars/Routhleck/flight-delay-predict) |
| [MINI_DBMS](https://github.com/Routhleck/MINI_DBMS) | 数据库课程设计 | ![](https://img.shields.io/github/stars/Routhleck/MINI_DBMS) |
| [十二生肖识别](https://github.com/Routhleck/animal_detect_paddle) | CV / PaddlePaddle | ![](https://img.shields.io/github/stars/Routhleck/animal_detect_paddle) |
| [云体测平台](https://github.com/Routhleck/Cloud-body-measurement) | Web / 实训 | ![](https://img.shields.io/github/stars/Routhleck/Cloud-body-measurement) |
| [线上商城](https://github.com/Routhleck/Online-Shopping-Mall) | 数据库实训 | ![](https://img.shields.io/github/stars/Routhleck/Online-Shopping-Mall) |
| [列车购票系统](https://github.com/Routhleck/train-ticket-book-system) | C++ 课程设计 | ![](https://img.shields.io/github/stars/Routhleck/train-ticket-book-system) |
| [代码查重系统](https://github.com/Routhleck/code_difference_comparision) | 测试 / 质量 | ![](https://img.shields.io/github/stars/Routhleck/code_difference_comparision) |
| [自制 OS](https://github.com/Routhleck/myOS) | 操作系统 | ![](https://img.shields.io/github/stars/Routhleck/myOS) |
| [代码缺陷预测系统](https://github.com/Routhleck/bug-detect-system) | 质量预测 | ![](https://img.shields.io/github/stars/Routhleck/bug-detect-system) |
| [热传导计算](https://github.com/Routhleck/heat_conduction) | 数值计算 | ![](https://img.shields.io/github/stars/Routhleck/heat_conduction) |
| [OpenGL 实验合集](https://github.com/Routhleck/Computer-Graphics-projects) | 计算机图形学 | ![](https://img.shields.io/github/stars/Routhleck/Computer-Graphics-projects) |
| [天气预测系统](https://github.com/Routhleck/Weather-Predict) | 大数据导论 | ![](https://img.shields.io/github/stars/Routhleck/Weather-Predict) |
| [电影推荐系统](https://github.com/A0hdhyz9Z/MovieRecommendSys) | 推荐系统 | ![](https://img.shields.io/github/stars/A0hdhyz9Z/MovieRecommendSys) |
| [新闻小程序](https://github.com/Routhleck/miniprogram-News) | 小程序 | ![](https://img.shields.io/github/stars/Routhleck/miniprogram-News) |
| [线上商城 API](https://github.com/Routhleck/online-store-API-design) | API 设计 | ![](https://img.shields.io/github/stars/Routhleck/online-store-API-design) |

---

## 🔗 延伸资源
- [雅思备考](https://github.com/Routhleck/IELTS-preparation)
- [BJTU 校园网自动登录](https://github.com/Routhleck/BJTU-Network-autologin)
- [视频自动剪辑](https://github.com/Routhleck/video-auto-cut)
- 课题组项目：
  - [BrainPy](https://github.com/brainpy/BrainPy) ![](https://img.shields.io/github/stars/brainpy/BrainPy)
  - [BrainState](https://github.com/chaobrain/brainstate) ![](https://img.shields.io/github/stars/chaobrain/brainstate)
  - [BrainUnit](https://github.com/chaobrain/brainunit) ![](https://img.shields.io/github/stars/chaobrain/brainunit)
  - [BrainTaichi](https://github.com/chaobrain/braintaichi) ![](https://img.shields.io/github/stars/chaobrain/braintaichi)
  - [Dendritex](https://github.com/chaobrain/dendritex) ![](https://img.shields.io/github/stars/chaobrain/dendritex)

---

## 🧑‍💻 如何参与
1. Fork 或同步 `main`，按“⚙️ 克隆与本地预览”准备环境。
2. 更新笔记后再次执行 `uv run scripts/validate_courses.py` 与 `uv run scripts/report_large_assets.py --min-mb 20`，确保数据完整。
3. 遵循 [`AGENTS.md`](AGENTS.md) 的命名、资产管理与 PR 说明，提交前附上预览步骤与重点变更。

欢迎提出 Issue / PR，一起把 myNotes 打造成更好用的学习资料库。✨
