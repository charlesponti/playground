# Lesson 03: Functions

## Context

You are building a **Robot Status Monitor**. After lesson 02, your program prints raw values plus a battery health string. The printing logic lives scattered in `main`.

In this lesson you will extract that logic into a `report_status` function that returns a single formatted `String` — making the output testable and reusable.

---

## Concept: Functions

```rust
fn add(x: i32, y: i32) -> i32 {
    x + y  // no semicolon = implicit return
}
```

The last expression in a function is returned automatically. You can also use `return` explicitly for early returns.

**Building strings**

```rust
let s = format!("Hello, {}!", name);   // like println! but returns a String
```

**Ownership note**: `&str` is a borrowed string slice (for literals); `String` is an owned, heap-allocated string. Functions that build new strings return `String`.

---

## Your Task

Open `src/lib.rs`. It contains your solution from the previous lesson (run `python3 eval/advance.py rust N` first if the file is empty). Add the new code described below.

Implement `report_status(name: &str, level: i32, charging: bool) -> String` so it returns:

```
Robot: R2D2 | Battery: 98% (healthy) | Charging: false
```

Then replace the individual `println!` calls in `main` with a single call printing the result of `report_status`.

## Run tests

```
cargo test
```

## Goal output

```
Robot: R2D2 | Battery: 98% (healthy) | Charging: false
```

<!--
TEACHER NOTES (not shown to students in rendered markdown)

Comprehension checks (ask after tests pass — pick based on where the student struggled):
- "Why does report_status return String instead of &str?"
- "What's the difference between format! and println! — when would you use each?"
- "Why does report_status take name as &str but return a String?"

Mini-quiz (run before student moves to lesson 04):
Q1 (recall): "Does report_status print to the screen or return a value? How is that useful?"
Q2 (application): "If you wanted a terse_status that only returned 'R2D2: 98%', what would its signature look like?"
Q3 (break it): "What would happen if you forgot the semicolon after the format! call inside report_status?"
Spaced repetition: "What does battery_health return for level=20? For level=21? Why does the boundary matter?" (lesson 02)
-->
