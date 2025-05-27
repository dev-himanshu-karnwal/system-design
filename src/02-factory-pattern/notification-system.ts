interface Notifier {
  send(message: string): void;
}

class EmailNotification implements Notifier {
  send(message: string): void {
    console.log(`Sending Email: ${message}`);
  }
}

class SMSNotification implements Notifier {
  send(message: string): void {
    console.log(`Sending SMS: ${message}`);
  }
}

class PushNotification implements Notifier {
  send(message: string): void {
    console.log(`Sending PushNotification: ${message}`);
  }
}

type NotifierConstructor = new () => Notifier;

class NotificationFactory {
  private static readonly notifiers: Map<string, Notifier> = new Map();

  static register(
    type: string,
    notifierConstructor: NotifierConstructor
  ): void {
    const notifier = new notifierConstructor();
    this.notifiers.set(type, notifier);
  }

  create(type: string): Notifier {
    const notifier = NotificationFactory.notifiers.get(type);
    if (!notifier) {
      throw new Error(`Notifier type "${type}" not registered.`);
    }
    return notifier;
  }
}

function Client() {
  NotificationFactory.register("email", EmailNotification);
  NotificationFactory.register("sms", SMSNotification);
  NotificationFactory.register("push", PushNotification);

  const notificationFactory = new NotificationFactory();
  const emailNotifier = notificationFactory.create("email");
  emailNotifier.send("Hello!");
  const pushNotifier = notificationFactory.create("push");
  pushNotifier.send("Hiii!");
}

Client();

export {};
