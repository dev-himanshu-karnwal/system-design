class Logger {
  private static instance: Logger;

  // Private constructor prevents direct instantiation
  private constructor() {}

  // Static method to get the single instance
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  public log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

function Client() {
  const logger1 = Logger.getInstance();
  const logger2 = Logger.getInstance();

  logger1.log("Singleton works!");
  logger2.log("Still the same instance.");

  console.log(logger1 === logger2);
}

Client();
