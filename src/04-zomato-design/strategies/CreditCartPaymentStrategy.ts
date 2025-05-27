import { PaymentStrategy } from "./PaymentStrategy";

export class CreditCardPaymentStrategy implements PaymentStrategy {
  private cardNumber: string;

  constructor(cardNumber: string) {
    this.cardNumber = cardNumber;
  }

  pay(amount: number): void {
    console.log(`Paid ₹${amount} using Credit Card (${this.cardNumber})`);
  }
}
