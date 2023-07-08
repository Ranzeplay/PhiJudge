use clap::Parser;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct StartupArgs {
    #[arg(long = "register", short = 'r')]
    pub register: bool,
    #[arg(long = "addr", short = 'a')]
    pub authorize_addr: Option<String>,
    #[arg(long = "name", short = 'n')]
    pub agent_name: Option<String>,

    #[arg(long = "unauthorize", short = 'u')]
    pub unauthorize: bool,

    #[arg(long = "start", short = 's')]
    pub start: bool,
}
