use lesson_05_vecs_hashmaps::Robot;

#[test]
fn test_add_and_get_task() {
    let mut r = Robot::new("R2D2");
    r.add_task("scan", "Scan surroundings");
    assert_eq!(r.get_task("scan"), Some(&"Scan surroundings".to_string()));
}

#[test]
fn test_get_task_missing() {
    let r = Robot::new("R2D2");
    assert_eq!(r.get_task("missing"), None);
}

#[test]
fn test_record_and_average_battery() {
    let mut r = Robot::new("R2D2");
    r.battery = 90; r.record_battery();
    r.battery = 80; r.record_battery();
    r.battery = 70; r.record_battery();
    assert_eq!(r.average_battery(), 80.0);
}

#[test]
fn test_average_battery_empty() {
    let r = Robot::new("R2D2");
    assert_eq!(r.average_battery(), 0.0);
}
