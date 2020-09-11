import Hotp from "./hotp";

export default class Totp {
  private hotp: Hotp;

  constructor(private secretKey: Uint8Array) {
    this.hotp = new Hotp(secretKey);
  }

  private static nowEpochSeconds(): number {
    const epochMilliSeconds = Date.parse(new Date().toUTCString());
    return Math.floor(epochMilliSeconds / 1000);
  }

  public generateSpecifiedTimePoint(unixTime: number, period: number, digit: number): string {
    const t = Math.floor(unixTime / period);
    return this.hotp.generate(t, digit);
  }

  public generate(period: number, digit: number): string {
    const epochSeconds = Totp.nowEpochSeconds()
    return this.generateSpecifiedTimePoint(epochSeconds, period, digit);
  }

  public generateDefault(): string {
    return this.generate(30, 6);
  }
}
