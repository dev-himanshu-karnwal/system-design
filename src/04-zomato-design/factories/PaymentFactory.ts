import { PaymentStrategy } from "../strategies/PaymentStrategy";
import { UpiPaymentStrategy } from "../strategies/UpiPaymentStrategy";
import { CreditCardPaymentStrategy } from "../strategies/CreditCartPaymentStrategy";

export class PaymentFactory {
  static createPaymentStrategy(
    type: string,
    credential: string
  ): PaymentStrategy {
    switch (type.toLowerCase()) {
      case "upi":
        return new UpiPaymentStrategy(credential);
      case "credit":
      case "creditcard":
        return new CreditCardPaymentStrategy(credential);
      default:
        throw new Error(`Unsupported payment type: ${type}`);
    }
  }
}
