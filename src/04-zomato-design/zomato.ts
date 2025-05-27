import { User } from "./models/User";
import { Restaurant } from "./models/Restaurant";
import { MenuItem } from "./models/MenuItem";
import { RestaurantManager } from "./managers/RestaurantManager";
import { OrderManager } from "./managers/OrderManager";
import { PaymentStrategy } from "./strategies/PaymentStrategy";
import { NowOrderFactory } from "./factories/NowOrderFactory";
import { ScheduledOrderFactory } from "./factories/ScheduledOrderFactory";
import { NotificationService } from "./services/NotificationService";

export class Zomato {
  constructor() {
    this.initializeRestaurants();
  }

  initializeRestaurants() {
    const restaurant1 = new Restaurant("Bikaner", "Delhi");
    restaurant1.addMenuItem(new MenuItem("P1", "Chole Bhature", 120));
    restaurant1.addMenuItem(new MenuItem("P2", "Samosa", 15));

    const restaurant2 = new Restaurant("Haldiram", "Kolkata");
    restaurant2.addMenuItem(new MenuItem("P1", "Raj Kachori", 80));
    restaurant2.addMenuItem(new MenuItem("P2", "Pav Bhaji", 100));
    restaurant2.addMenuItem(new MenuItem("P3", "Dhokla", 50));

    const restaurant3 = new Restaurant("Saravana Bhavan", "Chennai");
    restaurant3.addMenuItem(new MenuItem("P1", "Masala Dosa", 90));
    restaurant3.addMenuItem(new MenuItem("P2", "Idli Vada", 60));
    restaurant3.addMenuItem(new MenuItem("P3", "Filter Coffee", 30));

    const restaurantManager = RestaurantManager.getInstance();
    restaurantManager.addRestaurant(restaurant1);
    restaurantManager.addRestaurant(restaurant2);
    restaurantManager.addRestaurant(restaurant3);

    // Add other sample restaurants...
  }

  searchRestaurants(location: string): Restaurant[] {
    return RestaurantManager.getInstance().searchByLocation(location);
  }

  selectRestaurant(user: User, restaurant: Restaurant): void {
    user.cart.restaurant = restaurant;
  }

  addToCart(user: User, itemCode: string): void {
    const restaurant = user.cart.restaurant;
    if (!restaurant) {
      console.log("Please select a restaurant first.");
      return;
    }
    const menu = restaurant.menu;
    const item = menu.find((i) => i.code === itemCode);
    if (item) {
      user.cart.addItem(item);
    }
  }

  checkoutNow(user: User, orderType: string, paymentStrategy: PaymentStrategy) {
    return this.checkout(
      user,
      orderType,
      paymentStrategy,
      new NowOrderFactory()
    );
  }

  checkoutScheduled(
    user: User,
    orderType: string,
    paymentStrategy: PaymentStrategy,
    scheduleTime: string
  ) {
    return this.checkout(
      user,
      orderType,
      paymentStrategy,
      new ScheduledOrderFactory(scheduleTime)
    );
  }

  checkout(
    user: User,
    orderType: string,
    paymentStrategy: PaymentStrategy,
    orderFactory: any
  ) {
    if (user.cart.isEmpty()) return null;

    const userCart = user.cart;
    const orderedRestaurant = userCart.restaurant;
    const itemsOrdered = userCart.items;
    const totalCost = userCart.getTotalCost();

    const order = orderFactory.createOrder(
      user,
      userCart,
      orderedRestaurant,
      itemsOrdered,
      paymentStrategy,
      totalCost,
      orderType
    );
    OrderManager.getInstance().addOrder(order);
    return order;
  }

  payForOrder(user: User, order: any) {
    const isPaymentSuccess = order.processPayment();

    if (isPaymentSuccess) {
      NotificationService.notify(order);
      user.cart.clear();
    }
  }

  printUserCart(user: User): void {
    console.log("Items in cart:");
    console.log("------------------------------------");
    user.cart.items.forEach((item) => {
      console.log(`${item.code} : ${item.name} : ₹${item.price}`);
    });
    console.log("------------------------------------");
    console.log(`Grand total : ₹${user.cart.getTotalCost()}`);
  }
}
