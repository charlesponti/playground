# Lesson 07: Threads & Channels

## Context

You are building a **Robot Status Monitor**. After lesson 06, the robot has a `Sensor` trait with `Result`-based error handling.

This is the final lesson. You will make the monitor concurrent: a sensor will poll on its own thread and send readings through a channel, which the main thread collects.

---

## Concept: Threads & Channels

### Threads

```rust
use std::thread;

let handle = thread::spawn(|| {
    println!("running on another thread");
});
handle.join().unwrap();   // wait for it to finish
```

Threads require `'static` lifetimes — use `Arc<Mutex<T>>` to share data safely:

```rust
use std::sync::{Arc, Mutex};

let shared = Arc::new(Mutex::new(0));
let clone = Arc::clone(&shared);

thread::spawn(move || {
    let mut val = clone.lock().unwrap();
    *val += 1;
});
```

### mpsc Channels (multi-producer, single-consumer)

```rust
use std::sync::mpsc;

let (tx, rx) = mpsc::channel();

thread::spawn(move || {
    tx.send(42).unwrap();
});

let val = rx.recv().unwrap();  // blocks until a value arrives
println!("{}", val);
```

---

## Your Task

Open `src/lib.rs`. It is blank — write it from scratch using the task description below.

1. Implement `poll_sensor(sensor, interval, tx, count)`:
   - Loop `count` times: call `sensor.read()`, send successful values on `tx`.
   - Sleep `interval` between reads.
   - Break if `tx.send()` returns `Err` (receiver dropped).

2. Implement `monitor_robot(r: Robot, n: usize) -> Vec<i32>`:
   - Wrap `r` in `Arc<Mutex<Robot>>` and build a `BatterySensor`.
   - Create an `mpsc` channel and spawn a thread running `poll_sensor`.
   - Collect `n` values from the receiver and return them.

## Run tests

```
cargo test
```

## Final program output (example)

```
Robot: R2D2 | Battery: 85% (healthy) | Charging: false
Sensor reading: 85
Sensor reading: 85
Sensor reading: 85
```

<!--
TEACHER NOTES (not shown to students in rendered markdown)

Comprehension checks (ask after tests pass — pick based on where the student struggled):
- "Why does BatterySensor wrap the Robot in Arc<Mutex<Robot>> instead of just holding a reference?"
- "What does mpsc stand for, and what does it tell you about how the channel can be used?"
- "What would happen if monitor_robot didn't join the spawned thread before returning?"

Mini-quiz (final lesson — cumulative review):
Q1 (recall): "Walk me through what monitor_robot does step by step — from creating the sensor to returning the readings."
Q2 (application): "How would you modify monitor_robot to poll two sensors concurrently and merge the readings?"
Q3 (break it): "What would happen if you dropped the tx (sender) inside poll_sensor before sending all readings?"
Spaced repetition: "The Sensor trait from lesson 06 required Send — why does that trait bound matter for threads?" (lesson 06 → 07 payoff)

Final wrap-up prompt (after quiz):
"Before you finish — describe the robot's full journey: what could it do in lesson 01, and what can it do now?
What's the single most Rust-specific thing you learned that you couldn't do the same way in another language?"
-->
