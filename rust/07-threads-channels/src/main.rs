use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use std::sync::mpsc;

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

/// Polls the sensor every `interval`, sending values on `tx`.
/// Stops when the channel is closed or after `count` successful reads.
///
/// TODO: Implement poll_sensor.
/// Hint: loop, call sensor.read(), send on tx with tx.send(val).
///       Break when tx.send() returns Err (receiver dropped) or after `count` sends.
fn poll_sensor(sensor: impl Sensor, interval: Duration, tx: mpsc::Sender<i32>, count: usize) {
    // TODO
}

/// Collects `n` sensor readings from the robot and returns them.
///
/// TODO: Implement monitor_robot:
///  1. Wrap `r` in Arc<Mutex<Robot>>.
///  2. Create a BatterySensor.
///  3. Create an mpsc channel.
///  4. Spawn a thread running poll_sensor (use a short interval like 10ms).
///  5. Collect n values from the receiver and return them.
fn monitor_robot(r: Robot, n: usize) -> Vec<i32> {
    // TODO
    vec![]
}

fn main() {
    let r = Robot::new("R2D2");
    println!("{}", r.status());

    // TODO: Call monitor_robot(r, 3) and print each reading
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
