export default class OtpAuth {
  public static readonly TOTP = "totp";
  public static readonly HOTP = "hotp";

  private static readonly CHAR_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

  constructor(private secretKey: Uint8Array) {
  }

  private static arraySlice(array: Uint8Array, number: number) {
    const length = Math.ceil(array.length / number);
    return new Array(length).fill(undefined).map((_, i) =>
      array.slice(i * number, (i + 1) * number)
    );
  }

  private static map<U>(array: Uint8Array, f: Function): U[] {
    const list: U[] = []
    array.forEach(v => list.push(f(v)));
    return list;
  }

  private static paddingFirst(str: string, n: number, padding: string): string {
    return (padding.repeat(n) + str).slice(-n);
  }

  private static paddingLast(data: string, n: number, padding: string) {
    const remain = data.length % n;
    if(remain == 0) {
      return data;
    }
    return data + padding.repeat(n - (data.length % n));
  }

  private static base32Encode(data: Uint8Array, padding=false): string {
    const noPadded = this
      .arraySlice(data, 5)
      .map(v => this.map(v, (v: number) => this.paddingFirst(v.toString(2), 8, '0')))
      .map(v => v.join(''))
      .map(v => this.paddingLast(v, 5, '0'))
      .map(v => v.match(/[01]{5}/g))
      .map(v => v!!.map(v => parseInt(v, 2)))
      .map(v => v.map(v => this.CHAR_MAP[v]))
      .map(v => v.join(''))
      .join('');
    return padding ? this.paddingLast(noPadded, 8, '=') : noPadded;
  }

  public generate(authType: string, issuer: string, account: string): string {
    const b32 = OtpAuth.base32Encode(this.secretKey);
    return `otpauth://${authType}/${issuer}:${account}?issuer=${issuer}&secret=${b32}`;
  }

  public generateTotp(issuer: string, account: string): string {
    return this.generate(OtpAuth.TOTP, issuer, account);
  }

  public generateHotp(issuer: string, account: string): string {
    return this.generate(OtpAuth.HOTP, issuer, account);
  }
}
