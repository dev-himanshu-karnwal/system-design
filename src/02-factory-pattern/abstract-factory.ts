// Abstract product: Burger
abstract class Burger {
  abstract prepare(): void;
}

// Concrete products: Burgers
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

class BasicWheatBurger extends Burger {
  prepare(): void {
    console.log("Preparing Basic Wheat Burger with bun, patty, and ketchup!");
  }
}

class StandardWheatBurger extends Burger {
  prepare(): void {
    console.log(
      "Preparing Standard Wheat Burger with bun, patty, cheese, and lettuce!"
    );
  }
}

class PremiumWheatBurger extends Burger {
  prepare(): void {
    console.log(
      "Preparing Premium Wheat Burger with gourmet bun, premium patty, cheese, lettuce, and secret sauce!"
    );
  }
}

// Abstract product: GarlicBread
abstract class GarlicBread {
  abstract prepare(): void;
}

// Concrete products: Garlic Bread
class BasicGarlicBread extends GarlicBread {
  prepare(): void {
    console.log("Preparing Basic Garlic Bread with butter and garlic!");
  }
}

class CheeseGarlicBread extends GarlicBread {
  prepare(): void {
    console.log("Preparing Cheese Garlic Bread with extra cheese and butter!");
  }
}

class BasicWheatGarlicBread extends GarlicBread {
  prepare(): void {
    console.log("Preparing Basic Wheat Garlic Bread with butter and garlic!");
  }
}

class CheeseWheatGarlicBread extends GarlicBread {
  prepare(): void {
    console.log(
      "Preparing Cheese Wheat Garlic Bread with extra cheese and butter!"
    );
  }
}

// Abstract Factory
interface MealFactory {
  createBurger(type: string): Burger | null;
  createGarlicBread(type: string): GarlicBread | null;
}

// Concrete Factory: SinghBurger
class SinghBurger implements MealFactory {
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

  createGarlicBread(type: string): GarlicBread | null {
    switch (type) {
      case "basic":
        return new BasicGarlicBread();
      case "cheese":
        return new CheeseGarlicBread();
      default:
        console.log("Invalid Garlic bread type!");
        return null;
    }
  }
}

// Concrete Factory: KingBurger
class KingBurger implements MealFactory {
  createBurger(type: string): Burger | null {
    switch (type) {
      case "basic":
        return new BasicWheatBurger();
      case "standard":
        return new StandardWheatBurger();
      case "premium":
        return new PremiumWheatBurger();
      default:
        console.log("Invalid burger type!");
        return null;
    }
  }

  createGarlicBread(type: string): GarlicBread | null {
    switch (type) {
      case "basic":
        return new BasicWheatGarlicBread();
      case "cheese":
        return new CheeseWheatGarlicBread();
      default:
        console.log("Invalid Garlic bread type!");
        return null;
    }
  }
}

// Main simulation
const burgerType = "basic";
const garlicBreadType = "cheese";

const mealFactory: MealFactory = new KingBurger();

const burger = mealFactory.createBurger(burgerType);
const garlicBread = mealFactory.createGarlicBread(garlicBreadType);

burger?.prepare();
garlicBread?.prepare();

export {};
