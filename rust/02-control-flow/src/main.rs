const ROBOT_NAME: &str = "R2D2";
const BATTERY_LEVEL: i32 = 98;
const IS_CHARGING: bool = false;

/// Returns a human-readable battery health label.
///
/// Rules:
/// - level <= 20  → "critical"
/// - level <= 50  → "low"
/// - level < 100  → "healthy"
/// - level == 100 → "full"
///
/// TODO: Implement this function.
fn battery_health(level: i32) -> &'static str {
    // TODO
    ""
}

fn main() {
    println!("Robot: {}", ROBOT_NAME);
    println!("Battery: {}%", BATTERY_LEVEL);
    println!("Charging: {}", IS_CHARGING);
    // TODO: Print the result of battery_health(BATTERY_LEVEL) — format: "Health: healthy"
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
