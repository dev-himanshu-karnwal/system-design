enum VehicleType {
  BIKE = "BIKE",
  CAR = "CAR",
  TRUCK = "TRUCK",
}

enum SlotType {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

class Vehicle {
  constructor(
    private readonly number: string,
    private readonly type: VehicleType
  ) {
    console.log(`Vehicle created: ${this.number}, Type: ${this.type}`);
  }
}

class Slot {
  constructor(
    private readonly number: number,
    public readonly type: SlotType,
    private allocatedVehicle: Vehicle | null = null
  ) {
    console.log(`Slot initialized: Number ${this.number}, Type: ${this.type}`);
  }

  isType(type: SlotType): boolean {
    return this.type === type;
  }

  isVacant(): boolean {
    return this.allocatedVehicle === null;
  }

  assignVehicle(vehicle: Vehicle) {
    this.allocatedVehicle = vehicle;
    console.log(`Vehicle assigned to Slot ${this.number}`);
  }

  freeSlot() {
    console.log(`Slot ${this.number} is now freed`);
    this.allocatedVehicle = null;
  }
}

class Floor {
  constructor(
    private readonly number: number,
    private readonly slots: Slot[] = []
  ) {
    console.log(`Floor ${this.number} initialized`);
  }

  getAvailableSlots(type: SlotType) {
    const available = this.slots.filter(
      (slot) => slot.isType(type) && slot.isVacant()
    );
    console.log(
      `Available slots for ${type} on Floor ${this.number}: ${available.length}`
    );
    return available;
  }

  addSlot(slot: Slot) {
    console.log(`Slot ${slot} added to Floor ${this.number}`);
    this.slots.push(slot);
  }
}

class Ticket {
  readonly id: string;
  private entryTime: Date;

  constructor(private readonly vehicle: Vehicle, public readonly slot: Slot) {
    this.id = (Date.now() + Math.random()).toString();
    this.entryTime = new Date();
    console.log(`Ticket generated: ID ${this.id}`);
  }

  getEntryTime(): Date {
    return this.entryTime;
  }
}

class Bill {
  constructor(
    private readonly ticket: Ticket,
    private readonly amount: number
  ) {
    console.log(
      `Bill generated for Ticket ${ticket.id}: Amount ${this.amount}`
    );
  }
}

class TicketService {
  private static instance: TicketService;
  private readonly tickets: Ticket[] = [];

  private constructor() {}

  static getInstance() {
    if (!TicketService.instance) {
      TicketService.instance = new TicketService();
      console.log("TicketService instance created");
    }

    return TicketService.instance;
  }

  generateTicket(vehicle: Vehicle, slot: Slot): Ticket {
    const ticket = new Ticket(vehicle, slot);
    this.tickets.push(ticket);
    return ticket;
  }

  getTicket(id: string): Ticket | null {
    console.log(`Fetching ticket with ID: ${id}`);
    return this.tickets.find((ticket) => ticket.id === id) || null;
  }

  removeTicket(ticket: Ticket) {
    this.tickets.splice(this.tickets.indexOf(ticket), 1);
    console.log(`Ticket ${ticket.id} removed`);
  }
}

class BillingService {
  private static instance: BillingService;
  private readonly rates = {
    [SlotType.SMALL]: 10,
    [SlotType.MEDIUM]: 20,
    [SlotType.LARGE]: 30,
  };

  private constructor() {}

  static getInstance() {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
      console.log("BillingService instance created");
    }

    return BillingService.instance;
  }

  calculateBill(ticket: Ticket): Bill {
    const now = new Date();
    const diffInMs = now.getTime() - ticket.getEntryTime().getTime();
    const hours = Math.ceil(diffInMs / (1000 * 60 * 60)); // round up
    const amount = hours * this.rates[ticket.slot.type];
    console.log(
      `Calculating bill: ${hours} hour(s), Rate: ${
        this.rates[ticket.slot.type]
      }, Total: ${amount}`
    );
    return new Bill(ticket, amount);
  }
}

class SlotAllocator {
  private static instance: SlotAllocator;

  private constructor() {}

  static getInstance() {
    if (!SlotAllocator.instance) {
      SlotAllocator.instance = new SlotAllocator();
      console.log("SlotAllocator instance created");
    }

    return SlotAllocator.instance;
  }

  allocateSlot(floors: Floor[], type: SlotType, vehicle: Vehicle) {
    console.log(`Allocating slot for vehicle of type ${type}`);
    for (const floor of floors) {
      const slots = floor.getAvailableSlots(type);
      for (const slot of slots) {
        if (slot.isVacant()) {
          slot.assignVehicle(vehicle);
          console.log(`Slot ${slot} allocated`);
          return slot;
        }
      }
    }

    console.log("No available slot found");
    return null;
  }
}

class ParkingLot {
  private static instance: ParkingLot;
  private readonly floors: Floor[] = [];
  private readonly ticketService: TicketService = TicketService.getInstance();
  private readonly billingService: BillingService =
    BillingService.getInstance();

  private constructor() {
    console.log("ParkingLot instance created");
  }

  static getInstance() {
    if (!ParkingLot.instance) {
      ParkingLot.instance = new ParkingLot();
    }

    return ParkingLot.instance;
  }

  addFloor(floor: Floor) {
    this.floors.push(floor);
    console.log(`Floor ${floor} added to ParkingLot`);
  }

  assignVehicle(vehicle: Vehicle, slotType: SlotType): Ticket | null {
    console.log(`Assigning vehicle to slot of type ${slotType}`);
    const slot = SlotAllocator.getInstance().allocateSlot(
      this.floors,
      slotType,
      vehicle
    );

    if (!slot) {
      console.log("No slot available");
      return null;
    }

    const ticket = this.ticketService.generateTicket(vehicle, slot);
    console.log("Ticket issued:", ticket.id);
    return ticket;
  }

  getBill(ticket: Ticket): Bill {
    console.log(`Generating bill for Ticket ${ticket.id}`);
    const bill = this.billingService.calculateBill(ticket);
    this.ticketService.removeTicket(ticket);
    ticket.slot.freeSlot();
    return bill;
  }

  initialize() {
    console.log("Initializing ParkingLot...");
    const floor = new Floor(1);
    floor.addSlot(new Slot(1, SlotType.SMALL));
    floor.addSlot(new Slot(2, SlotType.SMALL));
    floor.addSlot(new Slot(3, SlotType.MEDIUM));
    floor.addSlot(new Slot(4, SlotType.SMALL));
    floor.addSlot(new Slot(5, SlotType.LARGE));
    floor.addSlot(new Slot(6, SlotType.MEDIUM));
    this.addFloor(floor);
    console.log("ParkingLot initialized with one floor and 6 slots.");
  }
}

function main() {
  console.log("=== Parking Lot System Started ===");

  const parkingLot = ParkingLot.getInstance();
  parkingLot.initialize();

  const vehicles = [
    new Vehicle("KA-01-HH-1234", VehicleType.CAR),
    new Vehicle("KA-02-HH-5678", VehicleType.BIKE),
    new Vehicle("KA-03-HH-9999", VehicleType.TRUCK),
    new Vehicle("KA-04-HH-4321", VehicleType.CAR),
  ];

  const requiredSlotTypes = {
    [VehicleType.BIKE]: SlotType.SMALL,
    [VehicleType.CAR]: SlotType.MEDIUM,
    [VehicleType.TRUCK]: SlotType.LARGE,
  };

  const tickets: Ticket[] = [];

  // Assign all vehicles
  vehicles.forEach((vehicle) => {
    const slotType = requiredSlotTypes[vehicle["type"]];
    console.log(
      `\n>>> Trying to park vehicle: ${vehicle["type"]} - ${vehicle["number"]}`
    );
    const ticket = parkingLot.assignVehicle(vehicle, slotType);

    if (ticket) {
      console.log(
        `✅ Vehicle parked successfully! Ticket ID: ${ticket.id}, Slot Type: ${ticket.slot.type}`
      );
      tickets.push(ticket);
    } else {
      console.log(`❌ No available slot for vehicle ${vehicle["number"]}`);
    }
  });

  // Simulate vehicle exits after 2 seconds
  setTimeout(() => {
    console.log("\n=== Generating Bills for Parked Vehicles ===");
    tickets.forEach((ticket) => {
      const bill = parkingLot.getBill(ticket);
      console.log(`\n💰 Bill for Vehicle: ${ticket["vehicle"]["number"]}`);
      console.log(`Ticket ID: ${ticket.id}`);
      console.log(`Slot Type: ${ticket.slot.type}`);
      console.log(`Total Amount: ${bill["amount"]}`);
    });
    console.log("\n=== Parking Lot System End ===");
  }, 2000);
}

main();

export {};
