use clap::Parser;
use singleton_manager::sm;

use crate::managers::auth_manager::AuthManager;
use crate::managers::config_manager::ConfigManager;
use crate::managers::connection_manager::ConnectionManager;
use crate::models::args::StartupArgs;

mod models;
mod managers;
mod routes;


#[async_std::main]
async fn main() -> tide::Result<()> {
    let args = StartupArgs::parse();

    sm().set("config_manager", ConfigManager::init("./config.yml"))
        .expect("Failed to register config manager");
    sm().set("connection_manager", ConnectionManager::init())
        .expect("Failed to register connection manager");
    sm().set("auth_manager", AuthManager::init())
        .expect("Failed to register auth manager");

    if args.register {
        let auth_manager = sm().get::<AuthManager>("auth_manager")
            .expect("Failed to get auth manager");

        if args.agent_name.is_none() || args.authorize_addr.is_none() {
            eprintln!("You must provide server address and agent name at the same time");
            return Ok(())
        }

        auth_manager.register(args.authorize_addr.expect("Server address required"), args.agent_name.expect("Agent name required")).await;
    } else if args.start {
        let mut server = tide::new();
        server.at("judge/submit").post(routes::judge::submit);

        println!("Starting HTTP server");
        server.listen("127.0.0.1:37413").await?;
    }

    Ok(())
}
