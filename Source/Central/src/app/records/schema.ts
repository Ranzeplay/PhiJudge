import { RecordStatus } from '@prisma/client';

export type RecordIndexView = {
  records: {
    id: number;
    status: RecordStatus;
    problem: {
      id: number;
      title: string;
    };
    submitter: {
      id: string;
      userName: string;
    };
  }[];
  size: number;
  page: number;
  totalPages: number;
};
