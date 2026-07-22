use lesson_01_variables::*;

#[test]
fn test_robot_name() {
    assert_eq!(ROBOT_NAME, "R2D2");
}

#[test]
fn test_battery_level() {
    assert_eq!(BATTERY_LEVEL, 98);
}

#[test]
fn test_is_charging() {
    assert_eq!(IS_CHARGING, false);
}
