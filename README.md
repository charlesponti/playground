# playground

A multi-language learning playground. Each language implements the same program — a **Robot Status Monitor** — built up lesson by lesson.

## Languages

| Language | Directory | Final program |
|----------|-----------|---------------|
| Go | [`go/`](go/) | Concurrent sensor monitor using goroutines |
| Rust | [`rust/`](rust/) | Concurrent sensor monitor using threads |

## How it works

Each language has 7 lessons. Every lesson is a self-contained folder with:

- `README.md` — concept reference + task description
- `main.go` / `src/lib.rs` — your code file (starts blank in lesson 01)
- `main_test.go` / `tests/main_test.rs` — tests that define "done"

When your tests pass, run `eval/advance.py` to copy your solution into the next lesson. You build on your own code at every step — nothing is pre-filled for you.

`student.md` in the root tracks your knowledge across sessions — Claude reads and updates it automatically. You can edit it too.

## Learning workflow

This playground is designed for [Claude Code](https://claude.ai/code). AGENT.md is loaded automatically as the teaching persona — no setup required.

```
1. Navigate to a lesson directory.
2. Run `claude` to start a session.
3. Claude reads the lesson and your code, then starts teaching.
4. Work through the task. Claude can run your tests directly.
5. When tests pass, run advance.py to carry your solution forward.
```

```
# Go
cd go/01-variables
claude

# When tests pass, advance to the next lesson:
python3 eval/advance.py go 1

# Rust
cd rust/01-variables
claude

python3 eval/advance.py rust 1
```

## The robot

You start by printing three variables. You end with a program that reads sensors on concurrent threads/goroutines and reports the robot's full status in real time.

## Developer tools

`eval/` contains tooling for contributors, not learners:

- `advance.py` — gates advancement on passing tests, then copies your solution forward
- `lint.sh` — structural linter; checks every lesson has required files and teacher notes
- `eval.py` — LLM eval harness; runs scenarios against the AGENT.md teacher persona via OpenRouter
