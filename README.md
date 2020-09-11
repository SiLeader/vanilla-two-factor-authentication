# VTFA: Vanilla Two Factor Authentication

&copy; 2020 SiLeader and Cerussite.

## features
+ HOTP (n-digits)
+ TOTP (n-digits (default: 6 digits))
+ secure random number generation

## license
Apache 2.0

see LICENSE

## example
```ts
import {generateSecureRandom} from "./security";
import Totp from "./totp";
import Hotp from "./hotp";
import OtpAuth from "./otpauth";

const key = generateSecureRandom(1024);
new Totp(key).generateDefault();
new Hotp(key).generate(6, 0);

new OtpAuth(key).generateTotp('issuer', 'user@example.com'); // otpauth://totp/...
```
