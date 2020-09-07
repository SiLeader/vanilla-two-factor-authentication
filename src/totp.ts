import Hotp from "./hotp";

export default class Totp {
  private hotp: Hotp;

  constructor(private secretKey: Uint8Array) {
    this.hotp = new Hotp(secretKey);
  }

  public generateSpecifiedTimePoint(unixTime: number, period: number, digit: number): string {
    const t = unixTime / period;

    return this.hotp.generate(t, digit);
  }

  public generate(period: number, digit: number): string {
    const epochMilliSeconds = Date.parse(new Date().toUTCString());
    const epochSeconds = epochMilliSeconds / 1000;

    return this.generateSpecifiedTimePoint(epochSeconds, period, digit);
  }

  public generateDefault(): string {
    return this.generate(30, 6);
  }
}
