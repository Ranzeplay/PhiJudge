use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct JudgeSubmit {
    pub id: u32,
    pub source_code: String,
    pub language: String
}
