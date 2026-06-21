use std::collections::HashMap;

struct Robot {
    name: String,
    battery: i32,
    is_charging: bool,
    tasks: HashMap<String, String>,
    history: Vec<i32>,
}

impl Robot {
    fn new(name: &str) -> Robot {
        Robot {
            name: name.to_string(),
            battery: 100,
            is_charging: false,
            tasks: HashMap::new(),
            history: Vec::new(),
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

    fn add_task(&mut self, name: &str, description: &str) {
        self.tasks.insert(name.to_string(), description.to_string());
    }

    fn get_task(&self, name: &str) -> Option<&String> {
        self.tasks.get(name)
    }

    fn record_battery(&mut self) {
        self.history.push(self.battery);
    }

    fn average_battery(&self) -> f64 {
        if self.history.is_empty() {
            return 0.0;
        }
        self.history.iter().sum::<i32>() as f64 / self.history.len() as f64
    }
}

fn main() {
    let mut r = Robot::new("R2D2");
    r.battery = 98;
    println!("{}", r.status());

    r.add_task("scan", "Scan surroundings");
    r.add_task("report", "Report status");

    if let Some(desc) = r.get_task("scan") {
        println!("{}", desc);
    }

    r.record_battery();
    r.battery = 80;
    r.record_battery();
    r.battery = 60;
    r.record_battery();

    println!("Average battery: {:.1}%", r.average_battery());
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
