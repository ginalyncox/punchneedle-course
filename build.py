#!/usr/bin/env python3
"""Build script — merges partials into each src/*.html page."""

import html
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT
PARTIALS = ROOT / "partials"

HEAD = (PARTIALS / "head.html").read_text()
HEADER = (PARTIALS / "header.html").read_text()
FOOTER = (PARTIALS / "footer.html").read_text()

META_RE = re.compile(r"^<!--\s*(.*?)\s*-->", re.DOTALL)


def parse_meta(content: str):
    m = META_RE.match(content.strip())
    meta = {}
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        content = content[m.end() :].strip()
    return meta, content


def render(page_path: Path):
    raw = page_path.read_text()
    meta, body = parse_meta(raw)
    title = html.escape(meta.get("TITLE", "Untitled"), quote=True)
    description = html.escape(meta.get("DESCRIPTION", ""), quote=True)
    nav_key = html.escape(meta.get("NAV", ""), quote=True)

    head = (
        HEAD.replace("{{TITLE}}", title)
        .replace("{{DESCRIPTION}}", description)
        .replace("{{CSS}}", "css/style.css")
    )
    header = HEADER.replace("{{PATH}}", "")
    # Set aria-current on the active nav link
    if nav_key:
        header = header.replace(
            f'data-nav="{nav_key}">',
            f'data-nav="{nav_key}" aria-current="page">',
        )
    footer = FOOTER.replace("{{PATH}}", "").replace("{{JS}}", "js/site.js")

    html_out = f"""<!doctype html>
<html lang="en">
<head>
{head}
</head>
<body>
{header}
<main id="main">
{body}
</main>
{footer}
</body>
</html>
"""
    out_path = OUT / page_path.name
    out_path.write_text(html_out)
    return out_path


def main():
    # Copy assets
    assets_dir = OUT / "assets"
    assets_dir.mkdir(exist_ok=True)
    gen = ROOT / "generated_assets"
    if gen.exists():
        for f in gen.iterdir():
            if f.is_file():
                shutil.copy2(f, assets_dir / f.name)

    # Render pages
    for page in sorted(SRC.glob("*.html")):
        out = render(page)
        print(f"→ {out.name}")


if __name__ == "__main__":
    main()
