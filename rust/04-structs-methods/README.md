# Lesson 04: Structs & Methods

## Context

You are building a **Robot Status Monitor**. After lesson 03, the robot's state is held in separate constants and passed around as function arguments.

In this lesson you will group the robot's state into a `Robot` struct and attach the logic as methods — so the robot carries its own behaviour.

---

## Concept: Structs & Methods

```rust
struct Point {
    x: f64,
    y: f64,
}

impl Point {
    // associated function (no self) — used as constructor
    fn new(x: f64, y: f64) -> Point {
        Point { x, y }
    }

    // method — &self borrows the value (read-only)
    fn distance_from_origin(&self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt()
    }

    // method — &mut self borrows mutably (allows mutation)
    fn scale(&mut self, factor: f64) {
        self.x *= factor;
        self.y *= factor;
    }
}

let mut p = Point::new(3.0, 4.0);
p.scale(2.0);
```

**Ownership**: when you store a `String` in a struct, the struct owns it. Use `&str` for borrowed references that outlive their owner.

---

## Your Task

Open `src/main.rs`. Complete every line marked `// TODO`.

1. Define the `Robot` struct with fields `name: String`, `battery: i32`, `is_charging: bool`.
2. Implement `Robot::new(name: &str) -> Robot` — battery starts at 100.
3. Implement `battery_health(&self) -> &'static str` — same rules as lesson 02.
4. Implement `status(&self) -> String` — returns the formatted status string.
5. In `main`, create a robot, set its fields, and print its status.

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
- "Why does new take name: &str but the struct stores name: String? What conversion happens?"
- "What does &self mean on battery_health? Why not self or &mut self?"
- "Why does status call self.battery_health() instead of duplicating the match logic?"

Mini-quiz (run before student moves to lesson 05):
Q1 (recall): "What three fields does the Robot struct have?"
Q2 (application): "If you wanted a method charge() that sets battery to 100 and is_charging to false, what would its signature need?"
Q3 (break it): "What would happen if new returned Robot instead of taking name: &str — what would the caller need to write?"
Spaced repetition: "In Rust, when does a function return &'static str vs String? Which does report_status return and why?" (lesson 03)
-->
