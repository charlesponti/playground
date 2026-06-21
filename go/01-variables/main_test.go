package main

import "testing"

func TestRobotName(t *testing.T) {
	if len(RobotName) == 0 {
		t.Errorf("RobotName must be defined")
	}
}

func TestBatteryLevel(t *testing.T) {
	if BatteryLevel != 98 {
		t.Errorf("got %d, want 98", BatteryLevel)
	}
}

func TestIsCharging(t *testing.T) {
	if IsCharging != false {
		t.Errorf("got %t, want false", IsCharging)
	}
}
