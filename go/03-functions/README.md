# Lesson 03: Functions

## Context

You are building a **Robot Status Monitor**. After lesson 02, your program prints raw values plus a battery health string. The printing logic lives scattered in `main`.

In this lesson you will extract that logic into a `ReportStatus` function that returns a single formatted string — making the output testable and reusable.

---

## Concept: Functions

```go
func add(x, y int) int {
    return x + y
}
```

Multiple return values (idiomatic for errors):

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}
```

`fmt.Sprintf` builds a string without printing it:

```go
s := fmt.Sprintf("Hello, %s!", name)
```

---

## Your Task

Open `main.go`. It contains your solution from the previous lesson (run `python3 eval/advance.py go N` first if the file is empty). Add the new code described below.

Implement `ReportStatus(name string, level int, charging bool) string` so that it returns:

```
Robot: R2D2 | Battery: 98% (healthy) | Charging: false
```

The health label comes from the existing `BatteryHealth` function.

Then in `main`, replace the individual print statements with a single call to `fmt.Println(ReportStatus(...))`.

## Run tests

```
go test
```

## Goal output

```
Robot: R2D2 | Battery: 98% (healthy) | Charging: false
```

<!--
TEACHER NOTES (not shown to students in rendered markdown)

Comprehension checks (ask after tests pass — pick based on where the student struggled):
- "Why does ReportStatus take name, level, and charging as parameters instead of reading the package-level variables directly?"
- "What does fmt.Sprintf do differently from fmt.Printf?"
- "If you called ReportStatus with level=100, what would the health label be and why?"

Mini-quiz (run before student moves to lesson 04):
Q1 (recall): "What does ReportStatus return — a value printed to the screen, or a string?"
Q2 (application): "If you wanted a short version that only showed the robot's name and battery, how would you write that function signature?"
Q3 (break it): "What would happen if you changed the return type to void (or removed the return type in Go)?"
Spaced repetition: "What health label does BatteryHealth return for level=20? For level=21?" (lesson 02 boundary condition)
-->
