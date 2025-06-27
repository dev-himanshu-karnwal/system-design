class Asteroid {
  // Intrinsic properties (duplicated across asteroids)
  private readonly length: number;
  private readonly width: number;
  private readonly weight: number;
  private readonly color: string;
  private readonly texture: string;
  private readonly material: string;

  // Extrinsic properties (unique per instance)
  private readonly posX: number;
  private readonly posY: number;
  private readonly velocityX: number;
  private readonly velocityY: number;

  constructor(
    length: number,
    width: number,
    weight: number,
    color: string,
    texture: string,
    material: string,
    posX: number,
    posY: number,
    velocityX: number,
    velocityY: number
  ) {
    this.length = length;
    this.width = width;
    this.weight = weight;
    this.color = color;
    this.texture = texture;
    this.material = material;
    this.posX = posX;
    this.posY = posY;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }

  render(): void {
    console.log(
      `Rendering ${this.color}, ${this.texture}, ${this.material} asteroid at (${this.posX}, ${this.posY})` +
        ` Size: ${this.length}x${this.width}, Weight: ${this.weight}, Velocity: (${this.velocityX}, ${this.velocityY})`
    );
  }

  static getMemoryUsage(): number {
    // Estimate based on JS object sizes
    const intBytes = 4;
    const stringOverhead = 32; // Approximate per string
    return 7 * intBytes + 3 * stringOverhead;
  }
}

class SpaceGame {
  private readonly asteroids: Asteroid[] = [];

  spawnAsteroids(count: number): void {
    console.log(`\n=== Spawning ${count} asteroids ===`);

    const colors = ["Red", "Blue", "Gray"];
    const textures = ["Rocky", "Metallic", "Icy"];
    const materials = ["Iron", "Stone", "Ice"];
    const sizes = [25, 35, 45];

    for (let i = 0; i < count; i++) {
      const type = i % 3;

      this.asteroids.push(
        new Asteroid(
          sizes[type],
          sizes[type],
          sizes[type] * 10,
          colors[type],
          textures[type],
          materials[type],
          100 + i * 50,
          200 + i * 30,
          1,
          2
        )
      );
    }

    console.log(`Created ${this.asteroids.length} asteroid objects`);
  }

  renderAll(): void {
    console.log("\n--- Rendering first 5 asteroids ---");
    for (let i = 0; i < Math.min(5, this.asteroids.length); i++) {
      this.asteroids[i].render();
    }
  }

  calculateMemoryUsage(): number {
    return this.asteroids.length * Asteroid.getMemoryUsage();
  }

  getAsteroidCount(): number {
    return this.asteroids.length;
  }
}

function main() {
  const ASTEROID_COUNT = 1_000_000;

  console.log("\n TESTING WITHOUT FLYWEIGHT PATTERN");

  const game = new SpaceGame();

  game.spawnAsteroids(ASTEROID_COUNT);
  game.renderAll();

  const totalMemory = game.calculateMemoryUsage();

  console.log("\n=== MEMORY USAGE ===");
  console.log(`Total asteroids: ${ASTEROID_COUNT}`);
  console.log(`Memory per asteroid: ${Asteroid.getMemoryUsage()} bytes`);
  console.log(`Total memory used: ${totalMemory} bytes`);
  console.log(`Memory in MB: ${(totalMemory / (1024 * 1024)).toFixed(2)} MB`);
}

main();

export {};
