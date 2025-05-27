interface NotificationStrategy {
  send(message: string): void;
}

class EmailStrategy implements NotificationStrategy {
  send(message: string): void {
    console.log(`Sending Email: ${message}`);
  }
}

class SMSStrategy implements NotificationStrategy {
  send(message: string): void {
    console.log(`Sending SMS: ${message}`);
  }
}

class Notifier {
  private strategy: NotificationStrategy;

  constructor(strategy: NotificationStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: NotificationStrategy): void {
    this.strategy = strategy;
  }

  notify(message: string): void {
    this.strategy.send(message);
  }
}

function Client() {
  const emailStrategy = new EmailStrategy();
  const smsStrategy = new SMSStrategy();

  const notifier = new Notifier(emailStrategy);

  notifier.notify("Hello!");
  notifier.setStrategy(smsStrategy);
  notifier.notify("Hello!");
}

Client();

export {};
