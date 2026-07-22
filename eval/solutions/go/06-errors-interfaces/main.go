package main

import (
	"fmt"
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

type BatterySensor struct {
	robot *Robot
}

func (s BatterySensor) Read() (int, error) {
	if s.robot.Battery < 0 || s.robot.Battery > 100 {
		return 0, fmt.Errorf("battery level %d out of range", s.robot.Battery)
	}
	return s.robot.Battery, nil
}

func ReadSensor(s Sensor) (int, error) {
	return s.Read()
}

func main() {
	r := NewRobot("R2D2")
	r.Battery = 98
	fmt.Println(r.Status())

	s := BatterySensor{robot: r}
	val, err := ReadSensor(s)
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Printf("Sensor reading: %d\n", val)
	}

	r.Battery = -1
	_, err = ReadSensor(s)
	fmt.Println("Error:", err)
}
