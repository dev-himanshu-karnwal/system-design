import { Song } from "./models/Song";
import { PlaylistManager } from "./managers/PlaylistManager";
import { MusicPlayerFacade } from "./MusicPlayerFacade";
import { DeviceType } from "./enums/DeviceType";
import { PlayStrategyType } from "./enums/PlayStrategyType";

export class MusicPlayerApplication {
  private static instance: MusicPlayerApplication | null = null;
  private readonly songLibrary: Song[] = [];

  private constructor() {}

  public static getInstance(): MusicPlayerApplication {
    if (!MusicPlayerApplication.instance) {
      MusicPlayerApplication.instance = new MusicPlayerApplication();
    }
    return MusicPlayerApplication.instance;
  }

  public createSongInLibrary(
    title: string,
    artist: string,
    path: string
  ): void {
    const newSong = new Song(title, artist, path);
    this.songLibrary.push(newSong);
  }

  public findSongByTitle(title: string): Song | null {
    return this.songLibrary.find((s) => s.getTitle() === title) || null;
  }

  public createPlaylist(playlistName: string): void {
    PlaylistManager.getInstance().createPlaylist(playlistName);
  }

  public addSongToPlaylist(playlistName: string, songTitle: string): void {
    const song = this.findSongByTitle(songTitle);
    if (!song) {
      throw new Error(`Song "${songTitle}" not found in library.`);
    }
    PlaylistManager.getInstance().addSongToPlaylist(playlistName, song);
  }

  public connectAudioDevice(deviceType: DeviceType): void {
    MusicPlayerFacade.getInstance().connectDevice(deviceType);
  }

  public selectPlayStrategy(strategyType: PlayStrategyType): void {
    MusicPlayerFacade.getInstance().setPlayStrategy(strategyType);
  }

  public loadPlaylist(playlistName: string): void {
    MusicPlayerFacade.getInstance().loadPlaylist(playlistName);
  }

  public playSingleSong(songTitle: string): void {
    const song = this.findSongByTitle(songTitle);
    if (!song) {
      throw new Error(`Song "${songTitle}" not found.`);
    }
    MusicPlayerFacade.getInstance().playSong(song);
  }

  public pauseCurrentSong(songTitle: string): void {
    const song = this.findSongByTitle(songTitle);
    if (!song) {
      throw new Error(`Song "${songTitle}" not found.`);
    }
    MusicPlayerFacade.getInstance().pauseSong(song);
  }

  public playAllTracksInPlaylist(): void {
    MusicPlayerFacade.getInstance().playAllTracks();
  }

  public playPreviousTrackInPlaylist(): void {
    MusicPlayerFacade.getInstance().playPreviousTrack();
  }

  public queueSongNext(songTitle: string): void {
    const song = this.findSongByTitle(songTitle);
    if (!song) {
      throw new Error(`Song "${songTitle}" not found.`);
    }
    MusicPlayerFacade.getInstance().enqueueNext(song);
  }
}
