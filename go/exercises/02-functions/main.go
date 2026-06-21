package main

import "fmt"

var robotName string = "Robo"

func reportStatus(name string, batteryLevel int, isCharging bool) string {
	var chargingStr string
	batteryLevelStr := fmt.Sprint(batteryLevel, "%")

	if isCharging {
		chargingStr = "is"
	} else {
		chargingStr = "is not"
	}

	return fmt.Sprintf("Robot %s has %s battery and %s charging.", name, batteryLevelStr, chargingStr)
}

func main() {
	batteryLevel := 98
	isCharging := false

	fmt.Println(reportStatus(robotName, batteryLevel, isCharging))
}
