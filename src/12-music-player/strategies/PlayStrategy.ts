import { Song } from "../models/Song";
import { Playlist } from "../models/Playlist";

export abstract class PlayStrategy {
  abstract setPlaylist(playlist: Playlist): void;
  abstract next(): Song;
  abstract hasNext(): boolean;
  abstract previous(): Song;
  abstract hasPrevious(): boolean;

  // Concrete default implementation (not abstract)
  public addToNext(song: Song): void {
    // default empty implementation, subclasses can override
  }
}
