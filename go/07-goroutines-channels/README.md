# Lesson 07: Goroutines & Channels

## Context

You are building a **Robot Status Monitor**. After lesson 06, the robot has a `Sensor` interface with proper error handling.

This is the final lesson. You will make the monitor concurrent: sensors will poll on their own goroutines and send readings through a channel, which the main program collects.

---

## Concept: Goroutines & Channels

```go
// launch a goroutine
go func() {
    fmt.Println("running concurrently")
}()

// unbuffered channel — send blocks until receiver is ready
ch := make(chan int)
go func() { ch <- 42 }()
val := <-ch

// done pattern — signal goroutines to stop
done := make(chan struct{})
close(done)   // broadcast to all receivers

// select — wait on multiple channels
select {
case v := <-ch:
    fmt.Println(v)
case <-done:
    return
}
```

---

## Your Task

Open `main.go`. It is blank — write it from scratch using the task description below.

1. Implement `PollSensor(s Sensor, interval time.Duration, ch chan<- int, done <-chan struct{})`:
   - Every `interval`, call `s.Read()`.
   - If successful, send the value on `ch`.
   - Stop when `done` is closed.

2. Implement `MonitorRobot(r *Robot, n int) []int`:
   - Creates a `BatterySensor` for the robot.
   - Starts `PollSensor` in a goroutine.
   - Collects exactly `n` readings from the channel.
   - Closes `done` and returns the readings.

## Run tests

```
go test
```

## Final program output (example)

```
Robot: R2D2 | Battery: 85% (healthy) | Charging: false
Sensor reading: 85
Sensor reading: 85
Sensor reading: 85
```

<!--
TEACHER NOTES (not shown to students in rendered markdown)

Comprehension checks (ask after tests pass — pick based on where the student struggled):
- "What would happen if you used an unbuffered channel and PollSensor tried to send before MonitorRobot was ready to receive?"
- "Why does PollSensor take a done channel instead of a count — what does that design allow?"
- "What is the goroutine doing that main() cannot do at the same time without concurrency?"

Mini-quiz (final lesson — make it a cumulative review):
Q1 (recall): "Walk me through what happens when MonitorRobot(r, 3) is called — step by step."
Q2 (application): "How would you modify MonitorRobot to poll two different sensors concurrently?"
Q3 (break it): "What would happen if you forgot to close the done channel after collecting readings?"
Spaced repetition: "The Sensor interface made it possible to swap implementations — name one other sensor you could add without changing MonitorRobot." (lesson 06 → 07 payoff)

Final wrap-up prompt (after quiz):
"Before you finish — describe the robot's full journey: what could it do in lesson 01, and what can it do now? 
What was the single most surprising thing you learned?"
-->
