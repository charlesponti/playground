package main

import "fmt"

type Robot struct {
	name       string
	battery    int
	isCharging bool
	tasks      map[string]string
}

var robot = Robot{
	name:       "Robo",
	battery:    98,
	isCharging: false,
	tasks: map[string]string{
		"checkBattery": "inspect power level",
		"sendReminder": "notify the user",
		"cleanDesktop": "tidy the workspace",
	},
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
	stages := []string{
		"Booting Systems...",
		"Checking sensors...",
		"Loading assistant mode...",
	}

	for _, stage := range stages {
		fmt.Println(stage)
	}

	fmt.Printf("Robot %s:\n", robot.name)
	fmt.Println(getBatteryStatus(robot.battery))
	fmt.Println(getChargingStatus(robot.isCharging))

	fmt.Println("checkBattery:", robot.tasks["checkBattery"])
	robot.tasks["searchWeb"] = "Search web for information."
	value, ok := robot.tasks["findFile"]
	fmt.Println("Does 'findFile' exist:", value, ok)
}
