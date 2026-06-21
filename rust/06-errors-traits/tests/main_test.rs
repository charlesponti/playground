use lesson_06_errors_traits::{Robot, BatterySensor, Sensor, read_sensor};

#[test]
fn test_battery_sensor_valid() {
    let r = Robot::new("R2D2");
    let s = BatterySensor { robot: &r };
    assert_eq!(s.read(), Ok(100));
}

#[test]
fn test_battery_sensor_invalid_negative() {
    let mut r = Robot::new("R2D2");
    r.battery = -1;
    let s = BatterySensor { robot: &r };
    assert!(s.read().is_err());
}

#[test]
fn test_battery_sensor_invalid_over_100() {
    let mut r = Robot::new("R2D2");
    r.battery = 101;
    let s = BatterySensor { robot: &r };
    assert!(s.read().is_err());
}

#[test]
fn test_read_sensor() {
    let mut r = Robot::new("R2D2");
    r.battery = 80;
    let s = BatterySensor { robot: &r };
    assert_eq!(read_sensor(&s), Ok(80));
}
