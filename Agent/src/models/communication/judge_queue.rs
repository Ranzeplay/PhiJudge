use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct JudgeQueue {
    pub record_id: u32,
}
