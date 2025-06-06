import { AudioEngine } from "./core/AudioEngine";
import { Playlist } from "./models/Playlist";
import { Song } from "./models/Song";
import { PlayStrategy } from "./strategies/PlayStrategy";
import { DeviceType } from "./enums/DeviceType";
import { PlayStrategyType } from "./enums/PlayStrategyType";
import { DeviceManager } from "./managers/DeviceManager";
import { PlaylistManager } from "./managers/PlaylistManager";
import { StrategyManager } from "./managers/StrategyManager";
import { IAudioOutputDevice } from "./device/IAudioOutputDevice";

export class MusicPlayerFacade {
  private static instance: MusicPlayerFacade | null = null;

  private audioEngine: AudioEngine;
  private loadedPlaylist: Playlist | null = null;
  private playStrategy: PlayStrategy | null = null;

  private constructor() {
    this.audioEngine = new AudioEngine();
  }

  public static getInstance(): MusicPlayerFacade {
    if (!MusicPlayerFacade.instance) {
      MusicPlayerFacade.instance = new MusicPlayerFacade();
    }
    return MusicPlayerFacade.instance;
  }

  public connectDevice(deviceType: DeviceType): void {
    DeviceManager.getInstance().connect(deviceType);
  }

  public setPlayStrategy(strategyType: PlayStrategyType): void {
    this.playStrategy = StrategyManager.getInstance().getStrategy(strategyType);
  }

  public loadPlaylist(name: string): void {
    this.loadedPlaylist = PlaylistManager.getInstance().getPlaylist(name);
    if (!this.playStrategy) {
      throw new Error("Play strategy not set before loading.");
    }
    this.playStrategy.setPlaylist(this.loadedPlaylist);
  }

  public playSong(song: Song): void {
    if (!DeviceManager.getInstance().hasOutputDevice()) {
      throw new Error("No audio device connected.");
    }
    const device: IAudioOutputDevice =
      DeviceManager.getInstance().getOutputDevice();
    this.audioEngine.play(device, song);
  }

  public pauseSong(song: Song): void {
    if (this.audioEngine.getCurrentSongTitle() !== song.getTitle()) {
      throw new Error(
        `Cannot pause "${song.getTitle()}"; not currently playing.`
      );
    }
    this.audioEngine.pause();
  }

  public playAllTracks(): void {
    if (!this.loadedPlaylist) {
      throw new Error("No playlist loaded.");
    }
    if (!this.playStrategy) {
      throw new Error("Play strategy not set.");
    }

    while (this.playStrategy.hasNext()) {
      const nextSong = this.playStrategy.next();
      const device = DeviceManager.getInstance().getOutputDevice();
      this.audioEngine.play(device, nextSong);
    }

    console.log(`Completed playlist: ${this.loadedPlaylist.getPlaylistName()}`);
  }

  public playNextTrack(): void {
    if (!this.loadedPlaylist) {
      throw new Error("No playlist loaded.");
    }
    if (!this.playStrategy) {
      throw new Error("Play strategy not set.");
    }
    if (this.playStrategy.hasNext()) {
      const nextSong = this.playStrategy.next();
      const device = DeviceManager.getInstance().getOutputDevice();
      this.audioEngine.play(device, nextSong);
    } else {
      console.log(
        `Completed playlist: ${this.loadedPlaylist.getPlaylistName()}`
      );
    }
  }

  public playPreviousTrack(): void {
    if (!this.loadedPlaylist) {
      throw new Error("No playlist loaded.");
    }
    if (!this.playStrategy) {
      throw new Error("Play strategy not set.");
    }
    if (this.playStrategy.hasPrevious()) {
      const prevSong = this.playStrategy.previous();
      const device = DeviceManager.getInstance().getOutputDevice();
      this.audioEngine.play(device, prevSong);
    } else {
      console.log(
        `Completed playlist: ${this.loadedPlaylist.getPlaylistName()}`
      );
    }
  }

  public enqueueNext(song: Song): void {
    if (!this.playStrategy) {
      throw new Error("Play strategy not set.");
    }

    this.playStrategy.addToNext(song);
  }
}
