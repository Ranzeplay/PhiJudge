import { z } from 'zod';

export enum TestDataModification {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export const ProblemTestDataSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  timeLimitMs: z
    .string({ required_error: 'Time limit required' })
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Expected number, received a string',
    }),
  memoryLimitBytes: z
    .string({ required_error: 'Memory limit required' })
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Expected number, received a string',
    }),
  order: z.number({ required_error: 'Order required' }).default(-1),
  modificationType: z.nativeEnum(TestDataModification),
  problemId: z.number({ required_error: 'Problem ref required' }),
  existingId: z.number().optional(),
});

export const ProblemTestDataSeriesSchema = z.object({
  data: z.array(ProblemTestDataSchema),
});

export const ProblemCreationSchema = z.object({
  title: z.string({ required_error: 'Title required' }),
  description: z.string({ required_error: 'Description required' }),
});

export type ProblemCreation = z.infer<typeof ProblemCreationSchema>;

export type ProblemTestData = z.infer<typeof ProblemTestDataSchema>;

export type ProblemTestDataSeries = z.infer<typeof ProblemTestDataSeriesSchema>;
