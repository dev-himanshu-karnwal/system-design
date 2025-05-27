import { Cart } from "./Cart";

export class User {
  private _userId: number;
  private _name: string;
  private _address: string;
  private _cart: Cart;

  constructor(userId: number, name: string, address: string) {
    this._userId = userId;
    this._name = name;
    this._address = address;
    this._cart = new Cart();
  }

  // Getters and Setters
  get name(): string {
    return this._name;
  }

  set name(n: string) {
    this._name = n;
  }

  get address(): string {
    return this._address;
  }

  set address(a: string) {
    this._address = a;
  }

  get cart(): Cart {
    return this._cart;
  }

  get userId(): number {
    return this._userId;
  }
}
