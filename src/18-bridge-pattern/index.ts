// Engine interface (Implementation hierarchy - LLL)
interface Engine {
    start(): void;
}

// Concrete Implementors (LLL)
class PetrolEngine implements Engine {
    start(): void {
        console.log("Petrol engine starting with ignition!");
    }
}

class DieselEngine implements Engine {
    start(): void {
        console.log("Diesel engine roaring to life!");
    }
}

class ElectricEngine implements Engine {
    start(): void {
        console.log("Electric engine powering up silently!");
    }
}

// Car abstraction (Abstraction hierarchy - HLL)
abstract class Car {
    protected engine: Engine;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    abstract drive(): void;
}

// Refined Abstractions
class Sedan extends Car {
    drive(): void {
        this.engine.start();
        console.log("Driving a Sedan on the highway.");
    }
}

class SUV extends Car {
    drive(): void {
        this.engine.start();
        console.log("Driving an SUV off-road.");
    }
}


function main(): void {
    const petrolEng: Engine = new PetrolEngine();
    const dieselEng: Engine = new DieselEngine();
    const electricEng: Engine = new ElectricEngine();

    const mySedan: Car = new Sedan(petrolEng);
    const mySUV: Car = new SUV(electricEng);
    const yourSUV: Car = new SUV(dieselEng); 

    mySedan.drive();   // Petrol engine + Sedan
    mySUV.drive();     // Electric engine + SUV
    yourSUV.drive();   // Diesel engine + SUV
}

main();


export {}