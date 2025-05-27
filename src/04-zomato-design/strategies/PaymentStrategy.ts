export abstract class PaymentStrategy {
  public abstract pay(amount: number): void;
}
