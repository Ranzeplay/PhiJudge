use std::fs;
use std::fs::File;
use std::io::Write;

use crate::models::config::Config;

pub struct ConfigManager {
    pub path: String,
    pub config: Config,
}

impl ConfigManager {
    pub fn init(path: &str) -> ConfigManager {
        let content = fs::read_to_string(path);

        return if content.is_ok() {
            let config = serde_yaml::from_str::<Config>(content.unwrap().as_str())
                .expect("Failed to parse config file");

            ConfigManager { path: path.to_string(), config }
        } else {
            let mut file = File::create(path)
                .expect("Failed to create config file");

            let empty_config = Config { authorized: false, access_token: "".to_string(), agent_id: "".to_string() };
            let serialized_config = serde_yaml::to_string(&empty_config)
                .unwrap();

            write!(file, "{}", serialized_config).expect("Failed to write a new config file");

            ConfigManager { path: path.to_string(), config: empty_config }
        }
    }
}
