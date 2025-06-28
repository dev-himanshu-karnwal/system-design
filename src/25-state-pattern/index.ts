// State Interface
interface VendingState {
  insertCoin(machine: VendingMachine, coin: number): VendingState;
  selectItem(machine: VendingMachine): VendingState;
  dispense(machine: VendingMachine): VendingState;
  returnCoin(machine: VendingMachine): VendingState;
  refill(machine: VendingMachine, quantity: number): VendingState;
  getStateName(): string;
}

// Context Class - Vending Machine
class VendingMachine {
  private currentState: VendingState;
  private itemCount: number;
  private itemPrice: number;
  private insertedCoins: number;

  // State objects
  private noCoinState: VendingState;
  private hasCoinState: VendingState;
  private dispenseState: VendingState;
  private soldOutState: VendingState;

  constructor(itemCount: number, itemPrice: number) {
    this.itemCount = itemCount;
    this.itemPrice = itemPrice;
    this.insertedCoins = 0;

    // Create state objects
    this.noCoinState = new NoCoinState();
    this.hasCoinState = new HasCoinState();
    this.dispenseState = new DispenseState();
    this.soldOutState = new SoldOutState();

    // Set initial state
    this.currentState = itemCount > 0 ? this.noCoinState : this.soldOutState;
  }

  // Delegate to current state and update state based on return value
  insertCoin(coin: number): void {
    this.currentState = this.currentState.insertCoin(this, coin);
  }

  selectItem(): void {
    this.currentState = this.currentState.selectItem(this);
  }

  dispense(): void {
    this.currentState = this.currentState.dispense(this);
  }

  returnCoin(): void {
    this.currentState = this.currentState.returnCoin(this);
  }

  refill(quantity: number): void {
    this.currentState = this.currentState.refill(this, quantity);
  }

  // Print the status of Vending Machine
  printStatus(): void {
    console.log("\n--- Vending Machine Status ---");
    console.log(`Items remaining: ${this.itemCount}`);
    console.log(`Inserted coin: Rs ${this.insertedCoins}`);
    console.log(`Current state: ${this.currentState.getStateName()}\n`);
  }

  // Getters for states
  getNoCoinState(): VendingState {
    return this.noCoinState;
  }

  getHasCoinState(): VendingState {
    return this.hasCoinState;
  }

  getDispenseState(): VendingState {
    return this.dispenseState;
  }

  getSoldOutState(): VendingState {
    return this.soldOutState;
  }

  // Data access methods
  getItemCount(): number {
    return this.itemCount;
  }

  decrementItemCount(): void {
    this.itemCount--;
  }

  incrementItemCount(count: number = 1): void {
    this.itemCount += count;
  }

  getInsertedCoin(): number {
    return this.insertedCoins;
  }

  setInsertedCoin(coin: number): void {
    this.insertedCoins = coin;
  }

  addCoin(coin: number): void {
    this.insertedCoins += coin;
  }

  getPrice(): number {
    return this.itemPrice;
  }

  setPrice(itemPrice: number): void {
    this.itemPrice = itemPrice;
  }
}

// Concrete State: No Coin Inserted
class NoCoinState implements VendingState {
  insertCoin(machine: VendingMachine, coin: number): VendingState {
    machine.setInsertedCoin(coin); // Rs 10
    console.log(`Coin inserted. Current balance: Rs ${coin}`);
    return machine.getHasCoinState(); // Transition to HasCoinState
  }

  selectItem(machine: VendingMachine): VendingState {
    console.log("Please insert coin first!");
    return machine.getNoCoinState(); // Stay in same state
  }

  dispense(machine: VendingMachine): VendingState {
    console.log("Please insert coin and select item first!");
    return machine.getNoCoinState(); // Stay in same state
  }

  returnCoin(machine: VendingMachine): VendingState {
    console.log("No coin to return!");
    return machine.getNoCoinState(); // Stay in same state
  }

  refill(machine: VendingMachine, quantity: number): VendingState {
    console.log("Items refilling");
    machine.incrementItemCount(quantity);
    return machine.getNoCoinState(); // Stay in same state
  }

  getStateName(): string {
    return "NO_COIN";
  }
}

// Concrete State: Coin Inserted
class HasCoinState implements VendingState {
  insertCoin(machine: VendingMachine, coin: number): VendingState {
    machine.addCoin(coin);
    console.log(
      `Additional coin inserted. Current balance: Rs ${machine.getInsertedCoin()}`
    );
    return machine.getHasCoinState(); // Stay in same state
  }

  selectItem(machine: VendingMachine): VendingState {
    if (machine.getInsertedCoin() >= machine.getPrice()) {
      console.log("Item selected. Dispensing...");

      const change = machine.getInsertedCoin() - machine.getPrice();
      if (change > 0) {
        console.log(`Change returned: Rs ${change}`);
      }
      machine.setInsertedCoin(0);

      return machine.getDispenseState(); // Transition to DispenseState
    } else {
      const needed = machine.getPrice() - machine.getInsertedCoin();
      console.log(`Insufficient funds. Need Rs ${needed} more.`);
      return machine.getHasCoinState(); // Stay in same state
    }
  }

  dispense(machine: VendingMachine): VendingState {
    console.log("Please select an item first!");
    return machine.getHasCoinState(); // Stay in same state
  }

  returnCoin(machine: VendingMachine): VendingState {
    console.log(`Coin returned: Rs ${machine.getInsertedCoin()}`);
    machine.setInsertedCoin(0);
    return machine.getNoCoinState(); // Transition to NoCoinState
  }

  refill(machine: VendingMachine, quantity: number): VendingState {
    console.log("Can't refill in this state");
    return machine.getHasCoinState(); // Stay in same state
  }

  getStateName(): string {
    return "HAS_COIN";
  }
}

// Concrete State: Item Sold
class DispenseState implements VendingState {
  insertCoin(machine: VendingMachine, coin: number): VendingState {
    console.log(
      `Please wait, already dispensing item. Coin returned: Rs ${coin}`
    );
    return machine.getDispenseState(); // Stay in same state
  }

  selectItem(machine: VendingMachine): VendingState {
    console.log("Already dispensing item. Please wait.");
    return machine.getDispenseState(); // Stay in same state
  }

  dispense(machine: VendingMachine): VendingState {
    console.log("Item dispensed!");
    machine.decrementItemCount();

    if (machine.getItemCount() > 0) {
      return machine.getNoCoinState(); // Transition to NoCoinState
    } else {
      console.log("Machine is now sold out!");
      return machine.getSoldOutState(); // Transition to SoldOutState
    }
  }

  returnCoin(machine: VendingMachine): VendingState {
    console.log("Cannot return coin while dispensing item!");
    return machine.getDispenseState(); // Stay in same state
  }

  refill(machine: VendingMachine, quantity: number): VendingState {
    console.log("Can't refill in this state");
    return machine.getDispenseState(); // Stay in same state
  }

  getStateName(): string {
    return "DISPENSING";
  }
}

// Concrete State: Sold Out
class SoldOutState implements VendingState {
  insertCoin(machine: VendingMachine, coin: number): VendingState {
    console.log(`Machine is sold out. Coin returned: Rs ${coin}`);
    return machine.getSoldOutState(); // Stay in same state
  }

  selectItem(machine: VendingMachine): VendingState {
    console.log("Machine is sold out!");
    return machine.getSoldOutState(); // Stay in same state
  }

  dispense(machine: VendingMachine): VendingState {
    console.log("Machine is sold out!");
    return machine.getSoldOutState(); // Stay in same state
  }

  returnCoin(machine: VendingMachine): VendingState {
    console.log("Machine is sold out. No coin inserted.");
    return machine.getSoldOutState(); // Stay in same state
  }

  refill(machine: VendingMachine, quantity: number): VendingState {
    console.log("Items refilling");
    machine.incrementItemCount(quantity);
    return machine.getNoCoinState();
  }

  getStateName(): string {
    return "SOLD_OUT";
  }
}

// Main function
function main() {
  console.log("=== Water Bottle VENDING MACHINE ===");

  const itemCount = 2;
  const itemPrice = 20;

  const machine = new VendingMachine(itemCount, itemPrice);
  machine.printStatus();

  // Test scenarios - each operation potentially changes state
  console.log("1. Trying to select item without coin:");
  machine.selectItem(); // Should ask for coin, no state change
  machine.printStatus();

  console.log("2. Inserting coin:");
  machine.insertCoin(10); // State changes to HAS_COIN
  machine.printStatus();

  console.log("3. Selecting item with insufficient funds:");
  machine.selectItem(); // Insufficient funds, stays in HAS_COIN
  machine.printStatus();

  console.log("4. Adding more coins:");
  machine.insertCoin(10); // Add more money, stays in HAS_COIN
  machine.printStatus();

  console.log("5. Selecting item Now");
  machine.selectItem(); // State changes to SOLD
  machine.printStatus();

  console.log("6. Dispensing item:");
  machine.dispense(); // State changes to NO_COIN (items remaining)
  machine.printStatus();

  console.log("7. Buying last item:");
  machine.insertCoin(20); // State changes to HAS_COIN
  machine.selectItem(); // State changes to SOLD
  machine.dispense(); // State changes to SOLD_OUT (no items left)
  machine.printStatus();

  console.log("8. Trying to use sold out machine:");
  machine.insertCoin(5); // Coin returned, stays in SOLD_OUT

  console.log("9. Trying to use sold out machine:");
  machine.refill(2);
  machine.printStatus(); // State changes NO_COIN
}

// Run the program
main();

export {};
