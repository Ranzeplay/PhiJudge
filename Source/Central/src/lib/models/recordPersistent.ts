export type RecordPersistentData = {
  problem: {
    id: number;
    title: string;
    author: string;
    authorId: string;
  };
  agentId: string;
  sourceCode: string;
  language: string;
  submitTime: Date;
};
