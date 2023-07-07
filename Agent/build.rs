fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::compile_protos("../Server/Protos/Agent.proto")
        .expect("Failed to compile protos");

    Ok(())
}