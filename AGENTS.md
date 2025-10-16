# Repository Guidelines

## Project Structure & Module Organization
- Root directories named after BJTU courses capture raw study notes (Markdown, PDF, Typora exports). Mirror updates in `docs/` as published HTML; ensure asset folders accompany HTML exports (e.g., `人工智能基础期末复习笔记.assets`). Keep ancillary project repos (e.g., `BrainPy/`) intact and avoid renaming. The landing page `docs/index.html` is a React single-page app (React 18 via CDN + Babel); course metadata now lives in `docs/data/courses.json`, which the page fetches at runtime – keep both files in sync.
- Update `README.md` with any new course folder so GitHub navigation stays aligned with the course timeline.

## Build, Test, and Development Commands
- Landing page is React-in-browser (no bundler); update course metadata in `docs/data/courses.json` (JSON array) and ensure links stay relative to the `docs/` root. Run `uv run scripts/validate_courses.py` before commit to catch broken links or schema issues. Preview via `uv run python -m http.server --directory docs 8000` and browse `http://localhost:8000`.
- For standalone Markdown exports, no additional build pipeline exists. Typora/VSCode exports can be dropped alongside assets.
- For Markdown hygiene, optional `uvx mdformat AGENTS.md README.md` (or specify files) keeps layout consistent. Use `uv run scripts/validate_courses.py` to verify the JSON catalog after edits.

## Coding Style & Naming Conventions
- Markdown: use `#` top-level headings matching the folder title; keep tables of contents short and use ordered lists for syllabus-style outlines.
- File names: prefer Chinese course names or CamelCase English without spaces; version drafts with suffixes like `_v2.md` instead of rewriting history.
- Store images inside a sibling `*.assets` folder and reference them with relative paths (`![图](课程名.assets/image.png)`). Large binary assets (PDF/PPT/DOCX) are marked in `.gitattributes` for Git LFS; run `git lfs install` before committing new files of these types. Use `uv run scripts/report_large_assets.py --min-mb 20` to audit oversized files before pushing.

## Testing Guidelines
- Before pushing, open Markdown in Typora or VSCode preview to confirm math blocks and tables render; verify PDF/HTML exports open cleanly.
- For mirrored HTML, click through internal links and attachment references after running the local server to ensure asset paths survive.
- When adding code samples under course subprojects, run the language’s quick sanity check (`pytest`, `npm test`, or `make`) inside that subfolder and mention the result in the PR body.

## Commit & Pull Request Guidelines
- Follow the existing short, descriptive style (`Update README.md`, `更新软件测试与质量保证笔记`) but add the topic scope when feasible (`Update: 数据结构 堆排序总结`).
- Bundle related assets (Markdown + PDF + HTML) in a single commit. Include a clear PR description covering: summary of material added, affected folders, preview steps performed, and any follow-up TODOs. Link upstream issues or syllabus references when applicable; attach screenshots if HTML layout changes.
