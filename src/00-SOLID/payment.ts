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

interface IPaymentStrategy {
  pay(amount: number): void;
}

class CreditCardStrategy implements IPaymentStrategy {
  private cardNumber: string;

  constructor(cardNumber: string) {
    this.cardNumber = cardNumber;
  }

  pay(amount: number): void {
    const logger: ILogger = ConsoleLogger.getInstance();
    logger.log(`Paid ₹${amount} using Credit Card (${this.cardNumber})`);
  }
}

class PaypalStrategy implements IPaymentStrategy {
  private credential: string;

  constructor(credential: string) {
    this.credential = credential;
  }

  pay(amount: number): void {
    const logger: ILogger = ConsoleLogger.getInstance();
    logger.log(`Paid ₹${amount} using Paypal (${this.credential})`);
  }
}

class PaymentProcessor {
  private paymentStrategy: IPaymentStrategy;

  constructor(paymentStrategy: IPaymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  setPaymentStrategy(paymentStrategy: IPaymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  processPayment(amount: number): void {
    this.paymentStrategy.pay(amount);
  }
}

function Client() {
  const paymentProcessor = new PaymentProcessor(
    new CreditCardStrategy("1234-5678-9012-3456")
  );
  paymentProcessor.processPayment(100);
}

Client();

export {};
