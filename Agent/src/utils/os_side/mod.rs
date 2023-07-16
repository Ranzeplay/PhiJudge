#[cxx::bridge]
pub mod windows_bridge {
    pub struct ProcessStartupConfiguration {
        pub name: String,
        pub params: String,
        pub memory_limit_bytes: u64,
        pub time_limit_milli: u64,
    }

    unsafe extern "C++" {
        include!("Agent/src/utils/os_side/windows_os.h");

        type ProcessStartupConfiguration;

        pub fn start_process_with_limits(conf: SharedPtr<ProcessStartupConfiguration>);
    }
}
