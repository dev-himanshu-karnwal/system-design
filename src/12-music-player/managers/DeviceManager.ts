import { IAudioOutputDevice } from "../device/IAudioOutputDevice";
import { DeviceType } from "../enums/DeviceType";
import { DeviceFactory } from "../factories/DeviceFactory";

export class DeviceManager {
  private static instance: DeviceManager | null = null;
  private currentOutputDevice: IAudioOutputDevice | null = null;

  private constructor() {}

  public static getInstance(): DeviceManager {
    if (DeviceManager.instance === null) {
      DeviceManager.instance = new DeviceManager();
    }
    return DeviceManager.instance;
  }

  public connect(deviceType: DeviceType): void {
    // TypeScript has garbage collection, so no manual `delete` is needed
    this.currentOutputDevice = DeviceFactory.createDevice(deviceType);

    switch (deviceType) {
      case DeviceType.BLUETOOTH:
        console.log("Bluetooth device connected");
        break;
      case DeviceType.WIRED:
        console.log("Wired device connected");
        break;
      case DeviceType.HEADPHONES:
        console.log("Headphones connected");
        break;
    }
  }

  public getOutputDevice(): IAudioOutputDevice {
    if (!this.currentOutputDevice) {
      throw new Error("No output device is connected.");
    }
    return this.currentOutputDevice;
  }

  public hasOutputDevice(): boolean {
    return this.currentOutputDevice !== null;
  }
}
