package main

import "testing"

func TestReportStatus(t *testing.T) {
	tests := []struct {
		name     string
		level    int
		charging bool
		want     string
	}{
		{"R2D2", 98, false, "Robot: R2D2 | Battery: 98% (healthy) | Charging: false"},
		{"R2D2", 100, true, "Robot: R2D2 | Battery: 100% (full) | Charging: true"},
		{"R2D2", 15, false, "Robot: R2D2 | Battery: 15% (critical) | Charging: false"},
		{"R2D2", 40, false, "Robot: R2D2 | Battery: 40% (low) | Charging: false"},
	}
	for _, tc := range tests {
		got := ReportStatus(tc.name, tc.level, tc.charging)
		if got != tc.want {
			t.Errorf("ReportStatus(%q, %d, %t)\n got  %q\n want %q", tc.name, tc.level, tc.charging, got, tc.want)
		}
	}
}
