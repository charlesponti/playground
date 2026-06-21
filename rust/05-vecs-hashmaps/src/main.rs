use std::collections::HashMap;

struct Robot {
    name: String,
    battery: i32,
    is_charging: bool,
    // TODO: Add a tasks field of type HashMap<String, String>
    // TODO: Add a history field of type Vec<i32>
}

impl Robot {
    fn new(name: &str) -> Robot {
        Robot {
            name: name.to_string(),
            battery: 100,
            is_charging: false,
            // TODO: Initialise tasks with HashMap::new()
            // TODO: Initialise history with Vec::new()
        }
    }

    fn battery_health(&self) -> &'static str {
        match self.battery {
            i32::MIN..=20 => "critical",
            21..=50 => "low",
            51..=99 => "healthy",
            _ => "full",
        }
    }

    fn status(&self) -> String {
        format!(
            "Robot: {} | Battery: {}% ({}) | Charging: {}",
            self.name, self.battery, self.battery_health(), self.is_charging
        )
    }

    /// Adds a task with the given name and description.
    /// TODO: Implement add_task.
    fn add_task(&mut self, name: &str, description: &str) {
        // TODO
    }

    /// Returns the description for the given task name, or None if it does not exist.
    /// TODO: Implement get_task.
    fn get_task(&self, name: &str) -> Option<&String> {
        // TODO
        None
    }

    /// Appends the current battery level to history.
    /// TODO: Implement record_battery.
    fn record_battery(&mut self) {
        // TODO
    }

    /// Returns the mean of all recorded battery levels, or 0.0 if history is empty.
    /// TODO: Implement average_battery.
    fn average_battery(&self) -> f64 {
        // TODO
        0.0
    }
}

fn main() {
    let mut r = Robot::new("R2D2");
    r.battery = 98;
    println!("{}", r.status());

    // TODO: Add tasks "scan" → "Scan surroundings" and "report" → "Report status"
    // TODO: Print the description of the "scan" task
    // TODO: Record the battery, change it, record again, change again, record once more
    // TODO: Print the average battery level
}

#[cfg(test)]
mod tests {
    use super::*;

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
        r.battery = 90;
        r.record_battery();
        r.battery = 80;
        r.record_battery();
        r.battery = 70;
        r.record_battery();
        assert_eq!(r.average_battery(), 80.0);
    }

    #[test]
    fn test_average_battery_empty() {
        let r = Robot::new("R2D2");
        assert_eq!(r.average_battery(), 0.0);
    }
}
