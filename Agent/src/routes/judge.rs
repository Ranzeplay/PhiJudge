use std::convert::Infallible;
use singleton_manager::sm;
use warp::http::Response;
use crate::managers::auth_manager::AuthManager;
use crate::managers::config_manager::ConfigManager;
use crate::managers::judge_manager::JudgeManager;
use crate::models::communication::record_data_reply::RecordDataReply;
use crate::models::communication::record_data_request::RecordDataRequest;
use crate::models::judge_queue_entry::JudgeQueueEntry;

pub(crate) async fn queue(auth: String, model: JudgeQueueEntry) -> Result<impl warp::Reply, Infallible> {
    let config_manger = sm().get::<ConfigManager>("config_manager")
        .expect("Failed to get config manager");
    let auth_manger = sm().get::<AuthManager>("auth_manager")
        .expect("Failed to get auth manager");

    // Get full record
    let record_req_url = format!("{}/api/record/data?id={}", config_manger.config.server_address, model.record_id);
    let response = auth_manger.get_client()
        .get(record_req_url)
        .json(&RecordDataRequest { record_id: model.record_id })
        .send()
        .await
        .expect("Unable to get record data")
        .json::<RecordDataReply>()
        .await
        .expect("Unable to parse record data");

    let judge_manager = sm().get::<JudgeManager>("judge_manager")
        .expect("Failed to get judge manager");

    judge_manager.channel.0.send(model)
        .await
        .expect("Failed to add record entry to queue");
    
    Ok(Response::builder()
        .body("Success"))
}
