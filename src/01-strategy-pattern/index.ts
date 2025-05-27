// Behavior interface — general behavior
interface Behavior {
  execute(): void;
}

// Individual strategy interfaces extending Behavior
interface Talkable extends Behavior {
  talk(): void;
}

interface Walkable extends Behavior {
  walk(): void;
}

interface Flyable extends Behavior {
  fly(): void;
}

// Concrete implementations
class NormalTalk implements Talkable {
  talk(): void {
    console.log("Talking normally...");
  }

  execute(): void {
    this.talk();
  }
}

class NoTalk implements Talkable {
  talk(): void {
    console.log("This robot cannot talk.");
  }

  execute(): void {
    this.talk();
  }
}

class NormalWalk implements Walkable {
  walk(): void {
    console.log("Walking normally...");
  }

  execute(): void {
    this.walk();
  }
}

class NoWalk implements Walkable {
  walk(): void {
    console.log("This robot cannot walk.");
  }

  execute(): void {
    this.walk();
  }
}

class NormalFly implements Flyable {
  fly(): void {
    console.log("Flying normally...");
  }

  execute(): void {
    this.fly();
  }
}

class NoFly implements Flyable {
  fly(): void {
    console.log("This robot cannot fly.");
  }

  execute(): void {
    this.fly();
  }
}

// Robot class using behavior map
class Robot {
  private behaviors: Map<string, Behavior> = new Map();

  addBehavior(name: string, behavior: Behavior): void {
    this.behaviors.set(name, behavior);
  }

  perform(name: string): void {
    const behavior = this.behaviors.get(name);
    if (behavior) {
      behavior.execute();
    } else {
      console.log(`No behavior found for: ${name}`);
    }
  }

  projection(): void {
    console.log("Projecting hologram...");
  }
}

// Extended robot type with custom projection
class CompanionR extends Robot {
  override projection(): void {
    console.log("Companion Robot: projecting emotional support...");
  }
}

const robot = new CompanionR();
robot.addBehavior("talk", new NormalTalk());
robot.addBehavior("walk", new NormalWalk());
robot.addBehavior("fly", new NoFly());

robot.perform("talk");
robot.perform("walk");
robot.perform("fly");
robot.projection();
