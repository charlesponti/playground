package main

import "testing"

func TestBatterySensorValid(t *testing.T) {
	r := NewRobot("R2D2")
	r.Battery = 75
	s := BatterySensor{robot: r}
	val, err := s.Read()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if val != 75 {
		t.Errorf("got %d, want 75", val)
	}
}

func TestBatterySensorInvalidNegative(t *testing.T) {
	r := NewRobot("R2D2")
	r.Battery = -1
	s := BatterySensor{robot: r}
	_, err := s.Read()
	if err == nil {
		t.Error("expected error for battery -1, got nil")
	}
}

func TestBatterySensorInvalidOver100(t *testing.T) {
	r := NewRobot("R2D2")
	r.Battery = 101
	s := BatterySensor{robot: r}
	_, err := s.Read()
	if err == nil {
		t.Error("expected error for battery 101, got nil")
	}
}

func TestReadSensor(t *testing.T) {
	r := NewRobot("R2D2")
	r.Battery = 80
	s := BatterySensor{robot: r}
	val, err := ReadSensor(s)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if val != 80 {
		t.Errorf("got %d, want 80", val)
	}
}

func TestSensorInterface(t *testing.T) {
	r := NewRobot("R2D2")
	r.Battery = 50
	var _ Sensor = BatterySensor{robot: r}
}
