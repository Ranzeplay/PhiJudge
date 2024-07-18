use std::process::Command;

pub fn restrict_context() {
    println!("[DEBUG] Restricting context");
    Command::new("chmod")
        .arg("-R")
        .arg("700")
        .arg("/app/context/test_data")
        .spawn()
        .expect("Failed to restrict context");
}

pub fn release_context() {
    println!("[DEBUG] Releasing context");
    Command::new("chmod")
        .arg("-R")
        .arg("755")
        .arg("/app/context/test_data")
        .spawn()
        .expect("Failed to release context");
}
