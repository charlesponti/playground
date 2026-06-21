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

Open `main.go`. Complete every line marked `// TODO`.

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
