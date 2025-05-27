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

  static create(data: {
    startTime: string;
    duration: number;
    endTime: string;
    fileName: string;
    codeEditor: string;
    osName: string;
    projectName: string;
    programmingLanguage: string;
  }): TimeLog {
    return new TimeLog(
      data.startTime,
      data.duration,
      data.endTime,
      data.fileName,
      data.codeEditor,
      data.osName,
      data.projectName,
      data.programmingLanguage
    );
  }
}
