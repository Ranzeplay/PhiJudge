use singleton_manager::sm;

use crate::managers::config_manager::ConfigManager;

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

    pub fn authorize(&self, server_addr: String) {
        if !self.authorized {

        }
    }
}
