#pragma once

#include <memory>
#include "phijudge-bridge/src/utils/os_side/mod.rs.h"
#include "rust/cxx.h"

void start_process_with_limits(std::shared_ptr <ProcessStartupConfiguration> conf);
