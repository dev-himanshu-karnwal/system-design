import { User } from "../models/User";
import { Cart } from "../models/Cart";
import { Restaurant } from "../models/Restaurant";
import { MenuItem } from "../models/MenuItem";
import { PaymentStrategy } from "../strategies/PaymentStrategy";
import { Order } from "../models/Order";

export interface OrderFactory {
  createOrder(
    user: User,
    cart: Cart,
    restaurant: Restaurant,
    menuItems: MenuItem[],
    paymentStrategy: PaymentStrategy,
    totalCost: number,
    orderType: string
  ): Order;
}
