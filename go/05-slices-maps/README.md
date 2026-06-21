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

Open `main.go`. Complete every line marked `// TODO`.

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
