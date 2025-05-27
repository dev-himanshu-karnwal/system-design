import { PaymentStrategy } from "./PaymentStrategy";

export class UpiPaymentStrategy implements PaymentStrategy {
  private mobile: string;

  constructor(mobile: string) {
    this.mobile = mobile;
  }

  pay(amount: number): void {
    console.log(`Paid ₹${amount} using UPI (${this.mobile})`);
  }
}
