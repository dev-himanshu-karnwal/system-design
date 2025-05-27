import { MenuItem } from "./MenuItem";

export class Restaurant {
  private static nextRestaurantId = 0;
  private restaurantId: number;
  private _name: string;
  private _location: string;
  private _menu: MenuItem[] = [];

  constructor(name: string, location: string) {
    this._name = name;
    this._location = location;
    this.restaurantId = ++Restaurant.nextRestaurantId;
  }

  // Getters and Setters
  get name(): string {
    return this._name;
  }

  set name(n: string) {
    this._name = n;
  }

  get location(): string {
    return this._location;
  }

  set location(loc: string) {
    this._location = loc;
  }

  get menu(): MenuItem[] {
    return this._menu;
  }

  addMenuItem(item: MenuItem): void {
    this._menu.push(item);
  }

  // Optional: simulate destructor-like cleanup
  destroy(): void {
    console.log(`Destroying Restaurant: ${this._name}, and clearing its menu.`);
    this._menu = [];
  }
}
