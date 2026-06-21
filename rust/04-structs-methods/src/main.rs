/// TODO: Define a Robot struct with fields:
///   - name: String
///   - battery: i32
///   - is_charging: bool
// TODO: derive Debug so the struct can be printed with {:?}
struct Robot {
    // TODO
}

impl Robot {
    /// Constructs a Robot with the given name and battery set to 100.
    /// TODO: Implement new.
    fn new(name: &str) -> Robot {
        // TODO
        todo!()
    }

    /// Returns a human-readable battery health label.
    ///
    /// Rules: <= 20 → "critical", <= 50 → "low", < 100 → "healthy", 100 → "full"
    ///
    /// TODO: Implement battery_health.
    fn battery_health(&self) -> &'static str {
        // TODO
        ""
    }

    /// Returns the full status string.
    ///
    /// Format: "Robot: R2D2 | Battery: 98% (healthy) | Charging: false"
    ///
    /// TODO: Implement status.
    fn status(&self) -> String {
        // TODO
        String::new()
    }
}

fn main() {
    // TODO: Create a robot with Robot::new("R2D2")
    // TODO: Set battery to 98 and is_charging to false
    // TODO: Print the robot's status()
    println!("TODO: implement me");
}

#[cfg(test)]
mod tests {
    use super::*;

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
        r.battery = 10;
        assert_eq!(r.battery_health(), "critical");
        r.battery = 20;
        assert_eq!(r.battery_health(), "critical");
        r.battery = 30;
        assert_eq!(r.battery_health(), "low");
        r.battery = 50;
        assert_eq!(r.battery_health(), "low");
        r.battery = 75;
        assert_eq!(r.battery_health(), "healthy");
        r.battery = 99;
        assert_eq!(r.battery_health(), "healthy");
        r.battery = 100;
        assert_eq!(r.battery_health(), "full");
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
}
