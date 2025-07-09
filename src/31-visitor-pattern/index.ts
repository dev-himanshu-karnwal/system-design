// Visitor Interface
interface FileSystemVisitor {
  visitTextFile(file: TextFile): void;
  visitImageFile(file: ImageFile): void;
  visitVideoFile(file: VideoFile): void;
}

abstract class FileSystemItem {
  protected name: string;

  constructor(itemName: string) {
    this.name = itemName;
  }

  getName(): string {
    return this.name;
  }

  abstract accept(visitor: FileSystemVisitor): void;
}

class TextFile extends FileSystemItem {
  private content: string;

  constructor(fileName: string, fileContent: string) {
    super(fileName);
    this.content = fileContent;
  }

  getContent(): string {
    return this.content;
  }

  accept(visitor: FileSystemVisitor): void {
    visitor.visitTextFile(this);
  }
}

class ImageFile extends FileSystemItem {
  constructor(fileName: string) {
    super(fileName);
  }

  accept(visitor: FileSystemVisitor): void {
    visitor.visitImageFile(this);
  }
}

class VideoFile extends FileSystemItem {
  constructor(fileName: string) {
    super(fileName);
  }

  accept(visitor: FileSystemVisitor): void {
    visitor.visitVideoFile(this);
  }
}

// 1. Size calculation visitor
class SizeCalculationVisitor implements FileSystemVisitor {
  visitTextFile(file: TextFile): void {
    console.log(`Calculating size for TEXT file: ${file.getName()}`);
  }

  visitImageFile(file: ImageFile): void {
    console.log(`Calculating size for IMAGE file: ${file.getName()}`);
  }

  visitVideoFile(file: VideoFile): void {
    console.log(`Calculating size for VIDEO file: ${file.getName()}`);
  }
}

// 2. Compression Visitor
class CompressionVisitor implements FileSystemVisitor {
  visitTextFile(file: TextFile): void {
    console.log(`Compressing TEXT file: ${file.getName()}`);
  }

  visitImageFile(file: ImageFile): void {
    console.log(`Compressing IMAGE file: ${file.getName()}`);
  }

  visitVideoFile(file: VideoFile): void {
    console.log(`Compressing VIDEO file: ${file.getName()}`);
  }
}

// 3. Virus Scanning Visitor
class VirusScanningVisitor implements FileSystemVisitor {
  visitTextFile(file: TextFile): void {
    console.log(`Scanning TEXT file: ${file.getName()}`);
  }

  visitImageFile(file: ImageFile): void {
    console.log(`Scanning IMAGE file: ${file.getName()}`);
  }

  visitVideoFile(file: VideoFile): void {
    console.log(`Scanning VIDEO file: ${file.getName()}`);
  }
}

function main() {
  const img1: FileSystemItem = new ImageFile("sample.jpg");

  img1.accept(new SizeCalculationVisitor());
  img1.accept(new CompressionVisitor());
  img1.accept(new VirusScanningVisitor());

  const vid1: FileSystemItem = new VideoFile("test.mp4");
  vid1.accept(new CompressionVisitor());
}

main();

export {};
