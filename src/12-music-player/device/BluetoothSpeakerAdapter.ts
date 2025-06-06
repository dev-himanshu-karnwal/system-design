import { Song } from "../models/Song";
import { IAudioOutputDevice } from "./IAudioOutputDevice";
import { BluetoothSpeakerAPI } from "../external/BluetoothSpeakerAPI";

export class BluetoothSpeakerAdapter implements IAudioOutputDevice {
  private bluetoothApi: BluetoothSpeakerAPI;

  constructor(api: BluetoothSpeakerAPI) {
    this.bluetoothApi = api;
  }

  playAudio(song: Song): void {
    const payload = `${song.getTitle()} by ${song.getArtist()}`;
    this.bluetoothApi.playSoundViaBluetooth(payload);
  }
}
