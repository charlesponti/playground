package main

import (
	"fmt"
)

// Sensor is implemented by anything that can read a single integer value.
//
// TODO: Define the Sensor interface with one method: Read() (int, error)
type Sensor interface {
	// TODO
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

func (r *Robot) AddTask(name, description string) { r.Tasks[name] = description }
func (r *Robot) GetTask(name string) (string, bool) {
	d, ok := r.Tasks[name]
	return d, ok
}
func (r *Robot) RecordBattery() { r.History = append(r.History, r.Battery) }
func (r *Robot) AverageBattery() float64 {
	if len(r.History) == 0 {
		return 0
	}
	sum := 0
	for _, v := range r.History {
		sum += v
	}
	return float64(sum) / float64(len(r.History))
}

// BatterySensor reads the battery level from a Robot.
//
// TODO: Define BatterySensor as a struct with a single field: robot *Robot
type BatterySensor struct {
	// TODO
}

// Read returns the robot's battery level, or an error if it is out of range [0, 100].
//
// TODO: Implement Read() (int, error) on BatterySensor.
func (s BatterySensor) Read() (int, error) {
	// TODO
	return 0, fmt.Errorf("not implemented")
}

// ReadSensor calls s.Read() and returns the result unchanged.
//
// TODO: Implement ReadSensor.
func ReadSensor(s Sensor) (int, error) {
	// TODO
	return 0, fmt.Errorf("not implemented")
}

func main() {
	r := NewRobot("R2D2")
	r.Battery = 98
	fmt.Println(r.Status())

	// TODO: Create a BatterySensor for r
	// TODO: Call ReadSensor and print the value
	// TODO: Set r.Battery = -1, call ReadSensor again, and print the error
}
