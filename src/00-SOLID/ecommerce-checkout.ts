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

interface IProduct {
  name: string;
  price: number;
}

class Product implements IProduct {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

interface IDiscountStrategy {
  applyDiscount(total: number): number;
}

class NoDiscount implements IDiscountStrategy {
  applyDiscount(total: number): number {
    return total;
  }
}

class PercentageDiscount implements IDiscountStrategy {
  percentage: number;

  constructor(percentage: number) {
    this.percentage = percentage;
  }

  applyDiscount(total: number): number {
    return total - (total * this.percentage) / 100;
  }
}

class FixedDiscount implements IDiscountStrategy {
  amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  applyDiscount(total: number): number {
    return Math.max(0, total - this.amount);
  }
}

class Cart {
  products: IProduct[] = [];
  discountStrategy: IDiscountStrategy = new NoDiscount();

  constructor(discountStrategy: IDiscountStrategy) {
    this.discountStrategy = discountStrategy;
  }

  setDiscountStrategy(discountStrategy: IDiscountStrategy) {
    this.discountStrategy = discountStrategy;
  }

  addProduct(product: IProduct) {
    this.products.push(product);
  }

  calculateTotal() {
    const total = this.products.reduce(
      (acc, product) => acc + product.price,
      0
    );
    const discountedTotal = this.discountStrategy.applyDiscount(total);
    const logger: ILogger = ConsoleLogger.getInstance();
    logger.log(
      `Applied ${this.discountStrategy.constructor.name}. Original: ₹${total}, Final: ₹${discountedTotal}`
    );
  }
}

const cart = new Cart(new PercentageDiscount(10)); // 10% off

cart.addProduct(new Product("Laptop", 50000));
cart.addProduct(new Product("Mouse", 1500));

cart.calculateTotal(); // Logs: Applied 10% discount. Final total: ₹46,350
