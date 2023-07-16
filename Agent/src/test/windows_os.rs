use cxx::SharedPtr;
use crate::utils::os_side::windows_bridge::{ProcessStartupConfiguration, start_process_with_limits};

pub fn cxx_bridge() {
    let conf = ProcessStartupConfiguration {
        name: "cmd.exe".to_string(),
        params: "".to_string(),
        memory_limit_bytes: 1024,
        time_limit_milli: 1000,
    };

    start_process_with_limits(SharedPtr::new(conf));
}
