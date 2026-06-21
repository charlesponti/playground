package main

import "fmt"

var robotName string = "Robo"
var robotTasks = map[string]string{
	"checkBattery": "inspect power level",
	"sendReminder": "notify the user",
	"cleanDesktop": "tidy the workspace",
}

func getBatteryStatus(batteryLevel int) string {
	if batteryLevel <= 50 {
		return "Battery is low."
	} else if batteryLevel < 100 {
		return "Battery is healthy."
	} else if batteryLevel == 100 {
		return "Battery is charged."
	} else {
		return "Battery level invalid."
	}
}

func getChargingStatus(isCharging bool) string {
	if isCharging {
		return "Charging: true"
	} else {
		return "Charging: false"
	}
}

func main() {
	batteryLevel := 98
	isCharging := false
	stages := []string{
		"Booting Systems...",
		"Checking sensors...",
		"Loading assistant mode...",
	}

	for _, stage := range stages {
		fmt.Println(stage)
	}

	fmt.Printf("Robot %s:\n", robotName)
	fmt.Println(getBatteryStatus(batteryLevel))
	fmt.Println(getChargingStatus(isCharging))

	fmt.Println(robotTasks["checkBattery"])
	robotTasks["searchWeb"] = "Search web for information."
	value, ok := robotTasks["boogie"]
	fmt.Println(value, ok)
}
