"use server";

import { PrismaClient } from "@prisma/client";
import { ProblemSubmissionSchema } from "./schema";
import { createSupabaseServerSideClient } from "@/lib/supabase/server";

export async function HandleSubmission(formData: FormData): Promise<number> {
  const data = await ProblemSubmissionSchema.parseAsync({
    languageId: formData.get("languageId") as string,
    code: formData.get("code") as string,
    enableOptimization: formData.get("enableOptimization") === "true",
    warningAsError: formData.get("warningAsError") === "true",
    problemId: parseInt(formData.get("problemId") as string),
  });

  const supabase = createSupabaseServerSideClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const prisma = new PrismaClient();
  await prisma.user.findUnique({
    where: {
      id: user!.id,
    },
  });

  const record = await prisma.record.create({
    data: {
      languageId: data.languageId,
      sourceCode: data.code,
      enableOptimization: data.enableOptimization,
      warningAsError: data.warningAsError,
      submitter: {
        connect: {
          id: user!.id,
        },
      },
      problem: {
        connect: {
          id: data.problemId,
        },
      },
    },
  });

  return record.id;
}
