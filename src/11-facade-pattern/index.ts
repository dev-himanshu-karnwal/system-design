// Subsystems
class PowerSupply {
  providePower(): void {
    console.log("Power Supply: Providing power...");
  }
}

class CoolingSystem {
  startFans(): void {
    console.log("Cooling System: Fans started...");
  }
}

class CPU {
  initialize(): void {
    console.log("CPU: Initialization started...");
  }
}

class Memory {
  selfTest(): void {
    console.log("Memory: Self-test passed...");
  }
}

class HardDrive {
  spinUp(): void {
    console.log("Hard Drive: Spinning up...");
  }
}

class BIOS {
  boot(cpu: CPU, memory: Memory): void {
    console.log("BIOS: Booting CPU and Memory checks...");
    cpu.initialize();
    memory.selfTest();
  }
}

class OperatingSystem {
  load(): void {
    console.log("Operating System: Loading into memory...");
  }
}

// Facade
class ComputerFacade {
  private powerSupply: PowerSupply = new PowerSupply();
  private coolingSystem: CoolingSystem = new CoolingSystem();
  private cpu: CPU = new CPU();
  private memory: Memory = new Memory();
  private hardDrive: HardDrive = new HardDrive();
  private bios: BIOS = new BIOS();
  private os: OperatingSystem = new OperatingSystem();

  startComputer(): void {
    console.log("----- Starting Computer -----");
    this.powerSupply.providePower();
    this.coolingSystem.startFans();
    this.bios.boot(this.cpu, this.memory);
    this.hardDrive.spinUp();
    this.os.load();
    console.log("Computer Booted Successfully!");
  }
}

// Client
function main() {
  const computer = new ComputerFacade();
  computer.startComputer();
}

main();

export {};
