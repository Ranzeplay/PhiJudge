use std::io::{Read, Write};
use std::process::{Command, Stdio};

use crate::test_data::read_test_data;

pub fn judge_with_test_data(order: usize) -> anyhow::Result<()> {
    let test_data = read_test_data(order);

    println!("[DEBUG] order {}, mem {}, time {}", test_data.order, test_data.mem_limit, test_data.time_limit);

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
        .arg(format!("/app/profiling/{}.prof", order))
        .arg("/app/context/target.o")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("Failed to start testing process");

    if let Some(ref mut stdin) = child.stdin {
        stdin.write_all(test_data.input.as_bytes()).expect("Failed to write to stdin");
    }

    if let Some(ref mut out) = child.stdout.take() {
        out.read_to_string(&mut stdout)?;
        println!("[EXEC #{}] Got stdout {}", order, stdout);
    }
    if let Some(ref mut err) = child.stderr.take() {
        err.read_to_string(&mut stderr)?;
    }

    println!("[DEBUG] Starting test for order {}", order);
    
    std::thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_millis((test_data.time_limit + 1000) as u64));
        println!("[DEBUG] Timeout, killing process of order {}", order);
        
        let mut get_pid_process = Command::new("pgrep")
            .arg("/app/context/target.o")
            .stdout(Stdio::piped())
            .spawn()
            .expect("Failed to start get-pid process");
        
        let mut target_program_id = String::new();
        if let Some(mut out) = get_pid_process.stdout.take() {
            out.read_to_string(&mut target_program_id).expect("Failed to read pid");
        }
        
        let mut kill_proc = Command::new("/bin/kill")
            .arg("-9")
            .arg(target_program_id.trim())
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn()
            .expect("Failed to kill process");
        kill_proc.wait().expect("Failed to wait on kill process");
    });

    let child_status = child.wait().expect("Failed to wait on child");
    println!("[DEBUG] Execution ended for order {}", order);
    let elapsed_time = start_instant.elapsed().as_millis();
    // timeout_waiter.join().expect("Failed to join timeout waiter");

    println!("[DEBUG] Starting memory-fetch for order {}", order);
    let mut profiler = Command::new("/bin/sh")
        .arg("/app/get-mem.sh")
        .arg(order.to_string())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("Failed to start profiling process");
    let mut profiler_stdout = String::new();
    if let Some(mut out) = profiler.stdout.take() {
        out.read_to_string(&mut profiler_stdout)?;
        println!("[PROFILER] Output: {}", profiler_stdout);
    }
    profiler.wait().expect("Failed to wait on profiler");

    let mut result_status: String;
    if stdout == test_data.output {
        result_status = "AC".to_string();
    } else {
        result_status = "WA".to_string();
    }

    if !child_status.success() {
        result_status = "RE".to_string();
    }

    if elapsed_time > test_data.time_limit as u128 {
        result_status = "TLE".to_string();
    }

    let memory_consumption = profiler_stdout.trim().parse::<usize>().unwrap();
    if memory_consumption > test_data.mem_limit {
        result_status = "MLE".to_string();
    }

    println!("{} {} {} {}", order, elapsed_time, memory_consumption, result_status);

    Ok(())
}
