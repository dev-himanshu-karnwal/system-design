import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";
import { PlayStrategy } from "./PlayStrategy";

export class RandomPlayStrategy extends PlayStrategy {
  private currentPlaylist: Playlist | null = null;
  private remainingSongs: Song[] = [];
  private history: Song[] = [];

  public setPlaylist(playlist: Playlist): void {
    this.currentPlaylist = playlist;
    if (!this.currentPlaylist || this.currentPlaylist.getSize() === 0) {
      this.remainingSongs = [];
      this.history = [];
      return;
    }

    // Clone the array of songs
    this.remainingSongs = [...this.currentPlaylist.getSongs()];
    this.history = [];
  }

  public hasNext(): boolean {
    return this.currentPlaylist !== null && this.remainingSongs.length > 0;
  }

  public next(): Song {
    if (!this.currentPlaylist || this.currentPlaylist.getSize() === 0) {
      throw new Error("No playlist loaded or playlist is empty.");
    }
    if (this.remainingSongs.length === 0) {
      throw new Error("No songs left to play");
    }

    const idx = Math.floor(Math.random() * this.remainingSongs.length);
    const selectedSong = this.remainingSongs[idx];

    // Remove selectedSong using swap & pop pattern
    this.remainingSongs[idx] =
      this.remainingSongs[this.remainingSongs.length - 1];
    this.remainingSongs.pop();

    this.history.push(selectedSong);
    return selectedSong;
  }

  public hasPrevious(): boolean {
    return this.history.length > 0;
  }

  public previous(): Song {
    if (this.history.length === 0) {
      throw new Error("No previous song available.");
    }

    const song = this.history.pop()!;
    return song;
  }

  public addToNext(song: Song): void {}
}
