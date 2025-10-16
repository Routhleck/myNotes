#!/usr/bin/env python3
"""Validate docs/data/courses.json integrity.

Checks:
- JSON parse success and top-level list.
- Required keys exist with expected types.
- Resource hrefs resolve to files within docs/ or remote URLs.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "docs" / "data" / "courses.json"
DOCS_ROOT = ROOT / "docs"

REQUIRED_FIELDS = {"id", "title", "grade", "description", "resources"}
RESOURCE_FIELDS = {"id", "label", "href", "kind"}
ALLOWED_KINDS = {"pdf", "ppt", "html"}


def main() -> int:
    if not DATA_FILE.exists():
        print(f"❌ Missing data file: {DATA_FILE}", file=sys.stderr)
        return 1

    try:
        payload = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"❌ Invalid JSON: {exc}", file=sys.stderr)
        return 1

    if not isinstance(payload, list):
        print("❌ Root JSON value must be an array of courses.", file=sys.stderr)
        return 1

    problems: list[str] = []

    for idx, course in enumerate(payload):
        prefix = f"Course[{idx}]"
        if not isinstance(course, dict):
            problems.append(f"{prefix}: expected object, got {type(course).__name__}")
            continue

        missing = REQUIRED_FIELDS - course.keys()
        if missing:
            problems.append(f"{prefix}: missing fields {sorted(missing)}")

        for field in ("id", "title", "grade", "description"):
            if field in course and not isinstance(course[field], str):
                problems.append(f"{prefix}.{field}: expected string")

        if "keywords" in course:
            if not isinstance(course["keywords"], list) or not all(
                isinstance(item, str) for item in course["keywords"]
            ):
                problems.append(f"{prefix}.keywords: expected list[str]")

        resources = course.get("resources")
        if not isinstance(resources, list) or not resources:
            problems.append(f"{prefix}.resources: expected non-empty list")
            continue

        for res_idx, resource in enumerate(resources):
            res_prefix = f"{prefix}.resources[{res_idx}]"
            if not isinstance(resource, dict):
                problems.append(f"{res_prefix}: expected object")
                continue

            missing_res = RESOURCE_FIELDS - resource.keys()
            if missing_res:
                problems.append(f"{res_prefix}: missing fields {sorted(missing_res)}")

            href = resource.get("href")
            kind = resource.get("kind")

            if kind not in ALLOWED_KINDS:
                problems.append(f"{res_prefix}.kind: unsupported '{kind}'")

            if isinstance(href, str):
                if is_remote_url(href):
                    continue
                target = (DOCS_ROOT / href).resolve()
                if not str(target).startswith(str(DOCS_ROOT.resolve())):
                    problems.append(f"{res_prefix}.href: points outside docs/ ({href})")
                elif not target.exists():
                    problems.append(f"{res_prefix}.href: file not found ({href})")
            else:
                problems.append(f"{res_prefix}.href: expected string")

    if problems:
        print("❌ Validation failed:")
        for item in problems:
            print(f"  - {item}")
        return 1

    print("✅ courses.json looks good (", len(payload), "courses )")
    return 0


def is_remote_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"}


if __name__ == "__main__":
    sys.exit(main())
