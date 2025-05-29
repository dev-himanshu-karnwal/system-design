interface ILogger {
  log(message: string): void;
}

class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(`[Console]: ${message}`);
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

interface IReportCustomizer {
  customize(data: string[]): string[];
}

class AdminReportCustomizer implements IReportCustomizer {
  customize(data: string[]): string[] {
    return data.map((d) => `[ADMIN] ${d}`);
  }
}

class UserReportCustomizer implements IReportCustomizer {
  customize(data: string[]): string[] {
    return data.map((d) => `[USER] ${d}`);
  }
}

interface INotifier {
  notify(recipient: string, report: string): void;
}

class EmailNotifier implements INotifier {
  notify(recipient: string, report: string): void {
    console.log(`Email sent to ${recipient} with report: ${report}`);
  }
}

class ReportContext {
  constructor(private strategy: IReportGenerator) {}

  setStrategy(strategy: IReportGenerator) {
    this.strategy = strategy;
  }

  generateReport(data: string[]): string {
    return this.strategy.generate(data);
  }
}

class ReportCustomizerFactory {
  static getCustomizer(role: "admin" | "user"): IReportCustomizer {
    if (role === "admin") return new AdminReportCustomizer();
    return new UserReportCustomizer();
  }
}

interface IReportSubscriber {
  update(report: string): void;
}

class LoggerSubscriber implements IReportSubscriber {
  update(report: string): void {
    console.log(`[Log Subscriber]: ${report}`);
  }
}

class EmailSubscriber implements IReportSubscriber {
  constructor(private email: string) {}

  update(report: string): void {
    console.log(`Email sent to ${this.email}: ${report}`);
  }
}

class ReportBroadcaster {
  private subscribers: IReportSubscriber[] = [];

  subscribe(sub: IReportSubscriber) {
    this.subscribers.push(sub);
  }

  unsubscribe(sub: IReportSubscriber) {
    this.subscribers = this.subscribers.filter((s) => s !== sub);
  }

  notify(report: string) {
    for (const sub of this.subscribers) {
      sub.update(report);
    }
  }
}

class ScheduledReportService {
  constructor(
    private generator: ReportContext,
    private customizer: IReportCustomizer,
    private broadcaster: ReportBroadcaster
  ) {}

  run(data: string[]) {
    const customized = this.customizer.customize(data);
    const report = this.generator.generateReport(customized);
    this.broadcaster.notify(report);
  }
}

//////////////////////////////////////////////////////////////////////

const generator = new ReportContext(new PdfReportGenerator());
const customizer = ReportCustomizerFactory.getCustomizer("admin");
const broadcaster = new ReportBroadcaster();

broadcaster.subscribe(new LoggerSubscriber());
broadcaster.subscribe(new EmailSubscriber("admin@company.com"));

const scheduledService = new ScheduledReportService(
  generator,
  customizer,
  broadcaster
);
scheduledService.run(["UserA", "UserB"]);

export {};
