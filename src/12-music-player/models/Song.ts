export class Song {
  private title: string;
  private artist: string;
  private filePath: string;

  constructor(title: string, artist: string, filePath: string) {
    this.title = title;
    this.artist = artist;
    this.filePath = filePath;
  }

  public getTitle(): string {
    return this.title;
  }

  public getArtist(): string {
    return this.artist;
  }

  public getFilePath(): string {
    return this.filePath;
  }
}
