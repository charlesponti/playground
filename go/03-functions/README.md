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

Open `main.go`. Complete every line marked `// TODO`.

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
