package main

import "fmt"

const RobotName = "R2D2"

var BatteryLevel int = 98

var IsCharging bool = false

func main() {
	fmt.Printf("Robot: %s\n", RobotName)
	fmt.Printf("Battery: %d%%\n", BatteryLevel)
	fmt.Printf("Charging: %t\n", IsCharging)
}
