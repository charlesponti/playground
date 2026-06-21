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

Open `main.go`. Complete every line marked `// TODO`.

1. Declare `BatteryLevel` as a package-level `int` variable with value `98`.
2. Declare `IsCharging` as a package-level `bool` variable with value `false`.
3. In `main`, print the battery level with format `"Battery: 98%\n"`.
4. In `main`, print the charging status with format `"Charging: false\n"`.

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
