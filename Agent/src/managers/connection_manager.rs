use reqwest::Client;

pub struct ConnectionManager {
    pub client: Client
}

impl ConnectionManager {
    pub fn init() -> ConnectionManager {
        return ConnectionManager {
            client: Client::new()
        };
    }

    pub fn connect(&mut self, server_addr: String) {}
}
