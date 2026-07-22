package main

import "fmt"

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
		History: []int{},
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

func (r *Robot) AddTask(name, description string) {
	r.Tasks[name] = description
}

func (r *Robot) GetTask(name string) (string, bool) {
	d, ok := r.Tasks[name]
	return d, ok
}

func (r *Robot) RecordBattery() {
	r.History = append(r.History, r.Battery)
}

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

func main() {
	r := NewRobot("R2D2")
	r.Battery = 98
	fmt.Println(r.Status())

	r.AddTask("scan", "Scan surroundings")
	r.AddTask("report", "Report status")

	if desc, ok := r.GetTask("scan"); ok {
		fmt.Println(desc)
	}

	r.RecordBattery()
	r.Battery = 80
	r.RecordBattery()
	r.Battery = 60
	r.RecordBattery()

	fmt.Printf("Average battery: %.1f%%\n", r.AverageBattery())
}
