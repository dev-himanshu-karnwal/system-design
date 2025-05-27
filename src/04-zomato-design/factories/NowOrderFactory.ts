import { OrderFactory } from "./OrderFactory";
import { DeliveryOrder } from "../models/DeliveryOrder";
import { PickupOrder } from "../models/PickupOrder";
import { User } from "../models/User";
import { Cart } from "../models/Cart";
import { Restaurant } from "../models/Restaurant";
import { MenuItem } from "../models/MenuItem";
import { PaymentStrategy } from "../strategies/PaymentStrategy";
import { Order } from "../models/Order";
import { TimeUtils } from "../utils/timeUtils";

export class NowOrderFactory implements OrderFactory {
  createOrder(
    user: User,
    cart: Cart,
    restaurant: Restaurant,
    menuItems: MenuItem[],
    paymentStrategy: PaymentStrategy,
    totalCost: number,
    orderType: string
  ): Order {
    let order: Order;

    if (orderType === "Delivery") {
      const deliveryOrder = new DeliveryOrder();
      deliveryOrder.userAddress = user.address;
      order = deliveryOrder;
    } else {
      const pickupOrder = new PickupOrder();
      pickupOrder.restaurantAddress = restaurant.location;
      order = pickupOrder;
    }

    order.userObj = user;
    order.restaurantObj = restaurant;
    order.itemList = menuItems;
    order.payment = paymentStrategy;
    order.scheduledTime = TimeUtils.getCurrentTime();
    order.totalCost = totalCost;

    return order;
  }
}
