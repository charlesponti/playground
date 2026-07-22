use lesson_02_control_flow::battery_health;

#[test]
fn test_critical() {
    assert_eq!(battery_health(0), "critical");
    assert_eq!(battery_health(20), "critical");
}

#[test]
fn test_low() {
    assert_eq!(battery_health(21), "low");
    assert_eq!(battery_health(50), "low");
}

#[test]
fn test_healthy() {
    assert_eq!(battery_health(51), "healthy");
    assert_eq!(battery_health(99), "healthy");
}

#[test]
fn test_full() {
    assert_eq!(battery_health(100), "full");
}
