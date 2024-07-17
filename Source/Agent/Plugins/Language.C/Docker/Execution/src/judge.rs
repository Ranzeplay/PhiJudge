use std::io::{Read, Write};
use std::process::{Command, Stdio};
use crate::test_data::read_test_data;

pub fn judge_with_test_data(order: usize) {
    let test_data = read_test_data(order);

    let mut stdout = String::new();
    let mut stderr = String::new();

    let start_instant = std::time::Instant::now();

    let mut child = Command::new("/usr/bin/sudo")
        .arg("-u")
        .arg("judge")
        .arg("/bin/busybox")
        .arg("time")
        .arg("-v")
        .arg("-o")
        .arg(format!("/app/context/{}.prof", order))
        .arg("/app/target.o")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("Failed to start testing process");

    let child_id = child.id();
    let timeout_waiter = std::thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_millis((test_data.time_limit + 3000) as u64));
        let _ = Command::new("kill").arg(format!("{}", child_id)).spawn();
    });

    if let Some(mut stdin) = child.stdin {
        stdin.write_all(test_data.input.as_bytes()).expect("Failed to write to stdin");
    }

    if let Some(mut out) = child.stdout.take() {
        out.read_to_string(&mut stdout)?;
    }
    if let Some(mut err) = child.stderr.take() {
        err.read_to_string(&mut stderr)?;
    }

    let child_status = child.wait().expect("Failed to wait on child");
    _ = timeout_waiter.join();

    let mut profiler = Command::new("/bin/sh")
        .arg("-c")
        .arg("\"cat {profileFilePath} | grep \\\"Maximum resident set size\\\" | awk '{{print $6}}'\"")
        .spawn()
        .expect("Failed to start profiling process");
    let mut profiler_stdout = String::new();
    if let Some(mut out) = profiler.stdout.take() {
        out.read_to_string(&mut profiler_stdout)?;
    }
    profiler.wait().expect("Failed to wait on profiler");
    let memory_consumption = profiler_stdout.trim().parse::<usize>().unwrap();

    let mut result_status = String::new();

    if !child_status.success() {
        result_status = "RUNTIME_ERROR".to_string();
    }

    if stdout == test_data.output {
        result_status = "ACCEPTED".to_string();
    } else {
        result_status = "WRONG_ANSWER".to_string();
    }

    if memory_consumption > test_data.mem_limit {
        result_status = "MEMORY_LIMIT_EXCEEDED".to_string();
    }

    let elapsed_time = start_instant.elapsed().as_millis();
    if elapsed_time > test_data.time_limit as u128 {
        result_status = "TIME_LIMIT_EXCEEDED".to_string();
    }

    println!("{} {} {} {}", order, elapsed_time, memory_consumption, result_status);
}
