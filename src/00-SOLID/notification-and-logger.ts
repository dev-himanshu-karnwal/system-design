interface ILogger {
  log(message: string): void;
}

class ConsoleLogger implements ILogger {
  private static instance: ConsoleLogger;
  private constructor() {}

  log(message: string): void {
    console.log(`[Console log]: ${message}`);
  }

  static getInstance(): ILogger {
    if (!ConsoleLogger.instance) {
      ConsoleLogger.instance = new ConsoleLogger();
    }

    return ConsoleLogger.instance;
  }
}

interface INotification {
  send(message: string): void;
}

class EmailNotification implements INotification {
  send(message: string) {
    console.log(`Sending Email: ${message}`);
  }
}

class SMSNotification implements INotification {
  send(message: string) {
    console.log(`Sending SMS: ${message}`);
  }
}

class NotificationDispatcher {
  private static readonly dispatchers: Map<string, INotification> = new Map();
  private static instance: NotificationDispatcher;

  private constructor(private readonly logger: ILogger) {}

  static getInstance(logger: ILogger): NotificationDispatcher {
    if (!NotificationDispatcher.instance) {
      NotificationDispatcher.instance = new NotificationDispatcher(logger);
      NotificationDispatcher.initializeDispatchers();
    }

    return NotificationDispatcher.instance;
  }

  private static initializeDispatchers(): void {
    NotificationDispatcher.addDispatcher("email", new EmailNotification());
    NotificationDispatcher.addDispatcher("sms", new SMSNotification());
  }

  private static addDispatcher(type: string, dispatcher: INotification): void {
    NotificationDispatcher.dispatchers.set(type, dispatcher);
  }

  send(type: string, message: string) {
    const dispatcher = NotificationDispatcher.dispatchers.get(type);
    if (dispatcher) {
      dispatcher.send(message);
      this.logger.log("Notification sent successfully!");
    } else {
      return this.logger.log("Invalid notification type!");
    }
  }
}

const logger: ILogger = ConsoleLogger.getInstance();

const dispatcher = NotificationDispatcher.getInstance(logger);

dispatcher.send("email", "Hello!");
dispatcher.send("sms", "Hello!");

export {};
