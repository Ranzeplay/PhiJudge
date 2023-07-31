use singleton_manager::sm;
use warp::http::{Error, Response};
use crate::managers::auth_manager::AuthManager;
use crate::managers::config_manager::ConfigManager;
use crate::models::communication::judge_data_reply::JudgeDataReply;
use crate::models::communication::judge_data_request::JudgeDataRequest;
use crate::models::communication::judge_queue::JudgeQueue;

pub(crate) async fn queue(auth: String, model: JudgeQueue) -> Result<impl warp::Reply, Error> {
    let config_manger = sm().get::<ConfigManager>("config_manager")
        .expect("Failed to get config manager");
    let auth_manger = sm().get::<AuthManager>("auth_manager")
        .expect("Failed to get auth manager");

    // Get full record
    let record_req_url = format!("{}/api/record/data?id={}", config_manger.config.server_address, model.record_id);
    let response = auth_manger.get_client()
        .get(record_req_url)
        .json(&JudgeDataRequest{ record_id: model.record_id })
        .send()
        .await
        .expect("Unable to get record data")
        .json::<JudgeDataReply>()
        .await
        .expect("Unable to parse record data");
    
    Response::builder()
        .body("Success")
}
