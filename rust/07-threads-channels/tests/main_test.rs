use lesson_07_threads_channels::{Robot, BatterySensor, monitor_robot};
use std::sync::{Arc, Mutex};

#[test]
fn test_monitor_robot() {
    let mut r = Robot::new("R2D2");
    r.battery = 80;
    let readings = monitor_robot(r, 3);
    assert_eq!(readings.len(), 3);
    assert!(readings.iter().all(|&v| v == 80));
}

#[test]
fn test_battery_sensor_valid() {
    let r = Arc::new(Mutex::new(Robot::new("R2D2")));
    let s = BatterySensor { robot: Arc::clone(&r) };
    assert_eq!(s.read(), Ok(100));
}

#[test]
fn test_battery_sensor_invalid() {
    let r = Arc::new(Mutex::new(Robot::new("R2D2")));
    r.lock().unwrap().battery = -1;
    let s = BatterySensor { robot: Arc::clone(&r) };
    assert!(s.read().is_err());
}
