export interface ISubscriber {
  update(): void;
}

export interface IChannel {
  subscribe(subscriber: ISubscriber): void;
  unsubscribe(subscriber: ISubscriber): void;
  notifySubscribers(): void;
}

export class Channel implements IChannel {
  private readonly name: string;
  private latestVideo: string = "";
  private subscribers: ISubscriber[] = [];

  constructor(name: string) {
    this.name = name;
  }

  subscribe(subscriber: ISubscriber): void {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
    }
  }

  unsubscribe(subscriber: ISubscriber): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  notifySubscribers(): void {
    this.subscribers.forEach((sub) => sub.update());
  }

  uploadVideo(title: string): void {
    this.latestVideo = title;
    console.log(`\n[${this.name} uploaded "${title}"]`);
    this.notifySubscribers();
  }

  getVideoData(): string {
    return `\nCheckout our new Video: ${this.latestVideo}\n`;
  }
}

export class Subscriber implements ISubscriber {
  private name: string;
  private channel: Channel;

  constructor(name: string, channel: Channel) {
    this.name = name;
    this.channel = channel;
  }

  update(): void {
    console.log(`Hey ${this.name},${this.channel.getVideoData()}`);
  }
}

function main(): void {
  const channel = new Channel("Channel -> 1");

  const subs1 = new Subscriber("User-1", channel);
  const subs2 = new Subscriber("User-2", channel);

  channel.subscribe(subs1);
  channel.subscribe(subs2);

  channel.uploadVideo("Video ABC");

  channel.unsubscribe(subs1);

  channel.uploadVideo("Video XYZ");
}

main();
