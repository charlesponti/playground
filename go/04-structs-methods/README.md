# Lesson 04: Structs & Methods

## Context

You are building a **Robot Status Monitor**. After lesson 03, the robot's state is held in separate package-level variables and passed around as function arguments.

In this lesson you will group the robot's state into a `Robot` struct and attach the logic as methods — so the robot carries its own behaviour.

---

## Concept: Structs & Methods

```go
type Point struct {
    X, Y float64
}

// method on *Point (pointer receiver — allows mutation)
func (p *Point) Scale(factor float64) {
    p.X *= factor
    p.Y *= factor
}

p := &Point{X: 3, Y: 4}
p.Scale(2)
```

Constructor convention (Go has no `new` keyword):

```go
func NewPoint(x, y float64) *Point {
    return &Point{X: x, Y: y}
}
```

---

## Your Task

Open `main.go`. It contains your solution from the previous lesson (run `python3 eval/advance.py go N` first if the file is empty). Add the new code described below.

1. Define a `Robot` struct with fields `Name string`, `Battery int`, `IsCharging bool`.
2. Implement `NewRobot(name string) *Robot` — returns a `*Robot` with the given name and `Battery` set to `100`.
3. Implement `(r *Robot) BatteryHealth() string` — same rules as lesson 02.
4. Implement `(r *Robot) Status() string` — returns `"Robot: R2D2 | Battery: 98% (healthy) | Charging: false"`.
5. In `main`, create a robot, set its battery and charging state, and print its status.

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
- "Why does BatteryHealth use a pointer receiver (*Robot) instead of a value receiver (Robot)?"
- "What does NewRobot give you that just writing &Robot{Name: "R2D2"} doesn't?"
- "Why does Status call r.BatteryHealth() instead of duplicating the switch logic?"

Mini-quiz (run before student moves to lesson 05):
Q1 (recall): "What fields does the Robot struct have right now?"
Q2 (application): "If you wanted to add a method that charges the robot to 100%, what would the signature look like?"
Q3 (break it): "What would happen if NewRobot returned a Robot value instead of a *Robot pointer?"
Spaced repetition: "What does ReportStatus from lesson 03 do that Status() now does instead? What did we gain by moving it to a method?" (lessons 03 → 04 evolution)
-->
