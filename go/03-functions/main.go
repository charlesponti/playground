package main

import "fmt"

const RobotName = "R2D2"

var BatteryLevel = 98
var IsCharging = false

func BatteryHealth(level int) string {
	switch {
	case level <= 20:
		return "critical"
	case level <= 50:
		return "low"
	case level < 100:
		return "healthy"
	default:
		return "full"
	}
}

// ReportStatus returns a formatted status string for the robot.
//
// Output format:
//
//	"Robot: R2D2 | Battery: 98% (healthy) | Charging: false"
//
// TODO: Implement this function using fmt.Sprintf and BatteryHealth.
func ReportStatus(name string, level int, charging bool) string {
	// TODO
	return ""
}

func main() {
	// TODO: Replace the lines below with a single fmt.Println(ReportStatus(...))
	fmt.Printf("Robot: %s\n", RobotName)
	fmt.Printf("Battery: %d%%\n", BatteryLevel)
	fmt.Printf("Charging: %t\n", IsCharging)
	fmt.Printf("Health: %s\n", BatteryHealth(BatteryLevel))
}
