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

Open `src/main.rs`. Complete every line marked `// TODO`.

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
