import { Order } from "../models/Order";

export class OrderManager {
  private static instance: OrderManager | null = null;
  private orders: Order[] = [];

  // Private constructor to enforce singleton
  private constructor() {}

  public static getInstance(): OrderManager {
    if (OrderManager.instance === null) {
      OrderManager.instance = new OrderManager();
    }
    return OrderManager.instance;
  }

  public addOrder(order: Order): void {
    this.orders.push(order);
  }

  public listOrders(): void {
    console.log("\n--- All Orders ---");
    for (const order of this.orders) {
      const userName = order.userObj?.name || "Unknown User";
      console.log(
        `${order.type} order for ${userName} | Total: ₹${order.totalCost} | At: ${order.scheduledTime}`
      );
    }
  }
}
