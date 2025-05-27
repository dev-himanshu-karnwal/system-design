import { Order } from "../models/Order";

export class NotificationService {
  static notify(order: Order): void {
    console.log(`\nNotification: New ${order.type} order placed!`);
    console.log("---------------------------------------------");
    console.log(`Order ID: ${order.getOrderId()}`);
    console.log(`Customer: ${order.userObj?.name || "Unknown"}`);
    console.log(`Restaurant: ${order.restaurantObj?.name || "Unknown"}`);
    console.log("Items Ordered:");

    order.itemList.forEach((item) => {
      console.log(`   - ${item.name} (₹${item.price})`);
    });

    console.log(`Total: ₹${order.totalCost}`);
    console.log(`Scheduled For: ${order.scheduledTime}`);
    console.log("Payment: Done");
    console.log("---------------------------------------------");
  }
}
