export class TimeLog {
  constructor(
    public startTime: string,
    public duration: number,
    public endTime: string,
    public fileName: string,
    public codeEditor: string,
    public osName: string,
    public projectName: string,
    public programmingLanguage: string
  ) {}
}
