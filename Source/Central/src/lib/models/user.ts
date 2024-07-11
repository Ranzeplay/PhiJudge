import { RecordStatus } from '@prisma/client';

export type UserView = {
  id: string;
  userName: string;
  email: string;
  isAdmin: boolean;
};

export type UserDataView = {
  profile: {
    id: string;
    userName: string;
    email: string;
    isAdmin: boolean;
    createAt: Date;
  };
  problemsCreated: {
    id: number;
    title: string;
  }[];
  submissions: {
    id: number;
    problem: {
      id: number;
      title: string;
    };
    submitTime: Date;
    status: RecordStatus;
  }[];
  statistics: {
    totalSubmissions: number;
    totalPassed: number;
  };
};
