package main

import "testing"

func TestBatteryHealth(t *testing.T) {
	tests := []struct {
		level int
		want  string
	}{
		{0, "critical"},
		{20, "critical"},
		{21, "low"},
		{50, "low"},
		{51, "healthy"},
		{99, "healthy"},
		{100, "full"},
	}
	for _, tc := range tests {
		got := BatteryHealth(tc.level)
		if got != tc.want {
			t.Errorf("BatteryHealth(%d) = %q, want %q", tc.level, got, tc.want)
		}
	}
}
