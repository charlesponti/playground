# playground

A multi-language learning playground. Each language implements the same program — a **Robot Status Monitor** — built up lesson by lesson.

## Languages

| Language | Directory | Final program |
|----------|-----------|---------------|
| Go | [`go/`](go/) | Concurrent sensor monitor using goroutines |
| Rust | [`rust/`](rust/) | Concurrent sensor monitor using threads |

## How it works

Each language has 7 lessons. Every lesson is a self-contained folder with:

- `README.md` — concept reference + task description (paste this into your LLM)
- `main.go` / `src/main.rs` — scaffold with `// TODO` markers
- `main_test.go` / embedded `#[cfg(test)]` — tests that define "done"

The scaffold for each lesson already includes the **completed code from all prior lessons** — you only need to fill in the new TODOs.

## Learning workflow with an LLM

```
1. Open lesson 01/ in your editor.
2. Paste README.md into your LLM chat.
3. Work through the TODOs with the LLM's help.
4. Run the tests — green = move on.
5. Repeat for each lesson.
```

```
# Go
cd go/01-variables && go test

# Rust
cd rust/01-variables && cargo test
```

## The robot

You start by printing three variables. You end with a program that reads sensors on concurrent threads/goroutines and reports the robot's full status in real time.
