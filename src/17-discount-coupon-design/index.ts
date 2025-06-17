// Discount Strategy (Strategy Pattern)
interface DiscountStrategy {
  calculate(baseAmount: number): number;
}

class FlatDiscountStrategy implements DiscountStrategy {
  constructor(private amount: number) {}
  calculate(baseAmount: number): number {
    return Math.min(this.amount, baseAmount);
  }
}

class PercentageDiscountStrategy implements DiscountStrategy {
  constructor(private percent: number) {}
  calculate(baseAmount: number): number {
    return (this.percent / 100) * baseAmount;
  }
}

class PercentageWithCapStrategy implements DiscountStrategy {
  constructor(private percent: number, private cap: number) {}
  calculate(baseAmount: number): number {
    const disc = (this.percent / 100) * baseAmount;
    return disc > this.cap ? this.cap : disc;
  }
}

enum StrategyType {
  FLAT,
  PERCENT,
  PERCENT_WITH_CAP,
}

class DiscountStrategyManager {
  private static instance: DiscountStrategyManager;
  private constructor() {}
  static getInstance(): DiscountStrategyManager {
    if (!DiscountStrategyManager.instance) {
      DiscountStrategyManager.instance = new DiscountStrategyManager();
    }
    return DiscountStrategyManager.instance;
  }
  getStrategy(
    type: StrategyType,
    param1: number,
    param2: number = 0
  ): DiscountStrategy {
    switch (type) {
      case StrategyType.FLAT:
        return new FlatDiscountStrategy(param1);
      case StrategyType.PERCENT:
        return new PercentageDiscountStrategy(param1);
      case StrategyType.PERCENT_WITH_CAP:
        return new PercentageWithCapStrategy(param1, param2);
      default:
        throw new Error("Invalid strategy type");
    }
  }
}

// Product and Cart
class Product {
  constructor(
    public name: string,
    public category: string,
    public price: number
  ) {}
}

class CartItem {
  constructor(public product: Product, public quantity: number) {}
  itemTotal(): number {
    return this.product.price * this.quantity;
  }
}

class Cart {
  private items: CartItem[] = [];
  private originalTotal = 0;
  private currentTotal = 0;
  private loyaltyMember = false;
  private paymentBank = "";

  addProduct(product: Product, qty: number = 1): void {
    const item = new CartItem(product, qty);
    this.items.push(item);
    this.originalTotal += item.itemTotal();
    this.currentTotal += item.itemTotal();
  }

  applyDiscount(d: number): void {
    this.currentTotal -= d;
    if (this.currentTotal < 0) this.currentTotal = 0;
  }

  setLoyaltyMember(val: boolean): void {
    this.loyaltyMember = val;
  }

  setPaymentBank(bank: string): void {
    this.paymentBank = bank;
  }

  getOriginalTotal(): number {
    return this.originalTotal;
  }

  getCurrentTotal(): number {
    return this.currentTotal;
  }

  getItems(): CartItem[] {
    return this.items;
  }

  isLoyaltyMember(): boolean {
    return this.loyaltyMember;
  }

  getPaymentBank(): string {
    return this.paymentBank;
  }
}

// Coupon (Chain of Responsibility)
abstract class Coupon {
  private next: Coupon | null = null;

  setNext(coupon: Coupon): void {
    this.next = coupon;
  }

  applyDiscount(cart: Cart): void {
    if (this.isApplicable(cart)) {
      const discount = this.getDiscount(cart);
      cart.applyDiscount(discount);
      console.log(`${this.name()} applied: ${discount}`);
      if (!this.isCombinable()) return;
    }
    this.next?.applyDiscount(cart);
  }

  abstract isApplicable(cart: Cart): boolean;
  abstract getDiscount(cart: Cart): number;
  abstract name(): string;
  isCombinable(): boolean {
    return true;
  }
}

// Concrete Coupons
class SeasonalOffer extends Coupon {
  private strat: DiscountStrategy;
  constructor(private percent: number, private category: string) {
    super();
    this.strat = DiscountStrategyManager.getInstance().getStrategy(
      StrategyType.PERCENT,
      percent
    );
  }

  isApplicable(cart: Cart): boolean {
    return cart
      .getItems()
      .some((item) => item.product.category === this.category);
  }

  getDiscount(cart: Cart): number {
    const subtotal = cart
      .getItems()
      .filter((item) => item.product.category === this.category)
      .reduce((acc, item) => acc + item.itemTotal(), 0);
    return this.strat.calculate(subtotal);
  }

  name(): string {
    return `Seasonal Offer ${this.percent}% off ${this.category}`;
  }
}

class LoyaltyDiscount extends Coupon {
  private strat: DiscountStrategy;
  constructor(private percent: number) {
    super();
    this.strat = DiscountStrategyManager.getInstance().getStrategy(
      StrategyType.PERCENT,
      percent
    );
  }

  isApplicable(cart: Cart): boolean {
    return cart.isLoyaltyMember();
  }

  getDiscount(cart: Cart): number {
    return this.strat.calculate(cart.getCurrentTotal());
  }

  name(): string {
    return `Loyalty Discount ${this.percent}% off`;
  }
}

class BulkPurchaseDiscount extends Coupon {
  private strat: DiscountStrategy;
  constructor(private threshold: number, private flatOff: number) {
    super();
    this.strat = DiscountStrategyManager.getInstance().getStrategy(
      StrategyType.FLAT,
      flatOff
    );
  }

  isApplicable(cart: Cart): boolean {
    return cart.getOriginalTotal() >= this.threshold;
  }

  getDiscount(cart: Cart): number {
    return this.strat.calculate(cart.getCurrentTotal());
  }

  name(): string {
    return `Bulk Purchase Rs ${this.flatOff} off over ${this.threshold}`;
  }
}

class BankingCoupon extends Coupon {
  private strat: DiscountStrategy;
  constructor(
    private bank: string,
    private minSpend: number,
    private percent: number,
    private offCap: number
  ) {
    super();
    this.strat = DiscountStrategyManager.getInstance().getStrategy(
      StrategyType.PERCENT_WITH_CAP,
      percent,
      offCap
    );
  }

  isApplicable(cart: Cart): boolean {
    return (
      cart.getPaymentBank() === this.bank &&
      cart.getOriginalTotal() >= this.minSpend
    );
  }

  getDiscount(cart: Cart): number {
    return this.strat.calculate(cart.getCurrentTotal());
  }

  name(): string {
    return `${this.bank} Bank ${this.percent}% off upto ${this.offCap}`;
  }
}

// Coupon Manager
class CouponManager {
  private static instance: CouponManager;
  private head: Coupon | null = null;

  private constructor() {}

  static getInstance(): CouponManager {
    if (!CouponManager.instance) {
      CouponManager.instance = new CouponManager();
    }
    return CouponManager.instance;
  }

  registerCoupon(coupon: Coupon): void {
    if (!this.head) {
      this.head = coupon;
    } else {
      let cur = this.head;
      while (cur["next"]) {
        cur = cur["next"];
      }
      cur.setNext(coupon);
    }
  }

  getApplicable(cart: Cart): string[] {
    const res: string[] = [];
    let cur = this.head;
    while (cur) {
      if (cur.isApplicable(cart)) {
        res.push(cur.name());
      }
      cur = cur["next"];
    }
    return res;
  }

  applyAll(cart: Cart): number {
    this.head?.applyDiscount(cart);
    return cart.getCurrentTotal();
  }
}

// Main logic
const mgr = CouponManager.getInstance();
mgr.registerCoupon(new SeasonalOffer(10, "Clothing"));
mgr.registerCoupon(new LoyaltyDiscount(5));
mgr.registerCoupon(new BulkPurchaseDiscount(1000, 100));
mgr.registerCoupon(new BankingCoupon("ABC", 2000, 15, 500));

const p1 = new Product("Winter Jacket", "Clothing", 1000);
const p2 = new Product("Smartphone", "Electronics", 20000);
const p3 = new Product("Jeans", "Clothing", 1000);
const p4 = new Product("Headphones", "Electronics", 2000);

const cart = new Cart();
cart.addProduct(p1, 1);
cart.addProduct(p2, 1);
cart.addProduct(p3, 2);
cart.addProduct(p4, 1);
cart.setLoyaltyMember(true);
cart.setPaymentBank("ABC");

console.log(`Original Cart Total: ${cart.getOriginalTotal()} Rs`);

const applicable = mgr.getApplicable(cart);
console.log("Applicable Coupons:");
applicable.forEach((name) => console.log(` - ${name}`));

const finalTotal = mgr.applyAll(cart);
console.log(`Final Cart Total after discounts: ${finalTotal} Rs`);

export {};
