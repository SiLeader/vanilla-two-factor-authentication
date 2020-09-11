import crypto from 'crypto';
import RuntimeError = WebAssembly.RuntimeError;

export default class Hotp {
  constructor(private secretKey: Uint8Array) {
  }

  private static padded16Str(num: number): string {
    const numStr = num.toString(16);
    return this.padding64String(numStr);
  }

  private static padding64String(str: string): string {
    return ('0000000000000000' + str).slice(-16);
  }

  private static padded16StrToUint8Array(padded16: string): Uint8Array {
    const sa = padded16.match(/[\da-fA-F]{2}/g);
    if(sa == null) {
      throw new RuntimeError();
    }
    const ia = sa.map(v => parseInt(v, 16));
    return new Uint8Array(ia);
  }

  private static numberToUint8Array(num: number): Uint8Array {
    const padded16 = Hotp.padded16Str(num);
    return Hotp.padded16StrToUint8Array(padded16);
  }

  private hmacSha1(counter: number): Uint8Array {
    const hmac = crypto.createHmac('sha1', this.secretKey);
    const counterBytes = Hotp.numberToUint8Array(counter);
    hmac.update(counterBytes);

    const digest = hmac.digest();
    return new Uint8Array(digest)
  }

  public generate(counter: number, digit: number): string {
    const hs1 = this.hmacSha1(counter);

    const offset = hs1[19] & 0x0f;
    const binCode = ((hs1[offset] & 0x7f) << 24) | ((hs1[offset + 1] & 0xff) << 16) | ((hs1[offset + 2] & 0xff) << 8) | (hs1[offset + 3] & 0xff);

    const d = binCode.toString();
    return d.substr(d.length - digit);
  }
}
