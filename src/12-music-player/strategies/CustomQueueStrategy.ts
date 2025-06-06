import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";
import { PlayStrategy } from "./PlayStrategy";

export class CustomQueueStrategy extends PlayStrategy {
  private currentPlaylist: Playlist | null = null;
  private currentIndex: number = -1;
  private nextQueue: Song[] = [];
  private prevStack: Song[] = [];

  private nextSequential(): Song {
    if (!this.currentPlaylist || this.currentPlaylist.getSize() === 0) {
      throw new Error("Playlist is empty.");
    }
    this.currentIndex++;
    const songs = this.currentPlaylist.getSongs();
    if (this.currentIndex >= songs.length) {
      throw new Error("Reached end of playlist.");
    }
    return songs[this.currentIndex];
  }

  private previousSequential(): Song {
    if (!this.currentPlaylist || this.currentPlaylist.getSize() === 0) {
      throw new Error("Playlist is empty.");
    }
    this.currentIndex--;
    if (this.currentIndex < 0) {
      throw new Error("Reached beginning of playlist.");
    }
    const songs = this.currentPlaylist.getSongs();
    return songs[this.currentIndex];
  }

  public setPlaylist(playlist: Playlist): void {
    this.currentPlaylist = playlist;
    this.currentIndex = -1;
    this.nextQueue = [];
    this.prevStack = [];
  }

  public hasNext(): boolean {
    if (!this.currentPlaylist) return false;
    return (
      this.currentIndex + 1 < this.currentPlaylist.getSize() ||
      this.nextQueue.length > 0
    );
  }

  public next(): Song {
    if (!this.currentPlaylist || this.currentPlaylist.getSize() === 0) {
      throw new Error("No playlist loaded or playlist is empty.");
    }

    if (this.nextQueue.length > 0) {
      const s = this.nextQueue.shift()!;
      this.prevStack.push(s);

      // update currentIndex to match queued song
      const list = this.currentPlaylist.getSongs();
      const index = list.indexOf(s);
      if (index !== -1) {
        this.currentIndex = index;
      }

      return s;
    }

    return this.nextSequential();
  }

  public hasPrevious(): boolean {
    if (!this.currentPlaylist) return false;
    return this.currentIndex - 1 >= 0 || this.prevStack.length > 0;
  }

  public previous(): Song {
    if (!this.currentPlaylist || this.currentPlaylist.getSize() === 0) {
      throw new Error("No playlist loaded or playlist is empty.");
    }

    if (this.prevStack.length > 0) {
      const s = this.prevStack.pop()!;

      // update currentIndex to match stacked song
      const list = this.currentPlaylist.getSongs();
      const index = list.indexOf(s);
      if (index !== -1) {
        this.currentIndex = index;
      }

      return s;
    }

    return this.previousSequential();
  }

  public addToNext(song: Song): void {
    if (!song) {
      throw new Error("Cannot enqueue null song.");
    }
    this.nextQueue.push(song);
  }
}
