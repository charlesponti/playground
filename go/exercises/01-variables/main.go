package main

import "fmt"

var robotName string = "Robo"

func main() {
	batteryLevel := 98
	isCharging := false

	batteryLevelStr := fmt.Sprint(batteryLevel, "%")
	fmt.Println(robotName, batteryLevel, isCharging)
	fmt.Printf("Robot %s has %s battery.", robotName, batteryLevelStr)
}
