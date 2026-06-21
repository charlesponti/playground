# Lesson 01: Variables & Types

## Context

You are building a **Robot Status Monitor** — a command-line program that tracks and reports a robot's state. Each lesson adds one new capability. By lesson 07, the robot will read sensors concurrently and report full status.

This is the first lesson. There is no prior code to carry over.

---

## Concept: Variables & Types

In Rust, variables are **immutable by default**. Use `mut` to allow mutation.

```rust
let x = 5;        // immutable
let mut y = 10;   // mutable
y = 20;           // ok
```

Constants are always immutable and require an explicit type:

```rust
const MAX_BATTERY: i32 = 100;
```

**Common types**

| Type | Description |
|------|-------------|
| `i32` | 32-bit signed integer (default int) |
| `f64` | 64-bit float (default float) |
| `bool` | `true` or `false` |
| `&str` | string slice (for literals) |

**Printing**

```rust
println!("Hello, {}!", name);   // {} uses Display
println!("Battery: {}%", 98);
```

---

## Your Task

Open `src/main.rs`. Complete every line marked `// TODO`.

1. Declare `BATTERY_LEVEL` as a constant of type `i32` with value `98`.
2. Declare `IS_CHARGING` as a constant of type `bool` with value `false`.
3. Print the battery level with format `"Battery: 98%"`.
4. Print the charging status with format `"Charging: false"`.

## Run tests

```
cargo test
```

## Goal output

```
Robot: R2D2
Battery: 98%
Charging: false
```
