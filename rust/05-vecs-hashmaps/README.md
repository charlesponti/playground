# Lesson 05: Vecs & HashMaps

## Context

You are building a **Robot Status Monitor**. After lesson 04, the robot is a struct with a `status()` method.

In this lesson you will give the robot a **task registry** (`HashMap`) and a **battery history** (`Vec`), and implement methods to manage them.

---

## Concept: Vecs & HashMaps

### Vec (dynamic array)

```rust
let mut nums: Vec<i32> = Vec::new();
nums.push(1);
nums.push(2);
println!("{}", nums[0]);      // 1
println!("{}", nums.len());   // 2

let sum: i32 = nums.iter().sum();
```

### HashMap

```rust
use std::collections::HashMap;

let mut map: HashMap<String, String> = HashMap::new();
map.insert("key".to_string(), "value".to_string());

// get returns Option<&V>
if let Some(val) = map.get("key") {
    println!("{}", val);
}
```

**Ownership**: `insert` takes owned values. Use `.to_string()` to convert `&str` → `String`.

---

## Your Task

Open `src/lib.rs`. It contains your solution from the previous lesson (run `python3 eval/advance.py rust N` first if the file is empty). Add the new code described below.

Add to the `Robot` struct:
- `tasks: HashMap<String, String>`
- `history: Vec<i32>`

Initialise both in `new`.

Implement:
- `add_task(&mut self, name: &str, description: &str)` — inserts into `tasks`.
- `get_task(&self, name: &str) -> Option<&String>` — looks up by name.
- `record_battery(&mut self)` — pushes current `battery` onto `history`.
- `average_battery(&self) -> f64` — mean of `history`; returns `0.0` if empty.

## Run tests

```
cargo test
```

<!--
TEACHER NOTES (not shown to students in rendered markdown)

Comprehension checks (ask after tests pass — pick based on where the student struggled):
- "What does get_task return when the key doesn't exist — how does Option differ from Go's two-value return?"
- "Why does add_task take &str parameters but insert String values into the HashMap?"
- "What does .iter().sum::<i32>() do — what trait is required for sum to work?"

Mini-quiz (run before student moves to lesson 06):
Q1 (recall): "What does get_task return when the key exists? When it doesn't?"
Q2 (application): "How would you remove a task from the registry? What HashMap method would you call?"
Q3 (break it): "What would happen if you tried to call history.push() without having declared history as mut?"
Spaced repetition: "Why does new() return Robot (not &Robot or Box<Robot>)? What does Rust's ownership model say happens when new() returns?" (lesson 04)
-->
