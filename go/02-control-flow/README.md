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

<!--
TEACHER NOTES (not shown to students in rendered markdown)

Comprehension checks (ask after tests pass — pick based on where the student struggled):
- "Why does the order of the cases matter? What would break if you put `level < 100` before `level <= 50`?"
- "What does the expression-less switch evaluate in each case — what is it actually checking?"
- "Why return a string instead of just printing inside BatteryHealth?"

Mini-quiz (run before student moves to lesson 03):
Q1 (recall): "What string does BatteryHealth return for a level of 50? For 51?"
Q2 (application): "Add a rule: level == 0 returns 'dead'. Where in the switch would you put it and why?"
Q3 (break it): "What would happen if you removed the default case from the switch?"
Spaced repetition: "What type is BatteryLevel, and what is Go's zero value for that type?" (lesson 01)
-->
