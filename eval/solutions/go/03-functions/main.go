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

func ReportStatus(name string, level int, charging bool) string {
	return fmt.Sprintf("Robot: %s | Battery: %d%% (%s) | Charging: %t",
		name, level, BatteryHealth(level), charging)
}

func main() {
	fmt.Println(ReportStatus(RobotName, BatteryLevel, IsCharging))
}
