import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";
import { PlayStrategy } from "./PlayStrategy";

export class SequentialPlayStrategy extends PlayStrategy {
  private currentPlaylist: Playlist | null = null;
  private currentIndex: number = -1;

  public setPlaylist(playlist: Playlist): void {
    this.currentPlaylist = playlist;
    this.currentIndex = -1;
  }

  public hasNext(): boolean {
    if (!this.currentPlaylist) return false;
    return this.currentIndex + 1 < this.currentPlaylist.getSize();
  }

  public next(): Song {
    if (!this.currentPlaylist || this.currentPlaylist.getSize() === 0) {
      throw new Error("No playlist loaded or playlist is empty.");
    }
    this.currentIndex++;
    const songs = this.currentPlaylist.getSongs();
    if (this.currentIndex >= songs.length) {
      throw new Error("Reached end of playlist.");
    }
    return songs[this.currentIndex];
  }

  public hasPrevious(): boolean {
    return this.currentIndex - 1 >= 0;
  }

  public previous(): Song {
    if (!this.currentPlaylist || this.currentPlaylist.getSize() === 0) {
      throw new Error("No playlist loaded or playlist is empty.");
    }
    this.currentIndex--;
    if (this.currentIndex < 0) {
      throw new Error("Reached beginning of playlist.");
    }
    return this.currentPlaylist.getSongs()[this.currentIndex];
  }
}
