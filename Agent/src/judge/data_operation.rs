use singleton_manager::sm;
use crate::managers::auth_manager::AuthManager;
use crate::managers::config_manager::ConfigManager;
use crate::models::communication::record_data_reply::RecordDataReply;
use crate::models::communication::record_data_request::RecordDataRequest;
use crate::models::communication::test_point_data_reply::TestPointDataReply;

pub async fn get_record_data(record_id: u32) -> RecordDataReply {
    let config_manger = sm().get::<ConfigManager>("config_manager")
        .expect("Failed to get config manager");
    let auth_manger = sm().get::<AuthManager>("auth_manager")
        .expect("Failed to get auth manager");

    // Get full record
    let record_req_url = format!("{}/api/record/data?id={}", config_manger.config.server_address, record_id);
    let response = auth_manger.get_client()
        .get(record_req_url)
        .json(&RecordDataRequest { record_id })
        .send()
        .await
        .expect("Unable to get record data")
        .json::<RecordDataReply>()
        .await
        .expect("Unable to parse record data");

    return response;
}

pub async fn get_test_points_data(problem_id: u32) -> TestPointDataReply {
    let config_manger = sm().get::<ConfigManager>("config_manager")
        .expect("Failed to get config manager");
    let auth_manger = sm().get::<AuthManager>("auth_manager")
        .expect("Failed to get auth manager");

    // Get problem data
    let test_points_req_url = format!("{}/api/judge-data/points/{}", config_manger.config.server_address, problem_id);
    let response = auth_manger.get_client()
        .get(test_points_req_url)
        .send()
        .await
        .expect("Unable to get test point data")
        .json::<TestPointDataReply>()
        .await
        .expect("Unable to parse test point data");

    return response;
}

pub async fn get_test_script(problem_id: u32) -> String {
    let config_manger = sm().get::<ConfigManager>("config_manager")
        .expect("Failed to get config manager");
    let auth_manger = sm().get::<AuthManager>("auth_manager")
        .expect("Failed to get auth manager");

    // Get test script
    let test_points_req_url = format!("{}/api/judge-data/test-script/{}", config_manger.config.server_address, problem_id);
    let response = auth_manger.get_client()
        .get(test_points_req_url)
        .send()
        .await
        .expect("Unable to get test script")
        .text()
        .await
        .expect("Unable to parse test script");

    return response;
}
