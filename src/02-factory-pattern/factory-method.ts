// Product Interface and Implementations

abstract class Burger {
  abstract prepare(): void;
}

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

// Factory Interface and Concrete Factories

interface BurgerFactory {
  createBurger(type: string): Burger | null;
}

class SinghBurger implements BurgerFactory {
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

class KingBurger implements BurgerFactory {
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
}

// Main Logic

const type: string = "basic";

const myFactory: BurgerFactory = new SinghBurger();

const burger: Burger | null = myFactory.createBurger(type);

if (burger) {
  burger.prepare();
}
