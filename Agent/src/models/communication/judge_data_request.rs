use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct JudgeDataRequest {
    pub record_id: u32
}
