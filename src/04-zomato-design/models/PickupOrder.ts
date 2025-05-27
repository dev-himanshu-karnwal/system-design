import { Order } from "./Order";

export class PickupOrder extends Order {
  private _restaurantAddress: string = "";

  constructor() {
    super();
  }

  // Override abstract getter from base class
  get type(): string {
    return "Pickup";
  }

  // Getter and Setter for restaurantAddress
  get restaurantAddress(): string {
    return this._restaurantAddress;
  }

  set restaurantAddress(addr: string) {
    this._restaurantAddress = addr;
  }
}
