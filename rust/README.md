# Rust — Robot Status Monitor

A progressive Rust curriculum. Each lesson builds on the last until you have a fully working concurrent robot monitor.

## How to use this with an LLM

1. Open the lesson folder (start with `01-variables/`).
2. Paste the lesson's `README.md` into your LLM chat.
3. Ask it to guide you through completing the `// TODO` items in `src/main.rs`.
4. Run the tests — when they pass, you're done with that lesson.
5. Move to the next folder and repeat.

```
cd 01-variables
cargo test        # run tests for this lesson
cargo run         # see your program run
```

## Lessons

| # | Topic | New capability added to the robot |
|---|-------|-----------------------------------|
| 01 | Variables & Types | Name, battery level, charging status |
| 02 | Control Flow | Battery health label (critical / low / healthy / full) |
| 03 | Functions | `report_status()` — single formatted string |
| 04 | Structs & Methods | `Robot` struct with methods |
| 05 | Vecs & HashMaps | Task registry + battery history |
| 06 | Errors & Traits | `Sensor` trait + `Result` error handling |
| 07 | Threads & Channels | Concurrent sensor polling |

## Final program output

```
Robot: R2D2 | Battery: 85% (healthy) | Charging: false
Sensor reading: 85
Sensor reading: 85
Sensor reading: 85
```
