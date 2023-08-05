use serde::{Deserialize, Serialize};
use crate::models::judge_point::JudgePoint;

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub struct TestProfile {
    pub id: u32,
    pub memory_limit_bytes: usize,
    pub time_limit_millis: usize,
}
