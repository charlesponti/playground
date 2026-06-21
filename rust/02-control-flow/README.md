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
