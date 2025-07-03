interface IMediator {
  registerColleague(c: Colleague): void;
  send(from: string, msg: string): void;
  sendPrivate(from: string, to: string, msg: string): void;
}

abstract class Colleague {
  protected readonly mediator: IMediator;

  constructor(m: IMediator) {
    this.mediator = m;
    this.mediator.registerColleague(this);
  }

  abstract getName(): string;
  abstract send(msg: string): void;
  abstract sendPrivate(to: string, msg: string): void;
  abstract receive(from: string, msg: string): void;
}

class ChatMediator implements IMediator {
  private readonly colleagues: Colleague[] = [];
  private readonly mutes: [string, string][] = [];

  registerColleague(c: Colleague): void {
    this.colleagues.push(c);
  }

  mute(who: string, whom: string): void {
    this.mutes.push([who, whom]);
  }

  send(from: string, msg: string): void {
    console.log(`[${from} broadcasts]: ${msg}`);
    for (const c of this.colleagues) {
      // Don't send msg to itself
      if (c.getName() === from) continue;

      // Check if message is muted
      const isMuted = this.mutes.some(
        ([muter, muted]) => from === muted && c.getName() === muter
      );

      if (!isMuted) {
        c.receive(from, msg);
      }
    }
  }

  sendPrivate(from: string, to: string, msg: string): void {
    console.log(`[${from}→${to}]: ${msg}`);
    for (const c of this.colleagues) {
      if (c.getName() === to) {
        // Check if message is muted
        const isMuted = this.mutes.some(
          ([muter, muted]) => from === muted && to === muter
        );

        if (isMuted) {
          console.log("\n[Message is muted]\n");
          return;
        }

        c.receive(from, msg);
        return;
      }
    }
    console.log(`[Mediator] User "${to}" not found]`);
  }
}

// Concrete Colleague
class User extends Colleague {
  private readonly name: string;

  constructor(name: string, mediator: IMediator) {
    super(mediator);
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  send(msg: string): void {
    this.mediator.send(this.name, msg);
  }

  sendPrivate(to: string, msg: string): void {
    this.mediator.sendPrivate(this.name, to, msg);
  }

  receive(from: string, msg: string): void {
    console.log(`    ${this.name} got from ${from}: ${msg}`);
  }
}

// Demo
function main() {
  const chatRoom = new ChatMediator();

  const user1 = new User("Rohan", chatRoom);
  const user2 = new User("Neha", chatRoom);
  const user3 = new User("Mohan", chatRoom);

  // Rohan mutes Mohan
  chatRoom.mute("Rohan", "Mohan");

  // broadcast from Rohan
  user1.send("Hello Everyone!");

  // private from Mohan to Neha
  user3.sendPrivate("Neha", "Hey Neha!");
}

main();

export {};
