use warp::Filter;
use crate::models::communication::judge_queue::JudgeQueue;
use crate::routes::judge;

pub async fn start_server() {
    // Configure judge route
    let judge_prefix = warp::path!("judge" / ..);
    let judge_submit = warp::post()
        .and(warp::path("queue"))
        .and(warp::path::end())
        .and(warp::header::<String>("Authorization"))
        .and(warp::body::json::<JudgeQueue>())
        .map(judge::queue);

    let judge_routes = judge_prefix.and(judge_submit);

    let api_routes = warp::path!("api" / ..)
        .and(judge_routes);
    warp::serve(api_routes)
        .bind(([127, 0, 0, 1], 37413))
        .await;
}
