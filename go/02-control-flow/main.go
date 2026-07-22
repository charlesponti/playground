package main

import "fmt"

var RobotName string = "James"
var BatteryLevel int = 98
var IsCharging bool = false

func main() {
	fmt.Printf("%d%%", BatteryLevel)
	fmt.Printf("Charging: %t", IsCharging)
}
