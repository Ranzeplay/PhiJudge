use tide::Request;

pub(crate) async fn submit(mut _req: Request<()>) -> tide::Result {
    Ok("It works!".into())
}
