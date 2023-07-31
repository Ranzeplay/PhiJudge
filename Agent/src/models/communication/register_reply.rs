use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AuthReply {
    pub success: bool,
    pub agent_id: Option<String>,
    pub access_token: Option<String>,
}
