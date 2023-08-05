use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct JudgePoint {
    pub index: usize,
    pub input: String,
    pub output: String
}
