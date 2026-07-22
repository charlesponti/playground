use std::sync::{Arc, Mutex};
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

trait Sensor: Send {
    fn read(&self) -> Result<i32, String>;
}

#[derive(Clone)]
struct Robot {
    name: String,
    battery: i32,
    is_charging: bool,
}

impl Robot {
    fn new(name: &str) -> Robot {
        Robot {
            name: name.to_string(),
            battery: 100,
            is_charging: false,
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
}

struct BatterySensor {
    robot: Arc<Mutex<Robot>>,
}

impl Sensor for BatterySensor {
    fn read(&self) -> Result<i32, String> {
        let r = self.robot.lock().map_err(|e| e.to_string())?;
        if r.battery < 0 || r.battery > 100 {
            return Err(format!("battery level {} out of range", r.battery));
        }
        Ok(r.battery)
    }
}

fn poll_sensor(sensor: impl Sensor, interval: Duration, tx: mpsc::Sender<i32>, count: usize) {
    let mut sent = 0;
    while sent < count {
        thread::sleep(interval);
        if let Ok(val) = sensor.read() {
            if tx.send(val).is_err() {
                break;
            }
            sent += 1;
        }
    }
}

fn monitor_robot(r: Robot, n: usize) -> Vec<i32> {
    let shared = Arc::new(Mutex::new(r));
    let sensor = BatterySensor { robot: Arc::clone(&shared) };
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        poll_sensor(sensor, Duration::from_millis(10), tx, n);
    });

    rx.iter().take(n).collect()
}

fn main() {
    let mut r = Robot::new("R2D2");
    r.battery = 85;
    println!("{}", r.status());

    let readings = monitor_robot(r, 3);
    for v in &readings {
        println!("Sensor reading: {}", v);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_monitor_robot() {
        let mut r = Robot::new("R2D2");
        r.battery = 80;

        let readings = monitor_robot(r, 3);
        assert_eq!(readings.len(), 3);
        assert!(readings.iter().all(|&v| v == 80));
    }

    #[test]
    fn test_battery_sensor_valid() {
        let r = Arc::new(Mutex::new(Robot::new("R2D2")));
        let s = BatterySensor { robot: Arc::clone(&r) };
        assert_eq!(s.read(), Ok(100));
    }

    #[test]
    fn test_battery_sensor_invalid() {
        let r = Arc::new(Mutex::new(Robot::new("R2D2")));
        r.lock().unwrap().battery = -1;
        let s = BatterySensor { robot: Arc::clone(&r) };
        assert!(s.read().is_err());
    }
}
