import { problem } from '@prisma/client';

export type ProblemIndexView = {
  problems: problem[];
  size: number;
  page: number;
  totalPages: number;
};
