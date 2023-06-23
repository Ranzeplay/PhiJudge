use std::io::Result;

fn main() -> Result<()> {
    tonic_build::compile_protos("../Server/Protos/Agent.proto")
        .expect("Failed to compile protos");

    Ok(())
}