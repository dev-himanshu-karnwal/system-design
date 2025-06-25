/////////////////////////////////////////////
// Product & Factory
/////////////////////////////////////////////

class Product {
  private sku: number;
  private name: string;
  private price: number;

  constructor(id: number, nm: string, pr: number) {
    this.sku = id;
    this.name = nm;
    this.price = pr;
  }

  // Getters
  getSku(): number {
    return this.sku;
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }
}

class ProductFactory {
  static createProduct(sku: number): Product {
    // In reality product comes from DB
    let name: string;
    let price: number;

    if (sku === 101) {
      name = "Apple";
      price = 20;
    } else if (sku === 102) {
      name = "Banana";
      price = 10;
    } else if (sku === 103) {
      name = "Chocolate";
      price = 50;
    } else if (sku === 201) {
      name = "T-Shirt";
      price = 500;
    } else if (sku === 202) {
      name = "Jeans";
      price = 1000;
    } else {
      name = "Item" + sku.toString();
      price = 100;
    }
    return new Product(sku, name, price);
  }
}

/////////////////////////////////////////////
// InventoryStore (Abstract) & DbInventoryStore
/////////////////////////////////////////////

interface InventoryStore {
  addProduct(prod: Product, qty: number): void;
  removeProduct(sku: number, qty: number): void;
  checkStock(sku: number): number;
  listAvailableProducts(): Product[];
}

class DbInventoryStore implements InventoryStore {
  private stock: Map<number, number>; // SKU -> quantity
  private products: Map<number, Product>; // SKU -> Product

  constructor() {
    this.stock = new Map<number, number>();
    this.products = new Map<number, Product>();
  }

  addProduct(prod: Product, qty: number): void {
    const sku = prod.getSku();
    if (!this.products.has(sku)) {
      // Does not exist
      this.products.set(sku, prod);
    }

    const currentQty = this.stock.get(sku) || 0;
    this.stock.set(sku, currentQty + qty);
  }

  removeProduct(sku: number, qty: number): void {
    if (!this.stock.has(sku)) return;

    const currentQuantity = this.stock.get(sku) || 0;
    const remainingQuantity = currentQuantity - qty;
    if (remainingQuantity > 0) {
      this.stock.set(sku, remainingQuantity);
    } else {
      this.stock.delete(sku);
    }
  }

  checkStock(sku: number): number {
    if (!this.stock.has(sku)) return 0;

    return this.stock.get(sku) || 0;
  }

  listAvailableProducts(): Product[] {
    const available: Product[] = [];
    this.stock.forEach((qty, sku) => {
      if (qty > 0 && this.products.has(sku)) {
        available.push(this.products.get(sku)!);
      }
    });
    return available;
  }
}

/////////////////////////////////////////////
// InventoryManager
/////////////////////////////////////////////

class InventoryManager {
  private store: InventoryStore;

  constructor(store: InventoryStore) {
    this.store = store;
  }

  addStock(sku: number, qty: number): void {
    const prod = ProductFactory.createProduct(sku);
    this.store.addProduct(prod, qty);
    console.log(`[InventoryManager] Added SKU ${sku} Qty ${qty}`);
  }

  removeStock(sku: number, qty: number): void {
    this.store.removeProduct(sku, qty);
  }

  checkStock(sku: number): number {
    return this.store.checkStock(sku);
  }

  getAvailableProducts(): Product[] {
    return this.store.listAvailableProducts();
  }
}

/////////////////////////////////////////////
// Replenishment Strategy (Strategy Pattern)
/////////////////////////////////////////////

interface ReplenishStrategy {
  replenish(
    manager: InventoryManager,
    itemsToReplenish: Map<number, number>
  ): void;
}

class ThresholdReplenishStrategy implements ReplenishStrategy {
  private threshold: number;

  constructor(threshold: number) {
    this.threshold = threshold;
  }

  replenish(
    manager: InventoryManager,
    itemsToReplenish: Map<number, number>
  ): void {
    console.log("[ThresholdReplenish] Checking threshold... ");
    itemsToReplenish.forEach((qtyToAdd, sku) => {
      const current = manager.checkStock(sku);
      if (current < this.threshold) {
        manager.addStock(sku, qtyToAdd);
        console.log(
          `  -> SKU ${sku} was ${current}, replenished by ${qtyToAdd}`
        );
      }
    });
  }
}

class WeeklyReplenishStrategy implements ReplenishStrategy {
  constructor() {}

  replenish(
    manager: InventoryManager,
    itemsToReplenish: Map<number, number>
  ): void {
    console.log(
      "[WeeklyReplenish] Weekly replenishment triggered for inventory."
    );
  }
}

/////////////////////////////////////////////
// DarkStore (formerly Warehouse)
/////////////////////////////////////////////

class DarkStore {
  private name: string;
  private x: number;
  private y: number; // location coordinates
  private inventoryManager: InventoryManager;
  private replenishStrategy: ReplenishStrategy | null = null;

  constructor(n: string, x_coord: number, y_coord: number) {
    this.name = n;
    this.x = x_coord;
    this.y = y_coord;

    this.inventoryManager = new InventoryManager(new DbInventoryStore());
  }

  distanceTo(ux: number, uy: number): number {
    return Math.sqrt(
      (this.x - ux) * (this.x - ux) + (this.y - uy) * (this.y - uy)
    );
  }

  runReplenishment(itemsToReplenish: Map<number, number>): void {
    if (this.replenishStrategy) {
      this.replenishStrategy.replenish(this.inventoryManager, itemsToReplenish);
    }
  }

  // Delegation Methods
  getAllProducts(): Product[] {
    return this.inventoryManager.getAvailableProducts();
  }

  checkStock(sku: number): number {
    return this.inventoryManager.checkStock(sku);
  }

  removeStock(sku: number, qty: number): void {
    this.inventoryManager.removeStock(sku, qty);
  }

  addStock(sku: number, qty: number): void {
    this.inventoryManager.addStock(sku, qty);
  }

  // Getters & Setters
  setReplenishStrategy(strategy: ReplenishStrategy): void {
    this.replenishStrategy = strategy;
  }

  getName(): string {
    return this.name;
  }

  getXCoordinate(): number {
    return this.x;
  }

  getYCoordinate(): number {
    return this.y;
  }

  getInventoryManager(): InventoryManager {
    return this.inventoryManager;
  }
}

/////////////////////////////////////////////
// DarkStoreManager (Singleton)
/////////////////////////////////////////////

class DarkStoreManager {
  private darkStores: DarkStore[];
  private static instance: DarkStoreManager | null = null;

  private constructor() {
    this.darkStores = [];
  }

  static getInstance(): DarkStoreManager {
    if (this.instance === null) {
      this.instance = new DarkStoreManager();
    }
    return this.instance;
  }

  registerDarkStore(ds: DarkStore): void {
    this.darkStores.push(ds);
  }

  getNearbyDarkStores(
    ux: number,
    uy: number,
    maxDistance: number
  ): DarkStore[] {
    const distList: { distance: number; store: DarkStore }[] = [];

    this.darkStores.forEach((ds) => {
      const d = ds.distanceTo(ux, uy);
      if (d <= maxDistance) {
        distList.push({ distance: d, store: ds });
      }
    });

    distList.sort((a, b) => a.distance - b.distance);

    return distList.map((item) => item.store);
  }
}

/////////////////////////////////////////////
// User & Cart
/////////////////////////////////////////////

class Cart {
  items: { product: Product; qty: number }[] = []; // (Product, qty)

  addItem(sku: number, qty: number): void {
    const prod = ProductFactory.createProduct(sku);
    this.items.push({ product: prod, qty });
    console.log(`[Cart] Added SKU ${sku} (${prod.getName()}) x${qty}`);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => {
      return sum + item.product.getPrice() * item.qty;
    }, 0);
  }

  getItems(): { product: Product; qty: number }[] {
    return this.items;
  }
}

class User {
  name: string;
  x: number;
  y: number;
  cart: Cart; // User owns a cart

  constructor(n: string, x_coord: number, y_coord: number) {
    this.name = n;
    this.x = x_coord;
    this.y = y_coord;
    this.cart = new Cart();
  }

  getCart(): Cart {
    return this.cart;
  }
}

/////////////////////////////////////////////
// DeliveryPartner
/////////////////////////////////////////////

class DeliveryPartner {
  name: string;

  constructor(n: string) {
    this.name = n;
  }
}

/////////////////////////////////////////////
// Order & OrderManager (Singleton)
/////////////////////////////////////////////

class Order {
  static nextId: number = 1;
  orderId: number;
  user: User;
  items: { product: Product; qty: number }[]; // (Product, qty)
  partners: DeliveryPartner[];
  totalAmount: number;

  constructor(u: User) {
    this.orderId = Order.nextId++;
    this.user = u;
    this.items = [];
    this.partners = [];
    this.totalAmount = 0.0;
  }
}

class OrderManager {
  private orders: Order[];
  private static instance: OrderManager | null = null;

  private constructor() {
    this.orders = [];
  }

  static getInstance(): OrderManager {
    if (this.instance === null) {
      this.instance = new OrderManager();
    }
    return this.instance;
  }

  placeOrder(user: User, cart: Cart): void {
    console.log(`\n[OrderManager] Placing Order for: ${user.name}`);

    // product --> Qty
    const requestedItems = cart.getItems();

    // 1) Find nearby dark stores within 5 KM
    const maxDist = 5.0;
    const nearbyDarkStores = DarkStoreManager.getInstance().getNearbyDarkStores(
      user.x,
      user.y,
      maxDist
    );

    if (nearbyDarkStores.length === 0) {
      console.log("  No dark stores within 5 KM. Cannot fulfill order.");
      return;
    }

    // 2) Check if closest store has all items
    const firstStore = nearbyDarkStores[0];

    let allInFirst = true;
    for (const item of requestedItems) {
      const sku = item.product.getSku();
      const qty = item.qty;

      if (firstStore.checkStock(sku) < qty) {
        allInFirst = false;
        break;
      }
    }

    const order = new Order(user);

    // One delivery partner required...
    if (allInFirst) {
      console.log(`  All items at: ${firstStore.getName()}`);

      // Remove the products from store
      for (const item of requestedItems) {
        const sku = item.product.getSku();
        const qty = item.qty;
        firstStore.removeStock(sku, qty);
        order.items.push({ product: ProductFactory.createProduct(sku), qty });
      }

      order.totalAmount = cart.getTotal();
      order.partners.push(new DeliveryPartner("Partner1"));
      console.log("  Assigned Delivery Partner: Partner1");
    }
    // Multiple delivery partners required
    else {
      console.log("  Splitting order across stores...");

      const allItems = new Map<number, number>(); //SKU --> Qty

      for (const item of requestedItems) {
        allItems.set(item.product.getSku(), item.qty);
      }

      let partnerId = 1;
      for (const store of nearbyDarkStores) {
        // If allItems becomes empty, we break early (all SKUs have been assigned)
        if (allItems.size === 0) break;

        console.log(`   Checking: ${store.getName()}`);

        let assigned = false;
        const toErase: number[] = [];

        allItems.forEach((qtyNeeded, sku) => {
          const availableQty = store.checkStock(sku);
          if (availableQty <= 0) return;

          //take whichever is smaller: available or qtyNeeded.
          const takenQty = Math.min(availableQty, qtyNeeded);
          store.removeStock(sku, takenQty);

          console.log(
            `     ${store.getName()} supplies SKU ${sku} x${takenQty}`
          );

          order.items.push({
            product: ProductFactory.createProduct(sku),
            qty: takenQty,
          });

          // Adjust the Quantity
          if (qtyNeeded > takenQty) {
            allItems.set(sku, qtyNeeded - takenQty);
          } else {
            toErase.push(sku);
          }
          assigned = true;
        });

        // After iterating all SKUs in allItems, we erase
        // any fully‐satisfied SKUs from the allItems map.
        toErase.forEach((sku) => allItems.delete(sku));

        // If at least one SKU was taken from this store, we assign
        // a new DeliveryPartner.
        if (assigned) {
          const pname = "Partner" + partnerId++;
          order.partners.push(new DeliveryPartner(pname));
          console.log(`     Assigned: ${pname} for ${store.getName()}`);
        }
      }

      // if remaining still has entries, we print which SKUs/quantities could not be fulfilled.
      if (allItems.size > 0) {
        console.log("  Could not fulfill:");
        allItems.forEach((qty, sku) => {
          console.log(`    SKU ${sku} x${qty}`);
        });
      }

      // recompute order.totalAmount
      order.totalAmount = order.items.reduce((sum, item) => {
        return sum + item.product.getPrice() * item.qty;
      }, 0);
    }

    // Printing Order Summary
    console.log(`\n[OrderManager] Order #${order.orderId} Summary:`);
    console.log(`  User: ${user.name}\n  Items:`);
    order.items.forEach((item) => {
      console.log(
        `    SKU ${item.product.getSku()} (${item.product.getName()}) x${
          item.qty
        } @ ₹${item.product.getPrice()}`
      );
    });
    console.log(`  Total: ₹${order.totalAmount}\n  Partners:`);
    order.partners.forEach((dp) => {
      console.log(`    ${dp.name}`);
    });
    console.log();

    this.orders.push(order);
  }

  getAllOrders(): Order[] {
    return this.orders;
  }
}

/////////////////////////////////////////////
// ZeptoHelper
/////////////////////////////////////////////

class ZeptoHelper {
  static showAllItems(user: User): void {
    console.log(
      `\n[Zepto] All Available products within 5 KM for ${user.name}:`
    );

    const dsManager = DarkStoreManager.getInstance();
    const nearbyStores = dsManager.getNearbyDarkStores(user.x, user.y, 5.0);

    // Collect each SKU → price (so we only display each product once)
    const skuToPrice = new Map<number, number>();
    const skuToName = new Map<number, string>();

    for (const darkStore of nearbyStores) {
      const products = darkStore.getAllProducts();

      for (const product of products) {
        const sku = product.getSku();

        if (!skuToPrice.has(sku)) {
          skuToPrice.set(sku, product.getPrice());
          skuToName.set(sku, product.getName());
        }
      }
    }

    skuToPrice.forEach((price, sku) => {
      console.log(`  SKU ${sku} - ${skuToName.get(sku)} @ ₹${price}`);
    });
  }

  static initialize(): void {
    const dsManager = DarkStoreManager.getInstance();

    // DarkStore A.......
    const darkStoreA = new DarkStore("DarkStoreA", 0.0, 0.0);
    darkStoreA.setReplenishStrategy(new ThresholdReplenishStrategy(3));

    console.log("\nAdding stocks in DarkStoreA....");
    darkStoreA.addStock(101, 5); // Apple
    darkStoreA.addStock(102, 2); // Banana

    // DarkStore B.......
    const darkStoreB = new DarkStore("DarkStoreB", 4.0, 1.0);
    darkStoreB.setReplenishStrategy(new ThresholdReplenishStrategy(3));

    console.log("\nAdding stocks in DarkStoreB....");
    darkStoreB.addStock(101, 3); // Apple
    darkStoreB.addStock(103, 10); // Chocolate

    // DarkStore C.......
    const darkStoreC = new DarkStore("DarkStoreC", 2.0, 3.0);
    darkStoreC.setReplenishStrategy(new ThresholdReplenishStrategy(3));

    console.log("\nAdding stocks in DarkStoreC....");
    darkStoreC.addStock(102, 5); // Banana
    darkStoreC.addStock(201, 7); // T-Shirt

    dsManager.registerDarkStore(darkStoreA);
    dsManager.registerDarkStore(darkStoreB);
    dsManager.registerDarkStore(darkStoreC);
  }
}

/////////////////////////////////////////////
// Main(): High-Level Flow
/////////////////////////////////////////////

function main() {
  // 1) Initialize.
  ZeptoHelper.initialize();

  // 2) A User comes on Platform
  const user = new User("Aditya", 1.0, 1.0);
  console.log(`\nUser with name ${user.name} comes on platform`);

  // 3) Show all available items via Zepto
  ZeptoHelper.showAllItems(user);

  // 4) User adds items to cart (some not in a single store)
  console.log("\nAdding items to cart");
  const cart = user.getCart();
  cart.addItem(101, 4); // dsA has 5, dsB has 3
  cart.addItem(102, 3); // dsA has 2, dsC has 5
  cart.addItem(103, 2); // dsB has 10

  // 5) Place Order
  OrderManager.getInstance().placeOrder(user, cart);
}

main();

export {};
