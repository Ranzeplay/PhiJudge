use warp::Filter;
use crate::models::communication::judge_submit::JudgeSubmit;
use crate::routes::judge;

pub async fn start_server() {
    // Configure judge route
    let judge_prefix = warp::path!("judge" / ..);
    let judge_submit = warp::post()
        .and(warp::path("submit"))
        .and(warp::path::end())
        .and(warp::header::<String>("Authorization"))
        .and(warp::body::json::<JudgeSubmit>())
        .map(judge::submit);

    let judge_routes = judge_prefix.and(judge_submit);

    let root_routes = judge_routes;
    warp::serve(root_routes)
        .bind(([127, 0, 0, 1], 37413))
        .await;
}
