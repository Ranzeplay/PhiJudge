use crate::context::{create_profiling_store, release_context, restrict_context};
use crate::test_data::get_test_point_last_index;

mod test_data;
mod judge;
mod context;

fn main() -> anyhow::Result<()> {
    println!("[DEBUG] Beginning execution");
    restrict_context();
    create_profiling_store();
    println!("[DEBUG] Environment prepared");

    let test_point_count = get_test_point_last_index();
    for i in 0..test_point_count {
        judge::judge_with_test_data(i)?;
    }

    release_context();

    Ok(())
}
