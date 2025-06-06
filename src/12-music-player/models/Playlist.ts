import { Song } from "./Song";

export class Playlist {
  private playlistName: string;
  private songList: Song[] = [];

  constructor(name: string) {
    this.playlistName = name;
  }

  public getPlaylistName(): string {
    return this.playlistName;
  }

  public getSongs(): readonly Song[] {
    return this.songList;
  }

  public getSize(): number {
    return this.songList.length;
  }

  public addSongToPlaylist(song: Song): void {
    if (!song) {
      throw new Error("Cannot add null or undefined song to playlist.");
    }
    this.songList.push(song);
  }
}
