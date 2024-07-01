import { z } from 'zod';

export const ProblemSubmissionSchema = z.object({
  languageId: z.string({ required_error: 'Language required' }),
  code: z.string({ required_error: 'Code required' }),
  enableOptimization: z.boolean().default(false),
  warningAsError: z.boolean().default(false),
  problemId: z.number(),
});

export type ProblemSubmissionForm = z.infer<typeof ProblemSubmissionSchema>;
