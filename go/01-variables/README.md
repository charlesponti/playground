# Lesson 01: Variables & Types

## Context

You are building a **Robot Status Monitor** — a command-line program that tracks and reports a robot's state. Each lesson adds one new capability. By lesson 07, the robot will read sensors concurrently and report full status.

This is the first lesson. There is no prior code to carry over.

---

## Concept: Variables & Types

Go has three ways to declare variables:

```go
var name string = "R2D2"   // explicit type
var level = 98             // type inferred
level := 98                // short declaration (inside functions only)
```

Constants use `const` and cannot be changed:

```go
const MaxBattery = 100
```

**Zero values** — Go always initialises variables:
- `int` → `0`, `float64` → `0.0`, `bool` → `false`, `string` → `""`

**fmt.Printf format verbs**

| Verb | Meaning |
|------|---------|
| `%s` | string |
| `%d` | integer |
| `%t` | bool |
| `%%` | literal `%` |

---

## Your Task

Open `main.go`. It is blank — write it from scratch using the task description below.

1. Declare `RobotName` as a package-level `string` variable with value `"R2D2"`.
2. Declare `BatteryLevel` as a package-level `int` variable with value `98`.
3. Declare `IsCharging` as a package-level `bool` variable with value `false`.
4. In `main`, print the robot name with format `"Robot: R2D2\n"`.
5. In `main`, print the battery level with format `"Battery: 98%\n"`.
6. In `main`, print the charging status with format `"Charging: false\n"`.

## Run tests

```
go test
```

## Goal output

```
Robot: R2D2
Battery: 98%
Charging: false
```

<!--
TEACHER NOTES (not shown to students in rendered markdown)

Comprehension checks (ask after tests pass — pick the most relevant):
- "Why did we declare BatteryLevel and IsCharging at the package level instead of inside main?"
- "What would happen if you forgot the %% in the format string and just used %d?"
- "What is Go's zero value for int? For bool? Why does Go have zero values at all?"

Mini-quiz (run before student moves to lesson 02):
Q1 (recall): "Without looking — what are the three variables your robot has right now, and what are their types?"
Q2 (application): "If you added a variable for the robot's task count, what type would it be and what value would it start at?"
Q3 (break it): "What would happen if you tried to assign IsCharging = 1 instead of false?"
Spaced repetition: n/a — this is lesson 01.
-->
