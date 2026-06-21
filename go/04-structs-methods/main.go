package main

import "fmt"

// Robot holds the state of the robot monitor.
//
// TODO: Define the Robot struct with fields:
//   - Name       string
//   - Battery    int
//   - IsCharging bool
type Robot struct {
	// TODO
}

// NewRobot constructs a Robot with the given name and Battery set to 100.
//
// TODO: Implement NewRobot.
func NewRobot(name string) *Robot {
	// TODO
	return nil
}

// BatteryHealth returns a human-readable battery health label.
//
// Rules: <= 20 → "critical", <= 50 → "low", < 100 → "healthy", 100 → "full"
//
// TODO: Implement BatteryHealth as a method on *Robot.
func (r *Robot) BatteryHealth() string {
	// TODO
	return ""
}

// Status returns the full status string for the robot.
//
// Format: "Robot: R2D2 | Battery: 98% (healthy) | Charging: false"
//
// TODO: Implement Status as a method on *Robot.
func (r *Robot) Status() string {
	// TODO
	return ""
}

func main() {
	// TODO: Create a robot with NewRobot("R2D2")
	// TODO: Set Battery to 98 and IsCharging to false
	// TODO: Print the robot's Status()
	fmt.Println("TODO: implement me")
}
