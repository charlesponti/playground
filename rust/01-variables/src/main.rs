const ROBOT_NAME: &str = "R2D2";

// TODO: Declare BATTERY_LEVEL as a constant of type i32 with value 98.

// TODO: Declare IS_CHARGING as a constant of type bool with value false.

fn main() {
    println!("Robot: {}", ROBOT_NAME);
    // TODO: Print battery level — format: "Battery: 98%"
    // TODO: Print charging status — format: "Charging: false"
}

#[cfg(test)]
mod tests {
    use super::*;

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
}
