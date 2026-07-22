package main

import "fmt"

type Robot struct {
	Name       string
	Battery    int
	IsCharging bool
}

func NewRobot(name string) *Robot {
	return &Robot{Name: name, Battery: 100}
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

func main() {
	r := NewRobot("R2D2")
	r.Battery = 98
	r.IsCharging = false
	fmt.Println(r.Status())
}
