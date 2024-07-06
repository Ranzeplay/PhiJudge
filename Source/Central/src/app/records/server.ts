'use server';

import { serverPrisma } from '@/lib/serverSidePrisma';
import { RecordIndexView } from './schema';

export async function GetRecords(page: number, size: number) {
  const recordIndex = await serverPrisma.record.findMany({
    orderBy: { id: 'desc' },
    skip: (page - 1) * size,
    take: size,
    include: {
      problem: {
        select: {
          id: true,
          title: true,
        },
      },
      submitter: {
        select: {
          id: true,
          userName: true,
        },
      },
    },
  });

  const totalRecordCount = await serverPrisma.record.count();

  return {
	records: recordIndex,
	size: recordIndex.length,
	page: page,
	totalPages: Math.ceil(totalRecordCount / size),
  } as RecordIndexView;
}
