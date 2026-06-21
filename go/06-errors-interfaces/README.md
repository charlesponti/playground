# Lesson 06: Errors & Interfaces

## Context

You are building a **Robot Status Monitor**. After lesson 05, the robot has a task registry and battery history.

In this lesson you will define a `Sensor` interface and a `BatterySensor` implementation, and introduce proper error handling so invalid readings are caught before they corrupt state.

---

## Concept: Errors & Interfaces

### Interfaces

```go
type Stringer interface {
    String() string
}

// any type with a String() method satisfies Stringer
type Point struct{ X, Y int }
func (p Point) String() string { return fmt.Sprintf("(%d,%d)", p.X, p.Y) }
```

### Errors

```go
// returning an error
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}

// handling an error
result, err := divide(10, 0)
if err != nil {
    log.Fatal(err)
}
```

---

## Your Task

Open `main.go`. Complete every line marked `// TODO`.

1. Define the `Sensor` interface with a single method: `Read() (int, error)`.
2. Define `BatterySensor` as a struct holding a `*Robot`.
3. Implement `Read()` on `BatterySensor`:
   - Return an error if `Battery < 0` or `Battery > 100`.
   - Otherwise return the battery level and `nil`.
4. Implement `ReadSensor(s Sensor) (int, error)` — calls `s.Read()` and returns the result unchanged.

## Run tests

```
go test
```
