#!/usr/bin/env python3
"""
Progress to the next lesson.

After your tests pass for lesson N, this script copies your solution file
into lesson N+1 so you start from your own code.

Usage:
    python3 eval/advance.py go 1      # advance from lesson 01 to 02 (Go)
    python3 eval/advance.py rust 5    # advance from lesson 05 to 06 (Rust)
"""

import argparse
import pathlib
import shutil
import subprocess
import sys

REPO = pathlib.Path(__file__).parent.parent

GO_LESSONS = {
    1: "01-variables",
    2: "02-control-flow",
    3: "03-functions",
    4: "04-structs-methods",
    5: "05-slices-maps",
    6: "06-errors-interfaces",
    7: "07-goroutines-channels",
}

RUST_LESSONS = {
    1: "01-variables",
    2: "02-control-flow",
    3: "03-functions",
    4: "04-structs-methods",
    5: "05-vecs-hashmaps",
    6: "06-errors-traits",
    7: "07-threads-channels",
}

RUST_CRATE_NAMES = {
    1: "lesson-01-variables",
    2: "lesson-02-control-flow",
    3: "lesson-03-functions",
    4: "lesson-04-structs-methods",
    5: "lesson-05-vecs-hashmaps",
    6: "lesson-06-errors-traits",
    7: "lesson-07-threads-channels",
}


def run_go_tests(lesson_dir: str) -> bool:
    result = subprocess.run(
        ["go", "test", f"./{lesson_dir}/..."],
        cwd=REPO / "go",
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
    return result.returncode == 0


def run_rust_tests(crate_name: str) -> bool:
    result = subprocess.run(
        ["cargo", "test", "-p", crate_name],
        cwd=REPO / "rust",
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
    return result.returncode == 0


def advance_go(from_n: int) -> None:
    to_n = from_n + 1
    from_dir = GO_LESSONS[from_n]
    to_dir = GO_LESSONS[to_n]
    src = REPO / "go" / from_dir / "main.go"
    dst = REPO / "go" / to_dir / "main.go"

    print(f"Running tests for lesson {from_n:02d} ({from_dir})…")
    if not run_go_tests(from_dir):
        print("\nTests must pass before advancing.")
        sys.exit(1)

    shutil.copy(src, dst)
    print("✓ Tests pass.")
    print(f"  Copied {src.relative_to(REPO)} → {dst.relative_to(REPO)}")
    print(f"\nOpen go/{to_dir}/README.md for your next task.")


def advance_rust(from_n: int) -> None:
    to_n = from_n + 1
    from_dir = RUST_LESSONS[from_n]
    to_dir = RUST_LESSONS[to_n]
    src = REPO / "rust" / from_dir / "src" / "lib.rs"
    dst = REPO / "rust" / to_dir / "src" / "lib.rs"
    crate = RUST_CRATE_NAMES[from_n]

    print(f"Running tests for {crate}…")
    if not run_rust_tests(crate):
        print("\nTests must pass before advancing.")
        sys.exit(1)

    shutil.copy(src, dst)
    print(f"✓ Tests pass.")
    print(f"  Copied {src.relative_to(REPO)} → {dst.relative_to(REPO)}")
    print(f"\nOpen rust/{to_dir}/README.md for your next task.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Copy your passing solution into the next lesson."
    )
    parser.add_argument("lang", choices=["go", "rust"])
    parser.add_argument("lesson", type=int, help="Current lesson number (1–6)")
    args = parser.parse_args()

    if args.lesson < 1 or args.lesson > 6:
        print("ERROR: lesson must be between 1 and 6")
        sys.exit(1)

    if args.lang == "go":
        advance_go(args.lesson)
    else:
        advance_rust(args.lesson)


if __name__ == "__main__":
    main()
