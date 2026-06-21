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

Open `src/main.rs`. Complete every line marked `// TODO`.

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
