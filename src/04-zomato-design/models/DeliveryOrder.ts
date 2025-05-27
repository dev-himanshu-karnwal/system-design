import { Order } from "./Order";

export class DeliveryOrder extends Order {
  private _userAddress: string = "";

  constructor() {
    super();
  }

  get type(): string {
    return "Delivery";
  }

  get userAddress(): string {
    return this._userAddress;
  }

  set userAddress(addr: string) {
    this._userAddress = addr;
  }
}
