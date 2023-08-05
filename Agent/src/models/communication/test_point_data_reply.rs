use serde::{Deserialize, Serialize};
use crate::models::judge_point::JudgePoint;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TestPointDataReply {
    pub id: u32,
    pub memory_limit_bytes: usize,
    pub time_limit_millis: usize,
    pub judge_points: Vec<JudgePoint>
}
