package main

import "testing"

func TestNewRobot(t *testing.T) {
	r := NewRobot("R2D2")
	if r == nil {
		t.Fatal("NewRobot returned nil")
	}
	if r.Name != "R2D2" {
		t.Errorf("Name = %q, want %q", r.Name, "R2D2")
	}
	if r.Battery != 100 {
		t.Errorf("Battery = %d, want 100", r.Battery)
	}
}

func TestBatteryHealth(t *testing.T) {
	r := &Robot{Name: "R2D2"}
	cases := []struct {
		level int
		want  string
	}{
		{10, "critical"},
		{20, "critical"},
		{30, "low"},
		{50, "low"},
		{75, "healthy"},
		{99, "healthy"},
		{100, "full"},
	}
	for _, c := range cases {
		r.Battery = c.level
		if got := r.BatteryHealth(); got != c.want {
			t.Errorf("BatteryHealth() at %d%% = %q, want %q", c.level, got, c.want)
		}
	}
}

func TestStatus(t *testing.T) {
	r := &Robot{Name: "R2D2", Battery: 98, IsCharging: false}
	want := "Robot: R2D2 | Battery: 98% (healthy) | Charging: false"
	if got := r.Status(); got != want {
		t.Errorf("Status()\n got  %q\n want %q", got, want)
	}
}

func TestStatusCharging(t *testing.T) {
	r := &Robot{Name: "R2D2", Battery: 100, IsCharging: true}
	want := "Robot: R2D2 | Battery: 100% (full) | Charging: true"
	if got := r.Status(); got != want {
		t.Errorf("Status()\n got  %q\n want %q", got, want)
	}
}
