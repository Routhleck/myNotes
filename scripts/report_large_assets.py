#!/usr/bin/env python3
"""Report large files in the repository to aid Git LFS migration decisions.

Usage:
  uv run scripts/report_large_assets.py --min-mb 20

Outputs a sorted table (descending) and optional JSON for automation.
"""
from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List

EXCLUDE_DIRS = {".git", ".venv", "venv", "node_modules", "__pycache__", "docs/data"}
DEFAULT_MIN_MB = 20


@dataclass
class Asset:
    path: Path
    size_bytes: int

    @property
    def size_mb(self) -> float:
        return self.size_bytes / (1024 * 1024)


def iter_assets(root: Path, min_bytes: int) -> Iterable[Asset]:
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in EXCLUDE_DIRS for part in path.parts):
            continue
        size = path.stat().st_size
        if size >= min_bytes:
            yield Asset(path=path.relative_to(root), size_bytes=size)


def format_table(rows: List[Asset]) -> str:
    lines = [f"Found {len(rows)} files ≥ threshold:\n"]
    width = max((len(str(asset.path)) for asset in rows), default=0)
    for asset in rows:
        lines.append(f"{str(asset.path):<{width}}  {asset.size_mb:6.1f} MB")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Report large files inside the repository")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="Repository root (default: cwd)")
    parser.add_argument("--min-mb", type=float, default=DEFAULT_MIN_MB, help="Minimum file size in MB")
    parser.add_argument("--json", type=Path, help="Optional path to write machine-readable JSON report")
    args = parser.parse_args()

    min_bytes = int(args.min_mb * 1024 * 1024)
    assets = sorted(iter_assets(args.root, min_bytes), key=lambda item: item.size_bytes, reverse=True)

    if assets:
        print(format_table(assets))
    else:
        print(f"No files ≥ {args.min_mb} MB found in {args.root}")

    if args.json:
        payload = [
            {
                "path": str(asset.path),
                "size_mb": round(asset.size_mb, 2),
                "size_bytes": asset.size_bytes,
            }
            for asset in assets
        ]
        args.json.write_text(json.dumps(payload, indent=2, ensure_ascii=False))
        print(f"JSON report written to {args.json}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
