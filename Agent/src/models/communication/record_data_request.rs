use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct RecordDataRequest {
    pub record_id: u32
}
