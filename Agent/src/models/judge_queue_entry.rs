use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
pub struct JudgeQueueEntry {
    pub record_id: u32
}
