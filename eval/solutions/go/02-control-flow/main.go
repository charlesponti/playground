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

func main() {
	fmt.Printf("Robot: %s\n", RobotName)
	fmt.Printf("Battery: %d%%\n", BatteryLevel)
	fmt.Printf("Charging: %t\n", IsCharging)
	fmt.Printf("Health: %s\n", BatteryHealth(BatteryLevel))
}
