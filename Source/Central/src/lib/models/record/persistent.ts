export type RecordPersistentData = {
  problem: {
    id: number;
    title: string;
    author: string;
    authorId: string;
  };
  agentId: string;
  sourceCode: string;
  language: {
    id: string;
    name: string;
  };
  submitTime: Date;
};
