# Lesson 02: Control Flow

## Context

You are building a **Robot Status Monitor**. After lesson 01, your program prints the robot's name, battery level, and charging status as raw values.

In this lesson you will add a `battery_health` function that translates the raw battery integer into a human-readable health string.

---

## Concept: Control Flow

### if / else if / else

```rust
if x > 10 {
    println!("big");
} else if x > 5 {
    println!("medium");
} else {
    println!("small");
}
```

### match (Rust's switch — exhaustive, expression-based)

```rust
match x {
    0..=20 => "critical",
    21..=50 => "low",
    51..=99 => "healthy",
    100 => "full",
    _ => "unknown",
}
```

`if`/`match` are **expressions** in Rust — they return a value:

```rust
let label = if charging { "yes" } else { "no" };
```

---

## Your Task

Open `src/main.rs`. Complete every line marked `// TODO`.

Implement `battery_health(level: i32) -> &'static str` using the following rules:

| Condition | Return |
|-----------|--------|
| `level <= 20` | `"critical"` |
| `level <= 50` | `"low"` |
| `level < 100` | `"healthy"` |
| `level == 100` | `"full"` |

Then in `main`, print the result of `battery_health(BATTERY_LEVEL)`.

## Run tests

```
cargo test
```

## Goal output

```
Robot: R2D2
Battery: 98%
Charging: false
Health: healthy
```

<!--
TEACHER NOTES (not shown to students in rendered markdown)

Comprehension checks (ask after tests pass — pick based on where the student struggled):
- "Why does the order of the match arms matter? What would break if you put 51..=99 before 21..=50?"
- "In Rust, match is exhaustive — what does that mean, and how does it show up here?"
- "Why does battery_health return &'static str instead of String?"

Mini-quiz (run before student moves to lesson 03):
Q1 (recall): "What does battery_health return for level 50? For level 51?"
Q2 (application): "Add a rule: level == 0 returns 'dead'. Where in the match would you put it?"
Q3 (break it): "What would happen if you removed the _ wildcard arm from the match?"
Spaced repetition: "What is the difference between a Rust constant (const) and a let binding?" (lesson 01)
-->
