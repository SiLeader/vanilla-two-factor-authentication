export default class OtpAuth {
  constructor(private secretKey: Uint8Array) {
  }

  private static arraySlice(array: Uint8Array, number: number) {
    const length = Math.ceil(array.length / number);
    return new Array(length).fill(undefined).map((_, i) =>
      array.slice(i * number, (i + 1) * number)
    );
  }

  private static base32Encode(data: Uint8Array): string {
    const values = this.arraySlice(data, 5);
    console.log(values);
    return "";
  }

  public generate(issuer: string, account: string) {
    const b32 = OtpAuth.base32Encode(this.secretKey);
    return `otpauth://totp/${issuer}:${account}?issuer=${issuer}&secret=${b32}`;
  }
}
