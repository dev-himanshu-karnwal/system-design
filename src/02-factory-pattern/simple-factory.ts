// Abstract Product
abstract class Burger {
  abstract prepare(): void;
}

// Concrete Products
class BasicBurger extends Burger {
  prepare(): void {
    console.log("Preparing Basic Burger with bun, patty, and ketchup!");
  }
}

class StandardBurger extends Burger {
  prepare(): void {
    console.log(
      "Preparing Standard Burger with bun, patty, cheese, and lettuce!"
    );
  }
}

class PremiumBurger extends Burger {
  prepare(): void {
    console.log(
      "Preparing Premium Burger with gourmet bun, premium patty, cheese, lettuce, and secret sauce!"
    );
  }
}

// Factory
class BurgerFactory {
  createBurger(type: string): Burger | null {
    switch (type) {
      case "basic":
        return new BasicBurger();
      case "standard":
        return new StandardBurger();
      case "premium":
        return new PremiumBurger();
      default:
        console.log("Invalid burger type!");
        return null;
    }
  }
}

// Main Simulation
const type: string = "standard";

const myBurgerFactory = new BurgerFactory();
const burger = myBurgerFactory.createBurger(type);

if (burger) {
  burger.prepare();
}

export {};
