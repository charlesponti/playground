const ROBOT_NAME: &str = "R2D2";
const BATTERY_LEVEL: i32 = 98;
const IS_CHARGING: bool = false;

fn battery_health(level: i32) -> &'static str {
    match level {
        i32::MIN..=20 => "critical",
        21..=50 => "low",
        51..=99 => "healthy",
        _ => "full",
    }
}

fn main() {
    println!("Robot: {}", ROBOT_NAME);
    println!("Battery: {}%", BATTERY_LEVEL);
    println!("Charging: {}", IS_CHARGING);
    println!("Health: {}", battery_health(BATTERY_LEVEL));
}

#[cfg(test)]
mod tests {
    use super::*;

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
}
