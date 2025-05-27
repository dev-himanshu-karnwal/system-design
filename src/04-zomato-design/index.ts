import { Zomato } from "./zomato";
import { User } from "./models/User";
import { Order } from "./models/Order";
import { UpiPaymentStrategy } from "./strategies/UpiPaymentStrategy";

async function main() {
  const zomato = new Zomato();

  const user = new User(101, "Aditya", "Delhi");
  console.log(`User: ${user.name} is active.`);

  const restaurantList = zomato.searchRestaurants("Delhi");

  if (restaurantList.length === 0) {
    console.log("No restaurants found!");
    return;
  }

  console.log("Found Restaurants:");
  restaurantList.forEach((r) => console.log(` - ${r.name}`));

  // User selects a restaurant
  zomato.selectRestaurant(user, restaurantList[0]);
  console.log(`Selected restaurant: ${restaurantList[0].name}`);

  // User adds items to the cart
  zomato.addToCart(user, "P1");
  zomato.addToCart(user, "P2");

  zomato.printUserCart(user);

  // Create payment strategy
  const paymentStrategy = new UpiPaymentStrategy("1234567890");

  // User checks out the cart (Now/Immediate order)
  const order: Order | null = zomato.checkoutNow(
    user,
    "Delivery",
    paymentStrategy
  );

  if (order) {
    // Process payment and notify if successful
    const paymentSuccess = order.processPayment();

    if (paymentSuccess) {
      zomato.payForOrder(user, order);
    } else {
      console.log("Payment failed.");
    }
  } else {
    console.log("Checkout failed: Cart might be empty.");
  }
}

main().catch(console.error);
