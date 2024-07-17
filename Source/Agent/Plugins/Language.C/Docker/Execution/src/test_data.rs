use std::fs;

pub struct TestData {
    pub order: usize,
    pub input: String,
    pub output: String,
    pub mem_limit: usize,
    pub time_limit: usize,
}

pub fn get_test_point_last_index() -> usize {
    let mut count = 0;
    while fs::metadata(format!("/app/context/{}.in", count)).is_ok() {
        count += 1;
    }
    return count;
}

pub fn read_test_data(order: usize) -> TestData {
    let input_path = format!("/app/context/test_data/{}.in", order);
    let output_path = format!("/app/context/test_data/{}.out", order);
    let req_path = format!("/app/context/test_data/{}.req", order);

    let input = fs::read_to_string(input_path).expect("Failed to read input file");
    let output = fs::read_to_string(output_path).expect("Failed to read output file");
    let req = fs::read_to_string(req_path).expect("Failed to read req file");

    let req_split: Vec<&str> = req.split(" ").collect();
    let mem_limit = req_split[0].parse::<usize>().unwrap();
    let time_limit = req_split[1].parse::<usize>().unwrap();

    return TestData { order, input, output, mem_limit, time_limit };
}

pub fn copy_executable() {
    fs::copy("/app/context/target.o", "/app/target.o").expect("Failed to copy executable");
}
