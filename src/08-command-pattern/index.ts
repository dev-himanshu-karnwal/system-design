interface ICommand {
  execute(): void;
  undo(): void;
}

class Light {
  on(): void {
    console.log("Light is now ON");
  }

  off(): void {
    console.log("Light is now OFF");
  }
}

class LightCommand implements ICommand {
  constructor(private light: Light) {}

  execute(): void {
    this.light.on();
  }

  undo(): void {
    this.light.off();
  }
}

class Fan {
  on(): void {
    console.log("Fan is now ON");
  }

  off(): void {
    console.log("Fan is now OFF");
  }
}

class FanCommand implements ICommand {
  constructor(private fan: Fan) {}

  execute(): void {
    this.fan.on();
  }

  undo(): void {
    this.fan.off();
  }
}

class Remote {
  static readonly BUTTON_COUNT = 3;
  private readonly buttons: { command: ICommand; pressed: boolean }[] = [];

  constructor() {
    // Initialize all buttons with dummy commands
    for (let i = 0; i < Remote.BUTTON_COUNT; i++) {
      this.buttons[i] = {
        command: {
          execute: () => console.log(`Button ${i} has no command`),
          undo: () => console.log(`Button ${i} has no undo command`),
        },
        pressed: false,
      };
    }
  }

  setCommand(slot: number, command: ICommand): void {
    if (slot >= 0 && slot < Remote.BUTTON_COUNT) {
      this.buttons[slot].command = command;
    } else {
      console.error(`Invalid slot index: ${slot}`);
    }
  }

  pressButton(slot: number): void {
    if (slot < 0 || slot >= Remote.BUTTON_COUNT) {
      return console.error(`Invalid button index: ${slot}`);
    }

    const button = this.buttons[slot];
    if (button.pressed) {
      button.command.undo();
    } else {
      button.command.execute();
    }

    button.pressed = !button.pressed;
  }
}

function main() {
  const lightCommand = new LightCommand(new Light());
  const fanCommand = new FanCommand(new Fan());

  const remote = new Remote();
  remote.setCommand(0, lightCommand);
  remote.setCommand(1, fanCommand);

  remote.pressButton(0); // Light ON
  remote.pressButton(0); // Light OFF
  remote.pressButton(1); // No command
}

main();

export {};
