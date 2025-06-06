interface IFileSystemItem {
  ls(indent?: number): void;
  openAll(indent?: number): void;
  getSize(): number;
  cd(name: string): IFileSystemItem | null;
  getName(): string;
  isFolder(): boolean;
}

class File implements IFileSystemItem {
  constructor(private readonly name: string, private readonly size: number) {}

  ls(indent: number = 0): void {
    console.log(`${" ".repeat(indent)}${this.name} (file, size=${this.size})`);
  }

  openAll(indent: number = 0): void {
    this.ls(indent);
  }

  getSize(): number {
    return this.size;
  }

  getName(): string {
    return this.name;
  }

  cd(name: string): IFileSystemItem | null {
    return null;
  }

  isFolder(): boolean {
    return false;
  }
}

class Folder implements IFileSystemItem {
  constructor(
    private readonly name: string,
    private readonly items: IFileSystemItem[] = []
  ) {}

  add(item: IFileSystemItem): void {
    this.items.push(item);
  }

  ls(indent: number = 0): void {
    console.log(`${" ".repeat(indent)}${this.name} (folder)`);
    this.items.forEach((item) => {
      console.log(
        `${" ".repeat(indent + 2)}${item.getName()} (${
          item.isFolder() ? "folder" : `file, size=${item.getSize()}`
        })`
      );
    });
  }

  openAll(indent: number = 0): void {
    console.log(`${" ".repeat(indent)}${this.name} (folder)`);
    this.items.forEach((item) => item.openAll(indent + 2));
  }

  getSize(): number {
    return this.items.reduce((sum, item) => sum + item.getSize(), 0);
  }

  getName(): string {
    return this.name;
  }

  cd(name: string): IFileSystemItem | null {
    return this.items.find((item) => item.getName() === name) || null;
  }

  isFolder(): boolean {
    return true;
  }
}

function main() {
  const root: Folder = new Folder("root");
  root.add(new File("file-1.txt", 100));
  root.add(new File("file-2.txt", 50));

  const core: Folder = new Folder("core");
  core.add(new File("file-3.txt", 130));
  core.add(new File("file-4.txt", 20));
  root.add(core);

  const user: Folder = new Folder("user");
  user.add(new File("file-5.txt", 210));
  root.add(user);

  root.ls();
  console.log("\n\n\n");

  root.openAll();
  console.log("\n\n\n");

  console.log(`Total Size of Core Folder: ${core.getSize()}`);
  console.log("\n\n\n");

  const userFolder = root.cd("user");
  if (userFolder) {
    userFolder.ls();
  }
}

main();

export {};
