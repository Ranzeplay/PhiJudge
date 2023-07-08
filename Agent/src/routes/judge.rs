use warp::http::{Error, Response};
use crate::models::communication::judge_submit::JudgeSubmit;

pub(crate) fn submit(auth: String, model: JudgeSubmit) -> Result<impl warp::Reply, Error> {
    Response::builder()
        .body("Success")
}
