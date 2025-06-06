interface ICharacter {
  getAbilities(): string;
}

class Mario implements ICharacter {
  getAbilities(): string {
    return "Mario";
  }
}

interface IAbilityDecorator extends ICharacter {}

class HeightUpDecorator implements IAbilityDecorator {
  constructor(private character: ICharacter) {}

  getAbilities(): string {
    return `${this.character.getAbilities()}, can jump`;
  }
}

class GunPowerDecorator implements IAbilityDecorator {
  constructor(private character: ICharacter) {}

  getAbilities(): string {
    return `${this.character.getAbilities()}, has gun power`;
  }
}

class StarDecorator implements IAbilityDecorator {
  constructor(private character: ICharacter) {}

  getAbilities(): string {
    return `${this.character.getAbilities()}, has Star power`;
  }
}

function main() {
  // Create a basic Mario character.
  let mario: ICharacter = new Mario();
  console.log(`Basic Character: ${mario.getAbilities()}`);

  // Decorate Mario with a HeightUp power-up.
  mario = new HeightUpDecorator(mario);
  console.log(`After HeightUp: ${mario.getAbilities()}`);

  // Decorate Mario further with a GunPowerUp.
  mario = new GunPowerDecorator(mario);
  console.log(`After GunPowerUp: ${mario.getAbilities()}`);

  // Finally, add a StarPowerUp decoration.
  mario = new StarDecorator(mario);
  console.log(`After StarPowerUp: ${mario.getAbilities()}`);
}

main();

export {};
