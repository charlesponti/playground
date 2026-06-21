package main

import "testing"

func TestAddAndGetTask(t *testing.T) {
	r := NewRobot("R2D2")
	r.AddTask("scan", "Scan surroundings")

	desc, ok := r.GetTask("scan")
	if !ok {
		t.Fatal("expected task 'scan' to exist")
	}
	if desc != "Scan surroundings" {
		t.Errorf("got %q, want %q", desc, "Scan surroundings")
	}
}

func TestGetTaskMissing(t *testing.T) {
	r := NewRobot("R2D2")
	_, ok := r.GetTask("missing")
	if ok {
		t.Error("expected missing task to return false")
	}
}

func TestRecordAndAverageBattery(t *testing.T) {
	r := NewRobot("R2D2")
	r.Battery = 90
	r.RecordBattery()
	r.Battery = 80
	r.RecordBattery()
	r.Battery = 70
	r.RecordBattery()

	got := r.AverageBattery()
	if got != 80.0 {
		t.Errorf("AverageBattery() = %f, want 80.0", got)
	}
}

func TestAverageBatteryEmpty(t *testing.T) {
	r := NewRobot("R2D2")
	if got := r.AverageBattery(); got != 0 {
		t.Errorf("AverageBattery() with no history = %f, want 0", got)
	}
}
