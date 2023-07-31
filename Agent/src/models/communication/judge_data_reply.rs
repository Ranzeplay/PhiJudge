use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct JudgeDataReply {
    pub problem_id: u32,
    pub source_code: String,
    pub language_id: String,
}
