fn main() {
    cxx_build::bridge("src/utils/os_side/mod.rs")
        .file("src/utils/os_side/windows_os.cc")
        .flag_if_supported("-std=c++23")
        .compile("phijudge_agent_lang_bridge");
}