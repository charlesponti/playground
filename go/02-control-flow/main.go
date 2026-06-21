package main

import "fmt"

const RobotName = "R2D2"

var BatteryLevel = 98
var IsCharging = false

// BatteryHealth returns a human-readable description of the battery level.
//
// Rules:
//   - level <= 20  → "critical"
//   - level <= 50  → "low"
//   - level < 100  → "healthy"
//   - level == 100 → "full"
//
// TODO: Implement this function.
func BatteryHealth(level int) string {
	// TODO
	return ""
}

func main() {
	fmt.Printf("Robot: %s\n", RobotName)
	fmt.Printf("Battery: %d%%\n", BatteryLevel)
	fmt.Printf("Charging: %t\n", IsCharging)
	// TODO: Print the result of BatteryHealth(BatteryLevel) — format: "Health: healthy\n"
}
