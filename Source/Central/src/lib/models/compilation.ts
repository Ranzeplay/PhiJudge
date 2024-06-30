export type CompilationResult = {
  recordId: number;
  type: CompilationResultType;
  output: string;
};

export enum CompilationResultType {
  PassedWithoutWarnings = "PassedWithoutWarnings",
  PassedWithWarnings = "PassedWithWarnings",
  FailedWithErrors = "FailedWithErrors",
  Unknown = "Unknown",
}
