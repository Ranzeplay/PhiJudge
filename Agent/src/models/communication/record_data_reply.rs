use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct RecordDataReply {
    pub problem_id: u32,
    pub source_code: String,
    pub language_id: String,
}
