// Prototype interface
interface Prototype {
  clone(): Prototype;
  toString(): string;
}

// Concrete Prototype - Car
class Car implements Prototype {
  constructor(
    public model: string,
    public color: string,
    public features: string[] = []
  ) {}

  // Clone method that creates a deep copy
  clone(): Car {
    // Create new instance with same primitive values
    const cloned = new Car(this.model, this.color);

    // Deep copy the array
    cloned.features = [...this.features];

    return cloned;
  }

  // Add a feature to the car
  addFeature(feature: string): void {
    this.features.push(feature);
  }

  toString(): string {
    return `Car: ${this.model}, Color: ${
      this.color
    }, Features: ${this.features.join(", ")}`;
  }
}

// Concrete Prototype - Bike
class Bike implements Prototype {
  constructor(
    public brand: string,
    public type: string,
    public accessories: Map<string, number> = new Map()
  ) {}

  // Clone method that creates a deep copy
  clone(): Bike {
    // Create new instance with same primitive values
    const cloned = new Bike(this.brand, this.type);

    // Deep copy the Map
    this.accessories.forEach((value, key) => {
      cloned.accessories.set(key, value);
    });

    return cloned;
  }

  // Add an accessory with its price
  addAccessory(name: string, price: number): void {
    this.accessories.set(name, price);
  }

  toString(): string {
    const accessoriesList = Array.from(this.accessories.entries())
      .map(([name, price]) => `${name} ($${price})`)
      .join(", ");
    return `Bike: ${this.brand} ${this.type}, Accessories: ${accessoriesList}`;
  }
}

// Client code
function main() {
  // Create prototype car
  const prototypeCar = new Car("Tesla Model S", "Red");
  prototypeCar.addFeature("Autopilot");
  prototypeCar.addFeature("Premium Sound System");

  // Clone the car and modify it
  const car1 = prototypeCar.clone();
  car1.color = "Blue";
  car1.addFeature("Sunroof");

  const car2 = prototypeCar.clone();
  car2.model = "Tesla Model 3";
  car2.addFeature("Wireless Charging");

  console.log("Original Car:", prototypeCar.toString());
  console.log("Cloned Car 1:", car1.toString());
  console.log("Cloned Car 2:", car2.toString());

  // Create prototype bike
  const prototypeBike = new Bike("Trek", "Mountain");
  prototypeBike.addAccessory("Helmet", 120);
  prototypeBike.addAccessory("Water Bottle", 25);

  // Clone the bike and modify it
  const bike1 = prototypeBike.clone();
  bike1.type = "Road";
  bike1.addAccessory("Speedometer", 80);

  const bike2 = prototypeBike.clone();
  bike2.brand = "Specialized";
  bike2.addAccessory("Lock", 45);

  console.log("\nOriginal Bike:", prototypeBike.toString());
  console.log("Cloned Bike 1:", bike1.toString());
  console.log("Cloned Bike 2:", bike2.toString());
}

main();

export {};
