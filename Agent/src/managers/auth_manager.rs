use reqwest::Client;
use reqwest::header::{AUTHORIZATION, HeaderMap};
use singleton_manager::sm;
use crate::managers::config_manager::ConfigManager;
use crate::managers::connection_manager::ConnectionManager;
use crate::models::communication::register_call::RegisterCall;
use crate::models::communication::register_reply::AuthReply;

pub struct AuthManager {
    pub agent_id: String,
    pub access_token: String,
    pub authorized: bool,
}

impl AuthManager {
    pub fn init() -> AuthManager {
        let config_manger = sm().get::<ConfigManager>("config_manager")
            .expect("Failed to get config manager");

        return if config_manger.config.authorized {
            AuthManager { authorized: true, access_token: config_manger.config.access_token.clone(), agent_id: config_manger.config.agent_id.clone() }
        } else {
            AuthManager { authorized: false, access_token: "".to_string(), agent_id: "".to_string() }
        };
    }

    pub async fn register(&mut self, server_addr: String, name: String) {
        let conn_manager = sm().get::<ConnectionManager>("connection_manager")
            .expect("Failed to get auth manager");

        if !self.authorized {
            let response = conn_manager.client.post(format!("{}/api/auth/register", server_addr))
                .json(&RegisterCall { name })
                .send()
                .await
                .expect("Unable to create auth request");

            if response.status().is_success() {
                let reply = response.json::<AuthReply>()
                    .await
                    .expect("Unable to deserialize response");

                self.agent_id = reply.agent_id.unwrap();
                self.access_token = reply.access_token.unwrap();
            }
        } else {
            println!("This agent is already registered")
        }
    }

    pub fn get_authorization_header_content(&self) -> String {
        format!("Agent {} {}", self.agent_id, self.access_token).to_string()
    }

    pub fn get_client(&self) -> Client {
        let mut headers = HeaderMap::new();
        headers.insert(AUTHORIZATION, self.get_authorization_header_content().parse().unwrap());

        reqwest::ClientBuilder::new()
            .default_headers(headers)
            .build()
            .expect("Errors occurred while building request client")
    }
}
