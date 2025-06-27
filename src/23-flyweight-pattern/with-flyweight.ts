class AsteroidFlyweight {
  // Intrinsic (shared) properties
  private readonly length: number;
  private readonly width: number;
  private readonly weight: number;
  private readonly color: string;
  private readonly texture: string;
  private readonly material: string;

  constructor(
    length: number,
    width: number,
    weight: number,
    color: string,
    texture: string,
    material: string
  ) {
    this.length = length;
    this.width = width;
    this.weight = weight;
    this.color = color;
    this.texture = texture;
    this.material = material;
  }

  render(
    posX: number,
    posY: number,
    velocityX: number,
    velocityY: number
  ): void {
    console.log(
      `Rendering ${this.color}, ${this.texture}, ${this.material} asteroid at (${posX},${posY})` +
        ` Size: ${this.length}x${this.width}, Weight: ${this.weight}, Velocity: (${velocityX}, ${velocityY})`
    );
  }

  static getMemoryUsage(): number {
    const intBytes = 4;
    const stringBytes = 32; // Approximate per string
    return 3 * intBytes + 3 * stringBytes;
  }
}

class AsteroidFactory {
  private static readonly flyweights: Map<string, AsteroidFlyweight> =
    new Map();

  static getAsteroid(
    length: number,
    width: number,
    weight: number,
    color: string,
    texture: string,
    material: string
  ): AsteroidFlyweight {
    const key = `${length}_${width}_${weight}_${color}_${texture}_${material}`;

    if (!this.flyweights.has(key)) {
      this.flyweights.set(
        key,
        new AsteroidFlyweight(length, width, weight, color, texture, material)
      );
    }

    return this.flyweights.get(key)!;
  }

  static getFlyweightCount(): number {
    return this.flyweights.size;
  }

  static getTotalFlyweightMemory(): number {
    return this.flyweights.size * AsteroidFlyweight.getMemoryUsage();
  }

  static cleanup(): void {
    this.flyweights.clear();
  }
}

class AsteroidContext {
  constructor(
    private flyweight: AsteroidFlyweight,
    private posX: number,
    private posY: number,
    private velocityX: number,
    private velocityY: number
  ) {}

  render(): void {
    this.flyweight.render(this.posX, this.posY, this.velocityX, this.velocityY);
  }

  static getMemoryUsage(): number {
    const pointerSize = 8; // Simulated
    const intBytes = 4;
    return pointerSize + 4 * intBytes;
  }
}

class SpaceGameWithFlyweight {
  private readonly asteroids: AsteroidContext[] = [];

  spawnAsteroids(count: number): void {
    console.log(`\n=== Spawning ${count} asteroids ===`);

    const colors = ["Red", "Blue", "Gray"];
    const textures = ["Rocky", "Metallic", "Icy"];
    const materials = ["Iron", "Stone", "Ice"];
    const sizes = [25, 35, 45];

    for (let i = 0; i < count; i++) {
      const type = i % 3;

      const flyweight = AsteroidFactory.getAsteroid(
        sizes[type],
        sizes[type],
        sizes[type] * 10,
        colors[type],
        textures[type],
        materials[type]
      );

      this.asteroids.push(
        new AsteroidContext(flyweight, 100 + i * 50, 200 + i * 30, 1, 2)
      );
    }

    console.log(`Created ${this.asteroids.length} asteroid contexts`);
    console.log(
      `Total flyweight objects: ${AsteroidFactory.getFlyweightCount()}`
    );
  }

  renderAll(): void {
    console.log("\n--- Rendering first 5 asteroids ---");
    for (let i = 0; i < Math.min(5, this.asteroids.length); i++) {
      this.asteroids[i].render();
    }
  }

  calculateMemoryUsage(): number {
    const contextMemory =
      this.asteroids.length * AsteroidContext.getMemoryUsage();
    const flyweightMemory = AsteroidFactory.getTotalFlyweightMemory();
    return contextMemory + flyweightMemory;
  }

  getAsteroidCount(): number {
    return this.asteroids.length;
  }
}

function main() {
  const ASTEROID_COUNT = 1_000_000;

  console.log("\nTESTING WITH FLYWEIGHT PATTERN");

  const game = new SpaceGameWithFlyweight();
  game.spawnAsteroids(ASTEROID_COUNT);
  game.renderAll();

  const totalMemory = game.calculateMemoryUsage();

  console.log("\n=== MEMORY USAGE ===");
  console.log(`Total asteroids: ${ASTEROID_COUNT}`);
  console.log(
    `Memory per asteroid context: ${AsteroidContext.getMemoryUsage()} bytes`
  );
  console.log(`Total memory used: ${totalMemory} bytes`);
  console.log(`Memory in MB: ${(totalMemory / (1024 * 1024)).toFixed(2)} MB`);
}

main();
