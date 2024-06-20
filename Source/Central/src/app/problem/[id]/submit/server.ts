"use server";

import { ProblemSubmissionSchema } from "./schema";
import { createSupabaseServerSideClient } from "@/lib/supabase/server";
import { serverPrisma } from "@/lib/serverSidePrisma";

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

  await serverPrisma.user.findUnique({
    where: {
      id: user!.id,
    },
  });

  const record = await serverPrisma.record.create({
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
