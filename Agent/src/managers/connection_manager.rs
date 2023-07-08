use tonic::transport::{Certificate, Channel, ClientTlsConfig, Endpoint};

pub struct ConnectionManager {
    pub endpoint: Option<Endpoint>,
}

impl ConnectionManager {
    pub fn init() -> ConnectionManager {
        return ConnectionManager { endpoint: None };
    }

    pub fn connect(&mut self, server_addr: String) {
        let cert = std::fs::read_to_string("ca.pem")
            .expect("Failed to read CA certificate");

        let endpoint = Channel::from_static(server_addr.as_str())
            .tls_config(ClientTlsConfig::new()
                .ca_certificate(Certificate::from_pem(&cert)))
            .expect("Failed to connect to HTTPS RPC server");

        self.endpoint = Some(endpoint);
    }
}
