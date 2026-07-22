use lesson_03_functions::report_status;

#[test]
fn test_report_status_healthy() {
    assert_eq!(
        report_status("R2D2", 98, false),
        "Robot: R2D2 | Battery: 98% (healthy) | Charging: false"
    );
}

#[test]
fn test_report_status_full_charging() {
    assert_eq!(
        report_status("R2D2", 100, true),
        "Robot: R2D2 | Battery: 100% (full) | Charging: true"
    );
}

#[test]
fn test_report_status_critical() {
    assert_eq!(
        report_status("R2D2", 15, false),
        "Robot: R2D2 | Battery: 15% (critical) | Charging: false"
    );
}

#[test]
fn test_report_status_low() {
    assert_eq!(
        report_status("R2D2", 40, false),
        "Robot: R2D2 | Battery: 40% (low) | Charging: false"
    );
}
