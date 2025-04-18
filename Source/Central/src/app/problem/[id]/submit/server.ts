'use server';

import { ProblemSubmissionSchema } from './schema';
import { createSupabaseServerSideClient } from '@/lib/supabase/server';
import { serverPrisma } from '@/lib/serverSidePrisma';
import { AgentStatus } from '@prisma/client';

export async function HandleSubmission(formData: FormData): Promise<number> {
  const data = await ProblemSubmissionSchema.parseAsync({
    languageId: formData.get('languageId') as string,
    code: formData.get('code') as string,
    enableOptimization: formData.get('enableOptimization') === 'true',
    warningAsError: formData.get('warningAsError') === 'true',
    problemId: parseInt(formData.get('problemId') as string),
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

  const agents = await serverPrisma.agent.findMany({
    where: {
      status: AgentStatus.AVAILABLE,
      availableLanguageId: {
        hasEvery: [data.languageId],
      },
    },
  });
  const agent = agents[Math.floor(Math.random() * agents.length)];

  const record = await serverPrisma.record.create({
    data: {
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
      agent: {
        connect: {
          id: agent?.id,
        },
      },
      language: {
        connect: {
          id: data.languageId,
        },
      },
    },
  });

  await serverPrisma.problem.update({
    where: {
      id: data.problemId,
    },
    data: {
      totalSubmits: {
        increment: 1,
      },
    },
  });

  const channel = supabase.channel('phijudge.record.alloc');
  channel.subscribe(status => {
    if (status !== 'SUBSCRIBED') {
      return null;
    }

    channel.send({
      type: 'broadcast',
      event: 'centralBroadcast',
      payload: {
        recordId: record.id,
        agentId: agent?.id,
      },
    });

    channel.unsubscribe();
    channel.untrack();
  });

  return record.id;
}
