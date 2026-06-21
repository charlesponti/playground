package main

import (
	"fmt"
	"time"
)

type Sensor interface {
	Read() (int, error)
}

type Robot struct {
	Name       string
	Battery    int
	IsCharging bool
	Tasks      map[string]string
	History    []int
}

func NewRobot(name string) *Robot {
	return &Robot{
		Name:    name,
		Battery: 100,
		Tasks:   make(map[string]string),
	}
}

func (r *Robot) BatteryHealth() string {
	switch {
	case r.Battery <= 20:
		return "critical"
	case r.Battery <= 50:
		return "low"
	case r.Battery < 100:
		return "healthy"
	default:
		return "full"
	}
}

func (r *Robot) Status() string {
	return fmt.Sprintf("Robot: %s | Battery: %d%% (%s) | Charging: %t",
		r.Name, r.Battery, r.BatteryHealth(), r.IsCharging)
}

type BatterySensor struct{ robot *Robot }

func (s BatterySensor) Read() (int, error) {
	if s.robot.Battery < 0 || s.robot.Battery > 100 {
		return 0, fmt.Errorf("battery level %d out of range", s.robot.Battery)
	}
	return s.robot.Battery, nil
}

// PollSensor reads from s every interval and sends successful readings on ch.
// It stops when done is closed.
//
// TODO: Implement PollSensor.
// Hint: use a for loop with a select on time.After(interval) and done.
func PollSensor(s Sensor, interval time.Duration, ch chan<- int, done <-chan struct{}) {
	// TODO
}

// MonitorRobot collects n readings from the robot's battery sensor and returns them.
//
// TODO: Implement MonitorRobot:
//  1. Create a BatterySensor for r.
//  2. Make a buffered channel and a done channel.
//  3. Start PollSensor in a goroutine (use a short interval like 10ms).
//  4. Collect n values from the channel.
//  5. Close done and return the collected values.
func MonitorRobot(r *Robot, n int) []int {
	// TODO
	return nil
}

func main() {
	r := NewRobot("R2D2")
	r.Battery = 85
	fmt.Println(r.Status())

	// TODO: Call MonitorRobot(r, 3) and print each reading
}
