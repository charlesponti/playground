use std::collections::HashMap;

trait Sensor {
    fn read(&self) -> Result<i32, String>;
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

struct BatterySensor<'a> {
    robot: &'a Robot,
}

impl<'a> Sensor for BatterySensor<'a> {
    fn read(&self) -> Result<i32, String> {
        if self.robot.battery < 0 || self.robot.battery > 100 {
            return Err(format!("battery level {} out of range", self.robot.battery));
        }
        Ok(self.robot.battery)
    }
}

fn read_sensor(sensor: &impl Sensor) -> Result<i32, String> {
    sensor.read()
}

fn main() {
    let mut r = Robot::new("R2D2");
    r.battery = 98;
    println!("{}", r.status());

    let s = BatterySensor { robot: &r };
    match read_sensor(&s) {
        Ok(val) => println!("Sensor reading: {}", val),
        Err(e) => println!("Error: {}", e),
    }

    r.battery = -1;
    let s2 = BatterySensor { robot: &r };
    match read_sensor(&s2) {
        Ok(val) => println!("Sensor reading: {}", val),
        Err(e) => println!("Error: {}", e),
    }
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
