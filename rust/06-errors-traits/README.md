# Lesson 06: Errors & Traits

## Context

You are building a **Robot Status Monitor**. After lesson 05, the robot has a task registry and battery history.

In this lesson you will define a `Sensor` trait and a `BatterySensor` implementation, and introduce `Result`-based error handling so invalid readings are caught before they corrupt state.

---

## Concept: Errors & Traits

### Traits

A trait defines shared behaviour — like an interface.

```rust
trait Greet {
    fn hello(&self) -> String;
}

struct Person { name: String }

impl Greet for Person {
    fn hello(&self) -> String {
        format!("Hello, {}!", self.name)
    }
}
```

### Result

`Result<T, E>` represents either success (`Ok(value)`) or failure (`Err(error)`).

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        return Err("division by zero".to_string());
    }
    Ok(a / b)
}

match divide(10.0, 0.0) {
    Ok(v)  => println!("result: {}", v),
    Err(e) => println!("error: {}", e),
}
```

### Lifetimes (just enough for this lesson)

When a struct holds a reference, you must tell Rust how long it lives:

```rust
struct Wrapper<'a> {
    value: &'a i32,
}
```

`'a` means "the reference lives at least as long as the struct."

---

## Your Task

Open `src/lib.rs`. It is blank — write it from scratch using the task description below.

1. Define the `Sensor` trait with one method: `read(&self) -> Result<i32, String>`.
2. Define `BatterySensor<'a>` with a field `robot: &'a Robot`.
3. Implement `Sensor` for `BatterySensor`: return `Err` if battery is out of `[0, 100]`, else `Ok(battery)`.
4. Implement `read_sensor(sensor: &impl Sensor) -> Result<i32, String>`.

## Run tests

```
cargo test
```

<!--
TEACHER NOTES (not shown to students in rendered markdown)

Comprehension checks (ask after tests pass — pick based on where the student struggled):
- "How does Rust know that BatterySensor implements Sensor — did you declare that anywhere explicit?"
- "Why does read_sensor take &impl Sensor instead of &BatterySensor directly?"
- "What's the difference between returning Err('bad'.to_string()) and panicking?"

Mini-quiz (run before student moves to lesson 07):
Q1 (recall): "What does BatterySensor::read() return when the battery is -1?"
Q2 (application): "If you wanted a TemperatureSensor that also implements Sensor, what would you need to write?"
Q3 (break it): "What would happen if you changed the Sensor trait's method signature to read(&mut self) — what would break?"
Spaced repetition: "What does Option have in common with Result? When would you use one vs. the other?" (lesson 05 → 06 pattern connection)
-->
