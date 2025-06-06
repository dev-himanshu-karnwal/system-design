import { Song } from "../models/Song";
import { IAudioOutputDevice } from "./IAudioOutputDevice";
import { HeadphonesAPI } from "../external/HeadphonesAPI";

export class HeadphonesAdapter implements IAudioOutputDevice {
  private headphonesApi: HeadphonesAPI;

  constructor(api: HeadphonesAPI) {
    this.headphonesApi = api;
  }

  playAudio(song: Song): void {
    const payload = `${song.getTitle()} by ${song.getArtist()}`;
    this.headphonesApi.playSoundViaJack(payload);
  }
}
