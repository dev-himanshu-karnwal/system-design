// Abstract Handler (Base Class)
abstract class MoneyHandler {
  protected nextHandler: MoneyHandler | null;

  constructor() {
    this.nextHandler = null;
  }

  setNextHandler(next: MoneyHandler): void {
    this.nextHandler = next;
  }

  protected handleDispense(
    amount: number,
    denomination: number,
    noteType: string,
    availableNotes: number
  ): { remainingAmount: number; remainingNotes: number } {
    let notesNeeded = Math.floor(amount / denomination);

    if (notesNeeded > availableNotes) {
      notesNeeded = availableNotes;
      availableNotes = 0;
    } else {
      availableNotes -= notesNeeded;
    }

    if (notesNeeded > 0) {
      console.log(`Dispensing ${notesNeeded} x ₹${denomination} ${noteType}.`);
    }

    const remainingAmount = amount - notesNeeded * denomination;
    return { remainingAmount, remainingNotes: availableNotes };
  }

  abstract dispense(amount: number): void;
}

class ThousandHandler extends MoneyHandler {
  private numNotes: number;

  constructor(numNotes: number) {
    super();
    this.numNotes = numNotes;
  }

  dispense(amount: number): void {
    const { remainingAmount, remainingNotes } = this.handleDispense(
      amount,
      1000,
      "notes",
      this.numNotes
    );
    this.numNotes = remainingNotes;

    if (remainingAmount > 0) {
      if (this.nextHandler !== null) {
        this.nextHandler.dispense(remainingAmount);
      } else {
        console.log(
          `Remaining amount of ₹${remainingAmount} cannot be fulfilled (Insufficient funds in ATM)`
        );
      }
    }
  }
}

class FiveHundredHandler extends MoneyHandler {
  private numNotes: number;

  constructor(numNotes: number) {
    super();
    this.numNotes = numNotes;
  }

  dispense(amount: number): void {
    const { remainingAmount, remainingNotes } = this.handleDispense(
      amount,
      500,
      "notes",
      this.numNotes
    );
    this.numNotes = remainingNotes;

    if (remainingAmount > 0) {
      if (this.nextHandler !== null) {
        this.nextHandler.dispense(remainingAmount);
      } else {
        console.log(
          `Remaining amount of ₹${remainingAmount} cannot be fulfilled (Insufficient funds in ATM)`
        );
      }
    }
  }
}

class TwoHundredHandler extends MoneyHandler {
  private numNotes: number;

  constructor(numNotes: number) {
    super();
    this.numNotes = numNotes;
  }

  dispense(amount: number): void {
    const { remainingAmount, remainingNotes } = this.handleDispense(
      amount,
      200,
      "notes",
      this.numNotes
    );
    this.numNotes = remainingNotes;

    if (remainingAmount > 0) {
      if (this.nextHandler !== null) {
        this.nextHandler.dispense(remainingAmount);
      } else {
        console.log(
          `Remaining amount of ₹${remainingAmount} cannot be fulfilled (Insufficient funds in ATM)`
        );
      }
    }
  }
}

class HundredHandler extends MoneyHandler {
  private numNotes: number;

  constructor(numNotes: number) {
    super();
    this.numNotes = numNotes;
  }

  dispense(amount: number): void {
    const { remainingAmount, remainingNotes } = this.handleDispense(
      amount,
      100,
      "notes",
      this.numNotes
    );
    this.numNotes = remainingNotes;

    if (remainingAmount > 0) {
      if (this.nextHandler !== null) {
        this.nextHandler.dispense(remainingAmount);
      } else {
        console.log(
          `Remaining amount of ₹${remainingAmount} cannot be fulfilled (Insufficient funds in ATM)`
        );
      }
    }
  }
}

// Client Code
function main() {
  // Creating handlers for each note type
  const thousandHandler = new ThousandHandler(3);
  const fiveHundredHandler = new FiveHundredHandler(5);
  const twoHundredHandler = new TwoHundredHandler(10);
  const hundredHandler = new HundredHandler(20);

  // Setting up the chain of responsibility
  thousandHandler.setNextHandler(fiveHundredHandler);
  fiveHundredHandler.setNextHandler(twoHundredHandler);
  twoHundredHandler.setNextHandler(hundredHandler);

  const amountToWithdraw = 4000;

  // Initiating the chain
  console.log(`\nDispensing amount: ₹${amountToWithdraw}`);
  thousandHandler.dispense(amountToWithdraw);
}

main();


export {}