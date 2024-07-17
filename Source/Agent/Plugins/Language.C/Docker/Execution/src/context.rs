use std::process::Command;

pub fn restrict_context() {
    Command::new("chmod 700 /app/context/")
        .spawn()
        .expect("Failed to restrict context");
}

pub fn release_context() {
    Command::new("chmod 755 /app/context/")
        .spawn()
        .expect("Failed to release context");
}
