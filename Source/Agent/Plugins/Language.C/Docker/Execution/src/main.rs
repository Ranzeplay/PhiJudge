use crate::context::{release_context, restrict_context};
use crate::test_data::{copy_executable, get_test_point_last_index};

mod test_data;
mod judge;
mod context;

fn main() {
    copy_executable();
    restrict_context();

    let test_point_count = get_test_point_last_index();
    for i in 0..test_point_count {
        judge::judge_with_test_data(i);
    }

    release_context();
}
