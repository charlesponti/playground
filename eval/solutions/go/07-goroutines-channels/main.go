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

func PollSensor(s Sensor, interval time.Duration, ch chan<- int, done <-chan struct{}) {
	for {
		select {
		case <-done:
			return
		case <-time.After(interval):
			val, err := s.Read()
			if err == nil {
				ch <- val
			}
		}
	}
}

func MonitorRobot(r *Robot, n int) []int {
	s := BatterySensor{robot: r}
	ch := make(chan int, n)
	done := make(chan struct{})

	go PollSensor(s, 10*time.Millisecond, ch, done)

	readings := make([]int, 0, n)
	for len(readings) < n {
		readings = append(readings, <-ch)
	}
	close(done)
	return readings
}

func main() {
	r := NewRobot("R2D2")
	r.Battery = 85
	fmt.Println(r.Status())

	readings := MonitorRobot(r, 3)
	for _, v := range readings {
		fmt.Printf("Sensor reading: %d\n", v)
	}
}
