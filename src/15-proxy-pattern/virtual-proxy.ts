interface IImage {
  display(): void;
}

class RealImage implements IImage {
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
    // Heavy operation
    console.log(`[RealImage] Loading image from disk: ${this.filename}`);
  }

  display(): void {
    console.log(`[RealImage] Displaying ${this.filename}`);
  }
}

class ImageProxy implements IImage {
  private realImage: RealImage | null = null;
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  display(): void {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }

    this.realImage.display();
  }
}

// Usage
const image1: IImage = new ImageProxy("sample.jpg");
image1.display();
