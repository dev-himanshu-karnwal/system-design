interface ILogger {
  log(message: string): void;
}

class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(`[Console]: ${message}`);
  }
}

class FileLogger implements ILogger {
  log(message: string): void {
    console.log(`[FileLogger]: ${message}`);
  }
}

interface IReportGenerator {
  generate(data: string[]): string;
}

class PdfReportGenerator implements IReportGenerator {
  generate(data: string[]): string {
    return `PDF Report: ${data.join(", ")}`;
  }
}

class ExcelReportGenerator implements IReportGenerator {
  generate(data: string[]): string {
    return `Excel Report: ${data.join(", ")}`;
  }
}

class CSVReportGenerator implements IReportGenerator {
  generate(data: string[]): string {
    return `CSV Report: ${data.join(", ")}`;
  }
}

class ReportService {
  constructor(
    private readonly generator: IReportGenerator,
    private readonly logger: ILogger
  ) {}

  generateAndLog(data: string[]) {
    const report = this.generator.generate(data);
    this.logger.log(`Report generated: ${report}`);
  }
}

// Client
const generator: IReportGenerator = new ExcelReportGenerator();
const logger: ILogger = new FileLogger();
const reportService = new ReportService(generator, logger);
reportService.generateAndLog(["User1", "User2"]);

export {};
