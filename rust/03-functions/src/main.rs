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

/// Returns a formatted status string for the robot.
///
/// Format: "Robot: R2D2 | Battery: 98% (healthy) | Charging: false"
///
/// TODO: Implement this function using format! and battery_health.
fn report_status(name: &str, level: i32, charging: bool) -> String {
    // TODO
    String::new()
}

fn main() {
    // TODO: Replace the lines below with a single println! calling report_status.
    println!("Robot: {}", ROBOT_NAME);
    println!("Battery: {}%", BATTERY_LEVEL);
    println!("Charging: {}", IS_CHARGING);
    println!("Health: {}", battery_health(BATTERY_LEVEL));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_report_status_healthy() {
        assert_eq!(
            report_status("R2D2", 98, false),
            "Robot: R2D2 | Battery: 98% (healthy) | Charging: false"
        );
    }

    #[test]
    fn test_report_status_full_charging() {
        assert_eq!(
            report_status("R2D2", 100, true),
            "Robot: R2D2 | Battery: 100% (full) | Charging: true"
        );
    }

    #[test]
    fn test_report_status_critical() {
        assert_eq!(
            report_status("R2D2", 15, false),
            "Robot: R2D2 | Battery: 15% (critical) | Charging: false"
        );
    }

    #[test]
    fn test_report_status_low() {
        assert_eq!(
            report_status("R2D2", 40, false),
            "Robot: R2D2 | Battery: 40% (low) | Charging: false"
        );
    }
}
