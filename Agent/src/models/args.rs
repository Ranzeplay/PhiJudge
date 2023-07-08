use clap::Parser;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct StartupArgs {
    #[arg(long = "authorize", short = 'a')]
    pub authorize_addr: Option<String>,
    #[arg(long = "name")]
    pub agent_name: Option<String>,

    #[arg(long = "unauthorize", short = 'u')]
    pub unauthorize: Option<bool>,

    #[arg(long = "start", short = 's')]
    pub start: Option<bool>,
}
