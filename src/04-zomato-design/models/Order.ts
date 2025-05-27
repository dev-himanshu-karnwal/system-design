import { User } from "./User";
import { Restaurant } from "./Restaurant";
import { MenuItem } from "./MenuItem";
import { PaymentStrategy } from "../strategies/PaymentStrategy";

export abstract class Order {
  private static nextOrderId = 0;

  protected orderId: number;
  protected user: User | null = null;
  protected restaurant: Restaurant | null = null;
  protected items: MenuItem[] = [];
  protected paymentStrategy: PaymentStrategy | null = null;
  protected total: number = 0;
  protected scheduled: string = "";

  constructor() {
    this.orderId = ++Order.nextOrderId;
  }

  processPayment(): boolean {
    if (this.paymentStrategy) {
      this.paymentStrategy.pay(this.total);
      return true;
    } else {
      console.log("Please choose a payment mode first");
      return false;
    }
  }

  // Abstract method (must be implemented by subclasses)
  abstract get type(): string;

  // Getters and Setters
  getOrderId(): number {
    return this.orderId;
  }

  get userObj(): User | null {
    return this.user;
  }

  set userObj(u: User | null) {
    this.user = u;
  }

  get restaurantObj(): Restaurant | null {
    return this.restaurant;
  }

  set restaurantObj(r: Restaurant | null) {
    this.restaurant = r;
  }

  get itemList(): MenuItem[] {
    return this.items;
  }

  set itemList(its: MenuItem[]) {
    this.items = its;
    this.total = its.reduce((sum, item) => sum + item.price, 0);
  }

  set payment(p: PaymentStrategy | null) {
    this.paymentStrategy = p;
  }

  get scheduledTime(): string {
    return this.scheduled;
  }

  set scheduledTime(s: string) {
    this.scheduled = s;
  }

  get totalCost(): number {
    return this.total;
  }

  set totalCost(t: number) {
    this.total = t;
  }
}
