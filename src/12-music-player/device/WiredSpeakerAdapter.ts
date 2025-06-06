import { Song } from "../models/Song";
import { IAudioOutputDevice } from "./IAudioOutputDevice";
import { WiredSpeakerAPI } from "../external/WiredSpeakerAPI";

export class WiredSpeakerAdapter implements IAudioOutputDevice {
  private wiredApi: WiredSpeakerAPI;

  constructor(api: WiredSpeakerAPI) {
    this.wiredApi = api;
  }

  playAudio(song: Song): void {
    const payload = `${song.getTitle()} by ${song.getArtist()}`;
    this.wiredApi.playSoundViaCable(payload);
  }
}
