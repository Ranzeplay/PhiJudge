use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub authorized: bool,
    pub access_token: String,
    pub agent_id: String,
    pub agent_port: u16,
}
