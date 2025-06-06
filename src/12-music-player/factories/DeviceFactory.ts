import { IAudioOutputDevice } from "../device/IAudioOutputDevice";
import { BluetoothSpeakerAdapter } from "../device/BluetoothSpeakerAdapter";
import { WiredSpeakerAdapter } from "../device/WiredSpeakerAdapter";
import { HeadphonesAdapter } from "../device/HeadphonesAdapter";
import { BluetoothSpeakerAPI } from "../external/BluetoothSpeakerAPI";
import { WiredSpeakerAPI } from "../external/WiredSpeakerAPI";
import { HeadphonesAPI } from "../external/HeadphonesAPI";
import { DeviceType } from "../enums/DeviceType";

export class DeviceFactory {
  static createDevice(deviceType: DeviceType): IAudioOutputDevice {
    if (deviceType === DeviceType.BLUETOOTH) {
      return new BluetoothSpeakerAdapter(new BluetoothSpeakerAPI());
    } else if (deviceType === DeviceType.WIRED) {
      return new WiredSpeakerAdapter(new WiredSpeakerAPI());
    } else {
      // HEADPHONES
      return new HeadphonesAdapter(new HeadphonesAPI());
    }
  }
}
