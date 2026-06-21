# Lesson 02: Control Flow

## Context

You are building a **Robot Status Monitor**. After lesson 01, your program prints the robot's name, battery level, and charging status as raw values.

In this lesson you will add a `BatteryHealth` function that translates the raw battery integer into a human-readable health string.

---

## Concept: Control Flow

### if / else if / else

```go
if x > 10 {
    fmt.Println("big")
} else if x > 5 {
    fmt.Println("medium")
} else {
    fmt.Println("small")
}
```

### switch (expression-less form — cleanest for range checks)

```go
switch {
case x > 10:
    fmt.Println("big")
case x > 5:
    fmt.Println("medium")
default:
    fmt.Println("small")
}
```

---

## Your Task

Open `main.go`. Complete every line marked `// TODO`.

Implement `BatteryHealth(level int) string` using the following rules:

| Condition | Return |
|-----------|--------|
| `level <= 20` | `"critical"` |
| `level <= 50` | `"low"` |
| `level < 100` | `"healthy"` |
| `level == 100` | `"full"` |

Then in `main`, print the result of `BatteryHealth(BatteryLevel)`.

## Run tests

```
go test
```

## Goal output

```
Robot: R2D2
Battery: 98%
Charging: false
Health: healthy
```
