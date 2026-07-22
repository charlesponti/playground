# Lesson 05: Slices & Maps

## Context

You are building a **Robot Status Monitor**. After lesson 04, the robot is a struct with a `Status()` method.

In this lesson you will give the robot a **task registry** (map) and a **battery history** (slice), and implement methods to manage them.

---

## Concept: Slices & Maps

### Slices

```go
nums := []int{1, 2, 3}
nums = append(nums, 4)
fmt.Println(nums[0])       // 1
fmt.Println(len(nums))     // 4
```

### Maps

```go
m := make(map[string]string)
m["key"] = "value"
val, ok := m["key"]   // ok is false if key missing
delete(m, "key")
```

---

## Your Task

Open `main.go`. It contains your solution from the previous lesson (run `python3 eval/advance.py go N` first if the file is empty). Add the new code described below.

Add to the `Robot` struct:
- `Tasks   map[string]string`
- `History []int`

Initialise both in `NewRobot`.

Implement:
- `AddTask(name, description string)` — adds an entry to `Tasks`.
- `GetTask(name string) (string, bool)` — looks up a task by name.
- `RecordBattery()` — appends the current `Battery` value to `History`.
- `AverageBattery() float64` — returns the mean of `History`; returns `0` if empty.

## Run tests

```
go test
```

<!--
TEACHER NOTES (not shown to students in rendered markdown)

Comprehension checks (ask after tests pass — pick based on where the student struggled):
- "What does GetTask return when the key doesn't exist? Why does Go return two values here instead of just the string?"
- "Why does AverageBattery return 0 for an empty History, and what type does it return?"
- "What's the difference between make(map[string]string) and map[string]string{}?"

Mini-quiz (run before student moves to lesson 06):
Q1 (recall): "If you call GetTask with a key that doesn't exist, what are the two values you get back?"
Q2 (application): "How would you remove a task from the registry? What Go built-in would you use?"
Q3 (break it): "What would happen if RecordBattery used History = append(History, r.Battery) (without r.) ?"
Spaced repetition: "Why does the Robot use pointer receivers — what would break if you changed RecordBattery to a value receiver?" (lesson 04)
-->
