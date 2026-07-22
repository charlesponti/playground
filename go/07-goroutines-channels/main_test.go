package main

import (
	"testing"
	"time"
)

func TestMonitorRobot(t *testing.T) {
	r := NewRobot("R2D2")
	r.Battery = 80

	readings := MonitorRobot(r, 3)
	if len(readings) != 3 {
		t.Fatalf("expected 3 readings, got %d", len(readings))
	}
	for _, v := range readings {
		if v != 80 {
			t.Errorf("expected reading 80, got %d", v)
		}
	}
}

func TestPollSensorStops(t *testing.T) {
	r := NewRobot("R2D2")
	r.Battery = 60

	ch := make(chan int, 10)
	done := make(chan struct{})
	s := BatterySensor{robot: r}

	go PollSensor(s, 10*time.Millisecond, ch, done)
	time.Sleep(35 * time.Millisecond)
	close(done)
	time.Sleep(15 * time.Millisecond)

	count := len(ch)
	if count < 2 || count > 5 {
		t.Errorf("expected 2–5 readings before stop, got %d", count)
	}
}
