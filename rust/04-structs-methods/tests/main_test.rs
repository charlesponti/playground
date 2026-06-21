use lesson_04_structs_methods::Robot;

#[test]
fn test_new_robot() {
    let r = Robot::new("R2D2");
    assert_eq!(r.name, "R2D2");
    assert_eq!(r.battery, 100);
    assert_eq!(r.is_charging, false);
}

#[test]
fn test_battery_health() {
    let mut r = Robot::new("R2D2");
    r.battery = 10;  assert_eq!(r.battery_health(), "critical");
    r.battery = 20;  assert_eq!(r.battery_health(), "critical");
    r.battery = 30;  assert_eq!(r.battery_health(), "low");
    r.battery = 50;  assert_eq!(r.battery_health(), "low");
    r.battery = 75;  assert_eq!(r.battery_health(), "healthy");
    r.battery = 99;  assert_eq!(r.battery_health(), "healthy");
    r.battery = 100; assert_eq!(r.battery_health(), "full");
}

#[test]
fn test_status() {
    let mut r = Robot::new("R2D2");
    r.battery = 98;
    r.is_charging = false;
    assert_eq!(r.status(), "Robot: R2D2 | Battery: 98% (healthy) | Charging: false");
}

#[test]
fn test_status_charging() {
    let mut r = Robot::new("R2D2");
    r.battery = 100;
    r.is_charging = true;
    assert_eq!(r.status(), "Robot: R2D2 | Battery: 100% (full) | Charging: true");
}
