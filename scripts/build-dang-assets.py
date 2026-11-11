#!/usr/bin/env python3
"""Build Dang's public assets from the read-only .new-portfolio inputs.

Images are converted to WebP, videos are remuxed/re-encoded to browser-safe
H.264 MP4, and every output dimension is recorded in a JSON manifest so the
typed project data can be generated without layout shift.

Usage: python3 scripts/build-dang-assets.py
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / ".new-portfolio"
PUBLIC = ROOT / "public" / "sites" / "dang"
MANIFEST = Path("/tmp/opencode/dang-manifest.json")

BANNER_MAX = 2000
IMAGE_MAX = 2400
WEBP_QUALITY = 82


def run(command: list[str]) -> None:
    subprocess.run(command, check=True)


def even(value: int) -> int:
    return max(2, value - (value % 2))


def convert_image(source: Path, target: Path, max_long_side: int) -> tuple[int, int]:
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = image.convert("RGBA") if image.mode in ("RGBA", "LA", "P") else image.convert("RGB")
        if image.mode == "RGBA":
            background = Image.new("RGB", image.size, (255, 255, 255))
            background.paste(image, mask=image.getchannel("A"))
            image = background
        else:
            image = image.convert("RGB")

        width, height = image.size
        long_side = max(width, height)
        if long_side > max_long_side:
            ratio = max_long_side / long_side
            image = image.resize(
                (max(1, round(width * ratio)), max(1, round(height * ratio))),
                Image.Resampling.LANCZOS,
            )

        image.save(target, "WEBP", quality=WEBP_QUALITY, method=6)
        return image.size


def video_dimensions(source: Path) -> tuple[int, int]:
    output = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height",
            "-of",
            "csv=s=x:p=0",
            str(source),
        ],
        text=True,
    ).strip()
    width, height = output.splitlines()[0].split("x")
    return int(width), int(height)


def transcode_video(source: Path, target: Path) -> tuple[int, int, float]:
    width, height = video_dimensions(source)
    long_side = max(width, height)
    if long_side > 1920:
        ratio = 1920 / long_side
        width = even(round(width * ratio))
        height = even(round(height * ratio))

    target.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            "ffmpeg",
            "-v",
            "error",
            "-y",
            "-i",
            str(source),
            "-map",
            "0:v:0",
            "-map",
            "0:a:0?",
            "-vf",
            f"scale={width}:{height}",
            "-c:v",
            "libx264",
            "-preset",
            "slow",
            "-crf",
            "23",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-movflags",
            "+faststart",
            "-map_metadata",
            "-1",
            str(target),
        ]
    )
    return width, height, target.stat().st_size / 1_000_000


def normalize(name: str) -> str:
    stem = Path(name).stem.lower()
    return re.sub(r"[^a-z0-9]+", "-", stem).strip("-")


def main() -> None:
    logos = PUBLIC / "logos"
    logos.mkdir(parents=True, exist_ok=True)

    for name in (
        "thd-black.svg",
        "thd-white.svg",
        "abstract-medium.svg",
        "abstract-thin.svg",
    ):
        source = SOURCE / "logo" / name
        text = source.read_text()
        if "abstract-" in name:
            text = text.replace("<svg ", '<svg fill="currentColor" ', 1)
        (logos / name).write_text(text)

    manifest: dict[str, object] = {"projects": {}}

    project_dirs = sorted(path for path in (SOURCE / "projects").iterdir() if path.is_dir())
    for project_dir in project_dirs:
        slug_source = {
            "2025 SHOWREEL": "2025-showreel",
            "GREENWICH IT CLUB": "greenwich-it-club",
            "POSTER[S]": "posters",
            "VINSCHOOL MUSIC CLUB": "vinschool-music-club",
            "VMC presents THE QUIET SOUL": "vmc-presents-the-quiet-soul",
            "VMC presents TRẠM": "vmc-presents-tram",
        }
        slug = slug_source[project_dir.name]
        target_dir = PUBLIC / "projects" / slug
        target_dir.mkdir(parents=True, exist_ok=True)

        entry: dict[str, object] = {
            "title": project_dir.name,
            "slug": slug,
            "banner": None,
            "video": None,
            "images": [],
        }

        for source in sorted(project_dir.iterdir()):
            suffix = source.suffix.lower()
            if suffix == ".png" and source.name.startswith("BANNER_"):
                width, height = convert_image(source, target_dir / "banner.webp", BANNER_MAX)
                entry["banner"] = {
                    "src": f"/sites/dang/projects/{slug}/banner.webp",
                    "width": width,
                    "height": height,
                }
            elif suffix == ".png":
                match = re.fullmatch(r"(\d+)\.(\d+)(?:_(\d+))?", source.stem)
                if not match:
                    raise ValueError(f"Unexpected image name: {source}")
                row, column, extra = match.groups()
                output_name = f"{int(row):02d}-{int(column):02d}{'b' if extra else ''}.webp"
                width, height = convert_image(source, target_dir / output_name, IMAGE_MAX)
                entry["images"].append(
                    {
                        "source": source.name,
                        "src": f"/sites/dang/projects/{slug}/{output_name}",
                        "width": width,
                        "height": height,
                        "row": int(row),
                        "column": int(column),
                        "extra": int(extra) if extra else None,
                    }
                )
            elif suffix in (".mov", ".mp4"):
                width, height, size_mb = transcode_video(source, target_dir / "video.mp4")
                entry["video"] = {
                    "source": source.name,
                    "src": f"/sites/dang/projects/{slug}/video.mp4",
                    "width": width,
                    "height": height,
                    "sizeMb": round(size_mb, 2),
                }

        if entry["banner"] is None:
            if slug != "2025-showreel":
                raise ValueError(f"Missing banner for {project_dir.name}")
            source_video = project_dir / "1.1.mov"
            with tempfile.TemporaryDirectory() as temp_dir:
                frame = Path(temp_dir) / "frame.png"
                run(
                    [
                        "ffmpeg",
                        "-v",
                        "error",
                        "-y",
                        "-ss",
                        "3",
                        "-i",
                        str(source_video),
                        "-frames:v",
                        "1",
                        "-vf",
                        "crop=1920:960:0:60",
                        str(frame),
                    ]
                )
                width, height = convert_image(frame, target_dir / "banner.webp", BANNER_MAX)
            entry["banner"] = {
                "src": f"/sites/dang/projects/{slug}/banner.webp",
                "width": width,
                "height": height,
            }

        entry["images"].sort(key=lambda image: (image["row"], image["column"], image["extra"] or 0))
        manifest["projects"][slug] = entry

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
    print(f"Wrote manifest to {MANIFEST}")


if __name__ == "__main__":
    main()
