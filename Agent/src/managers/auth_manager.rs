use singleton_manager::sm;

use crate::managers::config_manager::ConfigManager;
use crate::managers::connection_manager::ConnectionManager;
use crate::models::communication::register_call::RegisterCall;

pub struct AuthManager {
    pub access_token: String,
    pub authorized: bool,
}

impl AuthManager {
    pub fn init() -> AuthManager {
        let config_manger = sm().get::<ConfigManager>("config_manager")
            .expect("Failed to get config manager");

        return if config_manger.config.authorized {
            AuthManager { authorized: true, access_token: config_manger.config.access_token.clone() }
        } else {
            AuthManager { authorized: false, access_token: "".to_string() }
        }
    }

    pub async fn register(&self, server_addr: String, name: String) {
        let conn_manager = sm().get::<ConnectionManager>("connection_manager")
            .expect("Failed to get auth manager");

        if !self.authorized {
            let response = conn_manager.client.post(format!("{}/api/auth/register", server_addr))
                .json(&RegisterCall { name })
                .send()
                .await
                .expect("Unable to create auth request");

            if response.status().is_success() {

            }
        } else {
            println!("This agent is already registered")
        }
    }
}
