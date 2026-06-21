package main

import "fmt"

type Robot struct {
	Name       string
	Battery    int
	IsCharging bool
	// TODO: Add a Tasks field of type map[string]string
	// TODO: Add a History field of type []int
}

func NewRobot(name string) *Robot {
	return &Robot{
		Name:    name,
		Battery: 100,
		// TODO: Initialise Tasks with make(map[string]string)
		// TODO: Initialise History with an empty []int slice
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

// AddTask registers a task with the given name and description.
// TODO: Implement AddTask.
func (r *Robot) AddTask(name, description string) {
	// TODO
}

// GetTask returns the description for the task with the given name,
// and a bool indicating whether the task exists.
// TODO: Implement GetTask.
func (r *Robot) GetTask(name string) (string, bool) {
	// TODO
	return "", false
}

// RecordBattery appends the current Battery level to History.
// TODO: Implement RecordBattery.
func (r *Robot) RecordBattery() {
	// TODO
}

// AverageBattery returns the mean of all recorded battery levels.
// Returns 0 if History is empty.
// TODO: Implement AverageBattery.
func (r *Robot) AverageBattery() float64 {
	// TODO
	return 0
}

func main() {
	r := NewRobot("R2D2")
	r.Battery = 98
	fmt.Println(r.Status())

	// TODO: Add tasks "scan" → "Scan surroundings" and "report" → "Report status"
	// TODO: Print the description of the "scan" task
	// TODO: Record the battery level, change it, record again, change again, record once more
	// TODO: Print the average battery level
}
