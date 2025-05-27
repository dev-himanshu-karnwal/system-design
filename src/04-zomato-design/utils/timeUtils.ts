export class TimeUtils {
  static getCurrentTime(): string {
    const now = new Date();
    return now.toString();
  }
}
