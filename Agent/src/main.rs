mod proto;

use tonic::transport::{Certificate, Channel, ClientTlsConfig};
use crate::proto::agent::agent_connection_service_client::AgentConnectionServiceClient;
use crate::proto::agent::AgentConnectRequest;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cert = std::fs::read_to_string("ca.pem")?;

    let addr = Channel::from_static("https://localhost:7052")
        .tls_config(ClientTlsConfig::new()
            .ca_certificate(Certificate::from_pem(&cert)))?;

    let mut client = AgentConnectionServiceClient::connect(addr).await?;

    let request = tonic::Request::new(AgentConnectRequest{
        agent_id: "hello".to_string(),
        access_token: "hello".to_string(),
    });

    let response = client.agent_connect(request).await?;

    println!("{:?}", response);

    Ok(())
}
