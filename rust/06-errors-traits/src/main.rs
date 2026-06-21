use std::collections::HashMap;

/// Sensor is implemented by anything that can read a single integer value.
///
/// TODO: Define the Sensor trait with one method: read(&self) -> Result<i32, String>
trait Sensor {
    // TODO
}

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

/// BatterySensor reads the battery level from a Robot.
/// The lifetime `'a` ties the sensor to the robot it borrows.
struct BatterySensor<'a> {
    robot: &'a Robot,
}

/// TODO: Implement the Sensor trait for BatterySensor.
/// read() should:
///   - Return Err(...) if battery < 0 or battery > 100.
///   - Otherwise return Ok(battery).
impl<'a> Sensor for BatterySensor<'a> {
    // TODO
}

/// Calls sensor.read() and returns the result unchanged.
///
/// TODO: Implement read_sensor.
fn read_sensor(sensor: &impl Sensor) -> Result<i32, String> {
    // TODO
    Err("not implemented".to_string())
}

fn main() {
    let mut r = Robot::new("R2D2");
    r.battery = 98;
    println!("{}", r.status());

    // TODO: Create a BatterySensor for r
    // TODO: Call read_sensor and print the value
    // TODO: Set r.battery = -1, call read_sensor again, and print the error
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_battery_sensor_valid() {
        let r = Robot::new("R2D2");
        let s = BatterySensor { robot: &r };
        assert_eq!(s.read(), Ok(100));
    }

    #[test]
    fn test_battery_sensor_invalid_negative() {
        let mut r = Robot::new("R2D2");
        r.battery = -1;
        let s = BatterySensor { robot: &r };
        assert!(s.read().is_err());
    }

    #[test]
    fn test_battery_sensor_invalid_over_100() {
        let mut r = Robot::new("R2D2");
        r.battery = 101;
        let s = BatterySensor { robot: &r };
        assert!(s.read().is_err());
    }

    #[test]
    fn test_read_sensor() {
        let mut r = Robot::new("R2D2");
        r.battery = 80;
        let s = BatterySensor { robot: &r };
        assert_eq!(read_sensor(&s), Ok(80));
    }
}
