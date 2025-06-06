import { Song } from "../models/Song";
import { IAudioOutputDevice } from "../device/IAudioOutputDevice";

export class AudioEngine {
  private currentSong: Song | null = null;
  private songIsPaused: boolean = false;

  constructor() {}

  getCurrentSongTitle(): string {
    return this.currentSong ? this.currentSong.getTitle() : "";
  }

  isPaused(): boolean {
    return this.songIsPaused;
  }

  play(aod: IAudioOutputDevice, song: Song | null): void {
    if (!song) {
      throw new Error("Cannot play a null song.");
    }

    // Resume if same song was paused
    if (this.songIsPaused && this.currentSong === song) {
      this.songIsPaused = false;
      console.log(`Resuming song: ${song.getTitle()}`);
      aod.playAudio(song);
      return;
    }

    this.currentSong = song;
    this.songIsPaused = false;
    console.log(`Playing song: ${song.getTitle()}`);
    aod.playAudio(song);
  }

  pause(): void {
    if (!this.currentSong) {
      throw new Error("No song is currently playing to pause.");
    }
    if (this.songIsPaused) {
      throw new Error("Song is already paused.");
    }
    this.songIsPaused = true;
    console.log(`Pausing song: ${this.currentSong.getTitle()}`);
  }
}
