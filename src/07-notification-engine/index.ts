// ============================
//       Notification & Decorators
// ============================

interface INotification {
  getContent(): string;
}

class SimpleNotification implements INotification {
  private text: string;

  constructor(msg: string) {
    this.text = msg;
  }

  getContent(): string {
    return this.text;
  }
}

abstract class NotificationDecorator implements INotification {
  protected notification: INotification;

  constructor(notification: INotification) {
    this.notification = notification;
  }

  abstract getContent(): string;
}

class TimestampDecorator extends NotificationDecorator {
  getContent(): string {
    return `[2025-04-13 14:22:00] ${this.notification.getContent()}`;
  }
}

class SignatureDecorator extends NotificationDecorator {
  private signature: string;

  constructor(notification: INotification, signature: string) {
    super(notification);
    this.signature = signature;
  }

  getContent(): string {
    return `${this.notification.getContent()}\n-- ${this.signature}\n\n`;
  }
}

// ============================
//     Observer Pattern
// ============================

interface IObserver {
  update(): void;
}

interface IObservable {
  addObserver(observer: IObserver): void;
  removeObserver(observer: IObserver): void;
  notifyObservers(): void;
}

class NotificationObservable implements IObservable {
  private observers: IObserver[] = [];
  private currentNotification: INotification | null = null;

  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: IObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notifyObservers(): void {
    this.observers.forEach((observer) => observer.update());
  }

  setNotification(notification: INotification): void {
    this.currentNotification = notification;
    this.notifyObservers();
  }

  getNotification(): INotification | null {
    return this.currentNotification;
  }

  getNotificationContent(): string {
    return this.currentNotification?.getContent() ?? "";
  }
}

class Logger implements IObserver {
  private notificationObservable: NotificationObservable;

  constructor() {
    this.notificationObservable =
      NotificationService.getInstance().getObservable();
    this.notificationObservable.addObserver(this);
  }

  update(): void {
    console.log(
      "Logging New Notification:\n" +
        this.notificationObservable.getNotificationContent()
    );
  }
}

// ============================
//     Strategy Pattern
// ============================

interface INotificationStrategy {
  sendNotification(content: string): void;
}

class EmailStrategy implements INotificationStrategy {
  constructor(private emailId: string) {}

  sendNotification(content: string): void {
    console.log(`Sending Email Notification to: ${this.emailId}\n${content}`);
  }
}

class SMSStrategy implements INotificationStrategy {
  constructor(private mobileNumber: string) {}

  sendNotification(content: string): void {
    console.log(
      `Sending SMS Notification to: ${this.mobileNumber}\n${content}`
    );
  }
}

class PopUpStrategy implements INotificationStrategy {
  sendNotification(content: string): void {
    console.log("Sending Popup Notification:\n" + content);
  }
}

class NotificationEngine implements IObserver {
  private strategies: INotificationStrategy[] = [];

  private notificationObservable: NotificationObservable;

  constructor() {
    this.notificationObservable =
      NotificationService.getInstance().getObservable();
    this.notificationObservable.addObserver(this);
  }
  addNotificationStrategy(strategy: INotificationStrategy): void {
    this.strategies.push(strategy);
  }

  update(): void {
    const content = this.notificationObservable.getNotificationContent();
    this.strategies.forEach((strategy) => strategy.sendNotification(content));
  }
}

// ============================
//     Singleton NotificationService
// ============================

class NotificationService {
  private static instance: NotificationService;
  private observable: NotificationObservable = new NotificationObservable();
  private notifications: INotification[] = [];

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  getObservable(): NotificationObservable {
    return this.observable;
  }

  sendNotification(notification: INotification): void {
    this.notifications.push(notification);
    this.observable.setNotification(notification);
  }
}

// ============================
//     Main / Client Code
// ============================

(() => {
  const notificationService = NotificationService.getInstance();

  const logger = new Logger();
  const engine = new NotificationEngine();

  engine.addNotificationStrategy(new EmailStrategy("random.person@gmail.com"));
  engine.addNotificationStrategy(new SMSStrategy("+91 9876543210"));
  engine.addNotificationStrategy(new PopUpStrategy());

  // Compose notification with decorators
  let notification: INotification = new SimpleNotification(
    "Your order has been shipped!"
  );
  notification = new TimestampDecorator(notification);
  notification = new SignatureDecorator(notification, "Customer Care");

  notificationService.sendNotification(notification);
})();

export {};
