import { MenuItem } from "./MenuItem";
import { Restaurant } from "./Restaurant";

export class Cart {
  private _restaurant: Restaurant | null = null;
  private _items: MenuItem[] = [];

  constructor() {}

  addItem(item: MenuItem): void {
    if (!this._restaurant) {
      console.error("Cart: Set a restaurant before adding items.");
      return;
    }
    this._items.push(item);
  }

  getTotalCost(): number {
    return this._items.reduce((sum, item) => sum + item.price, 0);
  }

  isEmpty(): boolean {
    return !this._restaurant || this._items.length === 0;
  }

  clear(): void {
    this._items = [];
    this._restaurant = null;
  }

  // Getters and Setters
  get restaurant(): Restaurant | null {
    return this._restaurant;
  }

  set restaurant(r: Restaurant | null) {
    this._restaurant = r;
  }


  get items(): MenuItem[] {
    return this._items;
  }
}
