const ROBOT_NAME: &str = "R2D2";
const BATTERY_LEVEL: i32 = 98;
const IS_CHARGING: bool = false;

fn main() {
    println!("Robot: {}", ROBOT_NAME);
    println!("Battery: {}%", BATTERY_LEVEL);
    println!("Charging: {}", IS_CHARGING);
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
