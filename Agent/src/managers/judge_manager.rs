use std::thread::spawn;

use tokio::sync::mpsc;
use tokio::sync::mpsc::{Receiver, Sender};

use crate::judge::data_operation::{get_record_data, get_test_points_data, get_test_script};
use crate::judge::judge_single::judge_single_point;
use crate::models::judge_queue_entry::JudgeQueueEntry;
use crate::models::test_profile::TestProfile;

#[derive(Debug)]
pub struct JudgeManager {
    pub max_parallel_jobs: usize,
    pub channel: (Sender<JudgeQueueEntry>, Receiver<JudgeQueueEntry>),
}

impl JudgeManager {
    pub fn init() -> JudgeManager {
        let channel = mpsc::channel::<JudgeQueueEntry>(512);

        JudgeManager {
            max_parallel_jobs: 4,
            channel,
        }
    }

    pub async fn begin_judge_queue(&mut self) {
        while let Some(entry) = self.channel.1.recv().await {
            JudgeManager::run_job(entry).await;
        }
    }

    pub fn stop_judge_queue(&mut self) {
        self.channel.1.close()
    }

    pub async fn run_job(submit: JudgeQueueEntry) {
        let record = get_record_data(submit.record_id).await;
        let test_script = get_test_script(record.problem_id).await;
        let test_data = get_test_points_data(record.problem_id).await;
        let profile = TestProfile {
            id: test_data.id,
            memory_limit_bytes: test_data.memory_limit_bytes,
            time_limit_millis: test_data.time_limit_millis,
        };

        for entry in test_data.judge_points {
            let script = test_script.clone();
            spawn(move || {
                judge_single_point(profile, entry, script);
            });
        }
    }
}
