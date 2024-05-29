import * as bcrypt from "bcrypt";

const saltRounds = process.env.BCRYPT_SALTROUNDS || 10;

export function hashPassword(password: string) {
  let hashed;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    hashed = hash;
  });
  return hashed;
}
