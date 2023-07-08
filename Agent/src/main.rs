mod proto;
mod models;
mod managers;

use clap::Parser;
use singleton_manager::sm;
use crate::managers::auth_manager::AuthManager;
use crate::managers::config_manager::ConfigManager;
use crate::managers::connection_manager::ConnectionManager;
use crate::models::args::StartupArgs;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = StartupArgs::parse();

    sm().set("config_manager", ConfigManager::init("./config.yml"))
        .expect("Failed to register config manager");
    sm().set("connection_manager", ConnectionManager::init())
        .expect("Failed to register connection manager");
    sm().set("auth_manager", AuthManager::init())
        .expect("Failed to register auth manager");

    Ok(())
}
